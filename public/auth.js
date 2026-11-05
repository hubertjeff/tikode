// LOGIN PAGE (index.html)

// already logged in? skip this page
if (localStorage.getItem('token')) {
    window.location.href = '/todos.html'
}

const message = document.getElementById('message')
const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')
const loginBtn = document.getElementById('loginBtn')
const registerBtn = document.getElementById('registerBtn')

// register and login work the same way, only the URL is different
async function authenticate(path) {
    const username = usernameInput.value
    const password = passwordInput.value

    const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })

    const data = await res.json()

    // 400 / 401 / 404 -> show the server's message and stay here
    if (!res.ok) {
        message.textContent = data.message
        return
    }

    // success -> save the token and go to the todos page
    localStorage.setItem('token', data.token)
    window.location.href = '/todos.html'
}

loginBtn.addEventListener('click', () => authenticate('/auth/login'))
registerBtn.addEventListener('click', () => authenticate('/auth/register'))
