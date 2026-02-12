# คุณคือเฉดสีการเมืองไหน? | Thai Political Shade Quiz

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-orange?logo=cloudflare)](https://pages.cloudflare.com)
[![Version](https://img.shields.io/badge/version-3.17.0-blue)](https://github.com/bejranonda/FindYourShade/releases)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-findyourshade.autobahn.bot-brightgreen)](https://findyourshade.autobahn.bot/)

> **แบบทดสอบหาเฉดสีการเมืองไทย** - มาเป็นสีอะไรกันแน่ในสมการการเมืองไทยยุคนี้?

A fun, interactive quiz to discover your political shade in Thailand's political landscape. Built with vanilla JavaScript and deployed on Cloudflare Pages.

---

## 🎯 Features

### 12 Political Shade Categories

| Shade | Thai Name | Description |
|-------|-----------|-------------|
| 🥊 | แดงน้ำหมาก (Nam Mak) | Traditionalist Red - Fighter who values loyalty |
| 🍼 | แดงนมผง (Nom Phong) | New Gen Red - Analytical bridge-builder |
| 🍷 | แดงมาดาม (Madam) | Sophisticated Red - Progressive pragmatist |
| ✨ | แดงดารา (Dara) | Celebrity Red - Pop culture progressive |
| 🍊👓 | ส้มวิชาการ (Academic Orange) | Academic - Evidence-based progressive |
| 🧡🔥 | ส้มแบก (Fandom Orange) | Fandom - Passionate movement supporter |
| 🎗️ | เหลืองคลาสสิก (Classic Yellow) | Classic - Traditional conservative |
| 👑 | เหลืองสถาบัน (Royalist) | Royalist - Institution protector |
| 🔵 | น้ำเงิน (Blue) | Blue - Establishment moderate |
| 🌩️ | ฟ้า (Sky Blue) | Sky Blue - Progressive reformer |
| 🪖 | เขียว (Green) | Green - Military-affiliated |
| 🏳️ | ขาว (Silent White) | White - Silent majority |

### Interactive Experience

- **🎨 Category-Specific Emoji Rain** - Each result triggers unique celebration animations (80 emojis)
- **🔊 8-bit Sound System** - Procedural sound effects via Web Audio API (Beep, Select, Win)
- **📊 Global Statistics** - Real-time rankings persisted in Cloudflare D1 database
- **⬅️ Back Navigation** - Review and change answers at any time
- **🌐 Bilingual Support** - Thai and English interface
- **📱 Responsive Design** - Works seamlessly on mobile and desktop

### Production Ready

- **⚡ Tailwind CSS v3** - Properly bundled and minified (no CDN dependencies)
- **🗄️ Cloudflare D1** - Serverless SQLite database for global stats
- **🚀 Pages Functions** - Serverless API endpoints
- **🔒 Security Headers** - CSP, XSS protection, frame denial
- **📦 Cache-Busting** - Versioned assets for fresh deployments

---

## 🚀 Live Demo

**[https://findyourshade.autobahn.bot/](https://findyourshade.autobahn.bot/)**

---

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/bejranonda/FindYourShade.git
cd FindYourShade

# Install dependencies
npm install

# Build CSS
npm run build:css

# Start local server
npx serve .
```

### Build Commands

| Command | Description |
|---------|-------------|
| `npm run build:css` | Build minified Tailwind CSS |
| `npm run watch:css` | Watch for CSS changes during development |

---

## ☁️ Cloudflare Pages Deployment

### Automatic Deployment

The site automatically deploys from the `master` branch.

**Build Settings:**
- Build command: `npm run build:css`
- Build output directory: `/`
- Node.js version: `18` or newer

### Manual Deployment

```bash
wrangler pages deploy . --project-name=findyourshade
```

---

## 🗄️ Cloudflare D1 Database Setup

For global statistics to work, set up Cloudflare D1:

### 1. Create D1 Database

```bash
wrangler d1 create DB --name=findyourshade-db
```

### 2. Apply Schema

```bash
wrangler d1 execute DB --remote --file=schema.sql
```

This creates two tables:
- `stats` - Stores final quiz results
- `answers` - Stores individual answer choices for analytics

### 3. Configure Binding

The database is pre-configured in `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "DB"
database_id = "7e5bd3e8-425c-4447-b340-60cbc14c57f6"
```

### 4. Deploy

```bash
wrangler pages deploy . --project-name=findyourshade
```

---

## 🔌 API Endpoints

### POST /api/save

Save a quiz result to the database.

**Request:**
```json
{
  "id": "NAM_MAK"
}
```

**Valid Categories:** `NAM_MAK`, `NOM_PHONG`, `MADAM`, `DARA`, `ORANGE`, `BLUE`, `SKY_BLUE`, `ORANGE_ACADEMIC`, `ORANGE_FAN`, `YELLOW_CLASSIC`, `YELLOW_ROYALIST`, `GREEN`, `WHITE`

**Response:**
```json
{
  "success": true
}
```

### GET /api/stats

Retrieve global statistics.

**Response:**
```json
{
  "NAM_MAK": 1234,
  "NOM_PHONG": 567,
  "BLUE": 890
}
```

**Caching:** Response is cached for 60 seconds.

### POST /api/answer

Save an individual answer choice to the database for detailed analytics.

**Request:**
```json
{
  "questionId": 0,
  "choiceIndex": 3,
  "sessionId": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
}
```

**Parameters:**
- `questionId` (integer): Question number (0-7)
- `choiceIndex` (integer): Selected choice index (0-9)
- `sessionId` (string): UUID v4 identifying the quiz session

**Response:**
```json
{
  "success": true
}
```

### GET /api/answers

Retrieve answer statistics for analytics.

**Get all question stats:**
```
GET /api/answers
```

**Response:**
```json
{
  "0": { "0": 150, "1": 89, "2": 45 },
  "1": { "0": 120, "1": 200, "3": 50 }
}
```

**Get specific question stats:**
```
GET /api/answers?questionId=0
```

**Response:**
```json
{
  "questionId": 0,
  "choices": {
    "0": 150,
    "1": 89,
    "2": 45
  }
}
```

**Caching:** Response is cached for 60 seconds.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Core structure and semantic markup |
| **Vanilla JavaScript** | Quiz logic, state management, sound engine |
| **Tailwind CSS v3** | Utility-first CSS framework |
| **Cloudflare D1** | Serverless SQLite database |
| **Cloudflare Pages Functions** | Serverless API endpoints |
| **Web Audio API** | Procedural 8-bit sound effects |
| **CSS Animations** | Emoji rain effects and transitions |
| **Google Fonts** | Kanit (Thai) & Press Start 2P (8-bit font) |

---

## 📁 Project Structure

```
FindYourShade/
├── index.html              # Main HTML (bilingual Thai/English)
├── css/
│   ├── input.css           # Tailwind CSS entry point
│   ├── tailwind.css        # Built Tailwind CSS (generated)
│   └── style.css           # Custom styles and animations
├── js/
│   └── app.js              # Main application logic
├── functions/
│   └── api/
│       ├── save.js         # POST /api/save - Save result to D1
│       ├── stats.js        # GET /api/stats - Get stats from D1
│       ├── answer.js       # POST /api/answer - Save individual answer
│       └── answers.js      # GET /api/answers - Get answer statistics
├── schema.sql              # D1 database schema
├── package.json            # Dependencies and build scripts
├── tailwind.config.js      # Tailwind configuration
├── wrangler.toml           # Cloudflare configuration
├── _headers                # Security and caching headers
├── _redirects              # URL redirection rules
└── README.md               # This file
```

---

## 🎮 How to Play

1. Open the website
2. Click **"เริ่มวิเคราะห์ตัวตน"** (Start Analysis)
3. Answer 7 questions about your political views
4. Discover your political shade!
5. View global statistics or share your result

---

## 📝 Changelog

### v3.17.0 (2025-02-12)
- **Improved:** Better score balance for all 13 political shades
- **Improved:** แดงดารา (DARA) max score increased from 15 to 20 (+5)
- **Improved:** ส้มแอบเนียน (ORANGE) max score increased from 13 to 16 (+3)
- **Improved:** Question 5 changed from party-specific to "reform-change" topic
- **Improved:** Split Q2 answers to differentiate NAM_MAK vs ORANGE_FAN
- **New:** Added `/api/clear-answers` endpoint for database maintenance
- **Database:** Cleared old answers data to match new question structure
- **Docs:** Added `scripts/clear-answers.sql` for manual database cleanup

### v3.16.0 (2025-02-12)
- **New:** Normalized percentage calculation for fair cross-shade comparison
- **Improved:** Percentage now represents "how well you match this shade" on a comparable scale
- **Fixed:** Runner-up percentages are now correctly ordered (highest first)
- **Algorithm:** Uses average max possible score normalization to balance different shade opportunities
  - Formula: `normalizedScore = score × (avgMax / maxPossible)`
  - All shades can now achieve 100% with perfect answers
  - Same percentage across different shades now represents comparable match levels

### v3.15.0 (2025-02-12)
- **Improved:** Stats page now shows player count with percentage (e.g., "3,536 (62.1%)")
- **Improved:** Percentage displayed to 1 decimal place for better accuracy
- **Fixed:** Stats API cache reduced from 60s to 10s for near real-time updates
- **Fixed:** Added cache-busting to prevent stale stats display

### v3.14.0 (2025-02-12)
- **New:** Individual answer tracking - saves each choice to D1 database
- **New:** Session ID generation for tracking complete quiz sessions
- **New:** `/api/answer` endpoint - POST to save individual answers
- **New:** `/api/answers` endpoint - GET answer statistics per question
- **Database:** Added `answers` table with session tracking
- **Analytics:** Foundation for detailed question-level statistics

### v3.13.0 (2025-02-12)
- **New:** Share button with subtle gradient animation
- **New:** Total players count on stats page
- **Fixed:** Screenshot watermark centering
- **Fixed:** Runner-up section spacing
- **Improved:** Screenshot function with clean inline layout
- **Changed:** "ดูผลลัพธ์จากผู้เล่น" → "ดูผลลัพธ์จากผู้เล่นอื่น"

### v3.12.3 (2025-02-12)
- **Fixed:** Updated footerRelease version (was stuck at v3.6.1)
- **Changed:** "ดูผลลัพธ์จากผู้เล่น" → "ดูผลลัพธ์จากผู้เล่นอื่น"
- **Improved:** Better spacing in runner-up section

### v3.12.2 (2025-02-12)
- **Fixed:** Removed duplicate camera emoji from share button
- **Improved:** Runner-up emojis larger (text-5xl) with better spacing (gap-10)
- **Improved:** Added border separator above runner-ups section

### v3.12.1 (2025-02-12)
- **Fixed:** Main emoji size restored to text-8xl (was too small)
- **Fixed:** Runner-up emojis increased to text-4xl
- **Fixed:** Share button text visibility with inline gradient style
- **Fixed:** Watermark centering in screenshot

### v3.12.0 (2025-02-12)
- **New:** Result page shows percentage match (e.g., "85% ตรงกับคุณ")
- **New:** Total players count displayed on result page
- **New:** Runner-up shades (2nd & 3rd place) with percentages
- **New:** Share button with screenshot functionality using html2canvas
- **New:** Watermark "thalay.eu/shade2569" on shared images
- **Improved:** Result page layout with better visual hierarchy

### v3.11.1 (2025-02-12)
- **Fixed:** Desktop text sizes using CSS media queries (!important)
  - Title: 28px (was 24px)
  - Description: 18px (was 16px)
  - Button: 20px (was 18px)
  - Color wheel: 160px (was 150px)

### v3.11.0 (2025-02-12)
- **Improved:** Desktop typography - larger, more readable text
- **Improved:** Larger color wheel on desktop (150px vs 120px)
- Title: text-2xl → text-3xl on desktop
- Description: text-base → text-lg on desktop
- Button: text-lg → text-xl on desktop

### v3.10.1 (2025-02-12)
- **Fixed:** Cache-busting version numbers for CSS/JS assets
- Ensures color wheel animation loads correctly after deployment

### v3.10.0 (2025-02-12)
- **Improved:** Better spacing between color wheel and title on start screen

### v3.9.0 (2025-02-12)
- **Improved:** Animated spinning color wheel on start screen (replaces static icon)
- **Visual:** Added 12-color wheel representing all political shades
- **UX:** More engaging game-like introduction with glow effects

### v3.8.0 (2025-02-12)
- **Added:** Randomized answer order for each question (Fisher-Yates shuffle)
- **Improved:** Fairness - answers are shuffled every time to prevent order bias

### v3.7.0 (2025-02-11)
- **Fixed:** Title updated to be more inclusive of all political shades
- **Added:** D1 database binding configured for global stats persistence
- **Fixed:** wrangler.toml with proper `pages_build_output_dir` for deployment
- **Changed:** Stats text shortened from "สถิติผลลัพธ์จากผู้เล่น" to "ผลลัพธ์จากผู้เล่น"
- **Simplified:** Removed canvas-confetti library, using CSS emoji rain only
- Each political shade now has unique symbols (80 emojis per celebration)

### v3.6.0 (2025-02-10)
- **Added:** Category-specific emoji rain celebration
- Each political shade has unique symbols
- **Removed:** Fireworks/side-shooting confetti (simplified)

### v3.5.0 (2025-02-10)
- **Added:** Cloudflare D1 database for global stats
- **Added:** Pages Functions (`/api/save`, `/api/stats`)
- **Added:** Back button to review and change answers
- **Improved:** Fallback to localStorage if API unavailable

### v3.4.0 (2025-02-10)
- **Added:** Back button navigation for answer review
- **Improved:** Answer history tracking with score recalculation

### v3.3.0 (2025-02-10)
- **Added:** wrangler.toml for Cloudflare Pages configuration
- **Added:** MIT License
- **Infrastructure:** GitHub connected to Cloudflare Pages

### v3.2.0 (2025-02-10)
- **Fixed:** Removed stale submodule reference
- **Added:** Production-ready Tailwind CSS build process
- **Added:** package.json with build scripts

### v3.1.0
- **Added:** Global stats display
- **Updated:** Category descriptions for balanced tone

### v3.0.0-RETRO
- Initial retro arcade-themed release

---

## 📝 Disclaimer

**Thai:**
แบบทดสอบนี้สร้างขึ้นเพื่อความบันเทิงและการเสียดสีสังคมเท่านั้น มิได้มีเจตนาสร้างความแตกแยกหรือส่งเสริมแนวคิดใดๆ ทั้งสิ้น

**English:**
This quiz is created for entertainment and social commentary purposes only. It is not intended to create division or promote any specific political ideology.

---

## 📄 License

[MIT License](LICENSE) - feel free to fork and modify!

---

## 🔗 Links

- **Live Demo:** [findyourshade.autobahn.bot](https://findyourshade.autobahn.bot/)
- **GitHub:** [github.com/bejranonda/FindYourShade](https://github.com/bejranonda/FindYourShade)
- **Powered by:** [thalay.eu](https://thalay.eu)
- **Sequel Game:** [Sim Thailand 2569](https://thalay.eu/sim2569)

---

Made with 🇹🇭 for Thai politics enthusiasts
