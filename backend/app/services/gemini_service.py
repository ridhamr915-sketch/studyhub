import json
import logging
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from app.core.config import settings

logger = logging.getLogger("studyhub.gemini")

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client_available = False
        self.model = None
        
        if self.api_key and self.api_key != "YOUR_GEMINI_API_KEY":
            try:
                genai.configure(api_key=self.api_key)
                # Try preferred flash models
                self.model = genai.GenerativeModel("gemini-1.5-flash")
                self.client_available = True
                logger.info("Gemini API successfully configured.")
            except Exception as e:
                logger.warning(f"Could not initialize Gemini model: {e}")
                self.client_available = False

    def check_connection(self) -> Dict[str, Any]:
        """Returns the status of the Gemini API configuration."""
        return {
            "configured": bool(self.api_key and self.api_key != "YOUR_GEMINI_API_KEY"),
            "active": self.client_available,
            "model": "gemini-1.5-flash" if self.client_available else "fallback-engine"
        }

    def answer_question(self, question: str, document_context: str = "", history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Answers a student's question grounded in the provided document context.
        Prioritizes document text, avoids hallucination, and clearly distinguishes
        document knowledge from general knowledge.
        """
        history = history or []
        doc_available = bool(document_context and len(document_context.strip()) > 30)

        prompt = f"""You are StudyHub AI, an expert academic tutor for college engineering and computer science students.
The student has asked a study question.

DOCUMENT CONTEXT:
\"\"\"
{document_context[:18000] if doc_available else "No specific document selected. Provide an accurate academic answer based on college curriculum."}
\"\"\"

CONVERSATION HISTORY:
{json.dumps(history[-6:], indent=2) if history else "None"}

STUDENT QUESTION:
{question}

INSTRUCTIONS:
1. Grounding: If the document contains the relevant information, answer directly from it and cite the page numbers if page markers like '--- [Page X] ---' exist.
2. Distinguish: If the document does NOT contain the answer, explicitly state:
   "ℹ️ Note: This topic is not covered in your uploaded document. Here is the explanation from general engineering knowledge:"
   Then provide a clear, accurate, high-scoring university level answer.
3. Formatting: Use clean Markdown with bold headers, bullet points, and code snippets where relevant.
4. Accuracy: Do NOT invent fake page numbers or fabricate document citations.
"""

        if self.client_available:
            try:
                response = self.model.generate_content(prompt)
                answer_text = response.text
                
                # Detect source tags
                has_doc_grounding = doc_available and ("--- [Page" in document_context) and ("not covered" not in answer_text.lower())
                sources = []
                if has_doc_grounding:
                    sources.append({"type": "document", "name": "Uploaded Study Resource", "confidence": "high"})
                else:
                    sources.append({"type": "general_knowledge", "name": "Computer Science Knowledge Base", "confidence": "curriculum"})

                return {
                    "answer": answer_text,
                    "sources": sources,
                    "model_used": "gemini-1.5-flash"
                }
            except Exception as e:
                logger.error(f"Gemini API error during question answering: {e}")
                # Fall through to algorithmic generator

        # Algorithmic fallback response
        fallback_answer = self._generate_fallback_answer(question, document_context)
        return {
            "answer": fallback_answer["text"],
            "sources": fallback_answer["sources"],
            "model_used": "studyhub-tutor-core (fallback/offline mode)"
        }

    def generate_notes(self, topic: str, document_context: str = "", note_type: str = "detailed") -> Dict[str, Any]:
        """
        Generates structured notes according to the selected note type.
        """
        note_type_instructions = {
            "short": "Create high-yield revision bullet points, formulas, key rules, and essential highlights for last-minute exam prep.",
            "detailed": "Create a comprehensive, in-depth academic lecture guide with conceptual explanations, structural diagrams/bullet-trees, algorithms, and real-world examples.",
            "simple": "Explain this concept in extremely intuitive, beginner-friendly language with analogies, simple step-by-step logic, and zero jargon.",
            "definitions": "List all important technical terms, definitions, theorems, and key vocabulary with exact academic formulations.",
            "exam": "Format as University Examination Ready Answers: Provide 2-mark, 5-mark, and 10-mark model answers with marked keywords that get maximum marks from evaluators.",
            "qa": "Generate the Top 10 Most Frequently Asked University Questions on this topic along with structured, step-by-step solutions."
        }

        instructions = note_type_instructions.get(note_type, note_type_instructions["detailed"])
        
        prompt = f"""You are StudyHub AI, an expert academic professor creating university study notes for engineering students.

TOPIC / SUBJECT:
{topic}

NOTE TYPE REQUESTED:
{note_type.upper()} ({instructions})

DOCUMENT MATERIAL:
\"\"\"
{document_context[:20000] if document_context else "Synthesize standard B.Tech / University syllabus content."}
\"\"\"

FORMATTING REQUIREMENTS:
- Use clean Markdown with clear hierarchical headings (#, ##, ###).
- Use bullet points, comparison tables (where applicable), and code snippets where relevant.
- Emphasize important keywords in **bold**.
- Include clear, practical examples.
- Ensure the notes are immediately usable for scoring high in college examinations.
"""

        if self.client_available:
            try:
                response = self.model.generate_content(prompt)
                return {
                    "title": f"{topic} - {note_type.capitalize()} Notes",
                    "content": response.text,
                    "model_used": "gemini-1.5-flash"
                }
            except Exception as e:
                logger.error(f"Gemini notes generation error: {e}")

        # Fallback notes
        notes = self._generate_fallback_notes(topic, note_type, document_context)
        return {
            "title": f"{topic} - {note_type.capitalize()} Notes",
            "content": notes,
            "model_used": "studyhub-notes-engine (offline/template mode)"
        }

    def generate_quiz(self, topic: str, document_context: str = "", difficulty: str = "Medium", count: int = 5) -> List[Dict[str, Any]]:
        """
        Generates MCQs with 4 options, the 0-indexed correct answer, and an explanation.
        """
        prompt = f"""You are an exam paper setter for a top engineering university.
Generate {count} multiple choice questions (MCQs) for the topic: "{topic}".
Difficulty level: {difficulty}.

CONTEXT MATERIAL:
\"\"\"
{document_context[:15000] if document_context else "Engineering Curriculum Syllabus"}
\"\"\"

OUTPUT FORMAT:
You MUST respond ONLY with a raw JSON array of objects. Do not include markdown code block wrappers (like ```json), just the plain JSON array.
Each object must have the following exact keys:
[
  {{
    "question_text": "What is the worst-case time complexity of QuickSort?",
    "options": ["O(n)", "O(n log n)", "O(n^2)", "O(1)"],
    "correct_answer_index": 2,
    "explanation": "QuickSort degrades to O(n^2) when the pivot selected is consistently the minimum or maximum element."
  }}
]
"""
        if self.client_available:
            try:
                response = self.model.generate_content(prompt)
                raw_text = response.text.strip()
                # Clean up if markdown backticks were added
                if raw_text.startswith("```"):
                    lines = raw_text.splitlines()
                    if lines[0].startswith("```"):
                        lines = lines[1:]
                    if lines and lines[-1].startswith("```"):
                        lines = lines[:-1]
                    raw_text = "\n".join(lines).strip()
                
                quiz_data = json.loads(raw_text)
                if isinstance(quiz_data, list) and len(quiz_data) > 0:
                    return quiz_data
            except Exception as e:
                logger.error(f"Gemini quiz generation error or json parse error: {e}")

        return self._generate_fallback_quiz(topic, count, difficulty)

    def generate_flashcards(self, topic: str, document_context: str = "", count: int = 6) -> List[Dict[str, str]]:
        """
        Generates interactive study flashcards with front (concept/prompt) and back (answer/key formula).
        """
        prompt = f"""Generate {count} high-impact revision flashcards for university students on topic: "{topic}".

CONTEXT:
\"\"\"
{document_context[:12000] if document_context else "Core Engineering Topics"}
\"\"\"

OUTPUT FORMAT:
Respond ONLY with a valid JSON array of objects with keys "front" and "back":
[
  {{
    "front": "What is Time Complexity of Binary Search?",
    "back": "O(log n) because the search space is halved at each comparison step."
  }}
]
"""
        if self.client_available:
            try:
                response = self.model.generate_content(prompt)
                raw_text = response.text.strip()
                if raw_text.startswith("```"):
                    lines = raw_text.splitlines()
                    if lines[0].startswith("```"):
                        lines = lines[1:]
                    if lines and lines[-1].startswith("```"):
                        lines = lines[:-1]
                    raw_text = "\n".join(lines).strip()
                cards = json.loads(raw_text)
                if isinstance(cards, list) and len(cards) > 0:
                    return cards
            except Exception as e:
                logger.error(f"Gemini flashcards generation error: {e}")

        return self._generate_fallback_flashcards(topic, count)

    # ----------------- Fallback Generators -----------------
    def _generate_fallback_answer(self, question: str, context: str) -> Dict[str, Any]:
        q_lower = question.lower()
        if "stack" in q_lower or "queue" in q_lower:
            text = """### Comparison: Stack vs Queue

| Feature | Stack | Queue |
| :--- | :--- | :--- |
| **Principle** | **LIFO** (Last In, First Out) | **FIFO** (First In, First Out) |
| **Key Operations** | `push()`, `pop()`, `peek()` | `enqueue()`, `dequeue()`, `front()` |
| **Pointers** | Single pointer (`top`) | Two pointers (`front` and `rear`) |
| **Applications** | Function recursion, Undo operations, Expression evaluation | CPU scheduling, Breadth-First Search (BFS), Print spoolers |

#### Core Difference
- In a **Stack**, elements are added and removed from the exact same end (called the `top`).
- In a **Queue**, elements enter from the `rear` and exit from the `front`.
"""
        elif "linked list" in q_lower:
            text = """### Linked Lists Explained

A **Linked List** is a linear data structure where elements are not stored in contiguous memory locations. Instead, each element (node) contains two parts:
1. **Data**: The value stored.
2. **Next Pointer**: Memory address of the subsequent node.

```
+--------+------+     +--------+------+     +--------+------+
| Data:10| Next |---> | Data:20| Next |---> | Data:30| NULL |
+--------+------+     +--------+------+     +--------+------+
```

#### Key Advantages:
- **Dynamic Size**: Memory is allocated at runtime as needed.
- **Efficient Insertions/Deletions**: \(O(1)\) when pointer position is known, without shifting elements.

#### Limitations:
- Sequential access required: \(O(n)\) lookup time (no direct indexing like `arr[i]`).
- Extra memory needed for pointer storage.
"""
        elif "polymorphism" in q_lower:
            text = """### Polymorphism in Object-Oriented Programming

**Polymorphism** (from Greek *poly* = many, *morph* = forms) allows an entity such as a variable, function, or object to have more than one form.

#### Types of Polymorphism:
1. **Compile-Time (Static) Polymorphism**:
   - **Method Overloading**: Methods sharing the same name but differing in parameter count or types.
   - **Operator Overloading**: Custom definitions for standard operators (`+`, `-`).
2. **Run-Time (Dynamic) Polymorphism**:
   - **Method Overriding**: Subclass provides a specific implementation of a method declared in its parent class using virtual functions.

#### Example (C++ / Java):
```java
class Shape {
    void draw() { System.out.println("Drawing generic shape"); }
}
class Circle extends Shape {
    @Override
    void draw() { System.out.println("Drawing a circle"); }
}
```
"""
        else:
            excerpt = context[:600] if context else ""
            text = f"""### Comprehensive Study Explanation

**Question:** {question}

#### Key Conceptual Points:
1. **Fundamental Definition**: This topic is central to your computer engineering curriculum.
2. **Technical Mechanism**:
   - Analyzed based on core algorithmic principles and system architecture.
   - Requires understanding both time-space trade-offs and practical hardware/software constraints.
3. **Core Properties**:
   - **Deterministic Behavior**: Follows consistent rules across test scenarios.
   - **Modularity**: Allows clean integration into larger computational pipelines.

{f'#### Reference from uploaded material:' if excerpt else ''}
{f'> "{excerpt[:300]}..."' if excerpt else ''}

*Tip: For college examinations, always draw a labeled block diagram and provide the formal definition before writing code.*
"""
        return {
            "text": text,
            "sources": [{"type": "knowledge_engine", "name": "StudyHub Academic Engine", "confidence": "high"}]
        }

    def _generate_fallback_notes(self, topic: str, note_type: str, context: str) -> str:
        return f"""# {topic} - Academic Revision Notes
**Category:** {note_type.capitalize()} Notes | **Course Level:** B.Tech / University Engineering

---

## 1. Overview & Fundamentals
The study of **{topic}** provides the algorithmic and theoretical foundation essential for software engineering and systems design.

- **Primary Goal**: Optimize computational efficiency and resource management.
- **Key Criterion**: Minimizing time complexity while keeping space utilization bounded.

## 2. Core Concepts & Architecture
### A. Structural Breakdown
1. **Input Representation**: Clear formal specification of the problem constraints.
2. **Processing Pipeline**: Sequential or parallel states transforming inputs.
3. **Output Guarantees**: Verification of correctness and edge-case handling.

### B. Standard Properties
- **Modularity**: Components are decoupled for maintainability.
- **Scalability**: Capable of handling high data throughput.
- **Robustness**: Graceful error degradation under boundary conditions.

## 3. Examination Key Definitions
- **Invariance**: A condition that holds true across every iteration of the operational loop.
- **Asymptotic Complexity**: Growth rate analysis as input size \(n \to \infty\).

## 4. Model Exam Questions & High-Scoring Tips
1. *State the primary trade-offs involved in {topic}.*
   - **Answer**: Highlight time vs space complexity trade-offs, and maintainability vs optimization.
2. *Always include a schematic diagram:*
```
[ Input Source ] ---> [ Processing Engine: {topic} ] ---> [ Validated Output ]
```

---
*Created with StudyHub 1.0 Note Generator. Ready for academic exam preparation.*
"""

    def _generate_fallback_quiz(self, topic: str, count: int, difficulty: str) -> List[Dict[str, Any]]:
        questions = [
            {
                "question_text": f"In {topic}, what is the primary metric used to evaluate algorithmic efficiency?",
                "options": ["Number of lines of code", "Time and Space Complexity", "Screen resolution", "Network baud rate"],
                "correct_answer_index": 1,
                "explanation": "Algorithmic efficiency is measured via Asymptotic Time Complexity (operations count) and Space Complexity (memory required)."
            },
            {
                "question_text": f"Which asymptotic notation represents the tightest bound (both upper and lower) for {topic}?",
                "options": ["Big-O (O)", "Big-Omega (Ω)", "Big-Theta (Θ)", "Little-o (o)"],
                "correct_answer_index": 2,
                "explanation": "Big-Theta (Θ) gives the asymptotically tight bound, bounding the function from both above and below."
            },
            {
                "question_text": f"What is a primary advantage of modular design in {topic} implementations?",
                "options": ["Slower compilation", "Decreased code maintainability", "Independent testing and code reusability", "Increased hard drive wear"],
                "correct_answer_index": 2,
                "explanation": "Modular design breaks complex systems into self-contained units that can be independently developed, tested, and reused."
            },
            {
                "question_text": "Which data structure follows the Last-In-First-Out (LIFO) operational principle?",
                "options": ["Queue", "Stack", "Binary Heap", "Hash Table"],
                "correct_answer_index": 1,
                "explanation": "A Stack operates on the LIFO principle where the last element inserted is the first one popped."
            },
            {
                "question_text": "In relational databases, which property guarantees that transactions are either fully completed or completely rolled back?",
                "options": ["Atomicity", "Consistency", "Isolation", "Durability"],
                "correct_answer_index": 0,
                "explanation": "Atomicity ensures the 'all-or-nothing' execution rule for database transactions."
            }
        ]
        return questions[:count]

    def _generate_fallback_flashcards(self, topic: str, count: int) -> List[Dict[str, str]]:
        cards = [
            {
                "front": f"What is the definition of {topic}?",
                "back": f"A foundational concept in computing focusing on structured data processing, efficiency, and system reliability."
            },
            {
                "front": "What does LIFO stand for?",
                "back": "Last-In-First-Out (used in Stacks and call recursion frames)."
            },
            {
                "front": "What does FIFO stand for?",
                "back": "First-In-First-Out (used in Queues, scheduling, and buffering)."
            },
            {
                "front": "What is the Big-O time complexity of Binary Search?",
                "back": "O(log n) on sorted arrays, because half of the remaining elements are eliminated each turn."
            },
            {
                "front": "What are ACID properties in databases?",
                "back": "Atomicity, Consistency, Isolation, Durability — the core criteria for reliable transaction processing."
            },
            {
                "front": "What is the difference between Synchronous and Asynchronous execution?",
                "back": "Synchronous blocks execution until a task finishes; Asynchronous executes tasks in the background without blocking the main thread."
            }
        ]
        return cards[:count]

gemini_service = GeminiService()
