
class CollisionDetector {
    constructor(){

        this.checkCollision = this.checkCollision.bind(this);
    }

    checkCollision(entity){
        if (entity.hasOwnProperty('charController')) {

        } else {
            //do stuff ignoring char controller
        }
        return true;
    }
}

module.exports = CollisionDetector;