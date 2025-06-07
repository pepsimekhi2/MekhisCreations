// Theme management
const themeBtn = document.getElementById('theme-btn');
const themeMenu = document.getElementById('theme-menu');

// Toggle theme menu
themeBtn.addEventListener('click', () => {
    themeMenu.classList.toggle('active');
});

// Theme styles and colors
const styles = {
    light: {
        text: '#202124',
        bg: '#F8F9FA',  // Light gray
        cardBg: '#fff',
        btnText: '#fff',
        inputBg: '#fff',
        topColor: '#F8F9FA'  // Same as bg for gradient
    },
    dark: {
        text: '#F8F9FA',
        bg: '#202124',  // Dark gray
        cardBg: '#303134',
        btnText: '#fff',
        inputBg: '#303134',
        topColor: '#202124'  // Same as bg for gradient
    }
};

const themes = {
    default: {
        primary: '#4285F4',
        secondary: '#34A853',
        accent: '#EA4335',
        bottomColor: '#4285F4'  // Primary color for gradient
    },
    chrome: {
        primary: '#4285F4',
        secondary: '#0F9D58',
        accent: '#DB4437',
        bottomColor: '#4285F4'
    },
    neon: {
        primary: '#00F0FF',
        secondary: '#FF00F0',
        accent: '#F0FF00',
        bottomColor: '#00F0FF'
    },
    crimson: {
        primary: '#DC143C',
        secondary: '#8B0000',
        accent: '#FF6347',
        bottomColor: '#DC143C'
    },
    gold: {
        primary: '#FFD700',
        secondary: '#D4AF37',
        accent: '#C0C0C0',
        bottomColor: '#FFD700'
    },
    silver: {
        primary: '#C0C0C0',
        secondary: '#A8A8A8',
        accent: '#808080',
        bottomColor: '#C0C0C0'
    },
    bronze: {
        primary: '#CD7F32',
        secondary: '#B87333',
        accent: '#8B4513',
        bottomColor: '#CD7F32'
    }
};

function updateBackgroundGradient(styleName, themeName) {
    const style = styles[styleName] || styles.light;
    const theme = themes[themeName] || themes.default;
    
    // Create vertical gradient with theme color appearing in the bottom 1/3
    const gradient = `linear-gradient(to bottom, 
        ${style.topColor} 0%, 
        ${style.topColor} 66%, 
        ${theme.bottomColor} 100%)`;
    document.body.style.background = gradient;
}

function applyTheme(themeName) {
    const theme = themes[themeName] || themes.default;
    
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--secondary', theme.secondary);
    document.documentElement.style.setProperty('--accent', theme.accent);
    
    // Update active state in menu
    document.querySelectorAll('.theme-option[data-theme]').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.theme === themeName) {
            option.classList.add('active');
        }
    });
    
    localStorage.setItem('selectedTheme', themeName);
    
    // Update gradient with current style and new theme
    const currentStyle = localStorage.getItem('selectedStyle') || 'light';
    updateBackgroundGradient(currentStyle, themeName);
}

function applyStyle(styleName) {
    const style = styles[styleName] || styles.light;
    
    document.documentElement.style.setProperty('--text', style.text);
    document.documentElement.style.setProperty('--bg', style.bg);
    document.documentElement.style.setProperty('--card-bg', style.cardBg);
    document.documentElement.style.setProperty('--btn-text', style.btnText);
    document.documentElement.style.setProperty('--input-bg', style.inputBg);
    
    // Update active state in menu
    document.querySelectorAll('.theme-option[data-style]').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.style === styleName) {
            option.classList.add('active');
        }
    });
    
    localStorage.setItem('selectedStyle', styleName);
    
    // Update gradient with new style and current theme
    const currentTheme = localStorage.getItem('selectedTheme') || 'default';
    updateBackgroundGradient(styleName, currentTheme);
}

// Theme option click handlers
document.querySelectorAll('.theme-option[data-style]').forEach(option => {
    option.addEventListener('click', () => {
        applyStyle(option.dataset.style);
    });
});

document.querySelectorAll('.theme-option[data-theme]').forEach(option => {
    option.addEventListener('click', () => {
        applyTheme(option.dataset.theme);
    });
});

// Apply saved theme and style
const savedStyle = localStorage.getItem('selectedStyle') || 'light';
const savedTheme = localStorage.getItem('selectedTheme') || 'default';

applyStyle(savedStyle);
applyTheme(savedTheme);
