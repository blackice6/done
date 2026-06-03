import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Sparkles, Save, BookOpen, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
  const { students, addAssessment, generateAIComment } = useAppContext();
  
  const [formData, setFormData] = useState({
    student_id: '',
    subject: '',
    score: '',
    term: 'Term1',
    year: new Date().getFullYear(),
    teacher_comments: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleGenerateAI = async () => {
    if (!formData.student_id || !formData.subject || !formData.score) {
      toast.error('Please select student, subject, and score first');
      return;
    }

    setLoading(true);
    try {
      const student = students.find(s => s.id === parseInt(formData.student_id));
      if (!student) throw new Error('Student not found');

      const name = `${student.first_name} ${student.last_name}`;
      const comment = await generateAIComment(name, formData.subject, parseInt(formData.score));
      
      setFormData(prev => ({ ...prev, teacher_comments: comment }));
      toast.success('AI Comment Generated!');
    } catch (error) {
      toast.error('Failed to generate AI comment');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.student_id) return toast.error('Please select a student');

    addAssessment({
      student_id: parseInt(formData.student_id),
      subject: formData.subject,
      score: parseInt(formData.score),
      term: formData.term,
      year: formData.year,
      teacher_comments: formData.teacher_comments
    });

    setFormData({
      student_id: '',
      subject: '',
      score: '',
      term: 'Term1',
      year: new Date().getFullYear(),
      teacher_comments: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Teacher Dashboard</h1>
        <p className="text-gray-500 mt-2">Manage your students and record assessments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Students List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
          <div className="flex items-center mb-6">
            <GraduationCap className="w-6 h-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">My Students</h2>
          </div>
          
          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            {students.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No students enrolled yet.</p>
            ) : (
              students.map(s => (
                <div key={s.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{s.first_name} {s.last_name}</h3>
                      <p className="text-sm text-gray-500 font-medium mt-1">{s.adm_number} • {s.current_class}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Active
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Assessment Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <BookOpen className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Record Assessment</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
              <select 
                value={formData.student_id}
                onChange={e => setFormData({...formData, student_id: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                required
              >
                <option value="">Select a student...</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.adm_number})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                  placeholder="e.g. Mathematics"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Score (0-100)</label>
                <input 
                  type="number" 
                  min="0" max="100"
                  value={formData.score}
                  onChange={e => setFormData({...formData, score: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                  placeholder="85"
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
                <select 
                  value={formData.term}
                  onChange={e => setFormData({...formData, term: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                >
                  <option value="Term1">Term 1</option>
                  <option value="Term2">Term 2</option>
                  <option value="Term3">Term 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input 
                  type="number" 
                  value={formData.year}
                  onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                  required 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-sm font-medium text-gray-700">Teacher Comments</label>
                <button 
                  type="button" 
                  onClick={handleGenerateAI}
                  disabled={loading}
                  className="text-sm flex items-center text-purple-600 hover:text-purple-800 font-bold bg-purple-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  {loading ? 'Generating...' : 'AI Generate'}
                </button>
              </div>
              <textarea 
                value={formData.teacher_comments}
                onChange={e => setFormData({...formData, teacher_comments: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50 resize-none"
                placeholder="Enter comments or generate using AI..."
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold text-lg transition-colors shadow-md flex justify-center items-center"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Assessment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
