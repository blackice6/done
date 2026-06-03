import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { students, assessments, payments } from '../data/mockData';
import {
  Users, DollarSign, BarChart3,
  CheckCircle, Clock, XCircle, AlertTriangle, CreditCard, TrendingUp,
  BookOpen, FileText
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

function getCBCLevel(score: number): 'EE' | 'ME' | 'AE' | 'BE' {
  if (score >= 80) return 'EE';
  if (score >= 60) return 'ME';
  if (score >= 40) return 'AE';
  return 'BE';
}

const cbcInfo: Record<string, { label: string; color: string; bg: string; desc: string }> = {
  EE: { label: 'Exceeding Expectations', color: 'text-emerald-700', bg: 'bg-emerald-100', desc: 'Your child is performing above the expected level. Keep encouraging them!' },
  ME: { label: 'Meeting Expectations', color: 'text-blue-700', bg: 'bg-blue-100', desc: 'Your child is performing at the expected level. Good progress!' },
  AE: { label: 'Approaching Expectations', color: 'text-amber-700', bg: 'bg-amber-100', desc: 'Your child is working towards the expected level. Additional support may help.' },
  BE: { label: 'Below Expectations', color: 'text-red-700', bg: 'bg-red-100', desc: 'Your child needs additional support. Please work closely with the teacher.' },
};

export default function ParentDashboard({ tab }: { tab: string }) {
  const { user } = useAuth();
  if (!user) return null;

  // CRITICAL: Only show children belonging to THIS parent
  const myChildren = students.filter(s => s.parentId === user.id);

  if (myChildren.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Users className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-bold text-gray-600">No Children Registered</h3>
        <p className="text-gray-400 mt-2">Please contact the school administration.</p>
      </div>
    );
  }

  if (tab === 'fees') return <FeesTab myChildren={myChildren} />;
  if (tab === 'performance') return <PerformanceTab myChildren={myChildren} />;
  if (tab === 'children') return <ChildrenTab myChildren={myChildren} />;
  return <OverviewTab myChildren={myChildren} />;
}

function OverviewTab({ myChildren }: { myChildren: typeof students }) {
  const totalBalance = myChildren.reduce((s, c) => s + c.feeBalance, 0);
  const allAssessments = assessments.filter(a => myChildren.some(c => c.id === a.studentId));
  const avgScore = allAssessments.length > 0
    ? Math.round(allAssessments.reduce((s, a) => s + a.score, 0) / allAssessments.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} label="My Children" value={myChildren.length} color="bg-purple-500" />
        <StatCard icon={DollarSign} label="Total Fee Balance" value={`KES ${totalBalance.toLocaleString()}`} color={totalBalance > 0 ? 'bg-red-500' : 'bg-emerald-500'} />
        <StatCard icon={TrendingUp} label="Average Performance" value={`${avgScore}%`} color="bg-blue-500" />
        <StatCard icon={BookOpen} label="Assessments" value={allAssessments.length} color="bg-amber-500" />
      </div>

      {/* Children Cards */}
      <h3 className="text-lg font-bold text-gray-800">My Children</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {myChildren.map(child => {
          const childAssessments = assessments.filter(a => a.studentId === child.id);
          const childAvg = childAssessments.length > 0
            ? Math.round(childAssessments.reduce((s, a) => s + a.score, 0) / childAssessments.length)
            : 0;
          const level = getCBCLevel(childAvg);
          const info = cbcInfo[level];
          const childPayments = payments.filter(p => p.studentId === child.id && p.status === 'completed');
          const totalPaid = childPayments.reduce((s, p) => s + p.amount, 0);

          return (
            <div key={child.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white text-xl font-black backdrop-blur-sm">
                    {child.firstName[0]}{child.lastName[0]}
                  </div>
                  <div className="text-white">
                    <div className="font-bold text-lg">{child.firstName} {child.lastName}</div>
                    <div className="text-white/70 text-sm">{child.admNumber}</div>
                    <div className="text-white/70 text-sm">{child.currentClass}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {/* Performance */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-gray-500">Academic Performance</span>
                    <span className="text-lg font-black text-gray-800">{childAvg}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${
                      childAvg >= 70 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                      childAvg >= 50 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                      'bg-gradient-to-r from-red-400 to-red-500'
                    }`} style={{ width: `${childAvg}%` }} />
                  </div>
                  <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${info.bg} ${info.color}`}>
                    {level} — {info.label}
                  </div>
                </div>

                {/* Fees */}
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="text-xs text-gray-500">Fee Balance</div>
                    <div className={`text-lg font-black ${child.feeBalance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      KES {child.feeBalance.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Total Paid</div>
                    <div className="text-sm font-bold text-emerald-600">KES {totalPaid.toLocaleString()}</div>
                  </div>
                </div>

                {/* Recent Scores */}
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-gray-500">Recent Scores</div>
                  {childAssessments.slice(0, 3).map(a => (
                    <div key={a.id} className="flex justify-between items-center text-sm py-1">
                      <span className="text-gray-600">{a.subject}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{a.score}/100</span>
                        <span className={`w-2 h-2 rounded-full ${
                          a.level === 'EE' ? 'bg-emerald-500' :
                          a.level === 'ME' ? 'bg-blue-500' :
                          a.level === 'AE' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChildrenTab({ myChildren }: { myChildren: typeof students }) {
  const [selectedChild, setSelectedChild] = useState(myChildren[0]);

  const childAssessments = assessments.filter(a => a.studentId === selectedChild.id);
  const terms = [...new Set(childAssessments.map(a => a.term))];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {myChildren.map(child => (
          <button
            key={child.id}
            onClick={() => setSelectedChild(child)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              selectedChild.id === child.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-xs font-bold" style={{ color: selectedChild.id === child.id ? 'white' : '#6b7280' }}>
              {child.firstName[0]}
            </div>
            {child.firstName} {child.lastName}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
            {selectedChild.firstName[0]}{selectedChild.lastName[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{selectedChild.firstName} {selectedChild.lastName}</h3>
            <p className="text-gray-500">{selectedChild.admNumber} • {selectedChild.currentClass}</p>
          </div>
        </div>

        {terms.map(term => (
          <div key={term} className="mb-6">
            <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-500" />
              {term} Report
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-2 text-xs font-bold text-gray-500 uppercase">Subject</th>
                    <th className="text-left px-4 py-2 text-xs font-bold text-gray-500 uppercase">Score</th>
                    <th className="text-left px-4 py-2 text-xs font-bold text-gray-500 uppercase">Level</th>
                    <th className="text-left px-4 py-2 text-xs font-bold text-gray-500 uppercase">Teacher Comment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {childAssessments.filter(a => a.term === term).map(a => {
                    const info = cbcInfo[a.level];
                    return (
                      <tr key={a.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{a.subject}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${
                                a.level === 'EE' ? 'bg-emerald-500' :
                                a.level === 'ME' ? 'bg-blue-500' :
                                a.level === 'AE' ? 'bg-amber-500' : 'bg-red-500'
                              }`} style={{ width: `${a.score}%` }} />
                            </div>
                            <span className="text-sm font-bold">{a.score}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${info.bg} ${info.color}`}>
                            {a.level}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 max-w-sm">{a.teacherComments}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {childAssessments.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
            No assessments recorded yet for {selectedChild.firstName}
          </div>
        )}
      </div>
    </div>
  );
}

function FeesTab({ myChildren }: { myChildren: typeof students }) {
  const totalBalance = myChildren.reduce((s, c) => s + c.feeBalance, 0);
  const childPayments = payments.filter(p => myChildren.some(c => c.id === p.studentId));
  const totalPaid = childPayments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800">Fee Details</h3>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Paid</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">KES {totalPaid.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Outstanding Balance</span>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className={`text-2xl font-black ${totalBalance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            KES {totalBalance.toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Children</span>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <div className="space-y-1">
            {myChildren.map(c => (
              <div key={c.id} className="flex justify-between text-sm">
                <span className="text-gray-700">{c.firstName}</span>
                <span className={`font-semibold ${c.feeBalance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  KES {c.feeBalance.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-purple-500" />
          <h4 className="font-bold text-gray-800">Payment History</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-2 text-xs font-bold text-gray-500 uppercase">Child</th>
                <th className="text-left px-4 py-2 text-xs font-bold text-gray-500 uppercase">Amount</th>
                <th className="text-left px-4 py-2 text-xs font-bold text-gray-500 uppercase">M-Pesa Code</th>
                <th className="text-left px-4 py-2 text-xs font-bold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-2 text-xs font-bold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {childPayments.map(p => {
                const child = myChildren.find(c => c.id === p.studentId);
                return (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{child ? `${child.firstName} ${child.lastName}` : '—'}</td>
                    <td className="px-4 py-3 text-sm font-bold">KES {p.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{p.mpesaCode}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{p.date}</td>
                    <td className="px-4 py-3">
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

        {childPayments.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No payments recorded yet
          </div>
        )}
      </div>
    </div>
  );
}

function PerformanceTab({ myChildren }: { myChildren: typeof students }) {
  const [selectedChild, setSelectedChild] = useState(myChildren[0]);
  const childAssessments = assessments.filter(a => a.studentId === selectedChild.id);

  const subjectData = [...new Set(childAssessments.map(a => a.subject))].map(subj => {
    const subAssess = childAssessments.filter(a => a.subject === subj);
    return {
      subject: subj,
      score: subAssess.length > 0 ? Math.round(subAssess.reduce((s, a) => s + a.score, 0) / subAssess.length) : 0,
      fullMark: 100,
    };
  });

  const overallAvg = childAssessments.length > 0
    ? Math.round(childAssessments.reduce((s, a) => s + a.score, 0) / childAssessments.length)
    : 0;
  const overallLevel = getCBCLevel(overallAvg);
  const info = cbcInfo[overallLevel];

  return (
    <div className="space-y-6">
      {/* Child selector */}
      {myChildren.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {myChildren.map(child => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedChild.id === child.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {child.firstName} {child.lastName}
            </button>
          ))}
        </div>
      )}

      {/* Overall Performance */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
            {selectedChild.firstName[0]}{selectedChild.lastName[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{selectedChild.firstName} {selectedChild.lastName}</h3>
            <p className="text-gray-500">{selectedChild.admNumber} • {selectedChild.currentClass}</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-3xl font-black text-gray-900">{overallAvg}%</div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${info.bg} ${info.color}`}>
              {overallLevel} — {info.label}
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${info.bg} border border-opacity-20`}>
          <p className={`text-sm ${info.color}`}>
            💡 <strong>Teacher's Note:</strong> {info.desc}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h4 className="font-bold text-gray-800 mb-4">Subject Radar</h4>
          {subjectData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={subjectData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">No data available</div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h4 className="font-bold text-gray-800 mb-4">Subject Scores</h4>
          {subjectData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="score" fill="url(#parentGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="parentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6d28d9" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">No data available</div>
          )}
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h4 className="font-bold text-gray-800 mb-4">Detailed Assessment Results</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {childAssessments.map(a => {
            const levelInfo = cbcInfo[a.level];
            return (
              <div key={a.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-800">{a.subject}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${levelInfo.bg} ${levelInfo.color}`}>{a.level}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${
                      a.level === 'EE' ? 'bg-emerald-500' :
                      a.level === 'ME' ? 'bg-blue-500' :
                      a.level === 'AE' ? 'bg-amber-500' : 'bg-red-500'
                    }`} style={{ width: `${a.score}%` }} />
                  </div>
                  <span className="text-sm font-black text-gray-700">{a.score}%</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{a.teacherComments}</p>
                <div className="text-[10px] text-gray-400 mt-2">{a.term} {a.year}</div>
              </div>
            );
          })}
        </div>

        {childAssessments.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            No assessments recorded yet
          </div>
        )}
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
