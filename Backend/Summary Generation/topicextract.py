import fitz  # PyMuPDF

# Open the PDF file
doc = fitz.open("D:/Sem 8/Project Work 2/Sample textbooks/mastering-cloud-computing.pdf")

# View all attributes and methods of the doc object
#print(dir(doc))

# Extract the Table of Contents (TOC)
toc = doc.get_toc(simple=True)  # simple=True returns a flat list

# Get the total number of pages in the document
total_pages = doc.page_count

# Iterate through the TOC and print topic start and end pages
for i, entry in enumerate(toc):
    level, title, start_page = entry
    # For the last TOC entry, the end page is the last page of the document
    if i + 1 < len(toc):
        # The end page of a topic is the start page of the next topic minus 1
        end_page = toc[i + 1][2]
    else:
        # For the last entry, the end page is the last page of the document
        end_page = total_pages
    
    print(f"Level: {level}, Title: {title}, Start Page: {start_page}, End Page: {end_page}")




# import fitz  # PyMuPDF

# # Open the PDF file
# pdf_path = "D:/Sem 8/Project Work 2/Sample textbooks/computer-networking-a-top-down-approach-eigthnbsped.pdf"
# doc = fitz.open(pdf_path)

# # Function to extract links and their destinations
# def extract_topics_and_subtopics(doc):
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
                
#                 # Get the link's rect (area where the link is located)
#                 rect = link['from']
                
#                 # Extract the text near the link (this might represent a subtopic)
#                 text = page.get_text("text", clip=rect)  # Extract text within the link's area
#                 title = text.strip()
                
#                 # Append to the topics list
#                 topics.append({
#                     'title': title,
#                     'start_page': destination_page,  # Convert 0-based to 1-based page number
#                 })

#     return topics

# # Function to assign end pages to each topic
# def assign_end_pages(topics):
#     # We can assume the last page is the end page for the last topic
#     total_pages = len(doc)
    
#     # Iterate over topics and assign end page numbers
#     for i in range(len(topics) - 1):
#         topics[i]['end_page'] = topics[i + 1]['start_page']  # Ending page of the current topic
    
#     # The last topic will end on the last page of the document
#     topics[-1]['end_page'] = total_pages
    
#     return topics

# # Extract topics and their start pages
# topics = extract_topics_and_subtopics(doc)

# # Assign end pages
# topics_with_end_pages = assign_end_pages(topics)

# # Print topics with start and end pages
# for topic in topics_with_end_pages:
#     print(f"Title: {topic['title']}, Start Page: {topic['start_page']}, End Page: {topic['end_page']}")
