const backendBaseUrl = 'https://KudoLite.onrender.com'; // Replace with your actual Render URL

document.getElementById('login-btn').addEventListener('click', () => {
    window.location.href = `${backendBaseUrl}/login`;
});

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        try {
            const res = await fetch(`${backendBaseUrl}/callback?code=${code}`);
            const data = await res.json();
            const token = data.access_token;

            localStorage.setItem('github_token', token);
            console.log('GitHub Token:', token);
            document.getElementById('message-form').style.display = 'block';
        } catch (err) {
            alert('Login failed');
        }
    }

    // Load messages from GitHub Issues (optional enhancement)
};

document.getElementById('submit-btn').addEventListener('click', async () => {
    const message = document.getElementById('message-input').value;
    const token = localStorage.getItem('github_token');

    if (!message || !token) return;

    try {
        const res = await fetch(`${backendBaseUrl}/post-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, message })
        });

        const data = await res.json();
        if (data.success) {
            alert('Message posted!');
            document.getElementById('message-input').value = '';
        } else {
            alert('Failed to post message');
        }
    } catch (err) {
        alert('Error posting message');
    }
});
