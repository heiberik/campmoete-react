const express = require("express")
const cors = require("cors")
const app = express()
const http = require("http")
const server = http.createServer(app)
const io = require("socket.io").listen(server)
var sslRedirect = require("heroku-ssl-redirect")

app.use(sslRedirect());
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

const getRandomColor = () => {
    var letters = 'ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 6)];
    }
    return color;
}

let messages = []
let users = []
let numbersDeleteEvent = 0
let numbersGameEvent = 0
let updateState = false

io.on("connection", (socket) => {

    console.log("user connected")

    socket.on("getAllMessages", () => {
        socket.emit("sendAllMessages", { messages: messages })
    })

    socket.on("sendMessage", (message) => {

        let top = 0
        let left = 0

        while ((top === 0) ||
            (top > 40 && top < 60 && (left > 25 && left < 75)) ||
            (left > 25 && left < 75 && (top > 40 && top < 60))
        ) {
            top = Math.floor(Math.random() * 60) + 20
            left = Math.floor(Math.random() * 70) + 15
        }

        const newMessage = {
            number: messages.length,
            message: message.message,
            date: Date(),
            color: getRandomColor(),
            top: top,
            left: left
        }

        messages = messages.concat(newMessage)
        io.emit("sendAllMessages", { messages: messages })
    })

    socket.on("setUsername", (data) => {

        const newUser = {
            id: socket.id,
            username: data.username,
            playerPosX: 14,
            playerPosY: 10 + (users.length * 2),
            color: getRandomColor(),
            shield: false,
        }

        users = users.concat(newUser)
        socket.emit("sendUser", newUser)
        io.emit("sendUsers", { users: users })
    })

    socket.on("playerMovement", (pm) => {

        const user = users.find(u => u.id === socket.id)
        if (!user) return
        let newPosX = user.playerPosX
        let newPosY = user.playerPosY

        if (pm.up && pm.left) {
            newPosX = newPosX - .4
            newPosY = newPosY - .4
        }
        else if (pm.up && pm.right) {
            newPosX = newPosX + .4
            newPosY = newPosY - .4
        }
        else if (pm.down && pm.left) {
            newPosX = newPosX - .4
            newPosY = newPosY + .4
        }
        else if (pm.down && pm.right) {
            newPosX = newPosX + .4
            newPosY = newPosY + .4
        }
        else if (pm.up) newPosY = newPosY - .5
        else if (pm.down) newPosY = newPosY + .5
        else if (pm.left) newPosX = newPosX - .5
        else if (pm.right) newPosX = newPosX + .5
  
        const newPlayer = {
            ...user,
            shield: pm.space,
            playerPosX: newPosX,
            playerPosY: newPosY,
        }

        users = users.filter(u => u.id !== socket.id)
        users = users.concat(newPlayer)
        updateState = true
    })

    socket.on("setShield", (data) => {
        const user = users.find(u => u.id === socket.id)
        const newUser = {
            ...user,
            shield: data.shield,
        }
        users = users.filter(u => u.id !== socket.id).concat(newUser)
        socket.broadcast.emit("sendUsers", { users: users })
    })

    socket.on("disconnect", () => {
        users = users.filter(user => user.id !== socket.id)
        io.emit("sendUsers", { users: users })

        console.log("user disconnected")
        updateState = true
    })
})

const update = () => {

    if (updateState) {

        //check if special event should be started
        let usersInDeleteArea = 0
        let usersInGameArea = 0

        users.forEach(u => {
            if (u.playerPosX < 8 && u.playerPosY > 88 && u.playerPosX > 0 && u.playerPosY < 100) {
                usersInDeleteArea++
            }

            if (u.playerPosX > 88 && u.playerPosY > 88 && u.playerPosX < 100 && u.playerPosY < 100) {
                usersInGameArea++
            }
        })
        if (usersInDeleteArea === users.length) {
            messages = []
            io.emit("sendAllMessages", { messages: messages })
        } 
        if (usersInGameArea === users.length) {
            // start game event!
        }

        if (numbersDeleteEvent !== usersInDeleteArea){
            numbersDeleteEvent = usersInDeleteArea
        }

        if (numbersGameEvent !== usersInGameArea){
            numbersGameEvent = usersInGameArea
        }
    }
}

setInterval(() => {

    update()

    if (updateState) {
        io.sockets.emit('gameState', { 
            users: users,
            numbersDeleteEvent: [numbersDeleteEvent, users.length],
            numbersGameEvent: [numbersGameEvent, users.length],
        })
        console.log("updating state!")
        updateState = false
    }

}, 1000 / 30);

const port = process.env.PORT || 5000
server.listen(port, () => console.log(`Server started, listening on port ${port}`))

