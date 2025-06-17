from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

@app.route('/')
def home():
    return "Flask server is running!"

# MongoDB Connection 
MONGO_URI = <MongoDB connection URL> # replace <MongoDB connection URL> with your connection URL
client = MongoClient(MONGO_URI)
db = client["ai_based_learning"]
quizzes_collection = db["quizzes"]
quiz_history_collection = db["quiz_history"]  # New collection for quiz history

summaries_collection = db["summaries"]

@app.route('/generate-summary', methods=['POST'])
def generate_summary():
    # Get data from the request
    data = request.json
    
    # Extract required parameters
    subject = data.get('subject', '')
    unit_number = data.get('unitNumber', '')
    pdf_file_path = data.get('pdfPath', 'Textbook3.pdf')  # Default for now as mentioned
    topic = data.get('topic', '')
    start_page = int(data.get('startPage', 1))
    end_page = int(data.get('endPage', 1))
    summary_type = data.get('summaryType', 'brief')
    
    # Extract text from PDF (assuming PDF is on server)
    extracted_text = bc.extract_text_from_pdf(pdf_file_path, start_page, end_page)
    
    if extracted_text:
        # Generate summary using your existing function
        generated_summary = bc.generate_summary(extracted_text, topic, summary_type)
        
        if generated_summary:
            return jsonify({
                'success': True,
                'summary': generated_summary,
                'topic': topic,
                'summaryType': summary_type
            })
        else:
            return jsonify({'success': False, 'error': 'Failed to generate summary'}), 500
    else:
        return jsonify({'success': False, 'error': 'No text was extracted from the PDF'}), 500

@app.route("/debug_quiz_count", methods=["GET"])
def debug_quiz_count():
    """Debug endpoint to check if quizzes have the correct number of questions."""
    topic = request.args.get('topic')
    if not topic:
        return jsonify({"error": "Topic parameter is required"}), 400
    
    # Get all quizzes for this topic
    all_quizzes = list(quizzes_collection.find({"pdf_name": f"{topic}.pdf"}))
    
    result = []
    for quiz in all_quizzes:
        # Count the actual questions in the quiz text
        quiz_text = quiz.get("quiz_text", "")
        question_count = quiz_text.count("Q")  # Simple count of Q markers
        
        result.append({
            "stored_question_count": quiz.get("num_questions"),
            "actual_question_count": question_count,
            "quiz_preview": quiz_text[:100] + "..." if quiz_text else "No quiz text"
        })
    
    return jsonify({"quizzes": result})

@app.route("/get_quiz", methods=["GET"])
def get_quiz():
    topic = request.args.get('topic')
    question_count = int(request.args.get('question_count', 3))  # Default to 3 if not provided
    
    if not topic:
        return jsonify({"error": "Topic parameter is required"}), 400
        
    # Validate question count
    if question_count < 1 or question_count > 10:
        return jsonify({"error": "Question count must be between 1 and 10"}), 400
    
    # Find quiz in database
    quiz = quizzes_collection.find_one({"pdf_name": f"{topic}.pdf", "num_questions": question_count})
    
    if quiz:
        return jsonify({"quiz_text": quiz["quiz_text"]})
    else:
        # If no quiz with the exact question count exists, try to find any quiz for the topic
        fallback_quiz = quizzes_collection.find_one({"pdf_name": f"{topic}.pdf"})
        if fallback_quiz:
            return jsonify({"quiz_text": fallback_quiz["quiz_text"],
                           "note": "Requested question count not available, using default quiz"})
        else:
            return jsonify({"error": "Quiz not found for the specified topic"}), 404

@app.route('/save_quiz_result', methods=['POST'])
def save_quiz_result():
    """Saves the quiz result to the history collection."""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Required fields
    required_fields = ["subject", "unit", "topic", "score", "totalQuestions"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
        
    # Add question count if not provided
    if 'question_count' not in data:
        data['question_count'] = data['totalQuestions']
    
    # Create history record
    history_record = {
        "subject": data["subject"],
        "unit": data["unit"],
        "topic": data["topic"],
        "score": data["score"],
        "totalQuestions": data["totalQuestions"],
        "date": datetime.now()
    }
    
    # Insert into database
    result = quiz_history_collection.insert_one(history_record)
    
    return jsonify({"success": True, "id": str(result.inserted_id)}), 201

@app.route("/get_quiz_history", methods=["GET"])
def get_quiz_history():
    """Fetches quiz history data."""
    # Optional filtering by subject
    subject = request.args.get("subject")
    
    # Create the filter
    filter_query = {}
    if subject:
        filter_query["subject"] = subject
    
    # Fetch the data
    history_data = list(quiz_history_collection.find(filter_query, {"_id": 0}))
    
    # Convert date objects to strings
    for record in history_data:
        if "date" in record:
            record["date"] = record["date"].strftime("%b %d, %Y")
    
    # Group by subject for better frontend organization
    subjects = {}
    for record in history_data:
        subject = record["subject"]
        if subject not in subjects:
            subjects[subject] = []
        subjects[subject].append(record)
    
    return jsonify({"success": True, "data": subjects}), 200

if __name__ == "__main__":
    app.run(debug=True)