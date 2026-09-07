import * as React from 'react'
import { platformTrpc } from '../../lib/trpc'
import { usePlatformMediaUpload } from '../../lib/upload'
import { slugify } from '../../lib/slug'
import {
  DataTable,
  type DataTableColumn,
  Overlay,
  Button,
  FormField,
  Input,
  Textarea,
  Select,
  MediaUpload,
  type MediaUploadValue,
} from '@atlora/ui'

// `ReturnType<typeof platformTrpc.poi.list.useQuery>` resolves to an
// overload-ambiguous type (tRPC's `useQuery` has several signatures), which
// makes TS lose the real `data` shape. Wrapping the call in a concrete,
// non-generic function pins it to the one overload actually used here.
function usePoiListQuery() {
    return platformTrpc.poi.list.useQuery()
}

function useDestinationsListQuery() {
    return platformTrpc.destinations.list.useQuery()
}

type PoiRow = NonNullable<ReturnType<typeof usePoiListQuery>['data']>[number]
type PoiType = PoiRow['type']
type DestinationOption = NonNullable<ReturnType<typeof useDestinationsListQuery>['data']>[number]

const POI_TYPES: PoiType[] = ['hotel', 'attraction', 'restaurant', 'aiport', 'transport_hub', 'neighborhood']

function typeLabel(type: string) {
    return type
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

function destinationName(destinations: DestinationOption[] | undefined, destinationId: string) {
    return destinations?.find((destination) => destination.id === destinationId)?.name ?? destinationId
}

interface PoiFormState {
    slug: string
    name: string
    type: PoiType
    destinationId: string
    lat: string
    lng: string
    address: string
    summary: string
    website: string
    media: MediaUploadValue | null
}

function emptyForm(defaultDestinationId: string): PoiFormState {
    return {
        slug: '',
        name: '',
        type: 'hotel',
        destinationId: defaultDestinationId,
        lat: '',
        lng: '',
        address: '',
        summary: '',
        website: '',
        media: null,
    }
}

function toFormState(row: PoiRow): PoiFormState {
    const hero = row.media?.[0]
    return {
        slug: row.slug,
        name: row.name,
        type: row.type,
        destinationId: row.destinationId,
        lat: row.lat === null ? '' : String(row.lat),
        lng: row.lng === null ? '' : String(row.lng),
        address: row.address ?? '',
        summary: row.summary ?? '',
        website: row.website ?? '',
        media: hero?.media ? {mediaId: hero.mediaId, url: hero.media.url, altText: hero.media.altText} : null,
    }
}

function heroField(form: PoiFormState) {
    return form.media ? [{mediaId: form.media.mediaId, role: 'hero' as const, sortOrder: 0}] : []
}

function DetailField({label, value}: {label: string; value: React.ReactNode}) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="type-caption text-sand-600">{label}</span>
            <span className="type-body-sm text-charcoal">{value}</span>
        </div>
    )
}

export function PoiPage() {
    const {data} = usePoiListQuery()
    const {data: destinations} = useDestinationsListQuery()
    const utils = platformTrpc.useUtils()
    const {upload} = usePlatformMediaUpload('platform/poi')

    const [selected, setSelected] = React.useState<PoiRow | null>(null)
    const [formMode, setFormMode] = React.useState<'create' | 'edit' | null>(null)
    const [form, setForm] = React.useState<PoiFormState | null>(null)
    const [slugTouched, setSlugTouched] = React.useState(false)
    const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false)

    const COLUMNS: DataTableColumn<PoiRow>[] = [
        {key: 'name', header: 'Name', sortable: true},
        {key: 'type', header: 'Type', render: (row) => typeLabel(row.type)},
        {key: 'destinationId', header: 'Destination', render: (row) => destinationName(destinations, row.destinationId)},
        {key: 'address', header: 'Address', render: (row) => row.address ?? '—'},
    ]

    const createMutation = platformTrpc.poi.create.useMutation({
        onSuccess: () => {
            utils.poi.list.invalidate()
            setFormMode(null)
        },
    })

    const updateMutation = platformTrpc.poi.update.useMutation({
        onSuccess: (created) => {
            utils.poi.list.invalidate()
            if (created) setSelected(created)
            setFormMode(null)
        },
    })

    const deleteMutation = platformTrpc.poi.delete.useMutation({
        onSuccess: () => {
            utils.poi.list.invalidate()
            setConfirmDeleteOpen(false)
            setSelected(null)
        },
    })

    function updateForm<K extends keyof PoiFormState>(key: K, value: PoiFormState[K]) {
        setForm((current) => (current ? {...current, [key]: value} : current))
    }

    function openCreate() {
        setForm(emptyForm(destinations?.[0]?.id ?? ''))
        setSlugTouched(false)
        setFormMode('create')
    }

    function openEdit() {
        if (!selected) return
        setForm(toFormState(selected))
        setSlugTouched(true)
        setFormMode('edit')
    }

    function handleSave() {
        if (!form || !form.destinationId) return
        const core = {
            slug: form.slug,
            name: form.name,
            type: form.type,
            destinationId: form.destinationId,
            lat: form.lat.trim() === '' ? null : Number(form.lat),
            lng: form.lng.trim() === '' ? null : Number(form.lng),
            address: form.address.trim() ? form.address : null,
            summary: form.summary.trim() ? form.summary : null,
            website: form.website.trim() ? form.website : null,
        }

        if (formMode === 'create') {
            createMutation.mutate({...core, media: heroField(form)})
        } else if (formMode === 'edit' && selected) {
            updateMutation.mutate({id: selected.id, ...core, media: heroField(form)})
        }
    }

    const saving = createMutation.isPending || updateMutation.isPending

    return (
        <div>
            <div className="mb-4 flex justify-end">
                <Button onClick={openCreate} disabled={!destinations || destinations.length === 0}>
                    New Point of Interest
                </Button>
            </div>

            <DataTable
                columns={COLUMNS}
                rows={data ?? []}
                rowKey={(row) => row.id}
                onRowClick={setSelected}
            />

            <Overlay
                open={selected !== null && formMode === null}
                onClose={() => setSelected(null)}
                size="md"
                title={selected?.name}
                description={selected ? typeLabel(selected.type) : undefined}
                footer={
                    <>
                        <Button variant="danger" onClick={() => setConfirmDeleteOpen(true)}>
                            Delete
                        </Button>
                        <Button variant="primary" onClick={openEdit}>
                            Edit
                        </Button>
                    </>
                }
            >
                {selected && (
                    <div className="flex flex-col gap-4">
                        {selected.media?.[0]?.media && (
                            <img
                                src={selected.media[0].media.url}
                                alt={selected.media[0].media.altText ?? ''}
                                className="h-40 w-full rounded-md border border-sand-200 object-cover"
                            />
                        )}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <DetailField label="Destination" value={destinationName(destinations, selected.destinationId)} />
                            <DetailField label="Address" value={selected.address ?? 'Not set'} />
                            <DetailField
                                label="Coordinates"
                                value={selected.lat !== null && selected.lng !== null ? `${selected.lat}, ${selected.lng}` : 'Not set'}
                            />
                            <DetailField label="Website" value={selected.website ?? 'Not set'} />
                        </div>
                        <DetailField label="Summary" value={selected.summary ?? 'No summary'} />
                    </div>
                )}
            </Overlay>

            <Overlay
                open={formMode !== null}
                onClose={() => setFormMode(null)}
                size="lg"
                title={formMode === 'create' ? 'New point of interest' : `Edit ${selected?.name ?? ''}`}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setFormMode(null)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSave} loading={saving}>
                            {formMode === 'create' ? 'Create POI' : 'Save changes'}
                        </Button>
                    </>
                }
            >
                {form && (
                    <div className="flex flex-col gap-4">
                        <FormField label="Hero image" htmlFor="poi-media">
                            <MediaUpload value={form.media} onChange={(value) => updateForm('media', value)} onUpload={upload} />
                        </FormField>
                        <FormField label="Name" htmlFor="poi-name">
                            <Input
                                id="poi-name"
                                value={form.name}
                                onChange={(e) => {
                                    updateForm('name', e.target.value)
                                    if (!slugTouched) updateForm('slug', slugify(e.target.value))
                                }}
                            />
                        </FormField>
                        <FormField label="Slug" htmlFor="poi-slug">
                            <Input
                                id="poi-slug"
                                value={form.slug}
                                onChange={(e) => {
                                    setSlugTouched(true)
                                    updateForm('slug', e.target.value)
                                }}
                            />
                        </FormField>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Type" htmlFor="poi-type">
                                <Select id="poi-type" value={form.type} onChange={(e) => updateForm('type', e.target.value as PoiType)}>
                                    {POI_TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {typeLabel(type)}
                                        </option>
                                    ))}
                                </Select>
                            </FormField>
                            <FormField label="Destination" htmlFor="poi-destination">
                                <Select
                                    id="poi-destination"
                                    value={form.destinationId}
                                    onChange={(e) => updateForm('destinationId', e.target.value)}
                                >
                                    {(destinations ?? []).map((destination) => (
                                        <option key={destination.id} value={destination.id}>
                                            {destination.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormField>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Latitude" htmlFor="poi-lat">
                                <Input id="poi-lat" type="number" step="any" value={form.lat} onChange={(e) => updateForm('lat', e.target.value)} />
                            </FormField>
                            <FormField label="Longitude" htmlFor="poi-lng">
                                <Input id="poi-lng" type="number" step="any" value={form.lng} onChange={(e) => updateForm('lng', e.target.value)} />
                            </FormField>
                        </div>
                        <FormField label="Address" htmlFor="poi-address">
                            <Input id="poi-address" value={form.address} onChange={(e) => updateForm('address', e.target.value)} />
                        </FormField>
                        <FormField label="Website" htmlFor="poi-website">
                            <Input id="poi-website" value={form.website} onChange={(e) => updateForm('website', e.target.value)} />
                        </FormField>
                        <FormField label="Summary" htmlFor="poi-summary">
                            <Textarea id="poi-summary" value={form.summary} onChange={(e) => updateForm('summary', e.target.value)} />
                        </FormField>
                    </div>
                )}
            </Overlay>

            <Overlay
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                size="sm"
                title="Delete point of interest"
                description={selected ? `This will permanently remove ${selected.name} from the catalog.` : undefined}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setConfirmDeleteOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            loading={deleteMutation.isPending}
                            onClick={() => selected && deleteMutation.mutate({id: selected.id})}
                        >
                            Delete
                        </Button>
                    </>
                }
            >
                <p className="type-body-sm text-sand-700">This action cannot be undone.</p>
            </Overlay>
        </div>
    )
}
