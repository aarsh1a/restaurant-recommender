document.addEventListener('DOMContentLoaded', function () {
    // Get form elements
    const form = document.getElementById('filter-form');
    const locationSelect = document.getElementById('location');
    const cuisineSelect = document.getElementById('cuisine');
    const priceSlider = document.getElementById('price');
    const priceValue = document.getElementById('price-value');
    const ratingStars = document.querySelectorAll('#rating .star');
    const accountBtn = document.querySelector('.footer-item:nth-child(2)');
    let selectedRating = 0;

    priceValue.textContent = priceSlider.value;

    // Update when slider moves
    priceSlider.addEventListener('input', function () {
        priceValue.textContent = this.value;
    });

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

    // Fetch locations from backend
    fetch('http://127.0.0.1:5000/locations')
        .then(response => response.json())
        .then(locations => {
            // Populate location dropdown
            locations.forEach(location => {
                const option = document.createElement('option');
                option.value = location;
                option.textContent = location;
                locationSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching locations:', error));

    // Fetch cuisines from backend
    fetch('http://127.0.0.1:5000/cuisines')
        .then(response => response.json())
        .then(cuisines => {
            // Populate cuisine dropdown
            cuisines.forEach(cuisine => {
                const option = document.createElement('option');
                option.value = cuisine;
                option.textContent = cuisine;
                cuisineSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching cuisines:', error));

    // Handle form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get rating from UI
        const stars = document.querySelectorAll('.star.filled');
        selectedRating = stars.length;

        // Build query parameters
        const params = new URLSearchParams();

        if (locationSelect.value) {
            params.append('location', locationSelect.value);
        }

        if (cuisineSelect.value) {
            params.append('cuisine', cuisineSelect.value);
        }

        // Make sure the price is passed as priceSlider.value
        params.append('price', priceSlider.value);

        if (selectedRating > 0) {
            params.append('rating', selectedRating);
        }

        // Redirect to restaurants page with query parameters
        window.location.href = `restaurants-results.html?${params.toString()}`;
    });
});
