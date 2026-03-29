import { cn, formatNumber, formatCurrency, formatPercentage } from '../lib/utils';
import { TrendingUp, TrendingDown, Users, Phone, Target, Clock } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  trend?: number;
  trendLabel?: string;
  subtitle?: string;
  icon: 'users' | 'phone' | 'target' | 'clock' | 'chart';
  format?: 'number' | 'currency' | 'percentage';
  className?: string;
}

const iconMap = {
  users: Users,
  phone: Phone,
  target: Target,
  clock: Clock,
  chart: TrendingUp,
};

export function KPICard({
  title,
  value,
  trend,
  trendLabel,
  subtitle,
  icon,
  format = 'number',
  className,
}: KPICardProps) {
  const Icon = iconMap[icon];

  const formattedValue =
    format === 'currency'
      ? formatCurrency(value)
      : format === 'percentage'
        ? `${value}%`
        : formatNumber(value);

  const trendColor =
    trend === undefined
      ? undefined
      : trend > 0
        ? '#3BBFBF'
        : trend < 0
          ? '#F05F57'
          : '#7A8F95';

  return (
    <div
      className={cn('bg-white p-6', className)}
      style={{
        border: '1px solid #C8E8E5',
        borderRadius: '12px',
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className="font-medium"
            style={{
              color: '#7A8F95',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {title}
          </p>
          <h3
            className="text-3xl font-bold mt-2"
            style={{ color: '#2D4459' }}
          >
            {formattedValue}
          </h3>

          {trend !== undefined && (
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className="flex items-center gap-1 text-sm font-medium"
                style={{ color: trendColor }}
              >
                {trend > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : trend < 0 ? (
                  <TrendingDown className="w-4 h-4" />
                ) : null}
                {formatPercentage(trend)}
              </span>
              {trendLabel && (
                <span className="text-sm" style={{ color: '#7A8F95' }}>
                  {trendLabel}
                </span>
              )}
            </div>
          )}

          {subtitle && trend === undefined && (
            <p className="text-sm mt-2" style={{ color: '#7A8F95' }}>
              {subtitle}
            </p>
          )}
        </div>

        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(200,232,229,0.4)' }}
        >
          <Icon className="w-6 h-6" style={{ color: '#3BBFBF' }} />
        </div>
      </div>
    </div>
  );
}
