export interface Client {
  id: string;
  name: string;
  industry: string;
  location: string;
  website: string;
  monthlyRetainer: number;
  services: string[];
  startDate: string;
  contactName: string;
  contactEmail: string;
  status: 'active' | 'attention' | 'action_required';
}

export interface MonthlyMetrics {
  clientId: string;
  date: string;
  monthYear: string;
  sessions: number;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  avgSessionDuration: number;
  bounceRate: number;
  pagesPerSession: number;
  conversions: number;
  conversionRate: number;
  reviewCount: number;
  avgRating: number;
  newReviews: number;
}

export interface ClientFeedback {
  clientId: string;
  date: string;
  type: 'lead' | 'sale' | 'complaint';
  description: string;
  value: number;
  recordedBy: string;
}

export interface ClientSummary {
  clientId: string;
  clientName: string;
  industry: string;
  monthlyRetainer: number;
  healthScore: number;
  status: 'on_track' | 'attention' | 'action_required';
  latestSessions: number;
  sessionTrend: number;
  latestConversions: number;
  conversionTrend: number;
  latestRating: number;
  reviewCount: number;
  totalFeedbackValue: number;
  roiPercentage: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

export interface ChatMessage {
  role: 'user' | 'system';
  content: string;
  timestamp?: Date;
}
