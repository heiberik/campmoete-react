class Game {
    constructor() {
        this.messages = []
        this.newMessages = false
        this.users = []
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
        this.numbersAreaChanged = false
        this.updateState = false
        this.startOverDelete = false
        this.startOverGame = false
        this.startOverGunGame = false
        this.gameInProgress = false
        this.gunGameInProgress = false
        this.countDownStarted = false
        this.countDownNumber = -2

        setInterval(() => {

            this.updateGames()
            this.handleMessageQueue()
            this.handlePlayerMovements()
            this.updateNumberAreas()
            this.emitGameState()
    
        }, 1000 / 60);
    }


    addPlayer(player, socket){

        const check = this.users.filter(u => u.username.toLowerCase() === player.username.toLowerCase())
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
                username: player.username,
                playerPosX: 85,
                playerPosY: 85 + (this.users.length * 2),
                color: this.getRandomColor(),
                hit: false,
                shield: false,

                up: false,
                down: false,
                left: false,
                right: false,
                space: false,
                shoot: null,
            }

            this.playersShootCooldown[socket.id] = false
            this.users.push(newUser)
            this.sockets.push(socket)
            socket.emit("sendUser", newUser)

            this.updateState = true
            this.usersChanged = true
            this.newMessages = true
            this.scoreChanged = true
            this.numbersAreaChanged = true
        }
    }

    removePlayer(socket){
        this.users = this.users.filter(user => user.id !== socket.id)
        console.log("user disconnected")
        this.updateState = true
        this.usersChanged = true
        delete this.playersShootCooldown[socket.id]
    }

    addPlayerMovement(pm){
        this.userMoves.push(pm)
    }

    addMessage(message){
        this.messagesQueue.push(message)
    }

    getRandomColor(){
        var letters = 'ABCDEF'
        var color = '#'
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 6)];
        }
        return color
    }

    handleMessageQueue(){

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
                left: left
            }

            this.messages.push(newMessage)
            this.newMessages = true
            this.updateState = true
        })

        this.messagesQueue = []
    }

    shootBullet(shot, id){

        var cd = this.playersShootCooldown[id]

        if (!cd) {

            const x = shot[0]
            const y = shot[1]

            const user = this.findPlayerId(id)
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

    findPlayerId(id){
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id === id) {
                return this.users[i]
            }
        }
        return null
    }

    findPlayerUsername(username){
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].username === username) {
                return this.users[i]
            }
        }
        return null
    }

    handlePlayerMovements(){

        let shieldChanged = false
        this.userMoves.forEach(pm => {

            let user = this.findPlayerId(pm.id)
            if (!user) return

            if (pm.space !== user.shield) shieldChanged = true
            user.up = pm.up
            user.down = pm.down
            user.left = pm.left
            user.right = pm.right
            user.space = pm.space
            user.shoot = pm.shoot
        })

        if (this.userMoves.length > 0) {
            this.updateState = true
            this.usersChanged = true
        }
        this.userMoves = []

        if (!shieldChanged) {
            let noMovement = true
            this.users.forEach(u => {
                if (u.up || u.down || u.left || u.right || u.space || u.up || u.shoot) {
                    noMovement = false
                }
            })
            if (noMovement) return
        }

        this.users.forEach(user => {

            if (this.freezeGame) return
            let newPosX = user.playerPosX
            let newPosY = user.playerPosY

            if (user.up && user.left) {
                newPosX = newPosX - this.moveSpeed2
                newPosY = newPosY - this.moveSpeed2
            }
            else if (user.up && user.right) {
                newPosX = newPosX + this.moveSpeed2
                newPosY = newPosY - this.moveSpeed2
            }
            else if (user.down && user.left) {
                newPosX = newPosX - this.moveSpeed2
                newPosY = newPosY + this.moveSpeed2
            }
            else if (user.down && user.right) {
                newPosX = newPosX + this.moveSpeed2
                newPosY = newPosY + this.moveSpeed2
            }
            else if (user.up) newPosY = newPosY - this.moveSpeed1
            else if (user.down) newPosY = newPosY + this.moveSpeed1
            else if (user.left) newPosX = newPosX - this.moveSpeed1
            else if (user.right) newPosX = newPosX + this.moveSpeed1

            if (newPosX > 101) newPosX = newPosX - this.moveSpeed1
            if (newPosX < -1) newPosX = newPosX + this.moveSpeed1
            if (newPosY > 101) newPosY = newPosY - this.moveSpeed1
            if (newPosY < -1) newPosY = newPosY + this.moveSpeed1

            if (this.gunGameInProgress) {
                if (user.shoot) {
                    this.shootBullet(user.shoot, user.id)
                }
            }

            user.shield = user.space
            user.playerPosX = newPosX
            user.playerPosY = newPosY

            this.updateState = true
            this.usersChanged = true

            this.messages.forEach(m => {

                const messageX = m.left
                const messageY = m.top
                const x = newPosX
                const y = newPosY

                if (x >= messageX - 2.0 && x <= messageX - 1.5 && y >= messageY - 2.5 && y <= messageY + 7.75) {
                    m.left = m.left + this.moveSpeed1
                    this.newMessages = true
                }
                else if (x <= messageX + 12.75 && x >= messageX + 12.25 && y >= messageY - 2.5 && y <= messageY + 7.75) {
                    m.left = m.left - this.moveSpeed1
                    this.newMessages = true
                }
                else if (x >= messageX - 2 && x <= messageX + 12.75 && y >= messageY - 2.75 && y <= messageY - 2.25) {
                    m.top = m.top + this.moveSpeed1
                    this.newMessages = true
                }
                else if (x >= messageX - 2 && x <= messageX + 12.75 && y >= messageY + 7.25 && y <= messageY + 7.75) {
                    m.top = m.top - this.moveSpeed1
                    this.newMessages = true
                }

            })
        })
    }

    makePillar(){

        const randomNumber1 = Math.floor(Math.random() * 60) + 20

        const newPillar = {
            top: randomNumber1 - 7,
            bottom: randomNumber1 + 7,
            color: this.getRandomColor(),
            posX: 105.0,
        }

        this.pillars.push(newPillar)
    }

    movePillars(){

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

    checkCollissions(){
        let ud = []

        this.users.forEach(u => {

            const x = u.playerPosX
            const y = u.playerPosY

            this.pillars.forEach(p => {
                if (p.posX >= x - 2.8 && p.posX <= x + 2.8) {
                    if (y >= p.bottom - 2.8 || y <= p.top + 1.9) {
                        ud.push(u.username)
                    }
                }
            })
        })

        return ud
    }

    checkBulletCollission(){

        this.bullets = this.bullets.filter(b => { return b.hit === false })

        let dead = []
        this.bullets.forEach(b => {

            const x = b.posX
            const y = b.posY

            this.messages.forEach(m => {

                const px = m.left
                const py = m.top

                if (x < px + 11.5 && x > px - 0.5 && y < py + 5.5 && y > py - 0.5) {
                    b.hit = true
                    this.bulletsChanged = true
                    this.updateState = true
                }
            })

            this.users.forEach(u => {
                if (u.id === b.owner) return

                const px = u.playerPosX
                const py = u.playerPosY

                if (x < px + 2 && x > px - 2 && y < py + 2 && y > py - 2) {
                    dead.push(u.username)
                    b.hit = true
                    u.hit = true
                    this.bulletsChanged = true
                    this.updateState = true
                    this.usersChanged = true
                    u.playerPosX = 93
                    u.playerPosY = 85
                }
            })
        })
        return dead
    }

    moveBullets(){

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

    updateNumberAreas(){
        if (!this.gameInProgress && this.updateState) {

            let usersInDeleteArea = 0
            let usersInGameArea = 0
            let usersInGunGameArea = 0

            this.users.forEach(u => {
                if (u.playerPosX < 8 && u.playerPosY > 92 && u.playerPosX > 1 && u.playerPosY < 99) {
                    usersInDeleteArea++
                } else this.startOverDelete = false

                if (u.playerPosX > 92 && u.playerPosY > 92 && u.playerPosX < 99 && u.playerPosY < 99) {
                    usersInGameArea++
                } else this.startOverGame = false

                if (u.playerPosX > 80 && u.playerPosY > 92 && u.playerPosX < 87 && u.playerPosY < 99) {
                    usersInGunGameArea++
                } else this.startOverGunGame = false
            })

            if (usersInDeleteArea > 0 && usersInDeleteArea === this.users.length && !this.startOverDelete) {
                this.messages = []
                this.startOverDelete = true
                this.newMessages = true
            }
            if (usersInGameArea > 0 && usersInGameArea === this.users.length && !this.startOverGame && !this.gameInProgress && !this.countDownStarted) {
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
            if (usersInGunGameArea > 0 && usersInGunGameArea === this.users.length && !this.startOverGunGame && !this.gunGameInProgress && !this.countDownStarted) {
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

    updateGames(){

        if (this.gameInProgress) {
            this.progressTick++
            if (this.progressTick % this.progressTickSpeed === 0) {
                this.makePillar()
                if (this.progressTickSpeed > 130) {
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
                    this.usersDead.forEach(u => {
                        const user = this.findPlayerUsername(u)
                        user.playerPosX = 93
                        user.playerPosY = 85
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

    getMessages(){
        if (this.newMessages) return this.messages
        else return null
    }

    getUsers(){
        if (this.usersChanged) return this.users
        else return null
    }

    getPillars(){
        if (this.pillarsChanged) return this.pillars
        else return null
    }

    emitGameState(){

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
                numbersDeleteEvent: [this.numbersDeleteEvent, this.users.length],
                numbersGameEvent: [this.numbersGameEvent, this.users.length],
                numbersGunGameEvent: [this.numbersGunGameEvent, this.users.length],
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