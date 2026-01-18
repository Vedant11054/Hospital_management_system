import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface HospitalFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const AddHospitalForm = ({ onSuccess, onClose }: HospitalFormProps) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/hospitals/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          address,
          phone,
          adminEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to add hospital');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setName('');
      setAddress('');
      setPhone('');
      setAdminEmail('');

      setTimeout(() => {
        onSuccess?.();
        onClose?.();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">Hospital added successfully!</span>
        </div>
      )}

      <div>
        <Label htmlFor="hospital-name" className="text-sm font-medium">Hospital Name</Label>
        <Input
          id="hospital-name"
          placeholder="Enter hospital name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="hospital-address" className="text-sm font-medium">Address</Label>
        <Input
          id="hospital-address"
          placeholder="Enter hospital address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={isLoading}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="hospital-phone" className="text-sm font-medium">Phone</Label>
        <Input
          id="hospital-phone"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isLoading}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="hospital-email" className="text-sm font-medium">Admin Email</Label>
        <Input
          id="hospital-email"
          type="email"
          placeholder="Enter admin email"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
          disabled={isLoading}
          required
          className="mt-1"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Adding...' : 'Add Hospital'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
