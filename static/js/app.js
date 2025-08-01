
const backendBaseUrl = 'https://kudolite.onrender.com'; // Replace with your actual Render URL
const repoOwner = 'tstparis'; // Replace with your GitHub username
const repoName = 'KudoLite'; // Replace with your GitHub repo name


// Function to fetch and display messages
async function loadMessages() {
    try {
        //const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/issues`);
        const response = await fetch(`${backendBaseUrl}/get-messages`); //use backend call instead of direct call
        const issues = await response.json();

        const list = document.getElementById('message-list');
        list.innerHTML = ''; // Clear existing messages

        issues.forEach(issue => {
            const li = document.createElement('li');
            li.textContent = issue.body;
            list.appendChild(li);
        });

    document.getElementById('message-form').style.display = 'block';
        
    } catch (err) {
        console.error('Failed to load messages:', err);
    }
}

// Function to handle login and token retrieval
async function handleLogin(code) {
    try {
        const res = await fetch(`${backendBaseUrl}/callback?code=${code}`);
        const data = await res.json();
        const token = data.access_token;

        if (token) {
            localStorage.setItem('github_token', token);
            document.getElementById('message-form').style.display = 'block';
        }
    } catch (err) {
        console.error('Login failed:', err);
    }
}

// On page load
window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const token = localStorage.getItem('github_token');

    if (code) {
        await handleLogin(code);
        window.history.replaceState({}, document.title, window.location.pathname); // Clean URL
    } else if (token) {
        document.getElementById('message-form').style.display = 'block';
    }

    loadMessages();
    setInterval(loadMessages, 10000); // Poll every 10 seconds
};

// Login button
document.getElementById('login-btn').addEventListener('click', () => {
    window.location.href = `${backendBaseUrl}/login`;
});

// Submit message
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
            loadMessages(); // Refresh messages immediately
        } else {
            alert('Failed to post message');
        }
    } catch (err) {
        console.error('Error posting message:', err);
        alert('Error posting message');
    }
});

