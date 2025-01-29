import subprocess
import fitz  # PyMuPDF

def extract_text(pdf_path, start_page, end_page):
    """Extract text from the specified page range in a PDF."""
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
        if 'pdf_document' in locals():
            pdf_document.close()

def generate_educational_material(extracted_text, topic, model="llama3.2"):
    """Generate educational material using an LLM."""
    try:
        prompt = f"Explain {topic}\n{extracted_text}\n\n"
        result = subprocess.run(
            ["ollama", "run", model],
            input=prompt,
            text=True,
            capture_output=True,
            check=True,
            encoding="utf-8"
        )
        generated_material = result.stdout.strip()
        print("Educational material generated successfully.")
        return generated_material

    except subprocess.CalledProcessError as e:
        print(f"Error calling Ollama: {e}")
        return None

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

def save_to_pdf(content, output_file):
    """Save content to a PDF file."""
    try:
        doc = fitz.open()
        page = doc.new_page()  # Create a new page
        page.insert_text(fitz.Point(72, 72), content, fontsize=12)  # Insert text at coordinates (72, 72)
        doc.save(output_file)  # Save the PDF to the specified file
        print(f"Summary saved to {output_file}")
    except Exception as e:
        print(f"Error saving to PDF: {e}")

# Inputs
pdf_file_path = r"D:\Sem 8\Project Work 2\Sample textbooks\mastering-cloud-computing.pdf"
topic = "Cloud Computing"
start_page_number = 1
end_page_number = fitz.open(pdf_file_path).page_count

# Extract text
extracted_text = extract_text(pdf_file_path, start_page_number, end_page_number)

if extracted_text:
    print(f"Extracted text for topic '{topic}':\n")
    print(extracted_text)
else:
    print("No text was extracted.")

# Generate educational material
educational_material = generate_educational_material(extracted_text, topic)

if educational_material:
    print(f"Generated Educational Material for '{topic}':\n")
    print(educational_material)
    
    # Save the material to a PDF file
    output_pdf = f"{topic.replace(' ', '_')}_summary.pdf"
    save_to_pdf(educational_material, output_pdf)
else:
    print("Failed to generate educational material.")
