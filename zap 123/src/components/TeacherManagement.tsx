import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import type { Teacher, TeacherStatus } from '../types';

type ModalMode = 'add' | 'edit' | null;

const emptyForm = {
  firstName: '', lastName: '', email: '', phone: '',
  subjects: [] as string[], assignedClass: 'Grade 1', status: 'active' as TeacherStatus, joinDate: '',
};

export default function TeacherManagement() {
  const { teachers, classes, addTeacher, updateTeacher, deleteTeacher, addAuditLog } = useData();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modal, setModal] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Teacher | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [subjectInput, setSubjectInput] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return teachers.filter(t => {
      const name = `${t.firstName} ${t.lastName}`.toLowerCase();
      const matchSearch = !search || name.includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !filterStatus || t.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [teachers, search, filterStatus]);

  const gradeNames = classes.map(c => c.name);

  const openAdd = () => {
    setForm({ ...emptyForm, joinDate: new Date().toISOString().split('T')[0] });
    setSubjectInput('');
    setSelected(null);
    setModal('add');
  };

  const openEdit = (t: Teacher) => {
    setSelected(t);
    setForm({ firstName: t.firstName, lastName: t.lastName, email: t.email, phone: t.phone, subjects: t.subjects, assignedClass: t.assignedClass, status: t.status, joinDate: t.joinDate });
    setSubjectInput(t.subjects.join(', '));
    setModal('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subjects = subjectInput.split(',').map(s => s.trim()).filter(Boolean);
    const data = { ...form, subjects };
    if (modal === 'add') {
      addTeacher(data);
      addAuditLog({ userId: 1, userName: 'Admin', action: 'CREATE_TEACHER', details: `Registered teacher: ${form.firstName} ${form.lastName}` });
    } else if (modal === 'edit' && selected) {
      updateTeacher({ ...selected, ...data });
      addAuditLog({ userId: 1, userName: 'Admin', action: 'UPDATE_TEACHER', details: `Updated teacher: ${form.firstName} ${form.lastName}` });
    }
    setModal(null);
  };

  const handleDelete = (id: number) => {
    const t = teachers.find(x => x.id === id);
    deleteTeacher(id);
    if (t) addAuditLog({ userId: 1, userName: 'Admin', action: 'DELETE_TEACHER', details: `Deleted teacher: ${t.firstName} ${t.lastName}` });
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Management</h1>
          <p className="text-gray-500 text-sm">Manage teaching staff and assignments</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md">
          <Plus className="w-5 h-5" /> Add Teacher
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400 bg-white rounded-2xl">No teachers found</div>
        ) : filtered.map(t => (
          <div key={t.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg">
                  {t.firstName[0]}{t.lastName[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t.firstName} {t.lastName}</h4>
                  <p className="text-xs text-gray-500">{t.email}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${t.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                {t.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-medium">{t.phone}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Class</span><span className="font-medium">{t.assignedClass}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Joined</span><span className="font-medium">{t.joinDate}</span></div>
              <div>
                <span className="text-gray-500">Subjects:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {t.subjects.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <button onClick={() => openEdit(t)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-50 text-amber-700 font-semibold text-sm hover:bg-amber-100 transition-colors">
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button onClick={() => setConfirmDelete(t.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors">
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
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{modal === 'add' ? 'Add New Teacher' : 'Edit Teacher'}</h3>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                  <input required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name *</label>
                  <input required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
                  <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subjects (comma-separated) *</label>
                <input required value={subjectInput} onChange={e => setSubjectInput(e.target.value)} placeholder="e.g. Mathematics, Science"
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Assigned Class</label>
                  <select value={form.assignedClass} onChange={e => setForm({ ...form, assignedClass: e.target.value })}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
                    {gradeNames.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as TeacherStatus })}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Join Date</label>
                <input type="date" value={form.joinDate} onChange={e => setForm({ ...form, joinDate: e.target.value })}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 shadow-md">
                  {modal === 'add' ? 'Add Teacher' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
