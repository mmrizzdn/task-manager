'use client';

import { useState } from 'react';
import { usersApi } from '@/services/api';
import { toast } from 'sonner';
import { User } from '@/types';
import { UserFormValues } from '@/schemas';
import { UseFormReset } from 'react-hook-form';

interface UseUserActionsProps {
  fetchUsers: () => void;
  reset: UseFormReset<UserFormValues>;
}

export function useUserActions({ fetchUsers, reset }: UseUserActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    reset({
      name: user.name,
      email: user.email,
      password: undefined,
      confirm_password: undefined,
    });
    setDialogOpen(true);
  };

  const handleOpenDelete = (user: User) => {
    setDeletingUser(user);
    setDeleteDialogOpen(true);
  };

  const onSubmit = async (data: UserFormValues) => {
    if (!editingUser) return;
    setSaving(true);
    try {
      const response = await usersApi.updateUser(editingUser.id, data);
      toast.success('User updated successfully!');
      setDialogOpen(false);
      setEditingUser(null);
      reset();
      await fetchUsers();
    } catch (error: any) {
      const message = error.response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(', ') : message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
    reset({
      name: '',
      email: '',
      password: undefined,
      confirm_password: undefined,
    });
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    try {
      await usersApi.deleteUser(deletingUser.id);
      toast.success('User deleted successfully!');
      setDeleteDialogOpen(false);
      setDeletingUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error('Failed to delete user');
    }
  };

  return {
    dialogOpen,
    setDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    editingUser,
    deletingUser,
    saving,
    handleOpenEdit,
    handleOpenDelete,
    handleCloseDialog,
    onSubmit,
    handleDelete,
  };
}
