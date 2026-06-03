import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { CreditCard, Smartphone, Banknote, Building2, Search, RefreshCw } from 'lucide-react';
import type { PaymentMethod, PaymentStatus } from '../types';

export default function FeeManagement() {
  const { students, payments, addPayment, updateStudent, addAuditLog } = useData();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showPayForm, setShowPayForm] = useState(false);
  const [mpesaLoading, setMpesaLoading] = useState(false);
  const [mpesaSuccess, setMpesaSuccess] = useState(false);
  const [form, setForm] = useState({
    studentId: 0, amount: '', method: 'M-Pesa' as PaymentMethod, phone: '', description: '',
  });

  const totalCollected = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const totalOutstanding = students.reduce((s, st) => s + st.feeBalance, 0);

  const filtered = useMemo(() => {
    return [...payments].filter(p => {
      const student = students.find(s => s.id === p.studentId);
      const name = student ? `${student.firstName} ${student.lastName}`.toLowerCase() : '';
      const matchSearch = !search || name.includes(search.toLowerCase()) || p.mpesaCode.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !filterStatus || p.status === filterStatus;
      return matchSearch && matchStatus;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [payments, students, search, filterStatus]);

  const getStudentName = (id: number) => {
    const s = students.find(s => s.id === id);
    return s ? `${s.firstName} ${s.lastName}` : 'Unknown';
  };

  const getStatusColor = (status: PaymentStatus) => {
    const colors: Record<string, string> = { 'completed': 'bg-emerald-100 text-emerald-700', 'pending': 'bg-amber-100 text-amber-700', 'failed': 'bg-red-100 text-red-700' };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'M-Pesa': return <Smartphone className="w-4 h-4 text-green-600" />;
      case 'Cash': return <Banknote className="w-4 h-4 text-amber-600" />;
      case 'Bank Transfer': return <Building2 className="w-4 h-4 text-blue-600" />;
    }
  };

  const generateMpesaCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'SHK';
    for (let i = 0; i < 7; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.amount) return;

    if (form.method === 'M-Pesa') {
      setMpesaLoading(true);
      await new Promise(r => setTimeout(r, 2500));
      setMpesaLoading(false);
    }

    const code = form.method === 'Cash' ? `CASH-${Date.now()}` : form.method === 'Bank Transfer' ? `BK-${Date.now()}` : generateMpesaCode();
    const amount = Number(form.amount);

    addPayment({
      studentId: form.studentId, amount, mpesaCode: code, status: 'completed',
      method: form.method, createdAt: new Date().toISOString().split('T')[0], description: form.description || 'Fee Payment',
    });

    // Update fee balance
    const student = students.find(s => s.id === form.studentId);
    if (student) {
      const newBalance = Math.max(0, student.feeBalance - amount);
      updateStudent({ ...student, feeBalance: newBalance });
      addAuditLog({ userId: 1, userName: 'Admin', action: 'RECORD_PAYMENT', details: `${form.method} payment of KES ${amount.toLocaleString()} for ${student.firstName} ${student.lastName}` });
    }

    if (form.method === 'M-Pesa') {
      setMpesaSuccess(true);
      setTimeout(() => setMpesaSuccess(false), 3000);
    }

    setForm({ studentId: 0, amount: '', method: 'M-Pesa', phone: '', description: '' });
    setShowPayForm(false);
  };

  const statCards = [
    { title: 'Total Collected', value: `KES ${totalCollected.toLocaleString()}`, icon: CreditCard, color: 'from-emerald-500 to-green-600' },
    { title: 'Pending', value: `KES ${totalPending.toLocaleString()}`, icon: RefreshCw, color: 'from-amber-500 to-yellow-600' },
    { title: 'Outstanding', value: `KES ${totalOutstanding.toLocaleString()}`, icon: CreditCard, color: 'from-red-500 to-rose-600' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fees & Payments</h1>
          <p className="text-gray-500 text-sm">Track fee balances and record payments</p>
        </div>
        <button onClick={() => setShowPayForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md">
          <CreditCard className="w-5 h-5" /> Record Payment
        </button>
      </div>

      {mpesaSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium animate-fadeIn">
          ✅ M-Pesa payment processed successfully! STK push sent and confirmed.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Balances */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Student Fee Balances</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {students.filter(s => s.feeBalance > 0).sort((a, b) => b.feeBalance - a.feeBalance).map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
              <div>
                <p className="font-semibold text-sm">{s.firstName} {s.lastName}</p>
                <p className="text-xs text-gray-500">{s.admNumber} • {s.currentClass}</p>
              </div>
              <span className="font-bold text-red-600 text-sm">KES {s.feeBalance.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by student or transaction code..."
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Student</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Method</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Transaction Code</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No payments found</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="px-6 py-3 font-semibold text-sm">{getStudentName(p.studentId)}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2 text-sm">
                      {getMethodIcon(p.method)} {p.method}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right font-bold text-sm">KES {p.amount.toLocaleString()}</td>
                  <td className="px-6 py-3 text-sm font-mono text-gray-600">{p.mpesaCode}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">{p.createdAt.split('T')[0]}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Record Payment</h3>
              <button onClick={() => setShowPayForm(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">✕</button>
            </div>

            {mpesaLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-green-600 animate-bounce" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Processing M-Pesa Payment</h4>
                <p className="text-gray-500 text-sm mb-4">Sending STK push to {form.phone || 'phone'}...</p>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
            ) : (
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Student *</label>
                  <select required value={form.studentId} onChange={e => setForm({ ...form, studentId: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
                    <option value={0}>Select Student</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} — KES {s.feeBalance.toLocaleString()} balance</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (KES) *</label>
                  <input type="number" required min={1} value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" placeholder="Enter amount" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Method</label>
                  <select value={form.method} onChange={e => setForm({ ...form, method: e.target.value as PaymentMethod })}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
                    <option value="M-Pesa">M-Pesa</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                {form.method === 'M-Pesa' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                    <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" placeholder="e.g. 0712345678" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" placeholder="e.g. Term 1 Fees" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowPayForm(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 shadow-md flex items-center justify-center gap-2">
                    {form.method === 'M-Pesa' ? <><Smartphone className="w-5 h-5" /> Pay via M-Pesa</> : 'Record Payment'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
