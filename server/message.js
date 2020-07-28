class Message {
    constructor(number, message, color, colorText, x, y, w, h, solid, fontSize, changable) {
        this.number = number
        this.message = message
        this.date = Date()
        this.color = color
        this.colorText = colorText
        this.posX = x
        this.posY = y
        this.width = w
        this.height = h
        this.solid = solid
        this.fontSize = fontSize
        this.changable = changable
    }

    getChangable(){return this.changable}
    getColor(){return this.color}
    setColor(c){this.color = c}
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
            colorText: this.colorText,
            posX: this.posX,
            posY: this.posY,
            width: this.width,
            height: this.height,
            fontSize: this.fontSize,
        }
    }
}

module.exports = Message