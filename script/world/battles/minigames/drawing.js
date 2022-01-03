const Minigame = require("./minigame.js");

const config = {
    maxLineLength : 1000, //length represented in number of points
    newLineDelay : .1 //minimum number of seconds between each new line from each client
}

/**
 * super.gameData organization
 * {
 * clientID: {
 *      lines: [[[x, y], [x, y], ...], [[x, y], [x, y], ...]], //lines object contains a list with lists of list containing 'points', which are 2-length lists containing points [x, y]
 *      lastLine: {Number}, //Time in milliseconds (from Date.now() call) of the last time a line was created by the specific client
 * }
 * }
 */

class DrawingMinigameInstance extends Minigame{
    constructor(participants, endCallback){
        super('drawing', participants, endCallback, "Start drawing on the canvas! Your friend's drawing will appear along with yours. Click 'x' to end the game at any time.");

        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
        this.handleClientInput = this.handleClientInput.bind(this);
        // this.lineList = {}; //has a property for each client's ID which holds a list of their lines

        /**
         * Should store player data with the key being the client's ID
         */

    }

    init(){
        super.init();

        for(let i in this.participants){
            let currentGameData = super.getGameDataCopy();
            currentGameData[this.participants[i].id] = {lines: [], lastLine: Date.now()};

            // this.lineList[this.participants[i].id] = [];

            super.setGameData(currentGameData);

            this.participants[i].socket.on("clientMinigameData", (data)=>{
                this.handleClientInput(this.participants[i].id, data);
            });
            
        }

    }

    update(deltaTime){
        super.update(deltaTime);
    }

    /**
     * adds a new 'line' to the super.gameData's property at clientID
     * @param {Number} clientID 
     * @param {Array<Array<Number>>} lineObj contains a 'line', or an array of 'points', which are arrays of numbers with index 0 representing x and index 1 representing y
     */
    addLine(clientID, lineObj){

        if(lineObj.length >= config.maxLineLength){
            return
        }

        let currentGameData = super.getGameDataCopy();
        if(currentGameData.hasOwnProperty(clientID)){
            if((Date.now() - currentGameData[clientID].lastLine) / 1000 > config.newLineDelay){
                currentGameData[clientID].lastLine = Date.now();
                currentGameData[clientID].lines.push(lineObj);
                super.setGameData(currentGameData);
            }
        }

    }

    /**
     * Filters a lineObj array and returns the filtered lineObj if the object is valid and false otherwise.
     * 
     * A valid lineObj implies that
     * - each list item at the 'line' key is another list containing 2 numbers
     * - the client hasn't gone over the line speed limit
     * - the line is under the max point limit
     * @param {{clientID: Number, line: Array.<Number[]>}} lineObj 
     * @returns {Array.<Number[]> | Boolean}
     */
    filterLineObj(lineObj) {
        if (lineObj.hasOwnProperty("line")) {
            if (lineObj.line.length < config.maxLineLength) {
                return {
                    clientID: lineObj.clientID, line: lineObj.line.filter((v, i) => {
                        if (typeof v[0] == "number" && typeof v[1] == "number" && v.length == 2) {
                            return true;
                        }
                        return false;
                    })
                }
            }
        }
        return false;
    }

    /**
     * 
     * From socket listener : "clientMinigameData"
     * Will handle data pertaining to instance of DrawingMinigame
     * and call the super function, passing in the 'backgroundData'
     * property of the data object
     * 
     * @param {Number} clientID id of client who sent data
     * @param {Object} data raw data object from client
     */
    handleClientInput(clientID, data){
        if(data){
            super.handleClientInput(clientID, { backgroundData: data.backgroundData });
            if (data.hasOwnProperty('gameUpdate')) {
                if(data.gameUpdate.hasOwnProperty('newLine')){
                    let filteredList = this.filterLineObj({clientID: clientID, line: data.gameUpdate.newLine});
                    if(filteredList){
                        this.addLine(filteredList.clientID, filteredList.line);
                    }
                }
            }
        }

    }

}

module.exports = DrawingMinigameInstance;