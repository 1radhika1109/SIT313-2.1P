document.addEventListener('DOMContentLoaded', () => {
    const subscribeForm = document.getElementById('subscribeForm');
    const messageDiv = document.getElementById('message');

    subscribeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const termsChecked = document.getElementById('terms').checked;

        // Basic validation
        if (!email || !termsChecked) {
            showMessage('Please fill all required fields and agree to terms.', 'error');
            return;
        }

        try {
            const response = await fetch('/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, name })
            });

            const result = await response.json();

            if (response.ok) {
                showMessage('Successfully subscribed! Check your email.', 'success');
                subscribeForm.reset(); // Clear form
            } else {
                showMessage(result.error || 'Subscription failed', 'error');
            }
        } catch (error) {
            showMessage('Network error. Please try again.', 'error');
            console.error('Subscription error:', error);
        }
    });

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        
        // Auto-clear message after 5 seconds
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 5000);
    }
});