// Step 10 JavaScript - Coming Soon Page

class Step10Manager {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }
    
    initializeElements() {
        // Close button
        this.bigCloseButton = document.getElementById('bigCloseButton');
    }
    
    bindEvents() {
        // Big close button
        this.bigCloseButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.location.href = 'index.html';
            }
        });
    }
}

// Initialize Step 10 when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Step10Manager();
});
