import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

//REGISTER : POST /AUTH /REGISTER
router.post('/register', (req,res)=>{
    const {username,password} = req.body

    //check if both username and password are filled
    if(!username || !password) {
        return res.status(400).json({message : 'Username and Password are required'})
    }

    //hash the password
    const hashedPassword = bcrypt.hashSync(password, 10)

    //for robust web app we use try and catch
    try{
        //save the user
        const insertUser = db.prepare ('INSERT INTO users (username, password) VALUES(?,?)')
        const result = insertUser.run(username,hashedPassword)

        //get the new row id from the result
        const userId = result.lastInsertRowid
        console.log('new user id', userId)

        // add the first todos for user
        const defaultTodo ='hello! add your first todo'
        const insertTodo = db.prepare ('INSERT INTO todos (user_id, task) VALUES(?,?)')
        insertTodo.run(userId, defaultTodo)// instead of result.lastInsertRowid we can set userId

        //create the jwt token
        const token = jwt.sign({id:Number(userId)}, process.env.JWT_SECRET,{expiresIn:'24h'})
        res.status(201).json({token})

    }catch(err){
        res.status(400).json({message: 'Username already taken'})
    }
   
})

//login : post/auth/login
router.post('/login',(req,res)=>{
    const { username, password } = req.body

    if(!username || !password) {
        return res.status(400).json({message: "please fill the username and password"})
    }

    //find the user in database
    const user = db
        .prepare('SELECT * FROM users WHERE username = ?')
        .get(username)
    if(!user){
        return res.status(404).json({message : "User not found"})
    }

    //compare the password
    const isValid = bcrypt.compareSync(password, user.password)
    if(!isValid){
        return res.status(401).json({message : 'Wrong password'})
    }

    const token = jwt.sign ({id :user.id}, process.env.JWT_SECRET, {expiresIn:'24h'})

    //send it back
    res.json({token})

})


export default router