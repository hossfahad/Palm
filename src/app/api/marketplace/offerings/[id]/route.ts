import { NextResponse } from 'next/server';

const mockProgram = {
  id: '1',
  name: 'Community Foundation DAF',
  organization: 'Local Community Foundation',
  minimumContribution: 5000,
  programType: 'Community',
  geographicFocus: ['Local', 'Regional'],
  fees: '1% annually',
  description: 'A donor-advised fund designed for local and regional philanthropic impact, offering personalized service and deep community knowledge.',
  fundObjective: 'To provide donors with a flexible and efficient vehicle for charitable giving while maximizing local community impact.',
  features: [
    'Local grant-making expertise',
    'Community impact reports',
    'Personalized philanthropic advising',
    'Site visits to local nonprofits',
    'Quarterly donor events',
  ],
  investmentOptions: [
    'ESG Portfolio',
    'Impact Investment Pool',
    'Growth Portfolio',
    'Income Portfolio',
    'Money Market Pool',
  ],
  grantingDetails: {
    minimumGrant: 250,
    grantingFrequency: 'Weekly',
    internationalGranting: true,
    anonymousGranting: true,
  },
  ticker: 'CFDAF',
  expenses: '1.00%',
  assets: '52.6 million',
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // In a real application, you would fetch this data from a database
  // For now, we'll return mock data
  return NextResponse.json(mockProgram);
} 