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

import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"


if (process.env.NODE_ENV == "development") {

    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Library API",
                version: "1.0.0",
                description: "A simple Express Library API",
            },
            servers: [{url: "http://localhost:3000",},],
        },
        apis: ["./src/routes/*.ts"],
    };
    const specs = swaggerJsDoc(options);
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
    }


export = app