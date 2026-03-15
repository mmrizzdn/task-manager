'use client';

import React, { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { tasksApi } from '@/services/api';
import { testApiResponse } from '@/lib/testApi';
import { useRouter } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  StatCard,
  TaskCard,
  TaskFormDialog,
  DeleteConfirmDialog,
  EmptyState,
  TaskDetailsDialog,
  Pagination,
  ListHeader,
} from '@/components';
import { useTaskForm, useTaskActions, useListQuery } from '@/hooks';
import { Task } from '@/types';

const DashboardPage = () => {
  const [stats, setStats] = React.useState({ total: 0, completed: 0, incomplete: 0 });
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const fetchStats = React.useCallback(async () => {
    try {
      const response = await tasksApi.getMyTaskStats();
      const wrappedData = response.data;
      const data = wrappedData?.data ?? wrappedData;
      if (data) setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  interface TaskFilter {
    status: string;
    search: string;
  }

  const {
    data: tasks, loading, currentPage, setCurrentPage,
    totalPages, total, sort, setSort, order, setOrder,
    filters, updateFilter, limit, fetchData: fetchTasks,
  } = useListQuery<Task, TaskFilter>({
    queryKey: 'my-tasks',
    fetchFn: (p, l, s, o, f) =>
      tasksApi.getMyTasks(p, l, s, o, f.status !== 'all' ? f.status : undefined, f.search || undefined),
    defaultFilters: { status: 'all', search: '' },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useTaskForm();

  const {
    dialogOpen,
    setDialogOpen,
    editingTask,
    deleteDialogOpen,
    setDeleteDialogOpen,
    deletingTask,
    saving,
    detailDialogOpen,
    setDetailDialogOpen,
    selectedTask,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleOpenDetails,
    onSubmit,
    handleToggleCompleted,
    handleDelete,
  } = useTaskActions({ fetchTasks, fetchStats, reset });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchStats();
      fetchTasks();
      setTimeout(() => {
        testApiResponse();
      }, 1000);
    }
  }, [isAuthenticated, isLoading, fetchStats, fetchTasks]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Tasks" value={stats.total} />
        <StatCard label="Completed" value={stats.completed} />
        <StatCard label="Incomplete" value={stats.incomplete} />
      </div>

      <ListHeader
        title="My Tasks"
        search={{
          value: filters.search,
          onChange: (value) => updateFilter('search', value),
          placeholder: 'Search tasks...',
        }}
        filters={[
          {
            label: 'Status:',
            value: filters.status,
            options: [
              { value: 'all', label: 'All' },
              { value: 'completed', label: 'Completed' },
              { value: 'incomplete', label: 'Incomplete' },
            ],
            onChange: (value) => updateFilter('status', value),
            width: 'w-32',
          },
          {
            label: 'Sort by:',
            value: sort,
            options: [
              { value: 'created_at', label: 'Created' },
              { value: 'title', label: 'Title' },
            ],
            onChange: (value) => {
              setSort(value);
              setCurrentPage(1);
            },
            width: 'w-32',
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
            width: 'w-32',
          },
        ]}
        actions={
          <Button onClick={handleOpenCreate} className="flex items-center gap-2 h-10">
            <Plus className="w-5 h-5" />
            New Task
          </Button>
        }
      />

      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState onAction={handleOpenCreate} actionLabel="Create Task" title="No tasks yet" />
      ) : (
        <>
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleCompleted={(task, e) => handleToggleCompleted(task, e)}
                onOpenEdit={handleOpenEdit}
                onOpenDelete={handleOpenDelete}
                onOpenDetails={handleOpenDetails}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setCurrentPage}
            label="tasks"
          />
        </>
      )}

      <button
        onClick={handleOpenCreate}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-slate-900 hover:bg-slate-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
      >
        <Plus className="w-6 h-6" />
      </button>

      <TaskFormDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editingTask={editingTask}
        register={register}
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        saving={saving}
        errors={errors}
      />
      <TaskDetailsDialog isOpen={detailDialogOpen} onOpenChange={setDetailDialogOpen} task={selectedTask} />
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDelete}
        title="Delete Task"
        itemName={deletingTask?.title}
      />
    </div>
  );
};

export default DashboardPage;
