document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a profile page (/@username)
    if (window.location.pathname.startsWith('/@')) {
        loadProfile();
    }
});

async function loadProfile() {
    const username = window.location.pathname.split('/@')[1];
    const profileContainer = document.getElementById('profile-container');
    
    // Show loading state
    profileContainer.innerHTML = `
        <div class="loading-spinner">
            <div class="bounce">🌀</div>
            <p>Loading ${username}'s profile...</p>
        </div>
    `;
    
    try {
        // Check if it's the current user
        const currentUsername = localStorage.getItem('robloxUsername');
        if (username === currentUsername) {
            // Load logged-in user's profile
            showUserProfile({
                username: currentUsername,
                userId: localStorage.getItem('robloxUserId'),
                headshot: localStorage.getItem('robloxHeadshot')
            });
        } else {
            // Fetch other user's profile from Roblox API
            const userData = await fetchProxy(`https://users.roblox.com/v1/users/search?keyword=${username}&limit=1`);
            if (userData.data && userData.data[0]) {
                const userId = userData.data[0].id;
                const [details, headshot] = await Promise.all([
                    fetchProxy(`https://users.roblox.com/v1/users/${userId}`),
                    fetchProxy(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png`)
                ]);
                
                showUserProfile({
                    username: details.name,
                    userId: userId,
                    headshot: headshot.data[0].imageUrl,
                    description: details.description
                });
            } else {
                profileContainer.innerHTML = `<p>User @${username} not found</p>`;
            }
        }
    } catch (error) {
        profileContainer.innerHTML = `<p>Error loading profile</p>`;
    }
}

function showUserProfile(user) {
    document.getElementById('profile-container').innerHTML = `
        <div class="profile-header">
            <img src="${user.headshot}" alt="${user.username}" class="profile-pic">
            <h1>${user.username}</h1>
            <p class="user-id">ID: ${user.userId}</p>
        </div>
        <div class="profile-description">
            ${user.description || 'No description yet'}
        </div>
        <!-- Add more profile sections as needed -->
    `;
}
