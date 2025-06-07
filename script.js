document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeButton = document.getElementById('themeButton');
    const themePanel = document.getElementById('themePanel');
    const closeButton = document.querySelector('.close-button');
    const styleButtons = document.querySelectorAll('.style-button');
    const themeOptions = document.querySelectorAll('.theme-option');
    const animatedThemeButtons = document.querySelectorAll('.animated-theme-option');
    const body = document.body;

    // Set initial theme from localStorage or default
    const savedStyle = localStorage.getItem('themeStyle') || 'light';
    const savedTheme = localStorage.getItem('themeColor') || 'neon';
    const savedAnimated = localStorage.getItem('animatedTheme') || '';

    if (savedAnimated) {
        applyAnimatedTheme(savedAnimated);
    } else {
        applyTheme(savedStyle, savedTheme);
    }

    // Toggle theme panel
    themeButton.addEventListener('click', function() {
        themePanel.classList.toggle('active');
    });

    // Close theme panel
    closeButton.addEventListener('click', function() {
        themePanel.classList.remove('active');
    });

    // Style switcher
    styleButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (body.classList.contains('fire-animated') || body.classList.contains('galaxy-animated')) return;
            const style = this.dataset.style;
            const currentTheme = getCurrentTheme();
            applyTheme(style, currentTheme);
            localStorage.setItem('themeStyle', style);
            localStorage.setItem('animatedTheme', '');
        });
    });

    // Theme color switcher
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            if (body.classList.contains('fire-animated') || body.classList.contains('galaxy-animated')) return;
            const theme = this.dataset.theme;
            const currentStyle = getCurrentStyle();
            applyTheme(currentStyle, theme);
            localStorage.setItem('themeColor', theme);
            localStorage.setItem('animatedTheme', '');
        });
    });

    // Animated Theme Switcher
    animatedThemeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.dataset.theme;
            applyAnimatedTheme(theme);
            localStorage.setItem('animatedTheme', theme);
            // Remove style/theme local storage so they're not restored later
            localStorage.removeItem('themeStyle');
            localStorage.removeItem('themeColor');
        });
    });

    // Close panel when clicking outside
    document.addEventListener('click', function(event) {
        if (!themePanel.contains(event.target) && event.target !== themeButton) {
            themePanel.classList.remove('active');
        }
    });

    function getCurrentTheme() {
        for (const opt of themeOptions) {
            if (opt.classList.contains('active')) return opt.dataset.theme;
        }
        return 'neon';
    }

    function getCurrentStyle() {
        for (const btn of styleButtons) {
            if (btn.classList.contains('active')) return btn.dataset.style;
        }
        return 'light';
    }

    // Apply regular theme
    function applyTheme(style, theme) {
        // Remove all theme classes
        body.classList.remove(
            'light-theme', 'dark-theme',
            'neon-theme', 'crimson-theme', 'gold-theme', 
            'silver-theme', 'bronze-theme', 'chrome-theme',
            'fire-animated', 'galaxy-animated'
        );
        // Add selected theme and style
        body.classList.add(`${style}-theme`, `${theme}-theme`);
        // Update active buttons
        styleButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.style-button[data-style="${style}"]`).classList.add('active');
        themeOptions.forEach(opt => opt.classList.remove('active'));
        document.querySelector(`.theme-option[data-theme="${theme}"]`).classList.add('active');
        // Deactivate animated theme buttons
        animatedThemeButtons.forEach(btn => btn.classList.remove('active'));
    }

    // Apply animated theme (no light/dark)
    function applyAnimatedTheme(theme) {
        body.classList.remove(
            'light-theme', 'dark-theme',
            'neon-theme', 'crimson-theme', 'gold-theme', 
            'silver-theme', 'bronze-theme', 'chrome-theme',
            'fire-animated', 'galaxy-animated'
        );
        if (theme === 'fire') {
            body.classList.add('fire-animated');
        } else if (theme === 'galaxy') {
            body.classList.add('galaxy-animated');
        }
        // Hide regular theme/style active states
        styleButtons.forEach(btn => btn.classList.remove('active'));
        themeOptions.forEach(opt => opt.classList.remove('active'));
        // Set animated button active
        animatedThemeButtons.forEach(btn => {
            if (btn.dataset.theme === theme) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }
});
