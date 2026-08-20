import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { DataTable, type DataTableColumn } from '../../components/DataTable'
import { StatusBadge } from '../../components/StatusBadge'
import { EmptyState } from '../../components/EmptyState'
import { Button } from '../../components/Button'

interface DestinationRow {
  id: string
  name: string
  type: string
  status: string
  updatedAt: string
}

const ROWS: DestinationRow[] = [
  { id: '1', name: 'Bali',       type: 'Island',         status: 'PUBLISHED', updatedAt: '2026-08-01' },
  { id: '2', name: 'Kyoto',      type: 'City',           status: 'PUBLISHED', updatedAt: '2026-07-28' },
  { id: '3', name: 'Patagonia',  type: 'Region',         status: 'DRAFT',     updatedAt: '2026-08-10' },
  { id: '4', name: 'Negril',     type: 'Beach',          status: 'PUBLISHED', updatedAt: '2026-06-15' },
  { id: '5', name: 'Banff',      type: 'National Park',  status: 'ARCHIVED',  updatedAt: '2026-05-02' },
]

const COLUMNS: DataTableColumn<DestinationRow>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'type', header: 'Type' },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} size="sm" /> },
  { key: 'updatedAt', header: 'Updated', sortable: true },
]

function ControlledDataTable(props: { selectable?: boolean; loading?: boolean; rows?: DestinationRow[]; onRowClick?: (row: DestinationRow) => void }) {
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([])
  const [sortKey, setSortKey] = React.useState<string | undefined>('name')
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc' | undefined>('asc')

  const rows = props.rows ?? ROWS
  const sortedRows = React.useMemo(() => {
    if (!sortKey) return rows
    const copy = [...rows]
    copy.sort((a, b) => {
      const aVal = String(a[sortKey as keyof DestinationRow])
      const bVal = String(b[sortKey as keyof DestinationRow])
      return sortDirection === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal)
    })
    return copy
  }, [rows, sortKey, sortDirection])

  return (
    <DataTable
      columns={COLUMNS}
      rows={sortedRows}
      rowKey={(row) => row.id}
      loading={props.loading}
      selectable={props.selectable}
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      sortKey={sortKey}
      sortDirection={sortDirection}
      onSortChange={(key, direction) => {
        setSortKey(key)
        setSortDirection(direction)
      }}
      onRowClick={props.onRowClick}
    />
  )
}

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: { layout: 'padded' },
  render: () => <ControlledDataTable selectable />,
}
export default meta

type Story = StoryObj<typeof DataTable>

// ── Interactive ───────────────────────────────────────────────────────────────

export const Default: Story = {}

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="type-caption">Loading — skeleton rows, layout stays stable</span>
        <ControlledDataTable loading />
      </div>
      <div className="flex flex-col gap-2">
        <span className="type-caption">Empty — default EmptyState fallback</span>
        <ControlledDataTable rows={[]} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="type-caption">Selectable — click header checkbox to select all</span>
        <ControlledDataTable selectable />
      </div>
      <div className="flex flex-col gap-2">
        <span className="type-caption">Sortable columns, not selectable — click "Name" or "Updated" to sort</span>
        <ControlledDataTable />
      </div>
    </div>
  ),
}

// ── Composition ───────────────────────────────────────────────────────────────

export const WithSlots: Story = {
  render: () => {
    function RowClickDemo() {
      const [lastClicked, setLastClicked] = React.useState<string | null>(null)
      return (
        <div className="flex flex-col gap-2">
          <span className="type-body-sm text-sand-600">
            {lastClicked ? `Last clicked: ${lastClicked}` : 'Click a row to select it.'}
          </span>
          <ControlledDataTable onRowClick={(row) => setLastClicked(row.name)} />
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-8">
        <RowClickDemo />
        <div className="flex flex-col gap-2">
          <span className="type-body-sm text-sand-600">Custom `emptyState`, composed from `EmptyState` + a call to action.</span>
          <DataTable
            columns={COLUMNS}
            rows={[]}
            rowKey={(row) => row.id}
            emptyState={
              <EmptyState
                title="No destinations yet"
                description="Add your first destination to get started."
                action={<Button size="sm">Add Destination</Button>}
              />
            }
          />
        </div>
      </div>
    )
  },
}
