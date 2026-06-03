import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Users, GraduationCap, DollarSign, PlusCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { students, users, addStudent, addTeacher } = useAppContext();
  
  const totalFees = students.reduce((acc, curr) => acc + curr.fee_balance, 0);
  const totalTeachers = users.filter(u => u.role === 'teacher').length;

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  
  const [studentForm, setStudentForm] = useState({ adm_number: '', first_name: '', last_name: '', current_class: '', parent_id: 3 });
  const [teacherForm, setTeacherForm] = useState({ name: '', email: '' });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent(studentForm);
    setShowAddStudent(false);
    setStudentForm({ adm_number: '', first_name: '', last_name: '', current_class: '', parent_id: 3 });
  };

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    addTeacher(teacherForm);
    setShowAddTeacher(false);
    setTeacherForm({ name: '', email: '' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Overview</h1>
        <div className="flex space-x-3">
          <button onClick={() => setShowAddTeacher(true)} className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors font-medium">
            <PlusCircle className="w-5 h-5 mr-2" />
            New Teacher
          </button>
          <button onClick={() => setShowAddStudent(true)} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm">
            <PlusCircle className="w-5 h-5 mr-2" />
            New Student
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{students.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-xl">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Teachers</p>
            <p className="text-2xl font-bold text-gray-900">{totalTeachers}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Fees Pending</p>
            <p className="text-2xl font-bold text-gray-900">KES {totalFees.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Recent Students</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ADM</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Bal</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map(s => (
                  <tr key={s.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{s.adm_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.first_name} {s.last_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.current_class}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">KES {s.fee_balance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Teachers Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Staff Members</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.filter(u => u.role !== 'admin').map(u => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        u.role === 'teacher' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddStudent && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Student</h2>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <input type="text" placeholder="ADM Number" required
                value={studentForm.adm_number} onChange={e => setStudentForm({...studentForm, adm_number: e.target.value})}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500" />
              <input type="text" placeholder="First Name" required
                value={studentForm.first_name} onChange={e => setStudentForm({...studentForm, first_name: e.target.value})}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500" />
              <input type="text" placeholder="Last Name" required
                value={studentForm.last_name} onChange={e => setStudentForm({...studentForm, last_name: e.target.value})}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500" />
              <input type="text" placeholder="Class (e.g. Grade 4)" required
                value={studentForm.current_class} onChange={e => setStudentForm({...studentForm, current_class: e.target.value})}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500" />
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowAddStudent(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddTeacher && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Teacher</h2>
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <input type="text" placeholder="Full Name" required
                value={teacherForm.name} onChange={e => setTeacherForm({...teacherForm, name: e.target.value})}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500" />
              <input type="email" placeholder="Email Address" required
                value={teacherForm.email} onChange={e => setTeacherForm({...teacherForm, email: e.target.value})}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500" />
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowAddTeacher(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium">Save Teacher</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
