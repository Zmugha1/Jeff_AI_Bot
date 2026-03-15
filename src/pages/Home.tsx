import { useEffect, useState } from 'react';
import Navigation from '../sections/Navigation';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [showDecisionIntel, setShowDecisionIntel] = useState(false);
  const [expandedService, setExpandedService] = useState<number | null>(0);
  const [email, setEmail] = useState('');

  const howItWorks = [
    { number: '01', title: 'DISCOVER', description: 'Map your data universe' },
    { number: '02', title: 'CONNECT', description: 'Build your knowledge graph' },
    { number: '03', title: 'DECIDE', description: 'Act with confidence' },
  ];

  const services = [
    {
      title: 'Data Strategy & AI Readiness Assessment',
      subtitle: 'The foundation everything else builds on',
      for: 'Organizations with data but no clear path to AI',
      problem: 'Most AI initiatives fail before modeling even begins. The data exists, but it hasn\'t been translated into machine-interpretable meaning.',
      duration: '4–6 weeks',
      cta: 'Start Here',
    },
    {
      title: 'Decision-Ready Data Foundations',
      subtitle: 'From dashboards to decisions',
      for: 'Organizations with reports but no shared truth',
      problem: 'Dashboards everywhere. Trust nowhere. Teams use conflicting metrics. Decisions still run on intuition.',
      duration: '6–8 weeks',
      cta: 'Build Your Foundation',
    },
    {
      title: 'Reliable ML Lifecycle Design',
      subtitle: 'From experiments to operational systems',
      for: 'Organizations running pilots that never ship',
      problem: 'Notebooks pile up. Results vary by analyst. Nothing reaches production because nobody knows when a model is "ready."',
      duration: '8–12 weeks',
      cta: 'Operationalize Your ML',
    },
    {
      title: 'Predictive Decision Intelligence',
      subtitle: 'Early signals. Clear actions. Measurable ROI.',
      for: 'Organizations tired of reacting too late',
      problem: 'Churn identified after the customer leaves. Forecasts disconnected from action. Risk scores nobody trusts.',
      duration: '10–14 weeks',
      cta: 'Predict & Act',
    },
    {
      title: 'Reliable AI Systems & Agent Design',
      subtitle: 'AI that stays controllable as it scales',
      for: 'Organizations exploring LLMs, agents, and advanced AI',
      problem: 'Agent behavior inconsistent. Hallucinations and drift. No audit trails. No accountability.',
      duration: 'Ongoing advisory available',
      cta: 'Design Responsible AI',
    },
    {
      title: 'Survey Design & Customer Research',
      subtitle: 'Ask the right questions. Get actionable answers.',
      for: 'Organizations that need to understand why customers choose them',
      problem: 'You have behavioral data, but you haven\'t actually asked your customers what they think.',
      duration: '4–6 weeks',
      cta: 'Ask Your Customers',
    },
    {
      title: 'Data-Driven Customer Personas',
      subtitle: 'Identify key personas from your behavioral data',
      for: 'Organizations that want to truly understand their users',
      problem: 'Almost every company has a wealth of data about customers, yet rarely uses it to validate personas.',
      duration: '6–8 weeks',
      cta: 'Know Your Users',
    },
  ];

  const journeyItems = [
    { text: 'Just starting', subtext: 'Have data, need trust' },
    { text: 'Running pilots', subtext: 'Need predictions' },
    { text: 'Exploring LLMs/agents', subtext: 'Need customer insights' },
    { text: 'Want to understand users', subtext: 'Not sure where to start?' },
    { text: 'If you have data but don\'t know what\'s usable', subtext: 'Start with Data Strategy & AI Readiness' },
    { text: 'If you have dashboards but no one trusts them', subtext: 'Start with Decision-Ready Data Foundations' },
    { text: 'If your pilots never reach production', subtext: 'Start with Reliable ML Lifecycle' },
    { text: 'If you\'re always reacting too late', subtext: 'Start with Predictive Decision Intelligence' },
    { text: 'If you\'re exploring LLMs but worried about control', subtext: 'Start with Reliable AI Systems' },
  ];

  return (
    <div className="min-h-screen bg-[#FFFCF5]">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Mascot */}
          <div className="mb-8">
            <img 
              src="/mascot-hero.png" 
              alt="Dr. Data Mascot" 
              className="w-48 h-48 sm:w-56 sm:h-56 mx-auto object-contain"
            />
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C3E50] leading-tight mb-4">
            <span className="text-[#4ECDC4]">&ldquo;</span>OUR DATA IS PERFECTLY ORGANIZED
            <br />
            AND WE USE ALL OF IT!<span className="text-[#4ECDC4]">&rdquo;</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-[#E07A5F] font-medium italic mb-8">
            Said no business leader, ever
          </p>
          
          <p className="text-base sm:text-lg text-[#2C3E50]/70 max-w-2xl mx-auto mb-10">
            Stop searching for answers in scattered spreadsheets. Start making confident
            decisions. Dr. Data organizes your information into clear, actionable insights
            you can trust.
          </p>
        </div>
      </section>

      {/* Make $$$ Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#4ECDC4] mb-8">
            Make $$ With Your Data Faster
          </h2>
          
          <a
            href="https://calendly.com/zubiaml4l/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#E07A5F] hover:bg-[#d46a4e] text-white font-semibold py-4 px-10 rounded-full text-lg transition-colors shadow-lg"
          >
            BOOK A DISCOVERY CALL
          </a>
        </div>
      </section>

      {/* Who's Behind This */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#2C3E50]/10 text-center">
            <p className="text-xs text-[#2C3E50]/50 uppercase tracking-wider mb-4">
              Who&apos;s behind this
            </p>
            <p className="text-[#2C3E50]/70 leading-relaxed mb-6">
              Built by an enterprise AI and data research leader specializing in reliable machine learning, 
              decision intelligence, and organizational adoption. Providing applied research and advisory 
              for decision-ready AI systems.
            </p>
            <a
              href="/?page=about"
              className="inline-flex items-center gap-2 text-[#4ECDC4] font-medium hover:text-[#2C3E50] transition-colors"
            >
              Meet Dr. Zubia Mughal
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* What's Decision Intelligence - Expandable */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <button
            onClick={() => setShowDecisionIntel(!showDecisionIntel)}
            className="inline-flex items-center gap-2 bg-white border-2 border-[#2C3E50] text-[#2C3E50] font-semibold px-8 py-3 rounded-xl hover:bg-[#2C3E50] hover:text-white transition-colors"
          >
            What&apos;s Decision Intelligence?
          </button>
          
          {showDecisionIntel && (
            <div className="mt-6 p-6 bg-white rounded-xl border border-[#4ECDC4]/20 text-left max-w-2xl mx-auto">
              <p className="text-[#2C3E50]/70 leading-relaxed">
                Decision Intelligence is the discipline of turning data into better decisions at scale. 
                It combines data science, behavioral science, and management science to help organizations 
                make consistently better choices—faster and with more confidence.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Data That Makes Sense */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-[#2C3E50] mb-2">
            FOCUS ON HIGH-VALUE DECISIONS.
          </h2>
          <h3 className="text-lg sm:text-xl font-bold text-[#2C3E50] mb-8">
            LET DR. DATA HANDLE THE DISCOVERY.
          </h3>
          
          <h4 className="text-xl sm:text-2xl font-semibold text-[#4ECDC4] mb-8">
            Data that actually makes sense
          </h4>
          
          <div className="space-y-2 text-[#2C3E50]/70">
            <p>Your data doesn&apos;t talk to itself</p>
            <p>Put insight workflows on autopilot</p>
            <p>Yes, even the messy qualitative stuff!</p>
            <p>Extract and structure signals automatically</p>
            <p>Better forecasting, fewer surprises</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50] text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-[#4ECDC4]/20 mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-2">{step.title}</h3>
                <p className="text-[#2C3E50]/70">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Readiness Assessment Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#2C3E50]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Ready to take a
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-[#4ECDC4] mb-2">15 minute</p>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
            Data Readiness Assessment?
          </h3>
          
          <p className="text-white/70 mb-8">
            Discover your AI readiness score and get personalized recommendations.
          </p>
          
          <form 
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you! We will send you the assessment link.');
            }}
          >
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#4ECDC4]"
              required
            />
            
            <button
              type="submit"
              className="w-full bg-[#4ECDC4] hover:bg-[#3dbdb5] text-white font-semibold py-4 rounded-lg transition-colors"
            >
              Send Me the Link
            </button>
          </form>
          
          <p className="text-white/50 text-sm mt-4">
            No spam. Unsubscribe anytime. Your email is safe with Dr. Data.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50] mb-4">
              Services
            </h2>
            <p className="text-base text-[#2C3E50]/70 max-w-2xl mx-auto">
              From organizing your data to building reliable AI systems, comprehensive services 
              tailored to where you are on your journey.
            </p>
          </div>

          {/* Journey Items */}
          <div className="mb-12">
            <h3 className="text-xl sm:text-2xl font-bold text-[#4ECDC4] mb-2 text-center">Make $$ With Your Data Faster</h3>
            <p className="text-base text-[#2C3E50]/70 mb-6 text-center">Where are you on your journey?</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {journeyItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-[#2C3E50]">
                  <ArrowRight className="w-4 h-4 text-[#4ECDC4] flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium">{item.text}</span>
                    {item.subtext && <span className="text-xs text-[#2C3E50]/60 block">{item.subtext}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mb-12">
            <a
              href="https://calendly.com/zubiaml4l/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#E07A5F] hover:bg-[#d46a4e] text-white font-semibold py-4 px-10 rounded-full transition-colors"
            >
              Book a discovery call
            </a>
            <p className="text-[#2C3E50]/60 mt-4 text-sm">
              We&apos;ll map your current state and recommend the right starting point.
            </p>
          </div>

          {/* Service Cards */}
          <div className="space-y-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#2C3E50]/10 overflow-hidden shadow-sm"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-[#2C3E50] mb-1">{service.title}</h3>
                      <p className="text-[#4ECDC4] font-medium mb-4 text-sm">{service.subtitle}</p>
                      <p className="text-sm text-[#2C3E50]/60 mb-2"><span className="font-semibold">For:</span> {service.for}</p>
                      <p className="text-sm text-[#2C3E50]/60 mb-4">{service.problem}</p>
                      <p className="text-sm text-[#E07A5F] mb-4">{service.duration}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {index === 0 && (
                        <button
                          onClick={() => setExpandedService(expandedService === index ? null : index)}
                          className="text-[#4ECDC4] font-medium hover:text-[#2C3E50] transition-colors text-sm"
                        >
                          {expandedService === index ? 'Show less' : 'Learn more'}
                        </button>
                      )}
                      {index !== 0 && (
                        <span className="text-[#4ECDC4] font-medium text-sm">Learn more</span>
                      )}
                      <a
                        href="https://calendly.com/zubiaml4l/15min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#4ECDC4] font-medium hover:text-[#2C3E50] transition-colors text-sm"
                      >
                        {service.cta}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Second Assessment Form */}
          <div className="mt-16 py-12 px-8 bg-[#2C3E50] rounded-2xl text-center">
            <h3 className="text-xl font-bold text-white mb-2">Ready to take a</h3>
            <p className="text-2xl sm:text-3xl font-bold text-[#4ECDC4] mb-2">15 minute</p>
            <h4 className="text-lg font-bold text-white mb-6">Data Readiness Assessment?</h4>
            <p className="text-white/70 mb-6 text-sm">Discover your AI readiness score and get personalized recommendations.</p>
            <form 
              className="max-w-md mx-auto space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you! We will send you the assessment link.');
              }}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#4ECDC4]"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#4ECDC4] hover:bg-[#3dbdb5] text-white font-semibold py-4 rounded-lg transition-colors"
              >
                Send Me the Link
              </button>
            </form>
            <p className="text-white/50 text-sm mt-4">
              No spam. Unsubscribe anytime. Your email is safe with Dr. Data.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl sm:text-6xl font-bold text-[#4ECDC4] mb-2">
            15,333<span className="text-[#2C3E50]">+</span>
          </div>
          <p className="text-base text-[#2C3E50]/70">Labor hours saved</p>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-lg sm:text-xl text-[#2C3E50] italic leading-relaxed mb-6">
            &ldquo;Dr. Data helped us see patterns in our client communications we&apos;d been missing for years. 
            Our churn prediction accuracy improved 40%, and finally we understand WHY clients leave, 
            not just who.&rdquo;
          </blockquote>
          <p className="text-[#2C3E50]/60 text-sm">
            — Professional Services Firm, Milwaukee
          </p>
        </div>
      </section>

      {/* No Drama Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#2C3E50]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            No drama. Just data that <span className="text-[#4ECDC4]">works</span>.
          </h2>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {['Easy Setup', 'Onboard Faster', 'Any Industry', 'Total Security'].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-white">
                <CheckCircle className="w-5 h-5 text-[#4ECDC4]" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
          
          <h3 className="text-lg text-white/70 mb-4">
            Still not sure if Dr. Data is right for you?
          </h3>
          
          <h4 className="text-xl sm:text-2xl font-bold text-white mb-8">
            Make $$ With Your Data
          </h4>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm">
              Ask ChatGPT
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm">
              Ask Claude
            </button>
            <a
              href="https://calendly.com/zubiaml4l/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#E07A5F] hover:bg-[#d46a4e] text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm"
            >
              Book a Discovery Call
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-[#FFFCF5] border-t border-[#2C3E50]/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold text-[#2C3E50] mb-4">Dr. Data</h4>
              <p className="text-sm text-[#2C3E50]/60">Decision Intelligence</p>
            </div>
            
            <div>
              <h4 className="font-bold text-[#2C3E50] mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="/#services" className="text-sm text-[#2C3E50]/60 hover:text-[#4ECDC4]">Services</a></li>
                <li><a href="/#services" className="text-sm text-[#2C3E50]/60 hover:text-[#4ECDC4]">Pricing</a></li>
                <li><a href="/?page=case-studies" className="text-sm text-[#2C3E50]/60 hover:text-[#4ECDC4]">Case Studies</a></li>
                <li><a href="/?page=survey" className="text-sm text-[#2C3E50]/60 hover:text-[#4ECDC4]">Data Assessment</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-[#2C3E50] mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="/?page=about" className="text-sm text-[#2C3E50]/60 hover:text-[#4ECDC4]">About</a></li>
                <li><a href="/?page=blog" className="text-sm text-[#2C3E50]/60 hover:text-[#4ECDC4]">Blog</a></li>
                <li><a href="/?page=faq" className="text-sm text-[#2C3E50]/60 hover:text-[#4ECDC4]">FAQ</a></li>
                <li><a href="/#cta" className="text-sm text-[#2C3E50]/60 hover:text-[#4ECDC4]">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#2C3E50] mb-4">Governance</h4>
              <ul className="space-y-2">
                <li><a href="/?page=governance" className="text-sm text-[#2C3E50]/60 hover:text-[#4ECDC4]">Governance & Responsibility</a></li>
                <li><a href="/?page=governance#checklist" className="text-sm text-[#2C3E50]/60 hover:text-[#4ECDC4]">Deployment Checklist</a></li>
                <li><a href="/?page=governance#standards" className="text-sm text-[#2C3E50]/60 hover:text-[#4ECDC4]">Standards Alignment</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-[#2C3E50]/60 hover:text-[#4ECDC4]">LinkedIn</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-sm text-[#2C3E50]/60 hover:text-[#4ECDC4]">Twitter</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-[#2C3E50]/60 hover:text-[#4ECDC4]">GitHub</a>
          </div>
          
          <div className="text-center pt-8 border-t border-[#2C3E50]/10">
            <div className="flex justify-center gap-6 mb-4">
              <a href="/privacy-policy" className="text-sm text-[#2C3E50]/60 hover:text-[#4ECDC4]">Privacy Policy</a>
              <a href="/terms-of-service" className="text-sm text-[#2C3E50]/60 hover:text-[#4ECDC4]">Terms of Service</a>
            </div>
            <p className="text-sm text-[#2C3E50]/40">
              Made with curiosity in Milwaukee, WI 🧀
            </p>
            <p className="text-xs text-[#2C3E50]/40 mt-4">
              &copy; {new Date().getFullYear()} Dr. Data Decision Intelligence. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
