import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auditLogger } from '@/lib/audit-logger';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'organization');

export async function POST(request: NextRequest) {
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

    return NextResponse.json({ 
      success: true,
      settings: {
        ...settings,
        logoPath,
        faviconPath
      }
    });
  } catch (error) {
    console.error('Failed to update branding:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 