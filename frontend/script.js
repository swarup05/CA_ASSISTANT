document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll('nav ul li a');
    for (const link of links) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 50, // Adjust for fixed header
                    behavior: 'smooth'
                });
            } else {
                window.location.href = this.getAttribute('href');
            }
        });
    }

    // Check login status and update nav bar
    const isLoggedIn = false; // Replace with actual login status check
    if (isLoggedIn) {
        const nav = document.querySelector('nav ul');
        const loginLink = nav.querySelector('li a[href="login.html"]');
        const signupLink = nav.querySelector('li a[href="signup.html"]');
        if (loginLink) loginLink.parentElement.remove();
        if (signupLink) signupLink.parentElement.remove();
        const newChatbotLink = document.createElement('li');
        newChatbotLink.innerHTML = '<a href="chatbot.html">Chatbot</a>';
        nav.appendChild(newChatbotLink);
    }
});
