import * as React from 'react'
import { platformTrpc } from "../../lib/trpc";
import { DataTable, type DataTableColumn, Overlay, Button, FormField, Input, Tag } from "@atlora/ui";
import { Country } from "@atlora/types";

const COLUMNS: DataTableColumn<Country>[] = [
    {key: 'code', header: 'Code', sortable: true},
    {key: 'name', header: 'Name', sortable: true},
    {key: 'capital', header: 'Capital'},
    {key: 'region', header: 'Region'},
    {key: 'subRegion', header: 'Sub Region'}
]

interface CountryFormState {
    name: string
    flagSvg: string
    region: string
    subRegion: string
    capital: string
    capitalLat: string
    capitalLong: string
    borders: string
}

function toFormState(country: Country): CountryFormState {
    return {
        name: country.name,
        flagSvg: country.flagSvg,
        region: country.region,
        subRegion: country.subRegion,
        capital: country.capital,
        capitalLat: String(country.capitalLat),
        capitalLong: String(country.capitalLong),
        borders: country.borders.join(', '),
    }
}

function DetailField({label, value}: {label: string; value: React.ReactNode}) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="type-caption text-sand-600">{label}</span>
            <span className="type-body-sm text-charcoal">{value}</span>
        </div>
    )
}

export function CountriesPage() {
    const {data} = platformTrpc.countries.list.useQuery()
    const utils = platformTrpc.useUtils()

    const [selected, setSelected] = React.useState<Country | null>(null)
    const [mode, setMode] = React.useState<'view' | 'edit'>('view')
    const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false)
    const [form, setForm] = React.useState<CountryFormState | null>(null)

    const updateMutation = platformTrpc.countries.update.useMutation({
        onSuccess: (country) => {
            utils.countries.list.invalidate()
            if (country) setSelected(country)
            setMode('view')
        },
    })

    const deleteMutation = platformTrpc.countries.delete.useMutation({
        onSuccess: () => {
            utils.countries.list.invalidate()
            setConfirmDeleteOpen(false)
            setSelected(null)
        },
    })

    function openCountry(country: Country) {
        setSelected(country)
        setMode('view')
    }

    function startEdit() {
        if (!selected) return
        setForm(toFormState(selected))
        setMode('edit')
    }

    function updateForm<K extends keyof CountryFormState>(key: K, value: CountryFormState[K]) {
        setForm((current) => (current ? {...current, [key]: value} : current))
    }

    function handleSave() {
        if (!selected || !form) return
        updateMutation.mutate({
            code: selected.code,
            name: form.name,
            flagSvg: form.flagSvg,
            region: form.region,
            subRegion: form.subRegion,
            capital: form.capital,
            capitalLat: Number(form.capitalLat) || 0,
            capitalLong: Number(form.capitalLong) || 0,
            borders: form.borders
                .split(',')
                .map((code) => code.trim().toUpperCase())
                .filter(Boolean),
        })
    }

    return (
        <div>
            <DataTable
                columns={COLUMNS}
                rows={data ?? []}
                rowKey={(row) => row.code}
                onRowClick={openCountry}
            />

            <Overlay
                open={selected !== null && mode === 'view'}
                onClose={() => setSelected(null)}
                size="md"
                title={selected?.name}
                description={selected ? `${selected.capital} · ${selected.region}` : undefined}
                footer={
                    <>
                        <Button variant="danger" onClick={() => setConfirmDeleteOpen(true)}>
                            Delete
                        </Button>
                        <Button variant="primary" onClick={startEdit}>
                            Edit
                        </Button>
                    </>
                }
            >
                {selected && (
                    <div className="flex flex-col gap-4">
                        <img
                            src={selected.flagSvg}
                            alt={`Flag of ${selected.name}`}
                            className="h-auto w-auto rounded-xs border border-sand-200"
                        />
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <DetailField label="Code" value={selected.code} />
                            <DetailField label="Capital" value={selected.capital} />
                            <DetailField label="Region" value={selected.region} />
                            <DetailField label="Sub Region" value={selected.subRegion} />
                            <DetailField
                                label="Coordinates"
                                value={`${selected.capitalLat}, ${selected.capitalLong}`}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="type-caption text-sand-600">Borders</span>
                            {selected.borders.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                    {selected.borders.map((code) => (
                                        <Tag key={code}>{code}</Tag>
                                    ))}
                                </div>
                            ) : (
                                <span className="type-body-sm text-sand-600">No bordering countries</span>
                            )}
                        </div>
                    </div>
                )}
            </Overlay>

            <Overlay
                open={selected !== null && mode === 'edit'}
                onClose={() => setMode('view')}
                size="md"
                title={selected ? `Edit ${selected.name}` : undefined}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setMode('view')}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSave} loading={updateMutation.isPending}>
                            Save changes
                        </Button>
                    </>
                }
            >
                {form && (
                    <div className="flex flex-col gap-4">
                        <FormField label="Name" htmlFor="country-name">
                            <Input id="country-name" value={form.name} onChange={(e) => updateForm('name', e.target.value)} />
                        </FormField>
                        <FormField label="Flag URL" htmlFor="country-flag">
                            <Input id="country-flag" value={form.flagSvg} onChange={(e) => updateForm('flagSvg', e.target.value)} />
                        </FormField>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Region" htmlFor="country-region">
                                <Input id="country-region" value={form.region} onChange={(e) => updateForm('region', e.target.value)} />
                            </FormField>
                            <FormField label="Sub Region" htmlFor="country-subregion">
                                <Input id="country-subregion" value={form.subRegion} onChange={(e) => updateForm('subRegion', e.target.value)} />
                            </FormField>
                        </div>
                        <FormField label="Capital" htmlFor="country-capital">
                            <Input id="country-capital" value={form.capital} onChange={(e) => updateForm('capital', e.target.value)} />
                        </FormField>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Capital latitude" htmlFor="country-lat">
                                <Input
                                    id="country-lat"
                                    type="number"
                                    step="any"
                                    value={form.capitalLat}
                                    onChange={(e) => updateForm('capitalLat', e.target.value)}
                                />
                            </FormField>
                            <FormField label="Capital longitude" htmlFor="country-long">
                                <Input
                                    id="country-long"
                                    type="number"
                                    step="any"
                                    value={form.capitalLong}
                                    onChange={(e) => updateForm('capitalLong', e.target.value)}
                                />
                            </FormField>
                        </div>
                        <FormField label="Border countries" htmlFor="country-borders" helperText="Comma-separated country codes">
                            <Input id="country-borders" value={form.borders} onChange={(e) => updateForm('borders', e.target.value)} />
                        </FormField>
                    </div>
                )}
            </Overlay>

            <Overlay
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                size="sm"
                title="Delete country"
                description={selected ? `This will permanently remove ${selected.name} from the catalog.` : undefined}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setConfirmDeleteOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            loading={deleteMutation.isPending}
                            onClick={() => selected && deleteMutation.mutate({code: selected.code})}
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
