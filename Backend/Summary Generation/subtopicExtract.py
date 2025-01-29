import fitz  # PyMuPDF

# Open the PDF document (use a raw string for file paths)
doc = fitz.open(r"D:\Sem 8\Project Work 2\Sample textbooks\Abraham-Silberschatz-Operating-System-Concepts-10th-2018.pdf")

# Get the Table of Contents (ToC)
toc = doc.get_toc()

# Search for the index entry and determine the start and end page
index_entry = None
next_entry_page = None

# Iterate through the ToC entries in reverse order (from the end of the book)
for i in range(len(toc)-1, -1, -1):
    item = toc[i]
    
    # If it's the "index", extract its start page
    level, title, start_page = item  # Unpack only 3 values: level, title, start_page
    
    # Check if the current entry contains 'index'
    if 'index' in title.lower():
        index_entry = item
        if i + 1 < len(toc):
            # If there's a next item, set the start page - 1 of the next item as the end page for the index
            next_entry_page = toc[i + 1][2]
        else:
            # If there's no next item, set the end page as the last page of the document
            next_entry_page = doc.page_count  # This is 1-based indexing
        break

# If the index is found, extract the content
if index_entry:
    # The start page is already extracted as start_page (1-based index)
    print(f"Index found starting on page {start_page}")

    # The end page is the next entry's start page (or last page of the document if no next entry)
    print(f"End page for index is {next_entry_page}")
    
    # Extract content from the index pages
    for page_num in range(start_page - 1, next_entry_page - 1):  # Convert to 0-based index
        page = doc.load_page(page_num)
        page_text = page.get_text("text")
        print(page_text)  # Or process this text as needed

else:
    print("Index not found in the Table of Contents")
