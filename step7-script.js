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
            this.fetchAndRenderFromBackend();
        } else {
            console.warn('No results data found, using fallback');
            this.showFallbackResults();
            // Fallback parse directly from ratingData.justification to get punchline quickly
            const ratingRaw = sessionStorage.getItem('ratingData');
            if (ratingRaw) {
                try {
                    const rd = JSON.parse(ratingRaw);
                    const just = rd.justification || '';
                    const m = just.match(/\*\*(.*?)\*\*/);
                    const punch = m ? m[1] : '';
                    const feedbackElement = document.querySelector('.subtitle-feedback span');
                    if (feedbackElement && punch) feedbackElement.textContent = punch;
                } catch {}
            }
            this.fetchAndRenderFromBackend();
        }
    }

    async fetchAndRenderFromBackend() {
        try {
            const { getRating } = await import('./growthClient.js');
            const claimRaw = sessionStorage.getItem('claimData');
            const ratingRaw = sessionStorage.getItem('ratingData');
            const claim = claimRaw ? JSON.parse(claimRaw) : {};
            const rd = ratingRaw ? JSON.parse(ratingRaw) : {};
            const ratingId = claim.ratingId || rd.rating_id || rd.ratingId || rd.id;
            if (!ratingId) return;
            const data = await getRating(ratingId);
            const feedbackElement = document.querySelector('.subtitle-feedback span');
            const m = String(data.justification || '').match(/\*\*(.*?)\*\*/);
            const punch = data.punchline || (m ? m[1] : '');
            if (feedbackElement && punch) feedbackElement.textContent = punch;
        } catch (e) {
            console.warn('Step7 backend hydrate failed', e);
        }
    }
    
    updateResultsDisplay() {
        if (!this.resultsData) return;
        
        // Update rank display
        const rankElement = document.querySelector('.rank-wrapper h1');
        if (rankElement && this.resultsData.userRank) {
            rankElement.textContent = `${this.resultsData.userRank}${this.getOrdinalSuffix(this.resultsData.userRank)}`;
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
        window.location.href = 'step8.html';
    }
    
}

// Initialize Step 7 when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Step7Manager();
});
