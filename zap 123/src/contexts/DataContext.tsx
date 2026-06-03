import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Student, Teacher, SchoolClass, Assessment, Payment, AuditLog, SchoolSettings } from '../types';
import { initialStudents, initialTeachers, initialClasses, initialAssessments, initialPayments, initialAuditLogs, defaultSettings } from '../data/mockData';

function load<T>(key: string, initial: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  } catch {
    return initial;
  }
}

function persist<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function nextId(items: { id: number }[]): number {
  return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
}

interface DataContextType {
  students: Student[];
  teachers: Teacher[];
  classes: SchoolClass[];
  assessments: Assessment[];
  payments: Payment[];
  auditLogs: AuditLog[];
  settings: SchoolSettings;
  addStudent: (s: Omit<Student, 'id'>) => Student;
  updateStudent: (s: Student) => void;
  deleteStudent: (id: number) => void;
  addTeacher: (t: Omit<Teacher, 'id'>) => Teacher;
  updateTeacher: (t: Teacher) => void;
  deleteTeacher: (id: number) => void;
  addClass: (c: Omit<SchoolClass, 'id'>) => SchoolClass;
  updateClass: (c: SchoolClass) => void;
  deleteClass: (id: number) => void;
  addAssessment: (a: Omit<Assessment, 'id'>) => Assessment;
  deleteAssessment: (id: number) => void;
  addPayment: (p: Omit<Payment, 'id'>) => Payment;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'createdAt'>) => void;
  updateSettings: (s: SchoolSettings) => void;
  resetData: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(() => load('gk_students', initialStudents));
  const [teachers, setTeachers] = useState<Teacher[]>(() => load('gk_teachers', initialTeachers));
  const [classes, setClasses] = useState<SchoolClass[]>(() => load('gk_classes', initialClasses));
  const [assessments, setAssessments] = useState<Assessment[]>(() => load('gk_assessments', initialAssessments));
  const [payments, setPayments] = useState<Payment[]>(() => load('gk_payments', initialPayments));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => load('gk_auditLogs', initialAuditLogs));
  const [settings, setSettings] = useState<SchoolSettings>(() => load('gk_settings', defaultSettings));

  const addStudent = (data: Omit<Student, 'id'>) => {
    const s = { ...data, id: nextId(students) };
    const next = [...students, s];
    setStudents(next);
    persist('gk_students', next);
    return s;
  };
  const updateStudent = (s: Student) => {
    const next = students.map(x => x.id === s.id ? s : x);
    setStudents(next);
    persist('gk_students', next);
  };
  const deleteStudent = (id: number) => {
    const next = students.filter(x => x.id !== id);
    setStudents(next);
    persist('gk_students', next);
  };

  const addTeacher = (data: Omit<Teacher, 'id'>) => {
    const t = { ...data, id: nextId(teachers) };
    const next = [...teachers, t];
    setTeachers(next);
    persist('gk_teachers', next);
    return t;
  };
  const updateTeacher = (t: Teacher) => {
    const next = teachers.map(x => x.id === t.id ? t : x);
    setTeachers(next);
    persist('gk_teachers', next);
  };
  const deleteTeacher = (id: number) => {
    const next = teachers.filter(x => x.id !== id);
    setTeachers(next);
    persist('gk_teachers', next);
  };

  const addClass = (data: Omit<SchoolClass, 'id'>) => {
    const c = { ...data, id: nextId(classes) };
    const next = [...classes, c];
    setClasses(next);
    persist('gk_classes', next);
    return c;
  };
  const updateClass = (c: SchoolClass) => {
    const next = classes.map(x => x.id === c.id ? c : x);
    setClasses(next);
    persist('gk_classes', next);
  };
  const deleteClass = (id: number) => {
    const next = classes.filter(x => x.id !== id);
    setClasses(next);
    persist('gk_classes', next);
  };

  const addAssessment = (data: Omit<Assessment, 'id'>) => {
    const a = { ...data, id: nextId(assessments) };
    const next = [...assessments, a];
    setAssessments(next);
    persist('gk_assessments', next);
    return a;
  };
  const deleteAssessment = (id: number) => {
    const next = assessments.filter(x => x.id !== id);
    setAssessments(next);
    persist('gk_assessments', next);
  };

  const addPayment = (data: Omit<Payment, 'id'>) => {
    const p = { ...data, id: nextId(payments) };
    const next = [...payments, p];
    setPayments(next);
    persist('gk_payments', next);
    return p;
  };

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'createdAt'>) => {
    const entry: AuditLog = { ...log, id: nextId(auditLogs), createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19) };
    const next = [entry, ...auditLogs];
    setAuditLogs(next);
    persist('gk_auditLogs', next);
  };

  const updateSettings = (s: SchoolSettings) => {
    setSettings(s);
    persist('gk_settings', s);
  };

  const resetData = () => {
    setStudents(initialStudents);
    setTeachers(initialTeachers);
    setClasses(initialClasses);
    setAssessments(initialAssessments);
    setPayments(initialPayments);
    setAuditLogs(initialAuditLogs);
    setSettings(defaultSettings);
    persist('gk_students', initialStudents);
    persist('gk_teachers', initialTeachers);
    persist('gk_classes', initialClasses);
    persist('gk_assessments', initialAssessments);
    persist('gk_payments', initialPayments);
    persist('gk_auditLogs', initialAuditLogs);
    persist('gk_settings', defaultSettings);
  };

  return (
    <DataContext.Provider value={{
      students, teachers, classes, assessments, payments, auditLogs, settings,
      addStudent, updateStudent, deleteStudent,
      addTeacher, updateTeacher, deleteTeacher,
      addClass, updateClass, deleteClass,
      addAssessment, deleteAssessment,
      addPayment, addAuditLog, updateSettings, resetData,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
