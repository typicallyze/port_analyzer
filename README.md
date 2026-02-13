# 📊 GitHub Portfolio Analyzer

A sleek, modern web tool that evaluates any GitHub profile and generates an **objective Portfolio Score (0–100)** across 7 weighted categories. Built for developers, recruiters, and anyone who wants data-driven insights into a GitHub presence.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![GitHub API](https://img.shields.io/badge/GitHub-REST%20API%20v3-181717?logo=github&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **🔍 Profile Analysis** — Enter any GitHub username or profile URL to get a comprehensive breakdown
- **📈 Portfolio Score** — Animated 0–100 score ring with letter grades (A+ to F)
- **📊 7 Scoring Categories** — Each with individual progress bars and weights:

  | Category               | Weight |
  |------------------------|--------|
  | Repository Quality     | 25%    |
  | Documentation          | 20%    |
  | Code Diversity         | 15%    |
  | Commit Activity        | 15%    |
  | Community Engagement   | 10%    |
  | Profile Completeness   | 10%    |
  | Repo Completeness      | 5%     |

- **💪 Strengths Detection** — Highlights what's impressive from a recruiter's perspective
- **🚩 Red Flags** — Surfaces issues that may concern hiring teams
- **💡 Actionable Recommendations** — Prioritized (High / Medium / Low) suggestions to improve your profile
- **🌐 Language Distribution** — Visual stacked bar chart of languages used across repos
- **⭐ Top Repositories** — Showcases your best work with stars, forks, and language tags
- **🔑 Optional Auth Token** — Add a GitHub personal access token to increase rate limits (60 → 5,000 req/hr)

---

## 🎨 Design

- **Red & Black Glassmorphism** — Premium dark theme with crimson accents
- **Glass Cards** — `backdrop-filter: blur(20px)` frosted glass panels with gradient borders
- **Glowing Effects** — Score rings, progress bars, and buttons with `box-shadow` and `text-shadow` glows
- **Smooth Animations** — Staggered fade-ins, score counting, shimmer skeletons, and floating orb particle
- **Fully Responsive** — Mobile-first grid layout down to 320px

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/github-portfolio-analyzer.git
cd github-portfolio-analyzer

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will open at **http://localhost:3000**.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | Component-based UI |
| **Vite 5** | Fast dev server with HMR |
| **Vanilla CSS** | Custom design system — no frameworks |
| **GitHub REST API v3** | Fetching profile, repos, events, languages, READMEs |

---

## 📁 Project Structure

```
├── index.html                  # Entry HTML with SEO meta tags
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Main orchestrator component
    ├── styles/
    │   └── index.css           # Global design system (red/black glassmorphism)
    ├── services/
    │   └── github.js           # GitHub API service (auth, rate limits, pagination)
    ├── utils/
    │   └── analyzer.js         # Scoring engine (7 categories, strengths, red flags)
    └── components/
        ├── Header.jsx           # App title and description
        ├── SearchForm.jsx       # Input + analyze button + token toggle
        ├── ScoreRing.jsx        # Animated SVG score ring with counter
        ├── CategoryBreakdown.jsx # 7-category progress bars
        ├── StrengthsCard.jsx    # Green checkmark strengths list
        ├── RedFlagsCard.jsx     # Warning flag issues list
        ├── RecommendationsCard.jsx # Prioritized action items
        ├── RepoHighlights.jsx   # Top repo cards grid
        ├── LanguageChart.jsx    # Stacked language bar + legend
        ├── ProfileHeader.jsx    # Avatar, name, bio, stats
        ├── LoadingSkeleton.jsx  # Shimmer loading state
        └── ErrorMessage.jsx     # Error display
```

---

## 📖 How It Works

1. **Input** — User provides a GitHub username or profile URL
2. **Fetch** — The app calls the GitHub REST API to gather:
   - User profile (bio, followers, links)
   - Public repositories (up to 100, sorted by recency)
   - Per-repo languages and README metadata (top 15 repos)
   - Public events (pushes, PRs, issues)
3. **Analyze** — The scoring engine evaluates data across 7 weighted categories
4. **Score** — A weighted average produces the overall 0–100 Portfolio Score
5. **Insights** — Pattern detection surfaces strengths, red flags, and recommendations
6. **Render** — Results are displayed with animated score ring, category bars, insight cards, and repo grid

---

## ⚙️ API Rate Limits

| Mode | Limit |
|------|-------|
| **Without token** | 60 requests/hour |
| **With token** | 5,000 requests/hour |

Each profile analysis uses approximately **35–50 requests** (1 profile + 1 repos list + 1 events + ~30 per-repo detail calls).

To add a token, click **"🔑 Add GitHub Token"** below the search bar. Generate one at [github.com/settings/tokens](https://github.com/settings/tokens) — no scopes required.

---

## 📊 Scoring Methodology

Each category is scored 0–100 independently, then combined via weighted average:

- **Repository Quality** — Stars (log scale), forks, descriptions, topics
- **Documentation** — README presence, README richness (500+ chars), descriptions, licenses
- **Code Diversity** — Language count and Shannon entropy balance
- **Commit Activity** — Push events in last 90 days, recently active repos, any activity in last 30 days
- **Community Engagement** — PR events, issue events, forks received, watchers
- **Profile Completeness** — Name, bio, avatar, blog, company, location, followers
- **Repo Completeness** — Non-fork ratio, original repo count, homepage links

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [GitHub REST API](https://docs.github.com/en/rest) for the data
- [Inter](https://rsms.me/inter/) for the typography
- Built with ❤️ using React and Vite
