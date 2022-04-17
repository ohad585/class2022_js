
import { Server } from "socket.io"
import http from 'http';

const socketServer = (server: http.Server): Server => {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.on("echo", (msg) => {
            console.log("on echo:" + msg)
            socket.emit("echo", msg)
        })
    });
    return io
}

export = socketServer
