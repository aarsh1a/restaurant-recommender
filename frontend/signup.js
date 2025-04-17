
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('.login-form');
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
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting normally

        // Get the form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Create an object with the form data
        const userData = {
            name: name,
            email: email,
            password: password
        };

        // Send the data to your Flask server
        fetch('http://127.0.0.1:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.error || 'Registration failed');
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                alert('Registration successful!');
                // Redirect to home page or dashboard
                window.location.href = 'login.html';
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message);
            });
    });
});

