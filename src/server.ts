import express from "express"
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import body_parser from 'body-parser'

dotenv.config()
const app = express()

mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection
db.on('error',(error)=>{
    console.error(error)
})
db.once('open',()=>{
    console.log('connected to mongo')
})


app.use(body_parser.urlencoded({extended:true ,limit:'1mb'}))
app.use(body_parser.json())

import post_route from './routes/post_routes'
app.use("/post",post_route)

import auth_route from './routes/auth_routes'
app.use("/auth",auth_route)

export = app