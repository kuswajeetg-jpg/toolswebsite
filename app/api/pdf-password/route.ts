import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import os from 'os';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const mode = formData.get('mode') as string | null;
    const password = formData.get('password') as string | null;

    if (!file || !mode || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create temp paths
    const tmpDir = os.tmpdir();
    const timestamp = Date.now();
    const inputPdfPath = path.join(tmpDir, `input_pwd_${timestamp}.pdf`);
    const outputPdfPath = path.join(tmpDir, `output_pwd_${timestamp}.pdf`);

    // Write file to temp
    fs.writeFileSync(inputPdfPath, buffer);

    // Python script path
    const scriptPath = path.join(process.cwd(), 'lib', 'python', 'pdf_password.py');

    // Run conversion, pass password via env var to prevent shell injection
    const env = { ...process.env, PDF_PASSWORD: password };
    
    let stdout, stderr;
    try {
        const result = await execAsync(`python3 "${scriptPath}" "${inputPdfPath}" "${outputPdfPath}" "${mode}" "ENV"`, { env });
        stdout = result.stdout;
        stderr = result.stderr;
    } catch (e: any) {
        stdout = e.stdout || "";
        stderr = e.stderr || e.message || "";
    }

    if (!fs.existsSync(outputPdfPath)) {
       console.error("Processing failed:", stderr, stdout);
       if (stdout.includes("ERROR: Invalid password")) {
           return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
       }
       throw new Error("Processing failed");
    }

    // Read the processed file
    const pdfBuffer = fs.readFileSync(outputPdfPath);

    // Cleanup temp files
    try {
      fs.unlinkSync(inputPdfPath);
      fs.unlinkSync(outputPdfPath);
    } catch (e) {
      console.warn("Failed to cleanup temp files:", e);
    }

    // Return the file
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${file.name}"`,
      },
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process PDF' }, { status: 500 });
  }
}
