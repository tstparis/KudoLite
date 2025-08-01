
const backendBaseUrl = 'https://KudoLite.onrender.com'; // Replace with your actual Render URL
const repoOwner = 'tstparis'; // Replace with your GitHub username
const repoName = 'KudoLite'; // Replace with your GitHub repo name

function fetchMessages() {
    fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/issues`)
        .then(response => response.json())
        .then(issues => {
            const list = document.getElementById('message-list');
            list.innerHTML = '';
            issues.forEach(issue => {
                const li = document.createElement('li');
                li.textContent = issue.body;
                list.appendChild(li);
            });
        })
        .catch(err => console.error('Failed to load messages:', err));
}

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
            document.getElementById('message-form').style.display = 'block';
        } catch (err) {
            alert('Login failed');
        }
    }

    const token = localStorage.getItem('github_token');
    if (token) {
        document.getElementById('message-form').style.display = 'block';
    }

    fetchMessages();
    setInterval(fetchMessages, 10000); // Poll every 10 seconds
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
            document.getElementById('message-input').value = '';
            fetchMessages(); // Refresh messages immediately
        } else {
            alert('Failed to post message');
        }
    } catch (err) {
        alert('Error posting message');
    }
});
