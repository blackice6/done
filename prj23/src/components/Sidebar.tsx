import { useAuth } from '../contexts/AuthContext';
import type { Page } from '../types';
import { KeyRound, LayoutDashboard, GraduationCap, Users, BookOpen, ClipboardList, CreditCard, FileText, Shield, Settings, LogOut, X } from 'lucide-react';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activePage, setActivePage, isOpen, onClose }: SidebarProps) {
  const { currentUser, logout } = useAuth();

  const navItems: { page: Page; label: string; icon: typeof LayoutDashboard; roles?: string[] }[] = [
    { page: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { page: 'students', label: 'Students', icon: GraduationCap },
    { page: 'teachers', label: 'Teachers', icon: Users, roles: ['admin'] },
    { page: 'classes', label: 'Classes', icon: BookOpen, roles: ['admin'] },
    { page: 'assessments', label: 'Assessments', icon: ClipboardList },
    { page: 'fees', label: 'Fees & Payments', icon: CreditCard, roles: ['admin'] },
    { page: 'reports', label: 'Report Cards', icon: FileText },
    { page: 'audit', label: 'Audit Logs', icon: Shield, roles: ['admin'] },
    { page: 'settings', label: 'Settings', icon: Settings, roles: ['admin'] },
  ];

  const filteredNav = navItems.filter(item => !item.roles || item.roles.includes(currentUser?.role || ''));

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      <div className={`fixed top-0 left-0 h-full w-72 bg-slate-900 text-white z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:z-auto flex flex-col`}>
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <KeyRound className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight">GoldenKey</h2>
                <p className="text-xs text-slate-400">Elite SMS</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-2 hover:bg-slate-800 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredNav.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.page} onClick={() => { setActivePage(item.page); onClose(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activePage === item.page
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{currentUser?.username}</p>
              <p className="text-xs text-slate-400 capitalize">{currentUser?.role}</p>
            </div>
          </div>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
