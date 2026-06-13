import type { User, Student, Assessment, Payment, AuditLog } from '../types';

export const users: User[] = [
  { id: 1, username: 'Admin Master', email: 'admin@goldenkey.com', phone: '0712345678', role: 'admin' },
  { id: 2, username: 'Mary Wanjiku', email: 'teacher@goldenkey.com', phone: '0723456789', role: 'teacher' },
  { id: 3, username: 'John Kamau', email: 'teacher2@goldenkey.com', phone: '0734567890', role: 'teacher' },
  { id: 4, username: 'Grace Akinyi', email: 'parent@goldenkey.com', phone: '0745678901', role: 'parent' },
  { id: 5, username: 'Peter Odhiambo', email: 'parent2@goldenkey.com', phone: '0756789012', role: 'parent' },
  { id: 6, username: 'Sarah Chebet', email: 'parent3@goldenkey.com', phone: '0767890123', role: 'parent' },
];

export const teachers: Teacher[] = [
  { id: 2, firstName: 'Mary', lastName: 'Wanjiku', email: 'teacher@goldenkey.com', phone: '0723456789', subjects: ['Mathematics', 'English'], assignedClass: 'Grade 4 West', status: 'active', joinDate: '2023-01-15' },
  { id: 3, firstName: 'John', lastName: 'Kamau', email: 'teacher2@goldenkey.com', phone: '0734567890', subjects: ['Science', 'CRE'], assignedClass: 'Grade 6 East', status: 'active', joinDate: '2023-02-10' },
];

export const classes: SchoolClass[] = [
  { id: 1, name: 'Grade 4 West', grade: 4, stream: 'West', teacherId: 2, capacity: 30 },
  { id: 2, name: 'Grade 6 East', grade: 6, stream: 'East', teacherId: 3, capacity: 32 },
  { id: 3, name: 'Grade 5 South', grade: 5, stream: 'South', teacherId: 2, capacity: 28 },
];

export const students: Student[] = [
  { id: 1, admNumber: 'GKS/2024/001', firstName: 'Emma', lastName: 'Akinyi', currentClass: 'Grade 4 West', feeBalance: 5000, parentId: 4 },
  { id: 2, admNumber: 'GKS/2024/002', firstName: 'David', lastName: 'Akinyi', currentClass: 'Grade 6 East', feeBalance: 12000, parentId: 4 },
  { id: 3, admNumber: 'GKS/2024/003', firstName: 'Brian', lastName: 'Odhiambo', currentClass: 'Grade 4 West', feeBalance: 0, parentId: 5 },
  { id: 4, admNumber: 'GKS/2024/004', firstName: 'Cynthia', lastName: 'Odhiambo', currentClass: 'Grade 3 North', feeBalance: 3500, parentId: 5 },
  { id: 5, admNumber: 'GKS/2024/005', firstName: 'Faith', lastName: 'Chebet', currentClass: 'Grade 5 South', feeBalance: 8500, parentId: 6 },
  { id: 6, admNumber: 'GKS/2024/006', firstName: 'Kevin', lastName: 'Mwangi', currentClass: 'Grade 4 West', feeBalance: 2000, parentId: 99 },
  { id: 7, admNumber: 'GKS/2024/007', firstName: 'Alice', lastName: 'Njoroge', currentClass: 'Grade 6 East', feeBalance: 15000, parentId: 99 },
  { id: 8, admNumber: 'GKS/2024/008', firstName: 'Samuel', lastName: 'Kipchoge', currentClass: 'Grade 5 South', feeBalance: 0, parentId: 99 },
  { id: 9, admNumber: 'GKS/2024/009', firstName: 'Diana', lastName: 'Wambui', currentClass: 'Grade 3 North', feeBalance: 7000, parentId: 99 },
  { id: 10, admNumber: 'GKS/2024/010', firstName: 'James', lastName: 'Otieno', currentClass: 'Grade 4 West', feeBalance: 4000, parentId: 99 },
];

export const assessments: Assessment[] = [
  { id: 1, studentId: 1, subject: 'Mathematics', score: 85, level: 'EE', term: 'Term1', year: 2024, teacherComments: 'Emma demonstrates excellent mastery in Mathematics and consistently exceeds expectations. Keep up the outstanding work!', teacherId: 2 },
  { id: 2, studentId: 1, subject: 'English', score: 72, level: 'ME', term: 'Term1', year: 2024, teacherComments: 'Emma shows good understanding in English and meets curriculum expectations. Continue reading widely to improve vocabulary.', teacherId: 2 },
  { id: 3, studentId: 1, subject: 'Science', score: 91, level: 'EE', term: 'Term1', year: 2024, teacherComments: 'Outstanding performance in Science! Emma shows deep understanding of scientific concepts and inquiry skills.', teacherId: 3 },
  { id: 4, studentId: 1, subject: 'Social Studies', score: 68, level: 'ME', term: 'Term1', year: 2024, teacherComments: 'Good progress in Social Studies. Emma participates well in class discussions about community and environment.', teacherId: 2 },
  { id: 5, studentId: 2, subject: 'Mathematics', score: 58, level: 'ME', term: 'Term1', year: 2024, teacherComments: 'David shows moderate understanding in Mathematics. With more practice, he can achieve better results.', teacherId: 2 },
  { id: 6, studentId: 2, subject: 'English', score: 45, level: 'AE', term: 'Term1', year: 2024, teacherComments: 'David is making progress in English but needs continued support in grammar and composition writing.', teacherId: 2 },
  { id: 7, studentId: 2, subject: 'Science', score: 73, level: 'ME', term: 'Term1', year: 2024, teacherComments: 'Good effort in Science. David shows interest in practical experiments and should continue exploring.', teacherId: 3 },
  { id: 8, studentId: 2, subject: 'Kiswahili', score: 82, level: 'EE', term: 'Term1', year: 2024, teacherComments: 'Excellent performance in Kiswahili! David demonstrates strong language skills and cultural appreciation.', teacherId: 2 },
  { id: 9, studentId: 3, subject: 'Mathematics', score: 92, level: 'EE', term: 'Term1', year: 2024, teacherComments: 'Brian is a star performer in Mathematics! Consistently demonstrates exceptional problem-solving skills.', teacherId: 2 },
  { id: 10, studentId: 3, subject: 'English', score: 88, level: 'EE', term: 'Term1', year: 2024, teacherComments: 'Brilliant work in English! Brian excels in creative writing and comprehension exercises.', teacherId: 2 },
  { id: 11, studentId: 3, subject: 'Science', score: 76, level: 'ME', term: 'Term1', year: 2024, teacherComments: 'Good understanding of Science concepts. Brian should continue with the hands-on experiments.', teacherId: 3 },
  { id: 12, studentId: 4, subject: 'Mathematics', score: 35, level: 'BE', term: 'Term1', year: 2024, teacherComments: 'Cynthia requires additional practice in Mathematics to improve performance. Extra tutoring recommended.', teacherId: 3 },
  { id: 13, studentId: 4, subject: 'English', score: 52, level: 'AE', term: 'Term1', year: 2024, teacherComments: 'Cynthia is making progress in English. Parental support with reading at home would be beneficial.', teacherId: 3 },
  { id: 14, studentId: 4, subject: 'CRE', score: 78, level: 'ME', term: 'Term1', year: 2024, teacherComments: 'Good performance in CRE. Cynthia shows good understanding of moral and religious values.', teacherId: 3 },
  { id: 15, studentId: 5, subject: 'Mathematics', score: 67, level: 'ME', term: 'Term1', year: 2024, teacherComments: 'Faith shows good understanding in Mathematics. Consistent practice will lead to even better results.', teacherId: 2 },
  { id: 16, studentId: 5, subject: 'Science', score: 89, level: 'EE', term: 'Term1', year: 2024, teacherComments: 'Excellent work in Science! Faith shows natural curiosity and strong analytical thinking skills.', teacherId: 3 },
  { id: 17, studentId: 5, subject: 'English', score: 71, level: 'ME', term: 'Term1', year: 2024, teacherComments: 'Faith meets expectations in English. Encourage more reading to build on this solid foundation.', teacherId: 2 },
  // Term 2 data
  { id: 18, studentId: 1, subject: 'Mathematics', score: 88, level: 'EE', term: 'Term2', year: 2024, teacherComments: 'Continued excellence in Mathematics! Emma is growing from strength to strength.', teacherId: 2 },
  { id: 19, studentId: 1, subject: 'English', score: 78, level: 'ME', term: 'Term2', year: 2024, teacherComments: 'Great improvement in English this term. Emma\'s essay writing has notably improved.', teacherId: 2 },
  { id: 20, studentId: 1, subject: 'Science', score: 94, level: 'EE', term: 'Term2', year: 2024, teacherComments: 'Phenomenal progress in Science! Emma leads class discussions with confidence.', teacherId: 3 },
  { id: 21, studentId: 2, subject: 'Mathematics', score: 63, level: 'ME', term: 'Term2', year: 2024, teacherComments: 'Noticeable improvement in Mathematics. David is putting in more effort this term.', teacherId: 2 },
  { id: 22, studentId: 2, subject: 'English', score: 55, level: 'AE', term: 'Term2', year: 2024, teacherComments: 'Some improvement in English. David needs to focus more on grammar exercises.', teacherId: 2 },
  { id: 23, studentId: 3, subject: 'Mathematics', score: 95, level: 'EE', term: 'Term2', year: 2024, teacherComments: 'Absolutely outstanding! Brian continues to set the bar high in Mathematics.', teacherId: 2 },
  { id: 24, studentId: 5, subject: 'Mathematics', score: 74, level: 'ME', term: 'Term2', year: 2024, teacherComments: 'Faith has shown commendable improvement in Mathematics this term.', teacherId: 2 },
  // More students
  { id: 25, studentId: 6, subject: 'Mathematics', score: 42, level: 'AE', term: 'Term1', year: 2024, teacherComments: 'Kevin is making progress but needs additional support in fundamental math concepts.', teacherId: 2 },
  { id: 26, studentId: 6, subject: 'English', score: 61, level: 'ME', term: 'Term1', year: 2024, teacherComments: 'Kevin shows good potential in English. Regular reading practice will help.', teacherId: 2 },
  { id: 27, studentId: 7, subject: 'Mathematics', score: 33, level: 'BE', term: 'Term1', year: 2024, teacherComments: 'Alice needs significant support in Mathematics. A remedial program is recommended.', teacherId: 2 },
  { id: 28, studentId: 7, subject: 'English', score: 47, level: 'AE', term: 'Term1', year: 2024, teacherComments: 'Alice is gradually improving in English. Support at home with reading is essential.', teacherId: 2 },
  { id: 29, studentId: 8, subject: 'Science', score: 96, level: 'EE', term: 'Term1', year: 2024, teacherComments: 'Samuel is an exceptional Science student. His experiments and observations are remarkable.', teacherId: 3 },
  { id: 30, studentId: 8, subject: 'Mathematics', score: 84, level: 'EE', term: 'Term1', year: 2024, teacherComments: 'Excellent Mathematics skills. Samuel applies concepts to real-world situations effortlessly.', teacherId: 2 },
  { id: 31, studentId: 9, subject: 'English', score: 59, level: 'ME', term: 'Term1', year: 2024, teacherComments: 'Diana shows steady progress in English. She enjoys storytelling activities.', teacherId: 3 },
  { id: 32, studentId: 10, subject: 'Mathematics', score: 71, level: 'ME', term: 'Term1', year: 2024, teacherComments: 'James demonstrates solid understanding of math concepts. Good class participation.', teacherId: 2 },
  { id: 33, studentId: 10, subject: 'Science', score: 65, level: 'ME', term: 'Term1', year: 2024, teacherComments: 'James is making good progress in Science. His curiosity drives his learning.', teacherId: 3 },
];

export const payments: Payment[] = [
  { id: 1, studentId: 1, amount: 15000, mpesaCode: 'QHK4Y7R2T9', status: 'completed', date: '2024-01-15', method: 'M-Pesa' },
  { id: 2, studentId: 1, amount: 10000, mpesaCode: 'PLM8N3K5W1', status: 'completed', date: '2024-04-20', method: 'M-Pesa' },
  { id: 3, studentId: 2, amount: 8000, mpesaCode: 'RFV2B9M4X7', status: 'completed', date: '2024-01-18', method: 'M-Pesa' },
  { id: 4, studentId: 2, amount: 5000, mpesaCode: 'TGB6H1P3Y8', status: 'completed', date: '2024-05-10', method: 'M-Pesa' },
  { id: 5, studentId: 3, amount: 30000, mpesaCode: 'YHN5U8Q2W4', status: 'completed', date: '2024-01-10', method: 'M-Pesa' },
  { id: 6, studentId: 3, amount: 15000, mpesaCode: 'WSE3R7T9K1', status: 'completed', date: '2024-05-05', method: 'M-Pesa' },
  { id: 7, studentId: 4, amount: 12000, mpesaCode: 'EDC4V6B8N2', status: 'completed', date: '2024-02-01', method: 'M-Pesa' },
  { id: 8, studentId: 5, amount: 10000, mpesaCode: ' pending', status: 'pending', date: '2024-06-01', method: 'M-Pesa' },
  { id: 9, studentId: 5, amount: 6500, mpesaCode: 'ZAQ1X3C5V7', status: 'completed', date: '2024-01-22', method: 'M-Pesa' },
  { id: 10, studentId: 6, amount: 25000, mpesaCode: 'IKJ7L9M1P3', status: 'completed', date: '2024-02-15', method: 'M-Pesa' },
  { id: 11, studentId: 7, amount: 5000, mpesaCode: 'FDR4G6H8J0', status: 'completed', date: '2024-03-01', method: 'M-Pesa' },
  { id: 12, studentId: 8, amount: 45000, mpesaCode: 'OKM2N4P6Q8', status: 'completed', date: '2024-01-05', method: 'M-Pesa' },
  { id: 13, studentId: 9, amount: 18000, mpesaCode: 'WTF3R5Y7U9', status: 'completed', date: '2024-02-20', method: 'M-Pesa' },
  { id: 14, studentId: 10, amount: 20000, mpesaCode: 'APS6D8F0G2', status: 'completed', date: '2024-03-10', method: 'M-Pesa' },
  { id: 15, studentId: 10, amount: 6000, mpesaCode: 'HJK4L6N8R0', status: 'failed', date: '2024-05-28', method: 'M-Pesa' },
];

export const auditLogs: AuditLog[] = [
  { id: 1, userId: 1, action: 'LOGIN', details: 'Admin logged in', ipAddress: '192.168.1.1', timestamp: '2024-06-15 08:30:00' },
  { id: 2, userId: 2, action: 'CREATE_ASSESSMENT', details: 'Created Math assessment for Emma Akinyi', ipAddress: '192.168.1.25', timestamp: '2024-06-15 09:15:00' },
  { id: 3, userId: 2, action: 'AI_COMMENT', details: 'Generated AI comment for David Akinyi - English', ipAddress: '192.168.1.25', timestamp: '2024-06-15 09:22:00' },
  { id: 4, userId: 4, action: 'PAYMENT_INIT', details: 'Initiated M-Pesa payment KES 10,000 for Emma', ipAddress: '10.0.0.5', timestamp: '2024-06-15 10:00:00' },
  { id: 5, userId: 1, action: 'CREATE_STUDENT', details: 'Registered new student James Otieno', ipAddress: '192.168.1.1', timestamp: '2024-06-15 10:30:00' },
  { id: 6, userId: 3, action: 'CREATE_ASSESSMENT', details: 'Created Science assessment for Grade 4 West', ipAddress: '192.168.1.30', timestamp: '2024-06-15 11:00:00' },
  { id: 7, userId: 1, action: 'UPDATE_FEE', details: 'Updated fee structure for Term 2 2024', ipAddress: '192.168.1.1', timestamp: '2024-06-15 14:00:00' },
  { id: 8, userId: 5, action: 'LOGIN', details: 'Parent Peter Odhiambo logged in', ipAddress: '10.0.0.12', timestamp: '2024-06-15 14:30:00' },
  { id: 9, userId: 2, action: 'LOGIN', details: 'Teacher Mary Wanjiku logged in', ipAddress: '192.168.1.25', timestamp: '2024-06-15 15:00:00' },
  { id: 10, userId: 1, action: 'EXPORT_REPORT', details: 'Exported Term 1 report cards for Grade 4', ipAddress: '192.168.1.1', timestamp: '2024-06-15 16:00:00' },
];

export const monthlyRevenue = [
  { month: 'Jan', amount: 93000 },
  { month: 'Feb', amount: 55000 },
  { month: 'Mar', amount: 5000 },
  { month: 'Apr', amount: 10000 },
  { month: 'May', amount: 16000 },
  { month: 'Jun', amount: 0 },
];

export const subjectPerformance = [
  { subject: 'Mathematics', avgScore: 65, EE: 3, ME: 4, AE: 2, BE: 1 },
  { subject: 'English', avgScore: 62, EE: 2, ME: 4, AE: 3, BE: 1 },
  { subject: 'Science', avgScore: 80, EE: 4, ME: 3, AE: 1, BE: 0 },
  { subject: 'Social Studies', avgScore: 68, EE: 1, ME: 5, AE: 2, BE: 1 },
  { subject: 'Kiswahili', avgScore: 72, EE: 2, ME: 4, AE: 2, BE: 1 },
  { subject: 'CRE', avgScore: 78, EE: 3, ME: 4, AE: 1, BE: 1 },
];

export const classPerformance = [
  { className: 'Grade 3 North', students: 2, avgScore: 55 },
  { className: 'Grade 4 West', students: 4, avgScore: 67 },
  { className: 'Grade 5 South', students: 2, avgScore: 76 },
  { className: 'Grade 6 East', students: 2, avgScore: 58 },
];

export const loginCredentials = [
  { email: 'admin@goldenkey.com', password: 'admin123', role: 'admin' as const },
  { email: 'teacher@goldenkey.com', password: 'teacher123', role: 'teacher' as const },
  { email: 'parent@goldenkey.com', password: 'parent123', role: 'parent' as const },
];
