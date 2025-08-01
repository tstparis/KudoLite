
const backendBaseUrl = 'https://your-render-app.onrender.com'; // Replace with your actual backend URL
const repoOwner = 'YOUR_GITHUB_USERNAME'; // Replace with your GitHub username
const repoName = 'YOUR_REPO_NAME'; // Replace with your repo name

document.getElementById('login-btn').addEventListener('click', () => {
    window.location.href = `${backendBaseUrl}/login`;
});

async function fetchMessages() {
    try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/issues`);
        const issues = await response.json();

        const list = document.getElementById('message-list');
        list.innerHTML = ''; // Clear existing messages

        issues.forEach(issue => {
            const li = document.createElement('li');
            li.textContent = issue.body;
            list.appendChild(li);
        });
    } catch (err) {
        console.error('Failed to load messages:', err);
    }
}

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        try {
            const res = await fetch(`${backendBaseUrl}/callback?code=${code}`);
            const data = await res.json();
            const token = data.access_token;

            localStorage.setItem('github_token', token);
            document.getElementById('message-form').style.display = 'block';
        } catch (err) {
            alert('Login failed');
        }
    }

    await fetchMessages(); // Initial load

    // Periodically refresh messages every 10 seconds
    setInterval(fetchMessages, 10000);
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
            await fetchMessages(); // Refresh messages after posting
        } else {
            alert('Failed to post message');
        }
    } catch (err) {
        alert('Error posting message');
    }
});
