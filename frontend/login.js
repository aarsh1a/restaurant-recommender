document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('.login-form');
    const accountBtn = document.querySelector('.footer-item:nth-child(2)'); // The account button

    // Handle login form submission
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Create data object to send to server
        const userData = {
            email: email,
            password: password
        };

        // Send login request to server
        fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.error || 'Login failed');
                    });
                }
                return response.json();
            })
            .then(data => {
                // Store user info in localStorage
                localStorage.setItem('user_id', data.user.id);
                localStorage.setItem('user_name', data.user.name);

                alert('Login successful!');

                // Redirect to main page or dashboard
                window.location.href = 'index.html';
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message);
            });
    });

    // Handle account button click based on login status
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
});

