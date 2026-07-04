import sys
import os
from pypdf import PdfReader, PdfWriter

def compress_pdf(input_pdf, output_pdf, compression_level):
    try:
        reader = PdfReader(input_pdf)
        writer = PdfWriter()

        # Add all pages to the writer
        for page in reader.pages:
            writer.add_page(page)

        # Apply structural optimizations
        writer.compress_identical_objects(remove_duplicates=True, remove_unreferenced=True)

        # Apply content stream compression for medium and high levels
        if compression_level in ["medium", "high"]:
            for page in writer.pages:
                page.compress_content_streams()

        # For high compression, attempt image quality reduction if supported
        if compression_level == "high":
            for page in writer.pages:
                try:
                    for img in page.images:
                        img.replace(img.image, quality=60)
                except Exception as e:
                    # Fallback if image replacement fails
                    pass

        with open(output_pdf, "wb") as f:
            writer.write(f)

        print(f"SUCCESS: {output_pdf}")
    except Exception as e:
        print(f"ERROR: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python pdf_compress.py <input.pdf> <output.pdf> <level>")
        sys.exit(1)

    input_pdf = sys.argv[1]
    output_pdf = sys.argv[2]
    compression_level = sys.argv[3]

    if not os.path.exists(input_pdf):
        print(f"ERROR: Input file not found: {input_pdf}")
        sys.exit(1)

    compress_pdf(input_pdf, output_pdf, compression_level)
