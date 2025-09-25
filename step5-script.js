// Step 5 JavaScript - Email Collection

class Step5Manager {
    constructor() {
        this.emailData = {
            email: ''
        };
        
        this.initializeElements();
        this.bindEvents();
        this.updateNavigationState();
    }
    
    initializeElements() {
        // Navigation elements
        this.topCloseButton = document.getElementById('topCloseButton');
        this.backButton = document.getElementById('backButton');
        this.nextButton = document.getElementById('nextButton');
        
        // Email input elements
        this.emailInput = document.getElementById('emailInput');
        this.emailSubmitBtn = document.getElementById('emailSubmitBtn');
        this.emailInputContainer = document.getElementById('emailInputContainer');
        this.nameInput = document.getElementById('nameInput');
        this.linkInput = document.getElementById('linkInput');
    }
    
    bindEvents() {
        // Top close button
        if (this.topCloseButton) {
            this.topCloseButton.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
        
        // Navigation buttons (optional on this page)
        if (this.backButton) {
            this.backButton.addEventListener('click', () => {
                window.location.href = 'prompting-step.html';
            });
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                this.navigateNext();
            });
        }
        
        // Email input events
        if (this.emailInput) {
            this.emailInput.addEventListener('input', () => {
                this.validateEmail();
            });
        }
        if (this.nameInput) {
            this.nameInput.addEventListener('input', () => {
                this.validateEmail();
            });
        }
        if (this.linkInput) {
            this.linkInput.addEventListener('input', () => {
                // optional; still run overall validation to toggle submit state
                this.validateEmail();
            });
        }
        
        if (this.emailInput) {
            this.emailInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.validateAndProceed();
                }
            });
        }
        if (this.nameInput) {
            this.nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.validateAndProceed();
                }
            });
        }
        if (this.linkInput) {
            this.linkInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.validateAndProceed();
                }
            });
        }
        
        // Email submit button
        if (this.emailSubmitBtn) {
            this.emailSubmitBtn.addEventListener('click', () => {
                this.validateAndProceed();
            });
        }
    }
    
    validateEmail() {
        const email = (this.emailInput?.value || '').trim();
        const name = (this.nameInput?.value || '').trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email) && name.length > 0;
        
        // Update visual states
        this.emailInput.classList.remove('valid', 'invalid');
        this.emailSubmitBtn.classList.remove('valid', 'loading');
        
        if (email.length > 0) {
            if (isValid) {
                this.emailInput.classList.add('valid');
                this.emailSubmitBtn.classList.add('valid');
                this.emailSubmitBtn.disabled = false;
            } else {
                this.emailInput.classList.add('invalid');
                this.emailSubmitBtn.disabled = true;
            }
        } else {
            this.emailSubmitBtn.disabled = true;
        }
        
        // Update navigation state
        this.updateNavigationState();
    }
    
    async validateAndProceed() {
        const email = (this.emailInput?.value || '').trim();
        const name = (this.nameInput?.value || '').trim();
        const link = (this.linkInput?.value || '').trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!name) {
            this.showMessage('Please enter your name', 'error');
            this.nameInput?.focus();
            return;
        }
        if (!email) {
            this.showMessage('Please enter your email address', 'error');
            this.emailInput.focus();
            return;
        }
        
        if (!emailRegex.test(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            this.emailInput.focus();
            return;
        }
        
        // Store email data
        this.emailData.email = email;
        this.emailData.name = name;
        this.emailData.link = link;
        
        // Show loading state
        this.showLoadingState();
        
        try {
            // Import the growthClient functions
            const { claimReview, showError } = await import('./growthClient.js');
            
            // Get rating data from sessionStorage
            const ratingDataStr = sessionStorage.getItem('ratingData');
            if (!ratingDataStr) {
                throw new Error('No rating data found. Please go back and complete the design analysis.');
            }
            
            const ratingData = JSON.parse(ratingDataStr);
            
            // Call claimReview API
            await claimReview({
                username: name,
                email: email,
                requestId: ratingData.request_id,
                ratingId: ratingData.rating_id,
                portfolioUrl: link || null
            });
            
            // Store claim data for next steps
            sessionStorage.setItem('claimData', JSON.stringify({
                username: name,
                email: email,
                ratingId: ratingData.rating_id
            }));
            
            // Change icon to check mark
            this.changeIconToCheck();
            
            this.showMessage('Email saved successfully!', 'success');
            
            // Navigate to next step (step 6)
            setTimeout(() => {
                window.location.href = 'step6.html';
            }, 1000);
            
        } catch (error) {
            console.error('Failed to claim review:', error);
            this.hideLoadingState();
            this.showMessage('Failed to save email. Please try again.', 'error');
        }
    }
    
    showLoadingState() {
        // Change icon to loading
        this.changeIconToLoading();
        
        this.emailSubmitBtn.disabled = true;
        this.emailInput.disabled = true;
        
        // Disable navigation
        this.backButton.disabled = true;
        this.nextButton.disabled = true;
        this.backButton.style.opacity = '0.5';
        this.nextButton.style.opacity = '0.5';
    }
    
    hideLoadingState() {
        this.emailSubmitBtn.classList.remove('loading');
        this.emailSubmitBtn.disabled = false;
        this.emailInput.disabled = false;
        
        // Re-enable navigation
        this.backButton.disabled = false;
        this.nextButton.disabled = false;
        this.backButton.style.opacity = '1';
        this.nextButton.style.opacity = '1';
    }
    
    changeIconToLoading() {
        const submitIcon = this.emailSubmitBtn.querySelector('.submit-icon');
        if (submitIcon) {
            submitIcon.src = 'assets/images/icon-loading.png';
            submitIcon.alt = 'Loading';
            submitIcon.style.animation = 'spin 2s linear infinite';
        }
    }
    
    changeIconToCheck() {
        const submitIcon = this.emailSubmitBtn.querySelector('.submit-icon');
        if (submitIcon) {
            submitIcon.src = 'assets/images/icon-check-light.png';
            submitIcon.alt = 'Success';
            submitIcon.style.animation = 'none';
        }
    }
    
    updateNavigationState() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        
        if (isValid) {
            this.nextButton.disabled = false;
            this.nextButton.style.opacity = '1';
        } else {
            this.nextButton.disabled = true;
            this.nextButton.style.opacity = '0.5';
        }
    }
    
    navigateNext() {
        // Navigate to step 6 (loading step)
        window.location.href = 'step6.html';
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
    
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Initialize Step 5 when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Step5Manager();
});
