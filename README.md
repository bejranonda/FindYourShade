# คุณคือเฉดสีการเมืองไหน? - Thai Political Shade Quiz

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-orange?logo=cloudflare)](https://pages.cloudflare.com)
[![Version](https://img.shields.io/badge/version-3.7.0-blue)](https://github.com/bejranonda/FindYourShade/releases)
[![Live Demo](https://img.shields.io/badge/demo-findyourshade.autobahn.bot-brightgreen)](https://findyourshade.autobahn.bot/)

A fun, interactive quiz to discover your political shade in Thai politics.

**แบบทดสอบหาเฉดสีการเมืองไทย** - มาเป็นสีอะไรกันแน่ในสมการการเมืองไทยยุคนี้?

## 🎯 Features

- **12 Political Shade Categories**
  - 🥊 แดงน้ำหมาก (Nam Mak) | 🍼 แดงนมผง (Nom Phong) | 🍷 แดงมาดาม (Madam)
  - ✨ แดงดารา (Dara) | 🍊👓 ส้มวิชาการ (Academic Orange) | 🧡🔥 ส้มแบก (Fandom Orange)
  - 🎗️ เหลืองคลาสสิก (Classic) | 👑 เหลืองสถาบัน (Royalist) | 🔵 น้ำเงิน (Blue)
  - 🌩️ ฟ้า (Sky Blue) | 🪖 เขียว (Green) | 🏳️ ขาว (Silent White)

- **Immersive Gameplay**
  - **Category-Specific Emoji Rain:** Each political shade has unique symbols (e.g., 🥊❤️ for Nam Mak, 🌿💰 for Blue, 👑🏛️ for Royalist) that rain down in celebration
  - **8-bit Sound System:** Procedural sound effects (Beep, Select, Win) generated via Web Audio API
  - **Progress Tracking:** Visual progress bar as you navigate through 7 questions
  - **Global Stats:** Real-time ranking of results persisted in Cloudflare D1 database
  - **Back Navigation:** Go back and change your answers at any time
  - **Responsive Design:** Works seamlessly on mobile and desktop

- **Production Ready**
  - **Tailwind CSS v3:** Properly bundled for production (no CDN dependencies)
  - **Cloudflare D1:** Serverless database for global stats
  - **Pages Functions:** Serverless API endpoints
  - **Cache-Busting:** Versioned assets for fresh deployments

## 🚀 Live Demo

**[https://findyourshade.autobahn.bot/](https://findyourshade.autobahn.bot/)**

## 📦 Installation

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/bejranonda/FindYourShade.git
cd FindYourShade
```

2. Install dependencies and build CSS:
```bash
npm install
npm run build:css
```

3. Open `index.html` in your browser, or use a local server:
```bash
npx serve .
```

### Building for Production

```bash
npm run build:css    # Build minified Tailwind CSS
npm run watch:css    # Watch for changes during development
```

### Cloudflare Pages Deployment

The site is automatically deployed from the `master` branch. Build settings:

- **Build command:** `npm run build:css`
- **Build output directory:** `/`
- **Node.js version:** `18` or newer

## 🗄️ Setting up Cloudflare D1 Database (Optional)

For global stats to work across all users, set up Cloudflare D1:

1. **Create D1 Database:**
```bash
wrangler d1 create DB --name=findyourshade-db
```

2. **Run the schema:**
```bash
wrangler d1 execute DB --remote --file=schema.sql
```

3. **D1 database is pre-configured** in `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "DB"
database_id = "7e5bd3e8-425c-4447-b340-60cbc14c57f6"
```

4. **Deploy with wrangler:**
```bash
wrangler pages deploy . --project-name=findyourshade
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Core structure |
| **Vanilla JS** | Quiz logic and state management |
| **Tailwind CSS v3** | Utility-first CSS framework |
| **Cloudflare D1** | Serverless SQLite database |
| **Cloudflare Pages Functions** | Serverless API endpoints |
| **Web Audio API** | 8-bit sound effects |
| **CSS Animations** | Emoji rain effects |
| **Google Fonts** | Kanit (Thai) & Press Start 2P |

## 📁 Project Structure

```
FindYourShade/
├── index.html          # Main HTML
├── css/
│   ├── input.css       # Tailwind CSS entry point
│   ├── tailwind.css    # Built Tailwind CSS (generated)
│   └── style.css       # Custom styles and animations
├── js/
│   └── app.js          # Quiz logic, sound engine, stats
├── functions/
│   └── api/
│       ├── save.js     # Pages Function - Save result to D1
│       └── stats.js    # Pages Function - Get stats from D1
├── schema.sql          # D1 database schema
├── package.json        # Dependencies and build scripts
├── tailwind.config.js  # Tailwind configuration
├── wrangler.toml      # Cloudflare configuration
├── _headers            # Cloudflare Pages headers
├── _redirects          # Cloudflare Pages redirects
└── README.md
```

## 🎮 How to Play

1. Click "เริ่มวิเคราะห์ตัวตน" (Start Analysis)
2. Answer 7 questions about your political views
3. Discover your political shade!
4. Share your result with friends

## 📝 Changelog

### v3.7.0 (2025-02-11)
- **Fixed:** Title updated to be more inclusive of all political shades (not just "red")
- **Added:** D1 database binding configured for global stats persistence
- **Fixed:** wrangler.toml with proper `pages_build_output_dir` for deployment
- **Changed:** Stats text shortened from "สถิติผลลัพธ์จากผู้เล่น" to "ผลลัพธ์จากผู้เล่น"
- **Simplified:** Removed canvas-confetti library, using CSS emoji rain only
- Each political shade now has 1-2 unique symbols that rain down (80 emojis total)
- Symbol mapping: 🥊❤️ (Nam Mak), 🍼❤️ (Nom Phong), 🍷👠 (Madam), ✨⭐ (Dara), 🍊💡 (Orange), 🌿💰 (Blue), 💧🕊️ (Sky Blue), 📚💡 (Academic Orange), 🔥🧡 (Fandom Orange), 🎗️💛 (Classic Yellow), 👑🏛️ (Royalist), 🪖🛡️ (Green), ☕🏳️ (White)

### v3.6.0 (2025-02-10)
- **Added:** Category-specific emoji rain celebration (80 emojis per result)
- Each political shade has unique symbols: 🥊❤️ (Nam Mak), 🍼❤️ (Nom Phong), 🍷👠 (Madam), ✨⭐ (Dara), 🍊💡 (Orange), 🌿💰 (Blue), 💧🕊️ (Sky Blue), 📚💡 (Academic Orange), 🔥🧡 (Fandom Orange), 🎗️💛 (Classic Yellow), 👑🏛️ (Royalist), 🪖🛡️ (Green), ☕🏳️ (White)
- **Removed:** Fireworks/side-shooting confetti (simplified to emoji rain only)

### v3.5.0 (2025-02-10)
- **Added:** Cloudflare D1 database for true global stats
- **Added:** Pages Functions (`/api/save`, `/api/stats`)
- **Added:** Back button to review and change previous answers
- **Added:** Cache-busting query parameters for asset freshness
- **Improved:** Fallback to localStorage if API unavailable

### v3.4.0 (2025-02-10)
- **Added:** Back button navigation for answer review
- **Improved:** Answer history tracking with score recalculation

### v3.3.0 (2025-02-10)
- **Added:** wrangler.toml for Cloudflare Pages configuration
- **Added:** MIT License for open source compliance
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

## 📝 Disclaimer

แบบทดสอบนี้สร้างขึ้นเพื่อความบันเทิงและการเสียดสีสังคมเท่านั้น มิได้มีเจตนาสร้างความแตกแยกหรือส่งเสริมแนวคิดใดๆ ทั้งสิ้น

This quiz is created for entertainment and social commentary purposes only. It is not intended to create division or promote any specific political ideology.

## 📄 License

MIT License - feel free to fork and modify!

---

Made with 🇹🇭 for Thai politics enthusiasts | [Powered by thalay.eu](https://thalay.eu)
