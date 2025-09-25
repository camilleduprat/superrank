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
        this.topCloseButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
        
        // Navigation buttons
        this.backButton.addEventListener('click', () => {
            window.location.href = 'step5.html';
        });
        
        this.nextButton.addEventListener('click', () => {
            this.navigateNext();
        });
        
        this.nextArrowButton.addEventListener('click', () => {
            this.navigateNext();
        });
    }
    
    hideNavigationInitially() {
        // Hide next arrow button initially
        this.nextArrowButton.style.display = 'none';
        this.nextArrowButton.style.opacity = '0';
        this.nextArrowButton.style.pointerEvents = 'none';
        
        // Disable next button in navigation initially
        this.nextButton.disabled = true;
        this.nextButton.style.opacity = '0.5';
    }
    
    startLoadingSequence() {
        // Simulate loading time
        setTimeout(() => {
            // Change loading icon to checkmark
            this.changeIconToCheck();
            
            this.showMessage('Analysis complete!', 'success');
            
            // Enable navigation after loading is complete
            this.enableNavigation();
        }, 3000);
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
        this.nextArrowButton.style.display = 'flex';
        this.nextArrowButton.style.opacity = '1';
        this.nextArrowButton.style.pointerEvents = 'auto';
        
        // Enable next button in navigation
        this.nextButton.disabled = false;
        this.nextButton.style.opacity = '1';
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
