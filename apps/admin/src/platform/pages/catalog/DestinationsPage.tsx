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
  StatusBadge,
  MediaUpload,
  type MediaUploadValue,
} from '@atlora/ui'

// `ReturnType<typeof platformTrpc.destinations.list.useQuery>` resolves to an
// overload-ambiguous type (tRPC's `useQuery` has several signatures), which
// makes TS lose the real `data` shape. Wrapping the call in a concrete,
// non-generic function pins it to the one overload actually used here.
function useDestinationsListQuery() {
    return platformTrpc.destinations.list.useQuery()
}

type DestinationRow = NonNullable<ReturnType<typeof useDestinationsListQuery>['data']>[number]
type DestinationType = DestinationRow['type']
type DestinationStatus = DestinationRow['status']

const DESTINATION_TYPES: DestinationType[] = ['city', 'region_area', 'island', 'beach', 'national_park', 'other']

function typeLabel(type: string) {
    return type
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

const COLUMNS: DataTableColumn<DestinationRow>[] = [
    {key: 'name', header: 'Name', sortable: true},
    {key: 'type', header: 'Type', render: (row) => typeLabel(row.type)},
    {key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} />},
    {key: 'countryCode', header: 'Country', render: (row) => row.countryCode ?? '—'},
]

interface DestinationFormState {
    slug: string
    name: string
    type: DestinationType
    status: DestinationStatus
    tagline: string
    description: string
    bestTimeToVisit: string
    countryCode: string
    parentId: string
    media: MediaUploadValue | null
}

function emptyForm(): DestinationFormState {
    return {
        slug: '',
        name: '',
        type: 'city',
        status: 'DRAFT',
        tagline: '',
        description: '',
        bestTimeToVisit: '',
        countryCode: '',
        parentId: '',
        media: null,
    }
}

function toFormState(row: DestinationRow): DestinationFormState {
    const hero = row.media?.[0]
    return {
        slug: row.slug,
        name: row.name,
        type: row.type,
        status: row.status,
        tagline: row.tagline ?? '',
        description: row.description ?? '',
        bestTimeToVisit: row.bestTimeToVisit ?? '',
        countryCode: row.countryCode ?? '',
        parentId: row.parentId ?? '',
        media: hero?.media ? {mediaId: hero.mediaId, url: hero.media.url, altText: hero.media.altText} : null,
    }
}

function heroField(form: DestinationFormState) {
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

export function DestinationsPage() {
    const {data} = useDestinationsListQuery()
    const {data: countries} = platformTrpc.countries.list.useQuery()
    const utils = platformTrpc.useUtils()
    const {upload} = usePlatformMediaUpload('platform/destinations')

    const [selected, setSelected] = React.useState<DestinationRow | null>(null)
    const [formMode, setFormMode] = React.useState<'create' | 'edit' | null>(null)
    const [form, setForm] = React.useState<DestinationFormState | null>(null)
    const [slugTouched, setSlugTouched] = React.useState(false)
    const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false)

    const createMutation = platformTrpc.destinations.create.useMutation({
        onSuccess: () => {
            utils.destinations.list.invalidate()
            setFormMode(null)
        },
    })

    const updateMutation = platformTrpc.destinations.update.useMutation({
        onSuccess: (destination) => {
            utils.destinations.list.invalidate()
            if (destination) setSelected(destination)
            setFormMode(null)
        },
    })

    const deleteMutation = platformTrpc.destinations.delete.useMutation({
        onSuccess: () => {
            utils.destinations.list.invalidate()
            setConfirmDeleteOpen(false)
            setSelected(null)
        },
    })

    function updateForm<K extends keyof DestinationFormState>(key: K, value: DestinationFormState[K]) {
        setForm((current) => (current ? {...current, [key]: value} : current))
    }

    function openCreate() {
        setForm(emptyForm())
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
        if (!form) return
        const core = {
            slug: form.slug,
            name: form.name,
            type: form.type,
            status: form.status,
            tagline: form.tagline.trim() ? form.tagline : null,
            description: form.description.trim() ? form.description : null,
            bestTimeToVisit: form.bestTimeToVisit.trim() ? form.bestTimeToVisit : null,
            countryCode: form.countryCode || null,
            parentId: form.parentId || null,
        }

        if (formMode === 'create') {
            createMutation.mutate({...core, media: heroField(form)})
        } else if (formMode === 'edit' && selected) {
            updateMutation.mutate({id: selected.id, ...core, media: heroField(form)})
        }
    }

    const saving = createMutation.isPending || updateMutation.isPending
    const parentOptions = (data ?? []).filter((row) => row.id !== selected?.id)

    return (
        <div>
            <div className="mb-4 flex justify-end">
                <Button onClick={openCreate}>New Destination</Button>
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
                description={selected ? `/${selected.slug}` : undefined}
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
                            <DetailField label="Type" value={typeLabel(selected.type)} />
                            <DetailField label="Status" value={<StatusBadge status={selected.status} />} />
                            <DetailField label="Country" value={selected.countryCode ?? 'None'} />
                            <DetailField label="Best time to visit" value={selected.bestTimeToVisit ?? 'Not set'} />
                        </div>
                        <DetailField label="Tagline" value={selected.tagline ?? 'No tagline'} />
                        <DetailField label="Description" value={selected.description ?? 'No description'} />
                    </div>
                )}
            </Overlay>

            <Overlay
                open={formMode !== null}
                onClose={() => setFormMode(null)}
                size="lg"
                title={formMode === 'create' ? 'New destination' : `Edit ${selected?.name ?? ''}`}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setFormMode(null)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSave} loading={saving}>
                            {formMode === 'create' ? 'Create destination' : 'Save changes'}
                        </Button>
                    </>
                }
            >
                {form && (
                    <div className="flex flex-col gap-4">
                        <FormField label="Hero image" htmlFor="destination-media">
                            <MediaUpload value={form.media} onChange={(value) => updateForm('media', value)} onUpload={upload} />
                        </FormField>
                        <FormField label="Name" htmlFor="destination-name">
                            <Input
                                id="destination-name"
                                value={form.name}
                                onChange={(e) => {
                                    updateForm('name', e.target.value)
                                    if (!slugTouched) updateForm('slug', slugify(e.target.value))
                                }}
                            />
                        </FormField>
                        <FormField label="Slug" htmlFor="destination-slug">
                            <Input
                                id="destination-slug"
                                value={form.slug}
                                onChange={(e) => {
                                    setSlugTouched(true)
                                    updateForm('slug', e.target.value)
                                }}
                            />
                        </FormField>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Type" htmlFor="destination-type">
                                <Select
                                    id="destination-type"
                                    value={form.type}
                                    onChange={(e) => updateForm('type', e.target.value as DestinationType)}
                                >
                                    {DESTINATION_TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {typeLabel(type)}
                                        </option>
                                    ))}
                                </Select>
                            </FormField>
                            <FormField label="Status" htmlFor="destination-status">
                                <Select
                                    id="destination-status"
                                    value={form.status}
                                    onChange={(e) => updateForm('status', e.target.value as DestinationStatus)}
                                >
                                    <option value="DRAFT">Draft</option>
                                    <option value="PUBLISHED">Published</option>
                                </Select>
                            </FormField>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Country" htmlFor="destination-country">
                                <Select
                                    id="destination-country"
                                    value={form.countryCode}
                                    onChange={(e) => updateForm('countryCode', e.target.value)}
                                >
                                    <option value="">None</option>
                                    {(countries ?? []).map((country) => (
                                        <option key={country.code} value={country.code}>
                                            {country.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormField>
                            <FormField label="Parent destination" htmlFor="destination-parent">
                                <Select
                                    id="destination-parent"
                                    value={form.parentId}
                                    onChange={(e) => updateForm('parentId', e.target.value)}
                                >
                                    <option value="">None</option>
                                    {parentOptions.map((destination) => (
                                        <option key={destination.id} value={destination.id}>
                                            {destination.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormField>
                        </div>
                        <FormField label="Tagline" htmlFor="destination-tagline">
                            <Input
                                id="destination-tagline"
                                value={form.tagline}
                                onChange={(e) => updateForm('tagline', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Best time to visit" htmlFor="destination-best-time">
                            <Input
                                id="destination-best-time"
                                value={form.bestTimeToVisit}
                                onChange={(e) => updateForm('bestTimeToVisit', e.target.value)}
                            />
                        </FormField>
                        <FormField label="Description" htmlFor="destination-description">
                            <Textarea
                                id="destination-description"
                                value={form.description}
                                onChange={(e) => updateForm('description', e.target.value)}
                            />
                        </FormField>
                    </div>
                )}
            </Overlay>

            <Overlay
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                size="sm"
                title="Delete destination"
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
