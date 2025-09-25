// Generate placeholder users as fallback
const generatePlaceholderUsers = () => {
    const firstNames = [
        'Julien', 'Thomas', 'Maxime', 'Aurélien', 'Théo', 'Kagan', 'Yohan',
        'Alexandre', 'Benjamin', 'Camille', 'David', 'Emma', 'Fabien', 'Gabriel',
        'Hugo', 'Isabelle', 'Julien', 'Kevin', 'Lucas', 'Marie', 'Nicolas',
        'Olivier', 'Paul', 'Quentin', 'Romain', 'Sophie', 'Tristan', 'Ulysse',
        'Valentin', 'William', 'Xavier', 'Yann', 'Zoé', 'Antoine', 'Baptiste',
        'Cédric', 'Damien', 'Émilie', 'Florian', 'Guillaume', 'Hélène', 'Ivan',
        'Jérémy', 'Kévin', 'Léa', 'Mathieu', 'Noémie', 'Pierre', 'Quentin'
    ];
    
    const lastNames = [
        'Martin', 'Mauranx', 'Gérardin', 'Barot', 'Turpin', 'Sumer', 'Darose',
        'Dubois', 'Moreau', 'Laurent', 'Simon', 'Michel', 'Lefebvre', 'Leroy',
        'Roux', 'David', 'Bertrand', 'Morel', 'Fournier', 'Girard', 'André',
        'Lefèvre', 'Mercier', 'Dupont', 'Lambert', 'Bonnet', 'François', 'Martinez',
        'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre',
        'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Thomas', 'Robert',
        'Richard', 'Petit', 'Durand', 'Dubois', 'Moreau', 'Laurent', 'Simon'
    ];
    
    const users = [];
    
    // Generate realistic scores (higher scores are rarer)
    for (let i = 0; i < 50; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        // Generate realistic score distribution (most scores between 600-950)
        let score;
        if (i < 5) {
            // Top 5: 920-1000
            score = Math.floor(Math.random() * 80) + 920;
        } else if (i < 15) {
            // Next 10: 850-920
            score = Math.floor(Math.random() * 70) + 850;
        } else if (i < 30) {
            // Next 15: 750-850
            score = Math.floor(Math.random() * 100) + 750;
        } else {
            // Rest: 600-750
            score = Math.floor(Math.random() * 150) + 600;
        }
        
        users.push({
            rank: i + 1,
            name: `${firstName} ${lastName}`,
            score: score
        });
    }
    
    // Sort by score (highest first)
    return users.sort((a, b) => b.score - a.score).map((user, index) => ({
        ...user,
        rank: index + 1
    }));
};

// Populate leaderboard with real data from backend
const populateLeaderboard = async () => {
    const leaderboardList = document.getElementById('leaderboardList');
    
    try {
        // Import the growthClient functions
        const { getLeaderboard, showError } = await import('./growthClient.js');
        
        // Fetch real leaderboard data
        const leaderboardData = await getLeaderboard(50);
        
        // Transform backend data to match our UI format
        const users = leaderboardData.map((user, index) => ({
            rank: index + 1,
            name: user.username || 'Anonymous',
            score: user.best_grade || 0
        }));
        
        leaderboardList.innerHTML = '';
        
        users.forEach((user, index) => {
            const entry = document.createElement('div');
            entry.className = 'leaderboard-entry';
            if (index === 0) {
                entry.classList.add('highlighted');
            }
            
            entry.innerHTML = `
                <div class="entry-info">
                    <span class="entry-rank">#${user.rank}</span>
                    <span class="entry-name">${user.name}</span>
                </div>
                <span class="entry-score">${user.score}</span>
            `;
            
            leaderboardList.appendChild(entry);
        });
        
        // Update user count with real data
        updateUserCount(users.length);
        
    } catch (error) {
        console.error('Failed to load leaderboard:', error);
        showError('Failed to load leaderboard. Using placeholder data.');
        
        // Fallback to placeholder data
        const users = generatePlaceholderUsers();
        
        leaderboardList.innerHTML = '';
        
        users.forEach((user, index) => {
            const entry = document.createElement('div');
            entry.className = 'leaderboard-entry';
            if (index === 0) {
                entry.classList.add('highlighted');
            }
            
            entry.innerHTML = `
                <div class="entry-info">
                    <span class="entry-rank">#${user.rank}</span>
                    <span class="entry-name">${user.name}</span>
                </div>
                <span class="entry-score">${user.score}</span>
            `;
            
            leaderboardList.appendChild(entry);
        });
    }
};

// Update user count with real data or fallback
const updateUserCount = (realCount = null) => {
    const userCountElement = document.getElementById('userCount');
    
    if (realCount !== null) {
        // Use real count from leaderboard
        userCountElement.textContent = realCount.toLocaleString();
    } else {
        // Fallback to simulated data
        const baseCount = 19247;
        const randomVariation = Math.floor(Math.random() * 100) - 50; // ±50 variation
        const newCount = baseCount + randomVariation;
        
        userCountElement.textContent = newCount.toLocaleString();
    }
};

// Add smooth scroll behavior to leaderboard
const addSmoothScroll = () => {
    const leaderboardList = document.getElementById('leaderboardList');
    
    leaderboardList.addEventListener('wheel', (e) => {
        e.preventDefault();
        leaderboardList.scrollTop += e.deltaY;
    });
};

// Add click handlers for leaderboard entries
const addLeaderboardInteractions = () => {
    const entries = document.querySelectorAll('.leaderboard-entry');
    
    entries.forEach(entry => {
        entry.addEventListener('click', () => {
            // Remove previous selection
            entries.forEach(e => e.classList.remove('selected'));
            // Add selection to clicked entry
            entry.classList.add('selected');
        });
    });
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await populateLeaderboard();
    addSmoothScroll();
    addLeaderboardInteractions();
    
    // Refresh leaderboard every 30 seconds
    setInterval(async () => {
        await populateLeaderboard();
    }, 30000);
});

// Add keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement.classList.contains('cta-button')) {
        window.location.href = 'rating.html';
    }
});
