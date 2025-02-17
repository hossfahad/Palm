export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface DashboardAnalytics {
  totalDonations: number;
  activeDAFs: number;
  pendingGrants: number;
  recentActivity: Array<{
    id: string;
    type: 'donation' | 'grant' | 'daf_creation';
    amount: number;
    timestamp: string;
    status: string;
  }>;
  metrics: {
    donationGrowth: number;
    averageGrant: number;
    totalImpact: number;
  };
}

export interface NetworkActivity {
  activities: Array<{
    id: string;
    type: string;
    actor: {
      id: string;
      name: string;
      role: string;
    };
    details: Record<string, any>;
    timestamp: string;
  }>;
}

export interface CharitySearchParams {
  query: string;
  category?: string[];
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
  page: number;
  limit: number;
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export interface Charity {
  id: string;
  name: string;
  ein: string;
  category: string[];
  description: string;
  metrics: {
    impactScore: number;
    financialHealth: number;
    transparency: number;
  };
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

export interface DAFCreationRequest {
  name: string;
  organizationId: string;
  initialContribution: {
    amount: number;
    currency: string;
    source: {
      type: 'bank' | 'wire' | 'stock';
      details: Record<string, any>;
    };
  };
  advisors: Array<{
    userId: string;
    role: 'primary' | 'secondary';
  }>;
  successorStrategy?: {
    type: 'individual' | 'charity';
    details: Record<string, any>;
  };
  investmentPreferences?: {
    strategy: 'conservative' | 'moderate' | 'aggressive';
    restrictions?: string[];
  };
}

export interface DAF {
  id: string;
  status: 'pending' | 'active';
  accountNumber: string;
  createdAt: string;
  balance: number;
} 