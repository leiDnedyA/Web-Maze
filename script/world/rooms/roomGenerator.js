
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
 * @param {string} doorDestination destination of door in room
 * @param {string[]} otherDoorDestinations list of destinations for other doors
 * @returns {Room} generated room
 */
const generateRoom = (name, width, height, startDoorDestination, otherDoorDestinations)=>{

    let doorList = [];

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

    for(let i in otherDoorDestinations){
        let randomLocation = [Math.floor(Math.random() * (width - 1)), Math.floor(Math.random() * (height - 1))];
        doorList.push({position: randomLocation, destination: otherDoorDestinations[i]});
        tileMap[coordsToIndex(randomLocation, [width, height])] = tileDict.door;
    }

    let startDoorPos = { x: Math.floor(width / 2), y: Math.floor(height / 2)};
    tileMap[coordsToIndex([startDoorPos.x, startDoorPos.y], [width, height])] = tileDict.door;

    return new Room(name, startDoorPos, { rows: width, cols: height, tsize: tsize, tiles: tileMap }, [{ position: [startDoorPos.x, startDoorPos.y], destination: startDoorDestination}, ...doorList]);
}

module.exports = generateRoom;