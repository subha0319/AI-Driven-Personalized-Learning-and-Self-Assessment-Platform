from gensim import corpora
from gensim.models import LdaModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import spacy

# Load spacy model
nlp = spacy.load('en_core_web_sm')

# Preprocess documents (tokenize, remove stopwords, lemmatize)
def preprocess(text):
    doc = nlp(text)
    return [token.lemma_ for token in doc if not token.is_stop and not token.is_punct]

documents = ["Introduction to Artificial Intelligence:"
    "Artificial Intelligence (AI) refers to the field of computer science dedicated to creating systems capable of performing tasks that typically require human intelligence, such as understanding natural language, recognizing patterns, solving problems, and making decisions. The goal of AI is to develop machines that can simulate cognitive functions and act intelligently."

    "The State of the Art in AI:"
    "AI has made significant advancements in recent years, driven by developments in machine learning, neural networks, deep learning, and natural language processing. AI applications are now prevalent in various domains, including healthcare, finance, autonomous vehicles, robotics, and customer service. The state of the art is characterized by models that are capable of learning from vast amounts of data and making real-time decisions with high accuracy."

    "Intelligent Agents:"
    "An intelligent agent is any entity that can perceive its environment through sensors and take actions through actuators to achieve its goals. Intelligent agents can be as simple as a thermostat or as complex as self-driving cars. The key features of intelligent agents include perception, reasoning, and action. Intelligent agents can function autonomously, adapt to new situations, and improve their performance over time."

    "Rational Agent:"
    "In the context of AI, rationality refers to the ability of an agent to make decisions that maximize its expected performance based on its goals and the available information. A rational agent always chooses the action that is expected to lead to the best possible outcome. Rationality does not necessarily mean that an agent has to act in human-like ways, but rather that it acts in the best interest of achieving its objectives."

    "Nature of Environments:"
    "The environment in which an agent operates can vary in complexity, uncertainty, and changeability. The nature of the environment plays a crucial role in determining how the agent perceives the world and decides on actions. Environments can be:"

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
]  # List of documents
processed_docs = [preprocess(doc) for doc in documents]

# Create dictionary and corpus
dictionary = corpora.Dictionary(processed_docs)
corpus = [dictionary.doc2bow(text) for text in processed_docs]

# Build LDA model
lda_model = LdaModel(corpus, num_topics=5, id2word=dictionary, passes=15)

# Display the topics
topics = lda_model.print_topics(num_words=5)
for topic in topics:
    print(topic)

# User-specified topics
user_topics = [
    "Artificial Intelligence", #also referred as AI, will cosine similarity consider "AI" and "Artificial Intelligence" same or different?
    "Intelligent Agents",
    "Rational Agent",
    "Nature of Environments",
    "Structure of Agents"
]

# Preprocess user topics
processed_user_topics = [" ".join(preprocess(topic)) for topic in user_topics]

# Extract LDA topics
lda_topics = []
for topic_id, topic in lda_model.print_topics(num_words=5):
    lda_topic_keywords = " ".join([word.split("*")[1].strip().strip('"') for word in topic.split("+")])
    lda_topics.append(lda_topic_keywords)

# Combine LDA and user topics for vectorization
all_topics = processed_user_topics + lda_topics

# Vectorize topics using TF-IDF
vectorizer = TfidfVectorizer()
topic_vectors = vectorizer.fit_transform(all_topics)

# Calculate similarity scores
user_vectors = topic_vectors[:len(processed_user_topics)]
lda_vectors = topic_vectors[len(processed_user_topics):]

similarity_matrix = cosine_similarity(user_vectors, lda_vectors)

# Print similarity scores
print("Similarity Scores between User Topics and LDA Topics:")
for i, user_topic in enumerate(user_topics):
    print(f"User Topic: {user_topic}")
    for j, lda_topic in enumerate(lda_topics):
        print(f"  LDA Topic {j + 1}: {lda_topic} - Similarity: {similarity_matrix[i, j]:.2f}")