// Simulate Login to Redirect to Home Page
/*document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("login-form")) {
        document.getElementById("login-form").addEventListener("submit", function(e) {
            e.preventDefault();
            console.log("Simulated login successful");
            window.location.href = "home.html";
        });
    }
});

// Simulate Signup Redirect
if (document.getElementById("signup-form")) {
    document.getElementById("signup-form").addEventListener("submit", function(e) {
        e.preventDefault();
        window.location.href = "home.html";
    });
}*/ 

// Sidebar Toggle Logic
const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");

// Toggle sidebar when clicking the menu button
menuBtn.addEventListener("click", function(event) {
    sidebar.classList.toggle("hidden");
    event.stopPropagation(); // Prevent event from bubbling to the document
});

// Close sidebar when clicking outside the sidebar
document.addEventListener("click", function(event) {
    const isClickInsideMenu = sidebar.contains(event.target) || menuBtn.contains(event.target);
    if (!isClickInsideMenu && !sidebar.classList.contains("hidden")) {
        sidebar.classList.add("hidden");
    }
});

// Add Topics Logic
if (document.getElementById("add-topic")) {
    document.getElementById("add-topic").addEventListener("click", function() {
        const topicInput = document.getElementById("topic-input").value.trim();
        const startPageInput = document.getElementById("start-page").value.trim();
        const endPageInput = document.getElementById("end-page").value.trim();

        if (topicInput) {
            const li = document.createElement("li");
            li.innerHTML = `<strong>Topic:</strong> ${topicInput}`;

            if (startPageInput || endPageInput) {
                li.innerHTML += `<br><strong>Pages:</strong> ${startPageInput || "N/A"} - ${endPageInput || "N/A"}`;
            }

            document.getElementById("topics-list").appendChild(li);

            // Clear inputs
            document.getElementById("topic-input").value = "";
            document.getElementById("start-page").value = "";
            document.getElementById("end-page").value = "";
        } else {
            alert("Please enter a topic name.");
        }
    });
}
// dynamically update the placeholder when the "Generate Material" button is clicked

if (document.getElementById("generate-form")) {
	document.getElementById("generate-form").addEventListener("submit", function (event) {
		event.preventDefault(); // Prevent form submission to server

		const generatedContent = document.getElementById("generated-content");
		const placeholderText = document.getElementById("placeholder-text");

		// Clear existing placeholder content
		placeholderText.innerHTML = "";

		// Create the "Click to View" button
		const viewButton = document.createElement("button");
		viewButton.textContent = "Click to View";
		viewButton.classList.add("view-button"); // Add a class for styling

		// Add event listener to navigate to the materials-generated page
		viewButton.addEventListener("click", function () {
			window.location.href = "materials-generated.html";
		});

		// Append the button to the generated content area
		placeholderText.appendChild(viewButton);
	});
}

// Dummy data for subjects and units
const subjectsData = {
    "Generative AI": ["Unit 1: Introduction", "Unit 2: Basics", "Unit 3: Applications"],
    "Machine Learning": ["Unit 1: Supervised Learning", "Unit 2: Unsupervised Learning"],
};

// Function to populate subjects dropdown
window.onload = function() {
    const subjectSelect = document.getElementById("subject");
    for (const subject in subjectsData) {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    }
};

document.addEventListener("DOMContentLoaded", function() {
    // Populate the subjects dropdown
    const subjectSelect = document.getElementById("subject");
    for (const subject in subjectsData) {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    }
});

// Populate units based on subject
function populateUnits() {
    const subject = document.getElementById("subject").value;
    const unitSelect = document.getElementById("unit");
    unitSelect.innerHTML = '<option value="">--Select Unit--</option>'; // Reset

    if (subject) {
        subjectsData[subject].forEach(unit => {
            const option = document.createElement("option");
            option.value = unit;
            option.textContent = unit;
            unitSelect.appendChild(option);
        });
    }
}

//materials-generated page
// Dummy Data
const materialsData = {
    "Generative AI": {
        "Unit 1: Introduction": [
            { topic: "Basics of AI", pdf: "PW2 sample generated material.pdf" },
            { topic: "History of AI", pdf: "PW2 sample generated material.pdf" }
        ],
        "Unit 2: Basics": [
            { topic: "AI Applications", pdf: "PW2 sample generated material.pdf" }
        ]
    },
    "Machine Learning": {
        "Unit 1: Supervised Learning": [
            { topic: "Linear Regression", pdf: "PW2 sample generated material.pdf" },
            { topic: "Decision Trees", pdf: "PW2 sample generated material.pdf" }
        ],
        "Unit 2: Unsupervised Learning": [
            { topic: "Clustering", pdf: "PW2 sample generated material.pdf" }
        ]
    }
};

// Populate Subject Dropdown
const subjectSelect = document.getElementById("subject-select");
const unitSelect = document.getElementById("unit-select");
const topicSelect = document.getElementById("topic-select");
const viewMaterialButton = document.getElementById("view-material");
const pdfContainer = document.getElementById("pdf-container");
const pdfLink = document.getElementById("pdf-link");

document.addEventListener("DOMContentLoaded", () => {
    Object.keys(materialsData).forEach(subject => {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    });
    // Subject Selection
    subjectSelect.addEventListener("change", () => {
        const selectedSubject = subjectSelect.value;
        unitSelect.innerHTML = '<option value="">-- Select Unit --</option>';
        topicSelect.innerHTML = '<option value="">-- Select Topic --</option>';
        unitSelect.disabled = !selectedSubject;
        topicSelect.disabled = true;
        viewMaterialButton.disabled = true;
        pdfContainer.classList.add("hidden");
        if (selectedSubject) {
            Object.keys(materialsData[selectedSubject]).forEach(unit => {
                const option = document.createElement("option");
                option.value = unit;
                option.textContent = unit;
                unitSelect.appendChild(option);
            });
        }
    });
    // Unit Selection
    unitSelect.addEventListener("change", () => {
        const selectedSubject = subjectSelect.value;
        const selectedUnit = unitSelect.value;
        topicSelect.innerHTML = '<option value="">-- Select Topic --</option>';
        topicSelect.disabled = !selectedUnit;
        viewMaterialButton.disabled = true;
        pdfContainer.classList.add("hidden");
        if (selectedUnit) {
            materialsData[selectedSubject][selectedUnit].forEach(({ topic }) => {
                const option = document.createElement("option");
                option.value = topic;
                option.textContent = topic;
                topicSelect.appendChild(option);
            });
        }
    });
    // Topic Selection
    topicSelect.addEventListener("change", () => {
        const selectedTopic = topicSelect.value;
        viewMaterialButton.disabled = !selectedTopic;
        pdfContainer.classList.add("hidden");
    });
    // View Material Button
    viewMaterialButton.addEventListener("click", () => {
        const selectedSubject = subjectSelect.value;
        const selectedUnit = unitSelect.value;
        const selectedTopic = topicSelect.value;
        const material = materialsData[selectedSubject][selectedUnit].find(
            m => m.topic === selectedTopic
        );
        if (material) {
            pdfLink.href = material.pdf;
            pdfContainer.classList.remove("hidden");
        }
    });
});


// Navigate to the quiz page
function navigateToQuiz() {
    const subject = document.getElementById("subject").value;
    const unit = document.getElementById("unit").value;
    if (!subject || !unit) {
        alert("Please select both subject and unit.");
        return;
    }
    // Pass data via URL parameters
    window.location.href = `quiz-page.html?subject=${encodeURIComponent(subject)}&unit=${encodeURIComponent(unit)}`;
}

// Function to load quiz page content with dynamic questions
function loadQuizPage() {
    const params = new URLSearchParams(window.location.search);
    const subject = params.get("subject");
    const unit = params.get("unit");
    if (subject && unit) {
        document.querySelector("h1").textContent = `Quiz: ${subject} - ${unit}`;
        
        // Sample questions: Replace with backend call as needed
        const questions = [
            {
                type: 'mcq', // MCQ Question
                question: 'What is the capital of France?',
                options: ['Berlin', 'Madrid', 'Paris', 'Rome']
            },
            {
                type: 'truefalse', // True/False Question
                question: 'The Earth is flat.',
                options: ['True', 'False']
            },
            {
                type: 'mcq', // MCQ Question
                question: 'Which of these is a programming language?',
                options: ['HTML', 'CSS', 'JavaScript', 'All of the above']
            },
            {
                type: 'truefalse', // True/False Question
                question: 'The sun rises in the west.',
                options: ['True', 'False']
            }
        ];
        
        // Display the questions
        displayQuestions(questions);
    }
}

// Function to display questions dynamically
function displayQuestions(questions) {
    const quizForm = document.getElementById("quiz-form");
    quizForm.innerHTML = ""; // Clear previous content

    questions.forEach((q, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("quiz-question");

        const questionTitle = document.createElement("h3");
        questionTitle.textContent = `${index + 1}. ${q.question}`;
        questionDiv.appendChild(questionTitle);

        if (q.type === 'mcq') {
            // Multiple Choice Question
            q.options.forEach(option => {
                const optionLabel = document.createElement("label");
                const optionInput = document.createElement("input");
                optionInput.type = "radio";
                optionInput.name = `question-${index}`;
                optionInput.value = option;

                optionLabel.appendChild(optionInput);
                optionLabel.appendChild(document.createTextNode(option));
                questionDiv.appendChild(optionLabel);
                questionDiv.appendChild(document.createElement("br"));
            });
        } else if (q.type === 'truefalse') {
            // True/False Question
            q.options.forEach(option => {
                const optionLabel = document.createElement("label");
                const optionInput = document.createElement("input");
                optionInput.type = "radio";
                optionInput.name = `question-${index}`;
                optionInput.value = option;

                optionLabel.appendChild(optionInput);
                optionLabel.appendChild(document.createTextNode(option));
                questionDiv.appendChild(optionLabel);
                questionDiv.appendChild(document.createElement("br"));
            });
        }

        quizForm.appendChild(questionDiv);
    });
}

// End Quiz function
function endQuiz() {
    alert("Quiz ended. Your responses have been submitted.");
    window.location.href = "quiz-history.html";
}

// Dummy data for quiz history and performance
const quizHistoryData = [
    {
        subject: "Generative AI",
        unit: "Unit 1: Introduction",
        questions: [
            { question: "What is AI?", userAnswer: "B", correctAnswer: "A" },
            { question: "What is ML?", userAnswer: "C", correctAnswer: "C" },
        ]
    },
    {
        subject: "Machine Learning",
        unit: "Unit 2: Unsupervised Learning",
        questions: [
            { question: "What is clustering?", userAnswer: "A", correctAnswer: "A" },
            { question: "What is PCA?", userAnswer: "D", correctAnswer: "C" },
        ]
    }
];
const performanceSummary = {
    score: "80%",
    strengthTopics: ["AI Basics", "Clustering"],
    weaknessTopics: ["Introduction to PCA"]
};
// Load quiz history and performance
window.onload = function() {
    loadQuizHistory();
    loadPerformanceSummary();
};
function loadQuizHistory() {
    const historyList = document.getElementById("quiz-history-list");
    historyList.innerHTML = ""; // Clear previous content
    quizHistoryData.forEach(record => {
        const subjectHeader = document.createElement("h3");
        subjectHeader.textContent = `${record.subject} - ${record.unit}`;
        historyList.appendChild(subjectHeader);

        record.questions.forEach(q => {
            const questionDiv = document.createElement("div");
            const isCorrect = q.userAnswer === q.correctAnswer;

            questionDiv.innerHTML = `
                <p><strong>${q.question}</strong></p>
                <p>Your Answer: <span class="${isCorrect ? 'correct-answer' : 'wrong-answer'}">${q.userAnswer}</span></p>
                ${!isCorrect ? `<p>Correct Answer: <span class="correct-highlight">${q.correctAnswer}</span></p>` : ""}
            `;
            historyList.appendChild(questionDiv);
        });
    });
}
function loadPerformanceSummary() {
    document.getElementById("quiz-score").textContent = performanceSummary.score;
    const strengthList = document.getElementById("strength-list");
    performanceSummary.strengthTopics.forEach(topic => {
        const li = document.createElement("li");
        li.textContent = topic;
        strengthList.appendChild(li);
    });
    const weaknessList = document.getElementById("weakness-list");
    performanceSummary.weaknessTopics.forEach(topic => {
        const li = document.createElement("li");
        li.textContent = topic;
        weaknessList.appendChild(li);
    });
}
function retakeWeaknessQuiz() {
    window.location.href = "quiz-page.html";
}