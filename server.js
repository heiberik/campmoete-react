const express = require("express")
const cors = require("cors")
const app = express()
const http = require("http")
const server = http.createServer(app)
const io = require("socket.io")(server)
var sslRedirect = require("heroku-ssl-redirect")

app.use(sslRedirect([
    'other',
    'development',
    'production']))
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

// global vars
let messages = []
let newMessages = false
let users = []
let userMoves = []
let usersChanged = false
let pillars = []
let pillarsChanged = false
let messagesQueue = []
let usersDead = []
let usersDeadChanged = false
let numbersDeleteEvent = 0
let numbersGameEvent = 0
let numbersGunGameEvent = 0
let moveSpeed1 = .4
let moveSpeed2 = .20
let pillarSpeed = .3

// pillar game
let scoreChanged = false
let highscore = 0
let newHighscore = false
let currentScore = 0
let progressTick = 0
let progressTickSpeed = 200
let freezeGame = false
let freezeGameChanged = false

// gun game
let playersShootCooldown = {}
let bullets = []
let bulletsChanged = false

// other state changes
let numbersAreaChanged = false
let updateState = false
let startOverDelete = false
let startOverGame = false
let startOverGunGame = false
let gameInProgress = false
let gunGameInProgress = false
let countDownStarted = false
let countDownNumber = -2

const getRandomColor = () => {
    var letters = 'ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 6)];
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
                updateSeq: 0,
                username: data.username,
                playerPosX: 85,
                playerPosY: 85 + (users.length * 2),
                color: getRandomColor(),
                hit: false,
                shield: false,

                up: false,
                down: false,
                left: false,
                right: false,
                space: false,
                shoot: null,
            }

            playersShootCooldown[socket.id] = false

            users = users.concat(newUser)
            socket.emit("sendUser", newUser)

            updateState = true
            usersChanged = true
            newMessages = true
            scoreChanged = true
            numbersAreaChanged = true
        }
    })

    socket.on("playerMovement", (pm) => {
        userMoves.push(pm)
    })

    socket.on("pingServer", (data) => {
        socket.emit("pongServer")
    })

    socket.on("disconnect", () => {
        users = users.filter(user => user.id !== socket.id)
        console.log("user disconnected")
        updateState = true
        usersChanged = true
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
            number: messages.length,
            message: m.message,
            date: Date(),
            color: getRandomColor(),
            top: top,
            left: left
        }

        messages.push(newMessage)
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
            hit: false,
            color: getRandomColor(),
        }

        bullets.push(bullet)

        playersShootCooldown[id] = true
        bulletsChanged = true
        updateState = true
        setTimeout(() => {
            playersShootCooldown[id] = false
        }, 300)
    }
}

const findPlayerId = (id) => {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === id) {
            return users[i]
        }
    }
    return null
}

const findPlayerUsername = (username) => {
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            return users[i]
        }
    }
    return null
}

const handlePlayerMovements = () => {

    userMoves.forEach(pm => {

        let user = findPlayerId(pm.id)
        if (!user) return

        user.up = pm.up
        user.down = pm.down
        user.left = pm.left
        user.right = pm.right
        user.space = pm.space
        user.shoot = pm.shoot

    })

    userMoves = []

    users.forEach(user => {

        if (freezeGame) return 
        let newPosX = user.playerPosX
        let newPosY = user.playerPosY

        if (user.up && user.left) {
            newPosX = newPosX - moveSpeed2
            newPosY = newPosY - moveSpeed2
        }
        else if (user.up && user.right) {
            newPosX = newPosX + moveSpeed2
            newPosY = newPosY - moveSpeed2
        }
        else if (user.down && user.left) {
            newPosX = newPosX - moveSpeed2
            newPosY = newPosY + moveSpeed2
        }
        else if (user.down && user.right) {
            newPosX = newPosX + moveSpeed2
            newPosY = newPosY + moveSpeed2
        }
        else if (user.up) newPosY = newPosY - moveSpeed1
        else if (user.down) newPosY = newPosY + moveSpeed1
        else if (user.left) newPosX = newPosX - moveSpeed1
        else if (user.right) newPosX = newPosX + moveSpeed1

        if (newPosX > 101) newPosX = newPosX - moveSpeed1
        if (newPosX < -1) newPosX = newPosX + moveSpeed1
        if (newPosY > 101) newPosY = newPosY - moveSpeed1
        if (newPosY < -1) newPosY = newPosY + moveSpeed1

        if (gunGameInProgress) {
            if (user.shoot) {
                shootBullet(user.shoot, user.id)
            }
        }

        user.shield = user.space
        user.playerPosX = newPosX
        user.playerPosY = newPosY

        updateState = true
        usersChanged = true

        messages.forEach(m => {

            const messageX = m.left
            const messageY = m.top
            const x = newPosX
            const y = newPosY

            if (x >= messageX - 2.0 && x <= messageX - 1.5 && y >= messageY - 2.5 && y <= messageY + 7.75) {
                m.left = m.left + moveSpeed1
                newMessages = true
            }
            else if (x <= messageX + 12.75 && x >= messageX + 12.25 && y >= messageY - 2.5 && y <= messageY + 7.75) {
                m.left = m.left - moveSpeed1
                newMessages = true
            }
            else if (x >= messageX - 2 && x <= messageX + 12.75 && y >= messageY - 2.75 && y <= messageY - 2.25) {
                m.top = m.top + moveSpeed1
                newMessages = true
            }
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

    pillars.push(newPillar)
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
                if (y >= p.bottom - 2.8 || y <= p.top + 1.9) {
                    ud.push(u.username)
                }
            }
        })
    })

    return ud
}

const checkBulletCollission = () => {

    bullets = bullets.filter(b => { return b.hit === false })

    let dead = []
    bullets.forEach(b => {

        const x = b.posX
        const y = b.posY

        messages.forEach(m => {

            const px = m.left
            const py = m.top

            if (x < px + 11.5 && x > px - 0.5 && y < py + 5.5 && y > py - 0.5) {
                b.hit = true
                bulletsChanged = true
                updateState = true
            }
        })

        users.forEach(u => {
            if (u.id === b.owner) return

            const px = u.playerPosX
            const py = u.playerPosY

            if (x < px + 2 && x > px - 2 && y < py + 2 && y > py - 2) {
                dead.push(u.username)
                b.hit = true
                u.hit = true
                bulletsChanged = true
                updateState = true
                usersChanged = true
                u.playerPosX = 93
                u.playerPosY = 85
            }
        })
    })
    return dead
}

const moveBullets = () => {

    bullets.forEach(b => {
        b.posX = b.posX + b.dirX
        b.posY = b.posY + b.dirY
        bulletsChanged = true
    })

    bullets = bullets.filter(b => {
        return b.posX < 102 && b.posX > -2 && b.posY < 102 && b.posY > -2
    })

    updateState = true
}

const updateNumberAreas = () => {
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
                    }, 60000);
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
            numbersAreaChanged = true
        }
        if (numbersGameEvent !== usersInGameArea) {
            numbersGameEvent = usersInGameArea
            numbersAreaChanged = true
        }
        if (numbersGunGameEvent !== usersInGunGameArea) {
            numbersGunGameEvent = usersInGunGameArea
            numbersAreaChanged = true
        }
    }
}

const updateGames = () => {

    if (gameInProgress) {
        progressTick++
        if (progressTick % progressTickSpeed === 0) {
            makePillar()
            if (progressTickSpeed > 120) {
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

            setTimeout(() => {
                usersDead = []
                usersDeadChanged = true
                updateState = true
            }, 5000)

            if (currentScore > highscore) {
                highscore = currentScore
                newHighscore = true
            }

            currentScore = 0
            scoreChanged = true
            freezeGame = true
            freezeGameChanged = true

            setTimeout(() => {
                usersDead.forEach(u => {
                    const user = findPlayerUsername(u)
                    user.playerPosX = 93
                    user.playerPosY = 85
                })
                usersDeadChanged = true
                usersChanged = true
                updateState = true
                pillars = []
                pillarsChanged = true
            }, 2000)

            setTimeout(() => {
                freezeGame = false
                freezeGameChanged = true
                updateState = true
            }, 3500)

            usersChanged = true
        }

        pillarsChanged = true
        updateState = true
    }

    if (gunGameInProgress) {
        moveBullets()
        const check = checkBulletCollission()
        if (check.length > 0) {
            usersDeadChanged = true
            usersDead = check
            setTimeout(() => {
                usersDead = []
                usersDeadChanged = true
                updateState = true
            }, 5000)
        }
        updateState = true
    }
}

const emitGameState = () => {

    if (updateState) {

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
            newHighscore: newHighscore,
            gameInProgress: gameInProgress,
            gunGameInProgress: gunGameInProgress
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
        newHighscore = false
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

    updateGames()
    handleMessageQueue()
    handlePlayerMovements()
    updateNumberAreas()

}, 1000 / 60);

setInterval(emitGameState, 1000 / 40);

const port = process.env.PORT || 3002
server.listen(port, () => console.log(`Server started, listening on port ${port}`))

