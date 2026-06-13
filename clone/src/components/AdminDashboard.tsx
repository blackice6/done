import React, { useState } from 'react';
import type { Teacher, SchoolClass, TeacherStatus } from '../types';
import { students, payments, assessments, auditLogs, monthlyRevenue, subjectPerformance, classPerformance, users, teachers, classes } from '../data/mockData';
import {
  Users, DollarSign, GraduationCap, AlertTriangle,
  Search, Download, Eye, CheckCircle, Clock, XCircle, Shield, Activity, BookOpen,
  Edit2, Trash2, Plus,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export default function AdminDashboard({ tab }: { tab: string }) {
  if (tab === 'students') return <StudentsTab />;
  if (tab === 'teachers') return <TeacherManagementTab />;
  if (tab === 'classes') return <ClassManagementTab />;
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

function ClassManagementTab() {
  const [classList, setClassList] = useState<SchoolClass[]>(classes);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    grade: 1,
    stream: 'East',
    teacherId: teachers[0]?.id ?? 0,
    capacity: 30,
  });

  const openAdd = () => {
    setSelectedClass(null);
    setForm({ name: '', grade: classList.length + 1, stream: 'East', teacherId: teachers[0]?.id ?? 0, capacity: 30 });
    setModal('add');
  };

  const openEdit = (schoolClass: SchoolClass) => {
    setSelectedClass(schoolClass);
    setForm({ name: schoolClass.name, grade: schoolClass.grade, stream: schoolClass.stream, teacherId: schoolClass.teacherId, capacity: schoolClass.capacity });
    setModal('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modal === 'add') {
      const nextId = classList.length > 0 ? Math.max(...classList.map(c => c.id)) + 1 : 1;
      setClassList([...classList, { id: nextId, ...form }]);
    } else if (modal === 'edit' && selectedClass) {
      setClassList(classList.map(c => c.id === selectedClass.id ? { ...c, ...form } : c));
    }
    setModal(null);
  };

  const handleDelete = (id: number) => {
    setClassList(classList.filter(c => c.id !== id));
    setConfirmDelete(null);
  };

  const getTeacherName = (teacherId: number) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unassigned';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
          <p className="text-gray-500 text-sm">Create, edit, and organize school classes</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md">
          <BookOpen className="w-5 h-5" /> Add Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {classList.map(schoolClass => {
          const count = students.filter(student => student.currentClass === schoolClass.name).length;
          const utilization = Math.round((count / schoolClass.capacity) * 100);
          return (
            <div key={schoolClass.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-gray-500">Grade {schoolClass.grade}</div>
                  <h4 className="font-bold text-gray-900 text-lg">{schoolClass.name}</h4>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(schoolClass)} className="p-2 rounded-lg hover:bg-amber-50 text-amber-600"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => setConfirmDelete(schoolClass.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div>Stream: {schoolClass.stream}</div>
                <div>Teacher: {getTeacherName(schoolClass.teacherId)}</div>
                <div>Capacity: {schoolClass.capacity}</div>
                <div>{count} students enrolled</div>
              </div>
              <div className="mt-4 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className={`h-2 rounded-full ${utilization > 80 ? 'bg-red-500' : utilization > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(utilization, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Class?</h3>
            <p className="text-gray-500 text-sm mb-6">This will remove the class from the roster.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{modal === 'add' ? 'Add Class' : 'Edit Class'}</h3>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Class Name</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Grade</label>
                  <input type="number" required value={form.grade} onChange={e => setForm({ ...form, grade: Number(e.target.value) })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stream</label>
                  <input required value={form.stream} onChange={e => setForm({ ...form, stream: e.target.value })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Capacity</label>
                  <input type="number" required value={form.capacity} onChange={e => setForm({ ...form, capacity: Number(e.target.value) })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Class Teacher</label>
                <select value={form.teacherId} onChange={e => setForm({ ...form, teacherId: Number(e.target.value) })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.firstName} {teacher.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 shadow-md">{modal === 'add' ? 'Add Class' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TeacherManagementTab() {
  const [teacherList, setTeacherList] = useState<Teacher[]>(teachers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subjects: '',
    assignedClass: classes[0]?.name ?? '',
    status: 'active' as TeacherStatus,
    joinDate: new Date().toISOString().split('T')[0],
  });

  const filtered = teacherList.filter(t => {
    const searchValue = `${t.firstName} ${t.lastName} ${t.email}`.toLowerCase();
    return (!search || searchValue.includes(search.toLowerCase())) && (!statusFilter || t.status === statusFilter);
  });

  const openAdd = () => {
    setSelectedTeacher(null);
    setForm({ firstName: '', lastName: '', email: '', phone: '', subjects: '', assignedClass: classes[0]?.name ?? '', status: 'active', joinDate: new Date().toISOString().split('T')[0] });
    setModal('add');
  };

  const openEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setForm({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone,
      subjects: teacher.subjects.join(', '),
      assignedClass: teacher.assignedClass,
      status: teacher.status,
      joinDate: teacher.joinDate,
    });
    setModal('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subjects = form.subjects.split(',').map(item => item.trim()).filter(Boolean);
    if (modal === 'add') {
      const nextId = teacherList.length > 0 ? Math.max(...teacherList.map(t => t.id)) + 1 : 1;
      setTeacherList([...teacherList, { id: nextId, firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, subjects, assignedClass: form.assignedClass, status: form.status, joinDate: form.joinDate }]);
    } else if (modal === 'edit' && selectedTeacher) {
      setTeacherList(teacherList.map(t => t.id === selectedTeacher.id ? { ...t, firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, subjects, assignedClass: form.assignedClass, status: form.status, joinDate: form.joinDate } : t));
    }
    setModal(null);
  };

  const handleDelete = (id: number) => {
    setTeacherList(teacherList.filter(t => t.id !== id));
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Management</h1>
          <p className="text-gray-500 text-sm">Add, update, and manage teacher assignments</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md">
          <Plus className="w-5 h-5" /> Add Teacher
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teachers..." className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400 bg-white rounded-2xl">No teachers match your filters</div>
        ) : filtered.map(teacher => (
          <div key={teacher.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg">
                  {teacher.firstName[0]}{teacher.lastName[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{teacher.firstName} {teacher.lastName}</h4>
                  <p className="text-xs text-gray-500">{teacher.email}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${teacher.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                {teacher.status}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Phone: {teacher.phone}</div>
              <div>Assigned class: {teacher.assignedClass}</div>
              <div>Subjects: {teacher.subjects.join(', ')}</div>
              <div>Joined: {teacher.joinDate}</div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <button onClick={() => openEdit(teacher)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-50 text-amber-700 font-semibold text-sm hover:bg-amber-100 transition-colors">
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button onClick={() => setConfirmDelete(teacher.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Teacher?</h3>
            <p className="text-gray-500 text-sm mb-6">This will remove the teacher profile from the system.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{modal === 'add' ? 'Add Teacher' : 'Edit Teacher'}</h3>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                  <input required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                  <input required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subjects</label>
                <input value={form.subjects} onChange={e => setForm({ ...form, subjects: e.target.value })} placeholder="Math, English" className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Assigned Class</label>
                  <select value={form.assignedClass} onChange={e => setForm({ ...form, assignedClass: e.target.value })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
                    {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as TeacherStatus })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Join Date</label>
                <input type="date" value={form.joinDate} onChange={e => setForm({ ...form, joinDate: e.target.value })} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 shadow-md">{modal === 'add' ? 'Add Teacher' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
