import { useState, type CSSProperties } from 'react';
import { formatCurrency, formatNumber } from '../lib/utils';
import { clients, clientSummaries } from '../data/clients';
import { Send } from 'lucide-react';

interface Message {
  role: 'user' | 'analysis';
  content: string;
}

const BORDER = '1px solid #C8E8E5';

export function MyPractice() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = (override?: string) => {
    const raw = (override ?? input).trim();
    if (!raw) return;

    const userMessage: Message = { role: 'user', content: raw };
    setMessages((prev) => [...prev, userMessage]);

    const lowerInput = raw.toLowerCase();
    let response = '';

    if (lowerInput.includes('performance') || lowerInput.includes('summary')) {
      const avgHealth = Math.round(
        clientSummaries.reduce((sum, c) => sum + c.healthScore, 0) /
          clientSummaries.length,
      );
      const onTrack = clientSummaries.filter((c) => c.status === 'on_track').length;
      const attention = clientSummaries.filter((c) => c.status === 'attention').length;
      const actionRequired = clientSummaries.filter(
        (c) => c.status === 'action_required',
      ).length;

      response = `## Performance Summary

**Overall Health:** ${avgHealth}/100 (Good)

**Client Breakdown:**
• On Track: ${onTrack} clients
• Needs Attention: ${attention} clients  
• Action Required: ${actionRequired} clients

**Top Performers:**
1. Elite HVAC - ROI: 301%, Health: 96
2. Rapid Restoration - ROI: 153%, Health: 91
3. Johnson Law Firm - ROI: 134%, Health: 94

**Need Attention:**
• Premier Fence (Health: 42) - Sessions down 12.5%
• Green Roofing (Health: 58) - Conversions declining`;
    } else if (lowerInput.includes('attention') || lowerInput.includes('problem')) {
      const attentionClients = clientSummaries.filter(
        (c) => c.status === 'attention' || c.status === 'action_required',
      );

      response = `## Clients Needing Attention

${attentionClients
  .map(
    (c) => `**${c.clientName}** (Health: ${c.healthScore})
• Sessions: ${formatNumber(c.latestSessions)} (${c.sessionTrend > 0 ? '+' : ''}${c.sessionTrend}%)
• Conversions: ${c.latestConversions} (${c.conversionTrend > 0 ? '+' : ''}${c.conversionTrend}%)
• Industry: ${c.industry}
`,
  )
  .join('\n')}

**Recommended Actions:**
1. Schedule check-in calls with these clients
2. Review their recent campaign performance
3. Consider strategy adjustments or additional services`;
    } else if (lowerInput.includes('roi') || lowerInput.includes('best')) {
      const topRoi = [...clientSummaries]
        .sort((a, b) => b.roiPercentage - a.roiPercentage)
        .slice(0, 5);

      response = `## Top ROI Clients

${topRoi
  .map(
    (c, i) => `${i + 1}. **${c.clientName}**
   • ROI: **${c.roiPercentage}%**
   • Revenue Attributed: ${formatCurrency(c.totalFeedbackValue)}
   • Monthly Retainer: ${formatCurrency(c.monthlyRetainer)}
   • Health Score: ${c.healthScore}/100`,
  )
  .join('\n\n')}

**Key Insight:** Elite HVAC is delivering exceptional ROI at 301%. Consider using them as a reference story for new business development.`;
    } else if (
      lowerInput.includes('focus') ||
      lowerInput.includes('week') ||
      lowerInput.includes('recommend')
    ) {
      response = `## This Week's Focus Areas

**1. Client Retention (High Priority)**
   • Premier Fence needs immediate attention (Health: 42)
   • Schedule strategy call to address declining performance
   • Consider campaign adjustments or additional services

**2. Growth Opportunities**
   • Elite HVAC (301% ROI) - ask for a testimonial and reference materials
   • Explore upsell opportunities with top performers

**3. Team Efficiency**
   • Your team can make data-driven decisions from this workspace
   • Review the dashboard daily instead of building manual reports
   • Use saved time for business development

**4. Client Communication**
   • 3 clients have not provided feedback in 30+ days
   • Reach out and encourage dashboard usage
   • Share wins and insights proactively

**Time Savings This Week:** ~10 hours (less manual reporting).`;
    } else if (lowerInput.includes('abc') || lowerInput.includes('electric')) {
      const client = clientSummaries.find((c) => c.clientName === 'ABC Electric');
      if (client) {
        response = `## ABC Electric Performance

**Current Metrics:**
• Sessions: ${formatNumber(client.latestSessions)} (${client.sessionTrend > 0 ? '+' : ''}${client.sessionTrend}%)
• Conversions: ${client.latestConversions} (${client.conversionTrend > 0 ? '+' : ''}${client.conversionTrend}%)
• Health Score: ${client.healthScore}/100
• ROI: ${client.roiPercentage}%

**Google Search Performance:**
• Impressions: ${formatNumber(18500)}
• Clicks: ${formatNumber(1092)}
• CTR: 5.9%
• Avg Position: 11.2

**Status:** On track - performing well.`;
      }
    } else {
      response = `Try asking:

• "Show me a performance summary"
• "Which clients need attention?"
• "Who has the best ROI?"
• "What should I focus on this week?"
• "How is [client name] performing?"

Or use the quick actions above.`;
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'analysis', content: response }]);
    }, 500);

    setInput('');
  };

  const handleQuickAction = (query: string) => {
    setInput(query);
    setTimeout(() => handleSend(query), 0);
  };

  const totalMrr = clients.reduce((sum, c) => sum + c.monthlyRetainer, 0);
  const healthy = clientSummaries.filter((c) => c.healthScore >= 80).length;
  const mid = clientSummaries.filter(
    (c) => c.healthScore >= 50 && c.healthScore < 80,
  ).length;
  const critical = clientSummaries.filter((c) => c.healthScore < 50).length;
  const totalHealth = clientSummaries.length || 1;
  const pctHealthy = (healthy / totalHealth) * 100;
  const pctMid = (mid / totalHealth) * 100;
  const pctCritical = (critical / totalHealth) * 100;

  const statCard: CSSProperties = {
    background: 'white',
    border: BORDER,
    borderRadius: '10px',
    padding: '14px 16px',
    marginBottom: '8px',
  };

  return (
    <div
      className="animate-fade-in"
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
        My Practice
      </h1>
      <p
        style={{
          fontSize: '13px',
          color: '#7A8F95',
          marginBottom: '28px',
        }}
      >
        Campaign patterns, client retention insights, and what is working across
        your portfolio.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '3fr 2fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        <div>
          <h2
            style={{
              color: '#2D4459',
              fontSize: '14px',
              fontWeight: 700,
              marginBottom: '12px',
            }}
          >
            Portfolio Intelligence
          </h2>

          <div
            style={{
              background: 'white',
              border: BORDER,
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                minHeight: '360px',
                maxHeight: '480px',
                overflowY: 'auto',
                padding: '20px',
              }}
            >
              {messages.length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    color: '#7A8F95',
                    padding: '48px 16px',
                    fontSize: '14px',
                  }}
                >
                  <p style={{ margin: '0 0 8px', color: '#2D4459' }}>
                    Ask about your portfolio
                  </p>
                  <p style={{ margin: 0, fontSize: '13px' }}>
                    Try a performance summary, attention alerts, or ROI overview
                    using the shortcuts below.
                  </p>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    style={
                      msg.role === 'user'
                        ? {
                            background: '#2D4459',
                            color: 'white',
                            borderRadius: '12px 12px 4px 12px',
                            padding: '10px 14px',
                            maxWidth: '80%',
                            marginLeft: 'auto',
                            fontSize: '13px',
                            whiteSpace: 'pre-wrap',
                          }
                        : {
                            background: 'rgba(200,232,229,0.125)',
                            color: '#2D4459',
                            borderRadius: '12px 12px 12px 4px',
                            padding: '10px 14px',
                            maxWidth: '85%',
                            fontSize: '13px',
                            lineHeight: 1.6,
                            whiteSpace: 'pre-wrap',
                          }
                    }
                  >
                    {msg.content.split('\n').map((line, i) => {
                      if (line.startsWith('## ')) {
                        return (
                          <h3
                            key={i}
                            style={{
                              fontSize: '16px',
                              fontWeight: 700,
                              margin: '0 0 8px',
                            }}
                          >
                            {line.replace('## ', '')}
                          </h3>
                        );
                      }
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return (
                          <p
                            key={i}
                            style={{ fontWeight: 600, margin: '8px 0 0' }}
                          >
                            {line.replace(/\*\*/g, '')}
                          </p>
                        );
                      }
                      if (line.startsWith('• ')) {
                        return (
                          <p key={i} style={{ margin: '4px 0', marginLeft: '12px' }}>
                            {line}
                          </p>
                        );
                      }
                      if (
                        line.startsWith('1.') ||
                        line.startsWith('2.') ||
                        line.startsWith('3.') ||
                        line.startsWith('4.')
                      ) {
                        return (
                          <p
                            key={i}
                            style={{ margin: '4px 0', marginLeft: '8px', fontWeight: 500 }}
                          >
                            {line}
                          </p>
                        );
                      }
                      return line ? (
                        <p key={i} style={{ margin: '4px 0' }}>
                          {line}
                        </p>
                      ) : (
                        <br key={i} />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                padding: '12px 16px',
                borderTop: BORDER,
                background: '#F4F7F8',
              }}
            >
              {[
                {
                  label: 'Portfolio Summary',
                  q: 'Show me a performance summary',
                },
                {
                  label: 'Attention Alerts',
                  q: 'Which clients need attention?',
                },
                { label: 'ROI Overview', q: 'Who has the best ROI?' },
                {
                  label: 'Weekly Priorities',
                  q: 'What should I focus on this week?',
                },
              ].map((b) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => handleQuickAction(b.q)}
                  style={{
                    background: 'white',
                    border: BORDER,
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: '#2D4459',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(200,232,229,0.125)';
                    e.currentTarget.style.borderColor = '#3BBFBF';
                    e.currentTarget.style.color = '#3BBFBF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = '#C8E8E5';
                    e.currentTarget.style.color = '#2D4459';
                  }}
                >
                  {b.label}
                </button>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                borderTop: BORDER,
                padding: '12px 16px',
                gap: '10px',
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your clients or campaigns..."
                style={{
                  flex: 1,
                  border: BORDER,
                  borderRadius: '8px',
                  padding: '9px 14px',
                  fontSize: '13px',
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
                onClick={() => handleSend()}
                disabled={!input.trim()}
                style={{
                  background: '#3BBFBF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: input.trim() ? 'pointer' : 'not-allowed',
                  opacity: input.trim() ? 1 : 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Send size={18} strokeWidth={2} aria-hidden />
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2
            style={{
              color: '#2D4459',
              fontSize: '14px',
              fontWeight: 700,
              marginBottom: '10px',
            }}
          >
            Campaign Patterns
          </h2>

          {[
            {
              n: '01',
              text: 'Clients with monthly strategy calls retain at 2× the rate of those with quarterly check-ins.',
            },
            {
              n: '02',
              text: 'SEO campaigns show strongest performance gains in months 4-6. Early churn often happens in month 2.',
            },
            {
              n: '03',
              text: 'Clients who receive plain-English reports engage 67% more frequently with their campaign data.',
            },
          ].map((p) => (
            <div
              key={p.n}
              style={{
                background: 'white',
                border: BORDER,
                borderLeft: '4px solid #3BBFBF',
                borderRadius: '10px',
                padding: '14px 16px',
                marginBottom: '8px',
                display: 'flex',
                gap: '12px',
              }}
            >
              <span
                style={{
                  color: '#3BBFBF',
                  fontSize: '11px',
                  fontWeight: 700,
                  minWidth: '22px',
                }}
              >
                {p.n}
              </span>
              <p
                style={{
                  color: '#2D4459',
                  fontSize: '12px',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {p.text}
              </p>
            </div>
          ))}

          <div style={{ marginTop: '20px' }}>
            <h2
              style={{
                color: '#2D4459',
                fontSize: '14px',
                fontWeight: 700,
                marginBottom: '10px',
              }}
            >
              Portfolio at a Glance
            </h2>

            <div style={statCard}>
              <div
                style={{ color: '#2D4459', fontSize: '22px', fontWeight: 700 }}
              >
                {formatCurrency(totalMrr)}
              </div>
              <div style={{ color: '#7A8F95', fontSize: '11px' }}>
                Monthly Recurring Revenue
              </div>
            </div>

            <div style={statCard}>
              <div
                style={{
                  display: 'flex',
                  height: '8px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '8px',
                  background: '#C8E8E5',
                }}
              >
                <div
                  style={{
                    width: `${pctHealthy}%`,
                    background: '#3BBFBF',
                  }}
                />
                <div
                  style={{
                    width: `${pctMid}%`,
                    background: '#C8613F',
                  }}
                />
                <div
                  style={{
                    width: `${pctCritical}%`,
                    background: '#F05F57',
                  }}
                />
              </div>
              <div style={{ color: '#7A8F95', fontSize: '11px' }}>
                {healthy} healthy · {mid} attention · {critical} critical
              </div>
            </div>

            <div style={statCard}>
              <div
                style={{ color: '#3BBFBF', fontSize: '22px', fontWeight: 700 }}
              >
                -
              </div>
              <div style={{ color: '#7A8F95', fontSize: '11px' }}>
                Hours saved this month
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
