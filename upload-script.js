// Upload Flow JavaScript

class UploadFlow {
    constructor() {
        this.currentStep = 1;
        this.maxSteps = 7;
        this.uploadedFiles = [];
        this.maxFiles = 1;
        
        this.initializeElements();
        this.bindEvents();
    }
    
    initializeElements() {
        this.uploadButton = document.getElementById('uploadButton');
        this.fileInput = document.getElementById('fileInput');
        this.backButton = document.getElementById('backButton');
        this.nextButton = document.getElementById('nextButton');
        this.progressDots = document.querySelectorAll('.progress-dot');
        this.closeButton = document.getElementById('closeButton');
        this.nextArrowButton = document.getElementById('nextArrowButton');
        this.topCloseButton = document.getElementById('topCloseButton');
    }
    
    bindEvents() {
        // Upload button click
        this.uploadButton.addEventListener('click', () => {
            this.fileInput.click();
        });
        
        // File input change
        this.fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });
        
        // Navigation buttons
        this.backButton.addEventListener('click', () => {
            this.navigateBack();
        });
        
        this.nextButton.addEventListener('click', () => {
            this.navigateNext();
        });
        
        // Drag and drop functionality
        this.uploadButton.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadButton.classList.add('dragover');
        });
        
        this.uploadButton.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.uploadButton.classList.remove('dragover');
        });
        
        this.uploadButton.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadButton.classList.remove('dragover');
            this.handleFileUpload(e.dataTransfer.files);
        });
        
        // Close button click
        this.closeButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering upload button
            this.clearUploadedFiles();
        });
        
        // Next arrow button click
        this.nextArrowButton.addEventListener('click', () => {
            this.navigateNext();
        });
        
        // Top close button click
        this.topCloseButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    handleFileUpload(files) {
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(file => {
            return file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024; // 10MB limit
        });
        
        if (validFiles.length === 0) {
            this.showError('Please select valid image files (max 10MB each)');
            return;
        }
        
        // Check if adding these files would exceed the limit
        if (this.uploadedFiles.length + validFiles.length > this.maxFiles) {
            this.showError(`You can only upload ${this.maxFiles} image`);
            return;
        }
        
        // Add files to uploaded files
        this.uploadedFiles = [...this.uploadedFiles, ...validFiles];
        
        // Update UI
        this.updateUploadButton();
        this.updateNavigationState();
        
        // Show success feedback
        this.showSuccess('Image uploaded successfully');
    }
    
    updateUploadButton() {
        // Remove all state classes
        this.uploadButton.classList.remove('state-1', 'success', 'error');
        
        if (this.uploadedFiles.length === 0) {
            // Default state - no additional classes needed
            this.closeButton.style.display = 'none';
            this.nextArrowButton.style.display = 'none';
        } else {
            // Add state-1 class for single image
            this.uploadButton.classList.add('state-1');
            this.closeButton.style.display = 'flex';
            this.nextArrowButton.style.display = 'flex';
        }
    }
    
    updateNavigationState() {
        // Enable next button if files are uploaded
        if (this.uploadedFiles.length > 0) {
            this.nextButton.disabled = false;
            this.nextButton.style.opacity = '1';
        } else {
            this.nextButton.disabled = true;
            this.nextButton.style.opacity = '0.5';
        }
    }
    
    navigateBack() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateProgress();
            this.addBounceAnimation(this.backButton);
            
            // Handle back navigation logic
            if (this.currentStep === 1) {
                // Go back to landing page
                window.location.href = 'index.html';
            }
        }
    }
    
    navigateNext() {
        if (this.currentStep < this.maxSteps && this.uploadedFiles.length > 0) {
            this.currentStep++;
            this.updateProgress();
            this.addBounceAnimation(this.nextButton);
            this.addBounceAnimation(this.nextArrowButton);
            
            // Handle next navigation logic
            if (this.currentStep === 2) {
                // Navigate to next step
                this.goToNextStep();
            }
        }
    }
    
    goToNextStep() {
        // Navigate to Step 2
        window.location.href = 'step2.html';
    }
    
    updateProgress() {
        this.progressDots.forEach((dot, index) => {
            if (index < this.currentStep) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    addBounceAnimation(button) {
        button.classList.add('bounce');
        setTimeout(() => {
            button.classList.remove('bounce');
        }, 600);
    }
    
    showSuccess(message) {
        // Create temporary success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 255, 136, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
    
    showError(message) {
        // Create temporary error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 68, 68, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
    
    clearUploadedFiles() {
        this.uploadedFiles = [];
        this.fileInput.value = '';
        this.updateUploadButton();
        this.updateNavigationState();
        this.showSuccess('Uploaded image cleared');
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
    
    .upload-button.dragover {
        border-color: #00ff88;
        background: rgba(0, 255, 136, 0.1);
        transform: scale(1.05);
    }
`;
document.head.appendChild(style);

// Initialize upload flow when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UploadFlow();
});
