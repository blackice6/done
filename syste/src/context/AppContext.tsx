import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

type Role = 'admin' | 'teacher' | 'parent';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Student {
  id: number;
  adm_number: string;
  first_name: string;
  last_name: string;
  current_class: string;
  fee_balance: number;
  parent_id: number;
}

export interface Assessment {
  id: number;
  student_id: number;
  subject: string;
  score: number;
  level: 'EE' | 'ME' | 'AE' | 'BE';
  term: string;
  year: number;
  teacher_comments: string;
}

export interface Payment {
  id: number;
  student_id: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  mpesa_code: string;
}

interface AppContextType {
  user: User | null;
  users: User[];
  students: Student[];
  assessments: Assessment[];
  payments: Payment[];
  login: (email: string) => void;
  logout: () => void;
  addStudent: (student: Omit<Student, 'id' | 'fee_balance'>) => void;
  addTeacher: (teacher: Omit<User, 'id' | 'role'>) => void;
  addAssessment: (assessment: Omit<Assessment, 'id' | 'level'>) => void;
  payFees: (studentId: number, amount: number) => void;
  generateAIComment: (studentName: string, subject: string, score: number) => Promise<string>;
}

const mockUsers: User[] = [
  { id: 1, name: 'Super Admin', email: 'admin@goldenkey.com', role: 'admin' },
  { id: 2, name: 'Jane Teacher', email: 'teacher@goldenkey.com', role: 'teacher' },
  { id: 3, name: 'John Parent', email: 'parent@goldenkey.com', role: 'parent' },
];

const mockStudents: Student[] = [
  { id: 1, adm_number: 'GK-001', first_name: 'Alice', last_name: 'Johnson', current_class: 'Grade 4', fee_balance: 15000, parent_id: 3 },
  { id: 2, adm_number: 'GK-002', first_name: 'Bob', last_name: 'Smith', current_class: 'Grade 5', fee_balance: 5000, parent_id: 3 },
];

const mockAssessments: Assessment[] = [
  { id: 1, student_id: 1, subject: 'Mathematics', score: 85, level: 'EE', term: 'Term1', year: 2024, teacher_comments: 'Alice demonstrates excellent mastery in Mathematics and consistently exceeds expectations.' }
];

const mockPayments: Payment[] = [
  { id: 1, student_id: 1, amount: 5000, status: 'completed', date: '2024-01-15', mpesa_code: 'SA12345678' }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [assessments, setAssessments] = useState<Assessment[]>(mockAssessments);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);

  const login = (email: string) => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      toast.success(`Welcome back, ${foundUser.name}!`);
    } else {
      toast.error('Invalid credentials (use admin@, teacher@, or parent@goldenkey.com)');
    }
  };

  const logout = () => {
    setUser(null);
    toast.success('Logged out successfully');
  };

  const addStudent = (studentData: Omit<Student, 'id' | 'fee_balance'>) => {
    const newStudent: Student = {
      ...studentData,
      id: students.length + 1,
      fee_balance: 20000, // Default fee
    };
    setStudents([...students, newStudent]);
    toast.success('Student added successfully');
  };

  const addTeacher = (teacherData: Omit<User, 'id' | 'role'>) => {
    const newTeacher: User = {
      ...teacherData,
      id: users.length + 1,
      role: 'teacher'
    };
    setUsers([...users, newTeacher]);
    toast.success('Teacher added successfully');
  };

  const getCBCLevel = (score: number) => {
    if (score >= 80) return 'EE';
    if (score >= 60) return 'ME';
    if (score >= 40) return 'AE';
    return 'BE';
  };

  const addAssessment = (assessmentData: Omit<Assessment, 'id' | 'level'>) => {
    const newAssessment: Assessment = {
      ...assessmentData,
      id: assessments.length + 1,
      level: getCBCLevel(assessmentData.score)
    };
    setAssessments([...assessments, newAssessment]);
    toast.success('Assessment saved successfully');
  };

  const payFees = (studentId: number, amount: number) => {
    toast.loading('Processing M-Pesa payment...', { id: 'mpesa' });
    setTimeout(() => {
      setStudents(students.map(s => 
        s.id === studentId ? { ...s, fee_balance: Math.max(0, s.fee_balance - amount) } : s
      ));
      const newPayment: Payment = {
        id: payments.length + 1,
        student_id: studentId,
        amount,
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
        mpesa_code: `MP${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      };
      setPayments([...payments, newPayment]);
      toast.success(`Payment of KES ${amount} successful!`, { id: 'mpesa' });
    }, 1500);
  };

  const generateAIComment = async (studentName: string, subject: string, score: number) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const level = getCBCLevel(score);
        const fallbacks = {
          "EE": `${studentName} demonstrates excellent mastery in ${subject} and consistently exceeds expectations. Keep up the phenomenal work!`,
          "ME": `${studentName} shows good understanding in ${subject} and meets curriculum expectations. More practice will yield even better results.`,
          "AE": `${studentName} is making progress in ${subject} and needs continued support at home and school.`,
          "BE": `${studentName} requires additional practice and targeted support in ${subject} to improve foundational skills.`
        };
        resolve(fallbacks[level] || "Keep up the good work!");
      }, 1000);
    });
  };

  return (
    <AppContext.Provider value={{
      user, users, students, assessments, payments,
      login, logout, addStudent, addTeacher, addAssessment, payFees, generateAIComment
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
