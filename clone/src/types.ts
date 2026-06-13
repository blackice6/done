export type Role = 'admin' | 'teacher' | 'parent';

export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: Role;
  avatar?: string;
}

export interface Student {
  id: number;
  admNumber: string;
  firstName: string;
  lastName: string;
  currentClass: string;
  feeBalance: number;
  parentId: number;
  photoUrl?: string;
}

export interface Assessment {
  id: number;
  studentId: number;
  subject: string;
  score: number;
  level: 'EE' | 'ME' | 'AE' | 'BE';
  term: 'Term1' | 'Term2' | 'Term3';
  year: number;
  teacherComments: string;
  teacherId: number;
}

export interface Payment {
  id: number;
  studentId: number;
  amount: number;
  mpesaCode: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  method: string;
}

export interface AuditLog {
  id: number;
  userId: number;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  teacherId: number;
  studentCount: number;
}

export type TeacherStatus = 'active' | 'inactive';

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
