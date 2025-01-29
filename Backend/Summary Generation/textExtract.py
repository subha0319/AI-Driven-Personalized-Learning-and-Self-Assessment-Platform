def extract_text(pdf_path, start_page, end_page):
    
    extracted_text = ""
    
    try:
        pdf_document = fitz.open(pdf_path)
        total_pages = pdf_document.page_count
        
        if start_page < 1 or end_page > total_pages:
            raise ValueError("Page numbers are out of range.")
        
        for page_num in range(start_page - 1, end_page):
            print(f"Processing page {page_num + 1}...")
            page = pdf_document[page_num]
            extracted_text += page.get_text()  
            
        print("Text extraction completed successfully.")
        return extracted_text
    
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
    
    finally:
        # Ensure the document is closed
        if 'pdf_document' in locals():
            pdf_document.close()