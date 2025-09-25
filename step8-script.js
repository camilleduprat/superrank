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
        }
    }
    
    updateAnalysisDisplay() {
        if (!this.resultsData) return;
        
        // Update points display
        const pointsElement = document.querySelector('.upload-title.points-title h1');
        if (pointsElement && this.resultsData.grade) {
            pointsElement.textContent = this.resultsData.grade;
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
        
        // Map improvements to cards (assuming improvements array has category and description)
        cards.forEach((card, index) => {
            if (improvements[index]) {
                const titleElement = card.querySelector('.card-title');
                const descriptionElement = card.querySelector('.card-description');
                
                if (titleElement && improvements[index].category) {
                    titleElement.textContent = improvements[index].category;
                }
                
                if (descriptionElement && improvements[index].description) {
                    descriptionElement.textContent = improvements[index].description;
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
