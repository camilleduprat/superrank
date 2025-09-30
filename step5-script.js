// Step 7 JavaScript - Results Reveal (State 1)

class Step7Manager {
    constructor() {
        this.currentState = 1;
        this.maxStates = 3;
        this.resultsData = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadResults();
    }
    
    initializeElements() {
        // Navigation elements
        this.topCloseButton = document.getElementById('topCloseButton');
        this.nextArrowButton = document.getElementById('nextArrowButton');
        
        console.log('Step 7 elements initialized:', {
            topCloseButton: !!this.topCloseButton,
            nextArrowButton: !!this.nextArrowButton
        });
    }
    
    bindEvents() {
        // Top close button
        if (this.topCloseButton) {
            this.topCloseButton.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
        
        // Next arrow button (plus button)
        if (this.nextArrowButton) {
            this.nextArrowButton.addEventListener('click', () => {
                this.navigateNext();
            });
        }
    }
    
    loadResults() {
        // Get results data from sessionStorage
        const resultsDataStr = sessionStorage.getItem('fullResults');
        if (resultsDataStr) {
            this.resultsData = JSON.parse(resultsDataStr);
            this.updateResultsDisplay();
            // Also parse directly from justification in case backend route is missing
            this.parseFromRatingDataAndRender();
            // Ensure rank visible even if payload lacked it
            if (!this.resultsData.userRank) this.recoverRankFromLeaderboard();
        } else {
            console.warn('No results data found, using fallback');
            this.showFallbackResults();
            this.parseFromRatingDataAndRender();
            // Try to recover fresh data for rank
            this.recoverRankFromLeaderboard();
        }
    }

    parseFromRatingDataAndRender() {
        const ratingRaw = sessionStorage.getItem('ratingData');
        if (!ratingRaw) return;
        try {
            const rd = JSON.parse(ratingRaw);
            const just = String(rd.justification || '');
            // Prefer bold punchline **...** else text between TOTAL line and Usability
            let punch = (just.match(/\*\*(.*?)\*\*/s) || [])[1] || '';
            if (!punch) {
                const afterPoints = just.split(/TOTAL\s+DESIGN\s+POINTS[^\n]*\n/i)[1] || '';
                punch = (afterPoints.split(/\n\s*Usability/i)[0] || '').trim();
            }
            const feedbackElement = document.querySelector('.subtitle-feedback span');
            if (feedbackElement && punch) feedbackElement.textContent = punch;
        } catch {}
    }
    
    updateResultsDisplay() {
        if (!this.resultsData) return;
        
        // Update rank display (second H1 in big title container)
        const rankContainer = document.querySelector('.component-big-title');
        if (rankContainer && this.resultsData.userRank) {
            const h1s = rankContainer.querySelectorAll('h1');
            const rankElement = h1s && h1s.length >= 2 ? h1s[1] : null;
            if (rankElement) {
                rankElement.textContent = `${this.resultsData.userRank}${this.getOrdinalSuffix(this.resultsData.userRank)}`;
            }
        }
        
        // Update feedback message (overall/punchline)
        const feedbackElement = document.querySelector('.subtitle-feedback span');
        if (feedbackElement) {
            const msg = this.resultsData.punchline || this.resultsData.justification || '';
            if (msg) feedbackElement.textContent = msg;
        }
        
        // Update points label to show "X points"
        const pointsLabel = document.querySelector('.points-label');
        if (pointsLabel && typeof this.resultsData.grade === 'number') {
            pointsLabel.textContent = `${this.resultsData.grade} points`;
        }
    }
    
    showFallbackResults() {
        // Use default values if no data is available
        console.log('Showing fallback results');
    }
    
    getOrdinalSuffix(num) {
        const j = num % 10;
        const k = num % 100;
        if (j === 1 && k !== 11) {
            return "st";
        }
        if (j === 2 && k !== 12) {
            return "nd";
        }
        if (j === 3 && k !== 13) {
            return "rd";
        }
        return "th";
    }
    
    navigateNext() {
        console.log('Navigating to Step 8...');
        // Navigate to Step 8 - Points breakdown
        window.location.href = 'step6.html';
    }
    
    async recoverRankFromLeaderboard() {
        try {
            const claimRaw = sessionStorage.getItem('claimData');
            if (!claimRaw) return;
            const claim = JSON.parse(claimRaw);
            const { getLeaderboard } = await import('./growthClient.js');
            const list = await getLeaderboard(500);
            const idx = Array.isArray(list) ? list.findIndex(u => (u.username || '').toLowerCase() === String(claim.username || '').toLowerCase()) : -1;
            if (idx >= 0) {
                const rank = idx + 1;
                // Update UI immediately
                const rankContainer = document.querySelector('.component-big-title');
                if (rankContainer) {
                    const h1s = rankContainer.querySelectorAll('h1');
                    const rankElement = h1s && h1s.length >= 2 ? h1s[1] : null;
                    if (rankElement) rankElement.textContent = `${rank}${this.getOrdinalSuffix(rank)}`;
                }
                // Persist into resultsData/session for later steps
                this.resultsData = this.resultsData || {};
                this.resultsData.userRank = rank;
                const full = sessionStorage.getItem('fullResults');
                if (full) {
                    try {
                        const parsed = JSON.parse(full);
                        parsed.userRank = rank;
                        sessionStorage.setItem('fullResults', JSON.stringify(parsed));
                    } catch {}
                }
            }
        } catch (e) {
            console.warn('Failed to recover rank from leaderboard', e);
        }
    }
}

// Initialize Step 7 when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Step7Manager();
});
