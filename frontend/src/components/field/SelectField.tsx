'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  width?: string;
}

export const SelectField = ({ label, value, options, onChange, width = 'w-56' }: SelectFieldProps) => {
  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-slate-700 whitespace-nowrap">{label}</label>
      <Select value={value} onValueChange={(val) => onChange(val ?? '')}>
        <SelectTrigger className={`${width} bg-white h-100 px-3 py-2 rounded-md border border-slate-200 text-sm font-medium`}>
          <SelectValue>{options.find((opt) => opt.value === value)?.label ?? value}</SelectValue>
        </SelectTrigger>
        <SelectContent side="bottom" alignItemWithTrigger={false} className="w-40">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectField;
