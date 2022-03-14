const app = require("./server")

const port = process.env.port
app.listen(port ,()=>{
    console.log('Exaple app listening on port '+port)
})

module.exports = app