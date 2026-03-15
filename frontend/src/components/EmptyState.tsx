import { LucideIcon, ClipboardList, Plus } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
  icon?: LucideIcon;
}

const EmptyState = ({
  title = 'No items found',
  description,
  onAction,
  actionLabel = 'Add Item',
  icon: Icon = ClipboardList,
}: EmptyStateProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-12 text-center shadow-sm">
      <Icon className="w-16 h-16 mx-auto text-slate-300 mb-4" />
      <h3 className="text-lg font-semibold text-slate-600 mb-2">{title}</h3>
      {description && <p className="text-slate-500 mb-6 max-w-sm mx-auto">{description}</p>}
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-primary-100 text-600 hover:bg-50 font-medium rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
