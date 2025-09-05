# Ukrainian Military Charity Progress Tracker

A modern, responsive web application for tracking fundraising progress for Ukrainian military support.

## 🎯 Features

- **Real-time Progress Tracking**: Live updates from Google Apps Script
- **Modern UI**: Clean, professional design with Ukrainian patriotic colors
- **Loading Animations**: Smooth skeleton loading states
- **Responsive Design**: Works on desktop and mobile devices
- **Auto-refresh**: Updates every 60 seconds automatically

## 📁 Project Structure

```
packthecrew/
├── index.html          # Main HTML file with embedded JavaScript
├── styles.css          # All CSS styles and animations
├── app.js             # React components (standalone version)
└── README.md          # Project documentation
```

**Note**: The JavaScript is embedded directly in `index.html` to avoid CORS issues when opening the file directly in a browser (`file://` protocol). The `app.js` file is kept for reference and can be used when serving the app via HTTP.

## 🚀 Getting Started

1. **Clone or download** the project files
2. **Open `index.html`** in a web browser
3. **Configure the data source** by updating the `WEB_APP_URL` in the embedded JavaScript

### ⚠️ CORS Fix
The JavaScript is embedded directly in `index.html` to avoid CORS (Cross-Origin Resource Sharing) issues when opening the file directly in a browser using the `file://` protocol. This allows the app to work immediately without needing a web server.

## ⚙️ Configuration

### Data Source
Update the `WEB_APP_URL` in the embedded JavaScript (inside `index.html`) to point to your Google Apps Script web app:

```javascript
const CONFIG = {
  WEB_APP_URL: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
};
```

### Fundraising Goals
Modify the fundraising targets in the embedded JavaScript:

```javascript
const CONFIG = {
  TOTAL: 1_250_000,    // Total fundraising goal
  COMPANY: 206_747,    // Company contribution
  REFRESH_MS: 60_000   // Auto-refresh interval (ms)
};
```

## 🎨 Customization

### Colors
The app uses CSS custom properties for easy theming. Update `styles.css`:

```css
:root { 
  --c1: #0057B7;        /* Ukrainian Blue */
  --c2: #FFD700;        /* Ukrainian Gold */
  --bg-primary: #FAFBFC; /* Background */
  /* ... other colors */
}
```

### Styling
- **Main styles**: `styles.css`
- **Component styles**: Inline styles in React components
- **Responsive breakpoints**: 720px for mobile

## 🔧 Technical Details

### Dependencies
- **React 18**: UI framework
- **Babel**: JSX transpilation in browser
- **Google Apps Script**: Data source (JSONP)

### Browser Support
- Modern browsers with ES6+ support
- No build process required

### Data Format
The app expects data from Google Apps Script in this format:

```javascript
{
  "ok": true,
  "data": {
    "B1": "123456",  // Friends donations
    "B2": "789012",  // People donations  
    "B3": "2024-01-15 14:30"  // Last updated
  }
}
```

## 📱 Responsive Design

- **Desktop**: 3-column grid layout
- **Mobile**: Single column layout
- **Breakpoint**: 720px

## 🎭 Components

### `Posters` (Main Component)
- Manages application state
- Handles data fetching
- Renders the complete UI

### `LoadingSkeleton`
- Shows loading animation while data loads
- Matches the structure of actual content

### `TripleBar`
- Renders the progress bar with three segments
- Company, people, and matching donations

## 🔄 Data Flow

1. **Initial Load**: Fetch data on component mount
2. **Auto-refresh**: Set interval for periodic updates
3. **Manual Refresh**: Button click triggers immediate update
4. **Error Handling**: Display errors with styled error messages

## 🚀 Deployment

### Static Hosting
Upload all files to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- AWS S3

### Local Development
Simply open `index.html` in a browser - no build process needed!

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or issues, please open an issue in the repository.
