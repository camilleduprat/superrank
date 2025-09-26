// Prompting Step JavaScript - ChatInput State Management

class PromptingStepManager {
    constructor() {
        this.currentState = 1;
        this.maxStates = 3;
        this.stepData = {
            imageType: null,
            productDescription: '',
            productLocation: '',
            selectedLocation: null
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
        this.promptingStepBackBtn = document.getElementById('promptingStepBackBtn');
        this.promptingStepNextBtn = document.getElementById('promptingStepNextBtn');
        this.productDescriptionInput = document.getElementById('productDescriptionInput');
        this.stepImageCloseBtn2 = document.getElementById('stepImageCloseBtn2');
        
        // State 3 elements
        this.step3BackBtn = document.getElementById('step3BackBtn');
        this.productLocationInput = document.getElementById('productLocationInput');
        this.stepImageCloseBtn3 = document.getElementById('stepImageCloseBtn3');
        this.locationCards = document.querySelectorAll('.location-card');
        
        // Progress bars
        this.step1ProgressFill = document.getElementById('step1ProgressFill');
        this.promptingStepProgressFill = document.getElementById('promptingStepProgressFill');
        this.step3ProgressFill = document.getElementById('step3ProgressFill');
    }
    
    bindEvents() {
        // Top close button
        if (this.topCloseButton) {
            this.topCloseButton.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
        
        // Optional navigation buttons (may not exist in this page)
        if (this.backButton) {
            this.backButton.addEventListener('click', () => {
                window.location.href = 'rating.html';
            });
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                this.navigateNext();
            });
        }
        
        if (this.nextArrowButton) {
            this.nextArrowButton.addEventListener('click', () => {
                this.validatePromptingStep();
            });
        }
        
        // State 1 events
        this.optionTags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                this.selectImageType(e.target.dataset.value);
            });
        });
        
        if (this.stepImageCloseBtn) {
            this.stepImageCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clearImage();
            });
        }
        
        // State 2 events
        if (this.promptingStepBackBtn) {
            this.promptingStepBackBtn.addEventListener('click', () => {
                this.goToState(1);
            });
        }
        
        if (this.promptingStepNextBtn) {
            this.promptingStepNextBtn.addEventListener('click', () => {
                if (this.productDescriptionInput && this.productDescriptionInput.value.trim()) {
                    this.stepData.productDescription = this.productDescriptionInput.value.trim();
                    this.goToState(3);
                }
            });
        }
        
        if (this.stepImageCloseBtn2) {
            this.stepImageCloseBtn2.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clearImage();
            });
        }
        
        // State 3 events
        if (this.step3BackBtn) {
            this.step3BackBtn.addEventListener('click', () => {
                this.goToState(2);
            });
        }
        
        if (this.stepImageCloseBtn3) {
            this.stepImageCloseBtn3.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clearImage();
            });
        }
        
        // Input validation
        if (this.productDescriptionInput) {
            this.productDescriptionInput.addEventListener('input', () => {
                this.updatePromptingStepNextButton();
            });
        }
        
        if (this.productLocationInput) {
        this.productLocationInput.addEventListener('input', () => {
            this.updateStep3Validation();
        });
        
        // Location card selection events
        this.locationCards.forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectLocationCard(e.target.closest('.location-card'));
            });
        });
        }
        
        // Enter key support
        if (this.productDescriptionInput) {
            this.productDescriptionInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && this.productDescriptionInput.value.trim()) {
                    this.stepData.productDescription = this.productDescriptionInput.value.trim();
                    this.goToState(3);
                }
            });
        }
        
        if (this.productLocationInput) {
            this.productLocationInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && this.productLocationInput.value.trim()) {
                    this.stepData.productLocation = this.productLocationInput.value.trim();
                    this.validatePromptingStep();
                }
            });
        }
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
    
    selectLocationCard(card) {
        // Remove previous selection
        this.locationCards.forEach(c => c.classList.remove('selected'));
        
        // Add selection to clicked card
        card.classList.add('selected');
        
        // Store selection
        this.stepData.selectedLocation = card.dataset.location;
        
        // Update input field with card title
        const cardTitle = card.querySelector('.card-title').textContent;
        this.productLocationInput.value = cardTitle;
        
        // Update validation
        this.updateStep3Validation();
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
        this.updatePromptingStepNextButton();
        this.updateStep3Validation();
    }
    
    updatePromptingStepNextButton() {
        const hasInput = this.productDescriptionInput.value.trim().length > 0;
        this.promptingStepNextBtn.style.opacity = hasInput ? '1' : '0.5';
        this.promptingStepNextBtn.style.pointerEvents = hasInput ? 'auto' : 'none';
    }
    
    updateStep3Validation() {
        const hasInput = this.productLocationInput.value.trim().length > 0;
        this.nextArrowButton.style.opacity = hasInput ? '1' : '0';
        this.nextArrowButton.style.pointerEvents = hasInput ? 'auto' : 'none';
    }
    
    updateProgress() {
        // Reset all progress bars
        this.step1ProgressFill.style.width = '0%';
        this.promptingStepProgressFill.style.width = '0%';
        this.step3ProgressFill.style.width = '0%';
        
        // Update progress based on current state
        if (this.currentState === 1) {
            this.step1ProgressFill.style.width = '33%';
        } else if (this.currentState === 2) {
            this.step1ProgressFill.style.width = '33%';
            this.promptingStepProgressFill.style.width = '66%';
        } else if (this.currentState === 3) {
            this.step1ProgressFill.style.width = '33%';
            this.promptingStepProgressFill.style.width = '66%';
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
            
            // Reset location cards
            this.locationCards.forEach(card => card.classList.remove('selected'));
            
            // Go back to state 1
            this.goToState(1);
            
            // Show success message
            this.showMessage('Image removed successfully');
        }
    }
    
    async validatePromptingStep() {
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
        
        // All data is valid, now rate the design
        try {
            this.showMessage('Analyzing your design...', 'success');
            this.showLoadingSpinner();
            
            // Import the growthClient functions
            const { rateDesign, showError } = await import('./growthClient.js');
            
            // Get the uploaded file from sessionStorage (stored in rating.html)
            const uploadedFileData = sessionStorage.getItem('uploadedFile');
            if (!uploadedFileData) {
                throw new Error('No uploaded file found. Please go back and upload an image.');
            }
            
            const uploadedFile = JSON.parse(uploadedFileData);
            
            // Create context string from collected data
            const context = `Image Type: ${this.stepData.imageType}\nProduct Description: ${this.stepData.productDescription}\nProduct Location: ${this.stepData.productLocation}`;
            
            // Convert base64 back to file for API call
            const file = await this.dataURLtoFile(uploadedFile.dataUrl, uploadedFile.name);
            
            // Call rateDesign API
            const ratingResult = await rateDesign({ 
                file: file, 
                context: context 
            });
            
            // Store rating data for next steps
            sessionStorage.setItem('ratingData', JSON.stringify({
                rating_id: ratingResult.rating_id,
                request_id: ratingResult.request_id,
                grade: ratingResult.grade,
                justification: ratingResult.justification || '',
                context: context
            }));
            
            this.showMessage('Design analysis complete!', 'success');
            
            // Navigate to email collection step
            setTimeout(() => {
                window.location.href = 'step5.html';
            }, 1000);
            
        } catch (error) {
            console.error('Failed to rate design:', error);
            this.showMessage('Failed to analyze design. Please try again.', 'error');
        } finally {
            this.hideLoadingSpinner();
        }
    }
    
    // Helper function to convert dataURL back to File
    dataURLtoFile(dataurl, filename) {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }
    
    navigateNext() {
        // Navigate to step 5 (email collection)
        window.location.href = 'step5.html';
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
    
    .prompting-spinner {
        position: fixed;
        z-index: 4000;
        pointer-events: none;
    }
    .prompting-spinner img {
        width: 42px;
        height: 42px;
    }
`;
document.head.appendChild(style);

// Initialize Prompting Step when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PromptingStepManager();
});

// Loading spinner helpers on prototype
PromptingStepManager.prototype.showLoadingSpinner = function() {
    if (document.getElementById('promptingSpinner')) return;
    const holder = document.createElement('div');
    holder.id = 'promptingSpinner';
    holder.className = 'prompting-spinner';
    const img = document.createElement('img');
    img.src = 'assets/images/icon-loading.png';
    img.alt = 'Loading';
    img.style.animation = 'spin 1.2s linear infinite';
    holder.appendChild(img);
    document.body.appendChild(holder);
    this.positionSpinner();
    window.addEventListener('resize', this._positionSpinnerHandler = () => this.positionSpinner());
};

PromptingStepManager.prototype.hideLoadingSpinner = function() {
    const holder = document.getElementById('promptingSpinner');
    if (holder) holder.remove();
    if (this._positionSpinnerHandler) {
        window.removeEventListener('resize', this._positionSpinnerHandler);
        this._positionSpinnerHandler = null;
    }
};

// Anchor spinner above the next arrow and slightly left so it's clearly visible
PromptingStepManager.prototype.positionSpinner = function() {
    const holder = document.getElementById('promptingSpinner');
    const arrow = document.getElementById('nextArrowButton');
    if (!holder || !arrow) return;
    const rect = arrow.getBoundingClientRect();
    // Position clearly ABOVE the arrow and slightly left so it's visible
    const offsetY = 220; // px above the arrow
    const offsetX = 60;  // px left from arrow center
    const x = rect.left + rect.width / 2 - 21 - offsetX; // center minus half spinner width
    const y = rect.top - offsetY;
    holder.style.left = `${Math.max(16, x)}px`;
    holder.style.top = `${Math.max(16, y)}px`;
};
