import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface MockActionFormProps {
  title: string;
  description: string;
  fields: { name: string; label: string; type?: string; placeholder?: string }[];
  onSuccess: () => void;
  onClose: () => void;
}

export const MockActionForm = ({ title, description, fields, onSuccess, onClose }: MockActionFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`${title} processed successfully`);
      onSuccess();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {fields.map((field) => (
        <div key={field.name} className="space-y-1.5">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Input
            id={field.name}
            type={field.type || 'text'}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            required
          />
        </div>
      ))}

      <div className="flex gap-3 justify-end mt-6">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="hero" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};
