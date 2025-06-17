
import fitz  
import textstat

def extract_text_from_pdf(pdf_path):
    extracted_text = ""
    try:
        with fitz.open(pdf_path) as doc:
            for page_num in range(len(doc)):
                page = doc[page_num]
                extracted_text += page.get_text()  
        return extracted_text.strip()
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None

def readability_analysis(text):
    readability_scores = {
        "Flesch Reading Ease": textstat.flesch_reading_ease(text),
        "Flesch-Kincaid Grade Level": textstat.flesch_kincaid_grade(text),
        "Dale-Chall Readability Score": textstat.dale_chall_readability_score(text),
        "Gunning Fog Index": textstat.gunning_fog(text)
    }
    return readability_scores

pdf_path = "./ncert class 8.pdf" 
extracted_text = extract_text_from_pdf(pdf_path)

if extracted_text:
    print("\n=== Readability Analysis ===")
    readability_scores = readability_analysis(extracted_text)
    for score_name, score_value in readability_scores.items():
        print(f"{score_name}: {score_value:.2f}")
    
else:
    print("Failed to extract text from the PDF.")
