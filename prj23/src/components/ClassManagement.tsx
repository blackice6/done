import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Edit2, Trash2, X, Users } from 'lucide-react';
import type { SchoolClass } from '../types';

export default function ClassManagement() {
  const { classes, teachers, students, addClass, updateClass, deleteClass, addAuditLog } = useData();
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<SchoolClass | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', grade: 1, stream: 'East', teacherId: 0, capacity: 40 });

  const getStudentCount = (className: string) => students.filter(s => s.currentClass === className).length;

  const openAdd = () => {
    setForm({ name: '', grade: classes.length + 1, stream: 'East', teacherId: 0, capacity: 40 });
    setSelected(null);
    setModal('add');
  };

  const openEdit = (c: SchoolClass) => {
    setSelected(c);
    setForm({ name: c.name, grade: c.grade, stream: c.stream, teacherId: c.teacherId, capacity: c.capacity });
    setModal('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modal === 'add') {
      addClass(form);
      addAuditLog({ userId: 1, userName: 'Admin', action: 'CREATE_CLASS', details: `Created class: ${form.name}` });
    } else if (modal === 'edit' && selected) {
      updateClass({ ...selected, ...form });
      addAuditLog({ userId: 1, userName: 'Admin', action: 'UPDATE_CLASS', details: `Updated class: ${form.name}` });
    }
    setModal(null);
  };

  const handleDelete = (id: number) => {
    const c = classes.find(x => x.id === id);
    deleteClass(id);
    if (c) addAuditLog({ userId: 1, userName: 'Admin', action: 'DELETE_CLASS', details: `Deleted class: ${c.name}` });
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
          <p className="text-gray-500 text-sm">Manage classes, streams, and teacher assignments</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md">
          <Plus className="w-5 h-5" /> Add Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {classes.map(c => {
          const count = getStudentCount(c.name);
          const teacher = teachers.find(t => t.id === c.teacherId);
          const utilization = Math.round((count / c.capacity) * 100);
          return (
            <div key={c.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                  {c.grade}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-amber-50 text-amber-600"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => setConfirmDelete(c.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <h4 className="font-bold text-gray-900 text-lg">{c.name}</h4>
              <p className="text-sm text-gray-500">Stream: {c.stream}</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{count} / {c.capacity} students</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${utilization > 80 ? 'bg-red-500' : utilization > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(utilization, 100)}%` }} />
                </div>
                {teacher && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold">
                      {teacher.firstName[0]}{teacher.lastName[0]}
                    </div>
                    <span className="text-gray-600">{teacher.firstName} {teacher.lastName}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Class?</h3>
            <p className="text-gray-500 text-sm mb-6">This will remove the class. Students in this class will not be deleted.</p>
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
              <h3 className="text-xl font-bold text-gray-900">{modal === 'add' ? 'Add New Class' : 'Edit Class'}</h3>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Class Name *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Grade 9"
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Grade Number</label>
                  <input type="number" value={form.grade} onChange={e => setForm({ ...form, grade: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stream</label>
                  <input value={form.stream} onChange={e => setForm({ ...form, stream: e.target.value })}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Capacity</label>
                  <input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Class Teacher</label>
                <select value={form.teacherId} onChange={e => setForm({ ...form, teacherId: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
                  <option value={0}>Select Teacher</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 shadow-md">
                  {modal === 'add' ? 'Add Class' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
