const pointInPolygon = require('point-in-polygon');

class CollisionDetector {
    constructor(roomList){

        this.rooms = roomList;

        this.checkCollision = this.checkCollision.bind(this);
        this.solveCollision = this.solveCollision.bind(this);
    }

    checkCollision(entity, potentialPos){
        if(entity.room){
            if(this.rooms.hasOwnProperty(entity.room)){
                if(pointInPolygon([potentialPos.x, potentialPos.y], this.rooms[entity.room].bounds)){
                    return true;
                }else{
                    return false;
                }
            }else{
                console.log(`WARNING: ENTITY ${entity.name} HAS BEEN ASSIGNED A ROOM (${entity.room}) THAT DOESN'T EXIST`);
            }
        }
        return true;
    }

    solveCollision(entity, potentialPos){
        let result = {
            position: {
                x: potentialPos.x,
                y: potentialPos.y
            },
            collisionOccured: {
                x: false,
                y: false
            }
        }

        let room = this.rooms[entity.room];

        if(potentialPos.x < room.bounds[0][0]){
            result.position.x = room.bounds[0][0];
            result.collisionOccured.x = true;
        } else if (potentialPos.x > room.bounds[2][0]){
            result.position.x = room.bounds[2][0];
            result.collisionOccured.x = true;
        }else{
            //don't change anything
        }

        if(potentialPos.y < room.bounds[0][1]){
            result.position.y = room.bounds[0][1];
            result.collisionOccured.y = true;
        } else if (potentialPos.y > room.bounds[2][1]){
            result.position.y = room.bounds[2][1];
            result.collisionOccured.y = true;
        }

        return result
    }
}

module.exports = CollisionDetector;