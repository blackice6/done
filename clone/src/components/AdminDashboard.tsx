import React, { useState } from 'react';
import { students, payments, assessments, auditLogs, monthlyRevenue, subjectPerformance, classPerformance, users } from '../data/mockData';
import {
  Users, DollarSign, GraduationCap, AlertTriangle,
  Search, Download, Eye, CheckCircle, Clock, XCircle, Shield, Activity,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export default function AdminDashboard({ tab }: { tab: string }) {
  if (tab === 'students') return <StudentsTab />;
  if (tab === 'finance') return <FinanceTab />;
  if (tab === 'performance') return <PerformanceTab />;
  if (tab === 'assessments') return <AssessmentsTab />;
  if (tab === 'audit') return <AuditTab />;
  return <OverviewTab />;
}

function OverviewTab() {
  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const pendingFees = students.reduce((s, st) => s + st.feeBalance, 0);
  const totalStudents = students.length;
  const totalTeachers = users.filter(u => u.role === 'teacher').length;

  const cbcDistribution = [
    { name: 'Exceeding (EE)', value: assessments.filter(a => a.level === 'EE').length },
    { name: 'Meeting (ME)', value: assessments.filter(a => a.level === 'ME').length },
    { name: 'Approaching (AE)', value: assessments.filter(a => a.level === 'AE').length },
    { name: 'Below (BE)', value: assessments.filter(a => a.level === 'BE').length },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Students" value={totalStudents} color="bg-blue-500" trend="+12%" up />
        <StatCard icon={GraduationCap} label="Teachers" value={totalTeachers} color="bg-emerald-500" trend="+2" up />
        <StatCard icon={DollarSign} label="Total Revenue" value={`KES ${(totalRevenue).toLocaleString()}`} color="bg-amber-500" trend="+18%" up />
        <StatCard icon={AlertTriangle} label="Pending Fees" value={`KES ${pendingFees.toLocaleString()}`} color="bg-red-500" trend="5 students" up={false} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Revenue Collection (2024)</h3>
            <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Monthly</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000)}k`} />
              <Tooltip formatter={((v: number) => [`KES ${v.toLocaleString()}`, 'Revenue']) as any} />
              <Bar dataKey="amount" fill="url(#revGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CBC Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">CBC Level Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={cbcDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" label={({ percent }: any) => `${((percent ?? 0) * 100).toFixed(0)}%`}>
                {cbcDistribution.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Class Performance & Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Class Performance Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={classPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis dataKey="className" type="category" tick={{ fontSize: 11 }} width={100} />
              <Tooltip formatter={((v: number) => [`${v}%`, 'Avg Score']) as any} />
              <Bar dataKey="avgScore" fill="url(#classGrad)" radius={[0, 6, 6, 0]} />
              <defs>
                <linearGradient id="classGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Recent Activity</h3>
            <Activity className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-3 max-h-[250px] overflow-y-auto">
            {auditLogs.slice(0, 6).map(log => {
              const u = users.find(usr => usr.id === log.userId);
              return (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                    log.action.includes('LOGIN') ? 'bg-blue-500' :
                    log.action.includes('ASSESSMENT') || log.action.includes('AI') ? 'bg-emerald-500' :
                    log.action.includes('PAYMENT') ? 'bg-amber-500' : 'bg-purple-500'
                  }`}>
                    {u?.username.charAt(0) || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-800 truncate">{log.details}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{u?.username} • {log.timestamp}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentsTab() {
  const [search, setSearch] = useState('');
  const filtered = students.filter(s =>
    `${s.firstName} ${s.lastName} ${s.admNumber} ${s.currentClass}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">All Students ({students.length})</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search students..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Adm No.</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Class</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Fee Balance</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Score</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => {
                const studentAssessments = assessments.filter(a => a.studentId === s.id);
                const avg = studentAssessments.length > 0 ? Math.round(studentAssessments.reduce((sum, a) => sum + a.score, 0) / studentAssessments.length) : 0;
                return (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                          {s.firstName[0]}{s.lastName[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-gray-800">{s.firstName} {s.lastName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600 font-mono">{s.admNumber}</td>
                    <td className="px-5 py-3"><span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">{s.currentClass}</span></td>
                    <td className="px-5 py-3 text-sm font-semibold">
                      <span className={s.feeBalance > 0 ? 'text-red-600' : 'text-emerald-600'}>
                        KES {s.feeBalance.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${avg >= 70 ? 'bg-emerald-500' : avg >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${avg}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{avg}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FinanceTab() {
  const totalCollected = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const outstandingFees = students.reduce((s, st) => s + st.feeBalance, 0);

  const paymentStatusData = [
    { name: 'Completed', value: payments.filter(p => p.status === 'completed').length, color: '#10b981' },
    { name: 'Pending', value: payments.filter(p => p.status === 'pending').length, color: '#f59e0b' },
    { name: 'Failed', value: payments.filter(p => p.status === 'failed').length, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800">Financial Overview</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Total Collected</span>
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center"><DollarSign className="w-4 h-4 text-emerald-600" /></div>
          </div>
          <div className="text-2xl font-black text-emerald-600">KES {totalCollected.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600"><ArrowUpRight className="w-3 h-3" /> +18% from last term</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Pending Payments</span>
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center"><Clock className="w-4 h-4 text-amber-600" /></div>
          </div>
          <div className="text-2xl font-black text-amber-600">KES {totalPending.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">{payments.filter(p => p.status === 'pending').length} transaction(s)</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Outstanding Fees</span>
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-red-600" /></div>
          </div>
          <div className="text-2xl font-black text-red-600">KES {outstandingFees.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-1 text-xs text-red-500"><ArrowDownRight className="w-3 h-3" /> {students.filter(s => s.feeBalance > 0).length} students owe fees</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h4 className="font-bold text-gray-800 mb-4">All Transactions</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-2 text-xs font-bold text-gray-500 uppercase">Student</th>
                  <th className="text-left px-4 py-2 text-xs font-bold text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-4 py-2 text-xs font-bold text-gray-500 uppercase">M-Pesa Code</th>
                  <th className="text-left px-4 py-2 text-xs font-bold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-2 text-xs font-bold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map(p => {
                  const s = students.find(st => st.id === p.studentId);
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{s ? `${s.firstName} ${s.lastName}` : 'Unknown'}</td>
                      <td className="px-4 py-2.5 text-sm font-semibold">KES {p.amount.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-sm font-mono text-gray-600">{p.mpesaCode}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-500">{p.date}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          p.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                          p.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {p.status === 'completed' ? <CheckCircle className="w-3 h-3" /> :
                           p.status === 'pending' ? <Clock className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h4 className="font-bold text-gray-800 mb-4">Payment Status</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={paymentStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {paymentStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            <h5 className="text-xs font-bold text-gray-500 uppercase">Fee Defaulters</h5>
            {students.filter(s => s.feeBalance > 0).sort((a, b) => b.feeBalance - a.feeBalance).slice(0, 4).map(s => (
              <div key={s.id} className="flex items-center justify-between p-2 bg-red-50/50 rounded-lg">
                <span className="text-sm font-medium text-gray-800">{s.firstName} {s.lastName}</span>
                <span className="text-sm font-bold text-red-600">KES {s.feeBalance.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PerformanceTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800">School Performance Analysis</h3>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h4 className="font-bold text-gray-800 mb-4">Average Score by Subject</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="avgScore" fill="url(#subjGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="subjGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h4 className="font-bold text-gray-800 mb-4">CBC Level by Subject</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="EE" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="ME" stackId="a" fill="#3b82f6" />
              <Bar dataKey="AE" stackId="a" fill="#f59e0b" />
              <Bar dataKey="BE" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h4 className="font-bold text-gray-800 mb-4">Class vs Average Performance</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={classPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="className" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="avgScore" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6, fill: '#f59e0b' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h4 className="font-bold text-gray-800 mb-4">🏆 Top Performers (All Students)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {students.map(s => {
            const sa = assessments.filter(a => a.studentId === s.id);
            const avg = sa.length > 0 ? Math.round(sa.reduce((sum, a) => sum + a.score, 0) / sa.length) : 0;
            return (
              <div key={s.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                  {s.firstName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-800 truncate">{s.firstName} {s.lastName}</div>
                  <div className="text-xs text-gray-500">{s.currentClass}</div>
                </div>
                <div className={`text-lg font-black ${avg >= 70 ? 'text-emerald-600' : avg >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{avg}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AssessmentsTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800">All Assessments</h3>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Student</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Subject</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Score</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Level</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Term</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {assessments.map(a => {
                const s = students.find(st => st.id === a.studentId);
                return (
                  <tr key={a.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{s ? `${s.firstName} ${s.lastName}` : '—'}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-600">{a.subject}</td>
                    <td className="px-4 py-2.5 text-sm font-bold">{a.score}/100</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        a.level === 'EE' ? 'bg-emerald-100 text-emerald-700' :
                        a.level === 'ME' ? 'bg-blue-100 text-blue-700' :
                        a.level === 'AE' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {a.level === 'EE' ? 'Exceeding' : a.level === 'ME' ? 'Meeting' : a.level === 'AE' ? 'Approaching' : 'Below'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-sm text-gray-500">{a.term} {a.year}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-600 max-w-xs truncate">{a.teacherComments}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AuditTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800">Audit Logs</h3>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Timestamp</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">User</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Action</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Details</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {auditLogs.map(log => {
                const u = users.find(usr => usr.id === log.userId);
                return (
                  <tr key={log.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-2.5 text-sm text-gray-600 font-mono whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        u?.role === 'admin' ? 'bg-blue-50 text-blue-700' :
                        u?.role === 'teacher' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {u?.username || 'System'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        log.action.includes('LOGIN') ? 'bg-blue-100 text-blue-700' :
                        log.action.includes('CREATE') ? 'bg-emerald-100 text-emerald-700' :
                        log.action.includes('AI') ? 'bg-purple-100 text-purple-700' :
                        log.action.includes('PAYMENT') ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-sm text-gray-600 max-w-xs truncate">{log.details}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-400 font-mono">{log.ipAddress}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, trend, up }: {
  icon: React.ElementType; label: string; value: string | number; color: string; trend: string; up: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-2xl font-black text-gray-900">{value}</div>
      <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${up ? 'text-emerald-600' : 'text-red-500'}`}>
        {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {trend}
      </div>
    </div>
  );
}
