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

def get_subtopics(toc, topic, topic_level):
    subtopics = []
    topic_found = False

    for i, entry in enumerate(toc):
        level, title, start_page = entry
        #cleaned_title = " ".join(title.split()[1:]) if len(title.split()) > 1 else title
        cleaned_title = title.lower().strip()

        if cleaned_title == topic.lower():
            topic_found = True
            continue  

        if topic_found and level == topic_level + 1:  
            subtopics.append(cleaned_title)
        elif topic_found and level <= topic_level: 
            break

    return subtopics

def user_select_subtopics(subtopics):
    if not subtopics:
        return []

    print("\nSelect the subtopics needed:")
    for i, sub in enumerate(subtopics, 1):
        print(f"{i}. {sub}")

    selected_indices = input("Enter numbers separated by commas: ").split(",")
    selected_subtopics = [subtopics[int(i) - 1] for i in selected_indices if i.strip().isdigit() and 0 < int(i) <= len(subtopics)]

    return selected_subtopics

def map_topic_to_textbook(book_id, topic):
    if book_id not in textbooks:
        print(f"Error: No textbook found with ID {book_id}.")
        return

    textbook_name = textbooks[book_id]
    doc = fitz.open(textbook_name)
    toc = doc.get_toc(simple=True)
    total_pages = doc.page_count

    topic_level = None
    for i, entry in enumerate(toc):
        level, title, start_page = entry
        #cleaned_title = " ".join(title.split()[1:]) if len(title.split()) > 1 else title
        cleaned_title = title.lower().strip()

        if cleaned_title == topic.lower():
            topic_level = level
            break

    if topic_level is None:
        print(f"Topic '{topic}' not found in '{textbook_name}'.")
        return

    final_selected_topics = []

    if topic_level == 1:
        level2_subtopics = get_subtopics(toc, topic, topic_level)
        selected_level2 = user_select_subtopics(level2_subtopics)

        for level2_topic in selected_level2:
            level3_subtopics = get_subtopics(toc, level2_topic, 2)
            selected_level3 = user_select_subtopics(level3_subtopics)

            if selected_level3:
                final_selected_topics.extend(selected_level3)
            else:
                final_selected_topics.append(level2_topic)
    
    elif topic_level == 2:
        level3_subtopics = get_subtopics(toc, topic, topic_level)
        selected_level3 = user_select_subtopics(level3_subtopics)
        
        if selected_level3:
            final_selected_topics.extend(selected_level3)
        else:
            final_selected_topics.append(topic)

    else:
        final_selected_topics.append(topic)

    for s_topic in final_selected_topics:
        for i, entry in enumerate(toc):
            level, title, start_page = entry
            cleaned_title = " ".join(title.split()[1:]) if len(title.split()) > 1 else title
            cleaned_title = cleaned_title.lower().strip()
            selected_topic = " ".join(s_topic.split()[1:]) if len(s_topic.split()) > 1 else s_topic
            selected_topic = selected_topic.lower().strip()

            if cleaned_title == selected_topic.lower():
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

map_topic_to_textbook(1, "chapter 3 processes")
print(topic_mappings)
