import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { students, assessments } from '../data/mockData';
import {
  Users, BookOpen, ClipboardList, Sparkles, Save, CheckCircle,
  BarChart3, Search
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const cbcLevels = [
  { level: 'EE', label: 'Exceeding Expectations', min: 80, color: 'bg-emerald-500', ring: 'ring-emerald-200' },
  { level: 'ME', label: 'Meeting Expectations', min: 60, color: 'bg-blue-500', ring: 'ring-blue-200' },
  { level: 'AE', label: 'Approaching Expectations', min: 40, color: 'bg-amber-500', ring: 'ring-amber-200' },
  { level: 'BE', label: 'Below Expectations', min: 0, color: 'bg-red-500', ring: 'ring-red-200' },
];

const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Kiswahili', 'CRE'];

const aiFallbackComments: Record<string, Record<string, string>> = {
  EE: {
    Mathematics: 'demonstrates excellent mastery in Mathematics and consistently exceeds expectations. The student shows remarkable analytical and problem-solving abilities that go beyond grade-level requirements.',
    English: 'shows outstanding proficiency in English language skills. Reading comprehension, creative writing, and grammar usage are all at an exceptional level.',
    Science: 'displays an exceptional understanding of scientific concepts. The student leads in experiments and demonstrates advanced inquiry skills.',
    'Social Studies': 'exhibits deep understanding of social studies concepts and actively contributes to class discussions about community and environment.',
    Kiswahili: 'anaonyesha ustadi wa hali ya juu katika Kiswahili. Mwanafunzi huyu anaelewa na kutumia lugha kwa ufasaha mkubwa.',
    CRE: 'demonstrates excellent understanding of Christian Religious Education concepts and applies moral values in daily life.',
  },
  ME: {
    Mathematics: 'shows good understanding in Mathematics and meets curriculum expectations. With continued practice, the student can achieve even higher levels of mastery.',
    English: 'meets expectations in English language skills. The student reads well and writes clearly with occasional support needed in advanced vocabulary.',
    Science: 'demonstrates adequate understanding of scientific concepts. Regular participation in practical activities will strengthen comprehension.',
    'Social Studies': 'meets curriculum expectations in Social Studies. The student participates actively in discussions and shows interest in learning.',
    Kiswahili: 'anafikia viwango vinavyohitajika katika Kiswahili. Mwanafunzi huyu anaweza kusoma na kuandika vizuri.',
    CRE: 'meets the expected outcomes in CRE. The student demonstrates good understanding of religious and moral teachings.',
  },
  AE: {
    Mathematics: 'is making progress in Mathematics and needs continued support. Focus on basic operations and problem-solving strategies would be beneficial.',
    English: 'is approaching expectations in English. Additional reading practice and vocabulary building exercises are recommended.',
    Science: 'is developing understanding in Science and would benefit from more hands-on learning experiences.',
    'Social Studies': 'is making progress in Social Studies and needs additional support to fully grasp key concepts.',
    Kiswahili: 'anaendelea kujifunza Kiswahili na anahitaji msaada zaidi katika kusoma na kuandika.',
    CRE: 'is making progress in CRE and would benefit from more engagement with the learning materials.',
  },
  BE: {
    Mathematics: 'requires additional practice in Mathematics to improve performance. A structured remedial program and parental support at home are strongly recommended.',
    English: 'requires significant additional support in English. Extra tutoring and reading practice at home are essential for improvement.',
    Science: 'needs substantial support in Science. One-on-one guidance and simplified learning materials are recommended.',
    'Social Studies': 'requires additional practice in Social Studies. Visual aids and simplified materials may help improve understanding.',
    Kiswahili: 'anahitaji msaada mkubwa katika Kiswahili. Tunapendekeza mazoezi zaidi nyumbani.',
    CRE: 'requires additional support in CRE to meet basic curriculum expectations.',
  },
};

function getCBCLevel(score: number): 'EE' | 'ME' | 'AE' | 'BE' {
  if (score >= 80) return 'EE';
  if (score >= 60) return 'ME';
  if (score >= 40) return 'AE';
  return 'BE';
}

export default function TeacherDashboard({ tab }: { tab: string }) {
  const { user } = useAuth();
  if (!user) return null;

  const teacherId = user.id;
  const teacherAssessments = assessments.filter(a => a.teacherId === teacherId);
  const teacherSubjectSet = [...new Set(teacherAssessments.map(a => a.subject))];
  const teacherStudentIds = [...new Set(teacherAssessments.map(a => a.studentId))];
  const teacherStudents = students.filter(s => teacherStudentIds.includes(s.id));

  if (tab === 'students') return <StudentsTab teacherStudents={teacherStudents} teacherAssessments={teacherAssessments} />;
  if (tab === 'assessments') return <AssessmentsTab teacherStudents={teacherStudents} />;
  if (tab === 'performance') return <PerformanceTab teacherAssessments={teacherAssessments} teacherSubjectSet={teacherSubjectSet} />;
  return <OverviewTab teacherStudents={teacherStudents} teacherAssessments={teacherAssessments} teacherSubjectSet={teacherSubjectSet} />;
}

function OverviewTab({ teacherStudents, teacherAssessments, teacherSubjectSet }: {
  teacherStudents: typeof students; teacherAssessments: typeof assessments; teacherSubjectSet: string[];
}) {
  const avgScore = teacherAssessments.length > 0
    ? Math.round(teacherAssessments.reduce((s, a) => s + a.score, 0) / teacherAssessments.length)
    : 0;

  const cbcDist = [
    { name: 'EE (Exceeding)', value: teacherAssessments.filter(a => a.level === 'EE').length },
    { name: 'ME (Meeting)', value: teacherAssessments.filter(a => a.level === 'ME').length },
    { name: 'AE (Approaching)', value: teacherAssessments.filter(a => a.level === 'AE').length },
    { name: 'BE (Below)', value: teacherAssessments.filter(a => a.level === 'BE').length },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} label="My Students" value={teacherStudents.length} color="bg-blue-500" />
        <StatCard icon={BookOpen} label="Subjects" value={teacherSubjectSet.length} color="bg-emerald-500" />
        <StatCard icon={ClipboardList} label="Assessments" value={teacherAssessments.length} color="bg-amber-500" />
        <StatCard icon={BarChart3} label="Average Score" value={`${avgScore}%`} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">My Students Performance</h3>
          <div className="space-y-3">
            {teacherStudents.map(s => {
              const sa = teacherAssessments.filter(a => a.studentId === s.id);
              const avg = sa.length > 0 ? Math.round(sa.reduce((sum, a) => sum + a.score, 0) / sa.length) : 0;
              return (
                <div key={s.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                    {s.firstName[0]}{s.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-800">{s.firstName} {s.lastName}</div>
                    <div className="text-xs text-gray-500">{s.currentClass}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${avg >= 70 ? 'bg-emerald-500' : avg >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${avg}%` }} />
                    </div>
                    <span className="text-sm font-bold text-gray-700 w-10 text-right">{avg}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">CBC Level Distribution</h3>
          {cbcDist.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={cbcDist} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" label={({ percent }: any) => `${((percent ?? 0) * 100).toFixed(0)}%`}>
                  {cbcDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">No data yet</div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2">
            {cbcLevels.map(cl => (
              <div key={cl.level} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${cl.color}`} />
                <span className="text-xs font-medium text-gray-700">{cl.level} — {cl.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentsTab({ teacherStudents, teacherAssessments }: { teacherStudents: typeof students; teacherAssessments: typeof assessments }) {
  const [search, setSearch] = useState('');
  const filtered = teacherStudents.filter(s =>
    `${s.firstName} ${s.lastName} ${s.admNumber} ${s.currentClass}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">My Students ({teacherStudents.length})</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(s => {
          const sa = teacherAssessments.filter(a => a.studentId === s.id);
          const avg = sa.length > 0 ? Math.round(sa.reduce((sum, a) => sum + a.score, 0) / sa.length) : 0;
          const level = getCBCLevel(avg);
          const levelInfo = cbcLevels.find(l => l.level === level)!;
          return (
            <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
                  {s.firstName[0]}{s.lastName[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-800">{s.firstName} {s.lastName}</div>
                  <div className="text-xs text-gray-500">{s.admNumber} • {s.currentClass}</div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">Average Score</span>
                <span className="text-lg font-black text-gray-800">{avg}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div className={`h-full rounded-full ${avg >= 70 ? 'bg-emerald-500' : avg >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${avg}%` }} />
              </div>

              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${levelInfo.color} text-white`}>
                <span className="w-2 h-2 bg-white/50 rounded-full" />
                {level} — {levelInfo.label}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                {sa.slice(0, 3).map(a => (
                  <div key={a.id} className="flex justify-between text-xs">
                    <span className="text-gray-600">{a.subject}</span>
                    <span className="font-semibold">{a.score}/100</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AssessmentsTab({ teacherStudents }: { teacherStudents: typeof students; _teacherId?: number }) {
  const [form, setForm] = useState({
    studentId: '', subject: '', score: '', term: 'Term1' as 'Term1' | 'Term2' | 'Term3', year: 2024, comments: ''
  });
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);

  const generateAIComment = () => {
    if (!form.subject || !form.score) return;
    setGenerating(true);
    setTimeout(() => {
      const score = parseInt(form.score);
      const level = getCBCLevel(score);
      const student = teacherStudents.find(s => s.id === parseInt(form.studentId));
      const name = student ? `${student.firstName}` : 'The student';
      const template = aiFallbackComments[level]?.[form.subject] || aiFallbackComments[level]?.Mathematics || 'demonstrates consistent effort in class.';
      const comment = `${name} ${template}`;
      setForm(prev => ({ ...prev, comments: comment }));
      setGenerating(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setForm({ studentId: '', subject: '', score: '', term: 'Term1', year: 2024, comments: '' });
  };

  const score = parseInt(form.score) || 0;
  const level = form.score ? getCBCLevel(score) : null;
  const levelInfo = level ? cbcLevels.find(l => l.level === level) : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-1">✨ Record Assessment</h3>
          <p className="text-sm text-gray-500 mb-5">Fill in details and use AI to generate comments</p>

          {saved && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-4 text-sm">
              <CheckCircle className="w-4 h-4" /> Assessment saved successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Student</label>
              <select
                value={form.studentId}
                onChange={e => setForm({ ...form, studentId: e.target.value })}
                className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all"
                required
              >
                <option value="">Select Student</option>
                {teacherStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admNumber})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
              <select
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Score (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.score}
                onChange={e => setForm({ ...form, score: e.target.value })}
                className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all"
                placeholder="Enter score"
                required
              />
              {level && levelInfo && (
                <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${levelInfo.color} text-white`}>
                  CBC Level: {level} — {levelInfo.label}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Term</label>
                <select
                  value={form.term}
                  onChange={e => setForm({ ...form, term: e.target.value as any })}
                  className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all"
                >
                  <option value="Term1">Term 1</option>
                  <option value="Term2">Term 2</option>
                  <option value="Term3">Term 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={e => setForm({ ...form, year: parseInt(e.target.value) })}
                  className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={generateAIComment}
              disabled={generating || !form.score || !form.subject}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-200/50 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {generating ? '🤖 Generating...' : '🤖 Generate AI Comment'}
            </button>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Teacher Comments</label>
              <textarea
                value={form.comments}
                onChange={e => setForm({ ...form, comments: e.target.value })}
                rows={4}
                className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all resize-vertical"
                placeholder="AI-generated comment will appear here. You can also edit manually."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-200/50 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" /> Save Assessment
            </button>
          </form>
        </div>

        {/* CBC Guide */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4">📊 CBC Grading Guide</h3>
            <div className="space-y-3">
              {cbcLevels.map(cl => (
                <div key={cl.level} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className={`w-12 h-12 ${cl.color} rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg`}>
                    {cl.level}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{cl.label}</div>
                    <div className="text-xs text-gray-500">{cl.min === 80 ? '80-100' : cl.min === 60 ? '60-79' : cl.min === 40 ? '40-59' : '0-39'} marks</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">AI Comment Generator</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Powered by advanced AI to generate professional, CBC-aligned teacher comments.
                  Select a student, enter the subject and score, then click "Generate AI Comment" for an instant, personalized remark.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PerformanceTab({ teacherAssessments, teacherSubjectSet }: { teacherAssessments: typeof assessments; teacherSubjectSet: string[] }) {
  const subjectData = teacherSubjectSet.map(subj => {
    const subAssess = teacherAssessments.filter(a => a.subject === subj);
    return {
      subject: subj,
      avg: subAssess.length > 0 ? Math.round(subAssess.reduce((s, a) => s + a.score, 0) / subAssess.length) : 0,
      count: subAssess.length,
      EE: subAssess.filter(a => a.level === 'EE').length,
      ME: subAssess.filter(a => a.level === 'ME').length,
      AE: subAssess.filter(a => a.level === 'AE').length,
      BE: subAssess.filter(a => a.level === 'BE').length,
    };
  });

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800">My Subject Performance</h3>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h4 className="font-bold text-gray-800 mb-4">Average Scores by Subject</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="avg" fill="url(#teacherGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="teacherGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h4 className="font-bold text-gray-800 mb-4">CBC Levels by Subject</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="EE" stackId="a" fill="#10b981" />
              <Bar dataKey="ME" stackId="a" fill="#3b82f6" />
              <Bar dataKey="AE" stackId="a" fill="#f59e0b" />
              <Bar dataKey="BE" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {subjectData.map(sd => (
          <div key={sd.subject} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-gray-800">{sd.subject}</h4>
              <span className="text-2xl font-black text-emerald-600">{sd.avg}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${sd.avg}%` }} />
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center p-2 bg-emerald-50 rounded-lg">
                <div className="text-lg font-black text-emerald-600">{sd.EE}</div>
                <div className="text-[10px] text-gray-500 font-medium">EE</div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-lg font-black text-blue-600">{sd.ME}</div>
                <div className="text-[10px] text-gray-500 font-medium">ME</div>
              </div>
              <div className="text-center p-2 bg-amber-50 rounded-lg">
                <div className="text-lg font-black text-amber-600">{sd.AE}</div>
                <div className="text-[10px] text-gray-500 font-medium">AE</div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded-lg">
                <div className="text-lg font-black text-red-600">{sd.BE}</div>
                <div className="text-[10px] text-gray-500 font-medium">BE</div>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-3">{sd.count} assessment(s) recorded</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: string | number; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-2xl font-black text-gray-900">{value}</div>
    </div>
  );
}
