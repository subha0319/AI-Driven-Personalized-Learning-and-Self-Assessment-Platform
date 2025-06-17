import subprocess
from pdfminer.high_level import extract_text
import nltk
import string
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.tokenize import word_tokenize
from nltk import pos_tag
from nltk.corpus import stopwords
import ollama

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('stopwords')

def extract_text_from_pdf(pdf_path, start_page, end_page):
    text = extract_text(pdf_path, page_numbers=range(start_page - 1, end_page))
    return text

def preprocess_text(text):
    stop_words = set(stopwords.words('english'))
    text = text.lower()  
    text = text.translate(str.maketrans('', '', string.punctuation)) 
    words = word_tokenize(text)
    words = [word for word in words if word not in stop_words and len(word) > 2]  
    return ' '.join(words)

def extract_noun_keywords(text):
    words = word_tokenize(text)  
    pos_tags = pos_tag(words)  
    
    #(NN - singular noun, NNS - plural noun, NNP - proper noun)
    keywords = [word for word, tag in pos_tags if tag in ("NN", "NNS", "NNP", "NNPS")]
    
    return list(set(keywords)) 

def extract_tfidf_keywords(text, num_keywords=25):
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform([text])  

    feature_array = np.array(vectorizer.get_feature_names_out())
    tfidf_sorting = np.argsort(X.toarray()).flatten()[::-1]
    
    top_keywords = feature_array[tfidf_sorting][:num_keywords]
    
    return list(set(top_keywords))  

pdf_file_path = "Textbook3.pdf"
topic = "Interprocess Communication"
start_page_number = 146
end_page_number = 154

extracted_text = extract_text_from_pdf(pdf_file_path, start_page_number, end_page_number)

if extracted_text:
    print(f"Extracted text for topic '{topic}':\n")
    
    clean_text = preprocess_text(extracted_text)

    noun_keywords = extract_noun_keywords(clean_text)
    tfidf_keywords = extract_tfidf_keywords(clean_text, num_keywords=25)

    combined_keywords = list(set(noun_keywords + tfidf_keywords))  
    
    #final_keywords = filter_relevant_keywords(combined_keywords, topic)

    print("\nFiltered Relevant Keywords:", combined_keywords)

else:
    print("No text was extracted.")

response = ollama.chat(model="llama3.2", messages=[
    {"role": "system", "content": "You are an AI that extracts the most important keywords relevant to a topic."},
    {"role": "user", "content": f"Extract the most relevant  15 - 20 keywords and provide one line description of those keywords from the following text related to 'Interprocess Communication':\n\n{combined_keywords}"}
])

print(response['message']['content'])