// Step 2 JavaScript - ChatInput State Management

class Step2Manager {
    constructor() {
        this.currentState = 1;
        this.maxStates = 3;
        this.stepData = {
            imageType: null,
            productDescription: '',
            productLocation: ''
        };
        
        this.initializeElements();
        this.bindEvents();
        this.updateProgress();
    }
    
    initializeElements() {
        // ChatInput states
        this.chatStep1 = document.getElementById('chatStep1');
        this.chatStep2 = document.getElementById('chatStep2');
        this.chatStep3 = document.getElementById('chatStep3');
        
        // Navigation elements
        this.topCloseButton = document.getElementById('topCloseButton');
        this.backButton = document.getElementById('backButton');
        this.nextButton = document.getElementById('nextButton');
        this.nextArrowButton = document.getElementById('nextArrowButton');
        
        // State 1 elements
        this.optionTags = document.querySelectorAll('.option-tag');
        this.stepImageCloseBtn = document.getElementById('stepImageCloseBtn');
        
        // State 2 elements
        this.step2BackBtn = document.getElementById('step2BackBtn');
        this.step2NextBtn = document.getElementById('step2NextBtn');
        this.productDescriptionInput = document.getElementById('productDescriptionInput');
        this.stepImageCloseBtn2 = document.getElementById('stepImageCloseBtn2');
        
        // State 3 elements
        this.step3BackBtn = document.getElementById('step3BackBtn');
        this.productLocationInput = document.getElementById('productLocationInput');
        this.stepImageCloseBtn3 = document.getElementById('stepImageCloseBtn3');
        
        // Progress bars
        this.step1ProgressFill = document.getElementById('step1ProgressFill');
        this.step2ProgressFill = document.getElementById('step2ProgressFill');
        this.step3ProgressFill = document.getElementById('step3ProgressFill');
    }
    
    bindEvents() {
        // Top close button
        this.topCloseButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
        
        // Navigation buttons
        this.backButton.addEventListener('click', () => {
            window.location.href = 'rating.html';
        });
        
        this.nextButton.addEventListener('click', () => {
            this.navigateNext();
        });
        
        this.nextArrowButton.addEventListener('click', () => {
            this.validateStep2();
        });
        
        // State 1 events
        this.optionTags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                this.selectImageType(e.target.dataset.value);
            });
        });
        
        this.stepImageCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.clearImage();
        });
        
        // State 2 events
        this.step2BackBtn.addEventListener('click', () => {
            this.goToState(1);
        });
        
        this.step2NextBtn.addEventListener('click', () => {
            if (this.productDescriptionInput.value.trim()) {
                this.stepData.productDescription = this.productDescriptionInput.value.trim();
                this.goToState(3);
            }
        });
        
        this.stepImageCloseBtn2.addEventListener('click', (e) => {
            e.stopPropagation();
            this.clearImage();
        });
        
        // State 3 events
        this.step3BackBtn.addEventListener('click', () => {
            this.goToState(2);
        });
        
        this.stepImageCloseBtn3.addEventListener('click', (e) => {
            e.stopPropagation();
            this.clearImage();
        });
        
        // Input validation
        this.productDescriptionInput.addEventListener('input', () => {
            this.updateStep2NextButton();
        });
        
        this.productLocationInput.addEventListener('input', () => {
            this.updateStep3Validation();
        });
        
        // Enter key support
        this.productDescriptionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.productDescriptionInput.value.trim()) {
                this.stepData.productDescription = this.productDescriptionInput.value.trim();
                this.goToState(3);
            }
        });
        
        this.productLocationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.productLocationInput.value.trim()) {
                this.stepData.productLocation = this.productLocationInput.value.trim();
                this.validateStep2();
            }
        });
    }
    
    selectImageType(type) {
        // Remove previous selection
        this.optionTags.forEach(tag => tag.classList.remove('selected'));
        
        // Add selection to clicked tag
        const selectedTag = document.querySelector(`[data-value="${type}"]`);
        selectedTag.classList.add('selected');
        
        // Store selection
        this.stepData.imageType = type;
        
        // Update progress
        this.updateProgress();
        
        // Automatically advance to state 2 after a short delay
        setTimeout(() => {
            this.goToState(2);
        }, 300);
    }
    
    goToState(state) {
        // Hide all states and remove active class
        this.chatStep1.classList.add('hidden');
        this.chatStep1.classList.remove('active');
        this.chatStep2.classList.add('hidden');
        this.chatStep2.classList.remove('active');
        this.chatStep3.classList.add('hidden');
        this.chatStep3.classList.remove('active');
        
        // Show target state
        const targetStep = document.getElementById(`chatStep${state}`);
        targetStep.classList.remove('hidden');
        targetStep.classList.add('active');
        
        this.currentState = state;
        
        // Update UI based on state
        this.updateStateUI();
        this.updateProgress();
    }
    
    updateStateUI() {
        // Show/hide next arrow button
        if (this.currentState === 3) {
            this.nextArrowButton.style.display = 'flex';
        } else {
            this.nextArrowButton.style.display = 'none';
        }
        
        // Update input states
        this.updateStep2NextButton();
        this.updateStep3Validation();
    }
    
    updateStep2NextButton() {
        const hasInput = this.productDescriptionInput.value.trim().length > 0;
        this.step2NextBtn.style.opacity = hasInput ? '1' : '0.5';
        this.step2NextBtn.style.pointerEvents = hasInput ? 'auto' : 'none';
    }
    
    updateStep3Validation() {
        const hasInput = this.productLocationInput.value.trim().length > 0;
        this.nextArrowButton.style.opacity = hasInput ? '1' : '0';
        this.nextArrowButton.style.pointerEvents = hasInput ? 'auto' : 'none';
    }
    
    updateProgress() {
        // Reset all progress bars
        this.step1ProgressFill.style.width = '0%';
        this.step2ProgressFill.style.width = '0%';
        this.step3ProgressFill.style.width = '0%';
        
        // Update progress based on current state
        if (this.currentState === 1) {
            this.step1ProgressFill.style.width = '33%';
        } else if (this.currentState === 2) {
            this.step1ProgressFill.style.width = '33%';
            this.step2ProgressFill.style.width = '66%';
        } else if (this.currentState === 3) {
            this.step1ProgressFill.style.width = '33%';
            this.step2ProgressFill.style.width = '66%';
            this.step3ProgressFill.style.width = '100%';
        }
    }
    
    clearImage() {
        // Show confirmation or directly clear
        if (confirm('Are you sure you want to remove the uploaded image?')) {
            // Clear image and go back to step 1
            this.stepData = {
                imageType: null,
                productDescription: '',
                productLocation: ''
            };
            
            // Reset inputs
            this.productDescriptionInput.value = '';
            this.productLocationInput.value = '';
            
            // Reset option tags
            this.optionTags.forEach(tag => tag.classList.remove('selected'));
            
            // Go back to state 1
            this.goToState(1);
            
            // Show success message
            this.showMessage('Image removed successfully');
        }
    }
    
    validateStep2() {
        // Store final input
        this.stepData.productLocation = this.productLocationInput.value.trim();
        
        // Validate all data
        if (!this.stepData.imageType) {
            this.showMessage('Please select an image type', 'error');
            this.goToState(1);
            return;
        }
        
        if (!this.stepData.productDescription) {
            this.showMessage('Please describe what the product is about', 'error');
            this.goToState(2);
            return;
        }
        
        if (!this.stepData.productLocation) {
            this.showMessage('Please describe where this lives in the product', 'error');
            return;
        }
        
        // All data is valid, proceed to next step
        this.showMessage('Step 2 completed successfully!', 'success');
        
        // Store data (in a real app, this would be sent to backend)
        console.log('Step 2 Data:', this.stepData);
        
        // Navigate to next step (step 3)
        setTimeout(() => {
            // For now, just show an alert. In the future, this will navigate to step 3
            alert('Moving to step 3! (This will be implemented in the next step)');
        }, 1000);
    }
    
    navigateNext() {
        // This would navigate to the next step in the flow
        alert('This will navigate to the next step in the upload flow');
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

// Initialize Step 2 when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Step2Manager();
});
