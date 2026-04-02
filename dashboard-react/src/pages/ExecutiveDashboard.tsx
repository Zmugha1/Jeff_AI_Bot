import { useState, useMemo, type CSSProperties } from 'react';
import {
  LineChart as ReLineChart,
  Line,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Phone,
  Target,
  Clock,
  AlertTriangle,
  RefreshCw,
  Filter,
} from 'lucide-react';
import { clients, clientSummaries, monthlyMetrics } from '../data/clients';
import {
  formatNumber,
  formatCurrency,
  formatPercentage,
} from '../lib/utils';
import type { ClientSummary } from '../types';

interface ExecutiveDashboardProps {
  onClientSelect: (clientId: string) => void;
}

const tooltipStyle = {
  backgroundColor: '#2D4459',
  border: 'none',
  borderRadius: '8px',
  color: 'white',
} as const;

const kpiCardStyle = {
  background: 'white',
  border: '1px solid #C8E8E5',
  borderRadius: '12px',
} as const;

const chartWrapStyle = {
  background: 'white',
  border: '1px solid #C8E8E5',
  borderRadius: '12px',
} as const;

const iconMap = {
  users: Users,
  phone: Phone,
  target: Target,
  clock: Clock,
  chart: TrendingUp,
} as const;

type KpiIcon = keyof typeof iconMap;

function KpiBlock({
  title,
  value,
  trend,
  trendLabel,
  subtitle,
  icon,
  format = 'number' as const,
}: {
  title: string;
  value: number;
  trend?: number;
  trendLabel?: string;
  subtitle?: string;
  icon: KpiIcon;
  format?: 'number' | 'currency' | 'percentage';
}) {
  const Icon = iconMap[icon];
  const isPositive = trend !== undefined && trend >= 0;
  const iconPositive = trend === undefined ? true : isPositive;
  const formattedValue =
    format === 'currency'
      ? formatCurrency(value)
      : format === 'percentage'
        ? `${value}%`
        : formatNumber(value);

  return (
    <div className="p-6" style={kpiCardStyle}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className="text-sm font-medium"
            style={{ color: '#7A8F95' }}
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
                style={{ color: isPositive ? '#3BBFBF' : '#F05F57' }}
              >
                {isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
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
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: iconPositive
              ? 'rgba(59,191,191,0.12)'
              : 'rgba(240,95,87,0.1)',
          }}
        >
          <Icon
            className="w-6 h-6"
            style={{ color: iconPositive ? '#3BBFBF' : '#F05F57' }}
          />
        </div>
      </div>
    </div>
  );
}

function statusBadgeStyles(status: ClientSummary['status']) {
  if (status === 'on_track') {
    return {
      background: 'rgba(59,191,191,0.12)',
      color: '#3BBFBF',
      border: '1px solid rgba(59,191,191,0.3)',
    };
  }
  if (status === 'attention') {
    return {
      background: 'rgba(200,97,63,0.1)',
      color: '#C8613F',
      border: '1px solid rgba(200,97,63,0.25)',
    };
  }
  return {
    background: 'rgba(240,95,87,0.1)',
    color: '#F05F57',
    border: '1px solid rgba(240,95,87,0.25)',
  };
}

function MorningClientCard({
  client,
  onClick,
}: {
  client: ClientSummary;
  onClick: () => void;
}) {
  const isSessionPositive = client.sessionTrend >= 0;
  const badge = statusBadgeStyles(client.status);
  const label =
    client.status === 'on_track'
      ? 'On Track'
      : client.status === 'attention'
        ? 'Attention'
        : 'Action Required';

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      className="cursor-pointer p-5 transition-colors"
      style={{
        ...kpiCardStyle,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold" style={{ color: '#2D4459' }}>
            {client.clientName}
          </h4>
          <p className="text-sm" style={{ color: '#7A8F95' }}>
            {client.industry}
          </p>
        </div>
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
          style={badge}
        >
          {label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p
            className="text-xs uppercase tracking-wide"
            style={{ color: '#7A8F95' }}
          >
            Sessions
          </p>
          <p className="text-xl font-bold" style={{ color: '#2D4459' }}>
            {formatNumber(client.latestSessions)}
          </p>
          <div
            className="flex items-center gap-1 text-sm mt-1"
            style={{ color: isSessionPositive ? '#3BBFBF' : '#F05F57' }}
          >
            {isSessionPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {formatPercentage(client.sessionTrend)}
          </div>
        </div>

        <div>
          <p
            className="text-xs uppercase tracking-wide"
            style={{ color: '#7A8F95' }}
          >
            Health Score
          </p>
          <div className="flex items-baseline gap-1">
            <p className="text-xl font-bold" style={{ color: '#2D4459' }}>
              {client.healthScore}
            </p>
            <span className="text-sm" style={{ color: '#7A8F95' }}>
              / 100
            </span>
          </div>
          <div
            className="w-full rounded-full h-1.5 mt-2"
            style={{ background: 'rgba(200,232,229,0.35)' }}
          >
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: `${client.healthScore}%`,
                background:
                  client.healthScore >= 80
                    ? '#3BBFBF'
                    : client.healthScore >= 50
                      ? '#C8613F'
                      : '#F05F57',
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="pt-4 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(200,232,229,0.5)' }}
      >
        <div>
          <p
            className="text-xs uppercase tracking-wide"
            style={{ color: '#7A8F95' }}
          >
            ROI
          </p>
          <p
            className="text-lg font-bold"
            style={{
              color: client.roiPercentage >= 100 ? '#3BBFBF' : '#C8613F',
            }}
          >
            {client.roiPercentage}%
          </p>
        </div>
        <div className="text-right">
          <p
            className="text-xs uppercase tracking-wide"
            style={{ color: '#7A8F95' }}
          >
            Monthly
          </p>
          <p className="text-lg font-bold" style={{ color: '#2D4459' }}>
            {formatCurrency(client.monthlyRetainer)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ExecutiveDashboard({ onClientSelect }: ExecutiveDashboardProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');

  const industries = useMemo(() => {
    const unique = new Set(clients.map((c) => c.industry));
    return Array.from(unique);
  }, []);

  const filteredClients = useMemo(() => {
    return clientSummaries.filter((client) => {
      if (statusFilter !== 'all' && client.status !== statusFilter)
        return false;
      if (industryFilter !== 'all') {
        const clientData = clients.find((c) => c.id === client.clientId);
        if (clientData?.industry !== industryFilter) return false;
      }
      return true;
    });
  }, [statusFilter, industryFilter]);

  const attentionClients = useMemo(() => {
    return clientSummaries.filter(
      (c) => c.status === 'attention' || c.status === 'action_required',
    );
  }, []);

  const totalRevenue = clients.reduce((sum, c) => sum + c.monthlyRetainer, 0);
  const avgHealth = Math.round(
    clientSummaries.reduce((sum, c) => sum + c.healthScore, 0) /
      clientSummaries.length,
  );

  const sessionsData = useMemo(() => {
    const grouped = monthlyMetrics.reduce(
      (acc, m) => {
        acc[m.monthYear] = (acc[m.monthYear] || 0) + m.sessions;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, []);

  const conversionsData = useMemo(() => {
    const grouped = monthlyMetrics.reduce(
      (acc, m) => {
        acc[m.monthYear] = (acc[m.monthYear] || 0) + m.conversions;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, []);

  const selectClass =
    'px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 border bg-white';
  const selectStyle: CSSProperties = {
    borderColor: '#C8E8E5',
    color: '#2D4459',
  };

  const hour = new Date().getHours();
  const executiveGreeting =
    hour < 12
      ? 'Good morning, Deepika.'
      : hour < 18
        ? 'Good afternoon, Deepika.'
        : 'Good evening, Deepika.';

  return (
    <div
      className="p-8 animate-fade-in"
      style={{ background: '#FEFAF5', minHeight: '100%' }}
    >
      <div
        style={{
          background: '#2D4459',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            fontSize: '22px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '4px',
          }}
        >
          {executiveGreeting}
        </div>
        <div
          style={{
            fontSize: '13px',
            color: '#C8E8E5',
            marginBottom: '8px',
          }}
        >
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(200,232,229,0.8)' }}>
          {attentionClients.length} clients need attention this week.
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#2D4459' }}>
          Morning Brief
        </h1>
        <p className="mt-1" style={{ color: '#7A8F95' }}>
          Real-time KPIs and client performance overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <KpiBlock
          title="Total Clients"
          value={clients.length}
          trend={3}
          trendLabel="new this quarter"
          icon="users"
        />
        <KpiBlock
          title="Active Campaigns"
          value={18}
          trend={2}
          trendLabel="this month"
          icon="target"
        />
        <KpiBlock
          title="Monthly Revenue"
          value={totalRevenue}
          trend={8}
          trendLabel="vs last month"
          icon="chart"
          format="currency"
        />
        <KpiBlock
          title="Avg. Health Score"
          value={avgHealth}
          trend={4}
          trendLabel="points"
          icon="target"
        />
        <KpiBlock
          title="Total Conversions"
          value={monthlyMetrics
            .filter((m) => m.monthYear === 'Mar 2025')
            .reduce((sum, m) => sum + m.conversions, 0)}
          trend={12}
          trendLabel="vs last month"
          icon="phone"
        />
        <KpiBlock
          title="Time Saved"
          value={6.5}
          subtitle="hours/week"
          icon="clock"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: '#7A8F95' }} />
          <span className="text-sm" style={{ color: '#7A8F95' }}>
            Filter by Status
          </span>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`${selectClass} focus:ring-[#3BBFBF]`}
          style={selectStyle}
        >
          <option value="all">All</option>
          <option value="on_track">On Track</option>
          <option value="attention">Needs Attention</option>
          <option value="action_required">Action Required</option>
        </select>

        <div className="flex items-center gap-2 ml-4">
          <Filter className="w-4 h-4" style={{ color: '#7A8F95' }} />
          <span className="text-sm" style={{ color: '#7A8F95' }}>
            Filter by Industry
          </span>
        </div>
        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className={`${selectClass} focus:ring-[#3BBFBF]`}
          style={selectStyle}
        >
          <option value="all">All</option>
          {industries.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors border bg-white"
          style={{ borderColor: '#C8E8E5', color: '#2D4459' }}
        >
          <RefreshCw className="w-4 h-4" style={{ color: '#7A8F95' }} />
          Refresh Data
        </button>
      </div>

      <div className="mb-8">
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: '#2D4459' }}
        >
          Client Performance Matrix
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <MorningClientCard
              key={client.clientId}
              client={client}
              onClick={() => onClientSelect(client.clientId)}
            />
          ))}
        </div>
      </div>

      {attentionClients.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-lg font-semibold mb-4 flex items-center gap-2"
            style={{ color: '#2D4459' }}
          >
            <AlertTriangle
              className="w-5 h-5"
              style={{ color: '#C8613F' }}
            />
            Alerts & Action Items
          </h2>
          <div className="space-y-3">
            {attentionClients.map((client) => {
              const leftBorder =
                client.status === 'action_required'
                  ? '4px solid #F05F57'
                  : '4px solid #C8613F';
              return (
                <div
                  key={client.clientId}
                  className="p-4"
                  style={{
                    background: 'white',
                    border: '1px solid #C8E8E5',
                    borderRadius: '10px',
                    borderLeft: leftBorder,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                        style={statusBadgeStyles(client.status)}
                      >
                        {client.status === 'attention'
                          ? 'Attention'
                          : 'Action Required'}
                      </span>
                      <span
                        className="font-semibold"
                        style={{ color: '#2D4459' }}
                      >
                        {client.clientName}
                      </span>
                      <span className="text-sm" style={{ color: '#7A8F95' }}>
                        {client.industry}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onClientSelect(client.clientId)}
                      className="text-sm font-medium hover:underline"
                      style={{ color: '#3BBFBF' }}
                    >
                      View Details
                    </button>
                  </div>
                  <p className="text-sm mt-2" style={{ color: '#7A8F95' }}>
                    Sessions {client.sessionTrend > 0 ? '+' : ''}
                    {client.sessionTrend}% | Health Score: {client.healthScore}
                    /100
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6" style={chartWrapStyle}>
          <h4 className="font-semibold mb-4" style={{ color: '#2D4459' }}>
            Total Website Sessions (All Clients)
          </h4>
          <ResponsiveContainer width="100%" height={280}>
            <ReLineChart
              data={sessionsData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#C8E8E5"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#7A8F95"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#7A8F95"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value
                }
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: 'white' }}
                itemStyle={{ color: 'white' }}
                formatter={(value: number) => [value.toLocaleString(), '']}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3BBFBF"
                strokeWidth={2}
                dot={{ fill: '#3BBFBF', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </ReLineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6" style={chartWrapStyle}>
          <h4 className="font-semibold mb-4" style={{ color: '#2D4459' }}>
            Total Conversions (All Clients)
          </h4>
          <ResponsiveContainer width="100%" height={280}>
            <ReBarChart
              data={conversionsData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#C8E8E5"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#7A8F95"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#7A8F95"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: 'white' }}
                itemStyle={{ color: 'white' }}
                formatter={(value: number) => [value.toLocaleString(), '']}
              />
              <Bar
                dataKey="value"
                fill="#C8613F"
                radius={[4, 4, 0, 0]}
              />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
