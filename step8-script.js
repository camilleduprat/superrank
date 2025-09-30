// Step 8 - Coming Soon
class Step8Manager {
    constructor() {
        this.closeButton = document.getElementById('closeButton');
        this.shareTwitter = document.getElementById('shareTwitter');
        this.shareLinkedIn = document.getElementById('shareLinkedIn');
        this.shareWhatsApp = document.getElementById('shareWhatsApp');
        this.shareCopy = document.getElementById('shareCopy');
        
        this.init();
    }
    
    init() {
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.navigateToHome());
        }
        
        if (this.shareTwitter) {
            this.shareTwitter.addEventListener('click', () => this.shareToTwitter());
        }
        
        if (this.shareLinkedIn) {
            this.shareLinkedIn.addEventListener('click', () => this.shareToLinkedIn());
        }
        
        if (this.shareWhatsApp) {
            this.shareWhatsApp.addEventListener('click', () => this.shareToWhatsApp());
        }
        
        if (this.shareCopy) {
            this.shareCopy.addEventListener('click', () => this.copyLink());
        }
    }
    
    navigateToHome() {
        window.location.href = 'index.html';
    }
    
    shareToTwitter() {
        const url = encodeURIComponent('https://super-ai.design/index.html');
        const text = encodeURIComponent("Check out my design ranking on SuperRank!");
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    }
    
    shareToLinkedIn() {
        const url = encodeURIComponent('https://super-ai.design/index.html');
        const title = encodeURIComponent("My Design Ranking - SuperRank");
        const summary = encodeURIComponent("Check out my design ranking on SuperRank!");
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`, '_blank');
    }
    
    shareToWhatsApp() {
        const url = encodeURIComponent('https://super-ai.design/index.html');
        const text = encodeURIComponent('Check out my design ranking on SuperRank!');
        // Use wa.me schema (works on mobile and desktop WhatsApp Web)
        window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    }
    
    copyLink() {
        navigator.clipboard.writeText('https://super-ai.design/index.html').then(() => {
            // Show feedback that link was copied
            const button = this.shareCopy;
            const originalText = button.querySelector('span').textContent;
            button.querySelector('span').textContent = 'Copied!';
            button.style.background = 'rgba(0, 255, 136, 0.1)';
            button.style.borderColor = 'rgba(0, 255, 136, 0.3)';
            
            setTimeout(() => {
                button.querySelector('span').textContent = originalText;
                button.style.background = '';
                button.style.borderColor = '';
            }, 2000);
        }).catch(() => {
            console.error('Failed to copy link');
        });
    }
}

// Initialize Step 8 when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Step8Manager();
});
