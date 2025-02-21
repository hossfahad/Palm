import { eq, desc, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { clients, clientPreferences, compliance, access, addresses, familyInfo, documents, familyMembers, successorPlans, dafAccounts, otherGivingAccounts } from '@/lib/schema';
import type { Client, ClientPreferences, Compliance, Access, Address, FamilyInfo, Documents, FamilyMember, SuccessorPlan, DAFAccount, OtherGivingAccount } from '@/lib/schema';
import type { ClientProfile, MinimumClientCreation, Document } from '@/types/client';
import { createId } from '@paralleldrive/cuid2';

// Re-export types from the schema
export type {
  Client,
  ClientPreferences,
  Compliance,
  Access,
  Address,
  FamilyInfo,
  Documents,
  FamilyMember,
  SuccessorPlan,
  DAFAccount,
  OtherGivingAccount,
};

export const clientService = {
  async getClients() {
    try {
      const results = await db
        .select()
        .from(clients)
        .orderBy(desc(clients.createdAt));

      return results;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw new Error('Failed to fetch clients');
    }
  },

  async getClientById(id: string) {
    try {
      const [client] = await db
        .select()
        .from(clients)
        .where(eq(clients.id, id))
        .limit(1);

      if (!client) {
        throw new Error('Client not found');
      }

      // Fetch related data
      const [
        preferences,
        clientCompliance,
        clientAccess,
        primaryAddress,
        alternateAddress,
        clientFamilyInfo,
        clientDocuments,
        dafs,
        otherAccounts,
      ] = await Promise.all([
        db.select().from(clientPreferences).where(eq(clientPreferences.id, client.preferencesId)).limit(1),
        db.select().from(compliance).where(eq(compliance.id, client.complianceId)).limit(1),
        db.select().from(access).where(eq(access.id, client.accessId)).limit(1),
        db.select().from(addresses).where(eq(addresses.id, client.primaryAddressId)).limit(1),
        client.alternateAddressId 
          ? db.select().from(addresses).where(eq(addresses.id, client.alternateAddressId)).limit(1)
          : Promise.resolve([]),
        client.familyInfoId
          ? db.select().from(familyInfo).where(eq(familyInfo.id, client.familyInfoId)).limit(1)
          : Promise.resolve([]),
        client.documentsId
          ? db.select().from(documents).where(eq(documents.id, client.documentsId)).limit(1)
          : Promise.resolve([]),
        db.select().from(dafAccounts).where(eq(dafAccounts.clientId, client.id)),
        db.select().from(otherGivingAccounts).where(eq(otherGivingAccounts.clientId, client.id)),
      ]);

      // Transform and return the complete client profile
      return this.transformClientToProfile({
        ...client,
        preferences: preferences[0],
        compliance: clientCompliance[0],
        access: clientAccess[0],
        primaryAddress: primaryAddress[0],
        alternateAddress: alternateAddress[0],
        familyInfo: clientFamilyInfo[0],
        documents: clientDocuments[0],
        dafs,
        otherAccounts,
      });
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
  },

  async createClient(data: MinimumClientCreation) {
    try {
      // Create required related records first
      const [preferences, clientCompliance, clientAccess, primaryAddress] = await Promise.all([
        db.insert(clientPreferences).values({
          id: createId(),
          communicationFrequency: 'monthly',
          reportingPreferences: [],
          marketingConsent: false,
          languagePreference: 'en-US',
        }).returning(),
        db.insert(compliance).values({
          id: createId(),
          kycStatus: data.compliance.kycStatus,
          restrictions: [],
        }).returning(),
        db.insert(access).values({
          id: createId(),
          canView: true,
          canEdit: false,
          canDelete: false,
          canInvite: false,
          grantAccess: false,
          reportAccess: false,
          documentAccess: false,
          role: 'client',
        }).returning(),
        db.insert(addresses).values({
          id: createId(),
          ...data.contactInfo.primaryAddress,
          type: data.contactInfo.primaryAddress.type || 'home',
        }).returning(),
      ]);

      // Create the client with all required relations
      const [client] = await db.insert(clients).values({
        id: createId(),
        status: 'PENDING',
        firstName: data.basicInfo.firstName,
        lastName: data.basicInfo.lastName,
        email: data.basicInfo.email,
        preferredContactMethod: data.contactInfo.preferredContactMethod,
        advisorId: data.relationshipInfo.advisorId,
        relationshipStartDate: data.relationshipInfo.relationshipStartDate,
        causeAreas: data.philanthropicProfile.causeAreas,
        secondaryAdvisors: [],
        primaryAddressId: primaryAddress[0].id,
        preferencesId: preferences[0].id,
        complianceId: clientCompliance[0].id,
        accessId: clientAccess[0].id,
      }).returning();

      return this.getClientById(client.id);
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  async updateClient(id: string, updates: Partial<Client>) {
    try {
      const [updatedClient] = await db
        .update(clients)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(clients.id, id))
        .returning();

      if (!updatedClient) {
        throw new Error('Client not found');
      }

      return this.getClientById(updatedClient.id);
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  async deleteClient(id: string) {
    try {
      // Get the raw client data first
      const [client] = await db
        .select()
        .from(clients)
        .where(eq(clients.id, id))
        .limit(1);

      if (!client) {
        throw new Error('Client not found');
      }

      // Delete related records in the correct order
      await Promise.all([
        client.documentsId && db.delete(documents).where(eq(documents.id, client.documentsId)),
        client.familyInfoId && db.delete(familyInfo).where(eq(familyInfo.id, client.familyInfoId)),
        db.delete(dafAccounts).where(eq(dafAccounts.clientId, id)),
        db.delete(otherGivingAccounts).where(eq(otherGivingAccounts.clientId, id)),
      ]);

      await Promise.all([
        db.delete(addresses).where(eq(addresses.id, client.primaryAddressId)),
        client.alternateAddressId && db.delete(addresses).where(eq(addresses.id, client.alternateAddressId)),
        db.delete(clientPreferences).where(eq(clientPreferences.id, client.preferencesId)),
        db.delete(compliance).where(eq(compliance.id, client.complianceId)),
        db.delete(access).where(eq(access.id, client.accessId)),
      ]);

      await db.delete(clients).where(eq(clients.id, id));

      // Return the transformed profile for consistency
      return this.transformClientToProfile(client);
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  },

  // Transform methods
  transformDocument(doc: any): Document {
    return {
      id: doc.id,
      type: doc.type as 'AGREEMENT' | 'TAX' | 'GRANT_LETTER' | 'CORRESPONDENCE',
      name: doc.name,
      url: doc.url,
      uploadedAt: doc.uploadedAt,
    };
  },

  transformAddress(dbAddress: any): {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    type: 'home' | 'business' | 'mailing';
  } {
    const address: {
      street1: string;
      street2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      type: 'home' | 'business' | 'mailing';
    } = {
      street1: dbAddress.street1,
      city: dbAddress.city,
      state: dbAddress.state,
      postalCode: dbAddress.postalCode,
      country: dbAddress.country,
      type: dbAddress.type as 'home' | 'business' | 'mailing',
    };

    if (dbAddress.street2) {
      address.street2 = dbAddress.street2;
    }

    return address;
  },

  transformClientToProfile(dbClient: any): ClientProfile {
    const documentGroups = dbClient.documents?.documents ? 
      this.transformDocuments(dbClient.documents.documents) : 
      {
        agreements: [],
        taxDocuments: [],
        grantLetters: [],
        correspondence: [],
      };

    return {
      id: dbClient.id,
      status: dbClient.status.toLowerCase(),
      createdAt: dbClient.createdAt,
      updatedAt: dbClient.updatedAt,
      basicInfo: {
        firstName: dbClient.firstName,
        lastName: dbClient.lastName,
        email: dbClient.email,
        phone: dbClient.phone || undefined,
        dateOfBirth: dbClient.dateOfBirth || undefined,
        preferredName: dbClient.preferredName || undefined,
        preferredPronouns: dbClient.preferredPronouns || undefined,
      },
      contactInfo: {
        primaryAddress: this.transformAddress(dbClient.primaryAddress),
        alternateAddress: dbClient.alternateAddress ? this.transformAddress(dbClient.alternateAddress) : undefined,
        preferredContactMethod: dbClient.preferredContactMethod,
        timeZone: dbClient.timeZone || undefined,
      },
      relationshipInfo: {
        advisorId: dbClient.advisorId,
        relationshipStartDate: dbClient.relationshipStartDate,
        firmClientId: dbClient.firmClientId || undefined,
        secondaryAdvisors: dbClient.secondaryAdvisors,
        relationshipManager: dbClient.relationshipManager || undefined,
      },
      philanthropicProfile: {
        causeAreas: dbClient.causeAreas,
        givingGoals: dbClient.givingGoals ? {
          annualTarget: dbClient.givingGoals.annualTarget || undefined,
          impactAreas: dbClient.givingGoals.impactAreas,
          preferredVehicles: dbClient.givingGoals.preferredVehicles,
        } : undefined,
        grantPreferences: dbClient.grantPreferences ? {
          anonymous: dbClient.grantPreferences.anonymous,
          recurringPreferred: dbClient.grantPreferences.recurringPreferred,
          minimumGrantSize: dbClient.grantPreferences.minimumGrantSize || undefined,
        } : undefined,
      },
      accounts: {
        dafs: dbClient.dafs || [],
        otherAccounts: (dbClient.otherAccounts || []).map((account: any) => ({
          ...account,
          type: account.type,
          institution: account.institution || undefined,
        })),
      },
      preferences: {
        communicationFrequency: dbClient.preferences.communicationFrequency,
        reportingPreferences: dbClient.preferences.reportingPreferences,
        marketingConsent: dbClient.preferences.marketingConsent,
        languagePreference: dbClient.preferences.languagePreference,
      },
      familyInfo: dbClient.familyInfo ? {
        familyMembers: dbClient.familyInfo.familyMembers.map((member: any) => ({
          ...member,
          email: member.email || undefined,
          accessLevel: member.accessLevel || undefined,
        })),
        successorPlans: dbClient.familyInfo.successorPlans,
        familyPhilanthropy: {
          familyMeetingFrequency: dbClient.familyInfo.familyMeetingFrequency || undefined,
          nextGenPrograms: dbClient.familyInfo.nextGenPrograms,
          familyGivingCommittee: dbClient.familyInfo.familyGivingCommittee || undefined,
          educationPrograms: dbClient.familyInfo.educationPrograms,
        },
      } : undefined,
      documents: dbClient.documents ? documentGroups : undefined,
      compliance: {
        kycStatus: dbClient.compliance.kycStatus,
        kycDate: dbClient.compliance.kycDate || undefined,
        riskRating: dbClient.compliance.riskRating || undefined,
        restrictions: dbClient.compliance.restrictions,
      },
      access: {
        portalAccess: dbClient.access.canView,
        lastLogin: undefined,
        loginMethod: undefined,
        twoFactorEnabled: false,
      },
    };
  },

  transformDocuments(documents: any[]) {
    const result: {
      agreements: Document[];
      taxDocuments: Document[];
      grantLetters: Document[];
      correspondence: Document[];
    } = {
      agreements: [],
      taxDocuments: [],
      grantLetters: [],
      correspondence: [],
    };

    documents.forEach(doc => {
      const transformedDoc = this.transformDocument(doc);
      switch (doc.type) {
        case 'AGREEMENT':
          result.agreements.push(transformedDoc);
          break;
        case 'TAX':
          result.taxDocuments.push(transformedDoc);
          break;
        case 'GRANT_LETTER':
          result.grantLetters.push(transformedDoc);
          break;
        case 'CORRESPONDENCE':
          result.correspondence.push(transformedDoc);
          break;
      }
    });

    return result;
  },
}; 