import fitz  # PyMuPDF
import subprocess

# Function to use Ollama for quiz generation
def generate_quiz_with_ollama(content):
    # Create a prompt to ask Ollama to generate a quiz
    prompt = f"""
    Based on the provided educational material, generate 10 quiz questions.
    - Include a mix of multiple-choice questions (4 options per question) and true/false questions.
    - Ensure the questions are clear and relevant to the content provided.

    Educational Material:
    {content}

    Return the quiz in the following format:
    Q1: [Question text here]
    A) [Option 1]
    B) [Option 2]
    C) [Option 3]
    D) [Option 4]
    Correct Answer: [Correct Option]

    OR for True/False:
    Q2: [True/False question text here]
    Correct Answer: [True or False]
    """

    try:
        print("Calling Ollama to generate the quiz...")  # Status update
        # Run the Ollama service
        result = subprocess.run(
            ["ollama", "run", "llama3.2"],  # replace llama3.2 with the model you are using
            input=prompt,
            text=True,
            capture_output=True,
            check=True,
            encoding='utf-8'
        )
        print("Quiz generation completed.")  # Status update
        return result.stdout.strip()

    except subprocess.CalledProcessError as e:
        print("Error while calling Ollama:", e)
        return None

# Function to extract text from a PDF
def extract_text_from_pdf(pdf_path):
    print("Extracting text from the PDF...")  # Status update
    text = ''
    try:
        with fitz.open(pdf_path) as pdf:
            for page in pdf:
                text += page.get_text()
        print("PDF text extraction completed.")  # Status update
    except Exception as e:
        print("Error while extracting text from the PDF:", e)
    return text

# Main function to generate a quiz from a material PDF
def create_quiz_from_pdf(pdf_path, output_file):
    # Extract the text content from the PDF
    material_content = extract_text_from_pdf(pdf_path)

    # Ensure the content isn't too lengthy for the model
    if len(material_content) > 5000:  # Example limit (can vary by model constraints)
        print("The material is too long. Summarizing content before generating the quiz.")
        material_content = material_content[:5000]  # Take the first 5000 characters

    # Generate the quiz using Ollama
    print("Generating quiz based on the material...")
    quiz = generate_quiz_with_ollama(material_content)

    if quiz:
        # Write the quiz to an output text file
        print("Saving the generated quiz to a file...")
        with open(output_file, 'w', encoding='utf-8') as file:
            file.write(quiz)
        print("Quiz saved to:", output_file)
    else:
        print("Failed to generate the quiz.")

# Define input PDF and output file paths
input_pdf_path = './material.pdf'
output_quiz_path = './quiz_output.txt'

# Run the function to create the quiz
print("Starting quiz generation...\n")
create_quiz_from_pdf(input_pdf_path, output_quiz_path)
