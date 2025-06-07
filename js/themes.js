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
        bg: '#F8F9FA',
        cardBg: '#fff',
        btnText: '#fff',
        inputBg: '#fff',
        gradient: 'linear-gradient(to bottom, #F8F9FA, #F8F9FA)'
    },
    dark: {
        text: '#F8F9FA',
        bg: '#202124',
        cardBg: '#303134',
        btnText: '#fff',
        inputBg: '#303134',
        gradient: 'linear-gradient(to bottom, #202124, #202124)'
    }
};

const themes = {
    default: {
        primary: '#4285F4',
        secondary: '#34A853',
        accent: '#EA4335',
        gradient: 'linear-gradient(var(--bg), var(--bg))'
    },
    chrome: {
        primary: '#4285F4',
        secondary: '#0F9D58',
        accent: '#DB4437',
        gradient: 'linear-gradient(var(--bg), var(--bg))'
    },
    neon: {
        primary: '#00F0FF',
        secondary: '#FF00F0',
        accent: '#F0FF00',
        gradient: 'linear-gradient(var(--bg), var(--bg))'
    },
    crimson: {
        primary: '#DC143C',
        secondary: '#8B0000',
        accent: '#FF6347',
        gradient: 'linear-gradient(var(--bg), var(--bg))'
    },
    gold: {
        primary: '#FFD700',
        secondary: '#D4AF37',
        accent: '#C0C0C0',
        gradient: 'linear-gradient(var(--bg), var(--bg))'
    },
    silver: {
        primary: '#C0C0C0',
        secondary: '#A8A8A8',
        accent: '#808080',
        gradient: 'linear-gradient(var(--bg), var(--bg))'
    },
    bronze: {
        primary: '#CD7F32',
        secondary: '#B87333',
        accent: '#8B4513',
        gradient: 'linear-gradient(var(--bg), var(--bg))'
    }
};

function applyTheme(themeName) {
    const theme = themes[themeName] || themes.default;
    
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--secondary', theme.secondary);
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.body.style.background = theme.gradient;
    
    // Update active state in menu
    document.querySelectorAll('.theme-option[data-theme]').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.theme === themeName) {
            option.classList.add('active');
        }
    });
    
    localStorage.setItem('selectedTheme', themeName);
}

function applyStyle(styleName) {
    const style = styles[styleName] || styles.light;
    
    document.documentElement.style.setProperty('--text', style.text);
    document.documentElement.style.setProperty('--bg', style.bg);
    document.documentElement.style.setProperty('--card-bg', style.cardBg);
    document.documentElement.style.setProperty('--btn-text', style.btnText);
    document.documentElement.style.setProperty('--input-bg', style.inputBg);
    document.body.style.background = style.gradient;
    
    // Update active state in menu
    document.querySelectorAll('.theme-option[data-style]').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.style === styleName) {
            option.classList.add('active');
        }
    });
    
    localStorage.setItem('selectedStyle', styleName);
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
