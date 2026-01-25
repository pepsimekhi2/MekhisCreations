// Replace with your actual group ID
const GROUP_ID = '33719761';

async function fetchGroupInfo() {
    try {
        // 1. Get group member count
        const groupResponse = await fetch(`https://groups.roblox.com/v1/groups/${GROUP_ID}`);
        const groupData = await groupResponse.json();
        
        // 2. Get group games
        const gamesResponse = await fetch(`https://games.roblox.com/v1/groups/${GROUP_ID}/games`);
        const gamesData = await gamesResponse.json();
        
        // 3. Calculate total visits for all games
        let totalVisits = 0;
        if (gamesData.data && gamesData.data.length > 0) {
            // Extract universe IDs from all games
            const universeIds = gamesData.data.map(game => game.universeId);
            
            // Fetch visit data for all games at once
            const visitsResponse = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeIds.join(',')}`);
            const visitsData = await visitsResponse.json();
            
            // Sum up all visits
            totalVisits = visitsData.data.reduce((sum, game) => sum + (game.visits || 0), 0);
        }
        
        return {
            memberCount: groupData.memberCount,
            gameCount: gamesData.data?.length || 0,
            totalVisits: totalVisits
        };
        
    } catch (error) {
        console.error('Error fetching Roblox data:', error);
        return null;
    }
}

// Usage example
fetchGroupInfo().then(data => {
    if (data) {
        console.log(`Members: ${data.memberCount}`);
        console.log(`Games: ${data.gameCount}`);
        console.log(`Total Visits: ${data.totalVisits}`);
        // Update your HTML with these values
    }
});
