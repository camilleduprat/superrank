// Step 8 - Points Breakdown Script

class Step8Controller {
    constructor() {
        this.resultsData = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.addBounceAnimation = this.addBounceAnimation.bind(this);
        this.loadResults();
    }

    bindEvents() {
        // Top back button
        const topBackButton = document.getElementById('topBackButton');
        if (topBackButton) {
            topBackButton.addEventListener('click', () => {
                this.navigateBack();
            });
        }

        // Close button
        const topCloseButton = document.getElementById('topCloseButton');
        if (topCloseButton) {
            topCloseButton.addEventListener('click', () => {
                this.navigateToHome();
            });
        }

        // Next arrow button
        const nextArrowButton = document.getElementById('nextArrowButton');
        if (nextArrowButton) {
            nextArrowButton.addEventListener('click', () => {
                this.navigateNext();
            });
        }

        // Navigation buttons
        const backButton = document.getElementById('backButton');
        const nextButton = document.getElementById('nextButton');

        if (backButton) {
            backButton.addEventListener('click', () => {
                this.navigateBack();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                this.navigateNext();
            });
        }

        // Progress dots navigation
        this.bindProgressDots();
    }

    bindProgressDots() {
        const progressDots = document.querySelectorAll('.progress-dot');
        progressDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const step = dot.getAttribute('data-step');
                this.navigateToStep(step);
            });
        });
    }

    navigateToHome() {
        // Navigate back to landing page
        window.location.href = 'index.html';
    }

    navigateBack() {
        // Navigate to previous step (Step 7)
        window.location.href = 'step7.html';
    }

    navigateNext() {
        // Navigate to next step (Step 9) without animation
        window.location.href = 'step9.html';
    }

    navigateToStep(step) {
        // Navigate to specific step
        const stepMap = {
            '1': 'rating.html',
            '2': 'prompting-step.html',
            '3': 'prompting-step.html',
            '4': 'prompting-step.html',
            '5': 'step5.html',
            '6': 'step6.html',
            '7': 'step7.html',
            '8': 'step8.html',
            '9': 'step9.html',
            '10': 'step10.html'
        };

        const targetPage = stepMap[step];
        if (targetPage) {
            window.location.href = targetPage;
        }
    }

    addBounceAnimation(element) {
        if (!element) return;
        
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            element.style.transform = 'scale(1.05)';
        }, 100);
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }

    loadResults() {
        // Get results data from sessionStorage
        const resultsDataStr = sessionStorage.getItem('fullResults');
        if (resultsDataStr) {
            this.resultsData = JSON.parse(resultsDataStr);
            this.updateAnalysisDisplay();
        } else {
            console.warn('No results data found for step 8');
            // Attempt recovery: rebuild from claimData + fresh fetches
            this.recoverResults();
        }
    }

    async recoverResults() {
        try {
            const claimDataStr = sessionStorage.getItem('claimData');
            if (!claimDataStr) return;
            const claimData = JSON.parse(claimDataStr);
            const { getRating, getLeaderboard } = await import('./growthClient.js');

            const [fullRating, leaderboard] = await Promise.all([
                getRating(claimData.ratingId).catch(() => null),
                getLeaderboard(500).catch(() => [])
            ]);

            let userRank = null;
            if (leaderboard && leaderboard.length) {
                const idx = leaderboard.findIndex(u => (u.username || '').toLowerCase() === (claimData.username || '').toLowerCase());
                if (idx >= 0) userRank = idx + 1;
            }

            const resultsPayload = {
                userRank: userRank || null,
                username: claimData.username,
                email: claimData.email,
                grade: fullRating?.grade ?? null,
                justification: fullRating?.justification || '',
                improvements: Array.isArray(fullRating?.improvements) ? fullRating.improvements : []
            };
            sessionStorage.setItem('fullResults', JSON.stringify(resultsPayload));
            this.resultsData = resultsPayload;
            this.updateAnalysisDisplay();
        } catch (e) {
            console.error('Recovery for step 8 failed', e);
        }
    }
    
    updateAnalysisDisplay() {
        if (!this.resultsData) return;
        
        // Update points display
        const pointsElement = document.querySelector('.upload-title.points-title h1');
        if (pointsElement && (typeof this.resultsData.grade === 'number')) {
            pointsElement.textContent = this.resultsData.grade;
        }
        // Update overall review (subtitle top-left)
        const subtitle = document.querySelector('.subtitle-feedback span');
        if (subtitle) {
            const msg = this.resultsData.punchline || this.resultsData.justification || '';
            if (msg) subtitle.textContent = msg;
        }
        
        // Update evaluation cards with real data
        this.updateEvaluationCards();
    }
    
    updateEvaluationCards() {
        if (!this.resultsData.improvements || !Array.isArray(this.resultsData.improvements)) {
            return;
        }
        
        const cards = document.querySelectorAll('.evaluation-card');
        const improvements = this.resultsData.improvements;
        
        // Build a lookup by normalized category name for precise mapping
        const byCategory = new Map();
        for (const item of improvements) {
            if (!item) continue;
            const key = String(item.category || item.title || '').toLowerCase().replace(/[^a-z]/g, '');
            if (key) byCategory.set(key, item);
        }
        
        cards.forEach((card) => {
            const titleElement = card.querySelector('.card-title');
            const descriptionElement = card.querySelector('.card-description');
            const rawTitle = titleElement ? titleElement.textContent : '';
            const norm = String(rawTitle || '').toLowerCase().replace(/[^a-z]/g, '');
            const match = byCategory.get(norm);
            if (match) {
                if (titleElement && match.category) titleElement.textContent = match.category;
                if (descriptionElement && (match.description || match.feedback)) {
                    descriptionElement.textContent = match.description || match.feedback;
                }
            }
        });
    }

    // Initialize when page loads (no animations)
    onPageLoad() {
        // No animations needed
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const step8Controller = new Step8Controller();
    step8Controller.onPageLoad();
});

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page became visible
        const step8Controller = new Step8Controller();
        step8Controller.onPageLoad();
    }
});
