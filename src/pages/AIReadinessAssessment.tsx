import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronRight, Sparkles, BarChart3, Users, Database, Shield, Zap } from 'lucide-react';
import Navigation from '../sections/Navigation';

interface QuestionOption {
  value: number;
  label: string;
}

interface Question {
  id: number;
  phase: string;
  category: string;
  question: string;
  options: QuestionOption[];
}

interface Phase {
  name: string;
  icon: React.ReactNode;
  description: string;
}

const phases: Phase[] = [
  { name: "Strategy", icon: <Sparkles className="w-5 h-5" />, description: "AI vision and strategic alignment" },
  { name: "Data", icon: <Database className="w-5 h-5" />, description: "Data infrastructure and quality" },
  { name: "Technology", icon: <Zap className="w-5 h-5" />, description: "Tech stack and integration readiness" },
  { name: "People", icon: <Users className="w-5 h-5" />, description: "Team skills and change readiness" },
  { name: "Governance", icon: <Shield className="w-5 h-5" />, description: "AI ethics, compliance, and risk" }
];

const questions: Question[] = [
  // Strategy Phase
  { id: 1, phase: "Strategy", category: "Vision", question: "Has your organization defined a clear AI strategy or roadmap?", options: [{value: 1, label: "No strategy"}, {value: 2, label: "Informal discussions"}, {value: 3, label: "Draft strategy exists"}, {value: 4, label: "Approved strategy"}, {value: 5, label: "Fully implemented roadmap"}] },
  { id: 2, phase: "Strategy", category: "Goals", question: "Are AI initiatives aligned with overall business objectives?", options: [{value: 1, label: "Not aligned"}, {value: 2, label: "Partially aligned"}, {value: 3, label: "Mostly aligned"}, {value: 4, label: "Fully aligned"}, {value: 5, label: "AI drives strategy"}] },
  { id: 3, phase: "Strategy", category: "Leadership", question: "Does leadership actively support and sponsor AI initiatives?", options: [{value: 1, label: "No support"}, {value: 2, label: "Passive interest"}, {value: 3, label: "Verbal support"}, {value: 4, label: "Active sponsorship"}, {value: 5, label: "Executive champion"}] },
  { id: 4, phase: "Strategy", category: "Investment", question: "Is there a dedicated budget for AI/ML projects?", options: [{value: 1, label: "No budget"}, {value: 2, label: "Ad-hoc funding"}, {value: 3, label: "Project-based budget"}, {value: 4, label: "Annual AI budget"}, {value: 5, label: "Multi-year investment"}] },
  { id: 5, phase: "Strategy", category: "Metrics", question: "Do you have KPIs to measure AI project success?", options: [{value: 1, label: "No metrics"}, {value: 2, label: "Basic tracking"}, {value: 3, label: "Some KPIs defined"}, {value: 4, label: "Comprehensive KPIs"}, {value: 5, label: "ROI tracking system"}] },
  { id: 6, phase: "Strategy", category: "Use Cases", question: "Have you identified and prioritized specific AI use cases?", options: [{value: 1, label: "No use cases"}, {value: 2, label: "Ideas only"}, {value: 3, label: "Prioritized list"}, {value: 4, label: "Validated use cases"}, {value: 5, label: "Implementation ongoing"}] },
  
  // Data Phase
  { id: 7, phase: "Data", category: "Availability", question: "Is your data accessible and well-documented?", options: [{value: 1, label: "Data silos"}, {value: 2, label: "Limited access"}, {value: 3, label: "Partially documented"}, {value: 4, label: "Well-documented"}, {value: 5, label: "Data catalog exists"}] },
  { id: 8, phase: "Data", category: "Quality", question: "How would you rate your data quality and cleanliness?", options: [{value: 1, label: "Poor quality"}, {value: 2, label: "Inconsistent"}, {value: 3, label: "Acceptable"}, {value: 4, label: "Good quality"}, {value: 5, label: "Excellent quality"}] },
  { id: 9, phase: "Data", category: "Integration", question: "Can data be easily integrated from multiple sources?", options: [{value: 1, label: "Cannot integrate"}, {value: 2, label: "Manual processes"}, {value: 3, label: "Some automation"}, {value: 4, label: "Mostly automated"}, {value: 5, label: "Fully integrated"}] },
  { id: 10, phase: "Data", category: "Volume", question: "Do you have sufficient data volume for AI model training?", options: [{value: 1, label: "Insufficient"}, {value: 2, label: "Limited"}, {value: 3, label: "Adequate"}, {value: 4, label: "Good volume"}, {value: 5, label: "Abundant data"}] },
  { id: 11, phase: "Data", category: "Governance", question: "Is there a data governance framework in place?", options: [{value: 1, label: "No framework"}, {value: 2, label: "Informal policies"}, {value: 3, label: "Basic policies"}, {value: 4, label: "Documented framework"}, {value: 5, label: "Enforced governance"}] },
  { id: 12, phase: "Data", category: "Privacy", question: "Are data privacy and security measures adequate?", options: [{value: 1, label: "Inadequate"}, {value: 2, label: "Basic measures"}, {value: 3, label: "Standard compliance"}, {value: 4, label: "Strong security"}, {value: 5, label: "Enterprise-grade"}] },
  
  // Technology Phase
  { id: 13, phase: "Technology", category: "Infrastructure", question: "Is your IT infrastructure ready for AI workloads?", options: [{value: 1, label: "Not ready"}, {value: 2, label: "Significant gaps"}, {value: 3, label: "Partially ready"}, {value: 4, label: "Mostly ready"}, {value: 5, label: "AI-optimized"}] },
  { id: 14, phase: "Technology", category: "Cloud", question: "Are you leveraging cloud services for scalability?", options: [{value: 1, label: "On-premise only"}, {value: 2, label: "Limited cloud"}, {value: 3, label: "Hybrid approach"}, {value: 4, label: "Cloud-first"}, {value: 5, label: "Cloud-native"}] },
  { id: 15, phase: "Technology", category: "Tools", question: "Do you have the necessary AI/ML tools and platforms?", options: [{value: 1, label: "No tools"}, {value: 2, label: "Basic tools"}, {value: 3, label: "Some platforms"}, {value: 4, label: "Good toolchain"}, {value: 5, label: "Enterprise MLOps"}] },
  { id: 16, phase: "Technology", category: "Integration", question: "Can AI solutions integrate with existing systems?", options: [{value: 1, label: "Cannot integrate"}, {value: 2, label: "Difficult"}, {value: 3, label: "Possible with effort"}, {value: 4, label: "APIs available"}, {value: 5, label: "Seamless integration"}] },
  { id: 17, phase: "Technology", category: "Scalability", question: "Can your systems scale to handle AI processing demands?", options: [{value: 1, label: "Cannot scale"}, {value: 2, label: "Limited scaling"}, {value: 3, label: "Manual scaling"}, {value: 4, label: "Auto-scaling"}, {value: 5, label: "Elastic infrastructure"}] },
  { id: 18, phase: "Technology", category: "Monitoring", question: "Do you have monitoring for AI model performance?", options: [{value: 1, label: "No monitoring"}, {value: 2, label: "Basic logs"}, {value: 3, label: "Some tracking"}, {value: 4, label: "Dedicated monitoring"}, {value: 5, label: "Full observability"}] },
  
  // People Phase
  { id: 19, phase: "People", category: "Skills", question: "Does your team have AI/ML expertise?", options: [{value: 1, label: "No expertise"}, {value: 2, label: "Basic awareness"}, {value: 3, label: "Some experience"}, {value: 4, label: "Strong skills"}, {value: 5, label: "Expert team"}] },
  { id: 20, phase: "People", category: "Training", question: "Is there a plan for AI skills development?", options: [{value: 1, label: "No plan"}, {value: 2, label: "Ad-hoc learning"}, {value: 3, label: "Some training"}, {value: 4, label: "Structured program"}, {value: 5, label: "Continuous learning"}] },
  { id: 21, phase: "People", category: "Hiring", question: "Can you attract and retain AI talent?", options: [{value: 1, label: "Very difficult"}, {value: 2, label: "Challenging"}, {value: 3, label: "Possible"}, {value: 4, label: "Competitive"}, {value: 5, label: "Strong employer brand"}] },
  { id: 22, phase: "People", category: "Culture", question: "Is your culture ready for AI-driven change?", options: [{value: 1, label: "Resistant"}, {value: 2, label: "Skeptical"}, {value: 3, label: "Neutral"}, {value: 4, label: "Open to change"}, {value: 5, label: "Innovation-driven"}] },
  { id: 23, phase: "People", category: "Change Management", question: "Do you have change management processes for AI adoption?", options: [{value: 1, label: "No process"}, {value: 2, label: "Informal"}, {value: 3, label: "Basic process"}, {value: 4, label: "Structured approach"}, {value: 5, label: "Proven methodology"}] },
  { id: 24, phase: "People", category: "Collaboration", question: "Do business and technical teams collaborate effectively?", options: [{value: 1, label: "Silos exist"}, {value: 2, label: "Limited collaboration"}, {value: 3, label: "Some teamwork"}, {value: 4, label: "Good collaboration"}, {value: 5, label: "Fully integrated"}] },
  
  // Governance Phase
  { id: 25, phase: "Governance", category: "Ethics", question: "Do you have an AI ethics framework?", options: [{value: 1, label: "No framework"}, {value: 2, label: "Awareness only"}, {value: 3, label: "Basic principles"}, {value: 4, label: "Documented framework"}, {value: 5, label: "Enforced ethics"}] },
  { id: 26, phase: "Governance", category: "Compliance", question: "Are you prepared for AI-related regulatory requirements?", options: [{value: 1, label: "Unprepared"}, {value: 2, label: "Limited awareness"}, {value: 3, label: "Some preparation"}, {value: 4, label: "Mostly compliant"}, {value: 5, label: "Fully compliant"}] },
  { id: 27, phase: "Governance", category: "Risk", question: "Do you assess and manage AI-related risks?", options: [{value: 1, label: "No assessment"}, {value: 2, label: "Ad-hoc reviews"}, {value: 3, label: "Basic risk management"}, {value: 4, label: "Structured process"}, {value: 5, label: "Comprehensive framework"}] },
  { id: 28, phase: "Governance", category: "Transparency", question: "Can you explain AI model decisions to stakeholders?", options: [{value: 1, label: "Cannot explain"}, {value: 2, label: "Limited explanation"}, {value: 3, label: "Basic interpretability"}, {value: 4, label: "Good transparency"}, {value: 5, label: "Full explainability"}] },
  { id: 29, phase: "Governance", category: "Accountability", question: "Is there clear ownership for AI outcomes?", options: [{value: 1, label: "No ownership"}, {value: 2, label: "Unclear"}, {value: 3, label: "Some accountability"}, {value: 4, label: "Defined owners"}, {value: 5, label: "Clear governance"}] }
];

function AIReadinessAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (value: number) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScores = () => {
    const phaseScores: Record<string, { total: number; count: number }> = {};
    
    phases.forEach(phase => {
      phaseScores[phase.name] = { total: 0, count: 0 };
    });

    questions.forEach(q => {
      if (answers[q.id]) {
        phaseScores[q.phase].total += answers[q.id];
        phaseScores[q.phase].count += 1;
      }
    });

    return phases.map(phase => ({
      ...phase,
      score: phaseScores[phase.name].count > 0 
        ? Math.round((phaseScores[phase.name].total / (phaseScores[phase.name].count * 5)) * 100)
        : 0
    }));
  };

  const calculateOverall = (phaseScores: ReturnType<typeof calculateScores>) => {
    const total = phaseScores.reduce((sum, p) => sum + p.score, 0);
    return Math.round(total / phaseScores.length);
  };

  const getReadinessLevel = (score: number) => {
    if (score >= 80) return { level: 'Advanced', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 60) return { level: 'Developing', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 40) return { level: 'Emerging', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Nascent', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const phaseScores = calculateScores();
  const overallScore = calculateOverall(phaseScores);
  const readiness = getReadinessLevel(overallScore);

  if (showResults) {
    return (
      <div className="min-h-screen bg-[#FFFCF5]">
        <Navigation />
        <div className="pt-28 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <h1 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-6 text-center">
                Your AI Readiness Assessment Results
              </h1>

              {/* Overall Score */}
              <div className="text-center mb-10">
                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${readiness.bg} mb-4`}>
                  <span className={`text-4xl font-bold ${readiness.color}`}>{overallScore}%</span>
                </div>
                <h2 className={`text-2xl font-bold ${readiness.color} mb-2`}>
                  {readiness.level} Readiness
                </h2>
                <p className="text-gray-600 max-w-lg mx-auto">
                  Based on your responses across 5 critical dimensions of AI readiness
                </p>
              </div>

              {/* Phase Breakdown */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {phaseScores.map((phase) => (
                  <div key={phase.name} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[#4ECDC4]">{phase.icon}</span>
                      <span className="font-semibold text-[#2C3E50]">{phase.name}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-[#4ECDC4] h-2 rounded-full transition-all"
                        style={{ width: `${phase.score}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{phase.score}%</span>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="bg-[#2C3E50] rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Recommended Next Steps</h3>
                <ul className="space-y-3">
                  {overallScore < 40 && (
                    <>
                      <li className="flex items-start gap-2 text-gray-300">
                        <ChevronRight className="w-5 h-5 text-[#E07A5F] flex-shrink-0" />
                        <span>Start with an AI strategy workshop to define your vision</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-300">
                        <ChevronRight className="w-5 h-5 text-[#E07A5F] flex-shrink-0" />
                        <span>Assess your current data landscape and identify gaps</span>
                      </li>
                    </>
                  )}
                  {overallScore >= 40 && overallScore < 60 && (
                    <>
                      <li className="flex items-start gap-2 text-gray-300">
                        <ChevronRight className="w-5 h-5 text-[#E07A5F] flex-shrink-0" />
                        <span>Prioritize 2-3 quick-win AI use cases for pilot projects</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-300">
                        <ChevronRight className="w-5 h-5 text-[#E07A5F] flex-shrink-0" />
                        <span>Invest in data quality improvements and governance</span>
                      </li>
                    </>
                  )}
                  {overallScore >= 60 && overallScore < 80 && (
                    <>
                      <li className="flex items-start gap-2 text-gray-300">
                        <ChevronRight className="w-5 h-5 text-[#E07A5F] flex-shrink-0" />
                        <span>Scale successful pilots across the organization</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-300">
                        <ChevronRight className="w-5 h-5 text-[#E07A5F] flex-shrink-0" />
                        <span>Build MLOps capabilities for production deployment</span>
                      </li>
                    </>
                  )}
                  {overallScore >= 80 && (
                    <>
                      <li className="flex items-start gap-2 text-gray-300">
                        <ChevronRight className="w-5 h-5 text-[#E07A5F] flex-shrink-0" />
                        <span>Explore advanced AI applications and emerging technologies</span>
                      </li>
                      <li className="flex items-start gap-2 text-gray-300">
                        <ChevronRight className="w-5 h-5 text-[#E07A5F] flex-shrink-0" />
                        <span>Consider AI center of excellence for enterprise-wide governance</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Email Capture */}
              {!submitted ? (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <p className="text-center text-gray-600 mb-4">
                    Get a detailed report emailed to you
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]"
                      required
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#E07A5F] text-white rounded-lg hover:bg-[#c96a52] transition-colors font-medium"
                    >
                      Send Report
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center text-green-600">
                  <Check className="w-8 h-8 mx-auto mb-2" />
                  <p>Report sent! Check your inbox.</p>
                </div>
              )}

              {/* CTA */}
              <div className="text-center mt-10">
                <p className="text-gray-600 mb-4">Want to discuss your results?</p>
                <a
                  href="mailto:zubiamL4L@gmail.com?subject=AI Readiness Assessment Follow-up"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#4ECDC4] text-white rounded-lg hover:bg-[#3dbdb5] transition-colors font-medium"
                >
                  <BarChart3 className="w-5 h-5" />
                  Book a Free Consultation
                </a>
              </div>

              <button
                onClick={() => {
                  setShowResults(false);
                  setCurrentQuestion(0);
                  setAnswers({});
                }}
                className="w-full mt-6 text-[#2C3E50] hover:text-[#4ECDC4] transition-colors"
              >
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const currentPhase = phases.find(p => p.name === question.phase);

  return (
    <div className="min-h-screen bg-[#FFFCF5]">
      <Navigation />
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigateTo('/?page=home')}
            className="flex items-center gap-2 text-[#2C3E50] hover:text-[#4ECDC4] transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4ECDC4]/10 rounded-full text-[#4ECDC4] font-medium mb-4">
                {currentPhase?.icon}
                <span>{question.phase} Phase</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#2C3E50]">
                AI Readiness Assessment
              </h1>
              <p className="text-gray-600 mt-2">{currentPhase?.description}</p>
            </div>

            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#4ECDC4] h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <span className="text-sm text-[#E07A5F] font-medium uppercase tracking-wide">
                {question.category}
              </span>
              <h2 className="text-xl font-semibold text-[#2C3E50] mt-2">
                {question.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    answers[question.id] === option.value
                      ? 'border-[#4ECDC4] bg-[#4ECDC4]/10'
                      : 'border-gray-200 hover:border-[#4ECDC4]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      answers[question.id] === option.value
                        ? 'border-[#4ECDC4] bg-[#4ECDC4]'
                        : 'border-gray-300'
                    }`}>
                      {answers[question.id] === option.value && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="text-[#2C3E50]">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrev}
                disabled={currentQuestion === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentQuestion === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-[#2C3E50] hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={!answers[question.id]}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  answers[question.id]
                    ? 'bg-[#E07A5F] text-white hover:bg-[#c96a52]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {currentQuestion === questions.length - 1 ? 'See Results' : 'Next'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIReadinessAssessment;
