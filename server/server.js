const express = require("express")
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const cors = require("cors")
const sslRedirect = require("heroku-ssl-redirect")


app.use(sslRedirect())
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
//var mongo = require('mongodb').MongoClient
//var url = "mongodb://localhost:27017/mydb";

// TODOS:
// ha en countdown når gungame er ferdig.
// pillargame: står hvor mange poeng man fikk når spillet er ferdig

const Game = require('./game')

const game = new Game()


io.on("connection", (socket) => {

    console.log("user connected")
    if (!game){
        console.log("starting a new game/room!")
        //game = 
    }

    socket.on("playerMovement", (pm) => {
        game.addPlayerMovement(pm)
    })

    socket.on("sendMessage", (message) => {
        game.addMessage(message)
    })

    socket.on("setUsername", (data) => {
        game.addPlayer(data, socket)
    })

    socket.on("pingServer", () => {
        socket.emit("pongServer")
    })

    socket.on("disconnect", () => {
        game.removePlayer(socket)
    })
})


const port = process.env.PORT || 3002
server.listen(port, () => console.log(`Server started, listening on port ${port}`))

