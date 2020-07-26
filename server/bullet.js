const Player = require("./player")

class Bullet {

    constructor(shot, user, color) {

        const x = shot[0]
        const y = shot[1]

        let dirX = x - user.playerPosX
        let dirY = y - user.playerPosY
        const len = Math.sqrt(dirX * dirX + dirY * dirY)

        dirX /= len
        dirY /= len

        this.id = Math.floor(Math.random() * 999999999) + user.socketID
        this.owner = user.socketID
        this.color = color
        this.posX = user.playerPosX
        this.posY = user.playerPosY
        this.dirX = dirX
        this.dirY = dirY
        this.radius = .25
        this.exploded = false
    }

    getOwner(){return this.owner}
    getExploded(){return this.exploded}
    setExploded(e){this.exploded = e}
    getPosX() { return this.posX }
    getPosY() { return this.posY }
    setPosX(pos) { this.posX = pos }
    setPosY(pos) { this.posY = pos }
    getWidth() { return this.width }
    getHeight() { return this.height }
    getRadius(){return this.radius}

    moveBullet(){
        this.posX = this.posX + this.dirX
        this.posY = this.posY + this.dirY
    }

    getJSON() {
        return {
            id: this.id,
            color: this.color,
            posX: this.posX,
            posY: this.posY,
            width: this.radius * 2
        }
    }
}

module.exports = Bullet