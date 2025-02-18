import { z } from 'zod';

export const createClientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  preferredName: z.string().optional(),
  preferredPronouns: z.string().optional(),
  preferredContactMethod: z.string().default('email'),
  timeZone: z.string().optional(),
  advisorId: z.string().min(1, 'Advisor ID is required'),
  relationshipStartDate: z.string().default(() => new Date().toISOString()),
  firmClientId: z.string().optional(),
  secondaryAdvisors: z.array(z.string()).default([]),
  relationshipManager: z.string().optional(),
  causeAreas: z.array(z.string()).default([]),
  status: z.enum(['ACTIVE', 'PENDING', 'INACTIVE', 'ARCHIVED']).default('PENDING'),
});

export type CreateClientInput = z.infer<typeof createClientSchema>; 