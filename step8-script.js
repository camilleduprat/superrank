// Step 8 - Points Breakdown Script

class Step8Controller {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.addBounceAnimation = this.addBounceAnimation.bind(this);
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
