import server from "./server"
import socketServer from "./socket_server"

const port = process.env.PORT

socketServer(server)

server.listen(port ,()=>{
    console.log('Exaple app listening on port '+port)
})

export = server