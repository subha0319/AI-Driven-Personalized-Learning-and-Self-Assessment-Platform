import fitz  

# {id: "filename.pdf"}
textbooks = {}

# {topic: {"textbook_id": 1, "textbook": "Textbook1.pdf", "pages": [(start, end)]}}
topic_mappings = {}

def add_textbook(filename):
    book_id = len(textbooks) + 1
    textbooks[book_id] = filename
    print(f"Added '{filename}' as Book ID: {book_id}")
    return book_id

def analyze_toc_structure(toc):
    structure = {}
    last_level_1 = None
    last_level_2 = None

    for level, title, start_page in toc:
        #cleaned_title = " ".join(title.split()[1:]) if len(title.split()) > 1 else title
        cleaned_title = title.lower().strip()

        if level == 1:
            structure[cleaned_title] = {"subtopics": {}}
            last_level_1 = cleaned_title
        elif level == 2 and last_level_1:
            structure[last_level_1]["subtopics"][cleaned_title] = {"subtopics": {}}
            last_level_2 = cleaned_title
        elif level == 3 and last_level_1 and last_level_2:
            structure[last_level_1]["subtopics"][last_level_2]["subtopics"][cleaned_title] = {}

    return structure

def user_select_subtopics(subtopics):
    if not subtopics:
        return []

    print("\nSelect the subtopics needed:")
    for i, sub in enumerate(subtopics, 1):
        print(f"{i}. {sub}")

    selected_indices = input("Enter numbers separated by commas: ").split(",")
    selected_subtopics = [subtopics[int(i) - 1] for i in selected_indices if i.strip().isdigit() and 0 < int(i) <= len(subtopics)]

    return selected_subtopics

def map_topic_to_textbook(book_id):
    if book_id not in textbooks:
        print(f"Error: No textbook found with ID {book_id}.")
        return

    textbook_name = textbooks[book_id]
    doc = fitz.open(textbook_name)
    toc = doc.get_toc(simple=True)
    total_pages = doc.page_count

    toc_structure = analyze_toc_structure(toc)

    level1_topics = list(toc_structure.keys())
    selected_level1 = user_select_subtopics(level1_topics)

    final_selected_topics = []

    for level1 in selected_level1:
        level2_topics = list(toc_structure[level1]["subtopics"].keys())
        selected_level2 = user_select_subtopics(level2_topics)

        for level2 in selected_level2:
            level3_topics = list(toc_structure[level1]["subtopics"][level2]["subtopics"].keys())
            selected_level3 = user_select_subtopics(level3_topics)

            if selected_level3:
                final_selected_topics.extend(selected_level3)
            else:
                final_selected_topics.append(level2)

    for s_topic in final_selected_topics:
        for i, entry in enumerate(toc):
            level, title, start_page = entry
            cleaned_title = " ".join(title.split()[1:]) if len(title.split()) > 1 else title
            cleaned_title = cleaned_title.lower().strip()
            selected_topic = " ".join(s_topic.split()[1:]) if len(s_topic.split()) > 1 else s_topic
            selected_topic = selected_topic.lower().strip()
            
            
            if cleaned_title == selected_topic.lower().strip():
                end_page = toc[i + 1][2] - 1 if i + 1 < len(toc) else total_pages

                if cleaned_title in topic_mappings:
                    topic_mappings[cleaned_title]["pages"].append((start_page, end_page))
                else:
                    topic_mappings[cleaned_title] = {
                        "textbook_id": book_id,
                        "textbook": textbook_name,
                        "pages": [(start_page, end_page)]
                    }

                print(f"Mapped '{selected_topic}' to '{textbook_name}' (Book ID: {book_id}) from pages {start_page} to {end_page}")

book1 = add_textbook("Textbook3.pdf")
map_topic_to_textbook(1)

print(topic_mappings)
