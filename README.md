# คุณคือแดงเฉดไหน? - Thai Political Shade Quiz

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-orange?logo=cloudflare)](https://pages.cloudflare.com)
[![Version](https://img.shields.io/badge/version-3.2.0-blue)](https://github.com/bejranonda/FindYourShade/releases)
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
  - **8-bit Sound System:** Procedural sound effects (Beep, Select, Win) generated via Web Audio API
  - **Progress Tracking:** Visual progress bar as you navigate through 7 questions
  - **Global Stats:** Real-time ranking of results (persisted locally)
  - **Responsive Design:** Works seamlessly on mobile and desktop

- **Production Ready**
  - **Tailwind CSS v3:** Properly bundled for production (no CDN dependencies)
  - **Optimized Assets:** Minified CSS for fast loading
  - **Static Hosting:** Deployed on Cloudflare Pages

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

Or deploy manually:
```bash
npx wrangler pages deploy . --project-name=find-your-shade
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Core structure |
| **Vanilla JS** | Quiz logic and state management |
| **Tailwind CSS v3** | Utility-first CSS framework |
| **Web Audio API** | 8-bit sound effects (no external files) |
| **Google Fonts** | Kanit (Thai) & Press Start 2P (Arcade) |
| **Cloudflare Pages** | Static hosting and CDN |

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
├── package.json        # Dependencies and build scripts
├── tailwind.config.js  # Tailwind configuration
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

### v3.2.0 (2025-02-10)
- **Fixed:** Removed stale submodule reference causing Cloudflare build failures
- **Added:** Production-ready Tailwind CSS build process (no more CDN warnings)
- **Added:** package.json with build scripts for CSS compilation
- **Improved:** Static asset optimization for faster loading

### v3.1.0
- **Added:** Global stats display
- **Updated:** Category descriptions for more balanced tone

### v3.0.0-RETRO
- Initial retro arcade-themed release

## 📝 Disclaimer

แบบทดสอบนี้สร้างขึ้นเพื่อความบันเทิงและการเสียดสีสังคมเท่านั้น มิได้มีเจตนาสร้างความแตกแยกหรือส่งเสริมแนวคิดใดๆ ทั้งสิ้น

This quiz is created for entertainment and social commentary purposes only. It is not intended to create division or promote any specific political ideology.

## 📄 License

MIT License - feel free to fork and modify!

---

Made with 🇹🇭 for Thai politics enthusiasts | [Powered by thalay.eu](https://thalay.eu)
