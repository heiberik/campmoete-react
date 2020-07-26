const Player = require("./player")

class Game {
    constructor() {
        this.messages = []
        this.newMessages = false
        this.players = []
        this.sockets = []
        this.userMoves = []
        this.usersChanged = false
        this.pillars = []
        this.pillarsChanged = false
        this.messagesQueue = []
        this.usersDead = []
        this.usersDeadChanged = false
        this.numbersDeleteEvent = 0
        this.numbersGameEvent = 0
        this.numbersGunGameEvent = 0
        this.moveSpeed1 = .4
        this.moveSpeed2 = .2
        this.pillarSpeed = .3
        this.countDownNumber = -2
        this.messagesWidth = 12
        this.messagesHeight = 6

        // pillar game
        this.scoreChanged = false
        this.highscore = 0
        this.newHighscore = false
        this.currentScore = 0
        this.progressTick = 0
        this.progressTickSpeed = 280
        this.freezeGame = false
        this.freezeGameChanged = false

        // gun game
        this.playersShootCooldown = {}
        this.bullets = []
        this.bulletsChanged = false

        // other state changes
        this.updateState = false
        this.numbersAreaChanged = false
        this.startOverDelete = false
        this.startOverGame = false
        this.startOverGunGame = false
        this.gameInProgress = false
        this.gunGameInProgress = false
        this.countDownStarted = false


        setInterval(() => {

            this.handlePlayerMovements()
            this.updateGames()
            this.handleMessageQueue()
            this.updateNumberAreas()
            this.emitGameState()

        }, 1000 / 60);
    }


    addPlayer(player, socket) {

        const check = this.players.filter(u => u.username.toLowerCase() === player.username.toLowerCase())
        if (check.length > 0) {
            const newUser = { id: "usernameTaken" }
            socket.emit("sendUser", newUser)
        }
        else {
            const newPlayer = new Player(
                socket.id,
                player.username,
                85,
                85 + (this.players.length * 2),
                this.getRandomColor())

            this.playersShootCooldown[socket.id] = false
            this.players.push(newPlayer)
            this.sockets.push(socket)
            socket.emit("sendUser", newPlayer.getJSON())

            this.updateState = true
            this.usersChanged = true
            this.newMessages = true
            this.scoreChanged = true
            this.numbersAreaChanged = true
        }
    }

    removePlayer(socket) {
        this.players = this.players.filter(user => user.getID() !== socket.id)
        console.log("user disconnected")
        this.updateState = true
        this.usersChanged = true
        delete this.playersShootCooldown[socket.id]
    }

    addPlayerMovement(pm) {
        this.userMoves.push(pm)
    }

    addMessage(message) {
        this.messagesQueue.push(message)
    }

    getRandomColor() {
        var letters = 'ABCDEF'
        var color = '#'
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 6)];
        }
        return color
    }

    handleMessageQueue() {

        this.messagesQueue.forEach(m => {
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
                number: this.messages.length,
                message: m.message,
                date: Date(),
                color: this.getRandomColor(),
                top: top,
                left: left,
                width: this.messagesWidth,
                height: this.messagesHeight,
            }

            this.messages.push(newMessage)
            this.newMessages = true
            this.updateState = true
        })

        this.messagesQueue = []
    }

    shootBullet(shot, id) {

        var cd = this.playersShootCooldown[id]

        if (!cd) {

            const x = shot[0]
            const y = shot[1]

            const user = this.findPlayerId(id)
            let dirX = x - user.getPosX()
            let dirY = y - user.getPosY()

            const len = Math.sqrt(dirX * dirX + dirY * dirY)

            dirX /= len
            dirY /= len

            const bullet = {
                id: Math.floor(Math.random() * 999999999) + user.id,
                owner: user.getID(),
                posX: user.getPosX(),
                posY: user.getPosY(),
                dirX: dirX,
                dirY: dirY,
                hit: false,
                color: this.getRandomColor(),
            }

            this.bullets.push(bullet)

            this.playersShootCooldown[id] = true
            this.bulletsChanged = true
            this.updateState = true
            setTimeout(() => {
                this.playersShootCooldown[id] = false
            }, 150)
        }
    }

    findPlayerId(id) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].getID() === id) {
                return this.players[i]
            }
        }
        return null
    }

    findPlayerUsername(username) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].getUsername() === username) {
                return this.players[i]
            }
        }
        return null
    }

    handlePlayerMovements() {

        this.userMoves.forEach(pm => {

            let player = this.findPlayerId(pm.id)
            if (!player) return

            player.setPM(pm)
            this.updateState = true
            this.usersChanged = true
        })

        this.userMoves = []


        this.players.forEach(p => {

            if (this.freezeGame) return
            let newPosX = p.getPosX()
            let newPosY = p.getPosY()

            if (p.getUp() && p.getLeft()) {
                newPosX = newPosX - this.moveSpeed2
                newPosY = newPosY - this.moveSpeed2
            }
            else if (p.getUp() && p.getRight()) {
                newPosX = newPosX + this.moveSpeed2
                newPosY = newPosY - this.moveSpeed2
            }
            else if (p.getDown() && p.getLeft()) {
                newPosX = newPosX - this.moveSpeed2
                newPosY = newPosY + this.moveSpeed2
            }
            else if (p.getDown() && p.getRight()) {
                newPosX = newPosX + this.moveSpeed2
                newPosY = newPosY + this.moveSpeed2
            }
            else if (p.getUp()) newPosY = newPosY - this.moveSpeed1
            else if (p.getDown()) newPosY = newPosY + this.moveSpeed1
            else if (p.getLeft()) newPosX = newPosX - this.moveSpeed1
            else if (p.getRight()) newPosX = newPosX + this.moveSpeed1

            if (newPosX > 101) newPosX = newPosX - this.moveSpeed1
            if (newPosX < -1) newPosX = newPosX + this.moveSpeed1
            if (newPosY > 101) newPosY = newPosY - this.moveSpeed1
            if (newPosY < -1) newPosY = newPosY + this.moveSpeed1

            if (this.gunGameInProgress) {
                if (p.getShoot()) {
                    this.shootBullet(p.getShoot(), p.getID())
                }
            }

            p.setShield()
            p.setPosX(newPosX)
            p.setPosY(newPosY)

            this.updateState = true
            this.usersChanged = true

            const x = newPosX
            const y = newPosY
            const width = p.getWidth()
            const height = p.getHeight()

            this.messages.forEach(m => {

                const messageX = m.left
                const messageY = m.top
                const mHeight = this.messagesHeight
                const mWidth = this.messagesWidth

                // fra venstre
                if (x + width >= messageX && x + width <= messageX + 1 && y + height >= messageY && y <= messageY + mHeight) {
                    m.left = m.left + this.moveSpeed1
                    this.newMessages = true
                }
                //fra høyre
                else if (x <= messageX + mWidth && x >= messageX + mWidth - 1 && y + height >= messageY && y <= messageY + mHeight) {
                    m.left = m.left - this.moveSpeed1
                    this.newMessages = true
                }
                //fra top
                else if (x + width >= messageX && x <= messageX + mWidth && y + height >= messageY && y + height <= messageY + 1) {
                    m.top = m.top + this.moveSpeed1
                    this.newMessages = true
                }
                // fra bunn
                else if (x + width >= messageX && x <= messageX + mWidth && y <= messageY + mHeight && y >= messageY + mHeight - 1) {
                    m.top = m.top - this.moveSpeed1
                    this.newMessages = true
                }

            })
        })
    }

    makePillar() {

        const randomNumber1 = Math.floor(Math.random() * 60) + 20

        const newPillar = {
            top: randomNumber1 - 7,
            bottom: randomNumber1 + 7,
            color: this.getRandomColor(),
            posX: 105.0,
        }

        this.pillars.push(newPillar)
    }

    movePillars() {

        this.pillars.forEach(p => { p.posX = p.posX - this.pillarSpeed })
        this.pillars = this.pillars.filter(p => {
            if (p.posX >= -4.0) return true
            else {
                this.scoreChanged = true
                this.currentScore++
                return false
            }
        })
    }

    checkCollissions() {
        let ud = []

        this.players.forEach(p => {

            const x = p.getPosX()
            const y = p.getPosY()
            const width = p.getWidth()
            const height = p.getHeight()

            this.pillars.forEach(pillar => {

                if (x + width >= pillar.posX - 1 && x <= pillar.posX + 1) {
                    if (y <= pillar.top || y + height >= pillar.bottom) {
                        ud.push(p.getUsername())
                    }
                }
            })
        })

        return ud
    }

    checkBulletCollission() {


        this.bullets = this.bullets.filter(b => { return b.hit === false })

        let dead = []
        const e = .2

        this.bullets.forEach(b => {

            const x = b.posX + e
            const y = b.posY + e

            this.messages.forEach(m => {

                const mX = m.left
                const mY = m.top
                const height = this.messagesHeight
                const width = this.messagesWidth
                if (x > mX-e && x < mX + width+e && y > mY-e && y < mY + height+e) {
                    b.hit = true
                    this.bulletsChanged = true
                    this.updateState = true
                }
            })

            this.players.forEach(u => {
                if (u.getID() === b.owner) return

                const pX = u.getPosX()
                const pY = u.getPosY()
                const height = u.getHeight()
                const width = u.getWidth()
                if (x > pX-e && x < pX + width+e && y > pY-e && y < pY + height+e) {
                    dead.push(u.getUsername())
                    b.hit = true
                    u.setHit(true)
                    this.bulletsChanged = true
                    this.updateState = true
                    this.usersChanged = true
                    u.setPosX(93)
                    u.setPosY(85)
                    console.log("hit!")
                }
            })
        })

        return dead
    }

    moveBullets() {

        this.bullets.forEach(b => {
            b.posX = b.posX + b.dirX
            b.posY = b.posY + b.dirY
            this.bulletsChanged = true
        })

        this.bullets = this.bullets.filter(b => {
            return b.posX < 102 && b.posX > -2 && b.posY < 102 && b.posY > -2
        })

        this.updateState = true
    }

    updateNumberAreas() {
        if (!this.gameInProgress && this.updateState) {

            let usersInDeleteArea = 0
            let usersInGameArea = 0
            let usersInGunGameArea = 0

            this.players.forEach(u => {

                const x = u.getPosX()
                const y = u.getPosY()

                if (x < 8 && y > 92 && x > 1 && y < 99) {
                    usersInDeleteArea++
                } else this.startOverDelete = false

                if (x > 92 && y > 92 && x < 99 && y < 99) {
                    usersInGameArea++
                } else this.startOverGame = false

                if (x > 80 && y > 92 && x < 87 && y < 99) {
                    usersInGunGameArea++
                } else this.startOverGunGame = false
            })

            if (usersInDeleteArea > 0 && usersInDeleteArea === this.players.length && !this.startOverDelete) {
                this.messages = []
                this.startOverDelete = true
                this.newMessages = true
            }
            if (usersInGameArea > 0 && usersInGameArea === this.players.length && !this.startOverGame && !this.gameInProgress && !this.countDownStarted) {
                this.countDownStarted = true
                this.startOverGame = true
                const countDown = (count) => {
                    if (count < -1) {
                        this.gameInProgress = true
                        this.progressTickSpeed = 180
                        this.usersDead = []
                        this.countDownStarted = false
                        this.countDownNumber = -2
                        this.makePillar()
                    }
                    else {
                        setTimeout(() => countDown(count - 1), 1000);
                    }
                    this.updateState = true
                    this.countDownNumber = count
                }
                countDown(5)
            }
            if (usersInGunGameArea > 0 && usersInGunGameArea === this.players.length && !this.startOverGunGame && !this.gunGameInProgress && !this.countDownStarted) {
                this.countDownStarted = true
                this.startOverGunGame = true
                const countDown = (count) => {
                    if (count < -1) {
                        this.gunGameInProgress = true
                        this.usersDead = []
                        this.countDownStarted = false
                        this.countDownNumber = -2
                        setTimeout(() => {
                            this.gunGameInProgress = false
                            this.bullets = []
                            this.bulletsChanged = true
                        }, 60000);
                    }
                    else {
                        setTimeout(() => countDown(count - 1), 1000);
                    }
                    this.updateState = true
                    this.countDownNumber = count
                }
                countDown(5)
            }

            if (this.numbersDeleteEvent !== usersInDeleteArea) {
                this.numbersDeleteEvent = usersInDeleteArea
                this.numbersAreaChanged = true
            }
            if (this.numbersGameEvent !== usersInGameArea) {
                this.numbersGameEvent = usersInGameArea
                this.numbersAreaChanged = true
            }
            if (this.numbersGunGameEvent !== usersInGunGameArea) {
                this.numbersGunGameEvent = usersInGunGameArea
                this.numbersAreaChanged = true
            }
        }
    }

    updateGames() {

        if (this.gameInProgress) {
            this.progressTick++
            if (this.progressTick % this.progressTickSpeed === 0) {
                this.makePillar()
                if (this.progressTickSpeed > 110) {
                    this.progressTickSpeed -= 2
                }
            }

            this.movePillars()
            this.usersDead = this.checkCollissions()

            if (this.usersDead.length > 0) {
                this.usersDeadChanged = true
                this.gameInProgress = false
                this.startOver = false
                this.progressTick = 0

                setTimeout(() => {
                    this.usersDead = []
                    this.usersDeadChanged = true
                    this.updateState = true
                }, 5000)

                if (this.currentScore > this.highscore) {
                    this.highscore = this.currentScore
                    this.newHighscore = true
                }

                this.currentScore = 0
                this.scoreChanged = true
                this.freezeGame = true
                this.freezeGameChanged = true

                setTimeout(() => {
                    this.usersDead.forEach(username => {
                        const p = this.findPlayerUsername(username)
                        p.setPosX(93)
                        p.setPosY(85)
                    })
                    this.usersDeadChanged = true
                    this.usersChanged = true
                    this.updateState = true
                    this.pillars = []
                    this.pillarsChanged = true
                }, 2000)

                setTimeout(() => {
                    this.freezeGame = false
                    this.freezeGameChanged = true
                    this.updateState = true
                }, 3500)

                this.usersChanged = true
            }

            this.pillarsChanged = true
            this.updateState = true
        }

        if (this.gunGameInProgress) {
            this.moveBullets()
            const check = this.checkBulletCollission()
            if (check.length > 0) {
                this.usersDeadChanged = true
                this.usersDead = check
                setTimeout(() => {
                    this.usersDead = []
                    this.usersDeadChanged = true
                    this.updateState = true
                }, 5000)
            }
            this.updateState = true
        }
    }

    getMessages() {
        if (this.newMessages) return this.messages
        else return null
    }

    getUsers() {
        if (this.usersChanged) {
            const users = []
            this.players.forEach(p => {
                users.push(p.getJSON())
            })
            return users
        }
        else return null
    }

    getPillars() {
        if (this.pillarsChanged) return this.pillars
        else return null
    }

    emitGameState() {

        if (this.updateState) {

            const gameState = {
                freezeGameChanged: this.freezeGameChanged,
                freezeGame: this.freezeGame,
                newMessages: this.newMessages,
                messages: this.getMessages(),
                usersChanged: this.usersChanged,
                users: this.getUsers(),
                countDown: this.countDownNumber,
                pillarsChanged: this.pillarsChanged,
                pillars: this.getPillars(),
                usersDeadChanged: this.usersDeadChanged,
                deadUsers: this.usersDead,
                scoreChanged: this.scoreChanged,
                highScore: this.highscore,
                currentScore: this.currentScore,
                numbersAreaChanged: this.startOverGame || this.startOverDelete || this.numbersAreaChanged,
                numbersDeleteEvent: [this.numbersDeleteEvent, this.players.length],
                numbersGameEvent: [this.numbersGameEvent, this.players.length],
                numbersGunGameEvent: [this.numbersGunGameEvent, this.players.length],
                bulletsChanged: this.bulletsChanged,
                bullets: this.bullets,
                newHighscore: this.newHighscore,
                gameInProgress: this.gameInProgress,
                gunGameInProgress: this.gunGameInProgress
            }

            this.sockets.forEach(s => {
                s.emit('gameState', gameState)
            })

            this.numbersAreaChanged = false
            this.scoreChanged = false
            this.usersDeadChanged = false
            this.pillarsChanged = false
            this.updateState = false
            this.newMessages = false
            this.freezeGameChanged = false
            this.usersChanged = false
            this.bulletsChanged = false
            this.newHighscore = false
        }
    }
}

module.exports = Game