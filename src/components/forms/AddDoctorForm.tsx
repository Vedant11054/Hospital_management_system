import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface AddDoctorFormProps {
  hospitalId: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const AddDoctorForm = ({ hospitalId, onSuccess, onClose }: AddDoctorFormProps) => {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const specialties = [
    'Cardiology',
    'Dermatology',
    'General Medicine',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Surgery',
    'Urology',
    'ENT',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/doctors/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hospitalId,
          name,
          specialty,
          email,
          phone,
          qualification,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to add doctor');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setName('');
      setSpecialty('');
      setEmail('');
      setPhone('');
      setQualification('');

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
          <span className="text-sm">Doctor added successfully!</span>
        </div>
      )}

      <div>
        <Label htmlFor="doctor-name" className="text-sm font-medium">Doctor Name</Label>
        <Input
          id="doctor-name"
          placeholder="Enter doctor name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="doctor-specialty" className="text-sm font-medium">Specialty</Label>
        <select
          id="doctor-specialty"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          disabled={isLoading}
          required
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select specialty</option>
          {specialties.map((spec) => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="doctor-email" className="text-sm font-medium">Email</Label>
        <Input
          id="doctor-email"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="doctor-phone" className="text-sm font-medium">Phone</Label>
        <Input
          id="doctor-phone"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isLoading}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="doctor-qualification" className="text-sm font-medium">Qualification</Label>
        <Input
          id="doctor-qualification"
          placeholder="e.g., MD, MBBS, specialization"
          value={qualification}
          onChange={(e) => setQualification(e.target.value)}
          disabled={isLoading}
          required
          className="mt-1"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Adding...' : 'Add Doctor'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
