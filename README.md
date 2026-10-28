# คุณคือเฉดสีการเมืองไหน? | Thai Political Shade Quiz

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-orange?logo=cloudflare)](https://pages.cloudflare.com)
[![Version](https://img.shields.io/badge/version-4.0.2-blue)](https://github.com/bejranonda/FindYourShade/releases)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-findyourshade.autobahn.bot-brightgreen)](https://findyourshade.autobahn.bot/)

> **แบบทดสอบหาเฉดสีการเมืองไทย** - มาเป็นสีอะไรกันแน่ในสมการการเมืองไทยยุคนี้?

A fun, interactive quiz to discover your political shade in Thailand's political landscape. Built with vanilla JavaScript and deployed on Cloudflare Pages.

<img width="1020" height="651" alt="image" src="https://github.com/user-attachments/assets/fe2bee3e-d3ad-417e-9ffa-5ec289d0e67a" />

---

## 🎯 Features

### 13 Political Shade Categories

| Shade | Thai Name | Description |
|-------|-----------|-------------|
| 🥊 | แดงน้ำหมาก (Nam Mak) | Traditionalist Red - Fighter who values loyalty |
| 🍼 | แดงนมผง (Nom Phong) | New Gen Red - Analytical bridge-builder |
| 🍷 | แดงมาดาม (Madam) | Sophisticated Red - Progressive pragmatist |
| ✨ | แดงดารา (Dara) | Celebrity Red - Pop culture progressive |
| 🍊👓 | ส้มวิชาการ (Academic Orange) | Academic - Evidence-based progressive |
| 🧡🔥 | ส้มแบก (Fandom Orange) | Fandom - Passionate movement supporter |
| 🎭 | ส้มแอบเนียน (Orange) | Closeted Orange - Silent supporter with sympathies |
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

<img width="858" height="522" alt="image" src="https://github.com/user-attachments/assets/ba969d4b-4ee2-4d8d-b716-b39be2b7b112" />
*Daily players one day after release*


### Production Ready

- **⚡ Tailwind CSS v3** - Properly bundled and minified (no CDN dependencies)
- **🗄️ Cloudflare D1** - Serverless SQLite database for global stats
- **🚀 Pages Functions** - Serverless API endpoints
- **🔒 Security Headers** - CSP, XSS protection, frame denial
- **📦 Cache-Busting** - Versioned assets for fresh deployments

---

## 💡 Concept, Approach & Method

### Concept

This quiz is designed to map respondents to one of **13 political shades** in Thailand's complex political landscape. Unlike traditional left-right spectrums, Thai politics involves multiple dimensions:

- **Historical allegiance** (Yellow vs Red movements)
- **Generational divide** (Traditional vs New Gen)
- **Institutional loyalty** (Royalist vs Reformist)
- **Approach to change** (Revolutionary vs Evolutionary vs Status Quo)
- **Cultural expression** (Academic vs Pop Culture vs Mainstream)

Each shade represents a unique combination of these factors, creating a nuanced political identity map.

### Approach

#### 1. Multi-Dimensional Scoring

Rather than forcing users into a single axis, we use **multi-dimensional scoring**:

```
Each answer contributes to multiple shades simultaneously
├── Primary shade: +3 points (strong alignment)
├── Secondary shade: +2 points (moderate alignment)
└── Tertiary shade: +1 point (partial alignment)
```

This allows for **overlap detection** and more accurate shade matching.

#### 2. Normalized Percentage Calculation

To ensure fair comparison across all shades, we use **score normalization**:

```
normalizedScore = rawScore × (avgMaxScore / maxPossibleScore)

Where:
- rawScore = Total points accumulated for a shade
- avgMaxScore = Average maximum possible score across all shades (~19)
- maxPossibleScore = Maximum achievable for that specific shade
```

**Why normalization matters:**
- Different shades have different answer opportunities
- Without normalization, shades with more answer options would dominate
- Normalized scores represent "how well you match" on a comparable scale
- All shades can now achieve 100% with perfect answers

#### 3. Score Balance Optimization

Each shade has been calibrated for fair scoring:

| Shade | Max Score | Balance Status |
|-------|-----------|----------------|
| NAM_MAK | 21 | ✅ Balanced |
| NOM_PHONG | 18 | ✅ Balanced |
| MADAM | 20 | ✅ Balanced |
| DARA | 20 | ✅ Balanced (v3.17.0) |
| ORANGE_ACADEMIC | 19 | ✅ Balanced |
| ORANGE_FAN | 19 | ✅ Balanced |
| ORANGE | 16 | ✅ Balanced (v3.17.0) |
| YELLOW_CLASSIC | 19 | ✅ Balanced |
| YELLOW_ROYALIST | 21 | ✅ Balanced |
| BLUE | 20 | ✅ Balanced |
| SKY_BLUE | 19 | ✅ Balanced |
| GREEN | 20 | ✅ Balanced |
| WHITE | 18 | ✅ Balanced |

**Average max score:** ~19 points

### Method

#### Question Design Principles

1. **Scenario-Based Questions**: Each question presents a realistic political scenario rather than direct ideological questions, reducing social desirability bias.

2. **Balanced Answer Distribution**: Each question has 5-9 answer options covering the full spectrum of political views.

3. **Randomized Order**: Fisher-Yates shuffle ensures answers appear in random order to prevent position bias.

4. **Topic Diversity**: 7 questions cover different dimensions:
   - Q1: Historical allegiance
   - Q2: Core values & principles
   - Q3: Leadership preference
   - Q4: Approach to conflict
   - Q5: Reform attitudes
   - Q6: Information sources
   - Q7: Personal expression

#### Scoring Algorithm

```javascript
// Calculate raw scores
for each answer:
    for each shade in answer.score:
        scores[shade] += answer.score[shade]

// Normalize for fair comparison
avgMax = average(maxPossibleScore for all shades)
for each shade:
    normalizedScore = score[shade] * (avgMax / maxPossible[shade])
    percentage = (normalizedScore / avgMax) * 100

// Determine result
result = shade with highest normalizedScore
```

#### Result Calculation

1. **Primary Result**: Shade with highest normalized percentage
2. **Runner-ups**: 2nd and 3rd place shades with their percentages
3. **Tie-breaking**: Rare edge cases resolved by secondary score factors

### Technical Implementation

```
┌─────────────────────────────────────────────────────────┐
│                    Quiz Flow                            │
├─────────────────────────────────────────────────────────┤
│  [Start] → [Q1] → [Q2] → ... → [Q7] → [Calculate]      │
│                                      ↓                  │
│                              ┌───────────────┐          │
│                              │ Normalization │          │
│                              └───────────────┘          │
│                                      ↓                  │
│                            ┌─────────────────┐          │
│                            │ Result + Stats  │          │
│                            └─────────────────┘          │
│                                      ↓                  │
│                  ┌───────────────────────────────────┐  │
│                  │ D1 Batch Save + Counter Upserts   │  │
│                  │ (stats, stats_counts, daily_...)  │  │
│                  └───────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### Low-`rows_read` D1 Data Architecture (v4.0.2+)

Cloudflare D1 Free Tier enforces a cap of **5,000,000 `rows_read` per day**. Because `stats` has **160,000+ rows** and `answers` has **1,100,000+ rows**, running `SELECT COUNT(*) ... GROUP BY` on raw event tables scans the entire table on every call.

To keep D1 `rows_read` under **0.1%** of the daily free tier limit even under heavy traffic, FindYourShade uses a **3-tier read optimization method**:

1. **Pre-Aggregated Summary Counter Tables**:
   - `stats_counts (category_id PRIMARY KEY, count)`: Maximum **13 rows**. Updated atomically on `POST /api/save` via `INSERT ... ON CONFLICT DO UPDATE SET count = count + 1`.
   - `daily_stats_counts (date, category_id, count, PRIMARY KEY (date, category_id))`: Stores daily totals per shade (~80–390 rows for a 30-day window).
   - `answer_counts (question_id, choice_index, count, PRIMARY KEY (question_id, choice_index))`: Maximum **80 rows** across all questions and choices.
2. **Multi-Layer Caching (Browser + Cloudflare Edge Cache)**:
   - Frontend (`js/app.js`) maintains a 60-second in-memory session cache with **optimistic local increments** when a player finishes the quiz, avoiding cache-busting `?t=` query parameters.
   - Pages Functions normalize incoming request URLs (stripping any legacy `?t=` query parameters) and cache responses in Cloudflare's Edge Cache (`caches.default`) with `Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=600`.
3. **Zero-Downtime Static Snapshot Fallback**:
   - If D1 ever hits a rate/quota limit or is temporarily unavailable, both the Pages Functions and the client automatically fall back to a verified baseline snapshot (`X-Stats-Source: static-fallback`) merged with `localStorage`.

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

### 2. Apply Schema & Summary Table Migration

```bash
# Apply full schema (for new databases)
wrangler d1 execute DB --remote --file=schema.sql

# Or migrate an existing database to pre-aggregated summary tables
wrangler d1 execute DB --remote --file=scripts/migrate-summary-tables.sql
```

This creates:
- `stats` - Raw log of quiz results (`category_id`, `created_at`)
- `stats_counts` - Pre-aggregated global totals per shade (max 13 rows, used by `GET /api/stats`)
- `daily_stats_counts` - Pre-aggregated daily totals per shade (used by `GET /api/daily-stats`)
- `answer_counts` - Pre-aggregated choice totals per question (max 80 rows, used by `GET /api/answers`)
- `answers` - Legacy raw answer log

> **Note:** All Pages Functions also include automatic self-initialization and backfill logic if summary tables do not exist yet.

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

**Caching:** Cached for 60s in browser, 300s at Cloudflare Edge (`caches.default`), and 60s in client session memory. Includes `X-Stats-Source: d1-summary | static-fallback` header.

### GET /api/daily-stats

Retrieve 30-day rolling daily statistics and Z-score anomaly detection (`|Z| > 2`).

**Response:**
```json
{
  "dailyData": [
    { "date": "2026-10-28", "total": 21, "NOM_PHONG": 7, "ORANGE_ACADEMIC": 3 }
  ],
  "categories": ["NOM_PHONG", "ORANGE_ACADEMIC"],
  "anomalies": [
    { "date": "2026-10-28", "total": 21, "type": "high", "zscore": 3.75, "avg": 4.5, "message": "สูงกว่าปกติ 188%" }
  ],
  "summary": {
    "totalDays": 25,
    "avgPerDay": 4.5,
    "stdDev": 4.4,
    "maxInDay": 21,
    "minInDay": 0
  }
}
```

**Caching:** Cached for 120s in browser and 300s at Cloudflare Edge (`caches.default`).

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

**Caching:** Cached for 120s in browser and 300s at Cloudflare Edge (`caches.default`). Includes `X-Stats-Source: d1-summary | static-fallback` header.

### POST /api/clear-answers

Clear `answers` and `answer_counts` tables when quiz questions are modified (requires confirmation payload `{ "confirm": "CLEAR_ANSWERS" }`).

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
│       ├── save.js         # POST /api/save - Save result + increment summary counters
│       ├── stats.js        # GET /api/stats - Get global stats from summary table
│       ├── answer.js       # POST /api/answer - Increment question choice counter
│       ├── answers.js      # GET /api/answers - Get answer statistics from summary table
│       ├── daily-stats.js  # GET /api/daily-stats - Daily stats + anomaly detection
│       └── clear-answers.js # POST /api/clear-answers - Clear answer statistics
├── scripts/
│   ├── clear-answers.sql           # Manual SQL to clear answer tables
│   └── migrate-summary-tables.sql  # SQL migration for pre-aggregated summary tables
├── docs/
│   ├── KNOWLEDGE.md        # Domain & technical knowledge base
│   ├── KNOWN-ISSUES.md     # Root-cause analysis & known issues log
│   └── GUIDELINES.md       # Engineering, D1 database, and release guidelines
├── HANDOFF.md              # Engineering handoff & operations guide
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

### v4.0.2 (2026-10-28)
- **Performance (D1):** Reduced Cloudflare D1 `rows_read` by >99.9% (from 160,240+ rows per request down to 13–80 rows on cache miss and 0 rows on cache hit)
- **Database:** Added pre-aggregated summary counter tables (`stats_counts`, `daily_stats_counts`, `answer_counts`) and `idx_stats_created_at` index in `schema.sql` and `scripts/migrate-summary-tables.sql`
- **Caching:** Added Cloudflare Edge Cache (`caches.default`) with normalized cache keys (stripping legacy `?t=` query params) and `stale-while-revalidate` headers across all `GET` endpoints
- **Frontend:** Removed `?t=${Date.now()}` cache-busting on `/api/stats` and `/api/daily-stats`, added 60s in-memory session cache with optimistic local increments on quiz completion
- **Reliability:** Added zero-downtime static snapshot fallbacks (`X-Stats-Source: static-fallback`) when D1 free-tier daily cap is reached, and fixed `localStorage` stats merge to add rather than overwrite counts
- **Docs:** Added `HANDOFF.md`, `docs/KNOWLEDGE.md`, `docs/KNOWN-ISSUES.md`, and `docs/GUIDELINES.md`

### v4.0.1 (2025-02-15)
- **New:** Added X/Twitter link to header next to Facebook

### v4.0.0 (2025-02-13)
- **Major Release:** Complete transparency & citizen verification system
- **New:** Daily trend line chart with interactive legend
- **New:** Tooltip shows all 13 political shades on hover
- **New:** "วันนี้" (Today) counter instead of minimum
- **New:** Social media share buttons (LINE, Facebook, Twitter/X)
- **New:** Web Share API with image support for mobile
- **New:** `/api/daily-stats` endpoint with 30-day rolling data
- **New:** Anomaly detection using Z-score algorithm
- **UX:** Click legend to toggle chart lines on/off
- **UX:** Neutral language for anomalies ("สูงกว่าปกติ")
- **Dependency:** Added Chart.js for chart rendering

### v3.20.0 (2025-02-13)
- **New:** Daily trend chart showing political shades obtained each day
- **New:** `/api/daily-stats` endpoint with 30-day rolling data
- **New:** Anomaly detection using Z-score algorithm (>2 std dev)
- **New:** Summary statistics (avg/day, max, min) on stats page
- **UX:** Neutral language for anomalies ("สูงกว่าปกติ" not "น่าสงสัย")
- **UX:** Transparent data visualization for citizen verification
- **Dependency:** Added Chart.js for chart rendering

### v3.19.4 (2025-02-13)
- **Improved:** Better desktop/mobile detection for Web Share API
- **Improved:** Desktop browsers now get text-only share if file share not supported
- **Fixed:** Handle user cancel (AbortError) gracefully without fallback
- **Fixed:** Download image on desktop even when text-only share succeeds

### v3.19.3 (2025-02-13)
- **Fixed:** Removed duplicate social share function definitions
- **Fixed:** Better error handling in `shareWithImage()` with try/catch
- **Fixed:** Proper blob handling with reject on null

### v3.19.2 (2025-02-13)
- **Improved:** Social share now uses Web Share API with image support (mobile)
- **New:** `generateResultCanvas()` function for reusable image generation
- **New:** `shareWithImage()` - unified share function with Web Share API
- **UX:** Mobile users can share image + text together via native share sheet
- **UX:** Desktop users get image download + share URL fallback

### v3.19.1 (2025-02-13)
- **Improved:** Social share buttons now auto-download result image first
- **New:** `downloadResultImage()` function for image generation
- **UX:** Added notification message after image download

### v3.19.0 (2025-02-13)
- **New:** Social media share buttons (LINE, Facebook, Twitter/X)
- **New:** Enhanced share text with detailed result info
- **New:** `getShareText()` helper function for consistent share messages
- **New:** `shareToLINE()`, `shareToFacebook()`, `shareToTwitter()` functions
- **Improved:** Share text now includes percentage match and website name
- **Improved:** Bilingual support for share messages (Thai/English)
- **Style:** Social buttons with brand colors and SVG icons

### v3.18.0 (2025-02-13)
- **Docs:** Added comprehensive "Concept, Approach & Method" section
- **Docs:** Documented multi-dimensional scoring methodology
- **Docs:** Added score normalization formula explanation
- **Docs:** Added score balance table for all 13 shades
- **Docs:** Fixed shade count (12 → 13) including ส้มแอบเนียน (Orange)
- **Docs:** Added question design principles documentation
- **Docs:** Added technical implementation flow diagram

### v3.17.0 (2025-02-12)
- **Improved:** Better score balance for all 13 political shades
- **Improved:** แดงดารา (DARA) max score increased from 15 to 20 (+5)
- **Improved:** ส้มแอบเนียน (ORANGE) max score increased from 13 to 16 (+3)
- **Improved:** Question 5 changed from party-specific to "reform-change" topic
- **Improved:** Split Q2 answers to differentiate NAM_MAK vs ORANGE_FAN
- **New:** Added `/api/clear-answers` endpoint for database maintenance
- **Database:** Cleared old answers data to match new question structure
- **Docs:** Added `scripts/clear-answers.sql` for manual database cleanup
- **Docs:** Added comprehensive "Concept, Approach & Method" section
- **Docs:** Fixed shade count (12 → 13) including ส้มแอบเนียน (Orange)
- **Docs:** Added score balance table and normalization formula documentation

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
