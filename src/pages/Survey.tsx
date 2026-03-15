import { useEffect, useState } from 'react';
import Navigation from '../sections/Navigation';

const Survey = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [employees, setEmployees] = useState('');

  return (
    <div className="min-h-screen bg-[#FFFCF5]">
      <Navigation />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#2C3E50] mb-4">
              Data Readiness Assessment
            </h1>
            <p className="text-lg text-[#2C3E50]/70">
              Discover your AI readiness score and get personalized recommendations.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#2C3E50]/10">
            <form 
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you! Your assessment link will be sent to your email.');
              }}
            >
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#2C3E50]/20 focus:outline-none focus:border-[#4ECDC4]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#2C3E50]/20 focus:outline-none focus:border-[#4ECDC4]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-2">
                  Number of employees
                </label>
                <select
                  value={employees}
                  onChange={(e) => setEmployees(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#2C3E50]/20 focus:outline-none focus:border-[#4ECDC4]"
                >
                  <option value="">Select...</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="501-1000">501-1000</option>
                  <option value="1000+">1000+</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#4ECDC4] hover:bg-[#3dbdb5] text-white font-semibold py-4 rounded-lg transition-colors"
              >
                Start Assessment
              </button>
            </form>

            <p className="text-center text-sm text-[#2C3E50]/50 mt-6">
              No spam. Unsubscribe anytime. Your email is safe with Dr. Data.
            </p>
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

export default Survey;
