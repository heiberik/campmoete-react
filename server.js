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

let usersStartedDeleteEvent = []
let usersStartedGameEvent = []


io.on("connection", (socket) => {

    socket.on("sendCoords", (coords) => {
        const user = users.find(u => u.id === socket.id)
        const newUser = {
            ...user,
            playerPosX: coords.posX,
            playerPosY: coords.posY,
        }

        users = users.filter(u => u.id !== socket.id).concat(newUser)

        socket.broadcast.emit("sendUsers", {users: users} )
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

        if (usersStartedDeleteEvent.length === users.length){
            io.emit("beginDeleteEvent", { number: usersStartedDeleteEvent.length })
        }
        io.emit("numbersDeleteEvent", { number: usersStartedDeleteEvent.length })
    })


    socket.on("startDeleteEvent", (data) => {
        if (data.start){

            usersStartedDeleteEvent.push(socket.id)
            if (usersStartedDeleteEvent.length === users.length){
                io.emit("beginDeleteEvent", { number: usersStartedDeleteEvent.length })
            }
            else {
                io.emit("numbersDeleteEvent", { number: usersStartedDeleteEvent.length })
            }      
        }
        else {
            usersStartedDeleteEvent = usersStartedDeleteEvent.filter(u => u !== socket.id)
            io.emit("numbersDeleteEvent", { number: usersStartedDeleteEvent.length })
        }
    })

    socket.on("completeDeleteEvent", (data) => {
        messages = []
        io.emit("messagesReset", {data : true})
    })

    socket.on("setShield", (data) => {
        const user = users.find(u => u.id === socket.id)
        const newUser = {
            ...user,
            shield: data.shield,
        }
        users = users.filter(u => u.id !== socket.id).concat(newUser)
        socket.broadcast.emit("sendUsers", {users: users} )
    })

    socket.on("disconnect", () => {
        usersStartedDeleteEvent = usersStartedDeleteEvent.filter(u => u !== socket.id)
        if (usersStartedDeleteEvent.length === users.length){
            io.emit("beginDeleteEvent", { number: usersStartedDeleteEvent.length })
        }
        else {
            io.emit("numbersDeleteEvent", { number: usersStartedDeleteEvent.length })
        }
        

        users = users.filter(user => user.id !== socket.id)
        io.emit("sendUsers", { users: users })
    })
})


app.get("/api/messages", (req, res) => {
    res.json(messages)
})

app.post("/api/messages", (req, res) => {
    const body = req.body

    top = 0
    left = 0

    while (
        (top === 0) ||
        (top > 40 && top < 60 && (left > 25 && left < 75)) ||
        (left > 25 && left < 75 && (top > 40 && top < 60))
    ) {
        // må være et sted mellom 20-40 og 60-80
        top = Math.floor(Math.random() * 60) + 20
        // må være et sted mellom 15-25 og 75-85
        left = Math.floor(Math.random() * 70) + 15
    }

    const newMessage = {
        number: messages.length,
        message: body.message,
        date: Date(),
        color: getRandomColor(),
        top: top,
        left: left
    }

    io.sockets.emit("broadcastMessages", newMessage)

    messages = messages.concat(newMessage)
    res.json(newMessage)
})



const port = process.env.PORT || 4000
server.listen(port, () => console.log(`Server started, listening on port ${port}`))

