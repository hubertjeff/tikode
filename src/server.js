import express from 'express'
import path from 'path'
import db from './db.js'
import authRoutes from './routes/authRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'
import todoRoutes from './routes/todoRoutes.js'

// create the app
const app = express()
const PORT = process.env.PORT || 3008

// save the folder name that has this file into __dirname variable
const __dirname = import.meta.dirname


//Middleware
    //express.json() reads the JSON text that arrives in a request and turns it back into a JavaScript object on req.body.
app.use(express.json())
    //send the file if req is inside public dir
app.use(express.static(path.join(__dirname,'../public')))


//Routes
app.use('/auth', authRoutes)
app.use('/todos', authMiddleware,todoRoutes)

//only for testing

app.get('/api/me', authMiddleware, (req,res)=>{
    res.json({message : 'you are logged in', userId : req.userId})
})

app.get('/api/health', (req, res) => {
    const users = db.prepare('SELECT COUNT(*) AS count FROM users').get()
    const todos = db.prepare('SELECT COUNT(*) AS count FROM todos').get()
    res.json({ status: 'ok', users: users.count, todos: todos.count })
})


// start the server
app.listen(PORT,() =>{
    console.log(`tikode is running on port :  ${PORT}`)
})

