import subprocess
import fitz  # PyMuPDF
import yake
from pdfminer.high_level import extract_text

def extract_text_from_pdf(pdf_path, start_page, end_page):
    text = extract_text(pdf_path, page_numbers=range(start_page - 1, end_page))
    return text

def extract_keywords(text, num_keywords=10):
    keyword_extractor = yake.KeywordExtractor(n=1, top=num_keywords)  
    keywords = keyword_extractor.extract_keywords(text)
    return [kw[0] for kw in keywords]  

def generate_summary(extracted_text, topic, summary_type, model="llama3.2"):
    try:
        prompts = {
            "comprehensive": f"### Comprehensive Summary ###\nProvide a **detailed and structured** explanation of {topic}. Cover all key concepts, mechanisms, applications, and examples. Ensure a word count of **250-350 words**. Format the response in **paragraphs** with structured flow. \n\n{extracted_text}",
            
            "brief": f"summarise the main points '{topic}':\n\n{extracted_text}",

        }

        if summary_type not in prompts:
            print("Invalid summary type selected.")
            return None

        result = subprocess.run(
            ["ollama", "run", model],
            input=prompts[summary_type],
            text=True,
            capture_output=True,
            check=True,
            encoding="utf-8"
        )

        generated_summary = result.stdout.strip()
        print(f"{summary_type.capitalize()} Summary Generated Successfully.")
        return generated_summary

    except subprocess.CalledProcessError as e:
        print(f"Error calling Ollama: {e}")
        return None

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

pdf_file_path = r"D:\Sem 8\Project Work 2\Sample textbooks\Artificial Intelligence - A Modern Approach (3rd Edition).pdf"
topic = "Interprocess Communication"
start_page_number = 146
end_page_number = 154
summary_type = "brief" 

extracted_text = extract_text_from_pdf(pdf_file_path, start_page_number, end_page_number)

if extracted_text:
    #print(f"Extracted text for topic '{topic}':\n{extracted_text}\n")
    #keywords = extract_keywords(extracted_text, num_keywords=10)
    #print("Extracted Keywords:", keywords)
    generated_summary = generate_summary(extracted_text, topic, summary_type)
    

    if generated_summary:
        print(f"\nGenerated {summary_type.capitalize()} Summary for '{topic}':\n")
        print(generated_summary)
    else:
        print("Failed to generate summary.")
else:
    print("No text was extracted.")
    