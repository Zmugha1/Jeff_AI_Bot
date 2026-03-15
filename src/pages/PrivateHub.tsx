import { useEffect } from 'react';
import Navigation from '../sections/Navigation';
import { Shield, Lock, Eye, FileCheck, Server, Database, BarChart3, CheckCircle } from 'lucide-react';

const PrivateHub = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pillars = [
    {
      icon: Server,
      number: '01',
      title: 'Zero-Cloud Residency',
      description: 'Your client interactions are your most valuable asset. In the Private Hub, the AI "brain" runs locally on a dedicated office server.',
      benefit: 'No data is sent to OpenAI, Google, or Microsoft. Your secrets stay yours.',
    },
    {
      icon: Eye,
      number: '02',
      title: '"Truth-Link" Auditability',
      description: 'Every insight on your dashboard is backed by a digital receipt. If the system flags a "High-Risk Customer," you can click a single button to see the exact timestamp and transcript line that triggered the alert.',
      benefit: 'Total confidence during audits or legal reviews. No "black box" logic.',
    },
    {
      icon: Lock,
      number: '03',
      title: 'Deterministic Governance',
      description: 'Standard AI is unpredictable. Dr. Data is prescriptive. We hard-code your specific business rules and compliance policies (GDPR, HIPAA, or internal standards) directly into the processing engine.',
      benefit: 'The AI is forced to follow your rules, redacting sensitive info automatically before it\'s even analyzed.',
    },
  ];

  const phases = [
    {
      phase: '01. Ingest',
      action: 'Connects to your Zoom, Email, and Phone systems securely.',
      result: 'One stream for all client data.',
    },
    {
      phase: '02. Structure',
      action: 'Transcribes, redacts PII, and links records to your CRM.',
      result: 'A clean, searchable Knowledge Graph.',
    },
    {
      phase: '03. Decide',
      action: 'Runs local AI to score sentiment, risk, and opportunities.',
      result: 'A live Dashboard with clear "Next Steps."',
    },
  ];

  const prescriptionPoints = [
    'One-time hardware setup.',
    'Zero per-user monthly fees.',
    '100% Audit-ready.',
  ];

  return (
    <div className="min-h-screen bg-[#FFFCF5]">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#4ECDC4]/10 text-[#4ECDC4] px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Shield className="w-4 h-4" />
            For Small Businesses (1-30 Employees)
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2C3E50] leading-tight mb-6">
            Finally: AI That Doesn&apos;t Leak Your{' '}
            <span className="text-[#4ECDC4]">Business Secrets</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-[#2C3E50]/70 max-w-2xl mx-auto mb-8">
            You&apos;ve heard the AI hype, but you&apos;ve also heard the warnings. Most AI tools &quot;borrow&quot; your data to train their systems. For a small business, that&apos;s not just a risk—it&apos;s a liability.
          </p>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#4ECDC4]/20 max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#4ECDC4] rounded-xl flex items-center justify-center flex-shrink-0">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-[#2C3E50] mb-2">
                  The Dr. Data Private Hub
                </h3>
                <p className="text-[#2C3E50]/70">
                  A decision-ready intelligence system built inside your own four walls. We connect your &quot;dark silos&quot;—Zoom calls, emails, and phone transcripts—into a single, auditable dashboard that lives on your hardware.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#4ECDC4] font-semibold tracking-wider uppercase text-sm mb-3">
              Core Features
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2C3E50]">
              The Three Pillars of Your Private Hub
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className="bg-[#FFFCF5] rounded-2xl p-8 border border-[#2C3E50]/10 hover:border-[#4ECDC4] transition-all hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-[#4ECDC4] rounded-xl flex items-center justify-center">
                    <pillar.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-5xl font-bold text-[#2C3E50]/10">
                    {pillar.number}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-[#2C3E50] mb-4">
                  {pillar.title}
                </h3>
                
                <p className="text-[#2C3E50]/70 mb-6 leading-relaxed">
                  {pillar.description}
                </p>
                
                <div className="bg-[#4ECDC4]/10 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#4ECDC4] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#2C3E50] font-medium">
                      <span className="text-[#4ECDC4]">The Benefit:</span>{' '}
                      {pillar.benefit}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#2C3E50]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#4ECDC4] font-semibold tracking-wider uppercase text-sm mb-3">
              Process
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              How It Works for You
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="bg-white/10">
                  <th className="text-left py-4 px-6 text-[#4ECDC4] font-semibold">
                    Phase
                  </th>
                  <th className="text-left py-4 px-6 text-[#4ECDC4] font-semibold">
                    What Dr. Data Does
                  </th>
                  <th className="text-left py-4 px-6 text-[#4ECDC4] font-semibold">
                    What You Get
                  </th>
                </tr>
              </thead>
              <tbody>
                {phases.map((phase, index) => (
                  <tr
                    key={index}
                    className="border-t border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-5 px-6">
                      <span className="text-[#4ECDC4] font-bold">{phase.phase}</span>
                    </td>
                    <td className="py-5 px-6 text-white/80">{phase.action}</td>
                    <td className="py-5 px-6 text-white/80">{phase.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Prescription Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FFFCF5]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#2C3E50] to-[#2C3E50]/90 rounded-3xl p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-[#4ECDC4] rounded-2xl flex items-center justify-center mx-auto mb-8">
              <FileCheck className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              The Dr. Data &quot;Prescription&quot;
            </h2>
            
            <p className="text-xl text-[#4ECDC4] font-medium mb-10">
              Stop renting &quot;best-effort&quot; AI. Own your intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
              {prescriptionPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-white/90"
                >
                  <CheckCircle className="w-5 h-5 text-[#4ECDC4]" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
            
            <a
              href="https://calendly.com/zubiaml4l/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#E07A5F] hover:bg-[#d46a4e] text-white font-semibold py-4 px-10 rounded-full text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              <BarChart3 className="w-5 h-5" />
              Get Your AI Readiness Score
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#2C3E50]/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#2C3E50]">Dr. Data</span>
            </div>
            
            <p className="text-sm text-[#2C3E50]/60 text-center">
              Decision Intelligence for Small Businesses. Private. Secure. Yours.
            </p>
            
            <a
              href="https://calendly.com/zubiaml4l/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#4ECDC4] hover:text-[#2C3E50] font-medium transition-colors"
            >
              Book a Discovery Call
            </a>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[#2C3E50]/10 text-center">
            <p className="text-xs text-[#2C3E50]/40">
              &copy; {new Date().getFullYear()} Dr. Data Decision Intelligence. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivateHub;
