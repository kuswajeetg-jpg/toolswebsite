import sys
import os
import io
from pypdf import PdfReader, PdfWriter
from PIL import Image

def compress_pdf(input_pdf, output_pdf, compression_level):
    try:
        reader = PdfReader(input_pdf)
        writer = PdfWriter()

        # Add all pages to the writer
        for page in reader.pages:
            writer.add_page(page)

        # Apply structural optimizations (always do this)
        writer.compress_identical_objects(remove_duplicates=True, remove_unreferenced=True)

        # Apply content stream compression for medium and high levels
        if compression_level in ["medium", "high"]:
            for page in writer.pages:
                page.compress_content_streams()

        # Extreme compression (High compression / Low quality setting)
        if compression_level == "high":
            for page in writer.pages:
                # Use list of keys to avoid modification issues during iteration
                img_keys = list(page.images.keys())
                for img_key in img_keys:
                    try:
                        img = page.images[img_key]
                        pil_img = Image.open(io.BytesIO(img.data))
                        
                        # Downscale dimensions (e.g. max 600px width/height)
                        max_dim = 600
                        if pil_img.width > max_dim or pil_img.height > max_dim:
                            pil_img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
                        
                        # Convert to RGB mode if needed (JPEG doesn't support RGBA)
                        if pil_img.mode in ("RGBA", "P"):
                            # Create white background for transparent images
                            background = Image.new("RGB", pil_img.size, (255, 255, 255))
                            background.paste(pil_img, mask=pil_img.split()[3] if pil_img.mode == "RGBA" else None)
                            pil_img = background
                        
                        # Save with very low quality (extreme compression)
                        out_bytes = io.BytesIO()
                        pil_img.save(out_bytes, format="JPEG", quality=20)
                        
                        # Replace the image in pypdf
                        img.replace(pil_img, quality=20)
                    except Exception as e:
                        # Continue if an individual image fails to process
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
