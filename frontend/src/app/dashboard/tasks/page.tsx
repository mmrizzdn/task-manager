'use client';

import { useEffect } from 'react';
import { tasksApi } from '@/services/api';
import { Loader2 } from 'lucide-react';
import { TaskCard, TaskDetailsDialog, TaskFormDialog, DeleteConfirmDialog, Pagination, ListHeader } from '@/components';
import { useTaskForm, useTaskActions, useListQuery } from '@/hooks';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const TaskPage = () => {
  interface TaskFilter {
    status: string;
    search: string;
  }

  const {
    data: tasks,
    loading,
    currentPage,
    setCurrentPage,
    totalPages,
    total,
    sort,
    setSort,
    order,
    setOrder,
    filters,
    updateFilter,
    limit,
    refetch: fetchTasks,
  } = useListQuery<Task, TaskFilter>({
    queryKey: 'tasks',
    fetchFn: (p, l, s, o, f) =>
      tasksApi.getTasks(p, l, s, o, f.status !== 'all' ? f.status : undefined, f.search || undefined),
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
  } = useTaskActions({ fetchTasks, reset });

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <ListHeader
        title="All Tasks"
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
        <div className="py-20 flex justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-slate-300" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
          <p className="text-slate-500">
            {filters.search ? 'No tasks match your search.' : 'No tasks found in the system.'}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
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

export default TaskPage;
