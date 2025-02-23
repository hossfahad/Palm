# Palm Dashboard Enhancement Stories
## Single-Point User Stories with Implementation Details

### Financial Metrics Section

IMPORTANT: Do not remove any existing components. Only add new components. Make sure that the existing components are not broken. Make all things mobile-friendly.

#### Story 1: Available to Give Indicator
**Points**: 1
**As a** wealth manager / advisor
**I want** to input or update the available balance for granting
**So that** I can quickly know how much can be distributed

**Technical Details**:
```typescript
interface AvailableBalance {
  totalBalance: number;
  pendingGrants: number;
  availableToGive: number;  // totalBalance - pendingGrants
}

// Business Logic
function calculateAvailableToGive(account: DAFAccount): number {
  const totalBalance = account.currentBalance;
  const pendingGrants = account.grants
    .filter(grant => grant.status === 'pending')
    .reduce((sum, grant) => sum + grant.amount, 0);
  return totalBalance - pendingGrants;
}
```

**Acceptance Criteria**:
- Add new card above existing metrics showing "Available to Give"
- Format number in USD with commas
- Update in real-time when grants are added/removed
- Show tooltip explaining calculation
- Color code based on threshold (red if < 10% of total balance)

#### Story 2: Asset Allocation Summary
**Points**: 1
**As a** wealth manager
**I want** to see the breakdown of assets in each DAF
**So that** I can monitor investment allocation

**Technical Details**:
```typescript
interface AssetAllocation {
  cash: {
    amount: number;
    percentage: number;
  };
  publicEquity: {
    amount: number;
    percentage: number;
  };
  fixedIncome: {
    amount: number;
    percentage: number;
  };
  alternative: {
    amount: number;
    percentage: number;
  };
}

// Business Logic
function calculateAllocation(holdings: Holdings): AssetAllocation {
  const total = holdings.getTotalValue();
  return {
    cash: {
      amount: holdings.cash,
      percentage: (holdings.cash / total) * 100
    },
    // ... similar for other asset types
  };
}
```

**Acceptance Criteria**:
- Add collapsible section below portfolio activity
- Show each asset type with amount and percentage
- Include mini bar chart for visual representation
- Update when holdings change
- Add export functionality

### Action Items

#### Story 3: Quick Action Buttons
**Points**: 1
**As a** wealth manager
**I want** prominent action buttons for common tasks
**So that** I can quickly initiate key actions

**Technical Details**:
```typescript
interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  permission: string[];
  visibility: UserRole[];
}

const quickActions: QuickAction[] = [
  {
    id: 'make-grant',
    label: 'Make a Grant',
    icon: 'grant-icon',
    action: () => openGrantModal(),
    permission: ['create:grant'],
    visibility: ['advisor', 'admin']
  },
  // ... other actions
];
```

**Acceptance Criteria**:
- Add action button strip below metrics
- Include "Make Grant" and "Make Contribution" buttons
- Use consistent styling with existing "+" button
- Show tooltips on hover
- Disable if user lacks permissions

### Impact Tracking

#### Story 4: YTD Impact Metrics
**Points**: 1
**As a** wealth manager
**I want** to see year-to-date giving metrics
**So that** I can track annual giving progress

**Technical Details**:
```typescript
interface YTDMetrics {
  contributions: {
    amount: number;
    count: number;
    changeFromLastYear: number;
  };
  grants: {
    amount: number;
    count: number;
    changeFromLastYear: number;
  };
}

// Business Logic
function calculateYTDMetrics(transactions: Transaction[]): YTDMetrics {
  const currentYear = new Date().getFullYear();
  const ytdTransactions = transactions.filter(tx => 
    tx.date.getFullYear() === currentYear
  );
  
  return {
    contributions: summarizeTransactions(
      ytdTransactions.filter(tx => tx.type === 'contribution')
    ),
    grants: summarizeTransactions(
      ytdTransactions.filter(tx => tx.type === 'grant')
    )
  };
}
```

**Acceptance Criteria**:
- Add YTD section next to cause distribution
- Show contribution and grant totals
- Include year-over-year comparison
- Add mini sparkline graphs
- Include "View Details" link

#### Story 5: Lifetime Giving Summary
**Points**: 1
**As a** wealth manager
**I want** to see lifetime giving metrics
**So that** I can understand long-term impact

**Technical Details**:
```typescript
interface LifetimeMetrics {
  totalGiving: number;
  grantCount: number;
  topCauses: Array<{
    cause: string;
    amount: number;
    percentage: number;
  }>;
  impactHighlights: string[];
}

// Business Logic
function calculateLifetimeMetrics(
  transactions: Transaction[],
  causes: CauseArea[]
): LifetimeMetrics {
  const grants = transactions.filter(tx => tx.type === 'grant');
  const causeAggregation = aggregateByCause(grants, causes);
  
  return {
    totalGiving: grants.reduce((sum, grant) => sum + grant.amount, 0),
    grantCount: grants.length,
    topCauses: getTopCauses(causeAggregation, 3),
    impactHighlights: generateImpactHighlights(grants)
  };
}
```

**Acceptance Criteria**:
- Add lifetime metrics below YTD section
- Show total giving amount
- Display grant count
- List top 3 causes
- Include notable impact highlights

### Implementation Notes

1. **Component Placement**:
- All new components should be added without removing existing ones
- Use responsive grid system to accommodate new elements
- Maintain existing color scheme and styling

2. **Data Management**:
- Implement caching for performance
- Add error boundaries around new components
- Include loading states
- Handle edge cases (no data, errors)

3. **Performance Considerations**:
- Lazy load new components
- Optimize calculations
- Use memoization where appropriate
- Implement virtual scrolling for large datasets

4. **Testing Requirements**:
- Unit tests for business logic
- Integration tests for components
- End-to-end tests for critical paths
- Accessibility testing

Each story should be implemented in order, with proper code review and testing before merging.