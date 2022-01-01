const Minigame = require("./minigame.js");

class DrawingMinigameInstance extends Minigame{
    constructor(participants, endCallback){
        super('drawing', participants, endCallback);

        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
        this.handleClientInput = this.handleClientInput.bind(this);

        /**
         * Should store player data with the key being the client's ID
         */
        this.playerData = {

        }

    }

    init(){
        super.init();

        //takes game-related input from clients
        for(let i in this.participants){
            this.participants[i].socket.on("clientMinigameData", this.handleClientInput);
        }

    }

    update(deltaTime){
        super.update(deltaTime, {connection: "successful"});
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
            // console.log(data);
        }

    }

}

module.exports = DrawingMinigameInstance;