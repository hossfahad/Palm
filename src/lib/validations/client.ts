import { z } from 'zod';

export const clientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  status: z.enum(['ACTIVE', 'PENDING', 'INACTIVE', 'ARCHIVED']).default('ACTIVE'),
  advisorId: z.string().min(1, 'Advisor ID is required'),
});

export type ClientFormData = z.infer<typeof clientSchema>; 