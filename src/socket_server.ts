import commonHandler from "./events/common"
import { Server } from "socket.io"
import http from 'http';
import jwt from "jsonwebtoken"

const socketServer = (server: http.Server): Server => {
    const io = new Server(server);

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


    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        //Ataching common handler
        commonHandler(io,socket)

    });
    return io
}

export = socketServer
