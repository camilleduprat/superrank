// Step 6 JavaScript - Loading Step

class Step6Manager {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.hideNavigationInitially();
        this.startLoadingSequence();
    }
    
    initializeElements() {
        // Navigation elements
        this.topCloseButton = document.getElementById('topCloseButton');
        this.backButton = document.getElementById('backButton');
        this.nextButton = document.getElementById('nextButton');
        this.nextArrowButton = document.getElementById('nextArrowButton');
        
        // Loading elements
        this.loadingIcon = document.querySelector('.loading-icon');
    }
    
    bindEvents() {
        // Top close button
        if (this.topCloseButton) {
            this.topCloseButton.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
        
        // Navigation buttons
        if (this.backButton) {
            this.backButton.addEventListener('click', () => {
                window.location.href = 'step5.html';
            });
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                this.navigateNext();
            });
        }
        
        if (this.nextArrowButton) {
            this.nextArrowButton.addEventListener('click', () => {
                this.navigateNext();
            });
        }
    }
    
    hideNavigationInitially() {
        // Hide next arrow button initially
        if (this.nextArrowButton) {
            this.nextArrowButton.style.display = 'none';
            this.nextArrowButton.style.opacity = '0';
            this.nextArrowButton.style.pointerEvents = 'none';
        }
        
        // Disable next button in navigation initially
        if (this.nextButton) {
            this.nextButton.disabled = true;
            this.nextButton.style.opacity = '0.5';
        }
    }
    
    async startLoadingSequence() {
        // Import API
        const { getRating, getLeaderboard } = await import('./growthClient.js');
        
        // Pull claim data
        const claimDataStr = sessionStorage.getItem('claimData');
        if (!claimDataStr) {
            console.error('No claim data found.');
            this.enableNavigation();
            return;
        }
        const claimData = JSON.parse(claimDataStr);

        let fullRating = null;
        let leaderboard = [];
        
        // Fetch rating and leaderboard in parallel but tolerate failures
        try {
            [fullRating, leaderboard] = await Promise.all([
                getRating(claimData.ratingId).catch(err => {
                    console.error('getRating failed', err);
                    return null;
                }),
                getLeaderboard(500).catch(err => {
                    console.error('getLeaderboard failed', err);
                    return [];
                })
            ]);
        } catch (e) {
            console.error('Parallel fetch error', e);
        }

        // Compute user rank - prefer username match, else compute by grade
        let userRank = null;
        if (leaderboard && leaderboard.length) {
            const byNameIdx = leaderboard.findIndex(u => (u.username || '').toLowerCase() === (claimData.username || '').toLowerCase());
            if (byNameIdx >= 0) {
                userRank = byNameIdx + 1;
            } else if (fullRating && typeof fullRating.grade === 'number') {
                const grade = fullRating.grade;
                const betterCount = leaderboard.filter(u => (u.best_grade ?? u.grade ?? 0) > grade).length;
                userRank = betterCount + 1;
            }
        }

        // Build results payload for later screens
        const resultsPayload = {
            userRank: userRank || null,
            username: claimData.username,
            email: claimData.email,
            grade: fullRating?.grade ?? null,
            justification: fullRating?.justification || '',
            punchline: fullRating?.punchline || fullRating?.summary || fullRating?.overall || fullRating?.justification || '',
            improvements: Array.isArray(fullRating?.improvements) ? fullRating.improvements : [],
            model: fullRating?.model || null,
            latency_ms: fullRating?.latency_ms || null
        };
        sessionStorage.setItem('fullResults', JSON.stringify(resultsPayload));

        // Visuals and advance
        this.changeIconToCheck();
        this.enableNavigation();
        setTimeout(() => this.navigateNext(), 800);
    }
    
    changeIconToCheck() {
        if (this.loadingIcon) {
            this.loadingIcon.src = 'assets/images/icon-check-light.png';
            this.loadingIcon.alt = 'Success';
            this.loadingIcon.style.animation = 'none';
        }
    }
    
    enableNavigation() {
        // Enable next arrow button
        if (this.nextArrowButton) {
            this.nextArrowButton.style.display = 'flex';
            this.nextArrowButton.style.opacity = '1';
            this.nextArrowButton.style.pointerEvents = 'auto';
        }
        
        // Enable next button in navigation
        if (this.nextButton) {
            this.nextButton.disabled = false;
            this.nextButton.style.opacity = '1';
        }
    }
    
    navigateNext() {
        // Navigate to step 7 (results reveal)
        window.location.href = 'step7.html';
    }
    
    showMessage(message, type = 'success') {
        // Create temporary message
        const messageDiv = document.createElement('div');
        messageDiv.className = `step-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? 'rgba(255, 68, 68, 0.9)' : 'rgba(0, 255, 136, 0.9)'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize Step 6 when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Step6Manager();
});
