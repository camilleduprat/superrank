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
            // If sections are empty but we have justification, try to enrich cards
            if ((!this.resultsData.sectionsMap || Object.keys(this.resultsData.sectionsMap).length === 0) && this.resultsData.justification) {
                this.updateCardsFromJustification(this.resultsData.justification);
            }
            this.parseFromRatingDataAndRender();
        } else {
            console.warn('No results data found for step 8');
            // Immediate fallback: attempt to parse from ratingData.justification for visible UI
            const ratingRaw = sessionStorage.getItem('ratingData');
            if (ratingRaw) {
                try {
                    const rd = JSON.parse(ratingRaw);
                    const just = rd.justification || '';
                    const punch = (just.match(/\*\*(.*?)\*\*/) || [])[1] || '';
                    const subtitle = document.querySelector('.subtitle-feedback span');
                    if (subtitle && punch) subtitle.textContent = punch;
                    // Fill points if grade stored
                    const pointsElement = document.querySelector('.upload-title.points-title h1');
                    if (pointsElement && typeof rd.grade === 'number') pointsElement.textContent = rd.grade;
                    // Fill cards from justification
                    this.updateCardsFromJustification(just);
                } catch {}
            }
            // Background recovery to fetch fresh
            this.recoverResults();
            this.parseFromRatingDataAndRender();
        }
    }

    async fetchAndRenderFromBackend() {
        try {
            const { getRating } = await import('./growthClient.js');
            const claimRaw = sessionStorage.getItem('claimData');
            const ratingRaw = sessionStorage.getItem('ratingData');
            const claim = claimRaw ? JSON.parse(claimRaw) : {};
            const rd = ratingRaw ? JSON.parse(ratingRaw) : {};
            const ratingId = claim.ratingId || rd.rating_id || rd.ratingId || rd.id;
            if (!ratingId) return;
            const data = await getRating(ratingId);
            // Points
            const pointsElement = document.querySelector('.upload-title.points-title h1');
            if (pointsElement && typeof data.grade === 'number') pointsElement.textContent = data.grade;
            // Punchline from justification bold or data.punchline
            const subtitle = document.querySelector('.subtitle-feedback span');
            const m = String(data.justification || '').match(/\*\*(.*?)\*\*/);
            const punch = data.punchline || (m ? m[1] : '');
            if (subtitle && punch) subtitle.textContent = punch;
            // Cards from improvements or parsed justification
            if (Array.isArray(data.improvements) && data.improvements.length) {
                this.resultsData = this.resultsData || {};
                this.resultsData.sectionsMap = {};
                for (const it of data.improvements) {
                    const key = String(it.category || '').toLowerCase().replace(/[^a-z]/g, '');
                    this.resultsData.sectionsMap[key] = { title: it.category, description: it.description };
                }
                this.updateAnalysisDisplay();
            } else if (data.justification) {
                this.updateCardsFromJustification(data.justification);
            }
        } catch (e) {
            console.warn('Step8 backend hydrate failed', e);
        }
    }

    async recoverResults() {
        try {
            const claimDataStr = sessionStorage.getItem('claimData');
            if (!claimDataStr) return;
            const claimData = JSON.parse(claimDataStr);
            const { getRating, getLeaderboard } = await import('./growthClient.js');

            const [fullRating, leaderboard] = await Promise.all([
                getRating(claimData.ratingId).catch(() => null),
                getLeaderboard(500).catch(() => [])
            ]);

            let userRank = null;
            if (leaderboard && leaderboard.length) {
                const idx = leaderboard.findIndex(u => (u.username || '').toLowerCase() === (claimData.username || '').toLowerCase());
                if (idx >= 0) userRank = idx + 1;
            }

            const resultsPayload = {
                userRank: userRank || null,
                username: claimData.username,
                email: claimData.email,
                grade: fullRating?.grade ?? null,
                justification: fullRating?.justification || '',
                improvements: Array.isArray(fullRating?.improvements) ? fullRating.improvements : []
            };
            sessionStorage.setItem('fullResults', JSON.stringify(resultsPayload));
            this.resultsData = resultsPayload;
            this.updateAnalysisDisplay();
        } catch (e) {
            console.error('Recovery for step 8 failed', e);
        }
    }
    
    updateAnalysisDisplay() {
        if (!this.resultsData) return;
        
        // Update points display
        const pointsElement = document.querySelector('.upload-title.points-title h1');
        if (pointsElement && (typeof this.resultsData.grade === 'number')) {
            pointsElement.textContent = this.resultsData.grade;
        }
        // Update overall review (subtitle top-left)
        const subtitle = document.querySelector('.subtitle-feedback span');
        if (subtitle) {
            const msg = this.resultsData.punchline || this.resultsData.justification || '';
            if (msg) subtitle.textContent = msg;
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
        
        // Build a lookup by normalized category name for precise mapping
        const byCategory = new Map();
        if (this.resultsData.sectionsMap) {
            for (const [k, v] of Object.entries(this.resultsData.sectionsMap)) {
                byCategory.set(k, v);
            }
        } else {
            for (const item of improvements) {
                if (!item) continue;
                const key = String(item.category || item.title || '').toLowerCase().replace(/[^a-z]/g, '');
                if (key) byCategory.set(key, { title: item.category || item.title, description: item.description || item.feedback });
            }
        }
        
        cards.forEach((card) => {
            const titleElement = card.querySelector('.card-title');
            const descriptionElement = card.querySelector('.card-description');
            const rawTitle = titleElement ? titleElement.textContent : '';
            const norm = String(rawTitle || '').toLowerCase().replace(/[^a-z]/g, '');
            const match = byCategory.get(norm);
            if (match) {
                if (titleElement && match.title) titleElement.textContent = match.title;
                if (descriptionElement && match.description) {
                    descriptionElement.textContent = match.description;
                }
            }
        });
    }

    // Parse large justification block and inject card texts directly
    updateCardsFromJustification(justText) {
        if (!justText) return;
        const pairs = [
            ['usability', 'Usability'],
            ['informationarchitecture', 'Information architecture'],
            ['lookfeel', 'Look & feel'],
            ['consistency', 'Consistency'],
            ['businessandconversion', 'Business & conversion'],
            ['businessconversion', 'Business & conversion']
        ];
        const found = new Map();
        for (const [norm, label] of pairs) {
            const re = new RegExp(`${label}\\n([\u0000-\uFFFF]*?)(?=\n\n|\n[A-Z].*\n|$|\\n${pairs.map(p=>p[1]).join('|')})`, 'i');
            const m = justText.match(re);
            if (m && m[1]) found.set(norm, m[1].trim());
        }
        const cards = document.querySelectorAll('.evaluation-card');
        cards.forEach((card) => {
            const titleElement = card.querySelector('.card-title');
            const descriptionElement = card.querySelector('.card-description');
            const rawTitle = titleElement ? titleElement.textContent : '';
            const norm = String(rawTitle || '').toLowerCase().replace(/[^a-z]/g, '');
            const text = found.get(norm);
            if (text && descriptionElement) descriptionElement.textContent = text.replace(/[\u{1F44D}\u{1F44E}]\s*/gu, '').replace(/^[^A-Za-z0-9]*/, '').trim();
        });
    }

    // Parse grade/punchline/sections purely from ratingData.justification (string-level)
    parseFromRatingDataAndRender() {
        try {
            const ratingRaw = sessionStorage.getItem('ratingData');
            if (!ratingRaw) return;
            const rd = JSON.parse(ratingRaw);
            const just = String(rd.justification || '');
            // Grade from TOTAL DESIGN POINTS: NNN (out of 1000)
            const gm = just.match(/TOTAL\s+DESIGN\s+POINTS:\s*(\d+)\s*\(\s*out of\s*1000\s*\)/i);
            const grade = gm ? parseInt(gm[1], 10) : rd.grade;
            const pointsElement = document.querySelector('.upload-title.points-title h1');
            if (pointsElement && typeof grade === 'number') pointsElement.textContent = grade;
            // Punchline between points line and Usability, or bold **...**
            let punch = (just.match(/\*\*(.*?)\*\*/s) || [])[1] || '';
            if (!punch) {
                const afterPoints = just.split(/TOTAL\s+DESIGN\s+POINTS[^\n]*\n/i)[1] || '';
                punch = (afterPoints.split(/\n\s*Usability/i)[0] || '').trim();
            }
            const subtitle = document.querySelector('.subtitle-feedback span');
            if (subtitle && punch) subtitle.textContent = punch;
            // Sections
            this.updateCardsFromJustification(just);
        } catch {}
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
