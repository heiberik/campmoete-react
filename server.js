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
let pillars = []
let usersDead = []

let numbersDeleteEvent = 0
let numbersGameEvent = 0
let updateState = false
let startOverDelete = false
let startOverGame = false
let gameInProgress = false
let progressTick = 0
let countDownStarted = false
let countDownNumber = -1
let highscore = 0
let currentScore = 0

io.on("connection", (socket) => {

    console.log("user connected")

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
        updateState = true
    })

    socket.on("setUsername", (data) => {

        const newUser = {
            id: socket.id,
            username: data.username,
            playerPosX: 50,
            playerPosY: 50 + (users.length * 2),
            color: getRandomColor(),
            shield: false,
        }

        users = users.concat(newUser)
        socket.emit("sendUser", newUser)
        updateState = true
    })

    socket.on("playerMovement", (pm) => {

        const user = users.find(u => u.id === socket.id)
        if (!user) return
        let newPosX = user.playerPosX
        let newPosY = user.playerPosY

        if (pm.up && pm.left) {
            newPosX = newPosX - .25
            newPosY = newPosY - .25
        }
        else if (pm.up && pm.right) {
            newPosX = newPosX + .25
            newPosY = newPosY - .25
        }
        else if (pm.down && pm.left) {
            newPosX = newPosX - .25
            newPosY = newPosY + .25
        }
        else if (pm.down && pm.right) {
            newPosX = newPosX + .25
            newPosY = newPosY + .25
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


    socket.on("disconnect", () => {
        users = users.filter(user => user.id !== socket.id)
        io.emit("sendUsers", { users: users })

        console.log("user disconnected")
        updateState = true
    })
})


const makePillar = () => {

    const randomNumber1 = Math.floor(Math.random() * 60) + 20

    const newPillar = {
        top: randomNumber1-8,
        bottom: randomNumber1+8,
        color: getRandomColor(),
        posX: 100.0,
    }

    pillars = pillars.concat(newPillar)    
}

const movePillars = () => {

    pillars.forEach(p => {p.posX = p.posX - .4})
    pillars = pillars.filter(p => {
        if (p.posX >= -2.0) return true
        else {
            currentScore++
            return false
        }            
    })
}

const checkCollissions = () => {
    let ud = []

    users.forEach(u => {
        
        const x = u.playerPosX
        const y = u.playerPosY

        pillars.forEach(p => {

            if (p.posX >= x && p.posX <= x+1){
                if (y >= p.bottom-2 || y <= p.top+3){
                
                    ud = ud.concat(u.username)
                }
            }
        })
    })

    return ud
}

const update = () => {

    if (updateState && !gameInProgress) {

        let usersInDeleteArea = 0
        let usersInGameArea = 0

        users.forEach(u => {
            if (u.playerPosX < 8 && u.playerPosY > 88 && u.playerPosX > 0 && u.playerPosY < 100) {
                usersInDeleteArea++
            } else startOverDelete = false

            if (u.playerPosX > 88 && u.playerPosY > 88 && u.playerPosX < 100 && u.playerPosY < 100) {
                usersInGameArea++
            } else startOverGame = false
        })

        if (usersInDeleteArea > 0 && usersInDeleteArea === users.length && !startOverDelete) {
            messages = []
            startOverDelete = true
        }
        if (usersInGameArea > 0 && usersInGameArea === users.length && !startOverGame && !gameInProgress && !countDownStarted) {
            countDownStarted = true
            startOverGame = true
            const countDown = (count) => {
                if (count < -1) {
                    gameInProgress = true
                    countDownStarted = false
                    makePillar()
                }
                else {
                    setTimeout(() => countDown(count-1), 1000);
                }
                updateState = true
                countDownNumber = count
            }
            countDown(5)
        }

        if (numbersDeleteEvent !== usersInDeleteArea) {
            numbersDeleteEvent = usersInDeleteArea
        }   
        if (numbersGameEvent !== usersInGameArea) {
            numbersGameEvent = usersInGameArea
        }
    }

    if (gameInProgress) {

        progressTick++

        if (progressTick % 120 === 0) makePillar()
        movePillars()

        usersDead = checkCollissions()
        if (usersDead.length > 0) {
            gameInProgress = false
            startOver = false
            progressTick = 0
            pillars = []
            setTimeout(() => {
                usersDead = []
                updateState = true
            }, 5000)
            if (currentScore > highscore){
                highscore = currentScore
            }  
            currentScore = 0 
        }
        updateState = true
    }
}

setInterval(() => {

    update()

    if (updateState) {
        io.sockets.emit('gameState', {
            users: users,
            messages: messages,
            pillars: pillars,
            numbersDeleteEvent: [numbersDeleteEvent, users.length],
            numbersGameEvent: [numbersGameEvent, users.length],
            highScore: highscore,
            currentScore: currentScore,
            deadUsers: usersDead,
            countDown: countDownNumber,
        })
        updateState = false
    }

}, 1000 / 40);

const port = process.env.PORT || 5000
server.listen(port, () => console.log(`Server started, listening on port ${port}`))

