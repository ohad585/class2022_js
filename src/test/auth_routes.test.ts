
import request from 'supertest'
import app from'../server'
import mongoose from 'mongoose'
import User from '../models/user_model'
const email = 'test@a.com'
const pass = '1234567890'

const wrong_email = 'test2@a.com'
const wrong_pass = '1234443424'
let access_token = ""

beforeAll(async () => {
    await User.deleteOne({"email":email})
})

afterAll(async () => {
    await User.deleteOne({"email":email})
    mongoose.connection.close()
})


describe("This is Auth API test",()=>{

    test("Test register API", async ()=>{
            const response = await request(app)
            .post('/auth/register')
            .send({"email":email , 'password':pass})
            expect(response.statusCode).toEqual(200)
            access_token = response.body.access_token
            expect(access_token).not.toBeNull()

    })
    test("Test login API", async ()=>{
        const response = await request(app)
        .post('/auth/login')
        .send({"email":email , 'password':pass})
        expect(response.statusCode).toEqual(200)
    })
    test("Test register taken email API", async ()=>{
        const response = await request(app)
        .post('/auth/register')
        .send({"email":email , 'password':pass})
        expect(response.statusCode).not.toEqual(200)
    })
    test("Test login wrong email API", async ()=>{
        const response = await request(app)
        .post('/auth/login')
        .send({"email":wrong_email , 'password':pass})
        expect(response.statusCode).not.toEqual(200)
    })  
    test("Test login wrong password API", async ()=>{
        const response = await request(app)
        .post('/auth/register')
        .send({"email":email , 'password':wrong_pass})
        expect(response.statusCode).not.toEqual(200)
    })
})