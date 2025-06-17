import fitz  
import textstat
import matplotlib.pyplot as plt
import numpy as np

# Readability Metric Ranges and Labels
READABILITY_RANGES = {
    "Flesch Reading Ease": [
        (90, 100, "Very Easy"), (80, 90, "Easy"), (70, 80, "Fairly Easy"),
        (60, 70, "Standard"), (50, 60, "Fairly Difficult"), (30, 50, "Difficult"), (0, 30, "Very Difficult")
    ],
    "Flesch-Kincaid Grade Level": [
        (0, 3, "Basic"), (3, 6, "Elementary"), (6, 9, "Middle School"),
        (9, 12, "High School"), (12, 15, "College"), (15, 18, "Post-Grad")
    ],
    "Dale-Chall Readability Score": [
        (0, 4.9, "4th Grade or Lower"), (5.0, 5.9, "5th-6th Grade"), (6.0, 6.9, "7th-8th Grade"),
        (7.0, 7.9, "9th-10th Grade"), (8.0, 8.9, "11th-12th Grade"), (9.0, 9.9, "College Level")
    ],
    "Gunning Fog Index": [
        (20, 100, "Post-Graduate+"), (17, 20, "Post-Graduate"), (16, 17, "College Senior"),
        (13, 16, "College (Freshman - Junior)"), (11, 13, "High School Senior - Junior"),
        (10, 11, "High School Sophomore"), (9, 10, "High School Freshman"),
        (8, 9, "8th Grade"), (7, 8, "7th Grade"), (6, 7, "6th Grade")
    ]
}

def extract_text_from_pdf(pdf_path):
    extracted_text = ""
    try:
        with fitz.open(pdf_path) as doc:
            for page_num in range(len(doc)):
                page = doc[page_num]
                extracted_text += page.get_text()
        return extracted_text.strip()
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None

def readability_analysis(text):
    return {
        "Flesch Reading Ease": textstat.flesch_reading_ease(text),
        "Flesch-Kincaid Grade Level": textstat.flesch_kincaid_grade(text),
        "Dale-Chall Readability Score": textstat.dale_chall_readability_score(text),
        "Gunning Fog Index": textstat.gunning_fog(text)
    }

def plot_gauge_chart(metric, score):
    fig, ax = plt.subplots(figsize=(7, 1.5))
    levels = READABILITY_RANGES[metric]
    for i, (low, high, label) in enumerate(levels):
        ax.barh(0, high - low, left=low, color=plt.cm.Blues(i / len(levels)), alpha=0.7)
    ax.scatter(score, 0, color="red", s=100, label="Score", zorder=3)
    tick_positions = [low for low, high, _ in levels] + [levels[-1][1]]
    tick_labels = [f"{low}-{high}\n{label}" for low, high, label in levels]
    ax.set_xlim(0, levels[-1][1] + 2)
    ax.set_yticks([])
    ax.set_xticks(tick_positions[:len(tick_labels)])
    ax.set_xticklabels(tick_labels, rotation=30, ha="right", fontsize=8)
    ax.set_title(f"{metric} Gauge Chart (Score: {score})", fontsize=12)
    plt.show()

def plot_radar_chart_fixed(scores):
    metrics = list(scores.keys())
    values = list(scores.values())
    values += values[:1]
    angles = np.linspace(0, 2 * np.pi, len(metrics), endpoint=False).tolist()
    angles += angles[:1]
    fig, ax = plt.subplots(figsize=(7, 7), subplot_kw=dict(polar=True))
    ax.fill(angles, values, color='blue', alpha=0.25)
    ax.plot(angles, values, color='blue', linewidth=2)
    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(metrics, fontsize=10)
    plt.subplots_adjust(left=0.2, right=0.8, top=0.85, bottom=0.2)
    ax.set_title("Readability Metrics Comparison", fontsize=12, pad=20)
    plt.show()

pdf_path = "./ncert class 8.pdf" 
extracted_text = extract_text_from_pdf(pdf_path)

if extracted_text:
    readability_scores = readability_analysis(extracted_text)
    for metric, score in readability_scores.items():
        plot_gauge_chart(metric, score)
    plot_radar_chart_fixed(readability_scores)
else:
    print("Failed to extract text from the PDF.")
