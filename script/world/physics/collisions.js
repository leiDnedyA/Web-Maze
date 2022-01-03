const pointInPolygon = require('point-in-polygon');

const tileIsWall = {
    1: false,
    2: true,
    5: false
}

class CollisionDetector {
    constructor(roomList){

        this.rooms = roomList;

        this.checkCollision = this.checkCollision.bind(this);
        this.solveCollision = this.solveCollision.bind(this);
        this.checkWalkableTile = this.checkWalkableTile.bind(this);
        this.getTileFromMap = this.getTileFromMap.bind(this);
    }

    checkCollision(entity, potentialPos){
        //UNUSED METHOD
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

    /**
     * Checks collision at certain tile
     * 
     * @param {Object} tileMap tileMap object
     * @param {Number[]} pos position should be in format [x, y] 
     * @returns {result: boolean, corner: string[]} result => true: collision occured, false: collision did not occur
     */
    checkWalkableTile(tileMap, pos){

        /**
         * give represents the 'wiggle room' given to the entity to solve 
         * the problem of hallways being impossible to go down
         */
        let give = .07;

        let floorGive = num=>(Math.floor(num+give))
        let ceilGive = num=>(Math.ceil(num-give));

        //tile positions at every corner of pos
        let corners = {
            top: {
                left: [floorGive(pos[0]), floorGive(pos[1])],
                right: [ceilGive(pos[0]), floorGive(pos[1])]
            },
            bottom: {
                left: [floorGive(pos[0]), ceilGive(pos[1])],
                right: [ceilGive(pos[0]), ceilGive(pos[1])]
            }
        }

        for(let i in corners){
            for(let j in corners[i]){
                let result = false;
                let tileID = this.getTileFromMap(tileMap, corners[i][j]);
                if(tileIsWall.hasOwnProperty(tileID)){
                    result = tileIsWall[tileID];
                    if(result){
                        return {result: true, corner: [i, j]};
                    }
                }
            }
        }

        return {result: false};
    }

    /**
     * Gets a numerical tile from a tile map at a specified position.
     * 
     * @param {Object} tileMap 
     * @param {Number[]} pos [x, y]
     * @returns {Number} ID of the tile at the position 
     */
    getTileFromMap(tileMap, pos){
        let roundedPos = [Math.floor(pos[0]), Math.floor(pos[1])];

        return tileMap.tiles[(tileMap.cols * roundedPos[1]) + roundedPos[0]];
    }

    solveCollision(entity, potentialPos, currentPos){
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

        //checking for clipping
        let clippingCheck = this.checkWalkableTile(room.tileMap, [currentPos.x, currentPos.y]);
        if(clippingCheck.result){
            //set y pos
            if(clippingCheck.corner[0] == "top"){
                result.position.y = Math.ceil(currentPos.y);
            }else if(clippingCheck.corner[0] == "botton"){
                result.position.y = Math.floor(currentPos.y);
            }
            //set x pos
            if (clippingCheck.corner[1] == "left") {
                result.position.x = Math.ceil(currentPos.x);
            } else if (clippingCheck.corner[1] == "right") {
                result.position.x = Math.floor(currentPos.x);
            }

            result.collisionOccured = {x: true, y: true};
            return result;

        }

        //checking tile-based collision
        if(this.checkWalkableTile(room.tileMap, [potentialPos.x, currentPos.y]).result){
            result.position.x = currentPos.x;
            result.collisionOccured.x = true;
        }

        if(this.checkWalkableTile(room.tileMap, [currentPos.x, potentialPos.y]).result){
            result.position.y = currentPos.y;
            result.collisionOccured.y = true;
        }

        //checking room bound-based collisions
        if(potentialPos.x < room.bounds[0][0]){
            result.position.x = room.bounds[0][0];
            result.collisionOccured.x = true;
        } else if (potentialPos.x > room.bounds[2][0]){
            result.position.x = room.bounds[2][0];
            result.collisionOccured.x = true;
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