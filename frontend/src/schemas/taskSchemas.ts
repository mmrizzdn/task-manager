import * as z from 'zod';

export const taskSchema = z.object({
    title: z.string().min(1, 'Task title is required'),
    description: z.string().optional(),
    is_completed: z.boolean(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;