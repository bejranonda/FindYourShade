# คุณคือแดงเฉดไหน? | Thai Political Shade Quiz

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-orange?logo=cloudflare)](https://pages.cloudflare.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

แบบทดสอบสนุกๆ เพื่อหาว่าคุณคือ "เฉดสี" ไหนในการเมืองไทย

A fun quiz to discover your political shade in Thai politics.

![Thai Political Quiz](https://img.shields.io/badge/Thai-Politics-red)

## 🎯 Features

- **6 Political Shade Categories**
  - 🥊 แดงน้ำหมาก (Nam Mak) - Traditional red shirt fighters
  - 🍼 แดงนมผง (Nom Phong) - Younger analytical reds
  - 🍷 แดงมาดาม (Madam) - Elite supporters
  - ✨ แดงดารา/เซเลบ (Dara) - Celebrity influencers
  - 🍊 ส้ม (Orange) - Progressive reformers
  - 🔵 น้ำเงิน (Blue) - Pragmatic deal makers

- **7 Fun Questions** exploring your political preferences
- **Dark Mode** support with smooth transitions
- **Share Results** to Twitter/X, Facebook, and LINE
- **History Tracking** - See your past quiz results
- **Keyboard Support** - Press 1-4 to answer
- **Responsive Design** - Works on mobile and desktop
- **Confetti Animation** when you get your results!

## 🚀 Live Demo

Coming soon to Cloudflare Pages!

## 📦 Installation

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/FindYourShade.git
cd FindYourShade
```

2. Simply open `index.html` in your browser:
```bash
# Using Python
python -m http.server 8000

# Or using Node.js
npx serve

# Or just open the file directly in your browser
```

### Cloudflare Pages Deployment

#### Option 1: Direct Upload

```bash
# Install Wrangler CLI
npm install -g wrangler

# Deploy to Cloudflare Pages
wrangler pages deploy . --project-name=find-your-shade
```

#### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to Cloudflare Dashboard > Pages
3. Click "Create a project" > "Connect to Git"
4. Select your repository
5. Configure:
   - **Build command**: `echo "No build needed"`
   - **Build output directory**: `/`
   - **Root directory**: `/`
6. Click "Save and Deploy"

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom animations and dark mode
- **JavaScript (Vanilla)** - No framework dependencies
- **TailwindCSS** - Utility-first CSS framework (via CDN)
- **Google Fonts** - Kanit font for Thai language support

## 📁 Project Structure

```
FindYourShade/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Custom styles with dark mode
├── js/
│   └── app.js          # Quiz logic and features
├── assets/
│   └── images/         # Image assets
├── _headers            # Cloudflare Pages security headers
├── _redirects          # Cloudflare Pages redirects
├── .gitignore
└── README.md
```

## 🎨 Customization

### Adding New Questions

Edit `js/app.js` and add to the `questions` array:

```javascript
{
    q: "Your question here?",
    choices: [
        { text: "Choice 1", score: { NAM_MAK: 3, MADAM: 1 } },
        { text: "Choice 2", score: { NOM_PHONG: 2, ORANGE: 3 } },
        { text: "Choice 3", score: { DARA: 3, MADAM: 1 } },
        { text: "Choice 4", score: { BLUE: 3, MADAM: 1 } }
    ]
}
```

### Adding New Categories

Edit `js/app.js` and add to the `categories` object:

```javascript
NEW_CATEGORY: {
    id: 'NEW_CATEGORY',
    name: 'Category Name',
    icon: '🎭',
    colorClass: 'bg-color-500',
    textClass: 'text-color-600',
    desc: 'Description here...'
}
```

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 Disclaimer

แบบทดสอบนี้สร้างขึ้นเพื่อความบันเทิงและการเสียดสีสังคมเท่านั้น มิได้มีเจตนาสร้างความแตกแยกหรือส่งเสริมแนวคิดใดๆ ทั้งสิ้น

This quiz is created for entertainment and social commentary purposes only. It is not intended to create division or promote any specific political ideology.

## 📞 Contact

- GitHub Issues: [Create an issue](https://github.com/YOUR_USERNAME/FindYourShade/issues)

---

Made with ❤️ and 🥊 for Thai politics enthusiasts
