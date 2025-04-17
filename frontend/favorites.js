document.addEventListener('DOMContentLoaded', function () {
    // Container where favorite restaurant cards will be displayed
    const favoritesContainer = document.getElementById('favorites-list');
    const userId = 1; // Replace with actual user ID when you implement authentication

    // Function to create star rating HTML
    function createStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let starsHTML = '';

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                starsHTML += `
                    <div class="star filled" style="--i: ${i}">
                        <svg viewBox="0 0 24 24">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </div>`;
            } else if (i === fullStars + 1 && hasHalfStar) {
                starsHTML += `
                    <div class="star half-filled" style="--i: ${i}">
                        <svg viewBox="0 0 24 24">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </div>`;
            } else {
                starsHTML += `
                    <div class="star" style="--i: ${i}">
                        <svg viewBox="0 0 24 24">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </div>`;
            }
        }

        return starsHTML;
    }

    // Function to create a restaurant card HTML
    function createRestaurantCard(restaurant) {
        return `
            <div class="restaurant-card" data-id="${restaurant.id}">
                <button class="favorite-btn active" onclick="removeFavorite(this, ${restaurant.id})">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </button>
                <div class="restaurant-info">
                    <h3 class="restaurant-name">${restaurant.name}</h3>
                    <div class="restaurant-details">
                        <span class="restaurant-location">${restaurant.location}</span>
                        <span class="restaurant-cuisine">${restaurant.cuisine}</span>
                    </div>
                </div>
                <div class="restaurant-price">Rs ${restaurant.price_range}</div>
                <div class="restaurant-rating">
                    ${createStarRating(restaurant.rating)}
                </div>
            </div>
        `;
    }

    // Function to remove a restaurant from favorites
    window.removeFavorite = function (button, restaurantId) {
        // Visual feedback first (optimistic UI update)
        const card = button.closest('.restaurant-card');
        card.classList.add('removing');

        // Call API to remove from favorites
        fetch(`http://127.0.0.1:5000/remove_favorite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                restaurant_id: restaurantId
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to remove favorite');
                }
                return response.json();
            })
            .then(data => {
                // Remove the card with animation
                setTimeout(() => {
                    card.remove();

                    // Check if there are no favorites left
                    if (favoritesContainer.children.length === 0) {
                        favoritesContainer.innerHTML = '<p class="no-favorites">You have no favorite restaurants yet.</p>';
                    }
                }, 300); // Match this with your CSS transition time
            })
            .catch(error => {
                console.error('Error:', error);
                // Revert the visual change if there was an error
                card.classList.remove('removing');
                alert('Could not remove from favorites. Please try again.');
            });
    };

    // Function to fetch and display favorites
    function fetchFavorites() {
        // Show loading state
        favoritesContainer.innerHTML = '<p class="loading">Loading your favorites...</p>';

        // Fetch favorites from the API
        fetch(`http://127.0.0.1:5000/favorites?user_id=${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch favorites');
                }
                return response.json();
            })
            .then(favorites => {
                // Clear loading message
                favoritesContainer.innerHTML = '';

                if (favorites.length === 0) {
                    favoritesContainer.innerHTML = '<p class="no-favorites">You have no favorite restaurants yet.</p>';
                    return;
                }

                // Create and append restaurant cards
                favorites.forEach(restaurant => {
                    favoritesContainer.innerHTML += createRestaurantCard(restaurant);
                });

                // Add hover animations to cards
                const cards = document.querySelectorAll('.restaurant-card');
                cards.forEach(card => {
                    card.addEventListener('mouseenter', function () {
                        this.classList.add('hover');
                    });
                    card.addEventListener('mouseleave', function () {
                        this.classList.remove('hover');
                    });
                });
            })
            .catch(error => {
                console.error('Error:', error);
                favoritesContainer.innerHTML = '<p class="error">Could not load your favorites. Please try again later.</p>';
            });
    }

    // Initialize the page
    fetchFavorites();

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .restaurant-card {
            transition: transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease;
        }
        .restaurant-card.hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .restaurant-card.removing {
            opacity: 0;
            transform: translateX(50px);
        }
        .loading, .no-favorites, .error {
            text-align: center;
            padding: 20px;
            font-size: 18px;
        }
        .error {
            color: #e74c3c;
        }
    `;
    document.head.appendChild(style);
});
