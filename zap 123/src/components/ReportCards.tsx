import { useState, useMemo, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { Printer, FileText } from 'lucide-react';
import type { Term } from '../types';

export default function ReportCards() {
  const { students, assessments, settings } = useData();
  const [selectedStudent, setSelectedStudent] = useState(0);
  const [selectedTerm, setSelectedTerm] = useState<Term>('Term 1');
  const [selectedYear, setSelectedYear] = useState(2024);
  const reportRef = useRef<HTMLDivElement>(null);

  const terms: Term[] = ['Term 1', 'Term 2', 'Term 3'];

  const studentAssessments = useMemo(() => {
    if (!selectedStudent) return [];
    return assessments.filter(a => a.studentId === selectedStudent && a.term === selectedTerm && a.year === selectedYear);
  }, [assessments, selectedStudent, selectedTerm, selectedYear]);

  const student = students.find(s => s.id === selectedStudent);

  const averageScore = studentAssessments.length > 0
    ? Math.round(studentAssessments.reduce((s, a) => s + a.score, 0) / studentAssessments.length) : 0;

  const overallLevel = averageScore >= 80 ? 'EE' : averageScore >= 60 ? 'ME' : averageScore >= 40 ? 'AE' : 'BE';

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = { 'EE': 'bg-emerald-500 text-white', 'ME': 'bg-blue-500 text-white', 'AE': 'bg-amber-500 text-white', 'BE': 'bg-red-500 text-white' };
    return colors[level] || 'bg-gray-500 text-white';
  };

  const getLevelName = (level: string) => {
    const names: Record<string, string> = { 'EE': 'Exceeding Expectation', 'ME': 'Meeting Expectation', 'AE': 'Approaching Expectation', 'BE': 'Below Expectation' };
    return names[level] || level;
  };

  const handlePrint = () => {
    const printContents = reportRef.current?.innerHTML;
    if (!printContents) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Report Card - ${student?.firstName} ${student?.lastName}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #1f2937; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th, td { border: 1px solid #d1d5db; padding: 10px 14px; text-align: left; font-size: 14px; }
        th { background-color: #f9fafb; font-weight: 600; }
        .header { text-align: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 3px double #f59e0b; }
        .header h1 { margin: 0; font-size: 24px; color: #92400e; }
        .header p { margin: 4px 0; color: #6b7280; font-size: 14px; }
        .student-info { display: flex; justify-content: space-between; margin: 16px 0; padding: 12px; background: #fefce8; border-radius: 8px; }
        .badge-EE { background: #10b981; color: white; padding: 2px 10px; border-radius: 999px; font-weight: bold; font-size: 12px; }
        .badge-ME { background: #3b82f6; color: white; padding: 2px 10px; border-radius: 999px; font-weight: bold; font-size: 12px; }
        .badge-AE { background: #f59e0b; color: white; padding: 2px 10px; border-radius: 999px; font-weight: bold; font-size: 12px; }
        .badge-BE { background: #ef4444; color: white; padding: 2px 10px; border-radius: 999px; font-weight: bold; font-size: 12px; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 2px solid #e5e7eb; }
        .signature { margin-top: 50px; display: flex; justify-content: space-between; }
        .signature div { text-align: center; }
        .signature-line { border-top: 1px solid #9ca3af; width: 200px; margin-top: 40px; padding-top: 4px; }
      </style></head><body>
      ${printContents}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report Cards</h1>
          <p className="text-gray-500 text-sm">Generate and print CBC report cards</p>
        </div>
        {selectedStudent && studentAssessments.length > 0 && (
          <button onClick={handlePrint} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md no-print">
            <Printer className="w-5 h-5" /> Print Report Card
          </button>
        )}
      </div>

      {/* Selectors */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 no-print">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-500" /> Generate Report Card
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Student</label>
            <select value={selectedStudent} onChange={e => setSelectedStudent(Number(e.target.value))}
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
              <option value={0}>Select Student</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.currentClass})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Term</label>
            <select value={selectedTerm} onChange={e => setSelectedTerm(e.target.value as Term)}
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none bg-white">
              {terms.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
            <input type="number" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 outline-none" />
          </div>
        </div>
      </div>

      {/* Report Card */}
      {selectedStudent && student && (
        <div ref={reportRef} className="bg-white rounded-2xl shadow-lg border-2 border-amber-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 text-center border-b-4 border-amber-400">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl mb-3">
              <span className="text-2xl">🔑</span>
            </div>
            <h1 className="text-2xl font-extrabold text-amber-900">{settings.name}</h1>
            <p className="text-amber-700 text-sm italic mt-1">"{settings.motto}"</p>
            <p className="text-gray-500 text-xs mt-2">{settings.address} • {settings.county}</p>
            <p className="text-gray-500 text-xs">{settings.phone} • {settings.email}</p>
            <div className="mt-3 inline-block bg-amber-500 text-white px-4 py-1.5 rounded-full font-bold text-sm">
              CBC PROGRESS REPORT — {selectedTerm} {selectedYear}
            </div>
          </div>

          {/* Student Info */}
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-amber-50 p-4 rounded-xl mb-6">
              <div><span className="text-xs text-gray-500 block">Student Name</span><span className="font-bold text-sm">{student.firstName} {student.lastName}</span></div>
              <div><span className="text-xs text-gray-500 block">ADM Number</span><span className="font-bold text-sm">{student.admNumber}</span></div>
              <div><span className="text-xs text-gray-500 block">Class</span><span className="font-bold text-sm">{student.currentClass}</span></div>
              <div><span className="text-xs text-gray-500 block">Gender</span><span className="font-bold text-sm">{student.gender}</span></div>
            </div>

            {studentAssessments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No assessments recorded for this term</p>
                <p className="text-gray-400 text-sm mt-1">Record assessments in the Assessments section first</p>
              </div>
            ) : (
              <>
                {/* CBC Levels Legend */}
                <div className="flex flex-wrap gap-3 mb-4 text-xs">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500" /> EE - Exceeding Expectation (80-100)</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500" /> ME - Meeting Expectation (60-79)</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500" /> AE - Approaching (40-59)</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500" /> BE - Below Expectation (0-39)</span>
                </div>

                {/* Assessment Table */}
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Subject</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">Score</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">CBC Level</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Teacher's Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentAssessments.map((a, i) => (
                      <tr key={a.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-sm">{i + 1}</td>
                        <td className="px-4 py-3 text-sm font-semibold">{a.subject}</td>
                        <td className="px-4 py-3 text-center font-bold">{a.score}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getLevelColor(a.level)}`}>
                            {a.level}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{a.teacherComments || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-amber-50 font-bold">
                      <td className="px-4 py-3" colSpan={2}>Average Score</td>
                      <td className="px-4 py-3 text-center text-lg">{averageScore}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getLevelColor(overallLevel)}`}>
                          {overallLevel} — {getLevelName(overallLevel)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{getLevelName(overallLevel)}</td>
                    </tr>
                  </tfoot>
                </table>

                {/* Comments Section */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-blue-900 text-sm mb-2">Class Teacher's Remarks</h4>
                    <p className="text-sm text-gray-700">
                      {overallLevel === 'EE'
                        ? `${student.firstName} has shown outstanding performance across all subjects this term. Keep up the excellent work!`
                        : overallLevel === 'ME'
                        ? `${student.firstName} has demonstrated good understanding across subjects. Continue working hard to improve further.`
                        : overallLevel === 'AE'
                        ? `${student.firstName} is making progress but needs more effort in some areas. Additional support at home is recommended.`
                        : `${student.firstName} needs significant improvement. A parent-teacher meeting is strongly recommended to discuss support strategies.`
                      }
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <h4 className="font-bold text-purple-900 text-sm mb-2">Principal's Remarks</h4>
                    <p className="text-sm text-gray-700">
                      {overallLevel === 'EE'
                        ? 'Exceptional performance. This student is a role model for peers.'
                        : overallLevel === 'ME'
                        ? 'Satisfactory progress. Continue to encourage consistent effort.'
                        : 'We are committed to supporting this student\'s learning journey. Let us work together.'
                      }
                    </p>
                  </div>
                </div>

                {/* Signatures */}
                <div className="mt-8 flex justify-between items-end">
                  <div className="text-center">
                    <div className="w-48 border-t-2 border-gray-400 pt-2">
                      <p className="font-semibold text-sm">Class Teacher</p>
                      <p className="text-xs text-gray-500">Signature & Date</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-48 border-t-2 border-gray-400 pt-2">
                      <p className="font-semibold text-sm">{settings.principalName}</p>
                      <p className="text-xs text-gray-500">Principal — Signature & Date</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-400">Reg: {settings.registrationNumber} • Generated on {new Date().toLocaleDateString()}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {!selectedStudent && (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">Select a Student</h3>
          <p className="text-gray-400">Choose a student, term, and year above to generate their report card</p>
        </div>
      )}
    </div>
  );
}
