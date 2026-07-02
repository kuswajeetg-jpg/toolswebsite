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

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create temp paths
    const tmpDir = os.tmpdir();
    const timestamp = Date.now();
    const inputPdfPath = path.join(tmpDir, `input_${timestamp}.pdf`);
    const outputDocxPath = path.join(tmpDir, `output_${timestamp}.docx`);

    // Write file to temp
    fs.writeFileSync(inputPdfPath, buffer);

    // Python script path
    const scriptPath = path.join(process.cwd(), 'lib', 'python', 'convert_pdf.py');

    // Run conversion
    const { stdout, stderr } = await execAsync(`python "${scriptPath}" "${inputPdfPath}" "${outputDocxPath}"`);

    if (!fs.existsSync(outputDocxPath)) {
       console.error("Conversion failed:", stderr);
       throw new Error("Conversion failed");
    }

    // Read the converted file
    const docxBuffer = fs.readFileSync(outputDocxPath);

    // Cleanup temp files
    try {
      fs.unlinkSync(inputPdfPath);
      fs.unlinkSync(outputDocxPath);
    } catch (e) {
      console.warn("Failed to cleanup temp files:", e);
    }

    // Return the file
    return new NextResponse(docxBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${file.name.replace('.pdf', '.docx')}"`,
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to convert PDF' }, { status: 500 });
  }
}
