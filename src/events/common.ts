import {Server ,Socket} from 'socket.io'

export = (io:Server, socket:Socket) => {
    const echoHandler = (payload:string) =>{
        socket.emit('common:echo',payload)
    }
    
    type ImsMessage = {
        to:string,
        from:string,
        message:string
    }

    const imsSendMessageHandler = (payload:ImsMessage) =>{
        const to = payload.to
        const message = payload.message
        const from = payload.from
        console.log("imsSendMessageHandler : "+ from + " " + to )

        io.to(to).emit("ims:recive_message",payload)

    }

    


    socket.on("common:echo",echoHandler)
    socket.on("ims:send_message",imsSendMessageHandler)

}