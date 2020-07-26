class Message {
    constructor(number, message, color, x, y) {
        this.number = number
        this.message = message
        this.date = Date()
        this.color = color
        this.posX = x
        this.posY = y
        this.width = 12
        this.height = 6
    }

    getPosX(){return this.posX}
    getPosY(){return this.posY}
    setPosX(pos){this.posX = pos}
    setPosY(pos){this.posY = pos}
    getWidth(){return this.width}
    getHeight(){return this.height}

    getJSON() {
        return {
            number: this.number,
            message: this.message,
            date: this.date,
            color: this.color,
            posX: this.posX,
            posY: this.posY,
            width: this.width,
            height: this.height,
        }
    }
}

module.exports = Message