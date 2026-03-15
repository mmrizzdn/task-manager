'use client';

import { Loader2 } from 'lucide-react';
import { UseFormRegister, Control, Controller } from 'react-hook-form';
import { Task } from '@/types';
import { TaskFormValues } from '@/schemas';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface TaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    editingTask: Task | null;
    register: UseFormRegister<TaskFormValues>;
    control: Control<TaskFormValues>;
    handleSubmit: any;
    onSubmit: (data: TaskFormValues) => void;
    saving: boolean;
    errors: any;
}

const TaskFormDialog = ({
    isOpen,
    onClose,
    editingTask,
    register,
    control,
    handleSubmit,
    onSubmit,
    saving,
    errors,
}: TaskDialogProps) => (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                    {editingTask ? 'Edit Task' : 'Create New Task'}
                </DialogTitle>
            </DialogHeader>

            <form id="task-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                <div className="grid gap-2">
                    <Label
                        htmlFor="title"
                        className={errors.title ? 'text-destructive' : 'text-slate-700 font-medium'}
                    >
                        Title <span className="text-destructive">*</span>
                    </Label>
                    <Input {...register('title')} id="title" aria-invalid={!!errors.title} />
                    {errors.title && <p className="text-xs text-destructive font-medium">{errors.title.message}</p>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description" className="text-slate-700 font-medium">
                        Description (optional)
                    </Label>
                    <Textarea {...register('description')} id="description" rows={3} className="resize-none" />
                </div>

                <Controller
                    name="is_completed"
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox
                                id="is_completed"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            <Label
                                htmlFor="is_completed"
                                className="text-sm font-medium leading-none cursor-pointer"
                            >
                                Mark as completed
                            </Label>
                        </div>
                    )}
                />
            </form>

            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-0 mt-4 bg-white">
                <Button type="button" variant="ghost" onClick={onClose} className="w-full sm:w-auto text-slate-600">
                    Cancel
                </Button>
                <Button type="submit" form="task-form" disabled={saving} className="w-full sm:w-auto">
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingTask ? (saving ? 'Saving...' : 'Save') : (saving ? 'Creating...' : 'Create')}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export default TaskFormDialog;