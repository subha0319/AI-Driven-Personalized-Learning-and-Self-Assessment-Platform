import fitz  # PyMuPDF
import subprocess
import random

def extract_toc(pdf_path):
    """Extract the Table of Contents (TOC) from a PDF."""
    try:
        doc = fitz.open(pdf_path)
        toc = doc.get_toc()
        doc.close()
        
        # Extract chapter titles from TOC
        topics = [entry[1] for entry in toc if len(entry) == 3]
        return topics
    except Exception as e:
        print(f"Error extracting TOC from {pdf_path}: {e}")
        return []

def generate_syllabus(topics, num_units=5):
    """Organize extracted topics into a structured syllabus with 5 units."""
    random.shuffle(topics)  # Randomly shuffle topics for distribution
    units = {f"Unit {i+1}": [] for i in range(num_units)}
    
    for i, topic in enumerate(topics):
        unit_index = i % num_units
        units[f"Unit {unit_index+1}"].append(topic)
    
    return units

def refine_syllabus_with_llama(syllabus, model="llama3.2"):
    """Use Meta LLaMA to refine and format the syllabus."""
    prompt = f"""
    Given the following list of topics, frame a well-structured syllabus with 5 units:
    {syllabus}
    Ensure each unit has multiple relevant topics and the structure is logical.
    """
    try:
        result = subprocess.run(
            ["ollama", "run", model],
            input=prompt,
            text=True,
            capture_output=True,
            check=True,
            encoding="utf-8"
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error calling LLaMA: {e}")
        return syllabus

# Example usage
pdf_paths = [
    r"D:\Sem 8\Project Work 2\Sample textbooks\computer-networking-a-top-down-approach-eigthnbsped.pdf",
    r"D:\Sem 8\Project Work 2\Sample textbooks\computer-networks-a-systems-approach.pdf"
]
all_topics = []

for pdf in pdf_paths:
    topics = extract_toc(pdf)
    all_topics.extend(topics)

if all_topics:
    syllabus = generate_syllabus(all_topics)
    refined_syllabus = refine_syllabus_with_llama(syllabus)
    print("Generated Syllabus:")
    print(refined_syllabus)
else:
    print("No topics extracted from PDFs.")
