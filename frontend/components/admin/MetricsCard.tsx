import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricsCardProps {
  title: string;
  value: string;
  description?: string;
  icon: ReactNode;
  growth?: number;
}

export default function MetricsCard({ title, value, description, icon, growth }: MetricsCardProps) {
  const isPositive = growth && growth > 0;
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
        <div className="h-8 w-8 text-slate-400 flex items-center justify-center">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight text-slate-800">{value}</div>
        {(growth !== undefined || description) && (
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            {growth !== undefined && (
              <span className={cn('font-bold', isPositive ? 'text-emerald-600' : 'text-rose-600')}>
                {isPositive ? '+' : ''}{growth}%
              </span>
            )}
            <span>{description}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
