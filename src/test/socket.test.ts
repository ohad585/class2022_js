import Client,{Socket} from "socket.io-client";
import mongoose from "mongoose";
import socketServer from "../app"

let clientSocket:Socket

beforeAll((done) => {
    console.log("")
    clientSocket = Client("http://localhost:" + process.env.PORT)
    clientSocket.on("connect", done);
});

afterAll(() => {
    clientSocket.close()
    socketServer.close()
    mongoose.connection.close();
});

describe("Socket IO server test", () => {
    test("test echo event", (done) => {
        clientSocket.on("echo", (arg: any) => {
            expect(arg).toBe("echo message");
            done();
        });
        clientSocket.emit("echo", "echo message")
    });
});

