'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Task } from '@/types/task';

interface TaskDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

const TaskDetailsDialog = ({ isOpen, onOpenChange, task }: TaskDetailsDialogProps) => {
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Detail Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-600">Title</label>
            <p className="text-base text-slate-900 mt-1">{task.title}</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Description</label>
            <p className={`text-base mt-1 ${task.description !== null && task.description !== undefined && task.description?.trim() ? 'text-slate-900' : 'text-slate-500'}`}>
              {task.description !== null && task.description !== undefined && task.description?.trim() ? task.description : '-'}
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Status</label>
            <p className="text-base text-slate-900 mt-1">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${task.is_completed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
              >
                {task.is_completed ? 'Completed' : 'Incomplete'}
              </span>
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Created at</label>
            <p className="text-base text-slate-900 mt-1">
              {new Date(task.created_at || '').toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog;
