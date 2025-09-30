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
        this.topCloseButton = document.getElementById('topCloseButton');
        
        console.log('Rating step elements initialized:', {
            uploadButton: !!this.uploadButton,
            fileInput: !!this.fileInput,
            topCloseButton: !!this.topCloseButton
        });
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
        
        // Navigation buttons (only if they exist)
        if (this.backButton) {
            this.backButton.addEventListener('click', () => {
                this.navigateBack();
            });
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                this.navigateNext();
            });
        }
        
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
        
        
        
        // Top close button click
        this.topCloseButton.addEventListener('click', () => {
            console.log('Top close button clicked - navigating to index.html');
            window.location.href = 'index.html';
        });
    }
    
    async handleFileUpload(files) {
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
        
        // Store file data in sessionStorage for use in next steps
        try {
            const file = validFiles[0]; // We only allow one file
            const dataUrl = await this.fileToDataUrl(file);
            
            sessionStorage.setItem('uploadedFile', JSON.stringify({
                name: file.name,
                size: file.size,
                type: file.type,
                dataUrl: dataUrl
            }));
            
            console.log('File stored in sessionStorage:', file.name);
        } catch (error) {
            console.error('Failed to store file data:', error);
            this.showError('Failed to process uploaded file');
            return;
        }
        
        // Update UI
        this.updateUploadButton();
        
        // Show success feedback
        this.showSuccess('Image uploaded successfully');
        
        // Automatically navigate to step2 after a short delay
        setTimeout(() => {
            this.goToNextStep();
        }, 1000);
    }
    
    // Helper function to convert file to data URL
    fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    
    updateUploadButton() {
        // Remove all state classes
        this.uploadButton.classList.remove('state-1', 'success', 'error');
        
        if (this.uploadedFiles.length === 0) {
            // Default state - no additional classes needed
        } else {
            // Add state-1 class for single image
            this.uploadButton.classList.add('state-1');
        }
    }
    
    updateNavigationState() {
        // No longer needed since we auto-navigate to step2
        // Keeping method for compatibility but it does nothing
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
        if (this.uploadedFiles.length > 0) {
            console.log('Navigating to next step...');
            
            // Navigate to next step (prompting step)
            this.goToNextStep();
        }
    }
    
    goToNextStep() {
        // Navigate to Prompting Step
        window.location.href = 'step2.html';
    }
    
    updateProgress() {
        // Progress dots don't exist in rating step, so this method is not needed
        // Keeping it for compatibility but it won't do anything
    }
    
    addBounceAnimation(button) {
        button.classList.add('bounce');
        setTimeout(() => {
            button.classList.remove('bounce');
        }, 600);
    }
    
    showSuccess(message) {
        // Create temporary success message with new white rounded pill design
        const successDiv = document.createElement('div');
        successDiv.className = 'status-message success';
        
        successDiv.innerHTML = `
            <span class="message-icon">􀆈</span>
            <span class="message-text">${message}</span>
        `;
        
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            color: #171717;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 400;
            z-index: 10000;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 8px;
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
        
        errorDiv.innerHTML = `
            <span class="message-icon">􀆈</span>
            <span class="message-text">${message}</span>
        `;
        
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            color: black;
            padding: 12px 16px;
            border-radius: 20px;
            font-weight: 400;
            font-size: 14px;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
