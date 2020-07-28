const Player = require("./player")
const Message = require("./message")
const Bullet = require("./bullet")
const Pillar = require("./pillar")

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
        this.usersIdiotboks = []
        this.usersDeadChanged = false
        this.numbersDeleteEvent = 0
        this.numbersGameEvent = 0
        this.numbersGunGameEvent = 0
        this.moveSpeed1 = .3
        this.moveSpeed2 = .15
        this.pillarSpeed = .25
        this.countDownNumber = -2
        this.timer = -1
        this.showIdiotBox = false

        // pillar game
        this.scoreChanged = false
        this.highscore = 0
        this.highScoreUsername = ""
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
        this.scoreBlue = 0
        this.scoreRed = 0
        this.teamWon = ""
        this.teamWonChanged = false
        this.gunScoreChanged = false

        // other state changes
        this.updateState = false
        this.gameInProgressChanged = false
        this.numbersAreaChanged = false
        this.startOverDelete = false
        this.startOverGame = false
        this.startOverGunGame = false
        this.gameInProgress = false
        this.gunGameInProgress = false
        this.countDownStarted = false
        this.timerChanged = false
        this.idiotBoxChanged = false

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
        else if (this.gunGameInProgress || this.gameInProgress) {
            const newUser = { id: "gameInProgress" }
            socket.emit("sendUser", newUser)
        }
        else {
            //this.startGunGame()
            const newPlayer = new Player(
                socket.id,
                player.username,
                50,
                50 + (this.players.length * 2),
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
            this.scoreChanged = true
            this.pillarsChanged = true
            this.freezeGameChanged = true
            this.bulletsChanged = true
            this.gameInProgressChanged = true
            this.idiotBoxChanged = true
        }
    }

    removePlayer(socket) {
        this.players = this.players.filter(user => user.getID() !== socket.id)
        this.updateState = true
        this.usersChanged = true
        delete this.playersShootCooldown[socket.id]
    }

    addPlayerMovement(pm) {
        this.userMoves.push(pm)
    }

    addMessage(message, id) {
        this.messagesQueue.push({ message: message, id: id })
    }

    getRandomColor() {
        var letters = 'ABCDEF'
        var color = '#'
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 6)];
        }
        return color
    }

    getRandomColorAll() {
        var letters = '0123456789ABCDEF'
        var color = '#'
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color
    }

    handleMessageQueue() {

        this.messagesQueue.forEach(m => {

            let y = 0
            let x = 0
            let newMessage = null

            if (this.gunGameInProgress) {
                const p = this.findPlayerId(m.id)
                const px = p.getPosX()
                const py = p.getPosY()
                if (p.getTeam() === "red") {
                    y = py + (p.getHeight() / 2) - 3
                    x = px + (p.getWidth() / 2) - 5
                    newMessage = new Message(
                        this.messages.length,
                        m.message.message,
                        "#FF0000",
                        "black",
                        x,
                        y,
                        3,
                        6,
                        false,
                        10, false)
                }
                else {
                    y = py + (p.getHeight() / 2) - 3
                    x = px + (p.getWidth() / 2) + 2
                    newMessage = new Message(
                        this.messages.length,
                        m.message.message,
                        "#0000FF",
                        "white",
                        x,
                        y,
                        3,
                        6,
                        false,
                        10, false)
                }
            }
            else {
                newMessage = new Message(
                    this.messages.length,
                    m.message.message,
                    this.getRandomColor(),
                    "black",
                    Math.floor(Math.random() * 80) + 4,
                    Math.floor(Math.random() * 75) + 10,
                    12,
                    6,
                    false,
                    14, true)
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

            const newBullet = new Bullet(
                shot,
                this.findPlayerId(id).getJSON(),
                this.getRandomColorAll())

            this.bullets.push(newBullet)

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

            if (!p.checkIfMoving()) return
            if (this.freezeGame) return

            let newPosX = p.getPosX()
            let newPosY = p.getPosY()
            const originalX = newPosX
            const originalY = newPosY

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

            if (newPosX > 99 || newPosX < -2 || newPosY > 99 || newPosY < -2) return

            if (p.getRestricted()) {
                const width = p.getWidth()
                const height = p.getHeight()
                if (newPosX < 84) return
                if (newPosX + width > 99) return
                if (newPosY < 75) return
                if (newPosY + height > 90) return
            }

            if (this.gunGameInProgress) {
                if (p.getShoot()) {
                    this.shootBullet(p.getShoot(), p.getID())
                }
            }

            const x = newPosX
            const y = newPosY
            const width = p.getWidth()
            const height = p.getHeight()
            const hit = []

            this.messages.forEach(m => {

                const messageX = m.getPosX()
                const messageY = m.getPosY()
                const mHeight = m.getHeight()
                const mWidth = m.getWidth()

                let messageMoved = false

                // fra venstre
                if (x + width >= messageX && x + width <= messageX + 1 && y + height >= messageY && y <= messageY + mHeight) {
                    if (m.getSolid()) {
                        hit.push("left")
                    } else {
                        if (!messageMoved) {
                            m.setPosX(messageX + this.moveSpeed1)
                            this.newMessages = true
                            messageMoved = true
                        }
                    }
                }
                //fra høyre
                if (x <= messageX + mWidth && x >= messageX + mWidth - 1 && y + height >= messageY && y <= messageY + mHeight) {
                    if (m.getSolid()) {
                        hit.push("right")
                    } else {
                        if (!messageMoved) {
                            m.setPosX(messageX - this.moveSpeed1)
                            this.newMessages = true
                            messageMoved = true
                        }
                    }
                }
                //fra top
                if (x + width >= messageX && x <= messageX + mWidth && y + height >= messageY && y + height <= messageY + 1) {
                    if (m.getSolid()) {
                        hit.push("top")
                    } else {
                        if (!messageMoved) {
                            m.setPosY(messageY + this.moveSpeed1)
                            this.newMessages = true
                            messageMoved = true
                        }
                    }
                }
                // fra bunn
                if (x + width >= messageX && x <= messageX + mWidth && y <= messageY + mHeight && y >= messageY + mHeight - 1) {
                    if (m.getSolid()) {
                        hit.push("bot")
                    } else {
                        if (!messageMoved) {
                            m.setPosY(messageY - this.moveSpeed1)
                            this.newMessages = true
                            messageMoved = true
                        }
                    }
                }
            })


            if (hit.length > 0) {
                if (originalX !== newPosX && originalY !== newPosY) {
                    if (hit.length === 1) {
                        if (hit[0] === "left") newPosX = newPosX - this.moveSpeed2
                        else if (hit[0] === "right") newPosX = newPosX + this.moveSpeed2
                        else if (hit[0] === "top") newPosY = newPosY - this.moveSpeed2
                        else if (hit[0] === "bot") newPosY = newPosY + this.moveSpeed2
                    }
                    else {
                        if (hit.includes("left")) newPosX = newPosX - this.moveSpeed2
                        if (hit.includes("right")) newPosX = newPosX + this.moveSpeed2
                        if (hit.includes("top")) newPosY = newPosY - this.moveSpeed2
                        if (hit.includes("bot")) newPosY = newPosY + this.moveSpeed2
                    }
                }
                else {
                    if (hit.length === 1) {
                        if (hit[0] === "left") newPosX = newPosX - this.moveSpeed1
                        else if (hit[0] === "right") newPosX = newPosX + this.moveSpeed1
                        else if (hit[0] === "top") newPosY = newPosY - this.moveSpeed1
                        else if (hit[0] === "bot") newPosY = newPosY + this.moveSpeed1
                    }
                    else {
                        if (hit.includes("left")) newPosX = newPosX - this.moveSpeed2
                        if (hit.includes("right")) newPosX = newPosX + this.moveSpeed2
                        if (hit.includes("top")) newPosY = newPosY - this.moveSpeed2
                        if (hit.includes("bot")) newPosY = newPosY + this.moveSpeed2
                    }
                }
            }

            p.setShield()
            p.setPosX(newPosX)
            p.setPosY(newPosY)
            this.updateState = true
            this.usersChanged = true
        })
    }

    makePillar() {
        const newPillar = new Pillar(this.getRandomColor())
        this.pillars.push(newPillar)
    }

    movePillars() {

        this.pillars.forEach(p => p.movePillar(this.pillarSpeed))
        this.pillars = this.pillars.filter(p => {
            if (p.getPosX() >= -4.0) return true
            else {
                this.scoreChanged = true
                this.currentScore++
                return false
            }
        })
    }

    checkCollissions() {

        let ud = []

        this.pillars.forEach(pillar => {

            const px = pillar.getPosX()
            const top = pillar.getTop()
            const bot = pillar.getBottom()
            const pWidth = pillar.getWidth()

            this.players.forEach(p => {

                if (!p.getRestricted()) {

                    const x = p.getPosX()
                    const y = p.getPosY()
                    const width = p.getWidth()
                    const height = p.getHeight()

                    if (x + width >= px - (pWidth / 2) && x <= px + (pWidth / 2)) {
                        if (y <= top || y + height >= bot) {
                            ud.push(p.getUsername())
                            this.usersChanged = true
                        }
                    }
                }
            })

            this.messages.forEach(m => {

                const messageX = m.getPosX()
                const messageY = m.getPosY()
                const mHeight = m.getHeight()
                const mWidth = m.getWidth()

                if (px - (pWidth / 2) <= messageX + mWidth && px + (pWidth / 2) >= messageX + mWidth - 1 && (messageY <= top || (messageY + mHeight) >= bot)) {
                    m.setPosX(messageX - this.pillarSpeed)
                    this.newMessages = true
                }
            })
        })


        return ud
    }

    checkBulletCollission() {


        this.bullets = this.bullets.filter(b => { return b.getExploded() === false })

        let dead = []

        this.bullets.forEach(b => {

            const r = b.getRadius()
            const x = b.getPosX() + r
            const y = b.getPosY() + r

            this.messages.forEach(m => {

                const mX = m.getPosX()
                const mY = m.getPosY()
                const height = m.getHeight()
                const width = m.getWidth()

                if (x > mX - r && x < mX + width + r && y > mY - r && y < mY + height + r) {
                    b.setExploded(true)
                    if (m.getChangable()) {
                        m.setColor(b.getColor())
                        this.newMessages = true
                    }
                    this.bulletsChanged = true
                    this.updateState = true
                }
            })

            this.players.forEach(p => {
                const id = b.getOwner()
                if (p.getID() === id) return
                if (p.getTeam() === this.findPlayerId(id).getTeam()) return

                const pX = p.getPosX()
                const pY = p.getPosY()
                const height = p.getHeight()
                const width = p.getWidth()

                if (x > pX - r && x < pX + width + r && y > pY - r && y < pY + height + r) {
                    dead.push(p.getUsername())
                    b.setExploded(true)
                    p.setHit(true)
                    this.bulletsChanged = true
                    this.updateState = true
                    this.usersChanged = true
                    this.gunScoreChanged = true
                    if (p.getTeam() === "red") {
                        p.setPosX(-200)
                        p.setPosY(50)
                        this.updateState = true
                        this.usersChanged = true
                        setTimeout(() => {
                            this.updateState = true
                            this.usersChanged = true
                            p.setPosX(98 - (p.getWidth() / 2))
                            p.setPosY(85)
                        }, 2000)
                        this.scoreBlue++

                    }
                    else {
                        this.scoreRed++
                        p.setPosX(-200)
                        p.setPosY(50)
                        this.updateState = true
                        this.usersChanged = true
                        setTimeout(() => {
                            this.updateState = true
                            this.usersChanged = true
                            p.setPosX(2 - (p.getWidth() / 2))
                            p.setPosY(85)
                        }, 2000)
                    }

                }
            })
        })

        return dead
    }

    moveBullets() {

        this.bullets.forEach(b => {
            b.moveBullet()
            this.bulletsChanged = true
        })

        this.bullets = this.bullets.filter(b => {
            return b.getPosX() < 102 && b.getPosX() > -2 && b.getPosY() < 102 && b.getPosY() > -2
        })
    }

    updateNumberAreas() {
        if (this.usersChanged) {

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

            if (usersInDeleteArea > 0 && usersInDeleteArea === this.players.length && !this.startOverDelete && !this.gunGameInProgress) {
                this.messages = []
                this.startOverDelete = true
                this.newMessages = true
            }
            if (usersInGameArea > 0 && usersInGameArea === this.players.length && !this.startOverGame && !this.gameInProgress && !this.countDownStarted && !this.gunGameInProgress) {
                this.countDownStarted = true
                this.startOverGame = true
                const countDown = (count) => {
                    if (count < 0) {
                        this.gameInProgress = true
                        this.gameInProgressChanged = true
                        this.progressTickSpeed = 200
                        this.usersDead = []
                        this.usersIdiotboks = []
                        this.countDownStarted = false
                        this.countDownNumber = -1
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
            if (usersInGunGameArea > 0 && usersInGunGameArea === this.players.length && !this.startOverGunGame && !this.gunGameInProgress && !this.gameInProgress && !this.countDownStarted) {
                this.startGunGame()
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

    updatePillarGame() {
        this.progressTick++
        if (this.progressTick % this.progressTickSpeed === 0) {
            this.makePillar()
            if (this.progressTickSpeed > 120) {
                this.progressTickSpeed -= 2
            }
        }

        this.pillarsChanged = true
        this.updateState = true

        this.movePillars()
        const check = this.checkCollissions()

        if (check.length > 0 || this.players.length === 0) {

            check.forEach(username => {
                const p = this.findPlayerUsername(username)
                this.usersIdiotboks.push(p)
                p.setRestricted(true)
            })

            this.showIdiotBox = true
            this.idiotBoxChanged = true


            if (this.players.length === this.usersIdiotboks.length || this.players.length === 0) {

                this.freezeGame = true
                this.updateState = true
                this.freezeGameChanged = true

                if (this.currentScore > this.highscore) {
                    this.highscore = this.currentScore
                    this.highScoreUsername = check[0]
                    this.newHighscore = true
                    this.scoreChanged = true
                }

                setTimeout(() => {

                    this.updateState = true
                    this.usersChanged = true
                    this.showIdiotBox = false
                    this.idiotBoxChanged = true
                    this.usersIdiotboks.forEach(p => {
                        p.setRestricted(false)
                    })
                }, 4000)

                setTimeout(() => {

                    this.gameInProgress = false
                    this.gameInProgressChanged = true
                    this.startOver = false
                    this.progressTick = 0
                    this.scoreChanged = true
                    this.freezeGame = true
                    this.updateState = true
                    this.freezeGameChanged = true
                    this.currentScore = 0
                    check.forEach(username => {
                        const p = this.findPlayerUsername(username)
                        if (!p) return
                        p.setPosX(91.5 - (p.getWidth() / 2))
                        p.setPosY(82.5 + this.usersIdiotboks.length - (p.getHeight() / 2))
                    })
                    this.freezeGame = false
                    this.freezeGameChanged = true
                    this.usersChanged = true
                    this.updateState = true
                    this.pillars = []
                    this.pillarsChanged = true
                }, 2000)
            }
            else {

                this.freezeGame = true
                this.freezeGameChanged = true

                setTimeout(() => {
                    check.forEach(username => {
                        const p = this.findPlayerUsername(username)
                        p.setRestricted(true)
                        p.setPosX(91.5 - (p.getWidth() / 2))
                        p.setPosY(82.5 + this.usersIdiotboks.length - (p.getHeight() / 2))
                    })
                    this.usersChanged = true
                    this.updateState = true
                }, 1500)

                setTimeout(() => {
                    this.freezeGame = false
                    this.freezeGameChanged = true
                    this.updateState = true
                }, 3000)
            }
            this.usersChanged = true
        }
    }

    placeWallsMap1() {

        // team blue
        this.messages.push(new Message(this.messages.length, "", "#0000FF", "black", 5, 60, 10, 40, true, 10, false))
        this.messages.push(new Message(this.messages.length, "", "#0000FF", "black", 13, 39, 2, 10, true, 10, false))
        this.messages.push(new Message(this.messages.length, "", "#0000FF", "black", 5, 38, 10, 2, true, 10, false))

        //team red
        this.messages.push(new Message(this.messages.length, "", "#FF0000", "black", 85, 60, 10, 40, true, 10, false))
        this.messages.push(new Message(this.messages.length, "", "#FF0000", "black", 85, 39, 2, 10, true, 10, false))
        this.messages.push(new Message(this.messages.length, "", "#FF0000", "black", 85, 38, 10, 2, true, 10, false))

        // middle stuff
        const c = "#010004"
        this.messages.push(new Message(this.messages.length, "", c, "black", 47, 33, 6, 37, true, 10, false))
        this.messages.push(new Message(this.messages.length, "", c, "black", 30, 78, 40, 6, true, 10, false))
        this.messages.push(new Message(this.messages.length, "", c, "black", 30, 19, 40, 6, true, 10, false))
        this.messages.push(new Message(this.messages.length, "", c, "black", 60, 33, 10, 20, true, 10, true))
        this.messages.push(new Message(this.messages.length, "", c, "black", 30, 50, 10, 20, true, 10, true))
        this.messages.push(new Message(this.messages.length, "", c, "black", 52, 62, 18, 8, true, 10, false))
        this.messages.push(new Message(this.messages.length, "", c, "black", 30, 33, 18, 8, true, 10, false))

        this.newMessages = true
        this.updateState = true
    }

    minimizePlayer(p, targetWidth, targetHeight, currentWidth, currentHeight) {

        this.usersChanged = true
        this.updateState = true

        if (currentWidth < targetWidth){
            p.setWidth(targetWidth)
            p.setHeight(targetHeight)
        }
        else {
            p.setWidth(currentWidth)
            p.setHeight(currentHeight)
            setTimeout(() => {this.minimizePlayer(p, targetWidth, targetHeight, currentWidth-0.02, currentHeight-0.025)}, 1000 / 60)
        }
        
    }

    startGunGame() {
        this.countDownStarted = true
        this.startOverGunGame = true

        const countDown = (count) => {
            // spillet begynner
            if (count < 0) {

                this.gunGameInProgress = true
                this.gameInProgressChanged = true
                this.updateState = true
                this.freezeGame = true
                this.freezeGameChanged = true

                setTimeout(() => {

                    this.usersDead = []
                    this.countDownStarted = false
                    this.countDownNumber = -1
                    this.timer = 120
                    this.usersIdiotboks = []
                    this.updateState = true
                    this.usersChanged = true
                    this.scoreBlue = 0
                    this.scoreRed = 0
                    this.gunScoreChanged = true
                    this.moveSpeed1 = .2
                    this.moveSpeed2 = .1

                    this.messages = []
                    this.placeWallsMap1()

                    let decideTeam = 0
                    this.players.forEach(p => {
                        decideTeam++
                        if (decideTeam % 2 === 0) {
                            // team blue
                            p.setColor("#0000FF")
                            p.setTeam("blue")
                            p.setPosX(1 + (p.getWidth() / 2))
                            p.setPosY(48 + decideTeam)
                        }
                        else {
                            // team red
                            p.setColor("#FF0000")
                            p.setTeam("red")
                            p.setPosX(97 - (p.getWidth() / 2))
                            p.setPosY(48 + decideTeam)
                        }
                        setTimeout(() => {
                            this.minimizePlayer(p, p.getWidth() / 1.5, p.getHeight() / 1.5, p.getWidth(), p.getHeight())
                        }, 1000)
                        
                    })

                    setTimeout(() => {
                        this.freezeGame = false
                        this.freezeGameChanged = true
                    }, 2500)

                    setTimeout(() => {
                        // spillet er ferdig
                        this.moveSpeed1 = .3
                        this.moveSpeed2 = .15
                        this.gunGameInProgress = false
                        this.gameInProgressChanged = true
                        this.bullets = []
                        this.bulletsChanged = true
                        this.timer = -1
                        this.timerChanged = true
                        this.updateState = true
                        this.usersChanged = true
                        this.messages = []
                        this.newMessages = true

                        this.players.forEach(p => {
                            p.setHeight(4.5)
                            p.setWidth(3.5)
                            p.setColor(p.getOriginalColor())
                        })

                        if (this.scoreRed > this.scoreBlue) this.teamWon = "Red"
                        else if (this.scoreRed < this.scoreBlue) this.teamWon = "Blue"
                        else this.teamWon = "Draw"
                        this.teamWonChanged = true

                    }, 120000)

                    const setTimer = (t) => {
                        if (t > -1) {
                            this.timer = t
                            this.timerChanged = true
                            setTimeout(() => setTimer(t - 1), 1000);
                        }
                        else this.timerChanged = true
                    }
                    setTimer(this.timer)
                }, 1000)
            }
            //tell ned
            else {
                setTimeout(() => countDown(count - 1), 1000);
            }
            this.updateState = true
            this.countDownNumber = count
        }
        countDown(3)
    }

    updateGunGame() {
        this.moveBullets()
        const check = this.checkBulletCollission()
        this.updateState = true
    }

    updateGames() {

        if (this.gameInProgress && !this.freezeGame) {
            this.updatePillarGame()
        }

        if (this.gunGameInProgress && !this.freezeGame) {
            this.updateGunGame()
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

    getBullets() {
        if (this.bulletsChanged) {
            const bs = []
            this.bullets.forEach(b => {
                bs.push(b.getJSON())
            })
            return bs
        }
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
                highScoreUsername: this.highScoreUsername,
                currentScore: this.currentScore,
                numbersAreaChanged: this.startOverGame || this.startOverDelete || this.numbersAreaChanged,
                numbersDeleteEvent: [this.numbersDeleteEvent, this.players.length],
                numbersGameEvent: [this.numbersGameEvent, this.players.length],
                numbersGunGameEvent: [this.numbersGunGameEvent, this.players.length],
                bulletsChanged: this.bulletsChanged,
                bullets: this.getBullets(),
                newHighscore: this.newHighscore,
                gameInProgressChanged: this.gameInProgressChanged,
                gameInProgress: this.gameInProgress,
                gunGameInProgress: this.gunGameInProgress,
                timerChanged: this.timerChanged,
                timer: this.timer,
                idiotBoxChanged: this.idiotBoxChanged,
                showIdiotBox: this.showIdiotBox,
                teamWon: this.teamWon,
                teamWonChanged: this.teamWonChanged,
                gunScoreChanged: this.gunScoreChanged,
                scoreRed: this.scoreRed,
                scoreBlue: this.scoreBlue,
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
            this.gameInProgressChanged = false
            this.idiotBoxChanged = false
            this.teamWonChanged = false
            this.gunScoreChanged = false
        }
    }
}

module.exports = Game