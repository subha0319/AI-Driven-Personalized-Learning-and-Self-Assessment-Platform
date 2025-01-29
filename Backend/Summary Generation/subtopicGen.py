from sentence_transformers import SentenceTransformer, util
import numpy as np

def extract_relevant_content(subtopics, textbook, threshold=0.1):
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    # Split textbook into paragraphs or meaningful sections
    sections = textbook.split('\n\n')  # Assuming sections are separated by two newlines
    
    # Generate embeddings for subtopics and sections
    subtopic_embeddings = model.encode(subtopics, convert_to_tensor=True)
    section_embeddings = model.encode(sections, convert_to_tensor=True)
    
    relevant_content = {}
    
    for i, subtopic in enumerate(subtopics):
        similarities = util.pytorch_cos_sim(subtopic_embeddings[i], section_embeddings)[0]
        
        # Get indices of relevant sections based on threshold
        relevant_indices = np.where(similarities.numpy() > threshold)[0]
        relevant_sections = [sections[idx] for idx in relevant_indices]
        
        relevant_content[subtopic] = relevant_sections
    
    return relevant_content

# Example usage
subtopics = ["Reinforcement Learning", "Neural Networks", "Bayesian Networks"]
textbook = """
Reinforcement learning is a type of machine learning where an agent learns by interacting with an environment.

Neural networks are computational models inspired by the human brain, used in deep learning.

Decision trees are models used for classification and regression tasks.

Bayesian networks are probabilistic models that represent relationships between variables using graphs.
"""

result = extract_relevant_content(subtopics, textbook)
for topic, content in result.items():
    print(f"Subtopic: {topic}\nRelevant Content:")
    print("\n".join(content) if content else "No relevant content found")
    print("-"*50)
