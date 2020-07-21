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


let messages = []
let newMessages = false
let users = []
let usersChanged = false
let pillars = []
let pillarsChanged = false

let playerMovementQueue = {}
let messagesQueue = []

let usersDead = []
let usersDeadChanged = false

let scoreChanged = false
let highscore = 0
let currentScore = 0

let numbersDeleteEvent = 0
let numbersGameEvent = 0
let updateState = false
let startOverDelete = false
let startOverGame = false
let gameInProgress = false
let progressTick = 0
let progressTickSpeed = 200
let countDownStarted = false
let countDownNumber = -2

let freezeGame = false
let freezeGameChanged = false


const getRandomColor = () => {
    var letters = 'ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 6)];
    }
    return color;
}

const getRandomColorDark = () => {
    var letters = '3456789A';
    var color = '#';
    for (var i = 0; i < 8; i++) {
        color += letters[Math.floor(Math.random() * 8)];
    }
    return color;
}

io.on("connection", (socket) => {

    console.log("user connected")

    socket.on("sendMessage", (message) => {
        messagesQueue.push(message)
    })

    socket.on("setUsername", (data) => {

        const check = users.filter(u => u.username.toLowerCase() === data.username.toLowerCase())
        if (check.length > 0) {
            const newUser = {
                id: "usernameTaken"
            }
            socket.emit("sendUser", newUser)
        }
        else {
            const newUser = {
                id: socket.id,
                username: data.username,
                playerPosX: 50,
                playerPosY: 50 + (users.length * 2),
                color: getRandomColor(),
                shield: false,
            }

            playerMovementQueue[socket.id] = []

            users = users.concat(newUser)
            socket.emit("sendUser", newUser)
            updateState = true
            usersChanged = true
        }
    })

    socket.on("playerMovement", (pm) => {
        if (!playerMovementQueue[socket.id]) return
        playerMovementQueue[socket.id].push({ pm: pm, id: socket.id })
    })

    socket.on("disconnect", () => {
        users = users.filter(user => user.id !== socket.id)
        console.log("user disconnected")
        updateState = true
        usersChanged = true
        delete playerMovementQueue[socket.id]
    })
})


const handleMessageQueue = () => {

    messagesQueue.forEach(m => {
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
            number: m.length,
            message: m.message,
            date: Date(),
            color: getRandomColor(),
            top: top,
            left: left
        }

        messages = messages.concat(newMessage)
        newMessages = true
        updateState = true
    })

    messagesQueue = []
}

const handlePlayerMovementQueue = () => {

    for (var key in playerMovementQueue) {

        if (!playerMovementQueue.hasOwnProperty(key)) continue;
        
        var queue = playerMovementQueue[key];
        const firstMove = queue.shift()
        if (!firstMove) return

        const pm = firstMove.pm

        if (!freezeGame) {
            const user = users.find(u => u.id === firstMove.id)
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

            if (newPosX > 101) newPosX = newPosX - .5
            if (newPosX < -1) newPosX = newPosX + .5
            if (newPosY > 101) newPosY = newPosY - .5
            if (newPosY < -1) newPosY = newPosY + .5

            const newPlayer = {
                ...user,
                shield: pm.space,
                playerPosX: newPosX,
                playerPosY: newPosY,
            }

            users = users.filter(u => u.id !== firstMove.id)
            users = users.concat(newPlayer)
            updateState = true
            usersChanged = true
        }
    }

    messages.forEach(m => {

        const messageX = m.left
        const messageY = m.top

        users.forEach(u => {

            const x = u.playerPosX
            const y = u.playerPosY

            // fra venstre
            if (x >= messageX - 2.0 && x <= messageX - 1.5 && y >= messageY - 2.5 && y <= messageY + 7.75) {
                m.left = m.left + .5
                newMessages = true
            }
            //fra høyre
            else if (x <= messageX + 12.75 && x >= messageX + 12.25 && y >= messageY - 2.5 && y <= messageY + 7.75) {
                m.left = m.left - .5
                newMessages = true
            }
            //fra top
            else if (x >= messageX - 2 && x <= messageX + 12.75 && y >= messageY - 2.75 && y <= messageY - 2.25) {
                m.top = m.top + .5
                newMessages = true
            }
            //fra bot
            else if (x >= messageX - 2 && x <= messageX + 12.75 && y >= messageY + 7.25 && y <= messageY + 7.75) {
                m.top = m.top - .5
                newMessages = true
            }
        })
    })
}


const makePillar = () => {

    const randomNumber1 = Math.floor(Math.random() * 60) + 20

    const newPillar = {
        top: randomNumber1 - 7,
        bottom: randomNumber1 + 7,
        color: getRandomColor(),
        posX: 105.0,
    }

    pillars = pillars.concat(newPillar)
}

const movePillars = () => {

    pillars.forEach(p => { p.posX = p.posX - .4 })
    pillars = pillars.filter(p => {
        if (p.posX >= -5.0) return true
        else {
            scoreChanged = true
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
            if (p.posX >= x - 2.8 && p.posX <= x + 2.8) {
                if (y >= p.bottom - 2.3 || y <= p.top + 1.9) {
                    ud = ud.concat(u.username)
                }
            }
        })
    })

    return ud
}

const update = () => {

    if (!gameInProgress && updateState) {

        let usersInDeleteArea = 0
        let usersInGameArea = 0

        users.forEach(u => {
            if (u.playerPosX < 8 && u.playerPosY > 92 && u.playerPosX > 1 && u.playerPosY < 99) {
                usersInDeleteArea++
            } else startOverDelete = false

            if (u.playerPosX > 92 && u.playerPosY > 92 && u.playerPosX < 99 && u.playerPosY < 99) {
                usersInGameArea++
            } else startOverGame = false
        })

        if (usersInDeleteArea > 0 && usersInDeleteArea === users.length && !startOverDelete) {
            messages = []
            startOverDelete = true
            newMessages = true
        }
        if (usersInGameArea > 0 && usersInGameArea === users.length && !startOverGame && !gameInProgress && !countDownStarted) {
            countDownStarted = true
            startOverGame = true
            const countDown = (count) => {
                if (count < -1) {
                    gameInProgress = true
                    progressTickSpeed = 180
                    usersDead = []
                    countDownStarted = false
                    countDownNumber = -2
                    makePillar()
                }
                else {
                    setTimeout(() => countDown(count - 1), 1000);
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
        numbersAreaChanged = true
    }

    if (gameInProgress) {

        progressTick++

        if (progressTick % progressTickSpeed === 0) {
            makePillar()
            if (progressTickSpeed > 90) {
                progressTickSpeed -= 4
            }
        }


        movePillars()

        usersDead = checkCollissions()
        if (usersDead.length > 0) {
            usersDeadChanged = true
            gameInProgress = false
            startOver = false
            progressTick = 0
            pillars = []
            setTimeout(() => {
                usersDead = []
                usersDeadChanged = true
                updateState = true
            }, 5000)
            if (currentScore > highscore) {
                highscore = currentScore
            }
            currentScore = 0
            scoreChanged = true
            freezeGame = true
            freezeGameChanged = true

            setTimeout(() => {
                users.forEach(u => {
                    const user = users.find(us => us.id === u.id)
                    if (user) {
                        u.playerPosX = 93
                        u.playerPosY = 85
                    }
                })
                freezeGame = false
                freezeGameChanged = true
                usersChanged = true
                updateState = true
            }, 3000)
            usersChanged = true
        }

        pillarsChanged = true
        updateState = true
    }

    if (updateState) {




    }
}


const getMessages = () => {
    if (newMessages) return messages
    else return null
}

const getUsers = () => {
    if (usersChanged) return users
    else return null
}

const getPillars = () => {
    if (pillarsChanged) return pillars
    else return null
}

setInterval(() => {

    handleMessageQueue()
    handlePlayerMovementQueue()
    update()

    if (freezeGame) {
        io.sockets.emit('gameState', {
            freezeGameChanged: freezeGameChanged,
            freezeGame: freezeGame,
            newMessages: newMessages,
            messages: getMessages(),
            usersChanged: usersChanged,
            users: getUsers(),
            countDown: countDownNumber,
            pillarsChanged: false,
            usersDeadChanged: true,
            deadUsers: usersDead,
            scoreChanged: scoreChanged,
            highScore: highscore,
            currentScore: currentScore,
            numbersAreaChanged: startOverGame || startOverDelete || numbersAreaChanged,
            numbersDeleteEvent: [numbersDeleteEvent, users.length],
            numbersGameEvent: [numbersGameEvent, users.length],
        })
        pillarsChanged = true
        freezeGameChanged = false
    }
    else if (updateState && !freezeGame) {
        io.sockets.emit('gameState', {
            freezeGameChanged: freezeGameChanged,
            freezeGame: freezeGame,
            newMessages: newMessages,
            messages: getMessages(),
            usersChanged: usersChanged,
            users: getUsers(),
            countDown: countDownNumber,
            pillarsChanged: pillarsChanged,
            pillars: getPillars(),
            usersDeadChanged: usersDeadChanged,
            deadUsers: usersDead,
            scoreChanged: scoreChanged,
            highScore: highscore,
            currentScore: currentScore,
            numbersAreaChanged: startOverGame || startOverDelete || numbersAreaChanged,
            numbersDeleteEvent: [numbersDeleteEvent, users.length],
            numbersGameEvent: [numbersGameEvent, users.length],
        })

        numbersAreaChanged = false
        scoreChanged = false
        usersDeadChanged = false
        pillarsChanged = false
        updateState = false
        newMessages = false
        freezeGameChanged = false
        usersChanged = false
    }
}, 1000 / 50);

const port = process.env.PORT || 5000
server.listen(port, () => console.log(`Server started, listening on port ${port}`))

