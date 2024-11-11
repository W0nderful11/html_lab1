// script.js

// Global variables
let articles = [];
let currentTheme = 'light';

/**
 * Load articles from JSON file and initialize the dashboard
 */
fetch('articles.json')
    .then(response => response.json())
    .then(data => {
        articles = data.articles;
        displayArticles(articles);
        displayMostPopularArticle();
    });

/**
 * Display articles in the main content area
 * @param {Array} articlesArray - Array of article objects
 */
function displayArticles(articlesArray) {
    const container = document.getElementById('articles-container');
    container.innerHTML = ''; // Clear previous content

    articlesArray.forEach(article => {
        // Create article card
        const card = document.createElement('div');
        card.className = 'card mb-3';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        // Article title
        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = article.title;

        // Article metadata
        const info = document.createElement('p');
        info.className = 'card-text';
        info.innerHTML = `<small class="text-muted">${article.date} | ${article.category} | ${article.views} views</small>`;

        // Estimated reading time
        const readingTime = document.createElement('p');
        readingTime.className = 'card-text';
        const estimatedTime = Math.ceil(article.wordCount / 200);
        readingTime.innerHTML = `<small class="text-muted">Estimated reading time: ${estimatedTime} min</small>`;

        // Read more button
        const readMoreBtn = document.createElement('button');
        readMoreBtn.className = 'btn btn-primary';
        readMoreBtn.textContent = 'Read More';
        readMoreBtn.addEventListener('click', () => {
            openArticleModal(article.id);
        });

        // Assemble card elements
        cardBody.appendChild(title);
        cardBody.appendChild(info);
        cardBody.appendChild(readingTime);
        cardBody.appendChild(readMoreBtn);
        card.appendChild(cardBody);
        container.appendChild(card);
    });
}

/**
 * Open article in a modal window
 * @param {number} articleId - ID of the article to display
 */
function openArticleModal(articleId) {
    const article = articles.find(a => a.id === articleId);
    if (article) {
        // Update modal content
        document.getElementById('articleModalLabel').textContent = article.title;
        document.getElementById('articleModalContent').innerHTML = `<p>${article.content}</p>`;
        const estimatedTime = Math.ceil(article.wordCount / 200);
        document.getElementById('articleModalReadingTime').textContent = `Estimated reading time: ${estimatedTime} min`;

        // Increment views
        article.views += 1;

        // Update most popular article
        displayMostPopularArticle();

        // Re-display articles to update view counts
        displayArticles(articles);

        // Show modal
        $('#articleModal').modal('show');
    }
}

/**
 * Display the most popular article in the sidebar
 */
function displayMostPopularArticle() {
    const mostPopular = articles.reduce(
        (max, article) => article.views > max.views ? article : max,
        articles[0]
    );
    const container = document.getElementById('most-popular-article');
    container.innerHTML = `
        <h5>${mostPopular.title}</h5>
        <p><small class="text-muted">${mostPopular.date} | ${mostPopular.category} | ${mostPopular.views} views</small></p>
        <button class="btn btn-primary" onclick="openArticleModal(${mostPopular.id})">Read More</button>
    `;
}

/**
 * Handle sorting of articles based on user selection
 */
document.getElementById('sortOptions').addEventListener('change', function() {const sortBy = this.value;
    if (sortBy === 'date') {
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'views') {
        articles.sort((a, b) => b.views - a.views);
    }
    displayArticles(articles);
});

/**
 * Toggle between light and dark themes
 */
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

function toggleTheme() {
    if (currentTheme === 'light') {
        currentTheme = 'dark';
    } else {
        currentTheme = 'light';
    }
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
}

/**
 * Load theme from localStorage on page load
 */
window.onload = function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', currentTheme);
    }
};
