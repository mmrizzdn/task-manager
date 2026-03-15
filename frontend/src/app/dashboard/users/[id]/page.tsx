'use client';

import { useState, useCallback, useEffect } from 'react';
import { usersApi } from '@/services/api';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Mail, CheckSquare } from 'lucide-react';
import { User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User, Task } from '@/types';
import { TaskCard, Pagination, ListHeader, TaskDetailsDialog } from '@/components';
import { useListQuery } from '@/hooks';

interface TaskFilter {
  status: string;
  search: string;
}

const UserDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleOpenDetails = (task: Task) => {
    setSelectedTask(task);
    setDetailDialogOpen(true);
  };

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
  } = useListQuery<Task, TaskFilter>({
    queryKey: `user-tasks-${userId}`,
    fetchFn: (p, l, s, o, f) =>
      usersApi.getTasksByUserId(userId, p, l, s, o, f.status !== 'all' ? f.status : undefined, f.search || undefined),
    defaultFilters: { status: 'all', search: '' },
  });

  const fetchUserDetails = useCallback(async () => {
    if (!userId) return;
    try {
      setLoadingUser(true);
      const userRes = await usersApi.getUserById(userId);
      setUser(userRes.data.data || userRes.data);
    } catch (error: any) {
      toast.error('Failed to fetch user details');
      router.push('/users');
    } finally {
      setLoadingUser(false);
    }
  }, [userId, router]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  if (loadingUser) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-slate-300" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-2 text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <UserIcon className="w-10 h-10" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-500 mt-2">
              <Mail className="w-4 h-4" />
              {user.email}
            </div>
          </div>
        </div>
      </div>

      <ListHeader
        title="User Tasks"
        search={{
          value: filters.search,
          onChange: (value) => updateFilter('search', value),
          placeholder: 'Search user tasks...',
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
            label: 'Sort:',
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
            label: 'Order:',
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
      />

      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
          <p className="text-slate-500">No tasks found for this user.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {tasks.map((task: Task) => (
              <TaskCard key={task.id} task={task} onOpenDetails={handleOpenDetails} />
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
      <TaskDetailsDialog isOpen={detailDialogOpen} onOpenChange={setDetailDialogOpen} task={selectedTask} />
    </div>
  );
};

export default UserDetailPage;
