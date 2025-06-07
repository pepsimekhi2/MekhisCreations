document.addEventListener('DOMContentLoaded', function() {
    const dynamicIsland = document.querySelector('.dynamic-island');
    
    // Make the island interactive
    dynamicIsland.addEventListener('click', function() {
        this.classList.toggle('expanded');
        
        // Change content when expanded
        if (this.classList.contains('expanded')) {
            this.querySelector('.island-content').innerHTML = `
                <div class="expanded-content">
                    <div class="notification">
                        <p>Welcome to BloxNet!</p>
                    </div>
                </div>
            `;
        } else {
            // Revert to original content
            this.querySelector('.island-content').innerHTML = `
                <span class="time">9:41</span>
                <div class="island-sensors">
                    <div class="sensor-dot"></div>
                    <div class="sensor-dot"></div>
                </div>
                <div class="island-expand"></div>
            `;
        }
    });
    
    // Update time in the island
    function updateTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        
        const timeElement = document.querySelector('.time');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }
    
    updateTime();
    setInterval(updateTime, 60000); // Update every minute
    
    // Add subtle pulse animation to brand name
    const brandName = document.querySelector('.brand-name');
    setInterval(() => {
        brandName.style.transform = 'scale(1.02)';
        setTimeout(() => {
            brandName.style.transform = 'scale(1)';
        }, 300);
    }, 5000);
});
