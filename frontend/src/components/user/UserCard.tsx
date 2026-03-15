import { User as UserIcon, Mail, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { User } from '@/types';
import Link from 'next/link';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 hover:border-600/30 transition-all group">
      <div className="flex items-start justify-between gap-4">
        <Link href={`/dashboard/users/${user.id}`} className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-600/10 group-hover:text-600 transition-colors">
            <UserIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-600 transition-colors">{user.name}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
              <Mail className="w-3 h-3" />
              {user.email}
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(user)}
            className="p-2 text-slate-400 hover:text-600 hover:bg-slate-50 rounded-lg transition-colors"
            title="Edit User"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(user)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <Link
            href={`/dashboard/users/${user.id}`}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
