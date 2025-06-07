// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('newUser') === null) {
        localStorage.setItem('newUser', 'true');
    }
        if (window.location.pathname.startsWith('/@')) {
        document.getElementById('main-app').style.display = 'none';
        document.getElementById('onboarding').style.display = 'none';
        document.getElementById('profile-page').style.display = 'block';
    } 
    if (localStorage.getItem('newUser') === 'false') {
        document.getElementById('main-app').classList.add('active');
        document.getElementById('onboarding').style.display = 'none';
    } else {
        document.getElementById('step1').classList.add('active');
        updateProgress(1);
    }
});

// Shared functions
function updateProgress(step) {
    document.getElementById('progress').style.width = step * 33.33 + '%';
}

function showStep(stepId, progressStep) {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(stepId).classList.add('active');
    updateProgress(progressStep);
}
