// Roblox Group ID for Mekhi's Creations
const GROUP_ID = '33719761';

// DOM Elements
const membersElement = document.getElementById('members-count');
const gamesElement = document.getElementById('games-count');
const visitsElement = document.getElementById('visits-count');
const refreshButton = document.getElementById('refresh-stats');
const statsContainer = document.getElementById('stats-container');
const lastUpdatedElement = document.getElementById('last-updated');

// Function to fetch group member count
async function fetchGroupMembers() {
    try {
        const response = await fetch(`https://groups.roblox.com/v1/groups/${GROUP_ID}`);
        if (!response.ok) throw new Error(`Group API error: ${response.status}`);
        const data = await response.json();
        return data.memberCount || 0;
    } catch (error) {
        console.error('Error fetching group members:', error);
        return null;
    }
}

// Function to fetch group games
async function fetchGroupGames() {
    try {
        const response = await fetch(`https://games.roblox.com/v1/groups/${GROUP_ID}/games?accessFilter=2&limit=50`);
        if (!response.ok) throw new Error(`Games API error: ${response.status}`);
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching group games:', error);
        return [];
    }
}

// Function to fetch game visits
async function fetchGameVisits(universeIds) {
    try {
        const response = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeIds.join(',')}`);
        if (!response.ok) throw new Error(`Visits API error: ${response.status}`);
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching game visits:', error);
        return [];
    }
}

// Format large numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Update the HTML with stats
function updateStats(members, games, visits) {
    if (membersElement) membersElement.textContent = formatNumber(members);
    if (gamesElement) gamesElement.textContent = formatNumber(games);
    if (visitsElement) visitsElement.textContent = formatNumber(visits);
    
    // Update description text
    updateDescriptionText(members, games.length, visits);
    
    // Update last updated time
    if (lastUpdatedElement) {
        const now = new Date();
        lastUpdatedElement.textContent = now.toLocaleTimeString();
    }
    
    // Show stats container
    if (statsContainer) {
        statsContainer.style.display = 'block';
    }
}

// Update the dynamic text in your description
function updateDescriptionText(membersCount, gamesCount, visitsCount) {
    const descriptionElement = document.querySelector('.description-text');
    if (descriptionElement) {
        descriptionElement.innerHTML = `
            We are a Roblox game studio dedicated to creating fun, free-to-play, and accessible games for everyone. 
            Our focus is on making games that are simple, enjoyable, and entertaining for our players. 
            With a growing community of <span class="highlight">${formatNumber(membersCount)}</span> members and 
            <span class="highlight">${gamesCount}</span> experiences under our belt, our games have attracted 
            <span class="highlight">${formatNumber(visitsCount)}</span> visits and continue to bring fun to players around the world.
        `;
    }
}

// Show loading state
function showLoading() {
    if (membersElement) membersElement.textContent = 'Loading...';
    if (gamesElement) gamesElement.textContent = 'Loading...';
    if (visitsElement) visitsElement.textContent = 'Loading...';
}

// Show error state
function showError() {
    if (membersElement) membersElement.textContent = 'Error';
    if (gamesElement) gamesElement.textContent = 'Error';
    if (visitsElement) visitsElement.textContent = 'Error';
}

// Main function to fetch all data
async function fetchAllStats() {
    showLoading();
    
    try {
        // Fetch data in parallel for better performance
        const [members, games] = await Promise.all([
            fetchGroupMembers(),
            fetchGroupGames()
        ]);
        
        if (members === null || !games.length) {
            showError();
            return;
        }
        
        // Get universe IDs from games
        const universeIds = games.map(game => game.universeId).filter(id => id);
        
        // Fetch visits for all games
        let totalVisits = 0;
        if (universeIds.length > 0) {
            const visitsData = await fetchGameVisits(universeIds);
            totalVisits = visitsData.reduce((sum, game) => sum + (game.visits || 0), 0);
        }
        
        // Update the page with real data
        updateStats(members, games.length, totalVisits);
        
        // Log success
        console.log(`✅ Stats updated: ${members} members, ${games.length} games, ${totalVisits} visits`);
        
    } catch (error) {
        console.error('Error fetching all stats:', error);
        showError();
        
        // Fallback to showing at least the static content
        const fallbackDescription = document.querySelector('.description-text');
        if (fallbackDescription && fallbackDescription.textContent.includes('[X]')) {
            fallbackDescription.innerHTML = fallbackDescription.innerHTML
                .replace(/\[X\]/g, '<span class="highlight">many</span>');
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add refresh button functionality
    if (refreshButton) {
        refreshButton.addEventListener('click', fetchAllStats);
    }
    
    // Fetch data initially
    fetchAllStats();
    
    // Auto-refresh every 5 minutes (optional)
    setInterval(fetchAllStats, 5 * 60 * 1000);
});
