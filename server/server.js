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
// pillargame: står hvor mange poeng man fikk når spillet er ferdig



const Game = require('./game')
let game = null
let totalConnected = 0


io.on("connection", (socket) => {

    console.log("user connected")
    totalConnected++
    if (!game){
        console.log("starting a new game/room!")
        game = new Game()
    }

    socket.on("playerMovement", (pm) => {
        game.addPlayerMovement(pm, socket.id)
    })

    socket.on("sendMessage", (message) => {
        game.addMessage(message, socket.id)
    })

    socket.on("setUsername", (data) => {
        game.addPlayer(data, socket)
    })

    socket.on("pingServer", (latency) => {
        game.addLatency(latency, socket.id)
        socket.emit("pongServer")
    })

    socket.on("disconnect", () => {

        console.log("user disconnected")
        game.removePlayer(socket)
        totalConnected--
        if (totalConnected === 0){
            console.log("closing a game/room!")
            game = null
        }
    })
})


const port = process.env.PORT || 3002
server.listen(port, () => console.log(`Server started, listening on port ${port}`))

