'use client';

import { useState } from 'react';
import { Task } from '@/types';

export function useTaskDetails() {
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleOpenDetails = (task: Task) => {
    setSelectedTask(task);
    setDetailDialogOpen(true);
  };

  return {
    detailDialogOpen,
    setDetailDialogOpen,
    selectedTask,
    handleOpenDetails,
  };
}
