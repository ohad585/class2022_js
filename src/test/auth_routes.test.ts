
import request from 'supertest'
import app from'../server'
import mongoose from 'mongoose'
import User from '../models/user_model'
import jest from 'jest'

const email = 'test@a.com'
const pass = '1234567890'

const wrong_email = 'nottest@a.com'
const wrong_pass = '1234443424'
let accessToken = ""
let refreshToken = ''

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
            accessToken = response.body.accessToken
            refreshToken = response.body.refreshToken

            expect(accessToken).not.toBeNull()
            expect(refreshToken).not.toBeNull()

            const response2 = await request(app)
            .get('/auth/test')
            .set({ authorization: "barer " + accessToken })
            .send({"email":email , 'password':pass})

            expect(response2.statusCode).toEqual(200)

    })
    test("Test login API", async ()=>{
        const response = await request(app)
        .post('/auth/login')
        .send({"email":email , 'password':pass})
        expect(response.statusCode).toEqual(200)

        accessToken = response.body.accessToken
        refreshToken = response.body.refreshToken

        expect(accessToken).not.toBeNull()
        expect(refreshToken).not.toBeNull()

        
        const response2 = await request(app)
        .get('/auth/test')
        .set({ authorization: "barer " + accessToken })
        .send({"email":email , 'password':pass})

        expect(response2.statusCode).toEqual(200)
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

    const sleep = (ms)=> new Promise((r)=> setTimeout(r,ms))

    test("Test refresh token", async ()=>{
        //wait untill access token is expiered
        await sleep(3000)
        let response = await request(app)
        .get('/auth/test')
        .set({ authorization: "barer " + accessToken })
        expect(response.statusCode).not.toEqual(200)

        response = await request(app)
        .get('/auth/refresh')
        .set({ authorization: "barer " + refreshToken })
        expect(response.statusCode).toEqual(200)

        accessToken = response.body.accessToken
        refreshToken = response.body.refreshToken

        expect(accessToken).not.toBeNull()
        expect(refreshToken).not.toBeNull()


        response = await request(app)
        .get('/auth/test')
        .set({ authorization: "barer " + accessToken })
        expect(response.statusCode).toEqual(200)

    })
})