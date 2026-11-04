import express from 'express'
import db from '../db.js'

const router = express.Router()

//Get all todos
router.get('/',(req,res)=>{
    //prepare the sql query
    const getTodos = db.prepare('SELECT * FROM todos WHERE user_id= ?')
    // req.userId fills the ? in sql query, .all takes everything that the query return
    const todos = getTodos.all(req.userId)

    res.json(todos)
})

//POST /todos : create a todo
router.post('/', (req,res) =>{
    //takes the value of the task property out of the req.body object and stores it in a new variable called task, ignoring all the other properties.
    const { task } = req.body
    if(!task){
        return res.status(400).json({message : 'Task is required'})
    }

    const insertTodo = db.prepare('INSERT INTO todos (user_id, task) VALUES (?,?)')
    //.run is used for insert/delete/update where it takes two parameters {rowid, changes}
    const result = insertTodo.run(req.userId,task)

    res.status(201).json({
        id:Number(result.lastInsertRowid),
        task:task,
        completed: 0
    })

})

//put , is for updating a todo
router.put ('/:id', (req,res) =>{
    const{ id } = req.params
    const { task, completed } = req.body

    //1. find the todo , and make sure it belongs to it
    const getTodo = db.prepare('SELECT * FROM todos WHERE id = ? AND user_id =?')
    const todo = getTodo.get(id, req.userId)

    if(!todo){
        return res.status(404).json({message : 'Todo nt found'})
    }

    //2. keep old values for anything not sent
    const newTask = task ?? todo.task
    const newCompleted = completed ?? todo.completed

    //3. save the changes
    const updateTodo = db.prepare('UPDATE todos SET task = ?, completed = ? WHERE id =?')
    updateTodo.run(newTask,newCompleted, id)

    res.json({message :'Todo updated'})

})

//DElete todos
router.delete('/:id', (req,res)=>{
    const { id } = req.params
    const deleteTodo = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?')
    const result = deleteTodo.run(id, req.userId)

    if(result.changes === 0){
        return res.status(404).json({message: 'Todo not found'})
    }

    res.sendStatus(204)

})


export default router