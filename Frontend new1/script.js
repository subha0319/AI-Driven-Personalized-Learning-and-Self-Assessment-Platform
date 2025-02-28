// Book and Topic Management - For generate-materials.html
function addBook() {
    const booksContainer = document.getElementById('booksContainer');
    if (!booksContainer) return;
    
    const bookCount = booksContainer.children.length + 1;
    
    const bookItem = document.createElement('div');
    bookItem.className = 'book-item';
    bookItem.innerHTML = `
        <div class="book-number">Book ${bookCount}</div>
        <input type="file" accept=".pdf" class="book-file">
        <button type="button" class="remove-btn" onclick="removeBook(this)">Remove</button>
    `;
    
    booksContainer.appendChild(bookItem);
    updateBookSelects();
}

function removeBook(button) {
    const bookItem = button.parentElement;
    const booksContainer = bookItem.parentElement;
    
    bookItem.remove();
    
    // Update book numbers
    const books = booksContainer.querySelectorAll('.book-item');
    books.forEach((book, index) => {
        book.querySelector('.book-number').textContent = `Book ${index + 1}`;
    });
    
    updateBookSelects();
}

function addTopic() {
    const topicsContainer = document.getElementById('topicsContainer');
    if (!topicsContainer) return;
    
    // Create table if it doesn't exist yet
    if (!document.getElementById('topicsTable')) {
        const table = document.createElement('table');
        table.id = 'topicsTable';
        table.className = 'topics-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Topic Name</th>
                    <th>Book</th>
                    <th>Start Page</th>
                    <th>End Page</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="topicsTableBody"></tbody>
        `;
        topicsContainer.appendChild(table);
    }
    
    const topicsTableBody = document.getElementById('topicsTableBody');
    const bookOptions = Array.from(document.querySelectorAll('.book-item')).map((book, index) => {
        return `<option value="${index + 1}">Book ${index + 1}</option>`;
    }).join('');
    
    const topicRow = document.createElement('tr');
    topicRow.className = 'topic-row';
    topicRow.innerHTML = `
        <td><input type="text" class="topic-name" placeholder="Enter topic name"></td>
        <td>
            <select class="book-select">
                ${bookOptions}
            </select>
        </td>
        <td><input type="number" class="page-start" placeholder="Start Page" min="1"></td>
        <td><input type="number" class="page-end" placeholder="End Page" min="1"></td>
        <td><button type="button" class="remove-btn" onclick="removeTopic(this)">Remove</button></td>
    `;
    
    topicsTableBody.appendChild(topicRow);
}

function removeTopic(button) {
    const topicRow = button.closest('tr');
    const topicsTableBody = document.getElementById('topicsTableBody');
    
    topicRow.remove();
    
    // If no topics left, remove the table
    if (topicsTableBody.children.length === 0) {
        document.getElementById('topicsTable').remove();
    }
}

function updateBookSelects() {
    const bookCount = document.querySelectorAll('.book-item').length;
    const bookSelects = document.querySelectorAll('.book-select');
    
    bookSelects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '';
        
        for (let i = 1; i <= bookCount; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Book ${i}`;
            select.appendChild(option);
        }
        
        if (currentValue && currentValue <= bookCount) {
            select.value = currentValue;
        }
    });
}

// Generation Functions - For generate-materials.html
document.addEventListener('DOMContentLoaded', function() {
    // Setup event listeners only if elements exist
    if (document.getElementById('generateSummary')) {
        document.getElementById('generateSummary').addEventListener('click', function() {
            generateContent('summary');
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
    
    if (document.getElementById('saveContent')) {
        document.getElementById('saveContent').addEventListener('click', function() {
            saveGeneratedContent();
        });
    }
});

function generateContent(type) {
    const subject = document.getElementById('subject')?.value;
    const unitNumber = document.getElementById('unitNumber')?.value;
    
    if (!subject || !unitNumber) {
        alert('Please fill in subject and unit number.');
        return;
    }
    
    const contentDisplay = document.getElementById('generatedContent');
    const placeholder = contentDisplay.querySelector('.placeholder-text');
    const saveBtn = document.getElementById('saveContent');
    
    // Get the generated content container
    const contentContainer = document.querySelector('.generated-content');
    
    // Create PDF icon element if it doesn't exist already
    if (!document.getElementById('pdfPreviewIcon')) {
        const pdfContainer = document.createElement('div');
        pdfContainer.className = 'pdf-preview';
        pdfContainer.innerHTML = `
            <a href="#" id="pdfViewerLink" target="_blank" title="View PDF">
                <div class="pdf-icon">
                    <i class="fas fa-file-pdf"></i>
                </div>
                <p>Click to view PDF</p>
            </a>
        `;
        contentContainer.appendChild(pdfContainer);
        
        // In a real application, this would generate an actual PDF and set its URL
        // For this example, we'll use a placeholder PDF URL
        document.getElementById('pdfViewerLink').addEventListener('click', function(e) {
            e.preventDefault();
            // Here you would normally set the actual PDF URL
            // For demonstration, we'll open a sample PDF viewer
            window.open('https://mozilla.github.io/pdf.js/web/viewer.html', '_blank');
        });
    }
    
    alert('Content generated successfully!');
    
    // Animate the PDF icon to draw attention
    const pdfIcon = document.querySelector('.pdf-icon');
    pdfIcon.classList.add('pulse');
    setTimeout(() => {
        pdfIcon.classList.remove('pulse');
    }, 1000);
    
    // In a real application, this might redirect after a delay
    // setTimeout(() => {
    //    window.location.href = 'materials-generated.html';
    // }, 3000);
}

function saveGeneratedContent() {
    alert('Content saved successfully!');
    // In a real application, this would save to a database
    window.location.href = 'materials-generated.html';
}

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
function generateQuiz() {
    const quizSetup = document.getElementById('quizSetup');
    const quizContainer = document.getElementById('quizContainer');
    
    if (!quizSetup || !quizContainer) return;
    
    const subject = document.getElementById('quizSubject')?.value;
    const unit = document.getElementById('quizUnit')?.value;
    
    if (!subject || !unit) {
        alert('Please select a subject and unit.');
        return;
    }
    
    // Check if at least one topic is selected
    const topicsSelected = document.querySelectorAll('input[type="checkbox"]:checked');
    if (topicsSelected.length === 0) {
        alert('Please select at least one topic.');
        return;
    }
    
    // Hide setup and show quiz
    quizSetup.style.display = 'none';
    quizContainer.style.display = 'block';
    
    // In a real application, this would fetch questions from the backend
}

// Make sure event listeners are attached only if elements exist
document.addEventListener('DOMContentLoaded', function() {
    // Initialize any UI elements that need JavaScript
    const currentPage = window.location.pathname.split('/').pop();
    
    // Setup for generate-materials.html
    if (currentPage === 'generate-materials.html') {
        // Add initial book if container exists
        const booksContainer = document.getElementById('booksContainer');
        if (booksContainer && booksContainer.children.length === 0) {
            addBook();
        }
        
        // Add initial topic if container exists
        const topicsContainer = document.getElementById('topicsContainer');
        if (topicsContainer && topicsContainer.children.length === 0) {
            addTopic();
        }
    }
});

// Sample quiz history data
const quizHistoryData = [
    {
        id: 1,
        subject: "Artificial Intelligence",
        unit: "Unit 3",
        topics: ["Intelligent Agents", "Rational Agents", "Neural Networks"],
        score: 88,
        date: "Feb 25, 2025",
        attempts: 1,
        topicPerformance: [
            { topic: "Intelligent Agents", score: 90 },
            { topic: "Rational Agents", score: 85 },
            { topic: "Neural Networks", score: 89 }
        ]
    },
    {
        id: 2,
        subject: "Machine Learning",
        unit: "Unit 2",
        topics: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning"],
        score: 75,
        date: "Feb 23, 2025",
        attempts: 2,
        topicPerformance: [
            { topic: "Supervised Learning", score: 85 },
            { topic: "Unsupervised Learning", score: 65 },
            { topic: "Reinforcement Learning", score: 70 }
        ]
    },
    {
        id: 3,
        subject: "Mathematics",
        unit: "Unit 3",
        topics: ["Calculus", "Differentiation", "Integration"],
        score: 85,
        date: "Feb 21, 2025",
        attempts: 1,
        topicPerformance: [
            { topic: "Calculus", score: 82 },
            { topic: "Differentiation", score: 90 },
            { topic: "Integration", score: 83 }
        ]
    },
    {
        id: 4,
        subject: "Physics",
        unit: "Unit 2",
        topics: ["Mechanics", "Newton's Laws", "Motion"],
        score: 70,
        date: "Feb 19, 2025",
        attempts: 3,
        topicPerformance: [
            { topic: "Mechanics", score: 75 },
            { topic: "Newton's Laws", score: 68 },
            { topic: "Motion", score: 65 }
        ]
    },
    {
        id: 5,
        subject: "Chemistry",
        unit: "Unit 1",
        topics: ["Organic Compounds", "Chemical Bonds", "Reactions"],
        score: 92,
        date: "Feb 16, 2025",
        attempts: 1,
        topicPerformance: [
            { topic: "Organic Compounds", score: 95 },
            { topic: "Chemical Bonds", score: 90 },
            { topic: "Reactions", score: 91 }
        ]
    }
];

// Function to format the display of topics
function formatTopics(topics) {
    if (topics.length === 0) return "No topics";
    return topics.join(", ");
}

// Function to determine the CSS class for score progress bar
function getScoreClass(score) {
    if (score < 70) return 'low';
    if (score < 85) return 'medium';
    return '';
}

// Function to render quiz history list
function renderQuizHistory() {
    const quizHistoryContainer = document.getElementById('quiz-history-list');
    
    // Clear the container
    quizHistoryContainer.innerHTML = '';
    
    if (quizHistoryData.length === 0) {
        quizHistoryContainer.innerHTML = `
            <div class="no-quizzes-message">
                <div class="empty-icon"><i class="far fa-clipboard"></i></div>
                <h3>No quizzes taken yet</h3>
                <p>Start taking quizzes to build your history and track your progress.</p>
                <button class="retake-btn" onclick="window.location.href='take-quiz.html'">
                    <i class="fas fa-question-circle"></i> Take a Quiz
                </button>
            </div>
        `;
        return;
    }
    
    // Sort quizzes from latest to earliest
    const sortedQuizzes = [...quizHistoryData].sort((a, b) => {
        // Convert dates to comparable format (assuming consistent format)
        const dateA = new Date(a.date.replace('Feb', 'February'));
        const dateB = new Date(b.date.replace('Feb', 'February'));
        return dateB - dateA;
    });
    
    // Render each quiz item
    sortedQuizzes.forEach(quiz => {
        const quizElement = document.createElement('div');
        quizElement.className = 'quiz-item';
        quizElement.innerHTML = `
            <div class="quiz-header">
                <div class="quiz-title">
                    <h3>${quiz.subject} - ${quiz.unit}</h3>
                    <div class="quiz-meta">
                        <span class="quiz-date"><i class="far fa-calendar-alt"></i> ${quiz.date}</span>
                        <span class="attempts-badge"><i class="fas fa-redo"></i> ${quiz.attempts} ${quiz.attempts === 1 ? 'attempt' : 'attempts'}</span>
                    </div>
                </div>
            </div>
            <div class="quiz-topics">
                <strong>Topics:</strong> ${formatTopics(quiz.topics)}
            </div>
            <div class="score-container">
                <span class="score-label">Score:</span>
                <span class="score-value">${quiz.score}%</span>
                <div class="score-bar">
                    <div class="score-progress ${getScoreClass(quiz.score)}" style="width: ${quiz.score}%"></div>
                </div>
            </div>
            <div class="quiz-actions">
                <button class="view-btn" onclick="viewQuizResults(${quiz.id})">
                    <i class="fas fa-eye"></i> View Results
                </button>
                <button class="retake-btn" onclick="retakeQuiz(${quiz.id})">
                    <i class="fas fa-redo"></i> Retake
                </button>
            </div>
        `;
        
        quizHistoryContainer.appendChild(quizElement);
    });
}

// Function to analyze performance and generate strength/improvement areas
function analyzePerformance() {
    // Flatten all topic performances
    const allTopicPerformances = quizHistoryData.flatMap(quiz => quiz.topicPerformance);
    
    // Group by topic and calculate average score
    const topicAverages = {};
    allTopicPerformances.forEach(item => {
        if (!topicAverages[item.topic]) {
            topicAverages[item.topic] = {
                totalScore: 0,
                count: 0
            };
        }
        
        topicAverages[item.topic].totalScore += item.score;
        topicAverages[item.topic].count += 1;
    });
    
    // Calculate average for each topic
    const analyzedTopics = Object.keys(topicAverages).map(topic => {
        const average = topicAverages[topic].totalScore / topicAverages[topic].count;
        return {
            topic,
            averageScore: Math.round(average)
        };
    });
    
    // Sort by score
    analyzedTopics.sort((a, b) => b.averageScore - a.averageScore);
    
    // Identify strengths (top 40%) and improvements (bottom 40%)
    const strengthCount = Math.max(1, Math.ceil(analyzedTopics.length * 0.4));
    const improvementCount = Math.max(1, Math.ceil(analyzedTopics.length * 0.4));
    
    const strengths = analyzedTopics.slice(0, strengthCount);
    const improvements = analyzedTopics.slice(-improvementCount).reverse();
    
    return { strengths, improvements };
}

// Function to render performance summary
function renderPerformanceSummary() {
    const { strengths, improvements } = analyzePerformance();
    
    const strengthsList = document.getElementById('strength-topics');
    const improvementsList = document.getElementById('improvement-topics');
    
    // Clear the lists
    strengthsList.innerHTML = '';
    improvementsList.innerHTML = '';
    
    // Render strengths
    if (strengths.length === 0) {
        strengthsList.innerHTML = '<li>No data available yet</li>';
    } else {
        strengths.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${item.topic} <span class="topic-score">(${item.averageScore}%)</span>
            `;
            strengthsList.appendChild(li);
        });
    }
    
    // Render improvements
    if (improvements.length === 0) {
        improvementsList.innerHTML = '<li>No data available yet</li>';
    } else {
        improvements.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${item.topic} <span class="topic-score">(${item.averageScore}%)</span>
            `;
            improvementsList.appendChild(li);
        });
    }
}

// Function to handle viewing quiz results
function viewQuizResults(quizId) {
    console.log(`Viewing results for quiz ID: ${quizId}`);
    // In a real application, this would navigate to a detailed results page
    alert(`Navigating to results page for quiz ID: ${quizId}`);
}

// Function to handle retaking a quiz
function retakeQuiz(quizId) {
    console.log(`Retaking quiz ID: ${quizId}`);
    // In a real application, this would navigate to the quiz page
    alert(`Navigating to retake quiz ID: ${quizId}`);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderQuizHistory();
    renderPerformanceSummary();
});