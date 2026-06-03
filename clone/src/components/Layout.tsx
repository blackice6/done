import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap, LogOut, Menu, X,
  Shield, BookOpen, Users,
  LayoutDashboard, DollarSign, BarChart3, FileText, ClipboardList,
  Bell, ChevronDown
} from 'lucide-react';

const navItems = {
  admin: [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'students', label: 'All Students', icon: Users },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'assessments', label: 'Assessments', icon: ClipboardList },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
  ],
  teacher: [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'students', label: 'My Students', icon: Users },
    { id: 'assessments', label: 'Record Assessment', icon: ClipboardList },
    { id: 'performance', label: 'Subject Performance', icon: BarChart3 },
  ],
  parent: [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'children', label: 'My Children', icon: Users },
    { id: 'fees', label: 'Fee Details', icon: DollarSign },
    { id: 'performance', label: 'Academic Progress', icon: BarChart3 },
  ],
};

const roleConfig = {
  admin: { label: 'Administrator', color: 'from-blue-600 to-indigo-700', bg: 'bg-blue-50', text: 'text-blue-700', icon: Shield },
  teacher: { label: 'Teacher', color: 'from-emerald-600 to-teal-700', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: BookOpen },
  parent: { label: 'Parent', color: 'from-purple-600 to-pink-700', bg: 'bg-purple-50', text: 'text-purple-700', icon: Users },
};

export default function Layout({ children, activeTab, onTabChange }: {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  if (!user) return null;
  const config = roleConfig[user.role];
  const items = navItems[user.role];
  const RoleIcon = config.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200/40">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-black text-gray-900 text-lg leading-tight">GoldenKey</h1>
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Elite SMS</p>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Role Badge */}
          <div className="px-4 py-3">
            <div className={`${config.bg} rounded-xl p-3 flex items-center gap-2.5`}>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                <RoleIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className={`text-xs font-bold ${config.text}`}>{config.label}</div>
                <div className="text-[10px] text-gray-500">{user.username}</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
            {items.map(item => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { onTabChange(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700">
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-bold text-gray-800 capitalize">{activeTab.replace(/-/g, ' ')}</h2>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center text-white text-xs font-bold`}>
                    {user.username.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 hidden sm:block">{user.username}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <div className="font-semibold text-sm text-gray-800">{user.username}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                      <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
