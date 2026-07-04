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
        # Note: pypdf 6.x uses remove_identicals and remove_orphans parameters
        try:
            writer.compress_identical_objects(remove_identicals=True, remove_orphans=True)
        except (TypeError, AttributeError):
            # Fallback for other pypdf versions
            try:
                writer.compress_identical_objects(remove_duplicates=True, remove_unreferenced=True)
            except Exception:
                pass

        # Compress content streams
        for page in writer.pages:
            try:
                page.compress_content_streams()
            except Exception:
                pass

        # Define quality and max dimension settings for image compression on each level
        # Low: High Quality (slight compression)
        # Medium: Medium Quality (perfect balance)
        # High: Extreme Compression (smallest size)
        settings = {
            "low": {"max_dim": 1600, "quality": 75},
            "medium": {"max_dim": 1000, "quality": 50},
            "high": {"max_dim": 600, "quality": 20}
        }
        
        cfg = settings.get(compression_level, settings["medium"])

        # Perform image downsampling and compression
        for page in writer.pages:
            img_keys = list(page.images.keys())
            for img_key in img_keys:
                try:
                    img = page.images[img_key]
                    pil_img = Image.open(io.BytesIO(img.data))
                    
                    # Check if resize is needed
                    max_dim = cfg["max_dim"]
                    if pil_img.width > max_dim or pil_img.height > max_dim:
                        pil_img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
                    
                    # Convert to RGB mode if needed (JPEG does not support transparency/RGBA)
                    if pil_img.mode in ("RGBA", "P"):
                        background = Image.new("RGB", pil_img.size, (255, 255, 255))
                        background.paste(pil_img, mask=pil_img.split()[3] if pil_img.mode == "RGBA" else None)
                        pil_img = background
                    
                    # Compress and replace
                    img.replace(pil_img, quality=cfg["quality"])
                except Exception as e:
                    # Proceed if an individual image fails to compress
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
