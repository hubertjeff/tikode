# ✓ Tikode
A simple full-stack todo list app. Create an account, log in, and manage your own private todo list.

Built from scratch with **Node.js**, **Express**, **SQLite** and **JWT authentication**, with a plain HTML/CSS/JavaScript frontend.

> ⚠️ **This is a learning project.** Please don't use a real password you use anywhere else. Data may be reset at any time.

---

## Features

- **Register and log in** with a username and password
- **Passwords are hashed** with bcrypt, never stored in plain text
- **JWT tokens** keep you logged in for 24 hours
- **Add, complete and delete** todos
- **Private lists**: every user can only see and change their own todos
- **Three pages**: homepage, login page and todo list

## Tech stack

| Part             | Technology                              |
| ---------------- | --------------------------------------- |
| Runtime          | Node.js                                 |
| Server           | Express 5                               |
| Database         | SQLite (built into Node, `node:sqlite`) |
| Password hashing | bcryptjs                                |
| Authentication   | jsonwebtoken (JWT)                      |
| Frontend         | HTML, CSS, vanilla JS (`fetch`)         |

## Project structure

```
tikode/
├── package.json
├── .env                      # PORT and JWT_SECRET (not committed)
├── tikode.rest               # test requests for the VS Code REST Client
├── public/                   # FRONTEND (runs in the browser)
│   ├── index.html            # homepage
│   ├── home.css / home.js
│   ├── login.html            # login + register page
│   ├── auth.js
│   ├── todos.html            # todo list page
│   ├── todos.js
│   └── styles.css            # styles for login + todo pages
└── src/                      # BACKEND (runs in Node)
    ├── server.js             # creates the app, middleware, routes
    ├── db.js                 # SQLite database + tables
    ├── middleware/
    │   └── authMiddleware.js # checks the JWT on protected routes
    └── routes/
        ├── authRoutes.js     # register + login
        └── todoRoutes.js     # todo CRUD
```

## Getting started

### Requirements

- [Node.js](https://nodejs.org) **22 or newer** (needed for built-in SQLite and `--env-file`)

### 1. Clone and install

```bash
git clone https://github.com/hubertjeff/tikode.git
cd tikode
npm install
```

### 2. Create a `.env` file

In the main folder, create a file called `.env`:

```
PORT=choose your own PORT
JWT_SECRET=replace_with_a_long_random_secret
```

Generate a strong secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Start the server

```bash
npm run dev
```

Open **http://localhost:PORT** in your browser.

`npm run dev` restarts the server automaticaslly whenever you save a file.

> **Note:** the database currently runs in memory (`:memory:`), so all users and todos are deleted whenever the server restarts.