
const Room = require('./room.js');

const tileDict = {'floor': 2, 'wall': 1, 'specialWall': 3,'door': 5};
const tsize = 16;

/**
 * Gets the index of coordinates on a tileGrid.
 * 
 * @param {number[]} coords Coordinates
 * @param {number[]} dimensions Width and height of grid
 * @returns {number} index
 */
const coordsToIndex = (coords, dimensions)=>{
    
    if(coords[0] >= dimensions[0] || coords[1] >= dimensions[1] || coords[0] < 0 || coords[1] < 0){
        return null;
    }

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
const countNeighborhoodWalls = (coords, noiseMap, width, height, wallNum = 1)=>{
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

                if(noiseMap[coordsToIndex(tempCoords, [width, height])] == wallNum || tempCoords[0] < 0 || tempCoords[1] < 0 || tempCoords[0] > width || tempCoords[1] > height){
                    wallCount++;
                }
            }
        }
    }
    // console.log(wallCount);
    return wallCount;

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
 * @param {number} wallFrequency percentage of tiles to be made walls, .45 by default
 * @returns {Room} generated room
 */
const generateRoom = (name, width, height, startDoor, otherDoors, wallFrequency = .45)=>{

    let doorList = [startDoor, ...otherDoors];

    // console.log(doorList)

    let tileMap = [];

    let generateTileMap = ()=>{

        let tileMap = [];

        //generates a noise map
        let noiseMap = [];
        for (let i = 0; i < width * height; i++) {
            if (Math.random() >= wallFrequency) {
                noiseMap.push(0);
            } else {
                noiseMap.push(1);
            }
        }

        //sets tile based on Moore Neighborhood
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                let w = countNeighborhoodWalls([i, j], noiseMap, width, height);
                if (w > 4) {
                    tileMap.push(tileDict.wall);
                } else {
                    tileMap.push(tileDict.floor);
                }
            }
        }

        //adds random variation to walls
        for (let i in tileMap) {
            if (tileMap[i] === tileDict.wall) {
                if (Math.random() < .1) {
                    tileMap[i] = tileDict.specialWall;
                }
            }
        }

        return tileMap;

    }

    let addDoors = () => {
        for (let i in doorList) {
            if (doorList[i].hasOwnProperty(name)) {
                let coords = [doorList[i][name][0], doorList[i][name][1]];
                let index = coordsToIndex(coords, [width, height]);

                tileMap[index] = tileDict.door;
            }else{
                console.log('the problem is in addDoors')
            }
        }
        return tileMap;

    }

    let checkDoorsAccessible = (startPos, tileMap, doorList)=>{
        
        //flood fill algorithm
        let array = [...tileMap]; //shallow copy of tileMap
        let foundDoorCount = 0;

        let acceptedVals = [tileDict.door, tileDict.floor];

        //recursive depth-first search through tileMap
        let dfs = (coords)=>{
            let index = coordsToIndex(coords, [width, height]);
            let val = array[index];
            let accepted = false;
            for(let i in acceptedVals){
                if(val === acceptedVals[i]){
                    accepted = true;
                }
            }

            if(!accepted){
                return;
            }else{
                if(val === tileDict.door){
                    foundDoorCount++;
                }
                array[index] = -array[index];
                dfs([coords[0], coords[1]-1]); //up
                dfs([coords[0], coords[1]+1]); //down
                dfs([coords[0]-1, coords[1]]); //left
                dfs([coords[0]+1, coords[1]]); //right
            }
        }

        dfs(startPos);

        // console.log(foundDoorCount);

        return [(foundDoorCount >= doorList.length), array];

    }

    

    let searchStartPos = startDoor[name];

    tileMap = generateTileMap(tileMap);
    tileMap = addDoors(tileMap);

    //logs the before and after of a continuityCheck instance
    const logCheck = (lastContinuityCheck)=>{
        console.log('before: ')
        for (let i = 0; i < height; i++) {
            let row = []
            for (let j = 0; j < width; j++) {
                row.push(tileMap[(i * width) + j]);
            }
            console.log(row);

        }
        let a = lastContinuityCheck[1];
        console.log('-----')
        for (let i = 0; i < height; i++) {
            let row = []
            for (let j = 0; j < width; j++) {
                row.push(a[(i * width) + j]);
            }
            console.log(row);

        }

    }

    let maxAttempts = 100000;
    let attempts = 0;
    let lastContinuityCheck = checkDoorsAccessible(searchStartPos, tileMap, doorList);

    while ((!lastContinuityCheck[0]) && attempts < maxAttempts){
        tileMap = generateTileMap(tileMap);
        tileMap = addDoors(tileMap);
        lastContinuityCheck = checkDoorsAccessible(searchStartPos, tileMap, doorList);
        
        // logCheck(lastContinuityCheck);
        
        attempts++;
    }

    let startDoorPos = [0, 0]


    if(attempts === maxAttempts){
        console.log(`Room ${name} has a door disconnection`)
    }else{
        // console.log(`Room ${name} was generated without error.`)
    }


    return new Room(name, startDoorPos, { rows: width, cols: height, tsize: tsize, tiles: tileMap }, doorList);
}

module.exports = generateRoom;