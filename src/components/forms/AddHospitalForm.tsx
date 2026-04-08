import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertCircle, CheckCircle2, Building2, MapPin, Phone,
  Mail, User, Lock, Copy, Eye, EyeOff
} from 'lucide-react';

interface HospitalFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const AddHospitalForm = ({ onSuccess, onClose }: HospitalFormProps) => {
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    adminEmail: '',
    adminName: '',
    adminPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; password: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/hospitals/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          address: form.address,
          phone: form.phone,
          adminEmail: form.adminEmail,
          adminName: form.adminName || `Admin - ${form.name}`,
          adminPassword: form.adminPassword || 'password123',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to add hospital. Please try again.');
        return;
      }

      // Show credentials to copy before closing
      setCreatedCredentials({
        email: data.adminCredentials.email,
        password: data.adminCredentials.password,
      });
    } catch {
      setError('Network error. Make sure the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyCredentials = () => {
    if (!createdCredentials) return;
    const text = `Hospital Admin Login\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Step 2: Show credentials after successful creation
  if (createdCredentials) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center text-center pb-2">
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-base">Hospital Added Successfully!</h3>
          <p className="text-sm text-muted-foreground mt-1">
            An admin account has been created. Share these credentials with the hospital admin.
          </p>
        </div>

        <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Admin Login Credentials</p>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Email</p>
            <div className="flex items-center gap-2 bg-background border border-border rounded-md px-3 py-2">
              <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <code className="text-sm flex-1 select-all">{createdCredentials.email}</code>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Password</p>
            <div className="flex items-center gap-2 bg-background border border-border rounded-md px-3 py-2">
              <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <code className="text-sm flex-1 select-all">
                {showPassword ? createdCredentials.password : '•'.repeat(createdCredentials.password.length)}
              </code>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={copyCredentials}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? 'Copied!' : 'Copy Credentials'}
          </button>
        </div>

        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
          ⚠️ The hospital admin should change their password after first login. The admin email links them exclusively to this hospital.
        </p>

        <button
          type="button"
          onClick={() => { onSuccess?.(); onClose?.(); }}
          className="w-full py-2.5 px-4 gradient-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{error}</span>
        </div>
      )}

      {/* Hospital info */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Hospital Information</p>

        <div className="space-y-1">
          <Label htmlFor="name" className="flex items-center gap-1.5 text-sm font-medium">
            <Building2 className="w-3.5 h-3.5" />Hospital Name
          </Label>
          <Input id="name" name="name" placeholder="e.g. City General Hospital" value={form.name} onChange={handleChange} required />
        </div>

        <div className="space-y-1">
          <Label htmlFor="address" className="flex items-center gap-1.5 text-sm font-medium">
            <MapPin className="w-3.5 h-3.5" />Address
          </Label>
          <Input id="address" name="address" placeholder="e.g. 123 Main St, New York" value={form.address} onChange={handleChange} required />
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone" className="flex items-center gap-1.5 text-sm font-medium">
            <Phone className="w-3.5 h-3.5" />Phone
          </Label>
          <Input id="phone" name="phone" placeholder="555-0100" value={form.phone} onChange={handleChange} required />
        </div>
      </div>

      {/* Admin account */}
      <div className="space-y-3 pt-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Hospital Admin Account</p>
        <p className="text-xs text-muted-foreground -mt-1">
          This creates a login for the hospital admin. Their email links them exclusively to this hospital.
        </p>

        <div className="space-y-1">
          <Label htmlFor="adminName" className="flex items-center gap-1.5 text-sm font-medium">
            <User className="w-3.5 h-3.5" />Admin Name
          </Label>
          <Input id="adminName" name="adminName" placeholder="e.g. John Smith" value={form.adminName} onChange={handleChange} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="adminEmail" className="flex items-center gap-1.5 text-sm font-medium">
            <Mail className="w-3.5 h-3.5" />Admin Email <span className="text-destructive">*</span>
          </Label>
          <Input id="adminEmail" name="adminEmail" type="email" placeholder="admin@hospital.com" value={form.adminEmail} onChange={handleChange} required />
        </div>

        <div className="space-y-1">
          <Label htmlFor="adminPassword" className="flex items-center gap-1.5 text-sm font-medium">
            <Lock className="w-3.5 h-3.5" />Password
          </Label>
          <Input
            id="adminPassword"
            name="adminPassword"
            type="text"
            placeholder="Leave blank for default: password123"
            value={form.adminPassword}
            onChange={handleChange}
          />
          <p className="text-xs text-muted-foreground">If left blank, default password is <code className="bg-muted px-1 rounded">password123</code></p>
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} disabled={isLoading}
          className="flex-1 py-2.5 px-4 border border-border text-sm font-medium rounded-lg hover:bg-muted transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button type="submit" disabled={isLoading}
          className="flex-1 py-2.5 px-4 gradient-primary text-white text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2">
          {isLoading ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</>
          ) : (
            <><Building2 className="w-4 h-4" />Add Hospital & Create Admin</>
          )}
        </button>
      </div>
    </form>
  );
};
