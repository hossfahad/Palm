export interface DashboardMetrics {
  totalDonations: number;
  activeDAFs: number;
  pendingGrants: number;
  metrics: {
    donationGrowth: number;
    averageGrant: number;
    totalImpact: number;
  };
}

export interface ActivityItem {
  id: string;
  type: 'donation' | 'grant' | 'daf_creation';
  amount: number;
  timestamp: string;
  status: string;
}

export interface ChartData {
  date: string;
  value: number;
  category?: string;
}

export interface DashboardData extends DashboardMetrics {
  recentActivity: ActivityItem[];
  trendData: {
    donations: ChartData[];
    grants: ChartData[];
    impact: ChartData[];
  };
  causeDistribution: {
    cause: string;
    amount: number;
    percentage: number;
  }[];
} 