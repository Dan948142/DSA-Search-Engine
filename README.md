# DSA Search Engine

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Language](https://img.shields.io/badge/language-JavaScript-yellow.svg)
![Status](https://img.shields.io/badge/status-Active-brightgreen.svg)

A powerful, full-stack search engine designed to help competitive programmers and interview candidates find relevant **Data Structures and Algorithms (DSA)** problems across multiple platforms in seconds.

## 🎯 Overview

DSA Search Engine is a web-based application that aggregates 3,500+ coding problems from leading competitive programming platforms and provides intelligent search functionality using TF-IDF (Term Frequency-Inverse Document Frequency) algorithm for relevance-based ranking.

### Key Features

- **Multi-Platform Aggregation**: Search problems from LeetCode, Codeforces, and CodeChef
- **Intelligent Search**: TF-IDF based ranking for highly relevant results
- **Fast Performance**: Returns search results within seconds
- **Responsive Design**: Modern, intuitive UI with animated particle background
- **Real-time Indexing**: Efficient data structures for instant retrieval
- **Direct Platform Links**: One-click access to problem statements on original platforms

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- HTML5 / CSS3 / Vanilla JavaScript
- Particle animation system for enhanced UX
- Responsive design with modern UI elements

**Backend:**
- Node.js with Express.js framework
- TF-IDF implementation using the `natural` library
- Cosine similarity for document ranking

**Data Pipeline:**
- Puppeteer for web scraping
- Stopword removal for text preprocessing
- JSON-based corpus storage

### System Architecture

```
┌─────────────────────────────────────────┐
│          Browser (Frontend)              │
│  - index.html (UI)                      │
│  - script.js (Client logic)             │
│  - style.css (Styling)                  │
└──────────────┬──────────────────────────┘
               │ (HTTP POST)
               ▼
┌─────────────────────────────────────────┐
│     Express.js Backend (index.js)        │
│  - /search endpoint                     │
│  - TF-IDF indexing                      │
│  - Cosine similarity ranking            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Data Layer                          │
│  - corpus/all_problems.json             │
│  - TF-IDF index & document vectors     │
└─────────────────────────────────────────┘
```

## 📋 Project Structure

```
DSA-Search-Engine/
├── index.html              # Main frontend interface
├── index.js                # Express server & search logic
├── script.js               # Client-side search handler
├── style.css               # Styling & animations
├── scrape.js               # Web scraping pipeline
├── package.json            # Dependencies
├── corpus/                 # Problem corpus storage
│   └── all_problems.json   # Aggregated problems data
├── problems/               # Scraped problem files
├── utils/                  # Utility functions
│   └── preprocess.js       # Text preprocessing
├── assests/                # Image assets & logos
└── .gitignore
```

## ⚙️ Core Components

### 1. **Data Collection Pipeline** (`scrape.js`)

Automated web scraping to collect problem data:

- **LeetCode Scraper**: Scrolls through problem list, fetches 1000+ problems with descriptions
- **Codeforces Scraper**: Paginates through problem set, retrieves titles, URLs, and descriptions
- Implements delays and randomization to prevent IP blocking
- Stores data in structured JSON format

```javascript
// Example problem structure
{
  "title": "Two Sum",
  "url": "https://leetcode.com/problems/two-sum/",
  "description": "Given an array of integers nums...",
  "platform": "Leetcode"
}
```

### 2. **Search Index & Ranking** (`index.js`)

Advanced TF-IDF based search implementation:

**Key Algorithms:**

- **TF-IDF Vector Space Model**: 
  - Term Frequency (TF): Frequency of term in document
  - Inverse Document Frequency (IDF): Rarity of term across corpus
  - Combined weight: `TF × IDF`

- **Cosine Similarity**: Measures angle between query and document vectors
  ```
  Similarity = (Query · Document) / (||Query|| × ||Document||)
  ```

- **Title Boosting**: Problem titles duplicated to increase relevance weight

**Performance Optimizations:**
- Pre-computed document vectors cached in memory
- Document magnitude pre-calculated for faster similarity computation
- Returns top 30 results filtered by relevance score > 0

### 3. **Text Preprocessing** (`utils/preprocess.js`)

Standardizes queries and documents:

- Lowercase conversion
- Stopword removal (the, a, is, etc.)
- Tokenization
- Special character handling

### 4. **Frontend Interface** (`index.html`, `script.js`, `style.css`)

**User Experience Features:**

- Clean, minimalist search interface
- Real-time platform logo display (LeetCode, Codeforces, CodeChef)
- Animated particle background with network visualization
- Loading spinner during search
- Responsive results display with platform badges
- Direct links to problem sources

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Chrome/Chromium browser (for web scraping)

### Installation

```bash
# Clone the repository
git clone https://github.com/Dan948142/DSA-Search-Engine.git
cd DSA-Search-Engine

# Install dependencies
npm install
```

### Configuration

No additional configuration needed for basic usage.

## 📊 Usage

### Mode 1: Use Pre-Scraped Data (Recommended for Demo)

```bash
# Start the server
npm start

# Server runs on http://localhost:3000
# Open in browser and start searching!
```

### Mode 2: Fresh Data Scraping (Advanced)

```bash
# Scrape latest problems from platforms
npm run scrape

# This generates:
# - problems/leetcode_problems.json
# - problems/codeforces_problems.json

# Merge all problem files
npm run merge

# Start the server with fresh data
npm start
```

### Search Examples

Try these queries in the search box:

- `two sum` - Basic array problems
- `dynamic programming` - DP problems
- `binary tree` - Tree data structures
- `greedy` - Greedy algorithm problems
- `hash map` - Hashing problems

## 🔍 How Search Works

1. **Query Input**: User enters search query
2. **Preprocessing**: Query is lowercased, tokenized, stopwords removed
3. **TF-IDF Computation**: Query vector computed using corpus vocabulary
4. **Cosine Similarity**: Query vector compared against all document vectors
5. **Ranking**: Results sorted by similarity score (descending)
6. **Display**: Top 30 results shown with platform information

**Example Flow:**

```
User Input: "two sum problem"
↓
Preprocessed: ["two", "sum"] (stopwords removed)
↓
TF-IDF Scores Computed
↓
Cosine Similarity with all documents
↓
Top Results: 
  1. Two Sum (Leetcode) - Score: 0.92
  2. Two Sum II (Leetcode) - Score: 0.85
  3. Sum of Two Numbers (Codeforces) - Score: 0.78
```

## 📈 Performance Characteristics

| Metric | Value |
|--------|-------|
| Total Problems Indexed | 3,500+ |
| Search Response Time | < 1 second |
| Search Results Returned | Top 30 |
| Index Build Time | ~5-10 seconds on startup |
| Memory Usage | ~50-100 MB |

## 🔧 Dependencies

```json
{
  "express": "^5.1.0",        // Web framework
  "natural": "^8.1.0",        // TF-IDF, NLP utilities
  "puppeteer": "^24.10.2",    // Web scraping
  "stopword": "^3.1.5"        // Stopword removal
}
```

## 🎓 Learning Outcomes

This project demonstrates:

- **Data Structures**: Vectors, Hash Maps for efficient search
- **Algorithms**: TF-IDF ranking, Cosine similarity
- **Backend Development**: Express.js server, API design
- **Web Scraping**: Puppeteer automation, handling dynamic content
- **Frontend Development**: DOM manipulation, async operations
- **Full-Stack Integration**: End-to-end data pipeline
- **Performance Optimization**: Caching, pre-computation

## 🚧 Future Enhancements

- [ ] Add CodeChef problem integration
- [ ] Implement problem difficulty filtering
- [ ] Add problem solving statistics per user
- [ ] Advanced filters (topic, company tags, difficulty)
- [ ] Problem recommendation engine
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Unit and integration tests
- [ ] API rate limiting and caching


## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sanskar Sovitkar**

---

**⭐ If you found this helpful, please consider giving it a star!**
