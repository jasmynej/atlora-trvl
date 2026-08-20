import * as React from 'react'
import { cn } from '../utils/cn'
import { Checkbox } from './Checkbox'
import { Skeleton } from './Skeleton'
import { EmptyState } from './EmptyState'

export interface DataTableColumn<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  width?: string
  sortable?: boolean
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  loading?: boolean
  emptyState?: React.ReactNode
  onRowClick?: (row: T) => void
  selectable?: boolean
  selectedKeys?: string[]
  onSelectionChange?: (keys: string[]) => void
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void
  className?: string
}

function SortIcon({ direction }: { direction?: 'asc' | 'desc' }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      className={cn(
        'shrink-0 transition-opacity',
        direction ? 'opacity-100' : 'opacity-0 group-hover:opacity-50',
        direction === 'desc' && 'rotate-180'
      )}
    >
      <path d="M5 1.5v7M5 8.5L2 5.5M5 8.5l3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const LOADING_ROW_COUNT = 5

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  emptyState,
  onRowClick,
  selectable,
  selectedKeys = [],
  onSelectionChange,
  sortKey,
  sortDirection,
  onSortChange,
  className,
}: DataTableProps<T>) {
  const columnCount = columns.length + (selectable ? 1 : 0)
  const allSelected = rows.length > 0 && selectedKeys.length === rows.length
  const someSelected = selectedKeys.length > 0 && !allSelected

  const toggleAll = () => {
    onSelectionChange?.(allSelected ? [] : rows.map(rowKey))
  }

  const toggleRow = (key: string) => {
    onSelectionChange?.(
      selectedKeys.includes(key) ? selectedKeys.filter((selected) => selected !== key) : [...selectedKeys, key]
    )
  }

  const handleSort = (column: DataTableColumn<T>) => {
    if (!column.sortable || !onSortChange) return
    const nextDirection: 'asc' | 'desc' = sortKey === column.key && sortDirection === 'asc' ? 'desc' : 'asc'
    onSortChange(column.key, nextDirection)
  }

  return (
    <div className={cn('overflow-x-auto rounded-md border border-sand-200 bg-white', className)}>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-sand-200 bg-sand-150">
            {selectable && (
              <th scope="col" className="w-10 px-4 py-3">
                <Checkbox
                  aria-label="Select all rows"
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                  disabled={rows.length === 0}
                />
              </th>
            )}
            {columns.map((column) => (
              <th key={column.key} scope="col" style={{ width: column.width }} className="px-4 py-3">
                {column.sortable ? (
                  <button
                    type="button"
                    onClick={() => handleSort(column)}
                    aria-sort={sortKey === column.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                    className="type-caption group inline-flex items-center gap-1 uppercase tracking-wide text-sand-600 hover:text-charcoal focus-visible:outline-none focus-visible:shadow-ring"
                  >
                    {column.header}
                    <SortIcon direction={sortKey === column.key ? sortDirection : undefined} />
                  </button>
                ) : (
                  <span className="type-caption uppercase tracking-wide text-sand-600">{column.header}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: LOADING_ROW_COUNT }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-sand-200 last:border-0">
                {selectable && (
                  <td className="px-4 py-3">
                    <Skeleton variant="rect" className="h-4 w-4 rounded-xs" />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3">
                    <Skeleton variant="text" />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columnCount} className="px-4 py-6">
                {emptyState ?? <EmptyState title="No results" />}
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const key = rowKey(row)
              const selected = selectedKeys.includes(key)
              const clickable = Boolean(onRowClick)

              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'border-b border-sand-200 transition-colors last:border-0',
                    (clickable || selectable) && 'hover:bg-sand-150',
                    clickable && 'cursor-pointer',
                    selected && 'bg-brand-subtle hover:bg-brand-subtle'
                  )}
                >
                  {selectable && (
                    <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                      <Checkbox aria-label={`Select row ${key}`} checked={selected} onChange={() => toggleRow(key)} />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="type-body-sm px-4 py-3">
                      {column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? '')}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
