import { useEffect, useState } from 'react';
import Navigation from '../sections/Navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What is Decision Intelligence?',
      answer: 'Decision Intelligence is the discipline of turning data into better decisions at scale. It combines data science, behavioral science, and management science to help organizations make consistently better choices—faster and with more confidence.',
    },
    {
      question: 'How long does a typical engagement take?',
      answer: 'Engagements vary based on scope. A Data Strategy & AI Readiness Assessment typically takes 4-6 weeks, while a full Predictive Decision Intelligence implementation can take 10-14 weeks. We\'ll provide a clear timeline during our discovery call.',
    },
    {
      question: 'Do you work with small businesses?',
      answer: 'Absolutely! We work with organizations of all sizes, from 5-person teams to enterprise companies. Our approach scales to meet you where you are.',
    },
    {
      question: 'What industries do you specialize in?',
      answer: 'We have deep experience in professional services, healthcare, manufacturing, and technology. Our decision intelligence frameworks are adaptable to any industry with data-driven decision-making needs.',
    },
    {
      question: 'How do you ensure data privacy?',
      answer: 'Data privacy is built into everything we do. We never share your data with third-party AI providers, and we design systems with privacy by default. All work is governed by strict confidentiality agreements.',
    },
    {
      question: 'What makes Dr. Data different from other AI consultants?',
      answer: 'We focus on decision-ready systems, not just models. Our approach bridges the gap between technical AI capabilities and real business outcomes. Plus, Dr. Mughal brings both academic rigor and practical enterprise experience.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFCF5]">
      <Navigation />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#2C3E50] mb-8">
            Frequently Asked Questions
          </h1>
          
          <p className="text-lg text-[#2C3E50]/70 leading-relaxed mb-12">
            Got questions? We&apos;ve got answers. If you don&apos;t see what you&apos;re looking for, 
            feel free to reach out.
          </p>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-[#2C3E50]/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-semibold text-[#2C3E50]">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-[#4ECDC4] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#4ECDC4] flex-shrink-0" />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-[#2C3E50]/70">{faq.answer}</p>
                  </div>
                )}
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

export default FAQ;
