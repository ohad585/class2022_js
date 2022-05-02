import commonHandler from "./events/common"
import { Server } from "socket.io"
import http from 'http';
import jwt from "jsonwebtoken"
import {createClient} from "redis"
import {createAdapter} from "@socket.io/redis-adapter"




const pubClient = createClient({url:process.env.REDDIS_URL})
const subClient = pubClient.duplicate()
let io:Server;

export const closeSocketServer = async () => {
    await pubClient.disconnect()
    await subClient.disconnect()

}

export const broadcastPostMessage = (post)=>{
    io.to("all").emit("post:notify",post)
}
export const socketServer = async (server: http.Server): Promise<Server> => {
    io = new Server(server);

    await pubClient.connect()
    await subClient.connect()

    io.adapter(createAdapter(pubClient,subClient))
    
    io.use(async (socket, next) => {
        let token = socket.handshake.auth.token;
        if(token == null) return next(new Error('Authentication error'))
        token = token.split(' ')[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err){
                next(new Error('Authentication error'));
            } else{
                socket.data.user = user._id
                next()
            } 
        })
    });


    io.on('connection',async (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        console.log('user added to room : '+ socket.data.user)
        await socket.join(socket.data.user);
        await socket.join("all");


        //Ataching common handler
        commonHandler(io,socket)

    });
    return io
}

