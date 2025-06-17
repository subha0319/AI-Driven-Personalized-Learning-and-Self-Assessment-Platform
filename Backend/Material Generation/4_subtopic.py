import re
import ollama
from pdfminer.high_level import extract_text

def extract_text_from_pdf(pdf_path, start_page, end_page):
    text = extract_text(pdf_path, page_numbers=range(start_page - 1, end_page))
    return text

def extract_subtopics(text):
    """
    Extracts subtopics (like 3.4.1, 3.4.2) and their descriptions from the text.
    """
    # Regex to match subtopic numbers and titles (e.g., 3.4.1 Subtopic Title)
    subtopic_pattern = re.compile(r"(\d+\.\d+\.\d+)\s+([^\n]+)")

    matches = subtopic_pattern.finditer(text)
    subtopics = []

    last_index = None
    for match in matches:
        subtopic_number = match.group(1)  # e.g., 3.4.1
        subtopic_title = match.group(2)  # e.g., "Some Subtopic Title"
        start_index = match.start()

        # Assign description to the last subtopic (from last match to current match)
        if last_index is not None:
            subtopics[-1]["description"] = text[last_index:start_index].strip()

        # Append new subtopic
        subtopics.append({"subtopic": subtopic_number, "title": subtopic_title, "description": ""})
        last_index = start_index

    # Assign description for the last subtopic
    if subtopics:
        subtopics[-1]["description"] = text[last_index:].strip()

    return subtopics

def generate_summary(subtopics):
    """
    Uses Ollama (LLaMA model) to generate meaningful descriptions for each subtopic.
    """
    for sub in subtopics:
        prompt = f"Summarize the following content into a concise and meaningful description:\n\n{sub['description']}"
        response = ollama.chat(model='llama3.2', messages=[{"role": "user", "content": prompt}])
        sub["generated_summary"] = response['message']['content']

    return subtopics

pdf_file_path = "Textbook3.pdf"
topic = "Interprocess Communication"
start_page_number = 146
end_page_number = 154
summary_type = "brief" 

extracted_text = extract_text_from_pdf(pdf_file_path, start_page_number, end_page_number)

subtopic_data = extract_subtopics(extracted_text)

subtopic_data = generate_summary(subtopic_data)

for sub in subtopic_data:
    print(f"Subtopic: {sub['subtopic']} - {sub['title']}\nGenerated Summary: {sub['generated_summary']}\n")
