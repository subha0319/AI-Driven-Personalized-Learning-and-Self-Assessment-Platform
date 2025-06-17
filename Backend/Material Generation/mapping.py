import fitz  
from pdfminer.high_level import extract_text

# {id: "filename.pdf"}
textbooks = {}

# {topic: {"textbook_id": 1, "textbook": "Textbook1.pdf", "pages": [(start, end), (start, end)]}}
topic_mappings = {}

def add_textbook(filename):
    book_id = len(textbooks) + 1
    textbooks[book_id] = filename
    print(f"Added '{filename}' as Book ID: {book_id}")
    return book_id

def map_topic_to_textbook(book_id, topic):
    if book_id not in textbooks:
        print(f"Error: No textbook found with ID {book_id}.")
        return

    textbook_name = textbooks[book_id]
    doc = fitz.open(textbook_name)
    toc = doc.get_toc(simple=True)
    total_pages = doc.page_count

    for i, entry in enumerate(toc):
        level, title, start_page = entry
        title_parts = title.split()
        #print(title)
        cleaned_title = " ".join(title_parts[1:]) if len(title_parts) > 1 else title
        cleaned_title = cleaned_title.lower().strip()
        #print(cleaned_title)

        if cleaned_title.lower().strip() == topic.lower().strip():
            end_page = toc[i + 1][2] - 1 if i + 1 < len(toc) else total_pages

            # If topic already exists, append the new occurrence
            if cleaned_title in topic_mappings:
                topic_mappings[cleaned_title]["pages"].append((start_page, end_page))
            else:
                topic_mappings[cleaned_title] = {
                    "textbook_id": book_id,
                    "textbook": textbook_name,
                    "pages": [(start_page, end_page)]
                }

            print(f"Mapped '{topic}' to '{textbook_name}' (Book ID: {book_id}) from pages {start_page} to {end_page}")

    if topic.lower() not in topic_mappings:
        print(f"Topic '{topic}' not found in '{textbook_name}'.")


book1 = add_textbook("Textbook3.pdf")
book2 = add_textbook("Textbook4.pdf")
#print(textbooks)

map_topic_to_textbook(1, "Interprocess Communication")
map_topic_to_textbook(2, "Process Scheduling")

print(topic_mappings)

def extract_text_from_pdf(topic):
    """
    Extracts text for a given topic based on its mapped textbook and page range.
    """
    if topic.lower() not in topic_mappings:
        print(f"⚠️ Topic '{topic}' not found in mappings.")
        return None

    topic_info = topic_mappings[topic.lower()]
    pdf_path = topic_info["textbook"] 
    pages = topic_info["pages"] 

    extracted_text = ""

    for start_page, end_page in pages:
        text = extract_text(pdf_path, page_numbers=range(start_page - 1, end_page))
        extracted_text += text + "\n\n"

    return extracted_text
