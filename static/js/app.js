const clientId = 'YOUR_GITHUB_CLIENT_ID';
const repoOwner = 'YOUR_GITHUB_USERNAME';
const repoName = 'YOUR_REPO_NAME';

document.getElementById('login-btn').addEventListener('click', () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=public_repo`;
});

document.getElementById('submit-btn').addEventListener('click', async () => {
    const message = document.getElementById('message-input').value;
    if (!message) return;

    // Placeholder: You need a backend to handle GitHub OAuth and issue creation
    alert('Message submitted (simulated): ' + message);
    document.getElementById('message-input').value = '';
});

window.onload = async () => {
    // Placeholder: Fetch messages from GitHub Issues
    const messages = [
        { user: 'alice', body: 'Great job!' },
        { user: 'bob', body: 'Keep it up!' }
    ];
    const list = document.getElementById('message-list');
    messages.forEach(msg => {
        const li = document.createElement('li');
        li.textContent = `${msg.user}: ${msg.body}`;
        list.appendChild(li);
    });

    // Simulate login
    document.getElementById('message-form').style.display = 'block';
};
