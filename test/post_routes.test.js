
const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')


beforeAll(done => {
    done()
})

afterAll(done => {
    mongoose.connection.close()
    done()
})

describe("This is my first test",()=>{
    test("This is my first test case", async ()=>{
            const temp = 2
            expect(temp).toEqual(2)
    })
})

describe("This is Post API test",()=>{
    test("Test Post get API", async ()=>{
            const response = await request(app).get('/post')
            expect(response.statusCode).toEqual(200)
    })
})