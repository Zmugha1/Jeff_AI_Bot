import { useState, useMemo } from 'react';
import { formatCurrency } from '../lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  DollarSign,
  Calculator,
} from 'lucide-react';
import { clients } from '../data/clients';

const cardStyle = {
  background: 'white',
  border: '1px solid #C8E8E5',
  borderRadius: '12px',
} as const;

const inputBase = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid #C8E8E5',
  borderRadius: '8px',
  color: '#2D4459',
  outline: 'none',
  boxSizing: 'border-box' as const,
};

function focusInputBorder(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = '#3BBFBF';
}

function blurInputBorder(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = '#C8E8E5';
}

export function BusinessGoals() {
  const [hoursPerWeek, setHoursPerWeek] = useState(11);
  const [hourlyValue, setHourlyValue] = useState(150);
  const [numClients, setNumClients] = useState(8);
  const [newHoursPerWeek, setNewHoursPerWeek] = useState(2);
  const [retentionImprovement, setRetentionImprovement] = useState(10);
  const [newClientsPerYear, setNewClientsPerYear] = useState(2);

  const calculations = useMemo(() => {
    const currentWeeklyCost = hoursPerWeek * hourlyValue;
    const currentAnnualCost = currentWeeklyCost * 52;

    const newWeeklyCost = newHoursPerWeek * hourlyValue;
    const newAnnualCost = newWeeklyCost * 52;

    const timeSavings = currentAnnualCost - newAnnualCost;

    const avgRetainer =
      clients.reduce((sum, c) => sum + c.monthlyRetainer, 0) / clients.length;
    const retentionValue =
      (retentionImprovement / 100) * numClients * avgRetainer * 12;
    const newClientValue = newClientsPerYear * avgRetainer * 12;

    const totalValue = timeSavings + retentionValue + newClientValue;
    const dashboardCost = 30000;
    const netBenefit = totalValue - dashboardCost;
    const roi = (netBenefit / dashboardCost) * 100;

    return {
      currentAnnualCost,
      timeSavings,
      retentionValue,
      newClientValue,
      totalValue,
      dashboardCost,
      netBenefit,
      roi,
    };
  }, [
    hoursPerWeek,
    hourlyValue,
    numClients,
    newHoursPerWeek,
    retentionImprovement,
    newClientsPerYear,
  ]);

  const retentionPct = (retentionImprovement / 50) * 100;

  return (
    <div
      className="p-8 animate-fade-in"
      style={{ background: '#FEFAF5', minHeight: '100vh' }}
    >
      <div style={{ marginBottom: '28px' }}>
        <h1
          style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#2D4459',
            marginBottom: '4px',
          }}
        >
          Business Goals
        </h1>
        <p style={{ fontSize: '13px', color: '#7A8F95' }}>
          Jeff's revenue targets and practice ROI — year to date
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6" style={cardStyle}>
          <h2
            className="text-lg font-semibold mb-6 flex items-center gap-2"
            style={{ color: '#2D4459' }}
          >
            <TrendingDown className="w-5 h-5" style={{ color: '#C8613F' }} />
            Your Current State
          </h2>

          <div className="space-y-6">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: '#2D4459' }}
              >
                Hours per week on reporting
              </label>
              <input
                type="number"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                style={inputBase}
                onFocus={focusInputBorder}
                onBlur={blurInputBorder}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: '#2D4459' }}
              >
                Your hourly value ($)
              </label>
              <input
                type="number"
                value={hourlyValue}
                onChange={(e) => setHourlyValue(Number(e.target.value))}
                style={inputBase}
                onFocus={focusInputBorder}
                onBlur={blurInputBorder}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: '#2D4459' }}
              >
                Number of clients
              </label>
              <input
                type="number"
                value={numClients}
                onChange={(e) => setNumClients(Number(e.target.value))}
                style={inputBase}
                onFocus={focusInputBorder}
                onBlur={blurInputBorder}
              />
            </div>
          </div>

          <div
            className="mt-6 p-4 rounded-xl"
            style={{
              background: 'rgba(200,97,63,0.08)',
              border: '1px solid rgba(200,97,63,0.25)',
              borderRadius: '12px',
            }}
          >
            <p className="font-semibold" style={{ color: '#C8613F' }}>
              Current Annual Cost
            </p>
            <p
              className="text-3xl font-bold mt-1"
              style={{ color: '#C8613F' }}
            >
              {formatCurrency(calculations.currentAnnualCost)}
            </p>
            <p className="text-sm mt-1" style={{ color: '#7A8F95' }}>
              {hoursPerWeek} hours/week × ${hourlyValue}/hour × 52 weeks
            </p>
          </div>
        </div>

        <div className="p-6" style={cardStyle}>
          <h2
            className="text-lg font-semibold mb-6 flex items-center gap-2"
            style={{ color: '#2D4459' }}
          >
            <TrendingUp className="w-5 h-5" style={{ color: '#3BBFBF' }} />
            With Dashboard Solution
          </h2>

          <div className="space-y-6">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: '#2D4459' }}
              >
                New hours per week on reporting
              </label>
              <input
                type="number"
                value={newHoursPerWeek}
                onChange={(e) => setNewHoursPerWeek(Number(e.target.value))}
                style={inputBase}
                onFocus={focusInputBorder}
                onBlur={blurInputBorder}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: '#2D4459' }}
              >
                Retention improvement (%)
              </label>
              <input
                type="range"
                min={0}
                max={50}
                value={retentionImprovement}
                onChange={(e) =>
                  setRetentionImprovement(Number(e.target.value))
                }
                className="w-full"
                style={{ accentColor: '#3BBFBF' }}
              />
              <div
                className="w-full mt-2"
                style={{
                  height: '6px',
                  borderRadius: '4px',
                  background: '#C8E8E5',
                }}
              >
                <div
                  style={{
                    width: `${retentionPct}%`,
                    height: '6px',
                    borderRadius: '4px',
                    background: '#3BBFBF',
                  }}
                />
              </div>
              <div
                className="flex justify-between text-sm mt-1"
                style={{ color: '#7A8F95' }}
              >
                <span>0%</span>
                <span className="font-medium" style={{ color: '#3BBFBF' }}>
                  {retentionImprovement}%
                </span>
                <span>50%</span>
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: '#2D4459' }}
              >
                Additional clients per year
              </label>
              <input
                type="number"
                value={newClientsPerYear}
                onChange={(e) => setNewClientsPerYear(Number(e.target.value))}
                style={inputBase}
                onFocus={focusInputBorder}
                onBlur={blurInputBorder}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div
          style={{
            background: '#2D4459',
            borderRadius: '14px',
            padding: '20px 24px',
            color: 'white',
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: 'rgba(200,232,229,0.85)' }}
              >
                Total value
              </p>
              <p className="text-xl font-bold mt-1" style={{ color: 'white' }}>
                {formatCurrency(calculations.totalValue)}
              </p>
            </div>
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: 'rgba(200,232,229,0.85)' }}
              >
                Investment
              </p>
              <p
                className="text-xl font-bold mt-1"
                style={{ color: '#C8613F' }}
              >
                {formatCurrency(calculations.dashboardCost)}
              </p>
            </div>
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: 'rgba(200,232,229,0.85)' }}
              >
                Net benefit
              </p>
              <p className="text-xl font-bold mt-1" style={{ color: '#3BBFBF' }}>
                {formatCurrency(calculations.netBenefit)}
              </p>
            </div>
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: 'rgba(200,232,229,0.85)' }}
              >
                ROI
              </p>
              <p
                className="font-bold mt-1"
                style={{ color: '#3BBFBF', fontSize: '2.25rem', lineHeight: 1.1 }}
              >
                {calculations.roi.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-8" style={cardStyle}>
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: '#7A8F95' }}
            >
              Annual value created
            </p>
            <p
              className="text-4xl font-bold mt-2"
              style={{ color: '#2D4459' }}
            >
              {formatCurrency(calculations.totalValue)}
            </p>
            <div className="mt-4 space-y-2" style={{ color: '#7A8F95' }}>
              <div className="flex justify-between">
                <span>Time savings</span>
                <span className="font-semibold" style={{ color: '#3BBFBF' }}>
                  {formatCurrency(calculations.timeSavings)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Retention value</span>
                <span className="font-semibold" style={{ color: '#3BBFBF' }}>
                  {formatCurrency(calculations.retentionValue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>New client value</span>
                <span className="font-semibold" style={{ color: '#3BBFBF' }}>
                  {formatCurrency(calculations.newClientValue)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8" style={cardStyle}>
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: '#7A8F95' }}
            >
              Investment summary
            </p>
            <p
              className="text-4xl font-bold mt-2"
              style={{ color: '#C8613F' }}
            >
              {formatCurrency(calculations.dashboardCost)}
            </p>
            <p className="mt-4 text-sm" style={{ color: '#7A8F95' }}>
              Annual platform investment compared to total value and net
              benefit above.
            </p>
            <div
              className="mt-4 pt-4 flex justify-between items-center"
              style={{ borderTop: '1px solid #C8E8E5' }}
            >
              <span style={{ color: '#2D4459', fontWeight: 600 }}>
                Net benefit
              </span>
              <span className="text-xl font-bold" style={{ color: '#3BBFBF' }}>
                {formatCurrency(calculations.netBenefit)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 text-center" style={cardStyle}>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: 'rgba(59,191,191,0.12)' }}
          >
            <Clock className="w-6 h-6" style={{ color: '#3BBFBF' }} />
          </div>
          <p className="text-sm" style={{ color: '#7A8F95' }}>
            Time savings
          </p>
          <p
            className="text-2xl font-bold mt-1"
            style={{ color: '#3BBFBF' }}
          >
            {formatCurrency(calculations.timeSavings)}
          </p>
          <p className="text-xs mt-1" style={{ color: '#7A8F95' }}>
            {Math.round(
              ((hoursPerWeek - newHoursPerWeek) / hoursPerWeek) * 100,
            )}
            % reduction
          </p>
        </div>

        <div className="p-6 text-center" style={cardStyle}>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: 'rgba(59,191,191,0.12)' }}
          >
            <Users className="w-6 h-6" style={{ color: '#3BBFBF' }} />
          </div>
          <p className="text-sm" style={{ color: '#7A8F95' }}>
            Retention value
          </p>
          <p
            className="text-2xl font-bold mt-1"
            style={{ color: '#3BBFBF' }}
          >
            {formatCurrency(calculations.retentionValue)}
          </p>
          <p className="text-xs mt-1" style={{ color: '#7A8F95' }}>
            +{retentionImprovement}% improvement
          </p>
        </div>

        <div className="p-6 text-center" style={cardStyle}>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: 'rgba(59,191,191,0.12)' }}
          >
            <DollarSign className="w-6 h-6" style={{ color: '#3BBFBF' }} />
          </div>
          <p className="text-sm" style={{ color: '#7A8F95' }}>
            New client value
          </p>
          <p
            className="text-2xl font-bold mt-1"
            style={{ color: '#3BBFBF' }}
          >
            {formatCurrency(calculations.newClientValue)}
          </p>
          <p className="text-xs mt-1" style={{ color: '#7A8F95' }}>
            +{newClientsPerYear} clients/year
          </p>
        </div>

        <div className="p-6 text-center" style={cardStyle}>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: 'rgba(200,97,63,0.1)' }}
          >
            <Calculator className="w-6 h-6" style={{ color: '#C8613F' }} />
          </div>
          <p className="text-sm" style={{ color: '#7A8F95' }}>
            Dashboard cost
          </p>
          <p
            className="text-2xl font-bold mt-1"
            style={{ color: '#C8613F' }}
          >
            {formatCurrency(calculations.dashboardCost)}
          </p>
          <p className="text-xs mt-1" style={{ color: '#7A8F95' }}>
            Annual investment
          </p>
        </div>
      </div>

      <div
        className="mt-8 p-8 text-center rounded-xl"
        style={{
          background: 'white',
          border: '1px solid #C8E8E5',
          borderRadius: '12px',
        }}
      >
        <h3 className="text-2xl font-bold" style={{ color: '#2D4459' }}>
          Net annual benefit:{' '}
          <span style={{ color: '#3BBFBF' }}>
            {formatCurrency(calculations.netBenefit)}
          </span>
        </h3>
        <p className="mt-2" style={{ color: '#7A8F95' }}>
          For every $1 you invest in the dashboard, you get $
          {(calculations.totalValue / calculations.dashboardCost).toFixed(2)}{' '}
          back in value
        </p>
      </div>
    </div>
  );
}
