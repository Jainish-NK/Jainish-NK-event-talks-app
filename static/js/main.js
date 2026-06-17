document.addEventListener('DOMContentLoaded', () => {
    // State Variables
    let allNotes = [];
    let activeCategory = 'all';
    let searchQuery = '';

    // DOM Elements
    const refreshBtn = document.getElementById('refresh-btn');
    const searchInput = document.getElementById('search-input');
    const searchClearBtn = document.getElementById('search-clear-btn');
    
    const loadingSkeletons = document.getElementById('loading-skeletons');
    const emptyState = document.getElementById('empty-state');
    const notesList = document.getElementById('notes-list');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');

    // Stats Elements
    const statTotal = document.getElementById('stat-total');
    const statAnnouncements = document.getElementById('stat-announcements');
    const statFeatures = document.getElementById('stat-features');
    const statFixes = document.getElementById('stat-fixes');
    const statDeprecations = document.getElementById('stat-deprecations');

    // Category Filter Elements
    const filterPills = document.querySelectorAll('.filter-pill');
    const countAll = document.getElementById('count-all');
    const countAnnouncements = document.getElementById('count-announcements');
    const countFeatures = document.getElementById('count-features');
    const countFixes = document.getElementById('count-fixes');
    const countDeprecations = document.getElementById('count-deprecations');

    const feedTitle = document.getElementById('feed-title');
    const syncStatus = document.getElementById('sync-status');

    // Active Filters Bar Elements
    const activeFiltersBar = document.getElementById('active-filters-bar');
    const activeFiltersList = document.getElementById('active-filters-list');
    const clearAllFiltersBtn = document.getElementById('clear-all-filters');

    // Stats Card elements to make them clickable
    const statCards = document.querySelectorAll('.stat-card');

    // Initialization
    loadReleaseNotes();

    // Fetch and Load Release Notes
    async function loadReleaseNotes() {
        // Update UI states to loading
        refreshBtn.classList.add('loading');
        refreshBtn.disabled = true;
        loadingSkeletons.style.display = 'flex';
        notesList.style.display = 'none';
        emptyState.style.display = 'none';
        syncStatus.textContent = 'Syncing...';

        try {
            const response = await fetch('/api/release-notes');
            const data = await response.json();

            if (data.success) {
                allNotes = data.entries;
                
                // Update Feed metadata
                feedTitle.textContent = data.title;
                syncStatus.textContent = `Last synced: ${data.updated}`;

                // Update UI panels
                updateStatistics(data.stats);
                updateCategoryCounts();
                filterAndRender();
            } else {
                console.error("API error:", data.error);
                showNotification(`Failed to load: ${data.error}`, 'error');
                syncStatus.textContent = 'Failed to sync';
            }
        } catch (err) {
            console.error("Fetch error:", err);
            showNotification('Network error occurred while syncing.', 'error');
            syncStatus.textContent = 'Connection error';
        } finally {
            // Re-enable sync button
            refreshBtn.classList.remove('loading');
            refreshBtn.disabled = false;
            loadingSkeletons.style.display = 'none';
        }
    }

    // Update statistics display values
    function updateStatistics(stats) {
        statTotal.textContent = stats.total_updates;
        statAnnouncements.textContent = stats.announcements;
        statFeatures.textContent = stats.features;
        statFixes.textContent = stats.fixes;
        statDeprecations.textContent = stats.deprecations;
    }

    // Dynamic Category Count Calculations based on current dataset
    function updateCategoryCounts() {
        let total = allNotes.length;
        let announcements = 0;
        let features = 0;
        let fixes = 0;
        let deprecations = 0;

        allNotes.forEach(note => {
            note.categories.forEach(cat => {
                const catLower = cat.lower ? cat.lower() : cat.toLowerCase();
                if (catLower.includes('announcement')) announcements++;
                else if (catLower.includes('feature')) features++;
                else if (catLower.includes('fix') || catLower.includes('bug')) fixes++;
                else if (catLower.includes('deprecation') || catLower.includes('deprecated')) deprecations++;
            });
        });

        countAll.textContent = total;
        countAnnouncements.textContent = announcements;
        countFeatures.textContent = features;
        countFixes.textContent = fixes;
        countDeprecations.textContent = deprecations;
    }

    // Filter and Render updates list
    function filterAndRender() {
        // 1. Filter logic
        const filtered = allNotes.filter(note => {
            // Category Match
            let categoryMatch = false;
            if (activeCategory === 'all') {
                categoryMatch = true;
            } else {
                categoryMatch = note.categories.some(cat => {
                    const catLower = cat.toLowerCase();
                    const activeLower = activeCategory.toLowerCase();
                    return catLower.includes(activeLower) || activeLower.includes(catLower);
                });
            }

            // Search Match
            let searchMatch = false;
            if (!searchQuery) {
                searchMatch = true;
            } else {
                const query = searchQuery.toLowerCase();
                const inTitle = note.title.toLowerCase().includes(query);
                const inContent = note.content.toLowerCase().includes(query);
                const inCategories = note.categories.some(cat => cat.toLowerCase().includes(query));
                searchMatch = inTitle || inContent || inCategories;
            }

            return categoryMatch && searchMatch;
        });

        // 2. Update Active Filters Indicators Bar
        renderActiveFiltersBar();

        // 3. Render list results
        if (filtered.length === 0) {
            notesList.style.display = 'none';
            emptyState.style.display = 'flex';
        } else {
            emptyState.style.display = 'none';
            notesList.innerHTML = '';
            
            filtered.forEach(note => {
                const card = createReleaseCard(note);
                notesList.appendChild(card);
            });
            notesList.style.display = 'flex';
        }
    }

    // Create Release Card HTML Node
    function createReleaseCard(note) {
        const card = document.createElement('article');
        card.className = 'release-card';

        // Format and create badges
        let badgesHtml = '';
        if (note.categories && note.categories.length > 0) {
            note.categories.forEach(cat => {
                let badgeClass = 'badge-other';
                let iconClass = 'fa-tag';
                const catLower = cat.toLowerCase();

                if (catLower.includes('announcement')) {
                    badgeClass = 'badge-announcement';
                    iconClass = 'fa-bullhorn';
                } else if (catLower.includes('feature')) {
                    badgeClass = 'badge-feature';
                    iconClass = 'fa-star';
                } else if (catLower.includes('fix') || catLower.includes('bug')) {
                    badgeClass = 'badge-fix';
                    iconClass = 'fa-circle-check';
                } else if (catLower.includes('deprecation') || catLower.includes('deprecated')) {
                    badgeClass = 'badge-deprecation';
                    iconClass = 'fa-circle-exclamation';
                }

                badgesHtml += `<span class="badge ${badgeClass}"><i class="fa-solid ${iconClass}"></i>${cat}</span>`;
            });
        } else {
            badgesHtml += `<span class="badge badge-other"><i class="fa-solid fa-tag"></i>Update</span>`;
        }

        // Inner Card HTML Structure
        card.innerHTML = `
            <div class="release-card-header">
                <div class="release-date">
                    <i class="fa-regular fa-calendar calendar-icon"></i>
                    <span class="date-text">${note.title}</span>
                </div>
                <div class="release-actions">
                    <div class="badge-container">
                        ${badgesHtml}
                    </div>
                    <button class="card-tweet-btn" title="Tweet about this update">
                        <i class="fa-brands fa-x-twitter"></i>
                    </button>
                    ${note.link ? `
                        <a href="${note.link}" target="_blank" rel="noopener noreferrer" class="card-link" title="Open official release notes">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                    ` : ''}
                </div>
            </div>
            <div class="release-card-body">
                ${note.content}
            </div>
        `;

        // Add event listener to the Tweet button
        const tweetBtn = card.querySelector('.card-tweet-btn');
        if (tweetBtn) {
            tweetBtn.addEventListener('click', () => {
                shareOnTwitter(note.title, note.content, note.link);
            });
        }

        return card;
    }

    // Render filter tag chips inside indicators bar
    function renderActiveFiltersBar() {
        const hasCategory = activeCategory !== 'all';
        const hasSearch = searchQuery !== '';

        if (!hasCategory && !hasSearch) {
            activeFiltersBar.style.display = 'none';
            return;
        }

        activeFiltersList.innerHTML = '';

        if (hasCategory) {
            const chip = document.createElement('div');
            chip.className = 'filter-chip';
            chip.innerHTML = `
                <span>Category: <strong>${activeCategory}</strong></span>
                <i class="fa-solid fa-xmark filter-chip-remove" id="remove-cat-filter"></i>
            `;
            activeFiltersList.appendChild(chip);

            chip.querySelector('#remove-cat-filter').addEventListener('click', () => {
                setCategory('all');
            });
        }

        if (hasSearch) {
            const chip = document.createElement('div');
            chip.className = 'filter-chip';
            
            // Limit text size in display
            const displayQuery = searchQuery.length > 15 ? searchQuery.substring(0, 15) + '...' : searchQuery;
            chip.innerHTML = `
                <span>Search: <strong>"${displayQuery}"</strong></span>
                <i class="fa-solid fa-xmark filter-chip-remove" id="remove-search-filter"></i>
            `;
            activeFiltersList.appendChild(chip);

            chip.querySelector('#remove-search-filter').addEventListener('click', () => {
                searchInput.value = '';
                searchQuery = '';
                searchClearBtn.style.display = 'none';
                filterAndRender();
            });
        }

        activeFiltersBar.style.display = 'flex';
    }

    // Helper: Select category and update active state
    function setCategory(cat) {
        activeCategory = cat;
        
        filterPills.forEach(pill => {
            const pFilter = pill.getAttribute('data-filter');
            if (pFilter === cat || (cat === 'all' && pFilter === 'all')) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });

        filterAndRender();
    }

    // Simple customized toast notification helper
    function showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.bottom = '24px';
        toast.style.right = '24px';
        toast.style.backgroundColor = type === 'error' ? '#ef4444' : '#10b981';
        toast.style.color = '#fff';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.3)';
        toast.style.fontFamily = 'var(--font-body)';
        toast.style.fontSize = '0.88rem';
        toast.style.fontWeight = '500';
        toast.style.zIndex = '9999';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.gap = '8px';
        toast.style.animation = 'slideUp 0.3s forwards';
        
        const icon = type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- Event Listeners ---

    // Sync button event
    refreshBtn.addEventListener('click', loadReleaseNotes);

    // Search bar event
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        if (searchQuery) {
            searchClearBtn.style.display = 'flex';
        } else {
            searchClearBtn.style.display = 'none';
        }
        filterAndRender();
    });

    // Clear search button event
    searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        searchClearBtn.style.display = 'none';
        filterAndRender();
        searchInput.focus();
    });

    // Category pills events
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const filterValue = pill.getAttribute('data-filter');
            setCategory(filterValue);
        });
    });

    // Stats cards click events (Toggles filter category)
    statCards.forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.getAttribute('data-category');
            if (cat === 'total') {
                setCategory('all');
            } else if (cat === 'announcement') {
                setCategory('Announcement');
            } else if (cat === 'feature') {
                setCategory('Feature');
            } else if (cat === 'fix') {
                setCategory('Fix');
            } else if (cat === 'deprecation') {
                setCategory('Deprecation');
            }
        });
        // Style stat card cursor as pointer
        card.style.cursor = 'pointer';
    });

    // Reset filters button click inside empty state
    resetFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        searchClearBtn.style.display = 'none';
        setCategory('all');
    });

    // Clear all filters button in active filter bar
    clearAllFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        searchClearBtn.style.display = 'none';
        setCategory('all');
    });

    // Share on Twitter (X) helper using Web Intents API
    function shareOnTwitter(title, htmlContent, url) {
        // Strip HTML tags
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const textContent = tempDiv.textContent || tempDiv.innerText || "";
        
        // Truncate to ensure the tweet content doesn't exceed Twitter limit
        let cleanText = textContent.trim().replace(/\s+/g, ' ');
        const maxTextLen = 130;
        if (cleanText.length > maxTextLen) {
            cleanText = cleanText.substring(0, maxTextLen) + '...';
        }

        const tweetText = `BigQuery Update (${title}): "${cleanText}"`;
        const hashtags = 'BigQuery,GoogleCloud';
        const shareUrl = url || 'https://cloud.google.com/bigquery';
        
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}&hashtags=${hashtags}`;
        
        window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    }
});
