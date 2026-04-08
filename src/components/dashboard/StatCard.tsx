import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
}

export const StatCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-primary'
}: StatCardProps) => {
  const changeColors = {
    positive: 'text-emerald-600',
    negative: 'text-destructive',
    neutral: 'text-muted-foreground'
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-4">
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium truncate">{title}</p>
        <p className="text-2xl font-bold text-foreground leading-tight">{value}</p>
        {change && (
          <p className={`text-xs mt-0.5 ${changeColors[changeType]}`}>{change}</p>
        )}
      </div>
    </div>
  );
};
