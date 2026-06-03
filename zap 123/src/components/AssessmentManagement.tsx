import { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Sparkles, Search, Trash2, Filter } from 'lucide-react';
import { getCBCLevel, generateAIComment } from '../data/mockData';
import type { Term } from '../types';

export default function AssessmentManagement() {
  const { students, assessments, addAssessment, deleteAssessment, addAuditLog } = useData();
  const [form, setForm] = useState({ studentId: 0, subject: '', score: '', term: 'Term 1' as Term, year: 2024, comments: '' });
  const [aiLoading, setAiLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterTerm, setFilterTerm] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const subjects = ['Mathematics', 'English', 'Kiswahili', 'Integrated Science', 'Social Studies', 'CRE', 'Creative Arts', 'Physical Education'];
  const terms: Term[] = ['Term 1', 'Term 2', 'Term 3'];

  const filtered = useMemo(() => {
    return [...assessments].filter(a => {
      const student = students.find(s => s.id === a.studentId);
      const name = student ? `${student.firstName} ${student.lastName}`.toLowerCase() : '';
      const matchSearch = !search || name.includes(search.toLowerCase()) || a.subject.toLowerCase().includes(search.toLowerCase());
      const matchSubject = !filterSubject || a.subject === filterSubject;
      const matchTerm = !filterTerm || a.term === filterTerm;
      return matchSearch && matchSubject && matchTerm;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [assessments, students, search, filterSubject, filterTerm]);

  const score = Number(form.score);
  const previewLevel = form.score ? getCBCLevel(score) : null;

  const handleAIComment = async () => {
    if (!form.studentId || !form.subject || !form.score) return;
    setAiLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const student = students.find(s => s.id === form.studentId);
    if (student) {
      const level = getCBCLevel(score);
      const comment = generateAIComment(`${student.firstName} ${student.lastName}`, form.subject, score, level);
      setForm(prev => ({ ...prev, comments: comment }));
      addAuditLog({ userId: 1, userName: 'Admin', action: 'AI_COMMENT', details: `Generated AI comment for ${student.firstName} ${student.lastName} - ${form.subject}` });
    }
    setAiLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.subject || !form.score) return;
    const level = getCBCLevel(score);
    addAssessment({
      studentId: form.studentId, subject: form.subject, score, level, term: form.term, year: form.year,
      teacherComments: form.comments, createdAt: new Date().toISOString().split('T')[0],
    });
    const student = students.find(s => s.id === form.studentId);
    addAuditLog({ userId: 1, userName: 'Admin', action: 'CREATE_ASSESSMENT', details: `Assessment for ${student?.firstName} ${student?.lastName} - ${form.subject} (${score}/100)` });
    setSuccessMsg('Assessment saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
    setForm({ studentId: 0, subject: '', score: '', term: 'Term 1', year: 2024, comments: '' });
  };

  const handleDelete = (id: number) => {
    deleteAssessment(id);
    addAuditLog({ userId: 1, userName: 'Admin', action: 'DELETE_ASSESSMENT', details: `Deleted assessment #${id}` });
  };

  const getStudentName = (id: number) => {
    const s = students.find(s => s.id === id);
    return s ? `${s.firstName} ${s.lastName}` : 'Unknown';
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = { 'EE': 'bg-emerald-100 text-emerald-700', 'ME': 'bg-blue-100 text-blue-700', 'AE': 'bg-amber-100 text-amber-700', 'BE': 'bg-red-100 text-red-700' };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  const getLevelName = (level: string) => {
    const names: Record<string, string> = { 'EE': 'Exceeding', 'ME': 'Meeting', 'AE': 'Approaching', 'BE': 'Below' };
    return names[level] || level;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assessment Management</h1>
        <p className="text-gray-500 text-sm">Record assessments with AI-powered CBC comments</p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium animate-fadeIn">
          ✅ {successMsg}
        </div>
      )}

      {/* Recording Form */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm">📝</span>
          Record New Assessment
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Student *</label>
              <select required value={form.studentId} onChange={e => setForm({ ...form, studentId: Number(e.target.value) })}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
                <option value={0}>Select Student</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.currentClass})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subject *</label>
              <select required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Score (0-100) *</label>
              <input type="number" min={0} max={100} required value={form.score} onChange={e => setForm({ ...form, score: e.target.value })}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
              {previewLevel && (
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${getLevelColor(previewLevel)}`}>
                  {previewLevel} - {getLevelName(previewLevel)}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Term</label>
                <select value={form.term} onChange={e => setForm({ ...form, term: e.target.value as Term })}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
                  {terms.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
                <input type="number" value={form.year} onChange={e => setForm({ ...form, year: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
              </div>
            </div>
          </div>

          {/* AI Comment */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-semibold text-gray-700">Teacher Comments</label>
              <button type="button" onClick={handleAIComment} disabled={aiLoading || !form.studentId || !form.subject || !form.score}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md">
                <Sparkles className="w-4 h-4" />
                {aiLoading ? 'Generating...' : '🤖 AI Comment'}
              </button>
            </div>
            <textarea value={form.comments} onChange={e => setForm({ ...form, comments: e.target.value })} rows={3}
              placeholder="Click 'AI Comment' to auto-generate, or type manually..."
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none resize-vertical" />
          </div>

          <button type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md">
            💾 Save Assessment
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by student or subject..."
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)}
            className="flex-1 sm:flex-none px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterTerm} onChange={e => setFilterTerm(e.target.value)}
            className="flex-1 sm:flex-none px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
            <option value="">All Terms</option>
            {terms.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Assessments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Student</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Score</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Level</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Term</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Comments</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No assessments found</td></tr>
              ) : filtered.map(a => (
                <tr key={a.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="px-6 py-3 font-semibold text-sm">{getStudentName(a.studentId)}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{a.subject}</td>
                  <td className="px-6 py-3 text-center">
                    <span className="font-bold text-gray-900">{a.score}</span>
                    <span className="text-gray-400">/100</span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getLevelColor(a.level)}`}>
                      {a.level}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{a.term} {a.year}</td>
                  <td className="px-6 py-3 text-sm text-gray-500 max-w-xs truncate">{a.teacherComments || '—'}</td>
                  <td className="px-6 py-3 text-center">
                    <button onClick={() => handleDelete(a.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 text-sm text-gray-500 flex items-center gap-2">
          <Filter className="w-4 h-4" /> Showing {filtered.length} of {assessments.length} assessments
        </div>
      </div>
    </div>
  );
}
