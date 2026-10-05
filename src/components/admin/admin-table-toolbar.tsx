'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { MagnifyingGlass, X, Funnel } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

export interface ActiveFilterItem {
  key: string;
  label: string;
  value: string;
}

export interface AdminTableToolbarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  filtersSlot?: ReactNode;
  activeFilters?: ActiveFilterItem[];
  onRemoveFilter?: (key: string) => void;
  onClearAllFilters?: () => void;
  actionsSlot?: ReactNode;
}

export function AdminTableToolbar({
  searchPlaceholder = 'Search records...',
  searchValue = '',
  onSearchChange,
  filtersSlot,
  activeFilters = [],
  onRemoveFilter,
  onClearAllFilters,
  actionsSlot,
}: AdminTableToolbarProps) {
  const [internalSearch, setInternalSearch] = useState(searchValue);
  const [prevSearchValue, setPrevSearchValue] = useState(searchValue);
  const debouncedSearch = useDebouncedValue(internalSearch, 350);

  if (searchValue !== prevSearchValue) {
    setPrevSearchValue(searchValue);
    setInternalSearch(searchValue);
  }

  useEffect(() => {
    if (onSearchChange && debouncedSearch !== searchValue) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, onSearchChange, searchValue]);

  return (
    <div className="space-y-2.5 mb-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-1 flex-wrap sm:flex-nowrap">
          {onSearchChange && (
            <div className="relative flex-1 sm:max-w-xs min-w-[200px]">
              <MagnifyingGlass
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={internalSearch}
                onChange={(e) => setInternalSearch(e.target.value)}
                className="h-9 pl-9 pr-8 text-xs bg-card rounded-lg"
              />
              {internalSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setInternalSearch('');
                    onSearchChange('');
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}

          {filtersSlot}
        </div>

        {actionsSlot && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {actionsSlot}
          </div>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1 mr-1">
            <Funnel size={12} /> Filters:
          </span>
          {activeFilters.map((f) => (
            <Badge
              key={f.key}
              variant="secondary"
              className="text-[11px] h-6 pl-2 pr-1 gap-1 rounded-md bg-muted/80 text-foreground font-normal border border-border"
            >
              <span className="text-muted-foreground">{f.label}:</span>
              <span className="font-semibold">{f.value}</span>
              {onRemoveFilter && (
                <button
                  type="button"
                  onClick={() => onRemoveFilter(f.key)}
                  className="hover:bg-background/80 rounded p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X size={10} />
                </button>
              )}
            </Badge>
          ))}
          {onClearAllFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearAllFilters}
              className="h-6 px-2 text-[11px] font-semibold text-muted-foreground hover:text-destructive"
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
