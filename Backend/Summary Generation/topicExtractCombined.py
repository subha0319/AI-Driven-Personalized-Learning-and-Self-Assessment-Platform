import fitz  # PyMuPDF

# Function to extract topics from the TOC
def extract_topics_from_toc(doc):
    toc = doc.get_toc(simple=True)  # simple=True returns a flat list
    total_pages = doc.page_count
    topics = []
    
    print(f"Extracted TOC: {toc}")  # Debug: Show TOC

    for i, entry in enumerate(toc):
        level, title, start_page = entry
        if i + 1 < len(toc):
            end_page = toc[i + 1][2]
        else:
            end_page = total_pages
        
        topics.append({
            'title': title,
            'start_page': start_page,
            'end_page': end_page,
            'level': level  # Store the level of the TOC entry (main topic or subtopic)
        })
    
    return topics

# Function to check if TOC contains main topics (even if no subtopics exist)
def is_valid_toc(toc):
    main_topics = 0
    subtopics = 0

    # Count how many main topics and subtopics are there
    for entry in toc:
        level = entry[0]  # First element is the level (1 for main topic)
        if level == 1:
            main_topics += 1
        elif level >= 2:
            subtopics += 1
    
    # Debug: Check if the TOC is valid
    print(f"Main topics: {main_topics}, Subtopics: {subtopics}")  # Debug: Show topic count
    
    # The TOC is valid if we have at least one main topic (level 1), whether or not there are subtopics
    return main_topics > 0

# Function to extract topics using TOC or fallback to links
def extract_and_combine_topics(doc):
    # First try extracting from TOC
    toc_topics = extract_topics_from_toc(doc)
    
    # Check if TOC is valid (contains at least one main topic)
    if is_valid_toc(toc_topics):
        print("TOC topics extracted successfully and is valid.")
        return toc_topics
    else:
        print("TOC extraction failed or is incomplete. Falling back to extracting from internal links.")
        return extract_topics_from_links(doc)

# Function to extract topics from internal links (fallback option)
def extract_topics_from_links(doc):
    topics = []  # List to store topics and subtopics with page numbers

    # Loop through the pages to extract links
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)  # Load page by index
        links = page.get_links()  # Get all links on the page

        for link in links:
            if 'uri' in link:
                continue  # Skip external links (e.g., to a website)
            
            # Check if the link is internal (within the same PDF)
            if 'page' in link:
                destination_page = link['page']
                
                # Ensure the destination_page is an integer
                if isinstance(destination_page, str):
                    continue  # Skip if it's not an integer
                
                # Get the link's rect (area where the link is located)
                rect = link['from']
                
                # Extract the text near the link (this might represent a subtopic)
                text = page.get_text("text", clip=rect)  # Extract text within the link's area
                title = text.strip()
                
                # Append to the topics list
                topics.append({
                    'title': title,
                    'start_page': destination_page,  # 0-based page number
                })
    
    # Assign end pages
    return assign_end_pages(topics)

# Function to assign end pages to each topic
def assign_end_pages(topics):
    if not topics:
        return []

    total_pages = len(doc)
    
    # Iterate over topics and assign end page numbers
    for i in range(len(topics) - 1):
        topics[i]['end_page'] = topics[i + 1]['start_page']  # Ending page of the current topic
    
    # The last topic will end on the last page of the document
    topics[-1]['end_page'] = total_pages
    
    return topics

# Open the PDF file
pdf_path = "D:/Sem 8/Project Work 2/Sample textbooks/computer-networking-a-top-down-approach-eigthnbsped.pdf"
doc = fitz.open(pdf_path)

# Extract and combine topics
topics_with_end_pages = extract_and_combine_topics(doc)

# Print topics with start and end pages
for topic in topics_with_end_pages:
    print(f"Title: {topic['title']}, Start Page: {topic['start_page'] + 1}, End Page: {topic['end_page'] + 1}")





## import fitz  # PyMuPDF

# # Function to extract topics and subtopics using TOC
# def extract_topics_from_toc(doc):
#     toc = doc.get_toc(simple=True)  # simple=True returns a flat list
#     total_pages = doc.page_count
#     topics = []

#     for i, entry in enumerate(toc):
#         level, title, start_page = entry
#         if i + 1 < len(toc):
#             end_page = toc[i + 1][2]
#         else:
#             end_page = total_pages
        
#         # Add extracted topic to the list
#         topics.append({
#             'title': title,
#             'start_page': start_page,
#             'end_page': end_page
#         })
    
#     return topics

# # Function to extract topics and subtopics using internal links
# def extract_topics_from_links(doc):
#     topics = []  # List to store topics and subtopics with page numbers

#     # Loop through the pages to extract links
#     for page_num in range(len(doc)):
#         page = doc.load_page(page_num)  # Load page by index
#         links = page.get_links()  # Get all links on the page

#         for link in links:
#             if 'uri' in link:
#                 continue  # Skip external links (e.g., to a website)
            
#             # Check if the link is internal (within the same PDF)
#             if 'page' in link:
#                 destination_page = link['page']
                
#                 # Ensure the destination_page is an integer
#                 if isinstance(destination_page, str):
#                     continue  # Skip if it's not an integer
                
#                 # Get the link's rect (area where the link is located)
#                 rect = link['from']
                
#                 # Extract the text near the link (this might represent a subtopic)
#                 text = page.get_text("text", clip=rect)  # Extract text within the link's area
#                 title = text.strip()
                
#                 # Append to the topics list
#                 topics.append({
#                     'title': title,
#                     'start_page': destination_page,  # 0-based page number
#                 })
    
#     # Assign end pages
#     return assign_end_pages(topics)

# # Function to assign end pages to each topic
# def assign_end_pages(topics):
#     if not topics:
#         return []

#     total_pages = len(doc)
    
#     # Iterate over topics and assign end page numbers
#     for i in range(len(topics) - 1):
#         topics[i]['end_page'] = topics[i + 1]['start_page']  # Ending page of the current topic
    
#     # The last topic will end on the last page of the document
#     topics[-1]['end_page'] = total_pages
    
#     return topics

# # Main function to combine both methods
# def extract_and_combine_topics(doc):
#     # First try extracting from TOC
#     toc_topics = extract_topics_from_toc(doc)
    
#     # Check if TOC extracted both main topics and subtopics
#     if len(toc_topics) > 0:  # If TOC has topics
#         # We can consider the TOC as valid if it contains both main topics and subtopics
#         print("TOC topics extracted successfully.")
#         return toc_topics
#     else:
#         # If the TOC does not provide valid topics, fall back to extracting from links
#         print("TOC extraction failed. Falling back to extracting from internal links.")
#         return extract_topics_from_links(doc)


# # Open the PDF file
# pdf_path = "D:/Sem 8/Project Work 2/Sample textbooks/computer-networking-a-top-down-approach-eigthnbsped.pdf"
# doc = fitz.open(pdf_path)

# # Extract and combine topics
# topics_with_end_pages = extract_and_combine_topics(doc)

# # Print topics with start and end pages
# for topic in topics_with_end_pages:
#     print(f"Title: {topic['title']}, Start: {topic['start_page'] + 1}, End: {topic['end_page'] + 1}")
