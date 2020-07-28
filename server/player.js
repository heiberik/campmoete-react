class Player {

    constructor(socketID, username, posX, posY, color) {
        this.socketID = socketID
        this.username = username
        this.playerPosX = posX
        this.playerPosY = posY
        this.playerWidth = 3.5
        this.playerHeight = 4.5
        this.color = color
        this.originalColor = color
        this.hit = false
        this.shield = false
        this.up = false
        this.down = false
        this.latency = 0
        this.left = false
        this.right = false
        this.space = false
        this.shoot = null
        this.points = 0
        this.restricted = false
        this.team = ""
    }

    setLatency(l){this.latency = l}
    setTeam(t){this.team = t}
    getTeam(){return this.team}
    getOriginalColor(){return this.originalColor}
    setColor(c){this.color = c}
    setRestricted(r){this.restricted = r}
    getRestricted(){return this.restricted}
    getPoints() { return this.points }
    setPoints(p) { this.points = p }
    getHeight() { return this.playerHeight }
    getWidth() { return this.playerWidth }
    setHeight(h) {this.playerHeight = h}
    setWidth(w){this.playerWidth = w}
    getShield() { return this.shield }
    getUp() { return this.up }
    getDown() { return this.down }
    getLeft() { return this.left }
    getRight() { return this.right }
    getSpace() { return this.space }
    getShoot() { return this.shoot }
    getID() { return this.socketID }
    getUsername() { return this.username }
    getPosX() { return this.playerPosX }
    getPosY() { return this.playerPosY }
    setPosX(pos) { this.playerPosX = pos }
    setPosY(pos) { this.playerPosY = pos }
    setHit(hit) { this.hit = hit }
    setShield() { this.shield = this.space }
    getHit() { return this.hit }

    checkIfMoving() {
        return this.up || this.shield || this.down || this.left || this.right || this.shoot || this.space
    }

    setPM(pm) {
        this.up = pm.up
        this.down = pm.down
        this.left = pm.left
        this.right = pm.right
        this.space = pm.space
        this.shoot = pm.shoot
    }

    getPM() {
        return {
            up: this.up,
            down: this.down,
            left: this.left,
            right: this.right,
            space: this.space,
            shoot: this.shoot,
        }
    }

    getJSON() {
        return {
            socketID: this.socketID,
            username: this.username,
            playerPosX: this.playerPosX,
            playerPosY: this.playerPosY,
            playerWidth: this.playerWidth,
            playerHeight: this.playerHeight,
            color: this.color,
            hit: this.hit,
            shield: this.space,
            latency: this.latency,
        }
    }
}

module.exports = Player