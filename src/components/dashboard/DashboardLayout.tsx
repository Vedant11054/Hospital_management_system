import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity, Settings, LogOut, Menu, X, Bell, ChevronDown, ChevronRight
} from 'lucide-react';
import { UserRole } from '@/types/auth';
import { useAuth } from '@/context/AuthContext';

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
  const { logout, user } = useAuth();

  const displayName = user?.name || userName;

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    navigate('/login');
  };

  const currentPage = navItems.find(item => item.href === location.pathname)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-56 bg-white border-r border-border flex flex-col
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-border shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-foreground">MediCore</span>
          </Link>
          <button className="lg:hidden p-1 rounded" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-4 py-2.5 bg-muted/50 border-b border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {roleLabels[role]}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-0.5">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={index}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                  ${isActive
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
                  }
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-70" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-border shrink-0">
          <div className="flex items-center gap-2 p-2 rounded-lg">
            <div className={`w-8 h-8 rounded-full ${roleColors[role]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground">{roleLabels[role]}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-1 w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-border flex items-center justify-between px-4 lg:px-5 shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-md hover:bg-muted"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Breadcrumb-style title */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground hidden sm:block">{roleLabels[role]}</span>
              <span className="text-muted-foreground hidden sm:block">/</span>
              <span className="font-semibold text-foreground">{currentPage}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="relative p-2 rounded-md hover:bg-muted text-muted-foreground">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors ml-1"
              >
                <div className={`w-7 h-7 rounded-full ${roleColors[role]} flex items-center justify-center text-white text-xs font-bold`}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden sm:block">{displayName.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-lg shadow-lg border border-border z-50 py-1">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                      <p className="text-xs text-muted-foreground">{roleLabels[role]}</p>
                    </div>
                    <Link
                      to="#"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
