document.addEventListener('DOMContentLoaded', function () {
    const restaurantList = document.getElementById('restaurant-list');
    const userId = 1; // Replace with actual user ID if you have authentication
    const accountBtn = document.querySelector('.footer-item:nth-child(2)');
    if (accountBtn) {
        accountBtn.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default navigation

            // Check if user is logged in
            if (isUserLoggedIn()) {
                // If logged in, go to loggedin.html
                window.location.href = 'loggedin.html';
            } else {
                // If not logged in, go to login.html
                window.location.href = 'login.html';
            }
        });
    }
    // Function to check if user is logged in
    function isUserLoggedIn() {
        return localStorage.getItem('user_id') !== null;
    }
    // Helper to create star SVGs
    function createStar(filled) {
        return `<div class="star${filled ? ' filled' : ''}">
            <svg viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        </div>`;
    }

    // Helper to create a restaurant card
    function createRestaurantCard(restaurant) {
        // Price: show rupee symbol and value
        const price = `Rs ${restaurant.price_range}`;
        // Rating: show filled stars up to rating, rest unfilled
        const rating = Math.round(restaurant.rating);
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            starsHtml += createStar(i <= rating);
        }
        // Card HTML
        return `
            <div class="restaurant-card">
                <button class="favorite-btn" data-id="${restaurant.id}" title="Add to Favorites">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </button>
                <div class="restaurant-info">
                    <h3 class="restaurant-name">${restaurant.name}</h3>
                    <div class="restaurant-details">
                        <span class="restaurant-location">${restaurant.location}</span>
                        <span class="restaurant-cuisine">${restaurant.cuisine}</span>
                    </div>
                </div>
                <div class="restaurant-price">${price}</div>
                <div class="restaurant-rating">${starsHtml}</div>
            </div>
        `;
    }

    // Fetch restaurants from backend using current URL's query params
    function fetchRestaurants() {
        const params = window.location.search;
        fetch(`http://127.0.0.1:5000/restaurants${params}`)
            .then(response => response.json())
            .then(data => {
                restaurantList.innerHTML = '';
                if (data.length === 0) {
                    restaurantList.innerHTML = '<div style="text-align:center;">No restaurants found.</div>';
                    return;
                }
                data.forEach(restaurant => {
                    restaurantList.innerHTML += createRestaurantCard(restaurant);
                });
                // Attach favorite button listeners
                document.querySelectorAll('.favorite-btn').forEach(btn => {
                    btn.addEventListener('click', function () {
                        toggleFavorite(this, this.getAttribute('data-id'));
                    });
                });
            })
            .catch(error => {
                restaurantList.innerHTML = '<div style="color:red;text-align:center;">Error loading restaurants.</div>';
                console.error('Error fetching restaurants:', error);
            });
    }

    // Toggle favorite and call backend
    function toggleFavorite(button, restaurantId) {
        button.classList.toggle('active');
        fetch('http://127.0.0.1:5000/add_favorite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, restaurant_id: restaurantId })
        })
            .then(response => response.json())
            .then(data => {
                // Optionally show a message or update UI
                if (data.error) {
                    alert(data.error);
                    button.classList.remove('active');
                }
            })
            .catch(error => {
                console.error('Error adding favorite:', error);
                button.classList.remove('active');
            });
    }

    // Initial fetch
    fetchRestaurants();
});
