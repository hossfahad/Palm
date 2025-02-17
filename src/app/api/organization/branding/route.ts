import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { db } from '@/lib/db';
import { auditLogger } from '@/lib/audit-logger';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'organization');

export async function POST(request: NextRequest) {
  const authResponse = await withAuth(request, ['canManageUsers']);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  try {
    const formData = await request.formData();
    const logo = formData.get('logo') as File | null;
    const favicon = formData.get('favicon') as File | null;
    const settingsJson = formData.get('settings') as string;
    const settings = JSON.parse(settingsJson);

    // Create upload directory if it doesn't exist
    await writeFile(UPLOAD_DIR, '', { flag: 'a' });

    let logoPath: string | undefined;
    let faviconPath: string | undefined;

    // Handle logo upload
    if (logo) {
      const logoBuffer = Buffer.from(await logo.arrayBuffer());
      logoPath = join(UPLOAD_DIR, `logo.${logo.name.split('.').pop()}`);
      await writeFile(logoPath, logoBuffer);

      await auditLogger.logBrandingEvent(
        'logo_updated',
        request.headers.get('x-organization-id') || '',
        'admin',
        request,
        { fileName: logo.name }
      );
    }

    // Handle favicon upload
    if (favicon) {
      const faviconBuffer = Buffer.from(await favicon.arrayBuffer());
      faviconPath = join(UPLOAD_DIR, `favicon.${favicon.name.split('.').pop()}`);
      await writeFile(faviconPath, faviconBuffer);

      await auditLogger.logBrandingEvent(
        'favicon_updated',
        request.headers.get('x-organization-id') || '',
        'admin',
        request,
        { fileName: favicon.name }
      );
    }

    // Update organization settings in database
    const organization = await db.organization.update({
      where: { id: request.headers.get('x-organization-id') },
      data: {
        name: settings.organizationName,
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        useDarkMode: settings.useDarkMode,
        ...(logoPath && { logoUrl: `/uploads/organization/${logoPath}` }),
        ...(faviconPath && { faviconUrl: `/uploads/organization/${faviconPath}` }),
      },
    });

    // Log the branding update
    await auditLogger.logBrandingEvent(
      'branding_updated',
      organization.id,
      'admin',
      request,
      {
        organizationName: settings.organizationName,
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        useDarkMode: settings.useDarkMode,
      }
    );

    // Log theme update if dark mode setting changed
    if ('useDarkMode' in settings) {
      await auditLogger.logBrandingEvent(
        'theme_updated',
        organization.id,
        'admin',
        request,
        { useDarkMode: settings.useDarkMode }
      );
    }

    return NextResponse.json(organization);
  } catch (error) {
    console.error('Failed to update branding:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 