import { useEffect } from 'react';
import Navigation from '../sections/Navigation';
import { CheckCircle, Shield, FileText } from 'lucide-react';

const Governance = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const principles = [
    {
      icon: Shield,
      title: 'Data Privacy First',
      description: 'Your data never leaves your control. We design systems with privacy by default.',
    },
    {
      icon: FileText,
      title: 'Auditability',
      description: 'Every decision is traceable. Full transparency in how AI systems arrive at conclusions.',
    },
    {
      icon: CheckCircle,
      title: 'Compliance Ready',
      description: 'Built to meet GDPR, HIPAA, and industry-specific regulatory requirements.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFCF5]">
      <Navigation />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#2C3E50] mb-8">
            Governance & Responsibility
          </h1>
          
          <p className="text-lg text-[#2C3E50]/70 leading-relaxed mb-12">
            Responsible AI isn&apos;t an afterthought—it&apos;s built into everything we do. 
            From data handling to model deployment, we prioritize transparency, accountability, and trust.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {principles.map((principle, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-[#2C3E50]/10 text-center"
              >
                <div className="w-12 h-12 bg-[#4ECDC4] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <principle.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-2">{principle.title}</h3>
                <p className="text-sm text-[#2C3E50]/70">{principle.description}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-[#2C3E50] rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#4ECDC4] flex-shrink-0 mt-0.5" />
                <span>No data sharing with third-party AI providers</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#4ECDC4] flex-shrink-0 mt-0.5" />
                <span>Full documentation of model decisions and logic</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#4ECDC4] flex-shrink-0 mt-0.5" />
                <span>Regular bias audits and fairness assessments</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#4ECDC4] flex-shrink-0 mt-0.5" />
                <span>Human-in-the-loop for critical decisions</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#2C3E50]/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-[#2C3E50]/60">
            Decision Intelligence for Small Businesses
          </p>
          <p className="text-xs text-[#2C3E50]/40 mt-4">
            &copy; {new Date().getFullYear()} Dr. Data Decision Intelligence. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Governance;
