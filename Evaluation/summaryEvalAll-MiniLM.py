from sentence_transformers import SentenceTransformer, util

# Load the pre-trained model
model = SentenceTransformer('all-MiniLM-L6-v2')
#other models: paraphrase-distilroberta-base-v1, paraphrase-MiniLM-L6-v2

# User-provided topics
user_topics = [
    "What is Artificial Intelligence?", 
    "Intelligent Agents", 
    "Rational Agent", 
    "Nature of Environments", 
    "Structure of Agents"
]

# Generated materials for each topic
generated_materials = [
    "Artificial Intelligence refers to the field of computer science dedicated to creating systems capable of performing tasks that require human intelligence.",
    "An intelligent agent perceives its environment and takes actions to achieve its goals. Examples include thermostats and self-driving cars.",
    "A rational agent is an entity that makes decisions to maximize performance based on available information.",
    "The nature of environments determines how agents perceive and decide on actions. Environments can be static or dynamic, deterministic or stochastic.",
    "The structure of agents includes sensors for perception, actuators for actions, and mechanisms for reasoning and decision-making."
]

# Compute embeddings for topics and content
topic_embeddings = model.encode(user_topics, convert_to_tensor=True)
content_embeddings = model.encode(generated_materials, convert_to_tensor=True)

# Calculate similarity between each topic and its corresponding content
threshold = 0.7  # Similarity threshold
results = []

for i, topic in enumerate(user_topics):
    similarity = util.cos_sim(topic_embeddings[i], content_embeddings[i]).item()
    is_covered = similarity >= threshold
    results.append({
        "Topic": topic,
        "Similarity": similarity,
        "Is Covered": is_covered
    })

# Print results
for result in results:
    print(f"Topic: {result['Topic']}")
    print(f"Similarity: {result['Similarity']:.2f}")
    print(f"Is Covered: {'Yes' if result['Is Covered'] else 'No'}")
    print("-" * 50)

# Check if all topics are sufficiently covered
all_topics_covered = all(result["Is Covered"] for result in results)
if all_topics_covered:
    print("All topics are sufficiently explained in the generated content.")
else:
    print("Some topics are not sufficiently explained in the generated content.")
