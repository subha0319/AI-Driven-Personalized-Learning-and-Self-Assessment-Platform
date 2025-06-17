from pymongo import MongoClient

# Replace with your MongoDB Atlas connection string
MONGO_URI = "mongodb+srv://subhashini0319:9EUxRzrhII2dCbGP@cluster0.tg8oq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(MONGO_URI)
db = client["content_summarization"]

# Collections
summarizations_collection = db["summarizations"]
assessments_collection = db["assessments"]

def save_summarization(data):
    summarizations_collection.insert_one(data)

def get_summarization(subject, unit, topic):
    return summarizations_collection.find_one({"subject": subject, "unit_number": unit, "topics": topic})

def save_assessment(data):
    assessments_collection.insert_one(data)

def get_assessment(subject, unit, topic):
    return assessments_collection.find_one({"subject": subject, "unit_number": unit, "topic": topic})
