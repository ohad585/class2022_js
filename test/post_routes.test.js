
const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
const Post = require('../models/post_model')

const message = "Message"
const sender = "Test"
var retID = ""

beforeAll(async () => {
    //clear Post collection
    await Post.remove()

})

afterAll(done => {
    mongoose.connection.close()
    done()
})


describe("This is Post API test",()=>{

    test("Test Post get API", async ()=>{
            const response = await request(app).get('/post')
            expect(response.statusCode).toEqual(200)
    })

    test("Test Post post API", async ()=>{
        const response = await request(app).post('/post').send({
            "message" :message,
            "sender" : sender
        })
        expect(response.statusCode).toEqual(200)

        const retMessage = response.body.message
        const retSender = response.body.sender
        retID = response.body._id
        expect(retMessage).toEqual(message)
        expect(retSender).toEqual(sender)
    })

    test("Test get Post by ID API", async ()=>{
        const response = await request(app).get('/post/'+retID)
        expect(response.statusCode).toEqual(200)
        const retMessage = response.body.message
        const retSender = response.body.sender
        const retID2 = response.body._id
        expect(retMessage).toEqual(message)
        expect(retSender).toEqual(sender)
        expect(retID2).toEqual(retID)
    })

    test("Test get Post by sender API", async ()=>{
        const response = await request(app).get('/post?sender='+sender)
        expect(response.statusCode).toEqual(200)
        const retSender = response.body.posts[0].sender
        expect(retSender).toEqual(sender)
    })


})