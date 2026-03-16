import { useState } from 'react';
import { ArrowLeft, Copy, Check, Share2, Mail, Phone, Globe } from 'lucide-react';
import Navigation from '../sections/Navigation';

function BNIReferral() {
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const contactInfo = {
    name: "Zubi",
    title: "Data & AI Consultant",
    company: "Dr. Data Decision Intelligence",
    email: "zubiamL4L@gmail.com",
    website: "drdatadecisionintelligence.com",
    idealReferrals: [
      "Small business owners struggling with data chaos",
      "Companies wanting to implement AI solutions",
      "Organizations needing data governance frameworks",
      "Businesses looking to automate reporting",
      "Teams wanting data-driven decision making"
    ]
  };

  const handleCopy = () => {
    const text = `${contactInfo.name} - ${contactInfo.title}\n${contactInfo.company}\nEmail: ${contactInfo.email}\nWebsite: ${contactInfo.website}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${contactInfo.name} - ${contactInfo.company}`,
          text: `${contactInfo.title} - Helping businesses make $$ with their data`,
          url: `https://${contactInfo.website}?page=bni-referral`
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopy();
    }
  };

  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-[#FFFCF5]">
      <Navigation />
      
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigateTo('/?page=home')}
            className="flex items-center gap-2 text-[#2C3E50] hover:text-[#4ECDC4] transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-4">
              BNI Referral Card
            </h1>
            <p className="text-lg text-gray-600">
              Tap the card to flip • Share with your network
            </p>
          </div>

          {/* Flip Card */}
          <div 
            className="relative w-full max-w-md mx-auto cursor-pointer"
            style={{ perspective: '1000px' }}
            onClick={() => setFlipped(!flipped)}
          >
            <div 
              className="relative w-full transition-transform duration-700"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* Front of Card */}
              <div 
                className="w-full bg-gradient-to-br from-[#2C3E50] to-[#1a252f] rounded-2xl p-8 shadow-2xl"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="text-center">
                  {/* Mascot */}
                  <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-20 h-20">
                      <circle cx="50" cy="50" r="45" fill="#4ECDC4"/>
                      <circle cx="35" cy="40" r="8" fill="white"/>
                      <circle cx="65" cy="40" r="8" fill="white"/>
                      <circle cx="35" cy="40" r="4" fill="#2C3E50"/>
                      <circle cx="65" cy="40" r="4" fill="#2C3E50"/>
                      <path d="M 30 60 Q 50 75 70 60" stroke="white" strokeWidth="3" fill="none"/>
                      <rect x="20" y="25" width="15" height="8" fill="#E07A5F" rx="2"/>
                      <rect x="65" y="25" width="15" height="8" fill="#E07A5F" rx="2"/>
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2">
                    {contactInfo.name}
                  </h2>
                  <p className="text-[#4ECDC4] font-medium mb-4">
                    {contactInfo.title}
                  </p>
                  <div className="w-16 h-1 bg-[#E07A5F] mx-auto mb-4"></div>
                  <p className="text-white text-lg font-semibold">
                    {contactInfo.company}
                  </p>
                  <p className="text-gray-300 mt-4 text-sm">
                    Tap to see ideal referrals
                  </p>
                </div>
              </div>

              {/* Back of Card */}
              <div 
                className="w-full bg-gradient-to-br from-[#FFFCF5] to-[#f5f0e8] rounded-2xl p-8 shadow-2xl absolute top-0 left-0"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <h3 className="text-xl font-bold text-[#2C3E50] mb-4 text-center">
                  My Ideal Referrals
                </h3>
                <ul className="space-y-3 mb-6">
                  {contactInfo.idealReferrals.map((referral, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-[#E07A5F] font-bold mt-0.5">→</span>
                      <span>{referral}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-300 pt-4">
                  <p className="text-center text-[#4ECDC4] font-semibold">
                    I help businesses make $$ with their data!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="flex items-center gap-2 px-6 py-3 bg-[#2C3E50] text-white rounded-lg hover:bg-[#1a252f] transition-colors"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? 'Copied!' : 'Copy Info'}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="flex items-center gap-2 px-6 py-3 bg-[#4ECDC4] text-white rounded-lg hover:bg-[#3dbdb5] transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>

          {/* Contact Links */}
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            <a 
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-2 text-[#2C3E50] hover:text-[#4ECDC4] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </a>
            <a 
              href={`https://${contactInfo.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#2C3E50] hover:text-[#4ECDC4] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Globe className="w-5 h-5" />
              <span>Website</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BNIReferral;
