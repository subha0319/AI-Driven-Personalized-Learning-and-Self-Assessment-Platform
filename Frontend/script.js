// Book and Topic Management - For generate-materials.html
function addBook() {
    const booksContainer = document.getElementById('booksContainer');
    if (!booksContainer) return;
    
    const bookCount = booksContainer.children.length + 1;
    
    const bookItem = document.createElement('div');
    bookItem.className = 'book-item';
    bookItem.innerHTML = `
        <div class="book-header">
            <div class="book-number">Book ${bookCount}</div>
            <input type="file" accept=".pdf" class="book-file">
            <button type="button" class="remove-btn" onclick="removeBook(this)">Remove Book</button>
        </div>
        <div class="book-topics-container">
            <div class="topics-header">
                <h4>Topics for Book ${bookCount}</h4>
                <button type="button" class="add-topic-btn" onclick="showTopicModal(${bookCount})">
                    <i class="fas fa-plus"></i> Add Topics
                </button>
            </div>
            <div class="topics-list" id="topicsList-${bookCount}">
                <div class="no-topics-message">No topics added yet</div>
            </div>
        </div>
    `;
    
    booksContainer.appendChild(bookItem);
}

function removeBook(button) {
    const bookItem = button.closest('.book-item');
    const booksContainer = bookItem.parentElement;
    
    bookItem.remove();
    
    // Update book numbers
    const books = booksContainer.querySelectorAll('.book-item');
    books.forEach((book, index) => {
        const newIndex = index + 1;
        book.querySelector('.book-number').textContent = `Book ${newIndex}`;
        book.querySelector('.topics-header h4').textContent = `Topics for Book ${newIndex}`;
        
        // Update the add topics button's book index
        const addTopicBtn = book.querySelector('.add-topic-btn');
        addTopicBtn.setAttribute('onclick', `showTopicModal(${newIndex})`);
        
        // Update the topics list ID
        const topicsList = book.querySelector('.topics-list');
        topicsList.id = `topicsList-${newIndex}`;
    });
}

// Sample topics for demonstration purposes
const sampleTopics = {
   "Operating Systems": ["process concept", "process scheduling", "operations on processes", "Hyperparameter Optimization", "interprocess communication", "ipc in shared-memory systems"]
};

//const sampleTopics = {
//    "Artificial Intelligence": ["What is Artificial Intelligence", "Intelligent Agents", "Rational Agent", "Nature of Environments", "Structure of Agents"]
//};

// Shows a modal dialog to select topics
function showTopicModal(bookIndex) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'topic-modal';
    
    // Create topic selection UI
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.innerHTML = `
        <h3>Select Topics for Book ${bookIndex}</h3>
        <div class="topic-selection">
            <div class="topic-search">
                <input type="text" id="topicSearchInput" placeholder="Search topics...">
            </div>
            <div class="topic-categories">
                ${Object.keys(sampleTopics).map(category => `
                    <div class="topic-category">
                        <h4>${category}</h4>
                        <div class="topic-options">
                            ${sampleTopics[category].map(topic => `
                                <div class="topic-option">
                                    <input type="checkbox" id="topic-${bookIndex}-${topic.replace(/\s+/g, '-')}" 
                                        data-topic="${topic}">
                                    <label for="topic-${bookIndex}-${topic.replace(/\s+/g, '-')}">${topic}</label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="modal-actions">
            <button type="button" class="cancel-btn" onclick="closeTopicModal()">Cancel</button>
            <button type="button" class="add-btn" onclick="addSelectedTopics(${bookIndex})">Add Selected Topics</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Set up search functionality
    setTimeout(() => {
        const searchInput = document.getElementById('topicSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                filterTopics(this.value.toLowerCase());
            });
        }
    }, 100);
}

function filterTopics(searchTerm) {
    const topicOptions = document.querySelectorAll('.topic-option');
    
    topicOptions.forEach(option => {
        const topicName = option.querySelector('label').textContent.toLowerCase();
        if (topicName.includes(searchTerm)) {
            option.style.display = 'block';
        } else {
            option.style.display = 'none';
        }
    });
    
    // Show/hide category headers based on visible topics
    const categories = document.querySelectorAll('.topic-category');
    categories.forEach(category => {
        const visibleTopics = category.querySelectorAll('.topic-option[style="display: block"]').length;
        const anyVisible = category.querySelectorAll('.topic-option:not([style="display: none"])').length;
        
        if (anyVisible === 0) {
            category.style.display = 'none';
        } else {
            category.style.display = 'block';
        }
    });
}

function closeTopicModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.remove();
    }
}

function addSelectedTopics(bookIndex) {
    const checkedTopics = document.querySelectorAll(`.topic-option input[type="checkbox"]:checked`);
    const topicsList = document.getElementById(`topicsList-${bookIndex}`);
    
    if (checkedTopics.length > 0) {
        // Clear "no topics" message if it exists
        const noTopicsMsg = topicsList.querySelector('.no-topics-message');
        if (noTopicsMsg) {
            noTopicsMsg.remove();
        }
        
        // Add each selected topic
        checkedTopics.forEach(checkbox => {
            const topicName = checkbox.getAttribute('data-topic');
            
            // Check if topic already exists
            const existingTopic = topicsList.querySelector(`[data-topic="${topicName}"]`);
            if (!existingTopic) {
                const topicItem = document.createElement('div');
                topicItem.className = 'topic-item';
                topicItem.setAttribute('data-topic', topicName);
                topicItem.innerHTML = `
                    <div class="topic-details">
                        <span class="topic-name">${topicName}</span>
                        <div class="topic-pages">
                            <label>Pages:</label>
                            <input type="number" class="page-start" placeholder="Start" min="1">
                            <span>-</span>
                            <input type="number" class="page-end" placeholder="End" min="1">
                        </div>
                    </div>
                    <button type="button" class="remove-topic-btn" onclick="removeTopic(this)">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                topicsList.appendChild(topicItem);
            }
        });
    }
    
    closeTopicModal();
}

function removeTopic(button) {
    const topicItem = button.closest('.topic-item');
    const topicsList = topicItem.parentElement;
    
    topicItem.remove();
    
    // If no topics left, show "no topics" message
    if (topicsList.children.length === 0) {
        topicsList.innerHTML = '<div class="no-topics-message">No topics added yet</div>';
    }
}

// Generation Functions - For generate-materials.html
document.addEventListener('DOMContentLoaded', function() {
    // Add first book automatically
    addBook();
    
    // Setup event listeners for generation buttons
    if (document.getElementById('generateSummary')) {
        document.getElementById('generateSummary').addEventListener('click', function() {
            generateContent('comprehensive');
        });
    }
    
    if (document.getElementById('generateBrief')) {
        document.getElementById('generateBrief').addEventListener('click', function() {
            generateContent('brief');
        });
    }
    
    if (document.getElementById('generateKeywords')) {
        document.getElementById('generateKeywords').addEventListener('click', function() {
            generateContent('keywords');
        });
    }
    
    // Get all buttons with 'generate-btn' class and check if they contain text about subtopics
    const allButtons = document.querySelectorAll('.generate-btn');
    allButtons.forEach(button => {
        if (button.textContent.toLowerCase().includes('subtopic')) {
            button.addEventListener('click', function() {
                generateContent('subtopics');
            });
        }
    });
});

// Function to collect data and send to backend
function generateContent(type) {
    const subject = document.getElementById('subject')?.value;
    const unitNumber = document.getElementById('unitNumber')?.value;
    
    if (!subject || !unitNumber) {
        alert('Please fill in subject and unit number.');
        return;
    }
    
    // Collect all books and their topics
    const books = [];
    const bookElements = document.querySelectorAll('.book-item');
    
    bookElements.forEach((bookElement, index) => {
        const fileInput = bookElement.querySelector('.book-file');
        const bookFile = fileInput.files[0];
        const bookName = bookFile ? bookFile.name : `Book ${index + 1} (No file)`;
        
        if (!bookFile) {
            alert(`Please upload a PDF for Book ${index + 1}`);
            return;
        }
        
        const topics = [];
        const topicElements = bookElement.querySelectorAll('.topic-item');
        
        topicElements.forEach(topicElement => {
            const topicName = topicElement.querySelector('.topic-name').textContent;
            const startPage = topicElement.querySelector('.page-start').value;
            const endPage = topicElement.querySelector('.page-end').value;
            
            if (!startPage || !endPage) {
                alert(`Please specify page range for topic: ${topicName}`);
                return;
            }
            
            topics.push({
                name: topicName,
                startPage: startPage,
                endPage: endPage
            });
        });
        
        books.push({
            name: bookName,
            file: bookFile ? bookFile.name : null,  // In a real implementation, you'd handle file upload
            topics: topics
        });
    });
    
    // Check if we have at least one topic
    let hasTopics = false;
    books.forEach(book => {
        if (book.topics.length > 0) {
            hasTopics = true;
        }
    });
    
    if (!hasTopics) {
        alert('Please add at least one topic to generate content.');
        return;
    }
    
    // Show loading indicator
    showLoadingIndicator();
    
    // Send data to backend
    fetch('http://localhost:5000/generate-content', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            subject: subject,
            unitNumber: unitNumber,
            books: books,
            type: type
        }),
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingIndicator();
        
        if (data.success) {
            // Display the generated content
            displayGeneratedContent(data.results, type);
        } else {
            alert('Error: ' + (data.error || 'Failed to generate content'));
        }
    })
    .catch(error => {
        hideLoadingIndicator();
        console.error('Error:', error);
        alert('Failed to communicate with server. Please check your connection.');
    });
}

// Display loading indicator
function showLoadingIndicator() {
    const contentDisplay = document.getElementById('generatedContent');
    if (!contentDisplay) return;
    
    // Create loading indicator if it doesn't exist
    let loadingIndicator = document.querySelector('.loading-indicator');
    if (!loadingIndicator) {
        loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = `
            <div class="spinner"></div>
            <p>Generating content, please wait...</p>
        `;
        contentDisplay.appendChild(loadingIndicator);
    } else {
        loadingIndicator.style.display = 'flex';
    }
}

// Hide loading indicator
function hideLoadingIndicator() {
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

// Display generated content
function displayGeneratedContent(results, type) {
    const contentDisplay = document.getElementById('generatedContent');
    if (!contentDisplay) return;
    
    // Clear existing content
    const displayArea = contentDisplay.querySelector('.content-display');
    displayArea.innerHTML = '';
    
    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'generated-result';
    
    // Format title based on type
    let titleText = '';
    switch(type) {
        case 'comprehensive':
            titleText = 'Comprehensive Summary';
            break;
        case 'brief':
            titleText = 'Brief Summary';
            break;
        case 'keywords':
            titleText = 'Keywords';
            break;
        case 'subtopics':
            titleText = 'Subtopics';
            break;
        default:
            titleText = 'Generated Content';
    }
    
    // Add results
    if (results && results.length > 0) {
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <h3>${result.topic}</h3>
                <div class="result-content">
                    ${result.content.replace(/\n/g, '<br>')}
                </div>
            `;
            contentContainer.appendChild(resultItem);
        });
    } else {
        contentContainer.innerHTML = '<p>No content was generated.</p>';
    }
    
    // Add to display area
    displayArea.appendChild(contentContainer);
    
    // Create PDF icon
    if (!document.getElementById('pdfPreviewIcon')) {
        const pdfContainer = document.createElement('div');
        pdfContainer.className = 'pdf-preview';
        pdfContainer.innerHTML = `
            <a href="#" id="pdfViewerLink" target="_blank" title="View PDF">
                <div class="pdf-icon" id="pdfPreviewIcon">
                    <i class="fas fa-file-pdf"></i>
                </div>
                <p>Click to view PDF</p>
            </a>
        `;
        contentDisplay.appendChild(pdfContainer);
        
        // In a real implementation, you would generate and link to an actual PDF
        document.getElementById('pdfViewerLink').addEventListener('click', function(e) {
            e.preventDefault();
            // Here you would normally set the actual PDF URL
            window.open('https://mozilla.github.io/pdf.js/web/viewer.html', '_blank');
        });
    }
    
    // Animate the PDF icon
    const pdfIcon = document.querySelector('.pdf-icon');
    if (pdfIcon) {
        pdfIcon.classList.add('pulse');
        setTimeout(() => {
            pdfIcon.classList.remove('pulse');
        }, 1000);
    }
}

// Function to view previously generated content
function viewGeneratedContent(type) {
    const subject = document.getElementById('subject')?.value;
    const unitNumber = document.getElementById('unitNumber')?.value;
    
    fetch(`http://localhost:5000/get-generated-content?type=${type}&subject=${subject}&unitNumber=${unitNumber}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.content.length > 0) {
                // Display the retrieved content
                displaySavedContent(data.content, type);
            } else {
                alert('No saved content found for the selected criteria.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to retrieve saved content.');
        });
}


function saveGeneratedContent() {
    alert('Content saved successfully!');
    // In a real application, this would save to a database
    window.location.href = 'materials-generated.html';
}

// Dummy data for materials
const subjectsData = {
    ArtificialIntelligence: {
        name: "",
        units: [
            {
                id: "math-unit1",
                name: "Unit 1: Algebra and Functions",
                materials: [
                    { id: "math-u1-notes", name: "Lecture Notes", type: "pdf", date: "Feb 15, 2025" },
                    { id: "math-u1-worksheets", name: "Practice Worksheets", type: "pdf", date: "Feb 15, 2025" },
                    { id: "math-u1-examples", name: "Solved Examples", type: "pdf", date: "Feb 16, 2025" }
                ]
            },
            {
                id: "math-unit2",
                name: "Unit 2: Trigonometry",
                materials: [
                    { id: "math-u2-notes", name: "Lecture Notes", type: "pdf", date: "Feb 18, 2025" },
                    { id: "math-u2-formulas", name: "Formula Sheet", type: "pdf", date: "Feb 18, 2025" }
                ]
            },
            {
                id: "math-unit3",
                name: "Unit 3: Calculus",
                materials: [
                    { id: "math-u3-notes", name: "Lecture Notes", type: "pdf", date: "Feb 20, 2025" },
                    { id: "math-u3-diff", name: "Differentiation", type: "pdf", date: "Feb 20, 2025" },
                    { id: "math-u3-int", name: "Integration", type: "pdf", date: "Feb 21, 2025" }
                ]
            }
        ]
    },
    physics: {
        name: "Physics",
        units: [
            {
                id: "phys-unit1",
                name: "Unit 1: Kinematics",
                materials: [
                    { id: "phys-u1-notes", name: "Lecture Notes", type: "pdf", date: "Feb 16, 2025" },
                    { id: "phys-u1-problems", name: "Problem Set", type: "pdf", date: "Feb 17, 2025" }
                ]
            },
            {
                id: "phys-unit2",
                name: "Unit 2: Mechanics",
                materials: [
                    { id: "phys-u2-notes", name: "Lecture Notes", type: "pdf", date: "Feb 18, 2025" },
                    { id: "phys-u2-laws", name: "Newton's Laws", type: "pdf", date: "Feb 18, 2025" },
                    { id: "phys-u2-gravity", name: "Gravity", type: "pdf", date: "Feb 19, 2025" }
                ]
            }
        ]
    },
    chemistry: {
        name: "Chemistry",
        units: [
            {
                id: "chem-unit1",
                name: "Unit 1: Organic Chemistry",
                materials: [
                    { id: "chem-u1-notes", name: "Lecture Notes", type: "pdf", date: "Feb 15, 2025" },
                    { id: "chem-u1-compounds", name: "Organic Compounds", type: "pdf", date: "Feb 15, 2025" },
                    { id: "chem-u1-groups", name: "Functional Groups", type: "pdf", date: "Feb 16, 2025" }
                ]
            }
        ]
    },
    biology: {
        name: "Biology",
        units: [
            {
                id: "bio-unit1",
                name: "Unit 1: Cell Biology",
                materials: [
                    { id: "bio-u1-notes", name: "Lecture Notes", type: "pdf", date: "Feb 22, 2025" },
                    { id: "bio-u1-structure", name: "Cell Structure", type: "pdf", date: "Feb 22, 2025" }
                ]
            },
            {
                id: "bio-unit2",
                name: "Unit 2: Genetics",
                materials: [
                    { id: "bio-u2-notes", name: "Lecture Notes", type: "pdf", date: "Feb 24, 2025" },
                    { id: "bio-u2-dna", name: "DNA Replication", type: "pdf", date: "Feb 24, 2025" }
                ]
            }
        ]
    }
};

// materials-generated page
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const subjectSelect = document.getElementById('subjectSelect');
    const unitSelect = document.getElementById('unitSelect');
    const viewMaterialsBtn = document.getElementById('viewMaterialsBtn');
    const materialsList = document.getElementById('materialsList');
    const pdfList = document.getElementById('pdfList');
    const materialsListTitle = document.getElementById('materialsListTitle');
    const pdfViewer = document.getElementById('pdfViewer');
    const pdfTitle = document.getElementById('pdfTitle');
    const closePdfBtn = document.getElementById('closePdfBtn');
    
    // Handle subject selection
    subjectSelect.addEventListener('change', function() {
        const selectedSubject = this.value;
        
        // Clear current unit options
        unitSelect.innerHTML = '<option value="" selected disabled>Select a unit</option>';
        
        // Hide materials list
        materialsList.classList.add('hidden');
        pdfViewer.classList.add('hidden');
        
        if (selectedSubject) {
            // Enable unit select
            unitSelect.disabled = false;
            
            // Add units for selected subject
            const subject = subjectsData[selectedSubject];
            subject.units.forEach(unit => {
                const option = document.createElement('option');
                option.value = unit.id;
                option.textContent = unit.name;
                unitSelect.appendChild(option);
            });
        } else {
            // Disable unit select
            unitSelect.disabled = true;
            viewMaterialsBtn.disabled = true;
        }
    });
    
    // Handle unit selection
    unitSelect.addEventListener('change', function() {
        viewMaterialsBtn.disabled = !this.value;
    });
    
    // Handle view materials button click
    viewMaterialsBtn.addEventListener('click', function() {
        const selectedSubject = subjectSelect.value;
        const selectedUnitId = unitSelect.value;
        
        // Find selected unit
        const subject = subjectsData[selectedSubject];
        const unit = subject.units.find(u => u.id === selectedUnitId);
        
        if (unit) {
            // Update materials list title
            materialsListTitle.textContent = `${subject.name} - ${unit.name}`;
            
            // Clear current materials
            pdfList.innerHTML = '';
            
            // Add materials for selected unit
            unit.materials.forEach(material => {
                const materialItem = document.createElement('div');
                materialItem.className = 'pdf-item';
                materialItem.dataset.id = material.id;
                
                materialItem.innerHTML = `
                    <i class="fas fa-file-pdf"></i>
                    <div class="pdf-item-info">
                        <h4>${material.name}</h4>
                        <p>Generated on: ${material.date}</p>
                    </div>
                `;
                
                pdfList.appendChild(materialItem);
            });
            
            // Show materials list
            materialsList.classList.remove('hidden');
            pdfViewer.classList.add('hidden');
        }
    });
    
    // Handle PDF item click
    pdfList.addEventListener('click', function(e) {
        const pdfItem = e.target.closest('.pdf-item');
        
        if (pdfItem) {
            const materialId = pdfItem.dataset.id;
            const selectedSubject = subjectSelect.value;
            const selectedUnitId = unitSelect.value;
            
            // Find the material
            const subject = subjectsData[selectedSubject];
            const unit = subject.units.find(u => u.id === selectedUnitId);
            const material = unit.materials.find(m => m.id === materialId);
            
            if (material) {
                // Update PDF viewer title
                pdfTitle.textContent = material.name;
                
                // Show PDF viewer
                pdfViewer.classList.remove('hidden');
            }
        }
    });
    
    // Handle PDF viewer close button
    closePdfBtn.addEventListener('click', function() {
        pdfViewer.classList.add('hidden');
    });
});

// Quiz Generation - For take-quiz.html

function incrementQuestionCount() {
    const countInput = document.getElementById('quizQuestionCount');
    const currentValue = parseInt(countInput.value) || 3;
    if (currentValue < 10) {
        countInput.value = currentValue + 1;
    }
}

function decrementQuestionCount() {
    const countInput = document.getElementById('quizQuestionCount');
    const currentValue = parseInt(countInput.value) || 3;
    if (currentValue > 1) {
        countInput.value = currentValue - 1;
    }
}


async function generateQuiz() {
    const quizSetup = document.getElementById('quizSetup');
    const quizContainer = document.getElementById('quizContainer');
    
    if (!quizSetup) return;
    
    const subject = document.getElementById('quizSubject')?.value;
    const unit = document.getElementById('quizUnit')?.value;
    
    if (!subject || !unit) {
        alert('Please select a subject and unit.');
        return;
    }
    
    // Get selected topic
    let selectedTopic = document.querySelector('input[name="quizTopic"]:checked');
    if (!selectedTopic) {
        alert("Please select a topic.");
        return;
    }
    let topicValue = selectedTopic.value;

     // Get question count
     const questionCount = parseInt(document.getElementById('quizQuestionCount')?.value) || 3;
    
     // Validate question count
     if (questionCount < 1 || questionCount > 10) {
         alert("Please select between 1 and 10 questions.");
         return;
     }
 

    // Create container for quiz if it doesn't exist
    if (!quizContainer) {
        const container = document.createElement('div');
        container.id = 'quizContainer';
        container.className = 'quiz-container';
        document.querySelector('.content-section').appendChild(container);
    }
    
    // Hide setup and show quiz container
    quizSetup.style.display = 'none';
    
    // Show loading indicator
    let quizDiv = document.getElementById('quizContainer');
    quizDiv.style.display = 'block';
    quizDiv.innerHTML = '<p>Loading quiz questions...</p>';
    
    // Call backend API to fetch quiz
    try {
        let response = await fetch(`http://127.0.0.1:5000/get_quiz?topic=${encodeURIComponent(topicValue)}`);
        let data = await response.json();

        if (response.ok) {
            displayQuiz(data.quiz_text);
        } else {
            quizDiv.innerHTML = `<p class="error">${data.error || "Failed to fetch quiz."}</p>`;
            quizDiv.innerHTML += '<button class="back-btn" onclick="backToSetup()">Back to Setup</button>';
        }
    } catch (error) {
        console.error("Error fetching quiz:", error);
        quizDiv.innerHTML = '<p class="error">An error occurred. Please try again.</p>';
        quizDiv.innerHTML += '<button class="back-btn" onclick="backToSetup()">Back to Setup</button>';
    }
}

function displayQuiz(quizText) {
    let quizContainer = document.getElementById("quizContainer");
    quizContainer.innerHTML = ""; // Clear previous quiz
    
    let lines = quizText.split("\n");
    let quizHTML = "<h2>Quiz</h2>";
    let quizData = [];
    let currentQuestion = null;
    let currentDifficulty = null;

    // Parse quiz text
    lines.forEach((line) => {
        line = line.trim();
        if (!line) return; // Skip empty lines
        
        if (line.match(/^Q\d+/)) {
            if (currentQuestion) {
                quizData.push(currentQuestion);
            }
            currentQuestion = {
                question: line,
                difficulty: currentDifficulty,
                options: [],
                correctAnswer: null
            };
        } else if (line.match(/^[A-D]\)/)) {
            if (currentQuestion) {
                currentQuestion.options.push(line);
            }
        } else if (line.startsWith("Correct Answer:")) {
            if (currentQuestion) {
                currentQuestion.correctAnswer = line.replace("Correct Answer:", "").trim();
            }
        }
    });
    
    // Add the last question
    if (currentQuestion) {
        quizData.push(currentQuestion);
    }
    
    // Generate HTML for quiz
    quizData.forEach((q, index) => {
        quizHTML += `<div class="quiz-question" data-correct="${q.correctAnswer}">
            <p><strong>${q.question}</strong> <span class="difficulty-badge ${q.difficulty?.toLowerCase()}">${q.difficulty}</span></p>`;
        
        q.options.forEach((option) => {
            const optionLetter = option.charAt(0);
            const optionText = option.substring(3).trim();
            quizHTML += `<label><input type="radio" name="q${index}" value="${optionLetter}"> ${option}</label><br>`;
        });
        
        quizHTML += `</div>`;
    });

    quizHTML += `<button id="submitQuiz" class="submit-btn">Submit Quiz</button>`;
    quizHTML += `<button class="back-btn" onclick="backToSetup()">Back to Setup</button>`;
    
    quizContainer.innerHTML = quizHTML;
    
    // Add event listener to submit button
    document.getElementById('submitQuiz').addEventListener('click', function() {
        submitQuiz(quizData);
    });
}

async function submitQuiz(quizData) {
    let score = 0;
    let totalQuestions = quizData.length;
    let questionsAnswered = 0;
    
    // Check each question
    document.querySelectorAll('.quiz-question').forEach((questionDiv, index) => {
        const correctAnswer = questionDiv.dataset.correct;
        const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
        
        if (selectedOption) {
            questionsAnswered++;
            const userAnswer = selectedOption.value;
            
            // Extract just the letter from correctAnswer for comparison
            const correctLetter = correctAnswer.charAt(0);
            
            if (userAnswer === correctLetter) {
                score++;
                questionDiv.classList.add('correct');
                
                // Add tick icon to question title
                const questionTitle = questionDiv.querySelector('p strong');
                questionTitle.innerHTML = `<i class="fas fa-check-circle correct-icon"></i> ${questionTitle.textContent}`;
            } else {
                questionDiv.classList.add('incorrect');
                
                // Add cross icon to question title
                const questionTitle = questionDiv.querySelector('p strong');
                questionTitle.innerHTML = `<i class="fas fa-times-circle incorrect-icon"></i> ${questionTitle.textContent}`;
            }
            
            // Disable all inputs for this question
            questionDiv.querySelectorAll('input').forEach(input => {
                input.disabled = true;
            });
            
            // Show correct answer
            questionDiv.innerHTML += `<p class="answer-feedback">Correct answer: ${correctAnswer}</p>`;
        }
        
    });
    
    // Check if all questions are answered
    if (questionsAnswered < totalQuestions) {
        alert(`Please answer all questions. You've answered ${questionsAnswered} out of ${totalQuestions}.`);
        return;
    }
    
    // Calculate percentage
    const percentage = Math.round((score/totalQuestions) * 100);
    
    // Create enhanced result box
    const quizContainer = document.getElementById('quizContainer');
    const resultDiv = document.createElement('div');
    resultDiv.className = 'quiz-result';
    
    // Different message based on score
    let resultMessage = "";
    let resultClass = "";
    
    if (score === totalQuestions) {
        resultMessage = `<h3 class="perfect-score">Perfect Score! Congratulations! 🎉</h3>`;
        resultClass = "perfect-score-box";
    } else if (percentage >= 70) {
        resultMessage = `<h3>Good Job!</h3>`;
        resultClass = "good-score-box";
    } else if (percentage >= 40) {
        resultMessage = `<h3>Nice Try!</h3>`;
        resultClass = "average-score-box";
    } else {
        resultMessage = `<h3>Keep Practicing!</h3>`;
        resultClass = "low-score-box";
    }
    
    resultDiv.innerHTML = `
        <div class="score-box ${resultClass}">
            ${resultMessage}
            <div class="score-display">
                <div class="score-number">${score}</div>
                <div class="score-divider">/</div>
                <div class="score-total">${totalQuestions}</div>
            </div>
            <div class="score-percentage">${percentage}%</div>
        </div>
    `;
    
    // Add perfect score animation if applicable
    if (score === totalQuestions) {
        setTimeout(() => {
            resultDiv.querySelector('.score-box').classList.add('celebration-animation');
            
            // Add confetti effect
            const confetti = document.createElement('div');
            confetti.className = 'confetti-container';
            for (let i = 0; i < 50; i++) {
                const confettiPiece = document.createElement('div');
                confettiPiece.className = 'confetti';
                confettiPiece.style.left = `${Math.random() * 100}%`;
                confettiPiece.style.animationDelay = `${Math.random() * 3}s`;
                confettiPiece.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
                confetti.appendChild(confettiPiece);
            }
            resultDiv.appendChild(confetti);
        }, 300);
    }
    
    // Add result at the top of the quiz container
    quizContainer.insertBefore(resultDiv, quizContainer.firstChild);
    
    // Disable submit button
    document.getElementById('submitQuiz').disabled = true;

    // After calculating score, save the result
    const quizSubject = document.getElementById('quizSubject').value;
    const quizUnit = document.getElementById('quizUnit').value;
    const selectedTopic = document.querySelector('input[name="quizTopic"]:checked').value;
    const questionCount = parseInt(document.getElementById('quizQuestionCount')?.value) || 3;
    
    // Save the result to the database
    const saveSuccess = await saveQuizResult(
        quizSubject,
        quizUnit,
        selectedTopic,
        score,  // Your score variable from the existing function
        totalQuestions,  // Your totalQuestions variable from the existing function
        questionCount
    );
    
    if (saveSuccess) {
        // Add a message to the result box
        if (document.querySelector('.quiz-result')) {
            const historyMessage = document.createElement('p');
            historyMessage.className = 'history-saved';
            historyMessage.innerHTML = 'Result saved to your quiz history <i class="fas fa-check-circle"></i>';
            document.querySelector('.quiz-result').appendChild(historyMessage);
        }
    }
    
}
function backToSetup() {
    // Hide quiz container and show setup
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('quizSetup').style.display = 'block';
}


// Add this to your script.js file

// Sample quiz history data - in a real application, this would come from a database/backend
// Quiz History functionality
// Add this to your script.js file

// Initialize the quiz history page
document.addEventListener('DOMContentLoaded', function() {
    // Only run this code on the quiz history page
    if (document.querySelector('.content-section') && window.location.href.includes('quiz-history.html')) {
        loadQuizHistory();
        
        // Set up event listeners
        document.getElementById('backToSubjectsBtn').addEventListener('click', function() {
            showSubjectsTable();
        });
    }
});

// Function to load quiz history from the backend
async function loadQuizHistory() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');
    const noHistoryMessage = document.getElementById('noHistoryMessage');
    const historyContainer = document.getElementById('historyContainer');
    
    // Show loading, hide other elements
    loadingIndicator.style.display = 'flex';
    errorMessage.style.display = 'none';
    noHistoryMessage.style.display = 'none';
    historyContainer.style.display = 'none';
    
    try {
        // Fetch quiz history from backend
        const response = await fetch('http://127.0.0.1:5000/get_quiz_history');
        const data = await response.json();
        
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to load quiz history');
        }
        
        // Check if there's any history data
        if (Object.keys(data.data).length === 0) {
            noHistoryMessage.style.display = 'flex';
            return;
        }
        
        // Process and display the data
        populateSubjectsTable(data.data);
        historyContainer.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading quiz history:', error);
        loadingIndicator.style.display = 'none';
        errorMessage.textContent = error.message || 'Failed to load quiz history. Please try again later.';
        errorMessage.style.display = 'block';
    }
}

// Function to populate the subjects table with real data
function populateSubjectsTable(historyData) {
    const tableBody = document.getElementById('subjectsTableBody');
    tableBody.innerHTML = '';
    
    // Process each subject
    Object.keys(historyData).forEach(subject => {
        const topicsData = historyData[subject];
        
        // Calculate statistics
        let totalScore = 0;
        let totalAttempts = topicsData.length;
        let latestDate = '';
        
        topicsData.forEach(attempt => {
            totalScore += (attempt.score / attempt.totalQuestions) * 100;
            
            // Check if this attempt is more recent
            if (!latestDate || new Date(attempt.date) > new Date(latestDate)) {
                latestDate = attempt.date;
            }
        });
        
        const averageScore = totalAttempts > 0 ? Math.round(totalScore / totalAttempts) : 0;
        
        // Create the row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${subject}</td>
            <td>${totalAttempts}</td>
            <td>
                <div class="score-display">
                    <span>${averageScore}%</span>
                    <div class="score-bar">
                        <div class="score-progress" style="width: ${averageScore}%"></div>
                    </div>
                </div>
            </td>
            <td>${latestDate}</td>
            <td>
                <button class="view-details-btn" data-subject="${subject}">
                    <i class="fas fa-list-ul"></i> View Details
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add click event listeners to view details buttons
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function() {
            const subject = this.getAttribute('data-subject');
            showTopicsTable(subject, historyData[subject]);
        });
    });
}

// Function to show topics for a specific subject
// Function to show topics for a specific subject
function showTopicsTable(subject, topicsData) {
    // Set the subject title
    document.getElementById('selectedSubjectTitle').textContent = `${subject} - Quiz History`;
    
    // Create filter controls
    createFilterControls(topicsData);
    
    // Populate the topics table with all data initially
    populateTopicsTable(topicsData);
    
    // Hide subjects table and show topics table
    document.querySelector('.subjects-table').style.display = 'none';
    document.getElementById('topicsDetailContainer').style.display = 'block';
}

// Function to create filter controls
function createFilterControls(topicsData) {
    const filterContainer = document.getElementById('filterContainer');
    if (!filterContainer) return;
    
    // Clear existing filters
    filterContainer.innerHTML = '';
    
    // Extract unique units, dates, and score ranges
    const units = [...new Set(topicsData.map(item => item.unit))].sort();
    const dates = [...new Set(topicsData.map(item => item.date))].sort((a, b) => new Date(b) - new Date(a));
    
    // Create unit filter
    const unitFilter = document.createElement('div');
    unitFilter.className = 'filter-group';
    unitFilter.innerHTML = `
        <label for="unitFilter">Unit:</label>
        <select id="unitFilter" class="filter-select">
            <option value="all">All Units</option>
            ${units.map(unit => `<option value="${unit}">${unit}</option>`).join('')}
        </select>
    `;
    
    // Create date filter
    const dateFilter = document.createElement('div');
    dateFilter.className = 'filter-group';
    dateFilter.innerHTML = `
        <label for="dateFilter">Date:</label>
        <select id="dateFilter" class="filter-select">
            <option value="all">All Dates</option>
            ${dates.map(date => `<option value="${date}">${date}</option>`).join('')}
        </select>
    `;
    
    // Create score filter
    const scoreFilter = document.createElement('div');
    scoreFilter.className = 'filter-group';
    scoreFilter.innerHTML = `
        <label for="scoreFilter">Score:</label>
        <select id="scoreFilter" class="filter-select">
            <option value="all">All Scores</option>
            <option value="above70">Above 70%</option>
            <option value="below70">Below 70%</option>
            <option value="above80">Above 80%</option>
            <option value="below50">Below 50%</option>
        </select>
    `;
    
    // Add filters to container
    filterContainer.appendChild(unitFilter);
    filterContainer.appendChild(dateFilter);
    filterContainer.appendChild(scoreFilter);
    
    // Add event listeners for filters
    document.getElementById('unitFilter').addEventListener('change', () => applyFilters(topicsData));
    document.getElementById('dateFilter').addEventListener('change', () => applyFilters(topicsData));
    document.getElementById('scoreFilter').addEventListener('change', () => applyFilters(topicsData));
}

// Function to apply filters
function applyFilters(allTopicsData) {
    const unitFilter = document.getElementById('unitFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const scoreFilter = document.getElementById('scoreFilter').value;
    
    // Filter data
    let filteredData = allTopicsData.filter(item => {
        // Apply unit filter
        if (unitFilter !== 'all' && item.unit !== unitFilter) return false;
        
        // Apply date filter
        if (dateFilter !== 'all' && item.date !== dateFilter) return false;
        
        // Apply score filter
        const scorePercentage = (item.score / item.totalQuestions) * 100;
        if (scoreFilter === 'above70' && scorePercentage <= 70) return false;
        if (scoreFilter === 'below70' && scorePercentage >= 70) return false;
        if (scoreFilter === 'above80' && scorePercentage <= 80) return false;
        if (scoreFilter === 'below50' && scorePercentage >= 50) return false;
        
        return true;
    });
    
    // Update table with filtered data
    populateTopicsTable(filteredData);
}
// Function to populate topics table
function populateTopicsTable(topicsData) {
    const topicsTableBody = document.getElementById('topicsTableBody');
    topicsTableBody.innerHTML = '';
    
    // Sort data by date (most recent first)
    const sortedData = [...topicsData].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Create rows for each attempt
    sortedData.forEach(attempt => {
        const row = document.createElement('tr');
        
        const scorePercentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
        
        row.innerHTML = `
            <td>${attempt.unit}</td>
            <td>${attempt.topic}</td>
            <td>${attempt.date}</td>
            <td class="score-column">
                <div class="score-display">
                    <span>${scorePercentage}% (${attempt.score}/${attempt.totalQuestions})</span>
                    <div class="score-bar">
                        <div class="score-progress" style="width: ${scorePercentage}%"></div>
                    </div>
                </div>
            </td>
            <td>
                <button class="retake-btn" data-subject="${attempt.subject}" data-topic="${attempt.topic}" data-unit="${attempt.unit}">
                    <i class="fas fa-redo"></i> Retake
                </button>
            </td>
        `;
        
        topicsTableBody.appendChild(row);
    });
    
    // Add event listeners to the retake buttons
    document.querySelectorAll('.retake-btn').forEach(button => {
        button.addEventListener('click', function() {
            const subject = this.getAttribute('data-subject');
            const topic = this.getAttribute('data-topic');
            const unit = this.getAttribute('data-unit');
            retakeQuiz(subject, topic, unit);
        });
    });
    
    // Display message if no results
    const noResultsMessage = document.getElementById('noResultsMessage');
    if (noResultsMessage) {
        if (topicsData.length === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
    }
}

// Function to show the subjects table (hide topics table)
function showSubjectsTable() {
    document.querySelector('.subjects-table').style.display = 'table';
    document.getElementById('topicsDetailContainer').style.display = 'none';
}
// Function to retake a quiz
function retakeQuiz(subject, topic, unit) {
    // Navigate to take-quiz page with pre-filled fields
    window.location.href = `take-quiz.html?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}&unit=${encodeURIComponent(unit)}`;
}

async function saveQuizResult(subject, unit, topic, score, totalQuestions, questionCount) {
    try {
        const response = await fetch('http://127.0.0.1:5000/save_quiz_result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subject: subject,
                unit: unit,
                topic: topic,
                score: score,
                totalQuestions: totalQuestions,
                question_count: questionCount,
                date: new Date().toISOString()
            })
        });
        
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error saving quiz result:', error);
        return false;
    }
}


// Function to pre-fill quiz settings from URL parameters
function loadQuizSettingsFromURL() {
    // Only run on the take-quiz page
    if (!document.getElementById('quizSetup')) return;
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const subject = urlParams.get('subject');
    const topic = urlParams.get('topic');
    const unit = urlParams.get('unit');
    
    // Set the form values if parameters exist
    if (subject) {
        const subjectSelect = document.getElementById('quizSubject');
        // Find the matching option
        for (let i = 0; i < subjectSelect.options.length; i++) {
            if (subjectSelect.options[i].value === subject || 
                subjectSelect.options[i].textContent === subject) {
                subjectSelect.selectedIndex = i;
                break;
            }
        }
    }
    
    if (unit) {
        const unitSelect = document.getElementById('quizUnit');
        // Find the matching option
        for (let i = 0; i < unitSelect.options.length; i++) {
            if (unitSelect.options[i].value === unit) {
                unitSelect.selectedIndex = i;
                break;
            }
        }
    }
    
    if (topic) {
        // Find and select the matching topic radio button
        const topicRadios = document.querySelectorAll('input[name="quizTopic"]');
        topicRadios.forEach(radio => {
            if (radio.value === topic) {
                radio.checked = true;
            }
        });
    }
    
    // If all parameters are set, optionally auto-generate the quiz
    if (subject && unit && topic) {
        // Uncomment this if you want to auto-generate the quiz
        // generateQuiz();
    }
}

// Load settings when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadQuizSettingsFromURL();
});