import sys
import os
from pdf2docx import Converter

def convert_pdf_to_docx(pdf_path, docx_path):
    try:
        cv = Converter(pdf_path)
        cv.convert(docx_path, start=0, end=None)
        cv.close()
        print(f"SUCCESS: {docx_path}")
    except Exception as e:
        print(f"ERROR: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert_pdf.py <input.pdf> <output.docx>")
        sys.exit(1)
    
    input_pdf = sys.argv[1]
    output_docx = sys.argv[2]
    
    if not os.path.exists(input_pdf):
        print(f"ERROR: Input file not found: {input_pdf}")
        sys.exit(1)
        
    convert_pdf_to_docx(input_pdf, output_docx)
