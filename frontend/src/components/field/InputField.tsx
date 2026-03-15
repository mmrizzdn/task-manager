'use client';

import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  hint?: string;
  showToggle?: boolean;
  showValue?: boolean;
  onToggle?: () => void;
  registration: any;
}

export const InputField = ({
  label,
  type = 'text',
  placeholder,
  autoComplete,
  error,
  hint,
  showToggle,
  showValue,
  onToggle,
  registration,
}: InputFieldProps) => (
  <div className="grid w-full items-center gap-2">
    <Label className={error ? 'text-destructive' : ''}>{label}</Label>
    <div className="relative">
      <Input
        type={showToggle ? (showValue ? 'text' : 'password') : type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...registration}
        aria-invalid={!!error}
        className={showToggle ? 'pr-10' : ''}
      />
      {showToggle && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:bg-transparent"
        >
          {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      )}
    </div>
    {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    {!error && hint && <p className="text-muted-foreground text-xs mt-1">{hint}</p>}
  </div>
);

export default InputField;
