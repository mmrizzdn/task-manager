import { LogOut } from 'lucide-react';
import { User } from '@/types/user';

interface HeaderProps {
  user: User | null;
  logout: () => void;
}

const Header = ({ user, logout }: HeaderProps) => (
  <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
    <div className="h-16 flex items-center gap-4 px-4">
      <div style={{ marginLeft: 'auto' }} className="flex items-center gap-4">
        <span className="text-sm text-primary font-semibold hidden sm:inline-block">{user?.name}</span>
        <button
          onClick={logout}
          className="p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  </header>
);

export default Header;
