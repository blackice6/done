export type Role = 'admin' | 'teacher' | 'parent';
export type CBCLevel = 'EE' | 'ME' | 'AE' | 'BE';
export type Term = 'Term 1' | 'Term 2' | 'Term 3';
export type Gender = 'Male' | 'Female';
export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type PaymentMethod = 'M-Pesa' | 'Cash' | 'Bank Transfer';
export type TeacherStatus = 'active' | 'inactive';

export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  isActive: boolean;
}

export interface Student {
  id: number;
  admNumber: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;
  currentClass: string;
  feeBalance: number;
  parentId: number;
  admissionDate: string;
}

export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subjects: string[];
  assignedClass: string;
  status: TeacherStatus;
  joinDate: string;
}

export interface SchoolClass {
  id: number;
  name: string;
  grade: number;
  stream: string;
  teacherId: number;
  capacity: number;
}

export interface Assessment {
  id: number;
  studentId: number;
  subject: string;
  score: number;
  level: CBCLevel;
  term: Term;
  year: number;
  teacherComments: string;
  createdAt: string;
}

export interface Payment {
  id: number;
  studentId: number;
  amount: number;
  mpesaCode: string;
  status: PaymentStatus;
  method: PaymentMethod;
  createdAt: string;
  description: string;
}

export interface AuditLog {
  id: number;
  userId: number;
  userName: string;
  action: string;
  details: string;
  createdAt: string;
}

export interface SchoolSettings {
  name: string;
  motto: string;
  address: string;
  phone: string;
  email: string;
  county: string;
  registrationNumber: string;
  currentTerm: Term;
  currentYear: number;
  principalName: string;
  feeStructure: { grade: string; amount: number }[];
}

export type Page = 'dashboard' | 'students' | 'teachers' | 'classes' | 'assessments' | 'fees' | 'reports' | 'audit' | 'settings';
