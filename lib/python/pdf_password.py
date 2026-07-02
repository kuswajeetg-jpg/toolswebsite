import sys
import os
from pypdf import PdfReader, PdfWriter

def process_pdf(input_pdf, output_pdf, mode, password):
    try:
        reader = PdfReader(input_pdf)
        writer = PdfWriter()

        if mode == "remove":
            if reader.is_encrypted:
                result = reader.decrypt(password)
                # pypdf decrypt returns password type: 0 = failed, 1 = user, 2 = owner
                if result == 0:
                    print("ERROR: Invalid password")
                    sys.exit(1)
            
            for page in reader.pages:
                writer.add_page(page)
                
            with open(output_pdf, "wb") as f:
                writer.write(f)
                
            print(f"SUCCESS: {output_pdf}")
            
        elif mode == "protect":
            if reader.is_encrypted:
                result = reader.decrypt(password)
                if result == 0:
                    print("ERROR: File is already encrypted. Please remove password first.")
                    sys.exit(1)
                    
            for page in reader.pages:
                writer.add_page(page)
                
            writer.encrypt(password)
            
            with open(output_pdf, "wb") as f:
                writer.write(f)
                
            print(f"SUCCESS: {output_pdf}")
            
        else:
            print(f"ERROR: Unknown mode {mode}")
            sys.exit(1)
            
    except Exception as e:
        print(f"ERROR: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: python pdf_password.py <input.pdf> <output.pdf> <mode> <password>")
        sys.exit(1)
    
    input_pdf = sys.argv[1]
    output_pdf = sys.argv[2]
    mode = sys.argv[3]
    password = sys.argv[4]
    
    if password == "ENV":
        password = os.environ.get("PDF_PASSWORD", "")
    
    if not os.path.exists(input_pdf):
        print(f"ERROR: Input file not found: {input_pdf}")
        sys.exit(1)
        
    process_pdf(input_pdf, output_pdf, mode, password)
