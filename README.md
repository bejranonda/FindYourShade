# คุณคือแดงเฉดไหน? - Retro Arcade Edition | Thai Political Shade Quiz

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-orange?logo=cloudflare)](https://pages.cloudflare.com)
[![Version](https://img.shields.io/badge/version-3.0.0--RETRO-red)](https://github.com/YOUR_USERNAME/FindYourShade)

**"INSERT COIN"** - แบบทดสอบหาเฉดสีการเมืองไทยในสไตล์ Retro Arcade ยุค 90s 

A fun, 90s arcade-style quiz to discover your political shade in Thai politics.

![Thai Political Quiz Arcade](https://img.shields.io/badge/Arcade-90s-red?style=for-the-badge)

## 🎯 Features

- **Retro Arcade Experience (v3.0.0-RETRO)**
  - **Pixel Art Aesthetics:** Complete UI overhaul inspired by classic arcade machines.
  - **CRT/Scanline Effects:** Immersive visual overlay for that authentic retro monitor feel.
  - **8-bit Sound System:** Procedural sound effects (Beep, Select, Win) generated via Web Audio API.
  - **Global Stats:** Real-time ranking of results (persisted locally/simulated database).

- **12 Political Shade Categories**
  - 🥊 แดงน้ำหมาก (Nam Mak) | 🍼 แดงนมผง (Nom Phong) | 🍷 แดงมาดาม (Madam)
  - ✨ แดงดารา (Dara) | 🍊👓 ส้มวิชาการ (Academic Orange) | 🧡🔥 ส้มแบก (Fandom Orange)
  - 🎗️ เหลืองคลาสสิก (Classic) | 👑 เหลืองสถาบัน (Royalist) | 🔵 น้ำเงิน (Blue)
  - 🌩️ ฟ้า (Sky Blue) | 🪖 เขียว (Green) | 🏳️ ขาว (Silent White)

- **Immersive Gameplay**
  - **Stage Progression:** Navigate through 7 challenging stages.
  - **Responsive Controls:** Active button states that "click" like real arcade buttons.
  - **Keyboard Support:** Use keys 1-8 for quick selection.

## 🚀 Live Demo

Coming soon to Cloudflare Pages!

## 📦 Installation

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/FindYourShade.git
cd FindYourShade
```

2. Simply open `index.html` in your browser. No build steps required.

### Cloudflare Pages Deployment

Deploy directly using Wrangler:
```bash
npx wrangler pages deploy . --project-name=find-your-shade
```

## 🛠️ Tech Stack

- **HTML5 & Vanilla JS** - Core logic and structure.
- **Web Audio API** - Oscillator-based 8-bit sound effects (no external files).
- **CSS3 (Custom)** - CRT effects, scanlines, and pixel-perfect UI.
- **TailwindCSS** - Utility classes for layout.
- **Google Fonts** - *Press Start 2P* (Arcade) & *Kanit* (Thai).

## 📁 Project Structure

```
FindYourShade/
├── index.html          # Main HTML (Arcade Window)
├── css/
│   └── style.css       # CRT Effects, Retro UI, Animations
├── js/
│   └── app.js          # Sound Engine, Quiz Logic, Global Stats
├── assets/
│   └── images/         # Placeholders for future pixel art
└── README.md
```

## 📝 Disclaimer

แบบทดสอบนี้สร้างขึ้นเพื่อความบันเทิงและการเสียดสีสังคมเท่านั้น มิได้มีเจตนาสร้างความแตกแยกหรือส่งเสริมแนวคิดใดๆ ทั้งสิ้น

This quiz is created for entertainment and social commentary purposes only. It is not intended to create division or promote any specific political ideology.

---

Made with 🕹️ and 🥊 for Thai politics enthusiasts