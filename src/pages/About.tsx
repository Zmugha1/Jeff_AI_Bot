import { useEffect } from 'react';
import Navigation from '../sections/Navigation';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFCF5]">
      <Navigation />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#2C3E50] mb-8">
            About Dr. Data
          </h1>
          
          <p className="text-lg text-[#2C3E50]/70 leading-relaxed mb-6">
            Dr. Data Decision Intelligence was founded by Dr. Zubia Mughal, an enterprise AI and data 
            research leader specializing in reliable machine learning, decision intelligence, and 
            organizational adoption.
          </p>
          
          <p className="text-lg text-[#2C3E50]/70 leading-relaxed mb-6">
            With years of experience in applied research and advisory for decision-ready AI systems, 
            Dr. Mughal helps organizations bridge the gap between data collection and actionable insights.
          </p>
          
          <p className="text-lg text-[#2C3E50]/70 leading-relaxed">
            Our mission is simple: transform scattered data into confident decisions. No drama. 
            Just data that works.
          </p>
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

export default About;
