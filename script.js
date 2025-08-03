document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle Logic
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Form Submission Logic
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            // Show a loading message
            formMessage.classList.remove('hidden', 'text-red-500', 'text-green-500');
            formMessage.classList.add('text-gray-500');
            formMessage.textContent = 'Sending message...';

            const formData = new FormData(contactForm);
            const jsonData = {};
            for (const [key, value] of formData.entries()) {
                jsonData[key] = value;
            }

            try {
                // Send the data to the backend endpoint
                const response = await fetch('/submit-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jsonData),
                });

                if (response.ok) {
                    const result = await response.json();
                    formMessage.classList.remove('text-gray-500');
                    formMessage.classList.add('text-green-500');
                    formMessage.textContent = result.message;
                    contactForm.reset(); // Clear the form
                } else {
                    const error = await response.json();
                    throw new Error(error.message || 'Something went wrong.');
                }
            } catch (error) {
                console.error('Submission Error:', error);
                formMessage.classList.remove('text-gray-500');
                formMessage.classList.add('text-red-500');
                formMessage.textContent = 'Failed to send message. Please try again later.';
            } finally {
                formMessage.classList.remove('hidden');
            }
        });
    }
});
