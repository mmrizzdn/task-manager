'use client';

import { Loader2 } from 'lucide-react';
import { UseFormRegister, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';
import { User } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface UserFormValues {
  name: string;
  email: string;
  password?: string;
  confirm_password?: string;
}

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser: User | null;
  register: UseFormRegister<UserFormValues>;
  handleSubmit: UseFormHandleSubmit<UserFormValues>;
  onSubmit: (data: UserFormValues) => void;
  saving: boolean;
  errors: FieldErrors<UserFormValues>;
}

const UserFormDialog = ({
  isOpen,
  onClose,
  editingUser,
  register,
  handleSubmit,
  onSubmit,
  saving,
  errors,
}: UserDialogProps) => (
  <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">{editingUser ? 'Edit User' : 'Create User'}</DialogTitle>
      </DialogHeader>

      <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
        <div className="grid gap-2">
          <Label htmlFor="name" className={errors.name ? 'text-destructive' : 'text-slate-700 font-medium'}>
            Name <span className="text-destructive">*</span>
          </Label>
          <Input {...register('name')} id="name" aria-invalid={!!errors.name} />
          {errors.name && <p className="text-xs text-destructive font-medium">{errors.name.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className={errors.email ? 'text-destructive' : 'text-slate-700 font-medium'}>
            Email <span className="text-destructive">*</span>
          </Label>
          <Input {...register('email')} id="email" type="email" aria-invalid={!!errors.email} />
          {errors.email && <p className="text-xs text-destructive font-medium">{errors.email.message}</p>}
        </div>

        {editingUser && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="password" className={errors.password ? 'text-destructive' : 'text-slate-700 font-medium'}>
                Password
              </Label>
              <Input {...register('password')} id="password" type="password" aria-invalid={!!errors.password} />
              {errors.password && <p className="text-xs text-destructive font-medium">{errors.password.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirm_password" className={errors.confirm_password ? 'text-destructive' : 'text-slate-700 font-medium'}>
                Confirm Password
              </Label>
              <Input {...register('confirm_password')} id="confirm_password" type="password" aria-invalid={!!errors.confirm_password} />
              {errors.confirm_password && <p className="text-xs text-destructive font-medium">{errors.confirm_password.message}</p>}
            </div>
          </>
        )}
      </form>

      <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-0 mt-4 bg-white">
        <Button type="button" variant="ghost" onClick={onClose} className="w-full sm:w-auto text-slate-600">
          Cancel
        </Button>
        <Button type="submit" form="user-form" disabled={saving} className="w-full sm:w-auto">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default UserFormDialog;
