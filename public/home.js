// =============================================
// HOMEPAGE (index.html)
// if the user is already logged in, the buttons go to their todos
// =============================================

const token = localStorage.getItem('token')

if (token) {
    const navBtn = document.getElementById('navBtn')
    const heroBtn = document.getElementById('heroBtn')

    navBtn.textContent = 'My todos'
    navBtn.href = '/todos.html'

    heroBtn.textContent = 'Go to my todos'
    heroBtn.href = '/todos.html'
}
