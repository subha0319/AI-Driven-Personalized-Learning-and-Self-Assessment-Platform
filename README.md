# AI-Driven Personalized Learning and Self-Assessment Platform

## 📌 Overview

This platform automates the creation of syllabus-aligned educational content and personalized assessments using AI. With a focus on scalability and performance, it streamlines the generation of learning materials and MCQs from textbook PDFs and curriculum documents. The system also provides performance evaluation, feedback, and remedial quizzes to improve users' performance.

## 📁 Project Directory Structure
    
    AI-Driven-Personalized-Learning-and-Self-Assessment-Platform/
    │
    ├── Frontend/
    │   ├── index.html
    │   ├── generate-materials.html
    │   ├── materials-generated.html
    │   ├── take-quiz.html
    │   ├── quiz-result.html
    │   ├── quiz-history.html
    │   ├── styles.css
    │   └── script.js
    │
    ├── Backend/
    │   ├── DBConnections/
    │   │   ├── app.py
    │   │   └── database.py
    │   ├── Material Generation/
    │   │   ├── 1_2_Comprehensive_Brief.py
    │   │   ├── 3_keyword_NLP.py
    │   │   ├── 4_Subtopic.py
    │   │   ├── 5_SubtopicElimination.py
    │   │   ├── mapping.py
    │   │   └── SelectTopics.py
    │   ├── Quiz Generation/
    │   │   ├── quiz_gen.py
    │   │   └── quiz_output.txt
    │   ├── Syllabus generation/
    │   │   └── syllabusGen.py
    │   └── content_processor.log
    │
    ├── Evaluation/
    │   ├── BERT quiz.py
    │   ├── cosine similarity.py
    │   ├── LDA.py
    │   ├── Simple LDA.py
    │   ├── summaryEvalAll-MiniLM.py
    │   ├── quizAnsEvalAll-MiniLM.py
    │   ├── readabilityscores.py
    │   └── readabilityvisualization.py
    │
    └── README.md

## 🚀 Features

### Automated Material Generation:

- Extracts content from textbooks (PDF) and syllabus files.

- Generates summaries: Comprehensive, Brief, Keywords, Subtopics.

### Quiz Generation and Evaluation:

- AI-based generation of MCQs based on summarized content.

- Instant evaluation of student answers.

- Correct answers and scoring with weak-topic tracking.

### Evaluation Layer:

- Semantic alignment using Sentence Transformers and MiniLM.

- Readability evaluation using Flesch Reading Ease, Dale-Chall, Gunning Fog, and Flesch-Kincaid metrics.

### Personalized Learning Path:

- Tracks quiz history, weak topics.

- Generates remedial content and follow-up assessments.

### 🛠️ Tech Stack

- Backend: Flask (Python), PyMongo

- Database: MongoDB Atlas (Collections: users, summaries, quizzes, user_attempts, quiz_history, weak_topics)

- Frontend: HTML, CSS, JavaScript

- AI Models & Libraries: Meta LLaMA, Sentence Transformers, ReportLab, Fitz, Ollama

## 🏗️ System Architecture

![AI based learning and assessment platform system architecture](https://github.com/user-attachments/assets/7c08e94b-d8d4-4326-8632-c497f3cb1e2f)


## 📦 Installation

    git clone https://github.com/subha0319/AI-Driven-Personalized-Learning-and-Self-Assessment-Platform.git
    
    cd Backend/DBConnections
    
    pip install -r requirements.txt
    
    python app.py

## 🧪 API Endpoints

- POST /generate-summary

Generate and store summaries based on subject, unit, and topics.

- GET /get_quiz

Retrieve quiz for a selected topic with specified number of questions.

- POST /save_quiz_result

Store user’s quiz attempt with score and topic info.

- GET /get_quiz_history

Fetch all quiz attempts (filterable by subject).

## 📊 Evaluation

- Text summarization quality: cosine similarity, MiniLM embeddings

- Readability scores calculated using: Flesch Reading Ease, Gunning Fog Index, Dale-Chall, etc.

## ✨ Future Enhancements

- Real-time progress dashboard

- Dynamic difficulty adjustment

- Teacher login and class management

- Upload question papers and generate AI-based answers
