import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { GraduationCap, Users, BookOpen, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { students, teachers, classes, assessments, payments } = useData();

  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;
  const totalCollected = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalOutstanding = students.reduce((sum, s) => sum + s.feeBalance, 0);
  const totalExpected = totalCollected + totalOutstanding;
  const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

  const levelCounts = assessments.reduce((acc, a) => {
    acc[a.level] = (acc[a.level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const levelData = [
    { name: 'EE', label: 'Exceeding', value: levelCounts['EE'] || 0, fill: '#10b981' },
    { name: 'ME', label: 'Meeting', value: levelCounts['ME'] || 0, fill: '#3b82f6' },
    { name: 'AE', label: 'Approaching', value: levelCounts['AE'] || 0, fill: '#f59e0b' },
    { name: 'BE', label: 'Below', value: levelCounts['BE'] || 0, fill: '#ef4444' },
  ];

  const gradeData = classes.map(c => ({
    name: c.name.replace('Grade ', 'G'),
    students: students.filter(s => s.currentClass === c.name).length,
  }));

  const maleCount = students.filter(s => s.gender === 'Male').length;
  const femaleCount = students.filter(s => s.gender === 'Female').length;
  const genderData = [
    { name: 'Male', value: maleCount, fill: '#3b82f6' },
    { name: 'Female', value: femaleCount, fill: '#ec4899' },
  ];

  const recentAssessments = [...assessments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);
  const recentPayments = [...payments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);

  const getStudentName = (id: number) => {
    const s = students.find(s => s.id === id);
    return s ? `${s.firstName} ${s.lastName}` : 'Unknown';
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = { 'EE': 'bg-emerald-100 text-emerald-700', 'ME': 'bg-blue-100 text-blue-700', 'AE': 'bg-amber-100 text-amber-700', 'BE': 'bg-red-100 text-red-700' };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  const statCards = [
    { title: 'Total Students', value: totalStudents, icon: GraduationCap, gradient: 'from-blue-500 to-indigo-600' },
    { title: 'Total Teachers', value: totalTeachers, icon: Users, gradient: 'from-purple-500 to-violet-600' },
    { title: 'Active Classes', value: totalClasses, icon: BookOpen, gradient: 'from-emerald-500 to-teal-600' },
    { title: 'Fees Collected', value: `KES ${totalCollected.toLocaleString()}`, icon: CreditCard, gradient: 'from-amber-500 to-orange-600' },
    { title: 'Outstanding', value: `KES ${totalOutstanding.toLocaleString()}`, icon: AlertCircle, gradient: 'from-red-500 to-rose-600' },
    { title: 'Collection Rate', value: `${collectionRate}%`, icon: TrendingUp, gradient: 'from-teal-500 to-cyan-600' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Welcome back, {currentUser?.username}! 👋</h1>
        <p className="text-amber-100 mt-1">Here's an overview of your school's performance and activities.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-gray-500 font-medium">{card.title}</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">CBC Level Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={levelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 'bold' }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {levelData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={genderData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={5} dataKey="value"
                label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {genderData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Students per Grade</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={gradeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="students" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Recent Assessments</h3>
          <div className="space-y-2">
            {recentAssessments.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No assessments yet</p>
            ) : recentAssessments.map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate">{getStudentName(a.studentId)}</p>
                  <p className="text-xs text-gray-500">{a.subject} • {a.score}/100 • {a.term}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ml-2 flex-shrink-0 ${getLevelColor(a.level)}`}>
                  {a.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Recent Payments</h3>
          <div className="space-y-2">
            {recentPayments.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No payments yet</p>
            ) : recentPayments.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate">{getStudentName(p.studentId)}</p>
                  <p className="text-xs text-gray-500">{p.method} • {p.createdAt.split('T')[0]}</p>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <p className="font-bold text-sm">KES {p.amount.toLocaleString()}</p>
                  <span className={`text-xs font-semibold ${p.status === 'completed' ? 'text-emerald-600' : p.status === 'pending' ? 'text-amber-600' : 'text-red-600'}`}>
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
