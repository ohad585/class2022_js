
import request from 'supertest'
import app from'../server'
import mongoose from 'mongoose'
import Post from '../models/post_model'
import User from '../models/user_model'
import user_model from '../models/user_model'

const message = "Message"
let sender = "Test"
const email = 'test@gmail.com'
const pass = '1234567890'
var retID = ""

let accessToken = ''

beforeAll(async () => {
    //clear Post collection
    await Post.remove({'sender':sender})
    await User.remove({'email':email})

})

afterAll(async () => {
    await Post.remove({'sender':sender})
    await User.remove({'email':email})
    mongoose.connection.close()
    
})


describe("This is Post API test",()=>{

    test("Test register to get access token", async () => {
        const response = await request(app)
          .post("/auth/register")
          .send({ 'email': email, 'password': pass });
        expect(response.statusCode).toEqual(200);
        accessToken = response.body.accessToken;
        expect(accessToken).not.toBeNull();
        sender = response.body._id;
      });
    

    test("Test Post get API", async ()=>{
            const response = await request(app).get('/post')
            expect(response.statusCode).toEqual(200)
    })

    test("Test Post post API", async ()=>{
        console.log('ACCESS TOKEN= S'+accessToken)
        const response = await request(app).post('/post')
        .set({ authorization: "barer " + accessToken })
        .send({
            "message" :message,
            "sender" : sender
        })
        expect(response.statusCode).toEqual(200)

        const retMessage = response.body.message
        const retSender = response.body.sender
        retID = response.body._id
        expect(retMessage).toEqual(message)
        expect(retSender).toEqual(sender)
        expect(retID).not.toEqual(null)
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