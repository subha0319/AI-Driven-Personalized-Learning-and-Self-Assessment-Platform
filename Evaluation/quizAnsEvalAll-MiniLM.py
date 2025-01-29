# -*- coding: utf-8 -*-
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load model
model = SentenceTransformer('all-MiniLM-L6-v2')

def evaluate_quizzes(content, quizzes, threshold=0.0):
    """
    Evaluate multiple quizzes to check if their correct answers align with the content.

    Parameters:
    - content: str, the educational content.
    - quizzes: list of dicts, where each dict contains:
        - "question": str, the quiz question.
        - "options": list of str, the options for the quiz.
        - "correct_answer_index": int, the index of the correct option in the options list.
    - threshold: float, minimum similarity value for an answer to be considered relevant.

    Returns:
    - results: list of dicts with quiz evaluation results.
    """
    # Encode the content once
    content_embedding = model.encode([content])

    results = []

    for quiz in quizzes:
        question = quiz["question"]
        options = quiz["options"]
        correct_answer_index = quiz["correct_answer_index"]

        # Encode options
        options_embeddings = model.encode(options)

        # Calculate similarity of all options with the content
        options_similarities = cosine_similarity(content_embedding, options_embeddings)[0]

        # Get correct answer similarity
        correct_similarity = options_similarities[correct_answer_index]

        # Check if the correct answer has the highest similarity
        max_similarity = max(options_similarities)
        is_correct_highest = correct_similarity == max_similarity

        # Check if it meets the threshold
        is_valid_correct_answer = is_correct_highest and correct_similarity >= threshold

        # Add result for this quiz
        results.append({
            "question": question,
            "correct_answer": options[correct_answer_index],
            "correct_similarity": correct_similarity,
            "all_options_similarities": options_similarities.tolist(),
            "is_valid_correct_answer": is_valid_correct_answer
        })

    return results

# Example inputs
content = (
    "An intelligent agent perceives its environment through sensors and acts upon that "
    "environment using actuators. A rational agent always acts to achieve the best possible outcome "
    "based on its knowledge and goals."
)

quizzes = [
    {
        "question": "What defines an intelligent agent in AI?",
        "options": [
            "A system that collects data",
            "A system that perceives and acts",
            "A robot that functions autonomously",
            "A neural network model"
        ],
        "correct_answer_index": 1  # Correct: "A system that perceives and acts"
    },
    {
        "question": "What is the role of a rational agent?",
        "options": [
            "To act randomly",
            "To always act based on goals",
            "To achieve the best possible outcome",
            "To learn from data"
        ],
        "correct_answer_index": 2  # Correct: "To achieve the best possible outcome"
    }
]

# Evaluate quizzes
results = evaluate_quizzes(content, quizzes)

# Print results
for idx, result in enumerate(results):
    print(f"Quiz {idx + 1}:")
    print(f"  Question: {result['question']}")
    print(f"  Correct Answer: {result['correct_answer']}")
    print(f"  Correct Answer Similarity: {result['correct_similarity']:.2f}")
    print(f"  All Options Similarities: {result['all_options_similarities']}")
    print(f"  Is Valid Correct Answer: {'Yes' if result['is_valid_correct_answer'] else 'No'}")
    print("-" * 50)