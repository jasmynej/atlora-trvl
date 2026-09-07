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

// `ReturnType<typeof platformTrpc.regions.list.useQuery>` resolves to an
// overload-ambiguous type (tRPC's `useQuery` has several signatures), which
// makes TS lose the real `data` shape. Wrapping the call in a concrete,
// non-generic function pins it to the one overload actually used here.
function useRegionsListQuery() {
    return platformTrpc.regions.list.useQuery()
}

type RegionRow = NonNullable<ReturnType<typeof useRegionsListQuery>['data']>[number]

const COLUMNS: DataTableColumn<RegionRow>[] = [
    {key: 'name', header: 'Name', sortable: true},
    {key: 'slug', header: 'Slug'},
    {key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} />},
    {key: 'description', header: 'Description', render: (row) => row.description ?? '—'},
]

interface RegionFormState {
    slug: string
    name: string
    description: string
    status: 'DRAFT' | 'PUBLISHED'
    media: MediaUploadValue | null
}

function emptyForm(): RegionFormState {
    return {slug: '', name: '', description: '', status: 'DRAFT', media: null}
}

function toFormState(row: RegionRow): RegionFormState {
    const hero = row.media?.[0]
    return {
        slug: row.slug,
        name: row.name,
        description: row.description ?? '',
        status: row.status,
        media: hero?.media ? {mediaId: hero.mediaId, url: hero.media.url, altText: hero.media.altText} : null,
    }
}

function heroField(form: RegionFormState) {
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

export function RegionsPage() {
    const {data} = useRegionsListQuery()
    const utils = platformTrpc.useUtils()
    const {upload} = usePlatformMediaUpload('platform/regions')

    const [selected, setSelected] = React.useState<RegionRow | null>(null)
    const [formMode, setFormMode] = React.useState<'create' | 'edit' | null>(null)
    const [form, setForm] = React.useState<RegionFormState | null>(null)
    const [slugTouched, setSlugTouched] = React.useState(false)
    const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false)

    const createMutation = platformTrpc.regions.create.useMutation({
        onSuccess: () => {
            utils.regions.list.invalidate()
            setFormMode(null)
        },
    })

    const updateMutation = platformTrpc.regions.update.useMutation({
        onSuccess: (region) => {
            utils.regions.list.invalidate()
            if (region) setSelected(region)
            setFormMode(null)
        },
    })

    const deleteMutation = platformTrpc.regions.delete.useMutation({
        onSuccess: () => {
            utils.regions.list.invalidate()
            setConfirmDeleteOpen(false)
            setSelected(null)
        },
    })

    function updateForm<K extends keyof RegionFormState>(key: K, value: RegionFormState[K]) {
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
            description: form.description.trim() ? form.description : null,
            status: form.status,
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
                <Button onClick={openCreate}>New Region</Button>
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
                            <DetailField label="Status" value={<StatusBadge status={selected.status} />} />
                            <DetailField label="Slug" value={selected.slug} />
                        </div>
                        <DetailField label="Description" value={selected.description ?? 'No description'} />
                    </div>
                )}
            </Overlay>

            <Overlay
                open={formMode !== null}
                onClose={() => setFormMode(null)}
                size="md"
                title={formMode === 'create' ? 'New region' : `Edit ${selected?.name ?? ''}`}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setFormMode(null)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSave} loading={saving}>
                            {formMode === 'create' ? 'Create region' : 'Save changes'}
                        </Button>
                    </>
                }
            >
                {form && (
                    <div className="flex flex-col gap-4">
                        <FormField label="Hero image" htmlFor="region-media">
                            <MediaUpload value={form.media} onChange={(value) => updateForm('media', value)} onUpload={upload} />
                        </FormField>
                        <FormField label="Name" htmlFor="region-name">
                            <Input
                                id="region-name"
                                value={form.name}
                                onChange={(e) => {
                                    updateForm('name', e.target.value)
                                    if (!slugTouched) updateForm('slug', slugify(e.target.value))
                                }}
                            />
                        </FormField>
                        <FormField label="Slug" htmlFor="region-slug">
                            <Input
                                id="region-slug"
                                value={form.slug}
                                onChange={(e) => {
                                    setSlugTouched(true)
                                    updateForm('slug', e.target.value)
                                }}
                            />
                        </FormField>
                        <FormField label="Status" htmlFor="region-status">
                            <Select
                                id="region-status"
                                value={form.status}
                                onChange={(e) => updateForm('status', e.target.value as RegionFormState['status'])}
                            >
                                <option value="DRAFT">Draft</option>
                                <option value="PUBLISHED">Published</option>
                            </Select>
                        </FormField>
                        <FormField label="Description" htmlFor="region-description">
                            <Textarea
                                id="region-description"
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
                title="Delete region"
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
