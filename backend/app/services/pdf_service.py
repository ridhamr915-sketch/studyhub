import os
import io
from typing import Dict, Any, Optional
from pypdf import PdfReader

class PDFExtractionService:
    @staticmethod
    def extract_text(file_path_or_bytes, file_name: str = "") -> Dict[str, Any]:
        """
        Extracts clean text and metadata from PDF or text files.
        Returns a dict containing text, page_count, and formatted content with page markers.
        """
        ext = os.path.splitext(file_name)[1].lower() if file_name else ""
        
        # Handle plain text files directly
        if ext in [".txt", ".md", ".csv", ".json"]:
            if isinstance(file_path_or_bytes, (bytes, bytearray)):
                content = file_path_or_bytes.decode("utf-8", errors="ignore")
            elif isinstance(file_path_or_bytes, str) and os.path.exists(file_path_or_bytes):
                with open(file_path_or_bytes, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
            else:
                content = str(file_path_or_bytes)
                
            return {
                "success": True,
                "text": content,
                "page_count": 1,
                "pages": [{"page_num": 1, "text": content}]
            }

        # Handle PDF files
        try:
            if isinstance(file_path_or_bytes, (bytes, bytearray)):
                stream = io.BytesIO(file_path_or_bytes)
                reader = PdfReader(stream)
            elif isinstance(file_path_or_bytes, str) and os.path.exists(file_path_or_bytes):
                reader = PdfReader(file_path_or_bytes)
            else:
                return {
                    "success": False,
                    "error": "Invalid file input or file does not exist",
                    "text": "",
                    "page_count": 0,
                    "pages": []
                }
            
            pages_data = []
            full_text_parts = []
            
            for idx, page in enumerate(reader.pages):
                page_text = page.extract_text() or ""
                # Clean up whitespace
                cleaned_page = "\n".join([line.strip() for line in page_text.splitlines() if line.strip()])
                pages_data.append({
                    "page_num": idx + 1,
                    "text": cleaned_page
                })
                full_text_parts.append(f"--- [Page {idx + 1}] ---\n{cleaned_page}")
                
            full_text = "\n\n".join(full_text_parts).strip()
            
            if not full_text:
                full_text = f"Document '{file_name}' contains {len(reader.pages)} pages, but contains mostly scanned images or non-selectable text."

            return {
                "success": True,
                "text": full_text,
                "page_count": len(reader.pages),
                "pages": pages_data
            }

        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to extract text from document: {str(e)}",
                "text": "",
                "page_count": 0,
                "pages": []
            }

pdf_service = PDFExtractionService()
