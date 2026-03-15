'use client';

import { Loader2 } from 'lucide-react';
import { User } from '@/types';
import { usersApi } from '@/services/api';
import { UserCard, UserDialog, DeleteConfirmDialog, EmptyState, Pagination, ListHeader } from '@/components';
import { useListQuery, useUserActions, useUserForm } from '@/hooks';

interface UserFilter {
  search: string;
}

export default function UsersPage() {
  const {
    data: users, loading, currentPage, setCurrentPage,
    totalPages, total, sort, setSort, order, setOrder,
    filters, updateFilter, limit, fetchData: fetchUsers,
  } = useListQuery<User, UserFilter>({
    queryKey: 'users',
    fetchFn: (p, l, s, o, f) => usersApi.getUsers(p, l, s, o, f.search || undefined),
    defaultFilters: { search: '' },
    defaultSort: 'created_at',
    defaultOrder: 'desc',
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useUserForm();

  const {
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
  } = useUserActions({ fetchUsers, reset });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <ListHeader
        title="User Management"
        search={{
          value: filters.search,
          onChange: (value) => updateFilter('search', value),
          placeholder: 'Search users...',
        }}
        filters={[
          {
            label: 'Sort by:',
            value: sort,
            options: [
              { value: 'name', label: 'Name' },
              { value: 'email', label: 'Email' },
              { value: 'created_at', label: 'Created' },
            ],
            onChange: (value) => {
              setSort(value);
              setCurrentPage(1);
            },
          },
          {
            label: 'Order by:',
            value: order,
            options: [
              { value: 'asc', label: 'Ascending' },
              { value: 'desc', label: 'Descending' },
            ],
            onChange: (value) => {
              setOrder(value);
              setCurrentPage(1);
            },
          },
        ]}
      />

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-slate-300" />
        </div>
      ) : users.length === 0 ? (
        <EmptyState title="No users found" description="There are no users registered in the system yet." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 mb-4">
            {users.map((user) => (
              <UserCard key={user.id} user={user} onEdit={handleOpenEdit} onDelete={handleOpenDelete} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setCurrentPage}
            label="users"
          />
        </>
      )}

      <UserDialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        editingUser={editingUser}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        saving={saving}
        errors={errors}
      />
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDelete}
        title="Delete User"
        itemName={deletingUser?.name}
      />
    </div>
  );
}
