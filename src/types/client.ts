// Enums
export enum ClientStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}

export enum GivingVehicle {
  DAF = 'daf',
  FOUNDATION = 'foundation',
  TRUST = 'trust',
  DIRECT = 'direct'
}

export enum ReportType {
  MONTHLY_SUMMARY = 'monthly_summary',
  QUARTERLY_DETAIL = 'quarterly_detail',
  ANNUAL_IMPACT = 'annual_impact',
  TAX_DOCUMENTS = 'tax_documents',
  GRANT_HISTORY = 'grant_history'
}

// Supporting Types
export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  type: 'home' | 'business' | 'mailing';
}

export interface FamilyMember {
  id: string;
  relationship: string;
  name: string;
  email?: string;
  philanthropicInvolvement: boolean;
  accessLevel?: 'view' | 'recommend' | 'none';
}

export interface SuccessorPlan {
  successorType: 'individual' | 'charity';
  successors: Array<{
    id: string;
    type: string;
    allocation: number;
    priority: number;
  }>;
}

export interface FamilyPhilanthropyPreferences {
  familyMeetingFrequency?: 'monthly' | 'quarterly' | 'annually';
  nextGenPrograms: boolean;
  familyGivingCommittee?: boolean;
  educationPrograms?: string[];
}

export interface Document {
  id: string;
  type: string;
  name: string;
  url: string;
  uploadedAt: Date;
}

export interface DAFAccount {
  id: string;
  name: string;
  sponsor: string;
  accountNumber: string;
  balance: number;
  createdAt: Date;
}

export interface OtherGivingAccount {
  id: string;
  type: GivingVehicle;
  name: string;
  balance: number;
  institution?: string;
}

// Core Client Profile
export interface ClientProfile {
  id: string;
  status: ClientStatus;
  createdAt: Date;
  updatedAt: Date;

  basicInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: Date;
    preferredName?: string;
    preferredPronouns?: string;
  };

  contactInfo: {
    primaryAddress: Address;
    alternateAddress?: Address;
    preferredContactMethod: 'email' | 'phone' | 'mail';
    timeZone?: string;
  };

  relationshipInfo: {
    advisorId: string;
    relationshipStartDate: Date;
    firmClientId?: string;
    secondaryAdvisors?: string[];
    relationshipManager?: string;
  };

  philanthropicProfile: {
    causeAreas: string[];
    givingGoals?: {
      annualTarget?: number;
      impactAreas?: string[];
      preferredVehicles?: GivingVehicle[];
    };
    grantPreferences?: {
      anonymous: boolean;
      recurringPreferred: boolean;
      minimumGrantSize?: number;
    };
  };

  accounts: {
    dafs: DAFAccount[];
    otherAccounts?: OtherGivingAccount[];
  };

  preferences: {
    communicationFrequency: 'weekly' | 'monthly' | 'quarterly';
    reportingPreferences: ReportType[];
    marketingConsent: boolean;
    languagePreference: string;
  };

  familyInfo?: {
    familyMembers: FamilyMember[];
    successorPlans?: SuccessorPlan[];
    familyPhilanthropy?: FamilyPhilanthropyPreferences;
  };

  documents?: {
    agreements: Document[];
    taxDocuments: Document[];
    grantLetters: Document[];
    correspondence: Document[];
  };

  compliance: {
    kycStatus: 'pending' | 'approved' | 'rejected';
    kycDate?: Date;
    riskRating?: string;
    restrictions?: string[];
  };

  access: {
    portalAccess: boolean;
    lastLogin?: Date;
    loginMethod?: string;
    twoFactorEnabled: boolean;
  };
}

// Minimum Required Fields for Client Creation
export interface MinimumClientCreation {
  basicInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  contactInfo: {
    primaryAddress: Address;
    preferredContactMethod: 'email' | 'phone' | 'mail';
  };
  relationshipInfo: {
    advisorId: string;
    relationshipStartDate: Date;
  };
  philanthropicProfile: {
    causeAreas: string[];
  };
  compliance: {
    kycStatus: 'pending' | 'approved' | 'rejected';
  };
}

// Client Summary Type (for lists and quick views)
export interface ClientSummary {
  id: string;
  name: string;
  totalPortfolioValue: number;
}

export interface DAF {
  id: string;
  name: string;
  balance: number;
  sponsor: string;
  accountNumber: string;
}

export interface Activity {
  type: string;
  description: string;
  timestamp: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  dafs: DAF[];
  totalPortfolioValue: number;
  activeGrants: number;
  lastActivity?: Activity;
} 