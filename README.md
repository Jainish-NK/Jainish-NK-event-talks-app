# BigQuery Release Notes Tracker

A sleek, premium real-time dashboard for tracking Google BigQuery release notes. Built with a **Python Flask** backend and a responsive, glassmorphic **Vanilla HTML, CSS, and JavaScript** frontend.

## 🚀 Features

- **Live RSS parsing**: Fetches and parses Google's official BigQuery Atom release feed (`https://docs.cloud.google.com/feeds/bigquery-release-notes.xml`) in real time.
- **Smart Categorization**: Parses note HTML content on-the-fly to extract and tag updates as `Announcements`, `Features`, `Fixes`, or `Deprecations`.
- **Overview Statistics Dashboard**: Dynamically computes statistics for the loaded dataset in the sidebar.
- **Advanced Filtering & Search**: Instant, client-side search indexing across titles, categories, and content, complete with category tags and active filter chips.
- **Social Sharing Integration**: Built-in Twitter/X intent generator to compose a formatted, character-limited tweet preview for any release note with a single click.
- **Aesthetic Cyber-Dark Design**: High-fidelity dark mode with glowing accents, slide-up entry animations, loading skeletons, and custom styling for code elements.

---

## 🛠️ Tech Stack

- **Backend**: Python 3, Flask
- **Frontend**: HTML5 (Semantic), Vanilla CSS3 (Custom Variables, Animations), Javascript (ES6)
- **External Resources**: Google Fonts (Inter, Outfit), FontAwesome Icons

---

## 📁 File Structure

```
├── app.py                  # Python Flask server & RSS Parser
├── requirements.txt        # Python dependencies
├── .gitignore              # Git ignore configuration
├── README.md               # Project documentation
├── templates/
│   └── index.html          # Main HTML page structure
└── static/
    ├── css/
    │   └── style.css       # Slate-dark stylesheet and animations
    └── js/
        └── main.js         # Interactive filtering, search, and sharing logic
```

---

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Jainish-NK/Jainish-NK-event-talks-app.git
   cd Jainish-NK-event-talks-app
   ```

2. **Install dependencies**:
   Make sure you have Python installed, then run:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**:
   Start the local Flask development server:
   ```bash
   python app.py
   ```

4. **Access the application**:
   Open your browser and navigate to:
   [http://127.0.0.1:5000](http://127.0.0.1:5000)
