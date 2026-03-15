import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const getPage = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('page') || 'home';
  };

  const currentPage = getPage();

  const navItems = [
    { label: 'Home', href: '/', page: 'home' },
    { label: 'Private Hub', href: '/?page=private-hub', page: 'private-hub' },
    { label: 'Services', href: '/#services', page: null },
    { label: 'Case Studies', href: '/?page=case-studies', page: 'case-studies' },
    { label: 'About', href: '/?page=about', page: 'about' },
    { label: 'Blog', href: '/?page=blog', page: 'blog' },
    { label: 'Governance', href: '/?page=governance', page: 'governance' },
    { label: 'FAQ', href: '/?page=faq', page: 'faq' },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.page === null) return false;
    return currentPage === item.page;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFCF5]/95 backdrop-blur-md border-b border-[#2C3E50]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="text-xl font-bold text-[#2C3E50]">
            Dr. Data
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item)
                    ? 'text-[#4ECDC4]'
                    : 'text-[#2C3E50] hover:text-[#4ECDC4]'
                }`}
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://calendly.com/zubiaml4l/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#E07A5F] hover:bg-[#d46a4e] text-white text-sm font-medium px-5 py-2 rounded-full transition-colors"
            >
              Book a Call
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#2C3E50]"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-[#2C3E50]/10">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium ${
                    isActive(item) ? 'text-[#4ECDC4]' : 'text-[#2C3E50]'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="https://calendly.com/zubiaml4l/15min"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#E07A5F] text-white text-sm font-medium px-5 py-2 rounded-full text-center"
              >
                Book a Call
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
