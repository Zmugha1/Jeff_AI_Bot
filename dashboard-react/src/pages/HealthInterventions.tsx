import {
  useState,
  useMemo,
  useRef,
  useEffect,
  type CSSProperties,
} from 'react';
import { AlertTriangle, Activity } from 'lucide-react';
import { clients, clientSummaries } from '../data/clients';
import type { ClientSummary } from '../types';

type ResponseDraft = {
  action: string;
  notes: string;
  date: string;
};

type SavedEntry = {
  id: string;
  clientId: string;
  clientName: string;
  signal: string;
  action: string;
  notes: string;
  date: string;
};

const RESPONSE_OPTIONS = [
  'Select response...',
  'Called client',
  'Sent performance report',
  'Scheduled review meeting',
  'Paused underperforming campaign',
  'Adjusted campaign strategy',
  'Sent optimisation recommendations',
  'No action yet',
] as const;

function isAtRisk(summary: ClientSummary): boolean {
  return (
    summary.status === 'attention' ||
    summary.status === 'action_required' ||
    summary.healthScore < 65
  );
}

function signalText(summary: ClientSummary): string {
  if (summary.status === 'action_required') {
    return 'Health score critically low. Immediate client contact recommended.';
  }
  if (summary.status === 'attention') {
    return 'Performance declining. Review campaign metrics before next contact.';
  }
  return 'Health score below target. Monitor closely and review metrics.';
}

function leftBorderColor(summary: ClientSummary): string {
  if (summary.status === 'action_required') return '#F05F57';
  if (summary.status === 'attention') return '#C8613F';
  return '#C8613F';
}

function healthScoreBadgeStyles(score: number): {
  background: string;
  color: string;
} {
  if (score < 50) {
    return { background: 'rgba(240,95,87,0.08)', color: '#F05F57' };
  }
  if (score < 65) {
    return { background: 'rgba(232,169,154,0.19)', color: '#C8613F' };
  }
  return { background: 'rgba(200,232,229,0.19)', color: '#3BBFBF' };
}

function avgHealthColor(avg: number): string {
  if (avg >= 80) return '#3BBFBF';
  if (avg >= 60) return '#C8613F';
  return '#F05F57';
}

export function HealthInterventions() {
  const [responses, setResponses] = useState<Record<string, ResponseDraft>>({});
  const [savedLog, setSavedLog] = useState<SavedEntry[]>([]);
  const [confirmedClientId, setConfirmedClientId] = useState<string | null>(
    null,
  );
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
    };
  }, []);

  const atRiskList = useMemo(() => {
    return clientSummaries
      .filter(isAtRisk)
      .map((summary) => {
        const client = clients.find((c) => c.id === summary.clientId);
        return client ? { client, summary } : null;
      })
      .filter((x): x is { client: (typeof clients)[0]; summary: ClientSummary } => x !== null);
  }, []);

  const underReviewCount = useMemo(() => {
    return clientSummaries.filter(
      (s) => s.status === 'attention' || s.status === 'action_required',
    ).length;
  }, []);

  const averageHealth = useMemo(() => {
    if (clientSummaries.length === 0) return 0;
    const sum = clientSummaries.reduce((acc, s) => acc + s.healthScore, 0);
    return Math.round(sum / clientSummaries.length);
  }, []);

  const avgColor = avgHealthColor(averageHealth);

  const updateDraft = (
    clientId: string,
    patch: Partial<ResponseDraft>,
  ) => {
    setResponses((prev) => {
      const current = prev[clientId] ?? {
        action: 'Select response...',
        notes: '',
        date: '',
      };
      return {
        ...prev,
        [clientId]: { ...current, ...patch },
      };
    });
  };

  const handleSave = (clientId: string, clientName: string, summary: ClientSummary) => {
    const draft =
      responses[clientId] ?? {
        action: 'Select response...',
        notes: '',
        date: '',
      };
    if (!draft.action || draft.action === 'Select response...') return;

    if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);

    setSavedLog((prev) => [
      {
        id: `${Date.now()}-${clientId}`,
        clientId,
        clientName,
        signal: signalText(summary),
        action: draft.action,
        notes: draft.notes,
        date: new Date().toLocaleDateString(),
      },
      ...prev,
    ]);

    setConfirmedClientId(clientId);
    confirmTimerRef.current = setTimeout(() => {
      setConfirmedClientId(null);
      confirmTimerRef.current = null;
    }, 2000);
  };

  const cardStyle: CSSProperties = {
    background: 'white',
    border: '1px solid #C8E8E5',
    borderRadius: '12px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  };

  return (
    <div
      style={{
        background: '#FEFAF5',
        minHeight: '100vh',
        padding: '28px 32px',
      }}
    >
      <h1
        style={{
          fontSize: '22px',
          fontWeight: '700',
          color: '#2D4459',
          marginBottom: '4px',
        }}
      >
        Health Interventions
      </h1>
      <p
        style={{
          fontSize: '13px',
          color: '#7A8F95',
          marginBottom: '28px',
        }}
      >
        Every signal. Every response. Every outcome.
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <span
          style={{
            color: '#2D4459',
            fontSize: '14px',
            fontWeight: 700,
          }}
        >
          Clients Needing Attention
        </span>
        <span
          style={{
            background: 'rgba(240,95,87,0.09)',
            color: '#F05F57',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: '20px',
            padding: '3px 10px',
          }}
        >
          {atRiskList.length} clients
        </span>
      </div>

      {atRiskList.length === 0 ? (
        <div
          style={{
            background: 'white',
            border: '1px solid #C8E8E5',
            borderLeft: '4px solid #3BBFBF',
            borderRadius: '10px',
            padding: '16px 20px',
          }}
        >
          <p style={{ color: '#7A8F95', fontSize: '13px', margin: 0 }}>
            All clients are healthy this week. No signals requiring response
            right now.
          </p>
        </div>
      ) : (
        atRiskList.map(({ client, summary }) => {
          const draft =
            responses[client.id] ?? {
              action: 'Select response...',
              notes: '',
              date: '',
            };
          const hs = healthScoreBadgeStyles(summary.healthScore);
          const borderLeft = leftBorderColor(summary);

          return (
            <div
              key={client.id}
              style={{
                background: 'white',
                border: '1px solid #C8E8E5',
                borderLeft: `4px solid ${borderLeft}`,
                borderRadius: '10px',
                padding: '16px 20px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      color: '#2D4459',
                      fontSize: '15px',
                      fontWeight: 700,
                    }}
                  >
                    {client.name}
                  </span>
                  <span
                    style={{
                      ...hs,
                      fontWeight: 700,
                      marginLeft: '8px',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      fontSize: '12px',
                    }}
                  >
                    {summary.healthScore}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    borderRadius: '20px',
                    padding: '2px 10px',
                    ...(summary.status === 'action_required'
                      ? {
                          background: 'rgba(240,95,87,0.08)',
                          color: '#F05F57',
                        }
                      : summary.status === 'attention'
                        ? {
                            background: 'rgba(232,169,154,0.19)',
                            color: '#C8613F',
                          }
                        : {
                            background: 'rgba(232,169,154,0.12)',
                            color: '#C8613F',
                          }),
                  }}
                >
                  {summary.status === 'action_required'
                    ? 'Action Required'
                    : summary.status === 'attention'
                      ? 'Needs Attention'
                      : 'Health watch'}
                </span>
              </div>

              <p
                style={{
                  marginTop: '6px',
                  color: '#7A8F95',
                  fontSize: '12px',
                  marginBottom: 0,
                }}
              >
                {signalText(summary)}
              </p>

              <div
                style={{
                  marginTop: '14px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: '#7A8F95',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '4px',
                    }}
                  >
                    Response
                  </label>
                  <select
                    value={draft.action}
                    onChange={(e) =>
                      updateDraft(client.id, { action: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #C8E8E5',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: '#2D4459',
                      background: 'white',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3BBFBF';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#C8E8E5';
                    }}
                  >
                    {RESPONSE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: '#7A8F95',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '4px',
                    }}
                  >
                    Notes
                  </label>
                  <textarea
                    value={draft.notes}
                    onChange={(e) =>
                      updateDraft(client.id, { notes: e.target.value })
                    }
                    rows={2}
                    placeholder="Add context..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #C8E8E5',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#2D4459',
                      resize: 'none',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3BBFBF';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#C8E8E5';
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  marginTop: '12px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                {confirmedClientId === client.id && (
                  <span
                    style={{
                      background: '#C8E8E5',
                      color: '#3BBFBF',
                      borderRadius: '20px',
                      padding: '3px 12px',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    Response logged
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleSave(client.id, client.name, summary)}
                  style={{
                    background: '#3BBFBF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          );
        })
      )}

      <div style={{ marginTop: '40px' }}>
        <h2
          style={{
            color: '#2D4459',
            fontSize: '14px',
            fontWeight: 700,
            marginBottom: '12px',
          }}
        >
          Intervention History
        </h2>

        {savedLog.length === 0 ? (
          <p
            style={{
              color: '#7A8F95',
              fontSize: '12px',
              fontStyle: 'italic',
              margin: 0,
            }}
          >
            Logged interventions will appear here.
          </p>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: 'white',
              border: '1px solid #C8E8E5',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <thead>
              <tr
                style={{
                  background: '#F4F7F8',
                  borderBottom: '1px solid #C8E8E5',
                }}
              >
                {['Date', 'Client', 'Signal', 'Response', 'Notes'].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 14px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#7A8F95',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {savedLog.map((row, i) => (
                <tr
                  key={row.id}
                  style={{
                    background: i % 2 === 0 ? 'white' : '#FEFAF5',
                    borderBottom: '1px solid rgba(200,232,229,0.125)',
                  }}
                >
                  <td
                    style={{
                      padding: '10px 14px',
                      fontSize: '12px',
                      color: '#2D4459',
                    }}
                  >
                    {row.date}
                  </td>
                  <td
                    style={{
                      padding: '10px 14px',
                      fontSize: '12px',
                      color: '#2D4459',
                      fontWeight: 600,
                    }}
                  >
                    {row.clientName}
                  </td>
                  <td
                    style={{
                      padding: '10px 14px',
                      fontSize: '12px',
                      color: '#C8613F',
                    }}
                  >
                    {row.signal}
                  </td>
                  <td
                    style={{
                      padding: '10px 14px',
                      fontSize: '12px',
                      color: '#2D4459',
                    }}
                  >
                    {row.action}
                  </td>
                  <td
                    style={{
                      padding: '10px 14px',
                      fontSize: '12px',
                      color: '#7A8F95',
                      fontStyle: 'italic',
                    }}
                  >
                    {row.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div
        style={{
          marginTop: '32px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}
      >
        <div style={cardStyle}>
          <AlertTriangle
            size={28}
            color="#C8613F"
            strokeWidth={2}
            aria-hidden
          />
          <div>
            <div
              style={{
                color: '#2D4459',
                fontSize: '28px',
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              {underReviewCount}
            </div>
            <div style={{ color: '#7A8F95', fontSize: '12px' }}>
              clients need attention
            </div>
          </div>
        </div>
        <div style={cardStyle}>
          <Activity
            size={28}
            color={avgColor}
            strokeWidth={2}
            aria-hidden
          />
          <div>
            <div
              style={{
                color: avgColor,
                fontSize: '28px',
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              {averageHealth}
            </div>
            <div style={{ color: '#7A8F95', fontSize: '12px' }}>
              average client health
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
