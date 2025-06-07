async function fetchProxy(url) {
    try {
        const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
        return await res.json();
    } catch (e) {
        console.error(e);
        throw e;
    }
}

// Step 1: Confirm Roblox ID
document.getElementById('confirm-id').addEventListener('click', async () => {
    const robloxId = document.getElementById('roblox-id').value.trim();
    if (!robloxId) return;

    try {
        const [userData, headshotData] = await Promise.all([
            fetchProxy(`https://users.roblox.com/v1/users/${robloxId}`),
            fetchProxy(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${robloxId}&size=150x150&format=Png`)
        ]);

        if (userData.errors || headshotData.errors) throw new Error('User not found');

        document.getElementById('username').textContent = userData.name;
        document.getElementById('description').textContent = userData.description || '(No description)';
        document.getElementById('headshot').src = headshotData.data[0].imageUrl;

        localStorage.setItem('tempUserId', robloxId);
        localStorage.setItem('tempUsername', userData.name);
        localStorage.setItem('tempHeadshot', headshotData.data[0].imageUrl);

        showStep('step2', 2);
    } catch (e) {
        alert("Oops! Couldn't find that user. Please check the ID and try again.");
    }
});

// Step 2: Confirm Identity
document.getElementById('yes-btn').addEventListener('click', () => {
    generateVerificationCode();
    showStep('step3', 3);
});

document.getElementById('no-btn').addEventListener('click', () => {
    showStep('step1', 1);
});

// Step 3: Verification
function generateVerificationCode() {
    const code = Math.floor(10000 + 90000 * Math.random());
    document.getElementById('code-text').textContent = code;
    localStorage.setItem('verificationCode', code.toString());
}

document.getElementById('refresh-code').addEventListener('click', generateVerificationCode);

document.getElementById('verify-btn').addEventListener('click', async () => {
    const userId = localStorage.getItem('tempUserId');
    const code = localStorage.getItem('verificationCode');

    try {
        const userData = await fetchProxy(`https://users.roblox.com/v1/users/${userId}`);
        
        if (userData.description && userData.description.includes(code)) {
            // Verification successful
            localStorage.setItem('newUser', 'false');
            localStorage.setItem('robloxUserId', userId);
            localStorage.setItem('robloxUsername', localStorage.getItem('tempUsername'));
            localStorage.setItem('robloxHeadshot', localStorage.getItem('tempHeadshot'));

            // Clean up temp storage
            ['tempUserId', 'tempUsername', 'tempHeadshot', 'verificationCode'].forEach(item => {
                localStorage.removeItem(item);
            });

            document.getElementById('onboarding').style.display = 'none';
            document.getElementById('main-app').classList.add('active');
        } else {
            document.getElementById('verification-status').textContent = 'Code not found in description. Please try again.';
        }
    } catch (e) {
        document.getElementById('verification-status').textContent = 'Error verifying. Please try again.';
    }
});

// Back button
document.getElementById('back-btn').addEventListener('click', () => {
    showStep('step2', 2);
});

// Copy button
document.querySelector('.copy-btn').addEventListener('click', () => {
    const code = document.getElementById('code-text').textContent;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.querySelector('.copy-btn');
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.textContent = 'Copy';
        }, 2000);
    });
});

// Generate initial verification code if on step 3
if (document.getElementById('step3').classList.contains('active')) {
    generateVerificationCode();
}
