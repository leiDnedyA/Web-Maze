
const Room = require('./room.js');

const tileDict = {'floor': 1, 'wall': 2, 'door': 5};
const tsize = 16;

/**
 * Gets the index of coordinates on a tileGrid.
 * 
 * @param {number[]} coords Coordinates
 * @param {number[]} dimensions Width and height of grid
 * @returns {number} index
 */
const coordsToIndex = (coords, dimensions)=>{
    
    return coords[1] * dimensions[1] + coords[0];
}

function range(start, end) {
    return [...Array(end - start+1).keys()].map(i => i + start);
}

/**
 * Decides whether to insert a wall or a floor based on a point's Moore Neighborhood
 * 
 * @param {number[]} coords 
 * @param {Array<number>} noiseMap 
 * @param {number} width 
 * @param {number} height 
 * @returns {boolean} true = wall, false = floor
 */
const countNeighborhoodWalls = (coords, noiseMap, width, height)=>{
    let wallCount = 0;
    let xRange = range(coords[0] - 1, coords[0] + 1);
    let yRange = range(coords[1] - 1, coords[1] + 1);

    for(let i in xRange){
        for(let j in yRange){
            let tempCoords = [xRange[i], yRange[j]];
            // console.log(`Coords: ${coords[0]}, ${coords[1]}`);
            // console.log(`tempCoords: ${tempCoords[0]}, ${tempCoords[1]}`);
            if (tempCoords[0] == coords[0] && tempCoords[1] == coords[1]){

                // console.log('match')
            }else{

                if(noiseMap[coordsToIndex(tempCoords, [width, height])] == 1 || tempCoords[0] < 0 || tempCoords[1] < 0 || tempCoords[0] > width || tempCoords[1] > height){
                    wallCount++;
                }
            }
        }
    }
    // console.log(wallCount);
    if(wallCount > 4){
        return true;
    }

}

/**
 * 
 * Randomly generates a room.
 * 
 * @param {string} name name of room
 * @param {number} width width of room
 * @param {number} height height of room
 * @param {{roomname: position, roomname: poistion}} startDoor door that leads from previous room to this room
 * @param {Array<{roomname: position, roomname: poistion}>} otherDoors doors that lead from this room to other rooms
 * @returns {Room} generated room
 */
const generateRoom = (name, width, height, startDoor, otherDoors)=>{

    let doorList = [startDoor, ...otherDoors];

    // console.log(doorList)

    //generates a noise map
    let noiseMap = [];    
    for(let i = 0; i < width * height; i++){
        if (Math.random() >= .45){
            noiseMap.push(0);
        }else{
            noiseMap.push(1);
        }
    }

    // console.log(noiseMap)

    //sets tile based on Moore Neighborhood
    let tileMap = [];
    for(let i = 0; i < width; i++){
        for(let j = 0; j < height; j++){
            if(countNeighborhoodWalls([i, j], noiseMap, width, height)){
                tileMap.push(tileDict.wall);
            }else{
                tileMap.push(tileDict.floor);
            }
        }
    }

    for(let i in doorList){
        if(doorList[i].hasOwnProperty(name)){
            tileMap[coordsToIndex([doorList[i][name][0], doorList[i][name][1]], [width, height])] = tileDict.door;
        }
    }

    let startDoorPos = [0, 0]

    // console.log(doorList)

    return new Room(name, startDoorPos, { rows: width, cols: height, tsize: tsize, tiles: tileMap }, doorList);
}

module.exports = generateRoom;