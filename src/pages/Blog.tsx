import { useEffect } from 'react';
import Navigation from '../sections/Navigation';

const Blog = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const posts = [
    {
      title: 'Why Most AI Initiatives Fail (And How to Fix It)',
      date: 'January 15, 2026',
      excerpt: 'The data exists, but it hasn\'t been translated into machine-interpretable meaning. Here\'s what successful organizations do differently.',
    },
    {
      title: 'From Dashboards to Decisions: The Trust Gap',
      date: 'January 8, 2026',
      excerpt: 'Dashboards everywhere. Trust nowhere. Why teams still rely on intuition despite having data at their fingertips.',
    },
    {
      title: 'Decision Intelligence: A Practical Introduction',
      date: 'December 20, 2025',
      excerpt: 'What is decision intelligence, and why should your organization care? A no-jargon guide for business leaders.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFCF5]">
      <Navigation />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#2C3E50] mb-8">
            Blog
          </h1>
          
          <p className="text-lg text-[#2C3E50]/70 leading-relaxed mb-12">
            Insights on decision intelligence, data strategy, and building AI systems that actually work.
          </p>
          
          <div className="space-y-8">
            {posts.map((post, index) => (
              <article
                key={index}
                className="bg-white rounded-2xl p-8 border border-[#2C3E50]/10 hover:border-[#4ECDC4] transition-colors cursor-pointer"
              >
                <p className="text-sm text-[#2C3E50]/50 mb-2">{post.date}</p>
                <h3 className="text-xl font-bold text-[#2C3E50] mb-3">{post.title}</h3>
                <p className="text-[#2C3E50]/70">{post.excerpt}</p>
              </article>
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

export default Blog;
