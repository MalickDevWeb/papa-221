import { useState, useMemo } from 'react';

export interface TableConfig<T> {
  initialSortField?: keyof T;
  initialSortDirection?: 'asc' | 'desc';
  itemsPerPage?: number;
}

export function useInteractiveTable<T extends { id: string }>(
  items: T[],
  config: TableConfig<T> = {}
) {
  const { initialSortField, initialSortDirection = 'asc', itemsPerPage = 5 } = config;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<keyof T | null>(initialSortField || null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(initialSortDirection);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValue, setFilterValue] = useState<string>('ALL');

  // Handle Selection
  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = (filteredItems: T[]) => {
    if (selectedIds.size >= filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map(item => item.id)));
    }
  };

  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setCurrentPage(1);
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedIds,
    setSelectedIds,
    sortField,
    sortDir,
    currentPage,
    setCurrentPage,
    filterValue,
    setFilterValue,
    toggleSelect,
    toggleSelectAll,
    handleSort,
    itemsPerPage
  };
}
