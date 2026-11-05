// =============================================
// TODOS PAGE (todos.html)
// only for logged-in users
// =============================================

const token = localStorage.getItem('token')

// not logged in? go to the login page
if (!token) {
    window.location.href = '/login.html'
}

const todoForm = document.getElementById('todoForm')
const todoInput = document.getElementById('todoInput')
const todoList = document.getElementById('todoList')
const logoutBtn = document.getElementById('logoutBtn')


// ---------- LOG OUT ----------
function logout() {
    localStorage.removeItem('token')
    window.location.href = '/'   // back to the homepage
}

logoutBtn.addEventListener('click', logout)


// ---------- GET ALL TODOS: GET /todos ----------
async function fetchTodos() {
    const res = await fetch('/todos', {
        headers: { 'Authorization': token }
    })

    // token invalid or expired -> back to login
    if (res.status === 401) {
        logout()
        return
    }

    const todos = await res.json()
    renderTodos(todos)
}


// ---------- DRAW THE TODOS ON THE PAGE ----------
function renderTodos(todos) {
    todoList.innerHTML = ''

    todos.forEach(todo => {
        const li = document.createElement('li')

        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.checked = todo.completed === 1
        checkbox.addEventListener('change', () => {
            updateTodo(todo.id, checkbox.checked ? 1 : 0)
        })

        const text = document.createElement('span')
        text.textContent = todo.task
        if (todo.completed === 1) {
            text.classList.add('done')
        }

        const deleteBtn = document.createElement('button')
        deleteBtn.textContent = 'Delete'
        deleteBtn.classList.add('danger')
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id))

        li.append(checkbox, text, deleteBtn)
        todoList.appendChild(li)
    })
}


// ---------- ADD A TODO: POST /todos ----------
todoForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const task = todoInput.value.trim()
    if (!task) {
        return
    }

    await fetch('/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ task })
    })

    todoInput.value = ''
    fetchTodos()
})


// ---------- UPDATE A TODO: PUT /todos/:id ----------
async function updateTodo(id, completed) {
    await fetch(`/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ completed })
    })

    fetchTodos()
}


// ---------- DELETE A TODO: DELETE /todos/:id ----------
async function deleteTodo(id) {
    await fetch(`/todos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': token }
    })

    fetchTodos()
}


// ---------- WHEN THE PAGE OPENS ----------
if (token) {
    fetchTodos()
}
