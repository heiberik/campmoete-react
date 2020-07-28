class Pillar {

    constructor(color) {

        const randomNumber1 = Math.floor(Math.random() * 60) + 20

        this.top = randomNumber1 - 7
        this.bottom = randomNumber1 + 7
        this.color = color
        this.posX = 115.0
        this.width = 2
    }


    getPosX() { return this.posX }
    setPosX(pos) { this.posX = pos }
    getWidth() { return this.width }
    getTop(){return this.top}
    getBottom(){return this.bottom}

    movePillar(pillarSpeed) {
        this.posX = this.posX - pillarSpeed
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

module.exports = Pillar