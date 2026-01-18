import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  LayoutDashboard, 
  Building2, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types/auth';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
  userName: string;
  navItems: NavItem[];
}

const roleColors: Record<UserRole, string> = {
  super_admin: 'bg-purple-500',
  hospital_admin: 'bg-blue-500',
  doctor: 'bg-teal-500',
  patient: 'bg-pink-500',
};

const roleLabels: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  hospital_admin: 'Hospital Admin',
  doctor: 'Doctor',
  patient: 'Patient',
};

export const DashboardLayout = ({ children, role, userName, navItems }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-sidebar border-r border-sidebar-border
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-sidebar-foreground">MediCore</span>
            </Link>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5 text-sidebar-foreground" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={index}
                  to={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${roleColors[role]} flex items-center justify-center text-white font-semibold`}>
                {userName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{userName}</p>
                <p className="text-xs text-muted-foreground">{roleLabels[role]}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
          <button 
            className="lg:hidden p-2 rounded-lg hover:bg-accent"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-foreground">
              {navItems.find(item => item.href === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* AI Assistant Button */}
            <Button variant="ghost" size="icon" className="relative">
              <MessageSquare className="w-5 h-5" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </Button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <div className={`w-8 h-8 rounded-full ${roleColors[role]} flex items-center justify-center text-white text-sm font-semibold`}>
                  {userName.charAt(0)}
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-lg shadow-lg border border-border z-50 py-1">
                    <Link 
                      to="#" 
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
