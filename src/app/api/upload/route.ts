import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { verifyUserRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await verifyUserRole(['TEACHER', 'ADMIN']);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized to upload files' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Read binary data
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const originalName = file.name || 'uploaded_resource.pdf';
    const ext = path.extname(originalName).toLowerCase() || '.pdf';
    const baseName = path.basename(originalName, ext)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-');

    const fileName = `${Date.now()}-${baseName}${ext}`;

    // Target upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: originalName,
      fileType: ext.replace('.', ''),
      sizeBytes: file.size,
    });
  } catch (error) {
    console.error('File Upload Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process file upload' }, { status: 500 });
  }
}
