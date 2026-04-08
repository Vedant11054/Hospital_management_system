import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Building2, UserCog, Stethoscope, Heart, AlertCircle, Activity } from 'lucide-react';
import { UserRole } from '@/types/auth';
import { useAuth } from '@/context/AuthContext';

const roles: { id: UserRole; label: string; icon: React.ElementType }[] = [
  { id: 'super_admin', label: 'Super Admin', icon: Building2 },
  { id: 'hospital_admin', label: 'Hospital Admin', icon: UserCog },
  { id: 'doctor', label: 'Doctor', icon: Stethoscope },
  { id: 'patient', label: 'Patient', icon: Heart },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed. Check your credentials.');
        return;
      }

      login(data.user, data.token, data.statistics);

      const routes: Record<UserRole, string> = {
        super_admin: '/super-admin',
        hospital_admin: '/hospital-admin',
        doctor: '/doctor',
        patient: '/patient',
      };

      navigate(routes[selectedRole]);
    } catch {
      setError('Cannot connect to server. Make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 gradient-primary rounded-xl mb-3">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground">MediCore</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Role selector */}
          <div className="mb-5">
            <p className="text-sm font-medium text-foreground mb-2">Who are you?</p>
            <div className="grid grid-cols-2 gap-2">
              {roles.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedRole(id)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm transition-all ${
                    selectedRole === id
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${selectedRole === id ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-9"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 gradient-primary text-white text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            No account?{' '}
            <Link to="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
