import nltk
from nltk.corpus import wordnet
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Download WordNet data if not already done
#nltk.download('wordnet')

# Function to replace synonyms or standardize terms
def expand_synonyms(text_list):
    standardized_texts = []
    for text in text_list:
        words = text.split()
        expanded_words = []
        for word in words:
            # Find synonyms using WordNet
            synonyms = wordnet.synsets(word)
            if synonyms:
                # Use the most common synonym's lemma name
                expanded_word = synonyms[0].lemmas()[0].name().replace("_", " ")
            else:
                expanded_word = word
            expanded_words.append(expanded_word)
        standardized_texts.append(" ".join(expanded_words))
    return standardized_texts


# Example user input (topics) and extracted text from the textbook
user_topics = [
    "Artificial Intelligence", #also referred as AI, will cosine similarity consider "AI" and "Artificial Intelligence" same or different?
    "The state of art",
    "Intelligent Agents",
    "Rational Agent",
    "Nature of Environments",
    "Structure of Agents"
]

# Example textbook content (a single paragraph containing explanations for all topics)
textbook_content = [
    "Introduction to Artificial Intelligence"
    "Artificial Intelligence (AI) refers to the field of computer science dedicated to creating systems capable of performing tasks that typically require human intelligence, such as understanding natural language, recognizing patterns, solving problems, and making decisions. The goal of AI is to develop machines that can simulate cognitive functions and act intelligently."

    "The State of the Art in AI:"
    "AI has made significant advancements in recent years, driven by developments in machine learning, neural networks, deep learning, and natural language processing. AI applications are now prevalent in various domains, including healthcare, finance, autonomous vehicles, robotics, and customer service. The state of the art is characterized by models that are capable of learning from vast amounts of data and making real-time decisions with high accuracy."

    "Intelligent Agents:"
    "An intelligent agent is any entity that can perceive its environment through sensors and take actions through actuators to achieve its goals. Intelligent agents can be as simple as a thermostat or as complex as self-driving cars. The key features of intelligent agents include perception, reasoning, and action. Intelligent agents can function autonomously, adapt to new situations, and improve their performance over time."

    "Rational Agent:"
    "In the context of AI, rationality refers to the ability of an agent to make decisions that maximize its expected performance based on its goals and the available information. A rational agent always chooses the action that is expected to lead to the best possible outcome. Rationality does not necessarily mean that an agent has to act in human-like ways, but rather that it acts in the best interest of achieving its objectives."

    "Nature of Environments:"
    "The environment in which an agent operates can vary in complexity, uncertainty, and changeability. The nature of the environment plays a crucial role in determining how the agent perceives the world and decides on actions. Environments can be:"+

    "Fully Observable vs. Partially Observable: Whether the agent has access to complete or partial information."
    "Deterministic vs. Stochastic: Whether the outcome of actions is predictable or probabilistic."
    "Static vs. Dynamic: Whether the environment changes while the agent is making decisions."
    "Discrete vs. Continuous: Whether the environment is composed of distinct states or operates on continuous variables."
    "Structure of Agents:"
    "The structure of intelligent agents involves several components that work together to achieve the agent's goals. The key components include:"

    "Sensors: These allow the agent to perceive the environment."
    "Actuators: These allow the agent to perform actions in the environment."
    "Reasoning Mechanism: This is responsible for decision-making, which can be based on logic, rules, or learning algorithms."
    "Performance Measure: This quantifies the success of an agent's actions in achieving its goals."
    "Knowledge Base: The information the agent uses to understand the environment and make decisions."
    "Conclusion:"
    "The first unit of AI introduces the foundational concepts that define intelligent systems. It highlights the importance of intelligent agents, rational decision-making, and understanding the environment in which these agents operate. Understanding these concepts provides the groundwork for building more advanced AI systems capable of tackling real-world problems."
]

# Replace synonyms in user_topics and textbook_content
# user_topics = [topic.replace("AI", "Artificial Intelligence") for topic in user_topics]
# textbook_content = [content.replace("AI", "Artificial Intelligence") for content in textbook_content]

textbook_content = expand_synonyms(textbook_content)

# Initialize TF-IDF vectorizer
vectorizer = TfidfVectorizer()

# Combine user topics and the textbook content into a single list
all_text = user_topics + textbook_content

# Vectorize the text
tfidf_matrix = vectorizer.fit_transform(all_text)

# Compute cosine similarity between each user topic and the textbook content
cosine_similarities = []
for i in range(len(user_topics)):
    similarity_score = cosine_similarity(tfidf_matrix[i:i+1], tfidf_matrix[len(user_topics):len(user_topics)+1])
    cosine_similarities.append(similarity_score[0][0])

# Calculate the average similarity score
average_similarity = sum(cosine_similarities) / len(cosine_similarities)

# Output the individual similarity scores and the average similarity
for i, score in enumerate(cosine_similarities):
    print(f"Similarity between '{user_topics[i]}' and textbook content: {score:.4f}")
print(f"Average similarity score: {average_similarity:.4f}")
