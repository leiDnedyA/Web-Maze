
class Vector2{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;

        this.setX = this.setX.bind(this);
        this.setY = this.setY.bind(this);
        this.stringify = this.stringify.bind(this);
    }

    setX(x){
        this.x = x;
    }

    setY(y){
        this.y = y;
    }

    stringify(){
        return `(${this.x}, ${this.y})`;
    }
}