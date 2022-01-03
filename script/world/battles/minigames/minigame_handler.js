const Pong = require("./pong.js");
const DrawingMinigameInstance = require('./drawing.js');

class MinigameHandler{
    
    constructor(){

        //createMinigameInstance has methods for each gamemode that will take the participants as an argument and return an instance of the gamemode
        this.createMinigameInstance = {
            pong: (participants)=>{
                return new Pong(participants, this.deleteMinigame);
            },
            drawing: (participants)=>{
                return new DrawingMinigameInstance(participants, this.deleteMinigame);
            }
        }

        
        this.liveMinigames = {};

        this.update = this.update.bind(this);
        this.newMinigame = this.newMinigame.bind(this);
        this.deleteMinigame = this.deleteMinigame.bind(this);

        this.minigameListDump = this.minigameListDump.bind(this);
    }

    update(deltaTime){
        for(let i in this.liveMinigames){
            this.liveMinigames[i].update(deltaTime);
        }
    }

    newMinigame(participants, gamemode){

        if(this.createMinigameInstance.hasOwnProperty(gamemode)){

            let newMinigameInstance = this.createMinigameInstance[gamemode](participants);
            this.liveMinigames[newMinigameInstance.id] = newMinigameInstance;
            newMinigameInstance.init();
        }else{
            console.log(`WARNING: Requested minigame ${gamemode} does not exist!`);
        }

        console.log('post create log:');
        this.minigameListDump();

    }

    deleteMinigame(id){
        if(this.liveMinigames.hasOwnProperty(id.toString())){
            delete this.liveMinigames[id.toString()];
        }else{
            // console.log(`WARNING: Cannot delete minigame instance at ID: ${id} because it does not exist!`);
        }

        console.log('post delete log:');
        this.minigameListDump();
    }

    /**
     * Logs information about all currently running minigame instances
     */
    minigameListDump(){
        console.log('List of currently active minigames:\n');
        for (let i in this.liveMinigames) {
            console.log(this.liveMinigames[i].toString());
        }
    }
}

module.exports = MinigameHandler;