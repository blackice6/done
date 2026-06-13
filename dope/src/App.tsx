import { useState, createContext, useContext, type ReactNode } from 'react'
import { 
  GraduationCap, 
  Users, 
  DollarSign, 
  BarChart3, 
  BookOpen, 
  CreditCard,
  Bell,
  LogOut,
  Menu,
  X,
  Sparkles,
  Shield,
  Eye,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Lock,
  Mail,
  Phone,
  User,
  FileText,
  Settings,
  ChevronRight,
  Home
} from 'lucide-react'

// Types
type UserRole = 'admin' | 'teacher' | 'parent'

interface User {
  id: number
  username: string
  email: string
  role: UserRole
  name: string
}

interface Student {
  id: number
  admNumber: string
  firstName: string
  lastName: string
  currentClass: string
  feeBalance: number
  parentUserId: number
  photoUrl?: string
}

interface Assessment {
  id: number
  studentId: number
  studentName: string
  subject: string
  score: number
  level: 'EE' | 'ME' | 'AE' | 'BE'
  term: string
  year: number
  teacherComments: string
  teacherName: string
}

interface Payment {
  id: number
  studentId: number
  studentName: string
  amount: number
  mpesaCode: string
  status: 'pending' | 'completed' | 'failed'
  date: string
}

// Mock Data
const mockUsers: User[] = [
  { id: 1, username: 'admin', email: 'admin@goldenkey.com', role: 'admin', name: 'Principal Admin' },
  { id: 2, username: 'teacher1', email: 'teacher@goldenkey.com', role: 'teacher', name: 'Mrs. Kamau' },
  { id: 3, username: 'parent1', email: 'parent@goldenkey.com', role: 'parent', name: 'Mr. Otieno' },
  { id: 4, username: 'teacher2', email: 'teacher2@goldenkey.com', role: 'teacher', name: 'Mr. Njoroge' },
]

const mockStudents: Student[] = [
  { id: 1, admNumber: 'GKS001', firstName: 'James', lastName: 'Otieno', currentClass: 'Grade 4', feeBalance: 15000, parentUserId: 3 },
  { id: 2, admNumber: 'GKS002', firstName: 'Mary', lastName: 'Wanjiku', currentClass: 'Grade 5', feeBalance: 5000, parentUserId: 3 },
  { id: 3, admNumber: 'GKS003', firstName: 'Brian', lastName: 'Kipchoge', currentClass: 'Grade 6', feeBalance: 25000, parentUserId: 99 },
  { id: 4, admNumber: 'GKS004', firstName: 'Grace', lastName: 'Achieng', currentClass: 'Grade 4', feeBalance: 8000, parentUserId: 88 },
  { id: 5, admNumber: 'GKS005', firstName: 'Kevin', lastName: 'Mwangi', currentClass: 'Grade 5', feeBalance: 12000, parentUserId: 77 },
  { id: 6, admNumber: 'GKS006', firstName: 'Susan', lastName: 'Njeri', currentClass: 'Grade 6', feeBalance: 3000, parentUserId: 66 },
]

const mockAssessments: Assessment[] = [
  { id: 1, studentId: 1, studentName: 'James Otieno', subject: 'Mathematics', score: 85, level: 'EE', term: 'Term 1', year: 2024, teacherComments: 'James demonstrates excellent mastery in Mathematics and consistently exceeds expectations.', teacherName: 'Mrs. Kamau' },
  { id: 2, studentId: 1, studentName: 'James Otieno', subject: 'English', score: 72, level: 'ME', term: 'Term 1', year: 2024, teacherComments: 'James shows good understanding in English and meets curriculum expectations.', teacherName: 'Mr. Njoroge' },
  { id: 3, studentId: 2, studentName: 'Mary Wanjiku', subject: 'Mathematics', score: 65, level: 'ME', term: 'Term 1', year: 2024, teacherComments: 'Mary shows good understanding in Mathematics and meets curriculum expectations.', teacherName: 'Mrs. Kamau' },
  { id: 4, studentId: 2, studentName: 'Mary Wanjiku', subject: 'English', score: 90, level: 'EE', term: 'Term 1', year: 2024, teacherComments: 'Mary demonstrates excellent mastery in English and consistently exceeds expectations.', teacherName: 'Mr. Njoroge' },
  { id: 5, studentId: 3, studentName: 'Brian Kipchoge', subject: 'Mathematics', score: 45, level: 'AE', term: 'Term 1', year: 2024, teacherComments: 'Brian is making progress in Mathematics and needs continued support.', teacherName: 'Mrs. Kamau' },
  { id: 6, studentId: 4, studentName: 'Grace Achieng', subject: 'English', score: 35, level: 'BE', term: 'Term 1', year: 2024, teacherComments: 'Grace requires additional practice in English to improve performance.', teacherName: 'Mr. Njoroge' },
  { id: 7, studentId: 1, studentName: 'James Otieno', subject: 'Science', score: 78, level: 'ME', term: 'Term 1', year: 2024, teacherComments: 'James shows good understanding in Science and meets curriculum expectations.', teacherName: 'Mrs. Kamau' },
  { id: 8, studentId: 2, studentName: 'Mary Wanjiku', subject: 'Science', score: 92, level: 'EE', term: 'Term 1', year: 2024, teacherComments: 'Mary demonstrates excellent mastery in Science and consistently exceeds expectations.', teacherName: 'Mrs. Kamau' },
]

const mockPayments: Payment[] = [
  { id: 1, studentId: 1, studentName: 'James Otieno', amount: 15000, mpesaCode: 'MPESA123', status: 'completed', date: '2024-01-15' },
  { id: 2, studentId: 2, studentName: 'Mary Wanjiku', amount: 10000, mpesaCode: 'MPESA124', status: 'completed', date: '2024-01-16' },
  { id: 3, studentId: 3, studentName: 'Brian Kipchoge', amount: 5000, mpesaCode: 'MPESA125', status: 'pending', date: '2024-01-17' },
  { id: 4, studentId: 4, studentName: 'Grace Achieng', amount: 8000, mpesaCode: 'MPESA126', status: 'failed', date: '2024-01-18' },
]

// Auth Context
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (email: string): boolean => {
    const foundUser = mockUsers.find(u => u.email === email)
    if (foundUser) {
      setUser(foundUser)
      return true
    }
    return false
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

// Helper Functions
function getCBCColour(level: string) {
  const colors = {
    EE: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    ME: 'bg-blue-100 text-blue-800 border-blue-300',
    AE: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    BE: 'bg-red-100 text-red-800 border-red-300'
  }
  return colors[level as keyof typeof colors] || ''
}

function getCBCLevel(score: number): 'EE' | 'ME' | 'AE' | 'BE' {
  if (score >= 80) return 'EE'
  if (score >= 60) return 'ME'
  if (score >= 40) return 'AE'
  return 'BE'
}

function generateAIComment(studentName: string, subject: string, _score: number, level: string): string {
  const comments = {
    EE: `${studentName} demonstrates excellent mastery in ${subject} and consistently exceeds expectations. Keep up the outstanding work!`,
    ME: `${studentName} shows good understanding in ${subject} and meets curriculum expectations well. Continue building on this foundation.`,
    AE: `${studentName} is making progress in ${subject} and with continued support and practice will show improvement.`,
    BE: `${studentName} requires additional practice and support in ${subject}. Regular revision will help improve performance.`
  }
  return comments[level as keyof typeof comments]
}

// Components
function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(email, password)) {
      setError('')
    } else {
      setError('Invalid credentials. Try: admin@goldenkey.com / teacher@goldenkey.com / parent@goldenkey.com')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl mb-4 shadow-xl">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">GoldenKey Elite</h1>
          <p className="text-white/70 mt-2">AI-Powered CBC School Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/80 text-sm font-medium block mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-white/80 text-sm font-medium block mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-xl hover:shadow-2xl"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-white/60 text-sm">
          <p>Demo Accounts:</p>
          <p className="text-white/80 mt-1">admin@goldenkey.com | teacher@goldenkey.com | parent@goldenkey.com</p>
        </div>
      </div>
    </div>
  )
}

function Sidebar({ activeTab, setActiveTab, role }: { activeTab: string; setActiveTab: (tab: string) => void; role: UserRole }) {
  const [isOpen, setIsOpen] = useState(true)

  const menuItems = {
    admin: [
      { id: 'dashboard', icon: Home, label: 'Dashboard' },
      { id: 'students', icon: Users, label: 'All Students' },
      { id: 'assessments', icon: BarChart3, label: 'Performance' },
      { id: 'finances', icon: DollarSign, label: 'Finances' },
      { id: 'payments', icon: CreditCard, label: 'Payments' },
      { id: 'settings', icon: Settings, label: 'Settings' },
    ],
    teacher: [
      { id: 'dashboard', icon: Home, label: 'Dashboard' },
      { id: 'students', icon: Users, label: 'My Students' },
      { id: 'assessments', icon: BarChart3, label: 'Assessments' },
      { id: 'settings', icon: Settings, label: 'Settings' },
    ],
    parent: [
      { id: 'dashboard', icon: Home, label: 'Dashboard' },
      { id: 'children', icon: Users, label: 'My Children' },
      { id: 'fees', icon: DollarSign, label: 'Fee Status' },
      { id: 'performance', icon: BarChart3, label: 'Performance' },
      { id: 'payments', icon: CreditCard, label: 'Make Payment' },
    ]
  }

  const items = menuItems[role]

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-indigo-600 text-white p-2 rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 w-72 bg-gradient-to-b from-indigo-900 to-purple-900 border-r border-white/10`}>
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">GoldenKey</h1>
              <p className="text-white/60 text-xs">Elite Management</p>
            </div>
          </div>
        </div>

        <nav className="px-4 space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/10 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate capitalize">{role}</p>
                <p className="text-white/50 text-xs">View Mode</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

function Header({ user, onLogout }: { user: User; onLogout: () => void }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome, {user.name}</h2>
          <p className="text-gray-500 text-sm">You are logged in as <span className="capitalize font-semibold text-indigo-600">{user.role}</span></p>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}

// Admin Dashboard Components
function AdminDashboard({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const totalStudents = mockStudents.length
  const totalFees = mockStudents.reduce((sum, s) => sum + s.feeBalance, 0)
  const totalPayments = mockPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
  const avgScore = Math.round(mockAssessments.reduce((sum, a) => sum + a.score, 0) / mockAssessments.length)

  const stats = [
    { label: 'Total Students', value: totalStudents, icon: Users, color: 'from-blue-500 to-indigo-600', change: '+12%' },
    { label: 'Fees Collected', value: `KES ${totalPayments.toLocaleString()}`, icon: DollarSign, color: 'from-emerald-500 to-teal-600', change: '+8%' },
    { label: 'Pending Fees', value: `KES ${totalFees.toLocaleString()}`, icon: AlertCircle, color: 'from-amber-500 to-orange-600', change: '-5%' },
    { label: 'Avg Score', value: `${avgScore}%`, icon: BarChart3, color: 'from-purple-500 to-pink-600', change: '+3%' },
  ]

  const recentPayments = mockPayments.slice(0, 4)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Admin Dashboard</h3>
          <p className="text-gray-500">Overview of school performance and finances</p>
        </div>
        <Shield className="w-10 h-10 text-indigo-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-xl`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                <p className="text-white/70 text-sm mt-1 flex items-center gap-1">
                  {stat.change.startsWith('+') ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {stat.change} from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Performance Overview
          </h4>
          <div className="space-y-4">
            {['EE', 'ME', 'AE', 'BE'].map((level) => {
              const count = mockAssessments.filter(a => a.level === level).length
              const percentage = (count / mockAssessments.length) * 100
              return (
                <div key={level} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{level} - {level === 'EE' ? 'Exceeds Expectations' : level === 'ME' ? 'Meets Expectations' : level === 'AE' ? 'Approaching Expectations' : 'Below Expectations'}</span>
                    <span className="text-gray-500">{count} students ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getCBCColour(level)}`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-500" />
            Recent Payments
          </h4>
          <div className="space-y-3">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800">{payment.studentName}</p>
                  <p className="text-sm text-gray-500">{payment.mpesaCode}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">KES {payment.amount.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    payment.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setActiveTab('payments')}
            className="w-full mt-4 text-center text-indigo-600 font-medium hover:text-indigo-800"
          >
            View All Payments →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Fee Balance by Class
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Grade 4', 'Grade 5', 'Grade 6'].map((grade) => {
            const students = mockStudents.filter(s => s.currentClass === grade)
            const totalBalance = students.reduce((sum, s) => sum + s.feeBalance, 0)
            return (
              <div key={grade} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <h5 className="font-bold text-gray-800">{grade}</h5>
                <p className="text-2xl font-bold text-indigo-600 mt-2">KES {totalBalance.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{students.length} students</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function TeacherDashboard({ user }: { user: User }) {
  // Teachers see all students filtered for their subjects (mock: all students accessible)
  const myStudents = mockStudents
  const myAssessments = mockAssessments.filter(a => a.teacherName === user.name || a.teacherName === 'Mrs. Kamau')

  const stats = [
    { label: 'My Students', value: myStudents.length, icon: Users, color: 'from-blue-500 to-indigo-600' },
    { label: 'Assessments Recorded', value: myAssessments.length, icon: FileText, color: 'from-purple-500 to-pink-600' },
    { label: 'EE Achievements', value: myAssessments.filter(a => a.level === 'EE').length, icon: CheckCircle, color: 'from-emerald-500 to-teal-600' },
    { label: 'Subjects Teaching', value: 3, icon: BookOpen, color: 'from-amber-500 to-orange-600' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h3>
          <p className="text-gray-500">Manage your students and assessments</p>
        </div>
        <BookOpen className="w-10 h-10 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-xl`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            My Students
          </h4>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {myStudents.map((student) => (
              <div key={student.id} className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{student.firstName} {student.lastName}</p>
                    <p className="text-sm text-gray-500">{student.admNumber} • {student.currentClass}</p>
                  </div>
                  <Eye className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            Recent Assessments
          </h4>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {myAssessments.slice(0, 5).map((assessment) => (
              <div key={assessment.id} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{assessment.studentName}</p>
                    <p className="text-sm text-gray-500">{assessment.subject} • {assessment.term}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getCBCColour(assessment.level)}`}>
                      {assessment.level}
                    </span>
                    <p className="text-sm font-bold text-gray-700 mt-1">{assessment.score}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ParentDashboard({ user }: { user: User }) {
  // Parents ONLY see their children
  const myChildren = mockStudents.filter(s => s.parentUserId === user.id)
  const myChildrenIds = myChildren.map(c => c.id)
  const myChildrenAssessments = mockAssessments.filter(a => myChildrenIds.includes(a.studentId))

  const totalFees = myChildren.reduce((sum, c) => sum + c.feeBalance, 0)
  const avgScore = myChildrenAssessments.length > 0 
    ? Math.round(myChildrenAssessments.reduce((sum, a) => sum + a.score, 0) / myChildrenAssessments.length)
    : 0

  const stats = [
    { label: 'My Children', value: myChildren.length, icon: Users, color: 'from-blue-500 to-indigo-600' },
    { label: 'Fee Balance', value: `KES ${totalFees.toLocaleString()}`, icon: DollarSign, color: 'from-amber-500 to-orange-600' },
    { label: 'Avg Performance', value: `${avgScore}%`, icon: BarChart3, color: 'from-emerald-500 to-teal-600' },
    { label: 'Assessments', value: myChildrenAssessments.length, icon: FileText, color: 'from-purple-500 to-pink-600' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Parent Dashboard</h3>
          <p className="text-gray-500">View your children's progress and fees</p>
        </div>
        <Users className="w-10 h-10 text-blue-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-xl`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          My Children
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myChildren.map((child) => (
            <div key={child.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {child.firstName[0]}{child.lastName[0]}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{child.firstName} {child.lastName}</p>
                  <p className="text-sm text-gray-500">{child.admNumber} • {child.currentClass}</p>
                  <p className="text-sm font-semibold text-amber-600 mt-1">Fee Balance: KES {child.feeBalance.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-500" />
          Recent Performance
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Level</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Term</th>
              </tr>
            </thead>
            <tbody>
              {myChildrenAssessments.slice(0, 5).map((assessment) => (
                <tr key={assessment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{assessment.studentName}</td>
                  <td className="py-3 px-4 text-gray-600">{assessment.subject}</td>
                  <td className="py-3 px-4 font-bold text-gray-800">{assessment.score}%</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getCBCColour(assessment.level)}`}>
                      {assessment.level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{assessment.term}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Tab Content Components
function StudentsTab({ role, user }: { role: UserRole; user: User }) {
  // Teachers see all students (for their subjects), Parents see only their children, Admin sees all
  const students = role === 'parent' 
    ? mockStudents.filter(s => s.parentUserId === user.id)
    : mockStudents

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            {role === 'parent' ? 'My Children' : role === 'admin' ? 'All Students' : 'My Students'}
          </h3>
          <p className="text-gray-500">
            {role === 'parent' ? 'View your children\'s information' : `Managing ${students.length} students`}
          </p>
        </div>
        {role === 'admin' && (
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors">
            <Users className="w-5 h-5" />
            Add Student
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Student</th>
                {role === 'admin' && <th className="text-left py-4 px-6 font-semibold text-gray-700">Parent</th>}
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Class</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Fee Balance</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const parent = mockUsers.find(u => u.id === student.parentUserId)
                return (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{student.firstName} {student.lastName}</p>
                          <p className="text-sm text-gray-500">{student.admNumber}</p>
                        </div>
                      </div>
                    </td>
                    {role === 'admin' && <td className="py-4 px-6 text-gray-600">{parent?.name || 'N/A'}</td>}
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {student.currentClass}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-bold ${student.feeBalance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        KES {student.feeBalance.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AssessmentsTab({ role, user }: { role: UserRole; user: User }) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    score: '',
    term: 'Term 1',
    year: 2024,
    comments: ''
  })

  // Filter assessments based on role
  const assessments = role === 'parent'
    ? mockAssessments.filter(a => mockStudents.filter(s => s.parentUserId === user.id).map(s => s.id).includes(a.studentId))
    : role === 'teacher'
    ? mockAssessments.filter(a => a.teacherName === user.name || a.teacherName === 'Mrs. Kamau')
    : mockAssessments

  const availableStudents = role === 'parent'
    ? mockStudents.filter(s => s.parentUserId === user.id)
    : mockStudents

  const handleAIGenerate = () => {
    if (formData.studentId && formData.subject && formData.score) {
      const student = mockStudents.find(s => s.id === parseInt(formData.studentId))
      const level = getCBCLevel(parseInt(formData.score))
      const comment = generateAIComment(
        `${student?.firstName} ${student?.lastName}`,
        formData.subject,
        parseInt(formData.score),
        level
      )
      setFormData(prev => ({ ...prev, comments: comment }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowForm(false)
    setFormData({ studentId: '', subject: '', score: '', term: 'Term 1', year: 2024, comments: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            {role === 'parent' ? 'My Children\'s Performance' : 'Assessments'}
          </h3>
          <p className="text-gray-500">{assessments.length} records found</p>
        </div>
        {role !== 'parent' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            {showForm ? 'Cancel' : 'New Assessment'}
          </button>
        )}
      </div>

      {showForm && role !== 'parent' && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            AI-Powered Assessment
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Student</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Student</option>
                  {availableStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Mathematics"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Score (0-100)</label>
                <input
                  type="number"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                  min="0"
                  max="100"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Term</label>
                <select
                  value={formData.term}
                  onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option>Term 1</option>
                  <option>Term 2</option>
                  <option>Term 3</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {formData.studentId && formData.subject && formData.score && (
              <button
                type="button"
                onClick={handleAIGenerate}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                Generate AI Comment
              </button>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Teacher Comments</label>
              <textarea
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                rows={4}
                placeholder="AI-generated or custom comments..."
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-4 rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
            >
              Save Assessment
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Student</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Subject</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Score</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Level</th>
                {role === 'admin' && <th className="text-left py-4 px-6 font-semibold text-gray-700">Teacher</th>}
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Term</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Comments</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((assessment) => (
                <tr key={assessment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-800">{assessment.studentName}</td>
                  <td className="py-4 px-6 text-gray-600">{assessment.subject}</td>
                  <td className="py-4 px-6 font-bold text-gray-800">{assessment.score}%</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getCBCColour(assessment.level)}`}>
                      {assessment.level}
                    </span>
                  </td>
                  {role === 'admin' && <td className="py-4 px-6 text-gray-600">{assessment.teacherName}</td>}
                  <td className="py-4 px-6 text-gray-600">{assessment.term}</td>
                  <td className="py-4 px-6 text-gray-600 max-w-xs truncate">{assessment.teacherComments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function FinancesTab({ role, user }: { role: UserRole; user: User }) {
  // Only admin and parents see finances
  if (role === 'teacher') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600">Access Restricted</h3>
          <p className="text-gray-500 mt-2">Teachers do not have access to financial information.</p>
        </div>
      </div>
    )
  }

  // Parents see only their children's fees
  const relevantStudents = role === 'parent'
    ? mockStudents.filter(s => s.parentUserId === user.id)
    : mockStudents

  const totalFees = relevantStudents.reduce((sum, s) => sum + s.feeBalance, 0)
  const collected = mockPayments
    .filter(p => p.status === 'completed' && relevantStudents.map(s => s.id).includes(p.studentId))
    .reduce((sum, p) => sum + p.amount, 0)
  const pending = mockPayments
    .filter(p => p.status === 'pending' && relevantStudents.map(s => s.id).includes(p.studentId))
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            {role === 'admin' ? 'School Finances' : 'Fee Status'}
          </h3>
          <p className="text-gray-500">{role === 'admin' ? 'Overview of all school finances' : 'Your children\'s fee balances'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
          <DollarSign className="w-10 h-10 mb-2" />
          <p className="text-white/80">Total Collected</p>
          <p className="text-3xl font-bold">KES {collected.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
          <AlertCircle className="w-10 h-10 mb-2" />
          <p className="text-white/80">Pending Payments</p>
          <p className="text-3xl font-bold">KES {pending.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
          <TrendingDown className="w-10 h-10 mb-2" />
          <p className="text-white/80">Outstanding Balance</p>
          <p className="text-3xl font-bold">KES {totalFees.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h4 className="text-lg font-bold text-gray-800 mb-4">Fee Balances</h4>
        <div className="space-y-3">
          {relevantStudents.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {student.firstName[0]}{student.lastName[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{student.firstName} {student.lastName}</p>
                  <p className="text-sm text-gray-500">{student.currentClass} • {student.admNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${student.feeBalance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  KES {student.feeBalance.toLocaleString()}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  student.feeBalance > 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {student.feeBalance > 0 ? 'Outstanding' : 'Cleared'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PaymentsTab({ role, user }: { role: UserRole; user: User }) {
  // Parents see only their children's payments, Admin/Teacher see all
  const payments = role === 'parent'
    ? mockPayments.filter(p => mockStudents.filter(s => s.parentUserId === user.id).map(s => s.id).includes(p.studentId))
    : mockPayments

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            {role === 'parent' ? 'Payment History' : 'All Payments'}
          </h3>
          <p className="text-gray-500">{payments.length} payment records</p>
        </div>
        {role === 'parent' && (
          <button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg">
            <CreditCard className="w-5 h-5" />
            Pay via M-Pesa
          </button>
        )}
      </div>

      {role === 'parent' && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Phone className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold">M-Pesa Payment</h4>
              <p className="text-white/80">Pay fees instantly using M-Pesa STK Push</p>
            </div>
            <button className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
              Pay Now
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Student</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">M-Pesa Code</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Amount</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-800">{payment.studentName}</td>
                  <td className="py-4 px-6 text-gray-600 font-mono">{payment.mpesaCode}</td>
                  <td className="py-4 px-6 font-bold text-gray-800">KES {payment.amount.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      payment.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{payment.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ChildrenTab({ user }: { user: User }) {
  const myChildren = mockStudents.filter(s => s.parentUserId === user.id)
  const myChildrenIds = myChildren.map(c => c.id)
  const assessments = mockAssessments.filter(a => myChildrenIds.includes(a.studentId))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">My Children</h3>
          <p className="text-gray-500">View detailed information about your children</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {myChildren.map((child) => {
          const childAssessments = assessments.filter(a => a.studentId === child.id)
          const avgScore = childAssessments.length > 0
            ? Math.round(childAssessments.reduce((sum, a) => sum + a.score, 0) / childAssessments.length)
            : 0

          return (
            <div key={child.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600">
                    {child.firstName[0]}{child.lastName[0]}
                  </div>
                  <div className="text-white">
                    <h4 className="text-2xl font-bold">{child.firstName} {child.lastName}</h4>
                    <p className="text-white/80">{child.admNumber}</p>
                    <p className="text-white/80">{child.currentClass}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Fee Balance</p>
                    <p className={`text-2xl font-bold ${child.feeBalance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      KES {child.feeBalance.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Average Score</p>
                    <p className="text-2xl font-bold text-purple-600">{avgScore}%</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-gray-800 mb-3">Recent Performance</h5>
                  <div className="space-y-2">
                    {childAssessments.slice(0, 3).map((assessment) => (
                      <div key={assessment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{assessment.subject}</p>
                          <p className="text-sm text-gray-500">{assessment.term}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${getCBCColour(assessment.level)}`}>
                            {assessment.level}
                          </span>
                          <p className="text-sm font-bold text-gray-700">{assessment.score}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FeeStatusTab({ user }: { user: User }) {
  const myChildren = mockStudents.filter(s => s.parentUserId === user.id)
  const payments = mockPayments.filter(p => myChildren.map(c => c.id).includes(p.studentId))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Fee Status</h3>
          <p className="text-gray-500">Track your children's fee payments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
          <TrendingDown className="w-10 h-10 mb-2" />
          <p className="text-white/80">Total Outstanding</p>
          <p className="text-3xl font-bold">
            KES {myChildren.reduce((sum, c) => sum + c.feeBalance, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
          <DollarSign className="w-10 h-10 mb-2" />
          <p className="text-white/80">Total Paid</p>
          <p className="text-3xl font-bold">
            KES {payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h4 className="text-lg font-bold text-gray-800 mb-4">Payment History</h4>
        <div className="space-y-3">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-semibold text-gray-800">{payment.studentName}</p>
                <p className="text-sm text-gray-500">{payment.mpesaCode}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">KES {payment.amount.toLocaleString()}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  payment.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                  payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PerformanceTab({ user }: { user: User }) {
  const myChildren = mockStudents.filter(s => s.parentUserId === user.id)
  const myChildrenIds = myChildren.map(c => c.id)
  const assessments = mockAssessments.filter(a => myChildrenIds.includes(a.studentId))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Performance Report</h3>
          <p className="text-gray-500">Academic performance for your children</p>
        </div>
      </div>

      {myChildren.map((child) => {
        const childAssessments = assessments.filter(a => a.studentId === child.id)
        
        return (
          <div key={child.id} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {child.firstName[0]}{child.lastName[0]}
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">{child.firstName} {child.lastName}</h4>
                <p className="text-gray-500">{child.currentClass}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {childAssessments.map((assessment) => (
                <div key={assessment.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-bold text-gray-800">{assessment.subject}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getCBCColour(assessment.level)}`}>
                      {assessment.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-indigo-600">{assessment.score}%</p>
                    <p className="text-sm text-gray-500">{assessment.term}</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-3 italic">{assessment.teacherComments}</p>
                </div>
              ))}
            </div>

            {childAssessments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No assessments recorded yet for this term.
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function SettingsTab({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Settings</h3>
          <p className="text-gray-500">Manage your account settings</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h4 className="text-lg font-bold text-gray-800 mb-4">Profile Information</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Full Name</label>
              <input
                type="text"
                defaultValue={user.name}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Email</label>
              <input
                type="email"
                defaultValue={user.email}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Role</label>
            <input
              type="text"
              value={user.role.toUpperCase()}
              disabled
              className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500"
            />
          </div>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

// Main App
function AppContent() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')

  if (!user) {
    return <LoginPage />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (user.role === 'admin') return <AdminDashboard setActiveTab={setActiveTab} />
        if (user.role === 'teacher') return <TeacherDashboard user={user} />
        if (user.role === 'parent') return <ParentDashboard user={user} />
        return null
      case 'students':
        return <StudentsTab role={user.role} user={user} />
      case 'assessments':
        return <AssessmentsTab role={user.role} user={user} />
      case 'finances':
        return <FinancesTab role={user.role} user={user} />
      case 'payments':
        return <PaymentsTab role={user.role} user={user} />
      case 'children':
        return <ChildrenTab user={user} />
      case 'fees':
        return <FeeStatusTab user={user} />
      case 'performance':
        return <PerformanceTab user={user} />
      case 'settings':
        return <SettingsTab user={user} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={user.role} />
      
      <div className="lg:ml-72">
        <Header user={user} onLogout={logout} />
        
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App