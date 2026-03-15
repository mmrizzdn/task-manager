'use client';

import React from 'react';
import {SearchInput, SelectField} from '@/components';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  width?: string;
}

interface ListHeaderProps {
  title: string;
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  filters?: FilterConfig[];
  actions?: React.ReactNode;
}

const ListHeader = ({ title, search, filters, actions }: ListHeaderProps) => (
  <div className="mb-6 space-y-3">
    <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
    {(search || filters || actions) && (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {search && (
          <div className="w-full sm:w-64">
            <SearchInput value={search.value} onChange={search.onChange} placeholder={search.placeholder} />
          </div>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          {filters?.map((filter) => (
            <SelectField
              key={filter.label}
              label={filter.label}
              value={filter.value}
              options={filter.options}
              onChange={filter.onChange}
              width={filter.width}
            />
          ))}
          {actions}
        </div>
      </div>
    )}
  </div>
);

export default ListHeader;
