import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Search, Edit2, Trash2, X, Eye } from 'lucide-react';
import type { Student, Gender } from '../types';

type ModalMode = 'add' | 'edit' | 'view' | null;

const emptyForm = {
  admNumber: '', firstName: '', lastName: '', gender: 'Male' as Gender,
  dateOfBirth: '', currentClass: 'Grade 1', feeBalance: 0, parentId: 3, admissionDate: new Date().toISOString().split('T')[0],
};

export default function StudentManagement() {
  const { students, classes, addStudent, updateStudent, deleteStudent, addAuditLog } = useData();
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [modal, setModal] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Student | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return students.filter(s => {
      const name = `${s.firstName} ${s.lastName}`.toLowerCase();
      const matchSearch = !search || name.includes(search.toLowerCase()) || s.admNumber.toLowerCase().includes(search.toLowerCase());
      const matchClass = !filterClass || s.currentClass === filterClass;
      const matchGender = !filterGender || s.gender === filterGender;
      return matchSearch && matchClass && matchGender;
    });
  }, [students, search, filterClass, filterGender]);

  const openAdd = () => {
    const maxNum = students.length > 0 ? Math.max(...students.map(s => parseInt(s.admNumber.split('/').pop() || '0'))) + 1 : 1;
    setForm({ ...emptyForm, admNumber: `GK/2024/${String(maxNum).padStart(3, '0')}`, admissionDate: new Date().toISOString().split('T')[0] });
    setSelected(null);
    setModal('add');
  };

  const openEdit = (s: Student) => {
    setSelected(s);
    setForm({ admNumber: s.admNumber, firstName: s.firstName, lastName: s.lastName, gender: s.gender, dateOfBirth: s.dateOfBirth, currentClass: s.currentClass, feeBalance: s.feeBalance, parentId: s.parentId, admissionDate: s.admissionDate });
    setModal('edit');
  };

  const openView = (s: Student) => { setSelected(s); setModal('view'); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modal === 'add') {
      addStudent(form);
      addAuditLog({ userId: 1, userName: 'Admin', action: 'CREATE_STUDENT', details: `Registered student: ${form.firstName} ${form.lastName}` });
    } else if (modal === 'edit' && selected) {
      updateStudent({ ...selected, ...form });
      addAuditLog({ userId: 1, userName: 'Admin', action: 'UPDATE_STUDENT', details: `Updated student: ${form.firstName} ${form.lastName}` });
    }
    setModal(null);
  };

  const handleDelete = (id: number) => {
    const s = students.find(x => x.id === id);
    deleteStudent(id);
    if (s) addAuditLog({ userId: 1, userName: 'Admin', action: 'DELETE_STUDENT', details: `Deleted student: ${s.firstName} ${s.lastName}` });
    setConfirmDelete(null);
  };

  const gradeNames = classes.map(c => c.name);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-500 text-sm">Manage all enrolled students</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg">
          <Plus className="w-5 h-5" /> Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or ADM number..."
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all" />
        </div>
        <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
          className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
          <option value="">All Classes</option>
          {gradeNames.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={filterGender} onChange={e => setFilterGender(e.target.value)}
          className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ADM #</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fee Balance</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No students found</td></tr>
              ) : filtered.map(s => (
                <tr key={s.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${s.gender === 'Female' ? 'bg-pink-500' : 'bg-blue-500'}`}>
                        {s.firstName[0]}{s.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{s.firstName} {s.lastName}</p>
                        <p className="text-xs text-gray-400">DOB: {s.dateOfBirth}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{s.admNumber}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                      {s.gender}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{s.currentClass}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-semibold ${s.feeBalance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      KES {s.feeBalance.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openView(s)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => setConfirmDelete(s.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 text-sm text-gray-500">
          Showing {filtered.length} of {students.length} students
        </div>
      </div>

      {/* Delete Confirmation */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Student?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone. All associated data will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal === 'add' || modal === 'edit' ? (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{modal === 'add' ? 'Add New Student' : 'Edit Student'}</h3>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ADM Number *</label>
                  <input required value={form.admNumber} onChange={e => setForm({ ...form, admNumber: e.target.value })}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Gender *</label>
                  <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value as Gender })}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                  <input type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Admission Date</label>
                  <input type="date" value={form.admissionDate} onChange={e => setForm({ ...form, admissionDate: e.target.value })}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Class *</label>
                  <select required value={form.currentClass} onChange={e => setForm({ ...form, currentClass: e.target.value })}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
                    {gradeNames.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fee Balance</label>
                  <input type="number" value={form.feeBalance} onChange={e => setForm({ ...form, feeBalance: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 shadow-md">
                  {modal === 'add' ? 'Add Student' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* View Modal */}
      {modal === 'view' && selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Student Details</h3>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto ${selected.gender === 'Female' ? 'bg-pink-500' : 'bg-blue-500'}`}>
                {selected.firstName[0]}{selected.lastName[0]}
              </div>
              <h4 className="font-bold text-lg mt-3">{selected.firstName} {selected.lastName}</h4>
              <p className="text-gray-500 text-sm">{selected.admNumber} • {selected.currentClass}</p>
            </div>
            <div className="space-y-3">
              {[
                ['Gender', selected.gender],
                ['Date of Birth', selected.dateOfBirth],
                ['Admission Date', selected.admissionDate],
                ['Current Class', selected.currentClass],
                ['Fee Balance', `KES ${selected.feeBalance.toLocaleString()}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setModal(null)} className="w-full mt-6 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
