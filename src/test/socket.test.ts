import Client,{Socket} from "socket.io-client";
import {closeSocketServer} from "../socket_server"
import mongoose from "mongoose";
import server from "../app"
import User from '../models/user_model'
import request from 'supertest'



type UserInfo={
    id:string
    email:string,
    password:string,
    accessToken:string,
    clientSocket:Socket
}

let user1:UserInfo ={
    id: "",
    email:"user1@socket.com",
    password:"1234567890",
    accessToken:" ",
    clientSocket:null
} 
let user2:UserInfo ={
    id: "",
    email:"user2@socket.com",
    password:"1234567890",
    accessToken:" ",
    clientSocket:null
} 

beforeAll(async () => {
    await User.remove({"email":user1.email})    
    await User.remove({"email":user2.email})    

});
const serverCleanup = async () => {
    return new Promise<void>((resolve)=>{
        server.close(()=>{
            resolve()
        })
    })
}

afterAll(async () => {
    user1.clientSocket.close()
    user2.clientSocket.close()
    await User.remove({"email":user1.email})    
    await User.remove({"email":user2.email}) 
    await closeSocketServer()
    await serverCleanup() 
    await mongoose.connection.close();
});

describe("Socket IO server test", () => {
    const registerUser=async (userInfo:UserInfo)=>{

        const response = await request(server)
            .post('/auth/register')
            .send({"email":userInfo.email , 'password':userInfo.password})
        expect(response.statusCode).toEqual(200)
        userInfo.accessToken = response.body.accessToken
        userInfo.id = response.body._id

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
        user1.clientSocket.on("common:echo", (arg: string) => {
            expect(arg).toBe("echo message");
            done();
        });
        user1.clientSocket.emit("common:echo", "echo message")
    });

    test("test IMS event", (done) => {
        user2.clientSocket.on("ims:recive_message", (arg: any) => {
            expect(arg.message).toBe("This is ims message");
            expect(arg.from).toBe(user1.id);
            expect(arg.to).toBe(user2.id);

            done();
        });
        user1.clientSocket.emit("ims:send_message", {to: user2.id,from:user1.id ,message: "This is ims message"})
    });

    test("test post and notify event", (done) => {
        user2.clientSocket.on("post:notify", (arg:any)=>{
            expect(arg.message).toEqual("This is post message")
            expect(arg.sender).toEqual(user1.id)
            done()
        })

        request(server).post('/post')
        .set({ authorization: "barer " + user1.accessToken })
        .send({
            "message" :"This is post message",
            "sender" : ""
        }).then(()=>{
            console.log("Done posting");
            
        })
        
    });
});

