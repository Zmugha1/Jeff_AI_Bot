import { useState, useMemo, useEffect } from 'react';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { DonutChart } from '../components/charts/DonutChart';
import {
  clients,
  clientSummaries,
  monthlyMetrics,
  clientFeedback,
} from '../data/clients';
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from '../lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Star,
  MessageSquare,
  Users,
} from 'lucide-react';
import type { ClientSummary } from '../types';

interface ClientIntelligenceProps {
  selectedClientId: string | null;
  onBack: () => void;
}

type TabId =
  | 'overview'
  | 'performance'
  | 'visibility'
  | 'reviews'
  | 'report'
  | 'insights';

const BORDER_CARD = '1px solid #C8E8E5';
const TAB_IDS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'performance', label: 'Performance' },
  { id: 'visibility', label: 'Visibility' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'report', label: 'Client Report' },
  { id: 'insights', label: 'Insights' },
];

function healthScoreNumberColor(score: number): string {
  if (score >= 80) return '#3BBFBF';
  if (score >= 50) return '#C8613F';
  return '#F05F57';
}

function healthAvatarStyles(score: number) {
  if (score >= 80) {
    return {
      bg: 'rgba(59,191,191,0.15)',
      color: '#3BBFBF',
    };
  }
  if (score >= 50) {
    return {
      bg: 'rgba(200,97,63,0.12)',
      color: '#C8613F',
    };
  }
  return {
    bg: 'rgba(240,95,87,0.12)',
    color: '#F05F57',
  };
}

function healthScoreBadgeStyles(score: number) {
  if (score >= 80) {
    return {
      background: 'rgba(200,232,229,0.19)',
      color: '#3BBFBF',
    };
  }
  if (score >= 50) {
    return {
      background: 'rgba(232,169,154,0.19)',
      color: '#C8613F',
    };
  }
  return {
    background: 'rgba(240,95,87,0.09)',
    color: '#F05F57',
  };
}

function listStatusBadge(status: ClientSummary['status']) {
  if (status === 'on_track') {
    return {
      background: 'rgba(200,232,229,0.125)',
      color: '#3BBFBF',
    };
  }
  if (status === 'attention') {
    return {
      background: 'rgba(232,169,154,0.19)',
      color: '#C8613F',
    };
  }
  return {
    background: 'rgba(240,95,87,0.08)',
    color: '#F05F57',
  };
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function statusLabel(status: ClientSummary['status']): string {
  if (status === 'on_track') return 'On track';
  if (status === 'attention') return 'Attention';
  return 'Action required';
}

export function ClientIntelligence({
  selectedClientId,
  onBack,
}: ClientIntelligenceProps) {
  const [activeClientId, setActiveClientId] = useState<string | null>(
    selectedClientId,
  );
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  useEffect(() => {
    setActiveClientId(selectedClientId);
  }, [selectedClientId]);

  const filteredSummaries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clientSummaries;
    return clientSummaries.filter(
      (s) =>
        s.clientName.toLowerCase().includes(q) ||
        s.industry.toLowerCase().includes(q),
    );
  }, [search]);

  const client = useMemo(() => {
    if (!activeClientId) return null;
    return clients.find((c) => c.id === activeClientId) ?? null;
  }, [activeClientId]);

  const summary = useMemo(() => {
    if (!activeClientId) return null;
    return clientSummaries.find((s) => s.clientId === activeClientId) ?? null;
  }, [activeClientId]);

  const metrics = useMemo(() => {
    if (!activeClientId) return [];
    return monthlyMetrics.filter((m) => m.clientId === activeClientId);
  }, [activeClientId]);

  const feedback = useMemo(() => {
    if (!activeClientId) return [];
    return clientFeedback.filter((f) => f.clientId === activeClientId);
  }, [activeClientId]);

  const latestMetrics = metrics.length > 0 ? metrics[metrics.length - 1] : null;
  const isSessionPositive = summary ? summary.sessionTrend >= 0 : false;
  const isConversionPositive = summary ? summary.conversionTrend >= 0 : false;

  const sessionsData = metrics.map((m) => ({
    name: m.monthYear,
    value: m.sessions,
  }));
  const conversionsData = metrics.map((m) => ({
    name: m.monthYear,
    value: m.conversions,
  }));
  const impressionsData = metrics.map((m) => ({
    name: m.monthYear,
    value: m.impressions,
  }));
  const clicksData = metrics.map((m) => ({
    name: m.monthYear,
    value: m.clicks,
  }));

  const donutData = [
    { name: 'Organic Search', value: 65, color: '#3BBFBF' },
    { name: 'Direct', value: 20, color: '#C8613F' },
    { name: 'Referral', value: 10, color: '#7A8F95' },
    { name: 'Social', value: 5, color: '#2D4459' },
  ];

  const totalFeedbackValue = feedback.reduce((sum, f) => sum + f.value, 0);

  const innerCard = {
    background: 'white',
    border: BORDER_CARD,
    borderRadius: '12px',
  } as const;

  return (
    <div
      className="flex w-full animate-fade-in"
      style={{ minHeight: '100vh', height: '100%' }}
    >
      <aside
        className="flex flex-col flex-shrink-0"
        style={{
          width: '260px',
          minWidth: '260px',
          background: 'white',
          borderRight: BORDER_CARD,
          height: '100%',
          minHeight: '100vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            padding: '16px',
            borderBottom: BORDER_CARD,
          }}
        >
          <h2
            style={{
              color: '#2D4459',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            Client Intelligence
          </h2>
          <input
            type="search"
            placeholder="Search clients…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full placeholder:text-[#7A8F95]"
            style={{
              width: '100%',
              marginTop: '10px',
              padding: '8px 12px',
              border: BORDER_CARD,
              borderRadius: '8px',
              fontSize: '12px',
              color: '#2D4459',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3BBFBF';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#C8E8E5';
            }}
          />
          <button
            type="button"
            onClick={() => {
              setActiveClientId(null);
              onBack();
            }}
            className="mt-3 text-left w-full transition-colors"
            style={{
              fontSize: '11px',
              color: '#7A8F95',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Clear selection
          </button>
        </div>

        <ul className="list-none m-0 p-0">
          {filteredSummaries.map((s) => {
            const full = clients.find((c) => c.id === s.clientId);
            const sub =
              full?.services?.[0] && full.services[0].length > 0
                ? full.services[0]
                : s.industry;
            const selected = activeClientId === s.clientId;
            const badge = listStatusBadge(s.status);
            return (
              <li key={s.clientId}>
                <button
                  type="button"
                  onClick={() => setActiveClientId(s.clientId)}
                  className="w-full text-left transition-all duration-[0.15s]"
                  style={{
                    padding: selected ? '12px 16px 12px 13px' : '12px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid rgba(200,232,229,0.125)',
                    borderLeft: selected
                      ? '3px solid #3BBFBF'
                      : '3px solid transparent',
                    background: selected
                      ? 'rgba(59,191,191,0.08)'
                      : 'transparent',
                    borderRight: 'none',
                    borderTop: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!selected) {
                      e.currentTarget.style.background =
                        'rgba(200,232,229,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = selected
                      ? 'rgba(59,191,191,0.08)'
                      : 'transparent';
                  }}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span
                      style={{
                        color: '#2D4459',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      {s.clientName}
                    </span>
                    <span
                      style={{
                        color: healthScoreNumberColor(s.healthScore),
                        fontSize: '12px',
                        fontWeight: 700,
                      }}
                    >
                      {s.healthScore}
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center gap-2"
                    style={{ marginTop: '3px' }}
                  >
                    <span style={{ color: '#7A8F95', fontSize: '11px' }}>
                      {sub}
                    </span>
                    <span
                      style={{
                        ...badge,
                        fontSize: '10px',
                        padding: '1px 6px',
                        borderRadius: '20px',
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {statusLabel(s.status)}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <div
        className="flex-1 min-w-0"
        style={{
          background: '#FEFAF5',
          overflowY: 'auto',
        }}
      >
        {!activeClientId || !client || !summary ? (
          <div
            className="flex items-center justify-center"
            style={{ minHeight: '100vh', height: '100%' }}
          >
            <div style={{ textAlign: 'center' }}>
              <Users size={48} color="#C8E8E5" strokeWidth={1.5} />
              <p
                style={{
                  color: '#7A8F95',
                  fontSize: '14px',
                  marginTop: '12px',
                }}
              >
                Select a client to view their intelligence
              </p>
            </div>
          </div>
        ) : !latestMetrics ? (
          <div className="p-8" style={{ color: '#7A8F95' }}>
            No performance metrics for this client yet.
          </div>
        ) : (
          <div style={{ padding: '28px 32px' }}>
            <header
              className="flex items-center gap-4"
              style={{ marginBottom: '24px', gap: '16px' }}
            >
              {(() => {
                const av = healthAvatarStyles(summary.healthScore);
                return (
                  <div
                    className="flex items-center justify-center flex-shrink-0 font-bold"
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      background: av.bg,
                      color: av.color,
                      fontSize: '16px',
                    }}
                  >
                    {initials(client.name)}
                  </div>
                );
              })()}
              <div className="min-w-0 flex-1">
                <h1
                  style={{
                    color: '#2D4459',
                    fontSize: '22px',
                    fontWeight: 700,
                  }}
                >
                  {client.name}
                </h1>
                <div
                  className="flex flex-wrap items-center gap-2"
                  style={{ marginTop: '6px' }}
                >
                  <span
                    style={{
                      background: '#F4F7F8',
                      color: '#7A8F95',
                      fontSize: '10px',
                      padding: '2px 8px',
                      borderRadius: '20px',
                    }}
                  >
                    {client.industry}
                  </span>
                  {client.services.slice(0, 2).map((svc) => (
                    <span
                      key={svc}
                      style={{
                        background: 'rgba(200,232,229,0.125)',
                        color: '#3BBFBF',
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '20px',
                      }}
                    >
                      {svc}
                    </span>
                  ))}
                  <span
                    style={{
                      ...healthScoreBadgeStyles(summary.healthScore),
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                    }}
                  >
                    Health {summary.healthScore}
                  </span>
                </div>
              </div>
            </header>

            <nav
              style={{
                background: 'white',
                border: BORDER_CARD,
                borderBottom: 'none',
                borderRadius: '12px 12px 0 0',
                padding: '0 24px',
                display: 'flex',
                gap: 0,
              }}
            >
              {TAB_IDS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '12px 20px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      borderBottom: isActive
                        ? '3px solid #3BBFBF'
                        : '3px solid transparent',
                      color: isActive ? '#3BBFBF' : '#7A8F95',
                      fontWeight: isActive ? 600 : 500,
                      background: 'none',
                      border: 'none',
                      borderTop: 'none',
                      borderLeft: 'none',
                      borderRight: 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = '#2D4459';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = '#7A8F95';
                      }
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <section
              style={{
                background: 'white',
                border: BORDER_CARD,
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
                padding: '24px 28px',
                minHeight: '400px',
              }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    style={{ marginBottom: '8px' }}
                  >
                    <div className="p-5" style={innerCard}>
                      <p
                        className="text-sm font-medium"
                        style={{ color: '#7A8F95' }}
                      >
                        Health score
                      </p>
                      <p
                        className="text-3xl font-bold mt-1"
                        style={{
                          color: healthScoreNumberColor(summary.healthScore),
                        }}
                      >
                        {summary.healthScore}
                        <span
                          className="text-lg font-normal"
                          style={{ color: '#7A8F95' }}
                        >
                          {' '}
                          / 100
                        </span>
                      </p>
                      <p className="text-sm mt-2" style={{ color: '#2D4459' }}>
                        {statusLabel(summary.status)}
                      </p>
                    </div>
                    <div className="p-5" style={innerCard}>
                      <p
                        className="text-sm font-medium"
                        style={{ color: '#7A8F95' }}
                      >
                        Monthly retainer
                      </p>
                      <p
                        className="text-3xl font-bold mt-1"
                        style={{ color: '#2D4459' }}
                      >
                        {formatCurrency(client.monthlyRetainer)}
                      </p>
                    </div>
                    <div className="p-5" style={innerCard}>
                      <p
                        className="text-sm font-medium"
                        style={{ color: '#7A8F95' }}
                      >
                        ROI
                      </p>
                      <p
                        className="text-3xl font-bold mt-1"
                        style={{
                          color:
                            summary.roiPercentage >= 100
                              ? '#3BBFBF'
                              : '#C8613F',
                        }}
                      >
                        {summary.roiPercentage}%
                      </p>
                    </div>
                  </div>
                  <p style={{ color: '#7A8F95', fontSize: '14px' }}>
                    {client.location} · {client.website}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4" style={innerCard}>
                      <p
                        className="text-sm font-medium"
                        style={{ color: '#7A8F95' }}
                      >
                        Website visitors
                      </p>
                      <p
                        className="text-xl font-bold mt-1"
                        style={{ color: '#2D4459' }}
                      >
                        {formatNumber(latestMetrics.sessions)}
                      </p>
                      <div
                        className="flex items-center gap-1 mt-1 text-sm"
                        style={{
                          color: isSessionPositive ? '#3BBFBF' : '#F05F57',
                        }}
                      >
                        {isSessionPositive ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {formatPercentage(summary.sessionTrend)} vs last month
                      </div>
                    </div>
                    <div className="p-4" style={innerCard}>
                      <p
                        className="text-sm font-medium"
                        style={{ color: '#7A8F95' }}
                      >
                        Google clicks
                      </p>
                      <p
                        className="text-xl font-bold mt-1"
                        style={{ color: '#2D4459' }}
                      >
                        {formatNumber(latestMetrics.clicks)}
                      </p>
                      <div
                        className="flex items-center gap-1 mt-1 text-sm"
                        style={{ color: '#3BBFBF' }}
                      >
                        <TrendingUp className="w-4 h-4" />
                        +12.5% vs last month
                      </div>
                    </div>
                    <div className="p-4" style={innerCard}>
                      <p
                        className="text-sm font-medium"
                        style={{ color: '#7A8F95' }}
                      >
                        Avg time on site
                      </p>
                      <p
                        className="text-xl font-bold mt-1"
                        style={{ color: '#2D4459' }}
                      >
                        {Math.floor(latestMetrics.avgSessionDuration / 60)}m{' '}
                        {latestMetrics.avgSessionDuration % 60}s
                      </p>
                      <div
                        className="flex items-center gap-1 mt-1 text-sm"
                        style={{ color: '#3BBFBF' }}
                      >
                        <TrendingUp className="w-4 h-4" />
                        +8.3% vs last month
                      </div>
                    </div>
                    <div className="p-4" style={innerCard}>
                      <p
                        className="text-sm font-medium"
                        style={{ color: '#7A8F95' }}
                      >
                        Conversions
                      </p>
                      <p
                        className="text-xl font-bold mt-1"
                        style={{ color: '#2D4459' }}
                      >
                        {latestMetrics.conversions}
                      </p>
                      <div
                        className="flex items-center gap-1 mt-1 text-sm"
                        style={{
                          color: isConversionPositive ? '#3BBFBF' : '#F05F57',
                        }}
                      >
                        {isConversionPositive ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {formatPercentage(summary.conversionTrend)} vs last
                        month
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'performance' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LineChart
                      data={sessionsData}
                      title="Website sessions over time"
                      color="#3BBFBF"
                      className="!border-[#C8E8E5] rounded-xl"
                    />
                    <BarChart
                      data={conversionsData}
                      title="Conversions over time"
                      color="#C8613F"
                      className="!border-[#C8E8E5] rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <DonutChart
                      data={donutData}
                      title="Traffic sources"
                      className="!border-[#C8E8E5] rounded-xl"
                    />
                    <div className="p-6" style={innerCard}>
                      <h4
                        className="font-semibold mb-4"
                        style={{ color: '#2D4459' }}
                      >
                        Engagement metrics
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <div
                            className="flex justify-between text-sm mb-1"
                            style={{ color: '#7A8F95' }}
                          >
                            <span>Bounce rate</span>
                            <span
                              className="font-medium"
                              style={{ color: '#2D4459' }}
                            >
                              {(latestMetrics.bounceRate * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div
                            className="w-full rounded-full"
                            style={{
                              height: '6px',
                              background: '#C8E8E5',
                              borderRadius: '4px',
                            }}
                          >
                            <div
                              style={{
                                height: '6px',
                                borderRadius: '4px',
                                width: `${latestMetrics.bounceRate * 100}%`,
                                background: '#3BBFBF',
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div
                            className="flex justify-between text-sm mb-1"
                            style={{ color: '#7A8F95' }}
                          >
                            <span>Pages per session</span>
                            <span
                              className="font-medium"
                              style={{ color: '#2D4459' }}
                            >
                              {latestMetrics.pagesPerSession}
                            </span>
                          </div>
                          <div
                            className="w-full rounded-full"
                            style={{
                              height: '6px',
                              background: '#C8E8E5',
                              borderRadius: '4px',
                            }}
                          >
                            <div
                              style={{
                                height: '6px',
                                borderRadius: '4px',
                                width: `${(latestMetrics.pagesPerSession / 5) * 100}%`,
                                background: '#3BBFBF',
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div
                            className="flex justify-between text-sm mb-1"
                            style={{ color: '#7A8F95' }}
                          >
                            <span>Conversion rate</span>
                            <span
                              className="font-medium"
                              style={{ color: '#2D4459' }}
                            >
                              {(latestMetrics.conversionRate * 100).toFixed(2)}%
                            </span>
                          </div>
                          <div
                            className="w-full rounded-full"
                            style={{
                              height: '6px',
                              background: '#C8E8E5',
                              borderRadius: '4px',
                            }}
                          >
                            <div
                              style={{
                                height: '6px',
                                borderRadius: '4px',
                                width: `${Math.min(100, (latestMetrics.conversionRate / 0.1) * 100)}%`,
                                background: '#C8613F',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6" style={innerCard}>
                      <h4
                        className="font-semibold mb-4"
                        style={{ color: '#2D4459' }}
                      >
                        Session duration
                      </h4>
                      <div className="space-y-3">
                        {metrics.slice(-5).map((m) => (
                          <div
                            key={m.monthYear}
                            className="flex justify-between items-center"
                          >
                            <span
                              className="text-sm"
                              style={{ color: '#7A8F95' }}
                            >
                              {m.monthYear}
                            </span>
                            <span
                              className="font-medium"
                              style={{ color: '#2D4459' }}
                            >
                              {Math.floor(m.avgSessionDuration / 60)}m{' '}
                              {m.avgSessionDuration % 60}s
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'visibility' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LineChart
                      data={impressionsData}
                      title="Search impressions"
                      color="#3BBFBF"
                      className="!border-[#C8E8E5] rounded-xl"
                    />
                    <LineChart
                      data={clicksData}
                      title="Search clicks"
                      color="#C8613F"
                      className="!border-[#C8E8E5] rounded-xl"
                    />
                  </div>
                  <div className="p-6" style={innerCard}>
                    <h4
                      className="font-semibold mb-4"
                      style={{ color: '#2D4459' }}
                    >
                      Search performance summary
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <p className="text-sm" style={{ color: '#7A8F95' }}>
                          Impressions
                        </p>
                        <p
                          className="text-2xl font-bold mt-1"
                          style={{ color: '#2D4459' }}
                        >
                          {formatNumber(latestMetrics.impressions)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm" style={{ color: '#7A8F95' }}>
                          Clicks
                        </p>
                        <p
                          className="text-2xl font-bold mt-1"
                          style={{ color: '#2D4459' }}
                        >
                          {formatNumber(latestMetrics.clicks)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm" style={{ color: '#7A8F95' }}>
                          CTR
                        </p>
                        <p
                          className="text-2xl font-bold mt-1"
                          style={{ color: '#3BBFBF' }}
                        >
                          {(latestMetrics.ctr * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm" style={{ color: '#7A8F95' }}>
                          Avg position
                        </p>
                        <p
                          className="text-2xl font-bold mt-1"
                          style={{ color: '#2D4459' }}
                        >
                          {latestMetrics.position.toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-6 text-center" style={innerCard}>
                      <p className="text-sm" style={{ color: '#7A8F95' }}>
                        Average rating
                      </p>
                      <p
                        className="text-4xl font-bold mt-2 flex items-center justify-center gap-1"
                        style={{ color: '#C8613F' }}
                      >
                        <Star
                          className="w-8 h-8 inline"
                          fill="#C8613F"
                          stroke="#C8613F"
                        />
                        {latestMetrics.avgRating}
                      </p>
                      <p className="text-sm mt-1" style={{ color: '#7A8F95' }}>
                        out of 5
                      </p>
                    </div>
                    <div className="p-6 text-center" style={innerCard}>
                      <p className="text-sm" style={{ color: '#7A8F95' }}>
                        Total reviews
                      </p>
                      <p
                        className="text-4xl font-bold mt-2"
                        style={{ color: '#2D4459' }}
                      >
                        {latestMetrics.reviewCount}
                      </p>
                      <p className="text-sm mt-1" style={{ color: '#3BBFBF' }}>
                        +{latestMetrics.newReviews} this month
                      </p>
                    </div>
                    <div className="p-6 text-center" style={innerCard}>
                      <p className="text-sm" style={{ color: '#7A8F95' }}>
                        Response rate
                      </p>
                      <p
                        className="text-4xl font-bold mt-2"
                        style={{ color: '#2D4459' }}
                      >
                        94%
                      </p>
                      <p className="text-sm mt-1" style={{ color: '#7A8F95' }}>
                        to reviews
                      </p>
                    </div>
                    <div className="p-6 text-center" style={innerCard}>
                      <p className="text-sm" style={{ color: '#7A8F95' }}>
                        Review velocity
                      </p>
                      <p
                        className="text-4xl font-bold mt-2"
                        style={{ color: '#2D4459' }}
                      >
                        {latestMetrics.newReviews}
                      </p>
                      <p className="text-sm mt-1" style={{ color: '#7A8F95' }}>
                        per month
                      </p>
                    </div>
                  </div>
                  <LineChart
                    data={metrics.map((m) => ({
                      name: m.monthYear,
                      value: m.reviewCount,
                    }))}
                    title="Review count over time"
                    color="#3BBFBF"
                    className="!border-[#C8E8E5] rounded-xl"
                  />
                </div>
              )}

              {activeTab === 'report' && (
                <div
                  className="space-y-4 max-w-3xl"
                  style={{ color: '#2D4459', fontSize: '15px', lineHeight: 1.65 }}
                >
                  <h3
                    className="text-lg font-bold"
                    style={{ color: '#2D4459' }}
                  >
                    Summary for {client.name}
                  </h3>
                  <p style={{ color: '#7A8F95' }}>
                    This is a plain-language snapshot you can share with{' '}
                    {client.contactName.split(' ')[0] || 'your contact'} at{' '}
                    {client.name}. It reflects the latest data in Pulse.
                  </p>
                  <p>
                    <strong style={{ color: '#2D4459' }}>Who they are:</strong>{' '}
                    {client.name} is a {client.industry.toLowerCase()} business
                    based in {client.location}. They invest{' '}
                    {formatCurrency(client.monthlyRetainer)} per month in growth
                    programs.
                  </p>
                  <p>
                    <strong style={{ color: '#2D4459' }}>How things look:</strong>{' '}
                    Overall health is {summary.healthScore} out of 100 (
                    {statusLabel(summary.status)}). Website traffic is at{' '}
                    {formatNumber(latestMetrics.sessions)} sessions (
                    {formatPercentage(summary.sessionTrend)} vs last month).
                    Conversions are {latestMetrics.conversions} (
                    {formatPercentage(summary.conversionTrend)} vs last month).
                  </p>
                  <p>
                    <strong style={{ color: '#2D4459' }}>Search & reviews:</strong>{' '}
                    Search visibility shows {formatNumber(latestMetrics.impressions)}{' '}
                    impressions and {formatNumber(latestMetrics.clicks)} clicks,
                    with CTR at {(latestMetrics.ctr * 100).toFixed(2)}%. Google
                    reviews average {latestMetrics.avgRating} stars across{' '}
                    {latestMetrics.reviewCount} reviews.
                  </p>
                  <p style={{ color: '#7A8F95', fontSize: '14px' }}>
                    Primary contact: {client.contactName} ({client.contactEmail}
                    ).
                  </p>
                </div>
              )}

              {activeTab === 'insights' && (
                <div className="space-y-8">
                  <div>
                    <h3
                      className="text-base font-bold mb-3"
                      style={{ color: '#2D4459' }}
                    >
                      Performance insights
                    </h3>
                    <ul
                      className="list-disc pl-5 space-y-2"
                      style={{ color: '#2D4459' }}
                    >
                      {summary.status === 'on_track' && (
                        <li>
                          Account is on track: health {summary.healthScore}/100
                          with positive momentum on core funnel metrics.
                        </li>
                      )}
                      {summary.status === 'attention' && (
                        <li style={{ color: '#C8613F' }}>
                          Needs attention: review sessions and conversions before
                          the next monthly review.
                        </li>
                      )}
                      {summary.status === 'action_required' && (
                        <li style={{ color: '#F05F57' }}>
                          Action required: prioritize recovery plan for traffic or
                          conversion gaps this week.
                        </li>
                      )}
                      <li>
                        Session trend {formatPercentage(summary.sessionTrend)} -{' '}
                        {isSessionPositive
                          ? 'visibility is improving.'
                          : 'dig into landing pages and acquisition sources.'}
                      </li>
                      <li>
                        Conversion trend{' '}
                        {formatPercentage(summary.conversionTrend)} -{' '}
                        {isConversionPositive
                          ? 'lead quality or offer alignment is working.'
                          : 'test calls-to-action and form friction.'}
                      </li>
                      <li>
                        ROI at {summary.roiPercentage}% vs retainer -{' '}
                        {summary.roiPercentage >= 100
                          ? 'returns are strong relative to spend.'
                          : 'consider reallocating budget to higher-yield channels.'}
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3
                      className="text-base font-bold mb-3 flex items-center gap-2"
                      style={{ color: '#2D4459' }}
                    >
                      <MessageSquare className="w-4 h-4" style={{ color: '#3BBFBF' }} />
                      Recorded outcomes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="p-4" style={innerCard}>
                        <p className="text-sm" style={{ color: '#7A8F95' }}>
                          Entries logged
                        </p>
                        <p
                          className="text-2xl font-bold mt-1"
                          style={{ color: '#2D4459' }}
                        >
                          {feedback.length}
                        </p>
                      </div>
                      <div className="p-4" style={innerCard}>
                        <p className="text-sm" style={{ color: '#7A8F95' }}>
                          Attributed revenue
                        </p>
                        <p
                          className="text-2xl font-bold mt-1"
                          style={{ color: '#3BBFBF' }}
                        >
                          {formatCurrency(totalFeedbackValue)}
                        </p>
                      </div>
                      <div className="p-4" style={innerCard}>
                        <p className="text-sm" style={{ color: '#7A8F95' }}>
                          ROI (summary)
                        </p>
                        <p
                          className="text-2xl font-bold mt-1"
                          style={{ color: '#3BBFBF' }}
                        >
                          {summary.roiPercentage}%
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {feedback.map((item, idx) => (
                        <div
                          key={`${item.date}-${idx}`}
                          className="p-5 rounded-xl"
                          style={{
                            background: 'white',
                            border: BORDER_CARD,
                            borderLeft: '4px solid #3BBFBF',
                            borderRadius: '10px',
                          }}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className="rounded text-xs font-medium"
                                  style={{
                                    padding: '2px 8px',
                                    background:
                                      item.type === 'lead'
                                        ? 'rgba(59,191,191,0.12)'
                                        : item.type === 'sale'
                                          ? 'rgba(59,191,191,0.2)'
                                          : 'rgba(240,95,87,0.12)',
                                    color:
                                      item.type === 'complaint'
                                        ? '#F05F57'
                                        : '#2D4459',
                                  }}
                                >
                                  {item.type.charAt(0).toUpperCase() +
                                    item.type.slice(1)}
                                </span>
                                <span
                                  className="text-sm"
                                  style={{ color: '#7A8F95' }}
                                >
                                  {item.date}
                                </span>
                              </div>
                              <p style={{ color: '#2D4459' }}>
                                {item.description}
                              </p>
                              <p
                                className="text-sm mt-2"
                                style={{ color: '#7A8F95' }}
                              >
                                Recorded by: {item.recordedBy}
                              </p>
                            </div>
                            <p
                              className="text-lg font-bold flex-shrink-0"
                              style={{
                                color:
                                  item.value > 0 ? '#3BBFBF' : '#7A8F95',
                              }}
                            >
                              {item.value > 0 ? formatCurrency(item.value) : '-'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
