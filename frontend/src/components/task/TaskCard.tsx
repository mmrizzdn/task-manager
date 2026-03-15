'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/task';
import { tasksApi } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskCardProps {
    task: Task;
    onToggleCompleted?: (task: Task, e?: React.MouseEvent) => void;
    onOpenEdit?: (task: Task) => void;
    onOpenDelete?: (task: Task) => void;
    onOpenDetails?: (task: Task) => void;
}

const TaskCard = ({ task, onToggleCompleted, onOpenEdit, onOpenDelete, onOpenDetails }: TaskCardProps) => {
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const [optimisticComplete, setOptimisticComplete] = useState<boolean | null>(null);
    useEffect(() => {
        setOptimisticComplete(null);
    }, [task.id, task.is_completed, task.isCompleted]);
    const isComplete =
        optimisticComplete !== null
            ? optimisticComplete
            : task.is_completed ?? task.isCompleted ?? false;

    const handleViewDetails = async () => {
        try {
            setIsLoadingDetails(true);
            const response = await tasksApi.getTaskById(task.id);
            if (onOpenDetails) {
                onOpenDetails(response.data.data || response.data);
            }
        } catch (error) {
            console.error('Failed to fetch task details:', error);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const handleToggleClick = (e: React.MouseEvent) => {
        if (isToggling) {
            e.preventDefault();
            return;
        }

        setIsToggling(true);

        setOptimisticComplete((prev) => {
            const current = prev !== null ? prev : task.is_completed ?? task.isCompleted ?? false;
            return !current;
        });

        if (onToggleCompleted) {
            onToggleCompleted(task, e);
        }

        setTimeout(() => {
            setIsToggling(false);
        }, 500);
    };

    return (
        <Card className="shadow-sm border-slate-200 overflow-hidden transition-all mb-3">
            <CardContent className="p-4 sm:p-5 flex items-center gap-4">
                {onToggleCompleted && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleToggleClick(e);
                        }}
                        className="text-muted-foreground hover:text-primary transition-colors focus:outline-none cursor-pointer flex-shrink-0 p-1 -m-1 rounded hover:bg-slate-100"
                        title={isComplete ? 'Mark as incomplete' : 'Mark as completed'}
                        disabled={isToggling}
                    >
                        {isComplete
                            ? <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            : <Circle className="w-6 h-6" />
                        }
                    </button>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className={`text-base font-semibold truncate transition-colors ${
                            isComplete ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}>
                            {task.title}
                        </h4>
                        <Badge
                            style={{
                                backgroundColor: isComplete ? '#d1fae5' : '#fef3c7',
                                color: isComplete ? '#065f46' : '#92400e',
                            }}
                            className="shrink-0 text-xs font-medium border-0"
                        >
                            {isComplete ? 'Completed' : 'Incomplete'}
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(task.created_at || task.createdAt || '').toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'Asia/Jakarta',
                        })}
                    </p>
                </div>

                {(onOpenEdit || onOpenDetails || onOpenDelete) && (
                    onOpenDetails && !onOpenEdit && !onOpenDelete ? (
                        <button
                            onClick={() => onOpenDetails(task)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors cursor-pointer border-none bg-transparent">
                                <MoreVertical className="h-5 w-5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                {onOpenDetails && (
                                    <DropdownMenuItem
                                        onClick={handleViewDetails}
                                        className="cursor-pointer"
                                        disabled={isLoadingDetails}
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        <span>View Details</span>
                                    </DropdownMenuItem>
                                )}
                                {onOpenEdit && (
                                    <DropdownMenuItem onClick={() => onOpenEdit(task)} className="cursor-pointer">
                                        <Edit className="mr-2 h-4 w-4" />
                                        <span>Edit</span>
                                    </DropdownMenuItem>
                                )}
                                {onOpenDelete && (
                                    <DropdownMenuItem
                                        onClick={() => onOpenDelete(task)}
                                        className="text-destructive focus:text-destructive cursor-pointer"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Delete</span>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                )}
            </CardContent>
        </Card>
    );
};

export default TaskCard;