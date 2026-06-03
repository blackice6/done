import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { 
  LogOut, 
  LayoutDashboard,
  School
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return <Outlet />;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = {
    admin: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    ],
    teacher: [
      { name: 'Dashboard', path: '/teacher', icon: LayoutDashboard },
    ],
    parent: [
      { name: 'Dashboard', path: '/parent', icon: LayoutDashboard },
    ]
  };

  const currentNav = navItems[user.role] || [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 flex items-center space-x-3">
          <School className="w-8 h-8 text-yellow-400" />
          <span className="text-xl font-bold tracking-wider">GOLDENKEY</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-indigo-800 text-white' 
                    : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-indigo-800 rounded-xl p-4 mb-4">
            <p className="text-sm text-indigo-200">Logged in as</p>
            <p className="font-semibold truncate">{user.name}</p>
            <p className="text-xs text-indigo-300 capitalize mt-1">{user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-indigo-200 hover:text-white w-full px-4 py-2 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-indigo-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <School className="w-6 h-6 text-yellow-400" />
            <span className="font-bold">GOLDENKEY</span>
          </div>
          <button onClick={handleLogout} className="p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
