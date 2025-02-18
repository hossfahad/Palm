import { prisma } from '@/lib/db';
import { ClientProfile, MinimumClientCreation, ClientStatus, GivingVehicle, ReportType, Address, FamilyMember, SuccessorPlan, OtherGivingAccount, Document } from '@/types/client';

export interface Client {
  id: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  preferredName?: string;
  preferredPronouns?: string;
  advisorId: string;
  relationshipStartDate: Date;
  firmClientId?: string;
  secondaryAdvisors: string[];
  relationshipManager?: string;
  causeAreas: string[];
  preferredContactMethod: string;
}

// Helper function to convert camelCase to snake_case for SQL
const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

export const clientService = {
  async getClients() {
    try {
      return await prisma.client.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          primaryAddress: true,
          preferences: true,
          compliance: true,
          access: true,
          dafs: true,
          givingGoals: true,
          grantPreferences: true,
        },
      });
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw new Error('Failed to fetch clients');
    }
  },

  async getClientById(id: string) {
    try {
      const client = await prisma.client.findUnique({
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
              documents: true,
            },
          },
          otherAccounts: true,
        },
      });

      if (!client) {
        throw new Error('Client not found');
      }

      return this.transformClientToProfile(client);
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
  },

  async createClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      // Create required related records first
      const [preferences, compliance, access, primaryAddress] = await Promise.all([
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
            kycStatus: 'pending',
            restrictions: [],
          },
        }),
        prisma.access.create({
          data: {
            canView: true,
            canEdit: false,
            canDelete: false,
            canInvite: false,
            grantAccess: false,
            reportAccess: false,
            documentAccess: false,
            role: 'client',
          },
        }),
        prisma.address.create({
          data: {
            street1: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
            type: 'home',
          },
        }),
      ]);

      // Create the client with all required relations
      const newClient = await prisma.client.create({
        data: {
          status: client.status,
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone,
          dateOfBirth: client.dateOfBirth,
          preferredName: client.preferredName,
          preferredPronouns: client.preferredPronouns,
          advisorId: client.advisorId,
          relationshipStartDate: client.relationshipStartDate,
          firmClientId: client.firmClientId,
          secondaryAdvisors: client.secondaryAdvisors,
          relationshipManager: client.relationshipManager,
          causeAreas: client.causeAreas,
          preferredContactMethod: client.preferredContactMethod,
          primaryAddressId: primaryAddress.id,
          preferencesId: preferences.id,
          complianceId: compliance.id,
          accessId: access.id,
        },
        include: {
          primaryAddress: true,
          preferences: true,
          compliance: true,
          access: true,
        },
      });

      return this.transformClientToProfile(newClient);
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  async updateClient(id: string, updates: Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>) {
    try {
      const client = await prisma.client.update({
        where: { id },
        data: updates,
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
              documents: true,
            },
          },
          otherAccounts: true,
        },
      });

      return this.transformClientToProfile(client);
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  async deleteClient(id: string) {
    try {
      return await prisma.$transaction(async (tx) => {
        const client = await tx.client.findUnique({
          where: { id },
          include: {
            primaryAddress: true,
            alternateAddress: true,
            preferences: true,
            compliance: true,
            access: true,
            documents: {
              include: {
                documents: true,
              },
            },
            familyInfo: {
              include: {
                familyMembers: true,
                successorPlans: true,
              },
            },
            givingGoals: true,
            grantPreferences: true,
            dafs: true,
            otherAccounts: true,
            invitations: true,
          },
        });

        if (!client) {
          throw new Error('Client not found');
        }

        // Delete related records in the correct order
        if (client.invitations.length > 0) {
          await tx.clientAccessInvitation.deleteMany({
            where: { clientId: id },
          });
        }

        if (client.dafs.length > 0) {
          await tx.dAFAccount.deleteMany({
            where: { clientId: id },
          });
        }

        if (client.otherAccounts.length > 0) {
          await tx.otherGivingAccount.deleteMany({
            where: { clientId: id },
          });
        }

        if (client.documents) {
          if (client.documents.documents.length > 0) {
            await tx.document.deleteMany({
              where: { documentsId: client.documents.id },
            });
          }
          await tx.documents.delete({
            where: { id: client.documents.id },
          });
        }

        if (client.familyInfo) {
          if (client.familyInfo.familyMembers.length > 0) {
            await tx.familyMember.deleteMany({
              where: { familyInfoId: client.familyInfo.id },
            });
          }
          if (client.familyInfo.successorPlans.length > 0) {
            await tx.successorPlan.deleteMany({
              where: { familyInfoId: client.familyInfo.id },
            });
          }
          await tx.familyInfo.delete({
            where: { id: client.familyInfo.id },
          });
        }

        if (client.givingGoals) {
          await tx.givingGoals.delete({
            where: { id: client.givingGoals.id },
          });
        }

        if (client.grantPreferences) {
          await tx.grantPreferences.delete({
            where: { id: client.grantPreferences.id },
          });
        }

        if (client.primaryAddress) {
          await tx.address.delete({
            where: { id: client.primaryAddress.id },
          });
        }

        if (client.alternateAddress) {
          await tx.address.delete({
            where: { id: client.alternateAddress.id },
          });
        }

        await tx.clientPreferences.delete({
          where: { id: client.preferences.id },
        });

        await tx.compliance.delete({
          where: { id: client.compliance.id },
        });

        await tx.access.delete({
          where: { id: client.access.id },
        });

        await tx.client.delete({
          where: { id },
        });

        return client;
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  },

  async createClientProfile(data: MinimumClientCreation): Promise<ClientProfile> {
    try {
      // Create the required related records in parallel
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
            restrictions: [],
          },
        }),
        prisma.access.create({
          data: {
            canView: true,
            canEdit: false,
            canDelete: false,
            canInvite: false,
            grantAccess: false,
            reportAccess: false,
            documentAccess: false,
            role: 'client',
          },
        }),
      ]);

      // Create the primary address
      const primaryAddress = await prisma.address.create({
        data: {
          ...data.contactInfo.primaryAddress,
          type: data.contactInfo.primaryAddress.type || 'home',
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
          secondaryAdvisors: [],
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
              documents: true,
            },
          },
          otherAccounts: true,
        },
      });

      return this.transformClientToProfile(client);
    } catch (error) {
      console.error('Error creating client profile:', error);
      throw error;
    }
  },

  transformDocument(doc: Document): Document {
    return {
      id: doc.id,
      type: doc.type,
      name: doc.name,
      url: doc.url,
      uploadedAt: doc.uploadedAt,
    };
  },

  transformAddress(dbAddress: any): Address {
    return {
      street1: dbAddress.street1,
      street2: dbAddress.street2 || undefined,
      city: dbAddress.city,
      state: dbAddress.state,
      postalCode: dbAddress.postalCode,
      country: dbAddress.country,
      type: dbAddress.type,
    };
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
      status: dbClient.status.toLowerCase() as ClientStatus,
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
          type: account.type as GivingVehicle,
          institution: account.institution || undefined,
        })),
      },
      preferences: {
        communicationFrequency: dbClient.preferences.communicationFrequency as 'weekly' | 'monthly' | 'quarterly',
        reportingPreferences: dbClient.preferences.reportingPreferences as ReportType[],
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
        kycStatus: dbClient.compliance.kycStatus as 'pending' | 'approved' | 'rejected',
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

  transformDocuments(documents: Document[]): {
    agreements: Document[];
    taxDocuments: Document[];
    grantLetters: Document[];
    correspondence: Document[];
  } {
    const result = {
      agreements: [] as Document[],
      taxDocuments: [] as Document[],
      grantLetters: [] as Document[],
      correspondence: [] as Document[],
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

  async getClient(id: string) {
    const client = await prisma.client.findUnique({
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
            documents: true,
          },
        },
        otherAccounts: true,
      },
    });
    return client ? this.transformClientToProfile(client) : null;
  },

  async getAllClients() {
    const clients = await prisma.client.findMany({
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
            documents: true,
          },
        },
        otherAccounts: true,
      },
    });
    return clients.map(client => this.transformClientToProfile(client));
  },

  async archiveClient(id: string) {
    try {
      const client = await prisma.client.update({
        where: { id },
        data: {
          status: 'ARCHIVED',
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
              documents: true,
            },
          },
          otherAccounts: true,
        },
      });

      return this.transformClientToProfile(client);
    } catch (error) {
      console.error('Error archiving client:', error);
      throw error;
    }
  },
}; 