const Vector2 = require('./vector2.js')

class PhysicsObject {
    constructor(position) {
        if (!(position instanceof Vector2)) {
            console.log('WARNING: position must be an instance of Vector2');
        }
        this.position = position;
        this.velocity = new Vector2();
        this.acceleration = new Vector2();
        this.mass = 1;

        this.update = this.update.bind(this);
    }

    update(deltaTime){
        
    }
}

module.exports = PhysicsObject;