import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CreditCard, FileText, UserCircle, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

const ParentDashboard = () => {
  const { user, students, assessments, payFees } = useAppContext();
  
  // Filter students belonging to this parent
  const myStudents = students.filter(s => s.parent_id === user?.id);
  
  const [selectedStudent, setSelectedStudent] = useState(myStudents.length > 0 ? myStudents[0] : null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [phone, setPhone] = useState('');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !paymentAmount) return;
    
    const amount = parseInt(paymentAmount);
    if (amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    payFees(selectedStudent.id, amount);
    setShowPayment(false);
    setPaymentAmount('');
    setPhone('');
  };

  const studentAssessments = selectedStudent 
    ? assessments.filter(a => a.student_id === selectedStudent.id) 
    : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Parent Portal</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
        </div>
      </div>

      {myStudents.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <UserCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">No students found</h3>
          <p className="text-gray-500 mt-2">Please contact administration to link your child's account.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Student Selector & Fee Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Select Child</h2>
              <div className="space-y-3">
                {myStudents.map(student => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedStudent?.id === student.id 
                        ? 'border-indigo-600 bg-indigo-50' 
                        : 'border-transparent bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-bold text-gray-900">{student.first_name} {student.last_name}</div>
                    <div className="text-sm text-gray-500">{student.current_class} • {student.adm_number}</div>
                  </button>
                ))}
              </div>
            </div>

            {selectedStudent && (
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold">Fee Status</h2>
                  <CreditCard className="w-6 h-6 text-indigo-200" />
                </div>
                
                <div className="mb-8">
                  <p className="text-indigo-200 text-sm mb-1">Current Balance</p>
                  <p className="text-4xl font-bold">KES {selectedStudent.fee_balance.toLocaleString()}</p>
                </div>

                <button 
                  onClick={() => setShowPayment(true)}
                  className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Pay via M-Pesa
                </button>
              </div>
            )}
          </div>

          {/* Academic Report */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center mb-6">
                <FileText className="w-6 h-6 text-green-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Academic Progress</h2>
              </div>
              
              {studentAssessments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p>No assessments recorded yet for this student.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {studentAssessments.map(assessment => (
                    <div key={assessment.id} className="p-5 border border-gray-100 rounded-xl bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{assessment.subject}</h3>
                          <p className="text-sm text-gray-500">{assessment.term} - {assessment.year}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                            assessment.level === 'EE' ? 'bg-green-100 text-green-800' :
                            assessment.level === 'ME' ? 'bg-blue-100 text-blue-800' :
                            assessment.level === 'AE' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {assessment.level} ({assessment.score}%)
                          </span>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm mt-3">
                        <p className="text-gray-700 italic text-sm">"{assessment.teacher_comments}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && selectedStudent && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-green-500 p-6 text-white text-center">
              <Smartphone className="w-12 h-12 mx-auto mb-2" />
              <h2 className="text-2xl font-bold">Lipa na M-Pesa</h2>
              <p className="text-green-100 mt-1">Pay for {selectedStudent.first_name}</p>
            </div>
            
            <form onSubmit={handlePayment} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">+254</span>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="712345678"
                    className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KES)</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  max={selectedStudent.fee_balance}
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  placeholder={selectedStudent.fee_balance.toString()}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 bg-gray-50"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 font-bold text-lg transition-colors shadow-md"
                >
                  Send STK Push
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowPayment(false)}
                  className="w-full py-3 mt-3 text-gray-500 hover:bg-gray-50 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
