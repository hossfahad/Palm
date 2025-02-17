import { prisma } from '@/lib/db';
import { ClientProfile, MinimumClientCreation } from '@/types/client';
import { Prisma } from '@prisma/client';

export class ClientService {
  static async createClient(data: MinimumClientCreation) {
    try {
      // First create the required related records
      const [preferences, compliance, access] = await Promise.all([
        prisma.clientPreferences.create({
          data: {
            communicationFrequency: 'monthly',
            reportingPreferences: [],
            marketingConsent: false,
            languagePreference: 'en-US',
          },
        }),
        prisma.compliance.create({
          data: {
            kycStatus: data.compliance.kycStatus,
          },
        }),
        prisma.access.create({
          data: {
            portalAccess: false,
            twoFactorEnabled: false,
          },
        }),
      ]);

      // Create the primary address
      const primaryAddress = await prisma.address.create({
        data: {
          ...data.contactInfo.primaryAddress,
        },
      });

      // Create the client with all relations
      const client = await prisma.client.create({
        data: {
          status: 'PENDING',
          firstName: data.basicInfo.firstName,
          lastName: data.basicInfo.lastName,
          email: data.basicInfo.email,
          preferredContactMethod: data.contactInfo.preferredContactMethod,
          advisorId: data.relationshipInfo.advisorId,
          relationshipStartDate: data.relationshipInfo.relationshipStartDate,
          causeAreas: data.philanthropicProfile.causeAreas,
          primaryAddressId: primaryAddress.id,
          preferencesId: preferences.id,
          complianceId: compliance.id,
          accessId: access.id,
        },
        include: {
          primaryAddress: true,
          alternateAddress: true,
          preferences: true,
          compliance: true,
          access: true,
          dafs: true,
          givingGoals: true,
          grantPreferences: true,
          familyInfo: {
            include: {
              familyMembers: true,
              successorPlans: true,
            },
          },
          documents: {
            include: {
              agreements: true,
              taxDocuments: true,
              grantLetters: true,
              correspondence: true,
            },
          },
        },
      });

      return client;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  static async getClient(id: string) {
    return prisma.client.findUnique({
      where: { id },
      include: {
        primaryAddress: true,
        alternateAddress: true,
        preferences: true,
        compliance: true,
        access: true,
        dafs: true,
        givingGoals: true,
        grantPreferences: true,
        familyInfo: {
          include: {
            familyMembers: true,
            successorPlans: true,
          },
        },
        documents: {
          include: {
            agreements: true,
            taxDocuments: true,
            grantLetters: true,
            correspondence: true,
          },
        },
      },
    });
  }

  static async updateClient(id: string, data: Partial<ClientProfile>) {
    // Implementation will depend on what fields are being updated
    // This is a basic example that would need to be expanded based on requirements
    return prisma.client.update({
      where: { id },
      data: {
        firstName: data.basicInfo?.firstName,
        lastName: data.basicInfo?.lastName,
        email: data.basicInfo?.email,
        phone: data.basicInfo?.phone,
        dateOfBirth: data.basicInfo?.dateOfBirth,
        preferredName: data.basicInfo?.preferredName,
        preferredPronouns: data.basicInfo?.preferredPronouns,
        // Add other fields as needed
      },
      include: {
        primaryAddress: true,
        alternateAddress: true,
        preferences: true,
        compliance: true,
        access: true,
        dafs: true,
        givingGoals: true,
        grantPreferences: true,
        familyInfo: {
          include: {
            familyMembers: true,
            successorPlans: true,
          },
        },
        documents: {
          include: {
            agreements: true,
            taxDocuments: true,
            grantLetters: true,
            correspondence: true,
          },
        },
      },
    });
  }

  static async getAllClients() {
    return prisma.client.findMany({
      include: {
        primaryAddress: true,
        preferences: true,
        dafs: true,
      },
    });
  }

  static async deleteClient(id: string) {
    // This would need to handle deleting all related records as well
    return prisma.client.delete({
      where: { id },
    });
  }
} 