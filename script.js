document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeButton = document.getElementById('themeButton');
    const themePanel = document.getElementById('themePanel');
    const closeButton = document.querySelector('.close-button');
    const styleButtons = document.querySelectorAll('.style-button');
    const themeOptions = document.querySelectorAll('.theme-option');
    const body = document.body;

    // Set initial theme from localStorage or default
    const savedStyle = localStorage.getItem('themeStyle') || 'light';
    const savedTheme = localStorage.getItem('themeColor') || 'neon';
    applyTheme(savedStyle, savedTheme);

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
            const style = this.dataset.style;
            const currentTheme = body.classList.contains('neon-theme') ? 'neon' :
                                body.classList.contains('crimson-theme') ? 'crimson' :
                                body.classList.contains('gold-theme') ? 'gold' :
                                body.classList.contains('silver-theme') ? 'silver' :
                                body.classList.contains('bronze-theme') ? 'bronze' : 'chrome';
            
            applyTheme(style, currentTheme);
            localStorage.setItem('themeStyle', style);
        });
    });

    // Theme color switcher
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.dataset.theme;
            const currentStyle = body.classList.contains('light-theme') ? 'light' : 'dark';
            
            applyTheme(currentStyle, theme);
            localStorage.setItem('themeColor', theme);
        });
    });

    // Close panel when clicking outside
    document.addEventListener('click', function(event) {
        if (!themePanel.contains(event.target) && event.target !== themeButton) {
            themePanel.classList.remove('active');
        }
    });

    // Apply theme function
    function applyTheme(style, theme) {
        // Remove all theme classes
        body.classList.remove(
            'light-theme', 'dark-theme',
            'neon-theme', 'crimson-theme', 'gold-theme', 
            'silver-theme', 'bronze-theme', 'chrome-theme'
        );
        
        // Add selected theme and style
        body.classList.add(`${style}-theme`, `${theme}-theme`);
        
        // Update active buttons
        styleButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.style-button[data-style="${style}"]`).classList.add('active');
        
        themeOptions.forEach(opt => opt.classList.remove('active'));
        document.querySelector(`.theme-option[data-theme="${theme}"]`).classList.add('active');
    }
});
