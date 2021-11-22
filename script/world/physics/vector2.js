
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;

        this.setX = this.setX.bind(this);
        this.setY = this.setY.bind(this);
    }

    setX(newX) {
        this.x = newX;
    }

    setY(newY) {
        this.y = newY;
    }
}

module.exports = Vector2;