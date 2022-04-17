import Client,{Socket} from "socket.io-client";
import mongoose from "mongoose";
import server from "../app"
import User from '../models/user_model'
import request from 'supertest'


let clientSocket:Socket
const email = 'test@socket.com'
const pass = '1234567890'

let accessToken = ""

beforeAll(async () => {
    console.log("BEFOREALLLLLLL")
    await User.remove({"email":email})    
});

afterAll(async () => {
    clientSocket.close()
    server.close()
    await User.remove({"email":email})
    mongoose.connection.close();
});

describe("Socket IO server test", () => {

    test("register user for access",async ()=>{
        const response = await request(server)
            .post('/auth/register')
            .send({"email":email , 'password':pass})
        expect(response.statusCode).toEqual(200)
        accessToken = response.body.accessToken

    })

    test("open client connection",(done)=>{
        clientSocket = Client("http://localhost:" + process.env.PORT,{
            auth: {
                token: 'barrer ' + accessToken
            } 
        })
        clientSocket.on("connect", async()=>{
            done();
        });
    })

    test("test echo event", (done) => {
        clientSocket.on("common:echo", (arg: any) => {
            expect(arg).toBe("echo message");
            done();
        });
        clientSocket.emit("common:echo", "echo message")
    });
    
});

