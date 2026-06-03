import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Shield, Search, Filter, LogIn, FileEdit, CreditCard, Sparkles, Trash2, Settings, Users } from 'lucide-react';

export default function AuditLogs() {
  const { auditLogs } = useData();
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('');

  const actionTypes = [...new Set(auditLogs.map(l => l.action))];

  const filtered = useMemo(() => {
    return [...auditLogs].filter(l => {
      const matchSearch = !search || l.userName.toLowerCase().includes(search.toLowerCase()) || l.details.toLowerCase().includes(search.toLowerCase());
      const matchAction = !filterAction || l.action === filterAction;
      return matchSearch && matchAction;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [auditLogs, search, filterAction]);

  const getActionIcon = (action: string) => {
    if (action.includes('LOGIN')) return <LogIn className="w-4 h-4 text-blue-500" />;
    if (action.includes('STUDENT')) return <Users className="w-4 h-4 text-emerald-500" />;
    if (action.includes('TEACHER')) return <Users className="w-4 h-4 text-purple-500" />;
    if (action.includes('ASSESSMENT')) return <FileEdit className="w-4 h-4 text-amber-500" />;
    if (action.includes('PAYMENT')) return <CreditCard className="w-4 h-4 text-green-500" />;
    if (action.includes('AI')) return <Sparkles className="w-4 h-4 text-pink-500" />;
    if (action.includes('DELETE')) return <Trash2 className="w-4 h-4 text-red-500" />;
    if (action.includes('SETTINGS')) return <Settings className="w-4 h-4 text-gray-500" />;
    return <Shield className="w-4 h-4 text-gray-400" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('LOGIN')) return 'bg-blue-50 border-blue-200';
    if (action.includes('CREATE') || action.includes('BATCH')) return 'bg-emerald-50 border-emerald-200';
    if (action.includes('UPDATE')) return 'bg-amber-50 border-amber-200';
    if (action.includes('DELETE')) return 'bg-red-50 border-red-200';
    if (action.includes('AI')) return 'bg-purple-50 border-purple-200';
    if (action.includes('PAYMENT')) return 'bg-green-50 border-green-200';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-500 text-sm">Track all system activities and changes</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs..."
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
        </div>
        <select value={filterAction} onChange={e => setFilterAction(e.target.value)}
          className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
          <option value="">All Actions</option>
          {actionTypes.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" /> Activity Log
          </h3>
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Filter className="w-4 h-4" /> {filtered.length} entries
          </span>
        </div>
        <div className="divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No audit logs found</div>
          ) : filtered.map(log => (
            <div key={log.id} className={`px-6 py-4 border-l-4 ${getActionColor(log.action)} hover:bg-gray-50 transition-colors`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">{getActionIcon(log.action)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-gray-900">{log.userName}</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-semibold text-gray-600">{log.action}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                  <p className="text-xs text-gray-400 mt-1">{log.createdAt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
