import { useEffect } from 'react';
import Navigation from '../sections/Navigation';

const CaseStudies = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const caseStudies = [
    {
      title: 'Professional Services Firm',
      location: 'Milwaukee',
      result: '40% improvement in churn prediction accuracy',
      quote: 'Dr. Data helped us see patterns in our client communications we\'d been missing for years. Finally we understand WHY clients leave, not just who.',
    },
    {
      title: 'Manufacturing Company',
      location: 'Chicago',
      result: 'Reduced forecasting errors by 35%',
      quote: 'The predictive models Dr. Data built transformed how we plan inventory. We went from reactive to proactive.',
    },
    {
      title: 'Healthcare Provider',
      location: 'Madison',
      result: 'Identified $2M in operational savings',
      quote: 'Dr. Data\'s decision intelligence framework helped us spot inefficiencies we didn\'t know existed.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFCF5]">
      <Navigation />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#2C3E50] mb-8">
            Case Studies
          </h1>
          
          <p className="text-lg text-[#2C3E50]/70 leading-relaxed mb-12">
            Real results from real organizations. See how Dr. Data has helped businesses 
            transform their data into confident decisions.
          </p>
          
          <div className="space-y-8">
            {caseStudies.map((study, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-[#2C3E50]/10"
              >
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-bold text-[#2C3E50]">{study.title}</h3>
                  <span className="text-[#2C3E50]/50">• {study.location}</span>
                </div>
                <p className="text-[#4ECDC4] font-semibold mb-4">{study.result}</p>
                <blockquote className="text-[#2C3E50]/70 italic">
                  &ldquo;{study.quote}&rdquo;
                </blockquote>
              </div>
            ))}
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

export default CaseStudies;
