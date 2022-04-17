import Client,{Socket} from "socket.io-client";
import mongoose from "mongoose";
import server from "../app"
import User from '../models/user_model'
import request from 'supertest'



type UserInfo={
    email:string,
    password:string,
    accessToken:string,
    clientSocket:Socket
}

let user1:UserInfo ={
    email:"user1@socket.com",
    password:"1234567890",
    accessToken:" ",
    clientSocket:null
} 
let user2:UserInfo ={
    email:"user2@socket.com",
    password:"1234567890",
    accessToken:" ",
    clientSocket:null
} 

beforeAll(async () => {
    await User.remove({"email":user1.email})    
    await User.remove({"email":user2.email})    

});

afterAll(async () => {
    user1.clientSocket.close()
    user2.clientSocket.close()
    await User.remove({"email":user1.email})    
    await User.remove({"email":user2.email})  
    mongoose.connection.close();
    server.close()
});

describe("Socket IO server test", () => {
    const registerUser=async (userInfo:UserInfo)=>{

        const response = await request(server)
            .post('/auth/register')
            .send({"email":userInfo.email , 'password':userInfo.password})
        expect(response.statusCode).toEqual(200)
        userInfo.accessToken = response.body.accessToken

    }

    test("register user for access",async ()=>{
        await registerUser(user1)
        await registerUser(user2)
    })

    const openClientConnection = (userInfo:UserInfo,done)=>{

        userInfo.clientSocket = Client("http://localhost:" + process.env.PORT,{
            auth: {
                token: 'barrer ' + userInfo.accessToken
            } 
        })
        userInfo.clientSocket.on("connect", ()=>{
            done();
        });
    }
    test("open client 1 connection",(done)=>{
        openClientConnection(user1,done)
    })
    test("open client 2 connection",(done)=>{
        openClientConnection(user2,done)
    })

    
    test("test echo event", (done) => {
        user1.clientSocket.on("common:echo", (arg: any) => {
            expect(arg).toBe("echo message");
            done();
        });
        user1.clientSocket.emit("common:echo", "echo message")
    });

});

