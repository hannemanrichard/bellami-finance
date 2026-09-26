"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface BulkAction<T> {
  label: string;
  action: (items: T[]) => void;
}

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKey?: string;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onCreateClick?: () => void;
  createButtonLabel?: string;
  onRowsSelect?: (rows: T[]) => void;
  bulkActions?: BulkAction<T>[];
  isSelectable?: boolean;
  // Pagination props
  totalItems?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  searchQuery: externalSearchQuery,
  onSearchChange,
  onCreateClick,
  createButtonLabel = "Create",
  onRowsSelect,
  bulkActions,
  isSelectable = false,
  // Pagination props
  totalItems = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<{
    key: string;
    asc: boolean;
  } | null>(null);
  const [columnVisibility, setColumnVisibility] = React.useState<
    Record<string, boolean>
  >({});
  const [internalSearchQuery, setInternalSearchQuery] = React.useState("");

  // Use external search query if provided, otherwise use internal state
  const searchQuery =
    externalSearchQuery !== undefined
      ? externalSearchQuery
      : internalSearchQuery;
  const setSearchQuery = onSearchChange || setInternalSearchQuery;
  // Use external pagination props if provided, otherwise use internal state
  const [internalPageIndex, setInternalPageIndex] = React.useState(0);
  const [internalPageSize, setInternalPageSize] = React.useState(10);

  const pageIndex = onPageChange ? currentPage - 1 : internalPageIndex;
  const effectivePageSize = onPageSizeChange ? pageSize : internalPageSize;
  const [selectedRows, setSelectedRows] = React.useState<
    Record<number, boolean>
  >({});

  const filteredData = React.useMemo(() => {
    let processed = [...data];

    // Only apply internal search filtering if no external search is provided
    if (searchKey && searchQuery && externalSearchQuery === undefined) {
      processed = processed.filter((item) =>
        String(item[searchKey])
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    if (sorting) {
      processed.sort((a, b) => {
        const modifier = sorting.asc ? 1 : -1;
        return a[sorting.key] > b[sorting.key] ? modifier : -modifier;
      });
    }

    return processed;
  }, [data, searchKey, searchQuery, sorting, externalSearchQuery]);

  // Use external totalItems if provided, otherwise calculate from filtered data
  const totalCount = onPageChange ? totalItems : filteredData.length;
  const pageCount = Math.ceil(totalCount / effectivePageSize);

  // Only slice data if using internal pagination
  const paginatedData = onPageChange
    ? filteredData
    : filteredData.slice(
        pageIndex * effectivePageSize,
        (pageIndex + 1) * effectivePageSize
      );

  const handleSelectAll = React.useCallback(
    (checked: boolean) => {
      const newSelected = {} as Record<number, boolean>;
      paginatedData.forEach((_, index) => {
        newSelected[index] = checked;
      });
      setSelectedRows(newSelected);

      if (onRowsSelect) {
        onRowsSelect(checked ? paginatedData : []);
      }
    },
    [paginatedData, onRowsSelect]
  );

  const handleSelectRow = React.useCallback(
    (index: number, checked: boolean) => {
      setSelectedRows((prev) => ({ ...prev, [index]: checked }));

      if (onRowsSelect) {
        const selectedItems = paginatedData.filter((_, idx) =>
          idx === index ? checked : selectedRows[idx]
        );
        onRowsSelect(selectedItems);
      }
    },
    [paginatedData, selectedRows, onRowsSelect]
  );

  const selectedItems = React.useMemo(
    () => paginatedData.filter((_, idx) => selectedRows[idx]),
    [paginatedData, selectedRows]
  );

  const hasSelectedItems = selectedItems.length > 0;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {searchKey && (
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          )}
          {hasSelectedItems && bulkActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>
                  {selectedItems.length} items selected
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {bulkActions.map((action, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => action.action(selectedItems)}
                  >
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <SlidersHorizontal className="mr-1 h-4 w-4" /> View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  className="capitalize"
                  checked={!columnVisibility[column.key]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      [column.key]: !value,
                    }))
                  }
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {onCreateClick && (
            <Button onClick={onCreateClick}>{createButtonLabel}</Button>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {isSelectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      Object.values(selectedRows).every(Boolean) &&
                      paginatedData.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {columns
                .filter((column) => !columnVisibility[column.key])
                .map((column) => (
                  <TableHead key={column.key}>
                    {column.sortable ? (
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setSorting((prev) =>
                            prev?.key === column.key
                              ? { key: column.key, asc: !prev.asc }
                              : { key: column.key, asc: true }
                          )
                        }
                      >
                        {column.label}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      column.label
                    )}
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (isSelectable ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, i) => (
                <TableRow key={i}>
                  {isSelectable && (
                    <TableCell className="w-12">
                      <Checkbox
                        checked={selectedRows[i] || false}
                        onCheckedChange={(checked) =>
                          handleSelectRow(i, checked as boolean)
                        }
                        aria-label={`Select row ${i}`}
                      />
                    </TableCell>
                  )}
                  {columns
                    .filter((column) => !columnVisibility[column.key])
                    .map((column) => (
                      <TableCell key={column.key}>
                        {column.render ? column.render(row) : row[column.key]}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${effectivePageSize}`}
              onValueChange={(value) => {
                const newSize = Number(value);
                if (onPageSizeChange) {
                  onPageSizeChange(newSize);
                } else {
                  setInternalPageSize(newSize);
                  setInternalPageIndex(0);
                }
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={effectivePageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {pageIndex + 1} of {pageCount}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                if (onPageChange) {
                  onPageChange(1);
                } else {
                  setInternalPageIndex(0);
                }
              }}
              disabled={pageIndex === 0}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                if (onPageChange) {
                  onPageChange(currentPage - 1);
                } else {
                  setInternalPageIndex(pageIndex - 1);
                }
              }}
              disabled={pageIndex === 0}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                if (onPageChange) {
                  onPageChange(currentPage + 1);
                } else {
                  setInternalPageIndex(pageIndex + 1);
                }
              }}
              disabled={pageIndex === pageCount - 1}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => {
                if (onPageChange) {
                  onPageChange(pageCount);
                } else {
                  setInternalPageIndex(pageCount - 1);
                }
              }}
              disabled={pageIndex === pageCount - 1}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
