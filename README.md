# Volodymyr Voronov - Personal Website

Modern personal website for Frontend Developer, built with Vanilla JavaScript, HTML5, and CSS3.

## 🌟 Features

- **Modern Design**: Clean, minimalist UI/UX following 2026 design trends
- **Multi-language Support**: English, German, and Russian translations
- **Dark/Light Theme**: Automatic theme detection with manual toggle
- **Responsive**: Mobile-first design, fully responsive across all devices
- **Animated Particles**: Interactive canvas background with particle effects
- **GitHub Integration**: Automatically loads projects from GitHub API
- **Smooth Animations**: Intersection Observer API for scroll animations
- **SEO Optimized**: Meta tags, Open Graph, and semantic HTML
- **Accessible**: ARIA labels and keyboard navigation support
- **Performance**: Optimized with lazy loading and debounced scroll events

## 🚀 Technologies

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Styling**: CSS Custom Properties, Flexbox, Grid
- **Fonts**: Inter (primary), Fira Code (code snippets)
- **Icons**: Font Awesome 6.5.1
- **Hosting**: GitHub Pages

## 📂 Project Structure

```
/
├── index.html              # Main HTML file
├── README.md              # This file
├── css/
│   ├── styles.css         # Main styles and variables
│   ├── animations.css     # Animation keyframes and classes
│   ├── responsive.css     # Media queries for responsiveness
│   └── sections.css       # Section-specific styles
├── js/
│   ├── main.js           # Main application logic
│   ├── config.js         # Configuration and personal data
│   ├── i18n.js           # Internationalization module
│   ├── theme.js          # Theme switching functionality
│   ├── particles.js      # Particle animation system
│   └── projects.js       # GitHub API integration
├── assets/
│   ├── images/           # Image assets
│   └── favicon.svg       # Site favicon
├── locales/
│   ├── en.json           # English translations
│   ├── de.json           # German translations
│   └── ru.json           # Russian translations
└── StockTradingBot/      # Stock Trading Bot (Delphi 12)
    └── README.md          # See project documentation
```

## 🎨 Design Features

### Color Scheme

**Light Theme:**
- Background: White (#ffffff), Light Gray (#f8f9fa)
- Text: Dark Gray (#1a1a1a), Gray (#6c757d)
- Accent: Indigo to Purple Gradient (#6366f1 → #8b5cf6)

**Dark Theme:**
- Background: Dark Blue (#0f172a), Gray-Blue (#1e293b)
- Text: Light (#f1f5f9), Light Gray (#cbd5e1)
- Accent: Same gradient (#6366f1 → #8b5cf6)

### Key Sections

1. **Hero Section** - Animated particles background with typing effect
2. **About Section** - Personal info with animated statistics
3. **Skills Section** - Categorized skills with progress bars
4. **Projects Section** - Dynamic project cards loaded from GitHub
5. **Experience Section** - Timeline of professional experience
6. **Contact Section** - Contact information and form

## 🛠️ Setup & Development

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/vvoronov1981/pcvoronov.github.io.git
cd pcvoronov.github.io
```

2. Open `index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

3. Visit `http://localhost:8000`

### Configuration

Edit `js/config.js` to update personal information:

```javascript
const CONFIG = {
    name: 'Your Name',
    role: 'Your Role',
    email: 'your.email@example.com',
    github: 'yourusername',
    linkedin: 'your-linkedin-id',
    // ... more settings
};
```

### Internationalization

Add or modify translations in `locales/`:
- `en.json` - English
- `de.json` - German
- `ru.json` - Russian

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Performance

- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

## 🔧 Customization

### Adding New Languages

1. Create a new JSON file in `locales/` (e.g., `locales/fr.json`)
2. Add the language code to `supportedLanguages` in `js/i18n.js`
3. Add a language button in the navigation

### Modifying Animations

Edit `css/animations.css` to adjust or add new animations:
- Keyframes for different animation types
- Animation classes for easy application
- Performance-optimized transforms

### Changing Colors

Update CSS custom properties in `css/styles.css`:
```css
:root {
    --accent-primary: #your-color;
    --accent-secondary: #your-color;
}
```

## 📄 License

This project is open source and available under the MIT License.

## 💼 Additional Projects

### Stock Trading Bot (Delphi 12)
Automated stock trading console application with Alpaca API integration. Features:
- Algorithmic trading based on historical data analysis
- JWT authentication with REST API
- Multi-threaded architecture for monitoring multiple stocks
- Risk management with Take Profit and Stop Loss
- Comprehensive logging and monitoring

📖 [View Documentation](./StockTradingBot/README.md) | 🚀 [Quick Start Guide](./StockTradingBot/QUICKSTART.md)

## 👤 Contact

- **Name**: Volodymyr Voronov
- **Email**: voronov.voldymyr@gmail.com
- **GitHub**: [@vvoronov1981](https://github.com/vvoronov1981)
- **LinkedIn**: [Volodymyr Voronov](https://linkedin.com/in/volodymyr-voronov-224480236)

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- GitHub API for project integration

---

**Built with ❤️ by Volodymyr Voronov**
