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

let playersShootCooldown = {}
let bullets = []
let bulletsChanged = false

let numbersDeleteEvent = 0
let numbersGameEvent = 0
let numbersGunGameEvent = 0
let updateState = false
let startOverDelete = false
let startOverGame = false
let startOverGunGame = false
let gameInProgress = false
let gunGameInProgress = false
let progressTick = 0
let progressTickSpeed = 200
let countDownStarted = false
let countDownNumber = -2

let freezeGame = false
let freezeGameChanged = false

let moveSpeed1 = .5
let moveSpeed2 = .25
let pillarSpeed = .4


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

    socket.on("sendMessage", async (message) => {
        messagesQueue.push(message)
    })

    socket.on("setUsername", async (data) => {

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
            playersShootCooldown[socket.id] = false

            users = users.concat(newUser)
            socket.emit("sendUser", newUser)
            updateState = true
            usersChanged = true
            newMessages = true
        }
    })

    socket.on("playerMovement", async (pm) => {
        if (!playerMovementQueue[socket.id]) return
        playerMovementQueue[socket.id].push({ pm: pm, id: socket.id })
    })

    socket.on("disconnect", async () => {
        users = users.filter(user => user.id !== socket.id)
        console.log("user disconnected")
        updateState = true
        usersChanged = true
        delete playerMovementQueue[socket.id]
        delete playersShootCooldown[socket.id]
    })
})


const handleMessageQueue = () => {

    messagesQueue.forEach(m => {
        let top = 0
        let left = 0

        while ((top === 0) ||
            (top > 35 && top < 60 && (left > 25 && left < 75)) ||
            (left > 25 && left < 75 && (top > 35 && top < 60))
        ) {
            top = Math.floor(Math.random() * 70) + 15
            left = Math.floor(Math.random() * 80) + 5
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

const shootBullet = (shot, id) => {

    var cd = playersShootCooldown[id]

    if (!cd) {

        const x = shot[0]
        const y = shot[1]

        const user = users.find(u => u.id === id)
        let dirX = x - user.playerPosX
        let dirY = y - user.playerPosY

        const len = Math.sqrt(dirX * dirX + dirY * dirY)

        dirX /= len
        dirY /= len

        const bullet = {
            id: Math.floor(Math.random() * 999999999) + user.id,
            owner: user.id,
            posX: user.playerPosX,
            posY: user.playerPosY,
            dirX: dirX,
            dirY: dirY,
            color: getRandomColor(),
        }

        bullets = bullets.concat(bullet)

        playersShootCooldown[id] = true
        bulletsChanged = true

        setTimeout(() => {
            playersShootCooldown[id] = false
        }, 1000)
    }
}

const handlePlayerMovementQueue = () => {

    for (var key in playerMovementQueue) {

        if (!playerMovementQueue.hasOwnProperty(key)) continue

        var queue = playerMovementQueue[key];
        const firstMove = queue.shift()
        if (!firstMove) continue

        const pm = firstMove.pm

        if (!freezeGame) {
            const user = users.find(u => u.id === firstMove.id)
            if (!user) continue
            let newPosX = user.playerPosX
            let newPosY = user.playerPosY

            if (pm.up && pm.left) {
                newPosX = newPosX - moveSpeed2
                newPosY = newPosY - moveSpeed2
            }
            else if (pm.up && pm.right) {
                newPosX = newPosX + moveSpeed2
                newPosY = newPosY - moveSpeed2
            }
            else if (pm.down && pm.left) {
                newPosX = newPosX - moveSpeed2
                newPosY = newPosY + moveSpeed2
            }
            else if (pm.down && pm.right) {
                newPosX = newPosX + moveSpeed2
                newPosY = newPosY + moveSpeed2
            }
            else if (pm.up) newPosY = newPosY - moveSpeed1
            else if (pm.down) newPosY = newPosY + moveSpeed1
            else if (pm.left) newPosX = newPosX - moveSpeed1
            else if (pm.right) newPosX = newPosX + moveSpeed1

            if (newPosX > 101) newPosX = newPosX - moveSpeed1
            if (newPosX < -1) newPosX = newPosX + moveSpeed1
            if (newPosY > 101) newPosY = newPosY - moveSpeed1
            if (newPosY < -1) newPosY = newPosY + moveSpeed1

            if (gunGameInProgress) {
                if (pm.shoot) {
                    shootBullet(pm.shoot, firstMove.id)
                }
            }

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
                m.left = m.left + moveSpeed1
                newMessages = true
            }
            //fra høyre
            else if (x <= messageX + 12.75 && x >= messageX + 12.25 && y >= messageY - 2.5 && y <= messageY + 7.75) {
                m.left = m.left - moveSpeed1
                newMessages = true
            }
            //fra top
            else if (x >= messageX - 2 && x <= messageX + 12.75 && y >= messageY - 2.75 && y <= messageY - 2.25) {
                m.top = m.top + moveSpeed1
                newMessages = true
            }
            //fra bot
            else if (x >= messageX - 2 && x <= messageX + 12.75 && y >= messageY + 7.25 && y <= messageY + 7.75) {
                m.top = m.top - moveSpeed1
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

    pillars.forEach(p => { p.posX = p.posX - pillarSpeed })
    pillars = pillars.filter(p => {
        if (p.posX >= -4.0) return true
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

const checkBulletCollission = () => {

    let dead = []
    bullets.forEach(b => {

    })

    return dead
}

const moveBullets = () => {

    bullets.forEach(b => {
        b.posX = b.posX + b.dirX/2
        b.posY = b.posY + b.dirY/2
        bulletsChanged = true  
    })
      
    bullets = bullets.filter(b => {
        return b.posX < 102 && b.posX > -2 && b.posY < 102 && b.posY > -2
    })
    
    
}

const update = () => {

    if (!gameInProgress && updateState) {

        let usersInDeleteArea = 0
        let usersInGameArea = 0
        let usersInGunGameArea = 0

        users.forEach(u => {
            if (u.playerPosX < 8 && u.playerPosY > 92 && u.playerPosX > 1 && u.playerPosY < 99) {
                usersInDeleteArea++
            } else startOverDelete = false

            if (u.playerPosX > 92 && u.playerPosY > 92 && u.playerPosX < 99 && u.playerPosY < 99) {
                usersInGameArea++
            } else startOverGame = false

            if (u.playerPosX > 80 && u.playerPosY > 92 && u.playerPosX < 87 && u.playerPosY < 99) {
                usersInGunGameArea++
            } else startOverGunGame = false
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
        if (usersInGunGameArea > 0 && usersInGunGameArea === users.length && !startOverGunGame && !gunGameInProgress && !countDownStarted) {
            countDownStarted = true
            startOverGunGame = true
            const countDown = (count) => {
                if (count < -1) {
                    gunGameInProgress = true
                    usersDead = []
                    countDownStarted = false
                    countDownNumber = -2
                    setTimeout(() => {
                        gunGameInProgress = false
                        bullets = []
                        bulletsChanged = true
                    }, 20000);
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
        if (numbersGunGameEvent !== usersInGunGameArea) {
            numbersGunGameEvent = usersInGunGameArea
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

    if (gunGameInProgress) {
        moveBullets()
        const check = checkBulletCollission()
    }
}

const emitGameState = () => {
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
            numbersGunGameEvent: [numbersGunGameEvent, users.length],
            bulletsChanged: bulletsChanged,
            bullets: bullets,
        })
        pillarsChanged = true
        freezeGameChanged = false
    }
    else if (updateState && !freezeGame || gunGameInProgress) {
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
            numbersGunGameEvent: [numbersGunGameEvent, users.length],
            bulletsChanged: bulletsChanged,
            bullets: bullets,
        })

        numbersAreaChanged = false
        scoreChanged = false
        usersDeadChanged = false
        pillarsChanged = false
        updateState = false
        newMessages = false
        freezeGameChanged = false
        usersChanged = false
        bulletsChanged = false
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
    emitGameState()

}, 1000 / 60);

const port = process.env.PORT || 5000
server.listen(port, () => console.log(`Server started, listening on port ${port}`))

