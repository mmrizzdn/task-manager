import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  is_completed: z.boolean(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

export const useTaskForm = () => {
  return useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      is_completed: false,
    },
  });
};
