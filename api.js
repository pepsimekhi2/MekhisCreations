// Roblox Group ID for Mekhi's Creations
const GROUP_ID = '33719761';

// CORS proxy service - using two options for reliability
const CORS_PROXY_URLS = [
    'https://api.allorigins.win/raw?url=',  // Option 1
    'https://corsproxy.io/?'                // Option 2
];
let currentProxyIndex = 0;

// DOM Elements
const membersElement = document.getElementById('members-count');
const gamesElement = document.getElementById('games-count');
const visitsElement = document.getElementById('visits-count');
const refreshButton = document.getElementById('refresh-stats');
const statsContainer = document.getElementById('stats-container');
const lastUpdatedElement = document.getElementById('last-updated');

// Get current CORS proxy URL
function getProxyUrl() {
    return CORS_PROXY_URLS[currentProxyIndex];
}

// Switch to next proxy if current one fails
function switchProxy() {
    currentProxyIndex = (currentProxyIndex + 1) % CORS_PROXY_URLS.length;
    console.log(`Switched to CORS proxy: ${CORS_PROXY_URLS[currentProxyIndex]}`);
}

// Create proxied URL based on current proxy
function proxiedUrl(originalUrl) {
    const proxy = getProxyUrl();
    if (proxy.includes('allorigins.win')) {
        return `${proxy}${encodeURIComponent(originalUrl)}`;
    } else if (proxy.includes('corsproxy.io')) {
        return `${proxy}${encodeURIComponent(originalUrl)}`;
    }
    return originalUrl;
}

// Function to fetch group member count
async function fetchGroupMembers() {
    try {
        const url = `https://groups.roblox.com/v1/groups/${GROUP_ID}`;
        console.log(`Fetching group members from: ${url}`);
        
        const response = await fetch(proxiedUrl(url), {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        if (!response.ok) {
            console.error(`Group API error: ${response.status} ${response.statusText}`);
            switchProxy();
            throw new Error(`Group API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Group data received:', data);
        return data.memberCount || 0;
        
    } catch (error) {
        console.error('Error fetching group members:', error);
        // Try with direct fetch as fallback
        try {
            const fallbackResponse = await fetch(`https://groups.roblox.com/v1/groups/${GROUP_ID}`);
            if (fallbackResponse.ok) {
                const fallbackData = await fallbackResponse.json();
                return fallbackData.memberCount || 0;
            }
        } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
        }
        return null;
    }
}

// Function to fetch group games
async function fetchGroupGames() {
    try {
        // Try different endpoint variations
        const urlVariations = [
            `https://games.roblox.com/v1/groups/${GROUP_ID}/games?limit=50`,
            `https://games.roblox.com/v1/groups/${GROUP_ID}/games`,
            `https://games.roblox.com/v2/groups/${GROUP_ID}/games`
        ];
        
        for (const url of urlVariations) {
            console.log(`Trying games endpoint: ${url}`);
            try {
                const response = await fetch(proxiedUrl(url), {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Games data received:', data);
                    
                    // Check response structure
                    if (data.data) {
                        return data.data;
                    } else if (Array.isArray(data)) {
                        return data;
                    } else {
                        console.log('Unexpected games data structure:', data);
                        return [];
                    }
                }
            } catch (innerError) {
                console.log(`Failed with ${url}:`, innerError);
                continue;
            }
        }
        
        // If all variations fail, try direct fetch
        const directResponse = await fetch(`https://games.roblox.com/v1/groups/${GROUP_ID}/games?limit=10`);
        if (directResponse.ok) {
            const directData = await directResponse.json();
            return directData.data || [];
        }
        
        console.warn('No games found or group may not have published games');
        return [];
        
    } catch (error) {
        console.error('Error fetching group games:', error);
        return [];
    }
}

// Function to fetch game visits
async function fetchGameVisits(universeIds) {
    if (!universeIds || universeIds.length === 0) {
        return [];
    }
    
    try {
        // Split into smaller batches if there are many games
        const batchSize = 10;
        let allVisitsData = [];
        
        for (let i = 0; i < universeIds.length; i += batchSize) {
            const batch = universeIds.slice(i, i + batchSize);
            const url = `https://games.roblox.com/v1/games?universeIds=${batch.join(',')}`;
            console.log(`Fetching visits for batch: ${batch.join(',')}`);
            
            const response = await fetch(proxiedUrl(url), {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.data) {
                    allVisitsData = allVisitsData.concat(data.data);
                }
            }
            
            // Small delay between batches to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        return allVisitsData;
        
    } catch (error) {
        console.error('Error fetching game visits:', error);
        return [];
    }
}

// Format large numbers with commas
function formatNumber(num) {
    if (num === null || num === undefined) return 'N/A';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Update the HTML with stats
function updateStats(members, games, visits) {
    if (membersElement) membersElement.textContent = formatNumber(members);
    if (gamesElement) gamesElement.textContent = formatNumber(games);
    if (visitsElement) visitsElement.textContent = formatNumber(visits);
    
    // Update description text
    updateDescriptionText(members, games, visits);
    
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
    const membersPlaceholder = document.getElementById('members-placeholder');
    const gamesPlaceholder = document.getElementById('games-placeholder');
    const visitsPlaceholder = document.getElementById('visits-placeholder');
    
    if (membersPlaceholder) membersPlaceholder.textContent = formatNumber(membersCount);
    if (gamesPlaceholder) gamesPlaceholder.textContent = formatNumber(gamesCount);
    if (visitsPlaceholder) visitsPlaceholder.textContent = formatNumber(visitsCount);
}

// Show loading state
function showLoading() {
    if (membersElement) membersElement.textContent = 'Loading...';
    if (gamesElement) gamesElement.textContent = 'Loading...';
    if (visitsElement) visitsElement.textContent = 'Loading...';
}

// Show error state
function showError(message = 'Error') {
    if (membersElement) membersElement.textContent = message;
    if (gamesElement) gamesElement.textContent = message;
    if (visitsElement) visitsElement.textContent = message;
}

// Show placeholder state
function showPlaceholders() {
    if (membersElement) membersElement.textContent = '--';
    if (gamesElement) gamesElement.textContent = '--';
    if (visitsElement) visitsElement.textContent = '--';
}

// Main function to fetch all data
async function fetchAllStats() {
    console.log('Starting to fetch Roblox stats...');
    showLoading();
    
    try {
        // Fetch group members
        const members = await fetchGroupMembers();
        console.log(`Members result: ${members}`);
        
        // Fetch group games
        const games = await fetchGroupGames();
        console.log(`Games found: ${games.length}`);
        
        // If members fetch failed but we have games, continue anyway
        if (games.length === 0 && members === null) {
            showError('No data found');
            return;
        }
        
        // Get universe IDs from games
        const universeIds = games
            .map(game => game.universeId || game.id || game.universeid)
            .filter(id => id && id !== 0);
        
        console.log(`Universe IDs to fetch: ${universeIds.length}`);
        
        // Fetch visits for all games
        let totalVisits = 0;
        if (universeIds.length > 0) {
            const visitsData = await fetchGameVisits(universeIds);
            console.log(`Visits data received for ${visitsData.length} games`);
            totalVisits = visitsData.reduce((sum, game) => sum + (game.visits || 0), 0);
        }
        
        // Use fallback values if some data is missing
        const finalMembers = members !== null ? members : 0;
        const finalGamesCount = games.length;
        
        // Update the page with real data
        updateStats(finalMembers, finalGamesCount, totalVisits);
        
        // Log success
        console.log(`✅ Stats updated: ${finalMembers} members, ${finalGamesCount} games, ${totalVisits} visits`);
        
        // If no games were found, show a message
        if (finalGamesCount === 0) {
            console.log('Note: No games found. This may be because:');
            console.log('1. The group has no published games yet');
            console.log('2. Games are private/unlisted');
            console.log('3. API endpoint format may have changed');
        }
        
    } catch (error) {
        console.error('Error fetching all stats:', error);
        showError('Failed to load');
        
        // Fallback to placeholders
        showPlaceholders();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Roblox API...');
    
    // Add refresh button functionality
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            console.log('Manual refresh requested');
            fetchAllStats();
        });
    } else {
        console.warn('Refresh button not found in DOM');
    }
    
    // Show initial placeholders
    showPlaceholders();
    
    // Fetch data initially with a small delay
    setTimeout(() => {
        fetchAllStats();
    }, 500);
    
    // Auto-refresh every 10 minutes (optional)
    // setInterval(fetchAllStats, 10 * 60 * 1000);
});

// Export functions if needed for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchGroupMembers,
        fetchGroupGames,
        fetchGameVisits,
        formatNumber
    };
}
