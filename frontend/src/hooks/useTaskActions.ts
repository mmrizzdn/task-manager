'use client';

import { useState } from 'react';
import { tasksApi } from '@/services/api';
import { toast } from 'sonner';
import { Task } from '@/types/task';
import { TaskFormValues } from '@/schemas';
import { UseFormReset } from 'react-hook-form';

interface UseTaskActionsProps {
    fetchTasks: () => void;
    fetchStats?: () => void;
    reset: UseFormReset<TaskFormValues>;
}

export const useTaskActions = ({ fetchTasks, fetchStats, reset }: UseTaskActionsProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingTask, setDeletingTask] = useState<Task | null>(null);
    const [saving, setSaving] = useState(false);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const handleOpenCreate = () => {
        setEditingTask(null);
        reset({ title: '', description: '', is_completed: false });
        setDialogOpen(true);
    };

    const handleOpenEdit = (task: Task) => {
        setEditingTask(task);
        reset({
            title: task.title,
            description: task.description || '',
            is_completed: task.is_completed ?? task.isCompleted ?? false,
        });
        setDialogOpen(true);
    };

    const handleOpenDelete = (task: Task) => {
        setDeletingTask(task);
        setDeleteDialogOpen(true);
    };

    const handleOpenDetails = (task: Task) => {
        setSelectedTask(task);
        setDetailDialogOpen(true);
    };

    const onSubmit = async (data: TaskFormValues) => {
        setSaving(true);
        try {
            if (editingTask) {
                await tasksApi.updateTask(editingTask.id, {
                    title: data.title,
                    description: data.description || undefined,
                    is_completed: data.is_completed,
                });
                toast.success('Task updated successfully!');
            } else {
                await tasksApi.createTask({
                    title: data.title,
                    description: data.description || undefined,
                    is_completed: data.is_completed,
                });
                toast.success('Task created successfully!');
            }
            setDialogOpen(false);
            fetchTasks();
            fetchStats?.();
        } catch (error: any) {
            const message = error.response?.data?.message;
            toast.error(Array.isArray(message) ? message.join(', ') : message || 'Failed to save task');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleCompleted = async (task: Task, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        try {
            const currentStatus = task.is_completed ?? task.isCompleted ?? false;
            const newStatus = !currentStatus;

            const response = await tasksApi.updateTask(task.id, { is_completed: newStatus });

            toast.success(currentStatus ? 'Task marked as incomplete' : 'Task marked as completed');
            
            await Promise.all([
                fetchTasks(),
                fetchStats?.()
            ]);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update task');
        }
    };

    const handleDelete = async () => {
        if (!deletingTask) return;
        try {
            await tasksApi.deleteTask(deletingTask.id);
            toast.success('Task deleted successfully!');
            setDeleteDialogOpen(false);
            setDeletingTask(null);
            fetchTasks();
            fetchStats?.();
        } catch {
            toast.error('Failed to delete task');
        }
    };

    return {
        dialogOpen, setDialogOpen,
        editingTask,
        deleteDialogOpen, setDeleteDialogOpen,
        deletingTask,
        saving,
        detailDialogOpen, setDetailDialogOpen,
        selectedTask,
        handleOpenCreate,
        handleOpenEdit,
        handleOpenDelete,
        handleOpenDetails,
        onSubmit,
        handleToggleCompleted,
        handleDelete,
    };
};