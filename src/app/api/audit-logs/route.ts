import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { AuditEvent } from '@/lib/audit-logger';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  // Check if user has permission to create audit logs
  const authResponse = await withAuth(request, ['canManageUsers']);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  try {
    const event: AuditEvent = await request.json();

    // Validate the event data
    if (!event.eventType || !event.userId || !event.userRole) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store the audit log in the database
    await db.auditLog.create({
      data: {
        eventType: event.eventType,
        userId: event.userId,
        userRole: event.userRole,
        timestamp: event.timestamp,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        metadata: event.metadata || {},
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Check if user has permission to view audit logs
  const authResponse = await withAuth(request, ['canManageUsers']);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const userId = searchParams.get('userId');
    const eventType = searchParams.get('eventType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build the query filters
    const where = {
      ...(userId && { userId }),
      ...(eventType && { eventType }),
      ...(startDate && endDate && {
        timestamp: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
    };

    // Get total count for pagination
    const total = await db.auditLog.count({ where });

    // Get paginated results
    const logs = await db.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 