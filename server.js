const express = require('express')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const app = express()

mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser : true})
const db = mongoose.connection
db.on('error',(error)=>{
    console.error(error)
})
db.once('open',()=>{
    console.log('connected to mongo')
})

const body_parser = require('body-parser')

app.use(body_parser.urlencoded({extended:true ,limit:'1mb'}))
app.use(body_parser.json())

const post_route = require('./routes/post_routes')
app.use("/post",post_route)

module.exports = app