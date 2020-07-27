class Message {
    constructor(number, message, color, x, y, w, h, solid, fontSize) {
        this.number = number
        this.message = message
        this.date = Date()
        this.color = color
        this.posX = x
        this.posY = y
        this.width = w
        this.height = h
        this.solid = solid
        this.fontSize = fontSize
    }

    getSolid(){return this.solid}
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
            fontSize: this.fontSize,
        }
    }
}

module.exports = Message