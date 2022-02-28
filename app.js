const express = require('express')
const dotenv = require('dotenv').config()
const app = express()
const port = process.env.port

const post_route = require('./routes/post_routes')
app.use("/post",post_route)

app.listen(port ,()=>{
    console.log('Exaple app listening on port '+port)
})

