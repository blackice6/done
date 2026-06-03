import type { User, Student, Teacher, SchoolClass, Assessment, Payment, AuditLog, SchoolSettings } from '../types';

export const initialUsers: User[] = [
  { id: 1, username: 'Admin', email: 'admin@goldenkey.com', phone: '+254712345678', password: 'password123', role: 'admin', isActive: true },
  { id: 2, username: 'Teacher Grace', email: 'teacher@goldenkey.com', phone: '+254723456789', password: 'password123', role: 'teacher', isActive: true },
  { id: 3, username: 'Parent Kamau', email: 'parent@goldenkey.com', phone: '+254734567890', password: 'password123', role: 'parent', isActive: true },
];

export const initialStudents: Student[] = [
  { id: 1, admNumber: 'GK/2024/001', firstName: 'Wanjiku', lastName: 'Kamau', gender: 'Female', dateOfBirth: '2018-03-15', currentClass: 'Grade 1', feeBalance: 5000, parentId: 3, admissionDate: '2024-01-15' },
  { id: 2, admNumber: 'GK/2024/002', firstName: 'Brian', lastName: 'Otieno', gender: 'Male', dateOfBirth: '2018-07-22', currentClass: 'Grade 1', feeBalance: 12000, parentId: 3, admissionDate: '2024-01-15' },
  { id: 3, admNumber: 'GK/2024/003', firstName: 'Grace', lastName: 'Wairimu', gender: 'Female', dateOfBirth: '2018-01-10', currentClass: 'Grade 1', feeBalance: 0, parentId: 3, admissionDate: '2024-01-20' },
  { id: 4, admNumber: 'GK/2023/004', firstName: 'Chebet', lastName: 'Kipchoge', gender: 'Female', dateOfBirth: '2017-05-12', currentClass: 'Grade 2', feeBalance: 8000, parentId: 3, admissionDate: '2023-01-16' },
  { id: 5, admNumber: 'GK/2023/005', firstName: 'Kevin', lastName: 'Mwangi', gender: 'Male', dateOfBirth: '2017-09-03', currentClass: 'Grade 2', feeBalance: 3500, parentId: 3, admissionDate: '2023-01-16' },
  { id: 6, admNumber: 'GK/2022/006', firstName: 'Akinyi', lastName: 'Odhiambo', gender: 'Female', dateOfBirth: '2016-11-28', currentClass: 'Grade 3', feeBalance: 0, parentId: 3, admissionDate: '2022-01-17' },
  { id: 7, admNumber: 'GK/2022/007', firstName: 'Dennis', lastName: 'Ochieng', gender: 'Male', dateOfBirth: '2016-04-14', currentClass: 'Grade 3', feeBalance: 15000, parentId: 3, admissionDate: '2022-01-17' },
  { id: 8, admNumber: 'GK/2022/008', firstName: 'Thomas', lastName: 'Kibet', gender: 'Male', dateOfBirth: '2016-08-22', currentClass: 'Grade 3', feeBalance: 7500, parentId: 3, admissionDate: '2022-01-17' },
  { id: 9, admNumber: 'GK/2021/009', firstName: 'Wambui', lastName: 'Njoroge', gender: 'Female', dateOfBirth: '2015-02-18', currentClass: 'Grade 4', feeBalance: 22000, parentId: 3, admissionDate: '2021-01-18' },
  { id: 10, admNumber: 'GK/2021/010', firstName: 'Felix', lastName: 'Kimani', gender: 'Male', dateOfBirth: '2015-06-30', currentClass: 'Grade 4', feeBalance: 0, parentId: 3, admissionDate: '2021-01-18' },
  { id: 11, admNumber: 'GK/2021/011', firstName: 'Nasimiyu', lastName: 'Wafula', gender: 'Female', dateOfBirth: '2015-12-05', currentClass: 'Grade 4', feeBalance: 5500, parentId: 3, admissionDate: '2021-01-18' },
  { id: 12, admNumber: 'GK/2020/012', firstName: 'Anyango', lastName: 'Okoth', gender: 'Female', dateOfBirth: '2014-10-10', currentClass: 'Grade 5', feeBalance: 10000, parentId: 3, admissionDate: '2020-01-20' },
  { id: 13, admNumber: 'GK/2020/013', firstName: 'Peter', lastName: 'Bosire', gender: 'Male', dateOfBirth: '2014-03-25', currentClass: 'Grade 5', feeBalance: 4500, parentId: 3, admissionDate: '2020-01-20' },
  { id: 14, admNumber: 'GK/2020/014', firstName: 'Linda', lastName: 'Achieng', gender: 'Female', dateOfBirth: '2014-07-19', currentClass: 'Grade 5', feeBalance: 0, parentId: 3, admissionDate: '2020-01-20' },
  { id: 15, admNumber: 'GK/2019/015', firstName: 'Jebet', lastName: 'Kiptoo', gender: 'Female', dateOfBirth: '2013-09-08', currentClass: 'Grade 6', feeBalance: 18000, parentId: 3, admissionDate: '2019-01-21' },
  { id: 16, admNumber: 'GK/2019/016', firstName: 'Samuel', lastName: 'Maina', gender: 'Male', dateOfBirth: '2013-01-14', currentClass: 'Grade 6', feeBalance: 2000, parentId: 3, admissionDate: '2019-01-21' },
  { id: 17, admNumber: 'GK/2018/017', firstName: 'Njeri', lastName: 'Karanja', gender: 'Female', dateOfBirth: '2012-04-22', currentClass: 'Grade 7', feeBalance: 0, parentId: 3, admissionDate: '2018-01-22' },
  { id: 18, admNumber: 'GK/2018/018', firstName: 'James', lastName: 'Odhiambo', gender: 'Male', dateOfBirth: '2012-08-16', currentClass: 'Grade 7', feeBalance: 12000, parentId: 3, admissionDate: '2018-01-22' },
  { id: 19, admNumber: 'GK/2018/019', firstName: 'Daniel', lastName: 'Mutua', gender: 'Male', dateOfBirth: '2012-12-01', currentClass: 'Grade 7', feeBalance: 8500, parentId: 3, admissionDate: '2018-01-22' },
  { id: 20, admNumber: 'GK/2017/020', firstName: 'Chemutai', lastName: 'Ruto', gender: 'Female', dateOfBirth: '2011-06-11', currentClass: 'Grade 8', feeBalance: 3000, parentId: 3, admissionDate: '2017-01-23' },
  { id: 21, admNumber: 'GK/2017/021', firstName: 'Michael', lastName: 'Okello', gender: 'Male', dateOfBirth: '2011-10-28', currentClass: 'Grade 8', feeBalance: 25000, parentId: 3, admissionDate: '2017-01-23' },
  { id: 22, admNumber: 'GK/2017/022', firstName: 'Awino', lastName: 'Akelo', gender: 'Female', dateOfBirth: '2011-02-14', currentClass: 'Grade 8', feeBalance: 0, parentId: 3, admissionDate: '2017-01-23' },
];

export const initialTeachers: Teacher[] = [
  { id: 1, firstName: 'Grace', lastName: 'Wanjiru', email: 'g.wanjiru@goldenkey.com', phone: '+254711223344', subjects: ['Mathematics', 'Integrated Science'], assignedClass: 'Grade 8', status: 'active', joinDate: '2017-01-15' },
  { id: 2, firstName: 'James', lastName: 'Otieno', email: 'j.otieno@goldenkey.com', phone: '+254722334455', subjects: ['English', 'Social Studies'], assignedClass: 'Grade 7', status: 'active', joinDate: '2018-01-20' },
  { id: 3, firstName: 'Fatuma', lastName: 'Hassan', email: 'f.hassan@goldenkey.com', phone: '+254733445566', subjects: ['Kiswahili', 'CRE'], assignedClass: 'Grade 6', status: 'active', joinDate: '2019-01-18' },
  { id: 4, firstName: 'Peter', lastName: 'Kipchoge', email: 'p.kipchoge@goldenkey.com', phone: '+254744556677', subjects: ['Integrated Science', 'Mathematics'], assignedClass: 'Grade 5', status: 'active', joinDate: '2020-01-15' },
  { id: 5, firstName: 'Mary', lastName: 'Mwangi', email: 'm.mwangi@goldenkey.com', phone: '+254755667788', subjects: ['Social Studies', 'CRE'], assignedClass: 'Grade 4', status: 'active', joinDate: '2021-01-20' },
  { id: 6, firstName: 'David', lastName: 'Ochieng', email: 'd.ochieng@goldenkey.com', phone: '+254766778899', subjects: ['English', 'Creative Arts'], assignedClass: 'Grade 3', status: 'active', joinDate: '2022-01-17' },
  { id: 7, firstName: 'Susan', lastName: 'Wambui', email: 's.wambui@goldenkey.com', phone: '+254777889900', subjects: ['Creative Arts', 'Physical Education'], assignedClass: 'Grade 2', status: 'active', joinDate: '2023-01-16' },
  { id: 8, firstName: 'Thomas', lastName: 'Kiprono', email: 't.kiprono@goldenkey.com', phone: '+254788990011', subjects: ['Physical Education', 'Mathematics'], assignedClass: 'Grade 1', status: 'active', joinDate: '2024-01-15' },
];

export const initialClasses: SchoolClass[] = [
  { id: 1, name: 'Grade 1', grade: 1, stream: 'East', teacherId: 8, capacity: 40 },
  { id: 2, name: 'Grade 2', grade: 2, stream: 'East', teacherId: 7, capacity: 40 },
  { id: 3, name: 'Grade 3', grade: 3, stream: 'East', teacherId: 6, capacity: 40 },
  { id: 4, name: 'Grade 4', grade: 4, stream: 'East', teacherId: 5, capacity: 40 },
  { id: 5, name: 'Grade 5', grade: 5, stream: 'East', teacherId: 4, capacity: 40 },
  { id: 6, name: 'Grade 6', grade: 6, stream: 'East', teacherId: 3, capacity: 40 },
  { id: 7, name: 'Grade 7', grade: 7, stream: 'East', teacherId: 2, capacity: 40 },
  { id: 8, name: 'Grade 8', grade: 8, stream: 'East', teacherId: 1, capacity: 40 },
];

export const initialAssessments: Assessment[] = [
  { id: 1, studentId: 1, subject: 'Mathematics', score: 85, level: 'EE', term: 'Term 1', year: 2024, teacherComments: 'Wanjiku demonstrates exceptional mastery in Mathematics and consistently exceeds curriculum expectations.', createdAt: '2024-03-15' },
  { id: 2, studentId: 1, subject: 'English', score: 72, level: 'ME', term: 'Term 1', year: 2024, teacherComments: 'Wanjiku shows good comprehension in English and meets expected outcomes.', createdAt: '2024-03-15' },
  { id: 3, studentId: 1, subject: 'Kiswahili', score: 68, level: 'ME', term: 'Term 1', year: 2024, teacherComments: 'Wanjiku performs well in Kiswahili and meets curriculum expectations.', createdAt: '2024-03-15' },
  { id: 4, studentId: 2, subject: 'Mathematics', score: 45, level: 'AE', term: 'Term 1', year: 2024, teacherComments: 'Brian is making progress in Mathematics but needs additional support.', createdAt: '2024-03-15' },
  { id: 5, studentId: 2, subject: 'English', score: 52, level: 'AE', term: 'Term 1', year: 2024, teacherComments: 'Brian shows developing understanding in English with a score of 52/100.', createdAt: '2024-03-15' },
  { id: 6, studentId: 3, subject: 'Mathematics', score: 90, level: 'EE', term: 'Term 1', year: 2024, teacherComments: 'Grace demonstrates exceptional mathematical ability.', createdAt: '2024-03-15' },
  { id: 7, studentId: 4, subject: 'English', score: 78, level: 'ME', term: 'Term 1', year: 2024, teacherComments: 'Chebet shows solid understanding in English.', createdAt: '2024-03-16' },
  { id: 8, studentId: 5, subject: 'Mathematics', score: 65, level: 'ME', term: 'Term 1', year: 2024, teacherComments: 'Kevin demonstrates good understanding in Mathematics.', createdAt: '2024-03-16' },
  { id: 9, studentId: 6, subject: 'Mathematics', score: 92, level: 'EE', term: 'Term 1', year: 2024, teacherComments: 'Akinyi shows remarkable aptitude in Mathematics, scoring 92/100.', createdAt: '2024-03-16' },
  { id: 10, studentId: 6, subject: 'Integrated Science', score: 88, level: 'EE', term: 'Term 1', year: 2024, teacherComments: 'Outstanding performance by Akinyi in Integrated Science.', createdAt: '2024-03-16' },
  { id: 11, studentId: 7, subject: 'Kiswahili', score: 42, level: 'AE', term: 'Term 1', year: 2024, teacherComments: 'Dennis is making progress in Kiswahili and needs continued support.', createdAt: '2024-03-17' },
  { id: 12, studentId: 8, subject: 'Mathematics', score: 73, level: 'ME', term: 'Term 1', year: 2024, teacherComments: 'Thomas shows good comprehension in Mathematics.', createdAt: '2024-03-17' },
  { id: 13, studentId: 9, subject: 'Mathematics', score: 35, level: 'BE', term: 'Term 1', year: 2024, teacherComments: 'Wambui requires significant support in Mathematics to meet basic learning outcomes.', createdAt: '2024-03-17' },
  { id: 14, studentId: 9, subject: 'English', score: 58, level: 'AE', term: 'Term 1', year: 2024, teacherComments: 'Wambui is making progress in English and needs continued support.', createdAt: '2024-03-17' },
  { id: 15, studentId: 10, subject: 'Integrated Science', score: 87, level: 'EE', term: 'Term 1', year: 2024, teacherComments: 'Felix demonstrates exceptional understanding in Integrated Science.', createdAt: '2024-03-18' },
  { id: 16, studentId: 11, subject: 'Social Studies', score: 61, level: 'ME', term: 'Term 1', year: 2024, teacherComments: 'Nasimiyu shows solid grasp of Social Studies concepts.', createdAt: '2024-03-18' },
  { id: 17, studentId: 12, subject: 'Mathematics', score: 76, level: 'ME', term: 'Term 1', year: 2024, teacherComments: 'Anyango demonstrates good understanding in Mathematics.', createdAt: '2024-03-18' },
  { id: 18, studentId: 12, subject: 'Integrated Science', score: 82, level: 'EE', term: 'Term 1', year: 2024, teacherComments: 'Exceptional mastery shown by Anyango in Integrated Science.', createdAt: '2024-03-18' },
  { id: 19, studentId: 13, subject: 'English', score: 44, level: 'AE', term: 'Term 1', year: 2024, teacherComments: 'Peter shows developing understanding in English.', createdAt: '2024-03-19' },
  { id: 20, studentId: 14, subject: 'Mathematics', score: 81, level: 'EE', term: 'Term 1', year: 2024, teacherComments: 'Linda demonstrates exceptional mastery in Mathematics.', createdAt: '2024-03-19' },
  { id: 21, studentId: 15, subject: 'Mathematics', score: 62, level: 'ME', term: 'Term 1', year: 2024, teacherComments: 'Jebet shows solid grasp of Mathematics concepts.', createdAt: '2024-03-19' },
  { id: 22, studentId: 15, subject: 'Kiswahili', score: 55, level: 'AE', term: 'Term 1', year: 2024, teacherComments: 'Jebet is making progress in Kiswahili and needs continued support.', createdAt: '2024-03-19' },
  { id: 23, studentId: 16, subject: 'Integrated Science', score: 70, level: 'ME', term: 'Term 1', year: 2024, teacherComments: 'Samuel shows good comprehension in Integrated Science.', createdAt: '2024-03-20' },
  { id: 24, studentId: 17, subject: 'Mathematics', score: 95, level: 'EE', term: 'Term 1', year: 2024, teacherComments: 'Njeri demonstrates exceptional mastery in Mathematics, scoring 95/100.', createdAt: '2024-03-20' },
  { id: 25, studentId: 17, subject: 'English', score: 88, level: 'EE', term: 'Term 1', year: 2024, teacherComments: 'Outstanding performance by Njeri in English Language.', createdAt: '2024-03-20' },
  { id: 26, studentId: 17, subject: 'Social Studies', score: 79, level: 'ME', term: 'Term 1', year: 2024, teacherComments: 'Njeri shows good comprehension in Social Studies.', createdAt: '2024-03-20' },
  { id: 27, studentId: 18, subject: 'Mathematics', score: 55, level: 'AE', term: 'Term 1', year: 2024, teacherComments: 'James is making progress in Mathematics and needs continued support.', createdAt: '2024-03-20' },
  { id: 28, studentId: 19, subject: 'English', score: 67, level: 'ME', term: 'Term 1', year: 2024, teacherComments: 'Daniel demonstrates good understanding in English.', createdAt: '2024-03-21' },
  { id: 29, studentId: 20, subject: 'Mathematics', score: 71, level: 'ME', term: 'Term 1', year: 2024, teacherComments: 'Chemutai demonstrates good understanding in Mathematics.', createdAt: '2024-03-21' },
  { id: 30, studentId: 20, subject: 'Integrated Science', score: 65, level: 'ME', term: 'Term 1', year: 2024, teacherComments: 'Chemutai meets expectations in Integrated Science.', createdAt: '2024-03-21' },
  { id: 31, studentId: 21, subject: 'Mathematics', score: 28, level: 'BE', term: 'Term 1', year: 2024, teacherComments: 'Michael requires significant support in Mathematics. A meeting with the parent is recommended.', createdAt: '2024-03-21' },
  { id: 32, studentId: 21, subject: 'English', score: 38, level: 'BE', term: 'Term 1', year: 2024, teacherComments: 'Michael needs urgent attention in English Language.', createdAt: '2024-03-21' },
  { id: 33, studentId: 22, subject: 'Mathematics', score: 84, level: 'EE', term: 'Term 1', year: 2024, teacherComments: 'Awino demonstrates exceptional mastery in Mathematics.', createdAt: '2024-03-21' },
  { id: 34, studentId: 1, subject: 'Mathematics', score: 88, level: 'EE', term: 'Term 2', year: 2024, teacherComments: 'Continued excellence in Mathematics.', createdAt: '2024-06-15' },
  { id: 35, studentId: 2, subject: 'Mathematics', score: 55, level: 'AE', term: 'Term 2', year: 2024, teacherComments: 'Good improvement from Term 1 in Mathematics.', createdAt: '2024-06-15' },
  { id: 36, studentId: 6, subject: 'Mathematics', score: 94, level: 'EE', term: 'Term 2', year: 2024, teacherComments: 'Consistently outstanding performance in Mathematics.', createdAt: '2024-06-16' },
  { id: 37, studentId: 17, subject: 'English', score: 91, level: 'EE', term: 'Term 2', year: 2024, teacherComments: 'Brilliant performance by Njeri in English Language.', createdAt: '2024-06-20' },
  { id: 38, studentId: 21, subject: 'Mathematics', score: 35, level: 'AE', term: 'Term 2', year: 2024, teacherComments: 'Some improvement noted but still needs significant support.', createdAt: '2024-06-21' },
];

export const initialPayments: Payment[] = [
  { id: 1, studentId: 1, amount: 10000, mpesaCode: 'SHK7X5Y8ZP', status: 'completed', method: 'M-Pesa', createdAt: '2024-01-20', description: 'Term 1 Fees' },
  { id: 2, studentId: 3, amount: 15000, mpesaCode: 'SHK8K2M3NQ', status: 'completed', method: 'M-Pesa', createdAt: '2024-01-22', description: 'Term 1 Fees' },
  { id: 3, studentId: 6, amount: 15000, mpesaCode: 'SHK9P4R7ST', status: 'completed', method: 'Bank Transfer', createdAt: '2024-01-25', description: 'Term 1 Fees' },
  { id: 4, studentId: 10, amount: 15000, mpesaCode: 'SHK1A3B5CD', status: 'completed', method: 'M-Pesa', createdAt: '2024-02-01', description: 'Term 1 Fees' },
  { id: 5, studentId: 14, amount: 15000, mpesaCode: 'SHK2E6G8HK', status: 'completed', method: 'Cash', createdAt: '2024-02-05', description: 'Term 1 Fees' },
  { id: 6, studentId: 17, amount: 15000, mpesaCode: 'SHK3J0L2MN', status: 'completed', method: 'M-Pesa', createdAt: '2024-02-10', description: 'Term 1 Fees' },
  { id: 7, studentId: 22, amount: 15000, mpesaCode: 'SHK4O5Q7RS', status: 'completed', method: 'M-Pesa', createdAt: '2024-02-15', description: 'Term 1 Fees' },
  { id: 8, studentId: 4, amount: 7000, mpesaCode: 'SHK5T9U1VW', status: 'completed', method: 'M-Pesa', createdAt: '2024-02-20', description: 'Partial Term 1 Fees' },
  { id: 9, studentId: 5, amount: 11500, mpesaCode: 'SHK6X3Y5ZA', status: 'completed', method: 'M-Pesa', createdAt: '2024-03-01', description: 'Term 1 Fees' },
  { id: 10, studentId: 16, amount: 13000, mpesaCode: 'SHK7B8D0FC', status: 'completed', method: 'Bank Transfer', createdAt: '2024-03-05', description: 'Partial Term 1 Fees' },
  { id: 11, studentId: 20, amount: 12000, mpesaCode: 'SHK8E2G4HD', status: 'completed', method: 'M-Pesa', createdAt: '2024-03-10', description: 'Term 1 Fees' },
  { id: 12, studentId: 9, amount: 8000, mpesaCode: 'SHK9I6J8KL', status: 'pending', method: 'M-Pesa', createdAt: '2024-03-15', description: 'Partial Term 1 Fees' },
  { id: 13, studentId: 2, amount: 3000, mpesaCode: 'SHK0M2N4OP', status: 'pending', method: 'M-Pesa', createdAt: '2024-03-18', description: 'Partial Payment' },
  { id: 14, studentId: 18, amount: 5000, mpesaCode: 'SHK1Q4S6TR', status: 'failed', method: 'M-Pesa', createdAt: '2024-03-20', description: 'Term 1 Fees' },
  { id: 15, studentId: 12, amount: 5000, mpesaCode: 'SHK2U8W0XY', status: 'completed', method: 'Cash', createdAt: '2024-03-22', description: 'Partial Payment' },
];

export const initialAuditLogs: AuditLog[] = [
  { id: 1, userId: 1, userName: 'Admin', action: 'LOGIN', details: 'Admin logged in from 192.168.1.1', createdAt: '2024-03-22 08:30:00' },
  { id: 2, userId: 2, userName: 'Teacher Grace', action: 'CREATE_ASSESSMENT', details: 'Created assessment for Wanjiku Kamau - Mathematics', createdAt: '2024-03-22 09:15:00' },
  { id: 3, userId: 1, userName: 'Admin', action: 'CREATE_STUDENT', details: 'Registered new student: Awino Akelo', createdAt: '2024-03-22 10:00:00' },
  { id: 4, userId: 2, userName: 'Teacher Grace', action: 'AI_COMMENT', details: 'Generated AI comment for Njeri Karanja - Mathematics', createdAt: '2024-03-22 10:30:00' },
  { id: 5, userId: 1, userName: 'Admin', action: 'RECORD_PAYMENT', details: 'Recorded M-Pesa payment of KES 15,000 for Chemutai Ruto', createdAt: '2024-03-22 11:00:00' },
  { id: 6, userId: 2, userName: 'Teacher Grace', action: 'CREATE_ASSESSMENT', details: 'Created assessment for Brian Otieno - English', createdAt: '2024-03-22 11:30:00' },
  { id: 7, userId: 1, userName: 'Admin', action: 'UPDATE_SETTINGS', details: 'Updated school contact information', createdAt: '2024-03-22 12:00:00' },
  { id: 8, userId: 3, userName: 'Parent Kamau', action: 'LOGIN', details: 'Parent logged in from 192.168.1.50', createdAt: '2024-03-22 14:00:00' },
  { id: 9, userId: 1, userName: 'Admin', action: 'CREATE_TEACHER', details: 'Registered new teacher: Thomas Kiprono', createdAt: '2024-03-22 15:00:00' },
  { id: 10, userId: 2, userName: 'Teacher Grace', action: 'BATCH_ASSESSMENT', details: 'Batch created 5 assessments for Grade 8', createdAt: '2024-03-22 16:00:00' },
];

export const defaultSettings: SchoolSettings = {
  name: 'GoldenKey Academy',
  motto: 'Excellence in CBC Education',
  address: '123 Education Lane, Westlands',
  phone: '+254 700 123 456',
  email: 'info@goldenkeyacademy.ac.ke',
  county: 'Nairobi County',
  registrationNumber: 'MOE/NAI/2024/001',
  currentTerm: 'Term 2',
  currentYear: 2024,
  principalName: 'Dr. Elizabeth Mwangi',
  feeStructure: [
    { grade: 'Grade 1', amount: 15000 },
    { grade: 'Grade 2', amount: 15000 },
    { grade: 'Grade 3', amount: 15000 },
    { grade: 'Grade 4', amount: 18000 },
    { grade: 'Grade 5', amount: 18000 },
    { grade: 'Grade 6', amount: 20000 },
    { grade: 'Grade 7', amount: 22000 },
    { grade: 'Grade 8', amount: 25000 },
  ],
};

export function getCBCLevel(score: number): 'EE' | 'ME' | 'AE' | 'BE' {
  if (score >= 80) return 'EE';
  if (score >= 60) return 'ME';
  if (score >= 40) return 'AE';
  return 'BE';
}

export function generateAIComment(studentName: string, subject: string, score: number, level: string): string {
  const firstName = studentName.split(' ')[0];
  const templates: Record<string, string[]> = {
    'EE': [
      `${firstName} demonstrates exceptional mastery in ${subject} and consistently exceeds curriculum expectations. Continue to nurture this outstanding ability.`,
      `${firstName} shows remarkable aptitude in ${subject}, scoring ${score}/100. The student is well ahead of expected learning outcomes and should be given enrichment opportunities.`,
      `An outstanding performance by ${firstName} in ${subject}. The student displays deep understanding and can apply concepts independently.`,
    ],
    'ME': [
      `${firstName} demonstrates good understanding in ${subject} and meets the expected curriculum outcomes. Consistent practice will help maintain this strong performance.`,
      `${firstName} shows solid grasp of ${subject} concepts with a score of ${score}/100. Encourage continued engagement to push towards exceeding expectations.`,
      `${firstName} is performing well in ${subject}, meeting the required learning outcomes. With focused effort, there is potential to achieve even higher mastery.`,
    ],
    'AE': [
      `${firstName} is making progress in ${subject} but needs additional support to fully meet curriculum expectations. Regular guided practice is recommended.`,
      `${firstName} shows developing understanding in ${subject} with a score of ${score}/100. Targeted support in challenging areas will help improve performance.`,
      `${firstName} is approaching expected learning outcomes in ${subject}. Consistent practice and teacher guidance will be essential for improvement.`,
    ],
    'BE': [
      `${firstName} requires significant support in ${subject} to meet basic learning outcomes. I recommend immediate intervention including extra tutoring and home practice.`,
      `${firstName} is performing below expectations in ${subject}. A meeting with the parent is recommended to develop a support plan for improvement.`,
      `${firstName} needs urgent attention in ${subject}. The student struggles with fundamental concepts and would benefit from one-on-one tutoring sessions.`,
    ],
  };
  const levelTemplates = templates[level] || templates['ME'];
  return levelTemplates[Math.floor(Math.random() * levelTemplates.length)];
}
