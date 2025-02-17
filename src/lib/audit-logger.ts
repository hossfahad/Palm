import { UserRole } from '@/types/auth';

export type AuditEventType = 
  | 'login'
  | 'logout'
  | 'password_reset'
  | 'failed_login'
  | 'role_change'
  | '2fa_enabled'
  | '2fa_disabled'
  | 'account_locked'
  | 'account_unlocked'
  | 'user_created'
  | 'user_deleted'
  | 'user_updated';

export interface AuditEvent {
  eventType: AuditEventType;
  userId: string;
  userRole: UserRole;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, unknown>;
}

class AuditLogger {
  private async logToDatabase(event: AuditEvent): Promise<void> {
    try {
      await fetch('/api/audit-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Implement fallback logging (e.g., to local storage or file)
    }
  }

  public async log(
    eventType: AuditEventType,
    userId: string,
    userRole: UserRole,
    request: Request,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const event: AuditEvent = {
      eventType,
      userId,
      userRole,
      timestamp: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      metadata,
    };

    await this.logToDatabase(event);
  }

  public async logAuthEvent(
    eventType: Extract<AuditEventType, 'login' | 'logout' | 'failed_login'>,
    userId: string,
    userRole: UserRole,
    request: Request,
    attempts?: number
  ): Promise<void> {
    await this.log(eventType, userId, userRole, request, { attempts });
  }

  public async logSecurityEvent(
    eventType: Extract<
      AuditEventType,
      'password_reset' | '2fa_enabled' | '2fa_disabled' | 'account_locked' | 'account_unlocked'
    >,
    userId: string,
    userRole: UserRole,
    request: Request,
    reason?: string
  ): Promise<void> {
    await this.log(eventType, userId, userRole, request, { reason });
  }

  public async logUserEvent(
    eventType: Extract<
      AuditEventType,
      'user_created' | 'user_deleted' | 'user_updated' | 'role_change'
    >,
    userId: string,
    userRole: UserRole,
    request: Request,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.log(eventType, userId, userRole, request, metadata);
  }
}

export const auditLogger = new AuditLogger(); 