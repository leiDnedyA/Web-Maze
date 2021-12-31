
const timeout = 30; //timeout for player responses

/*
Will be inherited by all minigames and will act as the
blueprint for how the World class interacts with minigames
*/

class Minigame{
    constructor(gamemode, participants, endCallback){
        this.gamemode = gamemode; //string containing gamemode name
        this.participants = participants;
        this.participantResponses = {};
        this.endCallback = endCallback;
        this.id = parseInt(Math.random() * 10000000);

        this.toString = this.toString.bind(this);
        
        this.init = this.init.bind(this);
        this.start = this.start.bind(this);
        this.end = this.end.bind(this);
        this.update = this.update.bind(this);
        this.updateClients = this.updateClients.bind(this);
        this.checkPlayerResponses = this.checkPlayerResponses.bind(this);
    }

    toString(){

        let participantsString = this.participants.reduce((reducer, element, index, array)=>{
            
            if(array.length == 2){
                if (index == 1) {
                    return `${reducer}and ${element.username}.`
                } else {
                    return `${reducer}${element.username} `
                }
            }else{
                if (index == array.length - 1) {
                    return `${reducer}and ${element.username}.`
                } else {
                    return `${reducer}${element.username}, `
                }
            }

            
        }, '');

        return `ID: ${this.id}, Gamemode: ${this.gamemode}, participants: ${participantsString}`;
    }

    init(){

        //sets up connections with participants and either starts or ends the minigame based on responses recieved

        //sending INIT data to both players and waiting for responses
        let participantsArrayList = Object.keys(this.participants).map((key, index)=>{
            return {name: this.participants[key].username, id: this.participants[key].id}
        })
        for(let i in this.participants){
            this.participantResponses[i] = false;
            this.participants[i].socket.emit("minigameInit", {instanceID: this.id, gamemode: this.gamemode, participants: participantsArrayList});
            this.participants[i].socket.once("minigameConfirm", (data)=>{
                if(data.ready){
                    this.participantResponses[i] = true;
                    if(this.checkPlayerResponses()){
                        this.start();
                    }
                }else{
                    this.end;
                }
            })

            setTimeout(()=>{
                if(this.checkPlayerResponses()){
                    this.start();
                }else{
                    this.end('timeout');
                }
            }, timeout * 1000);

        }


        
    }

    checkPlayerResponses(){

        //checks if participants have responded to the init emit

        let allParticipantsReady = true;
        for (let i in this.participantResponses) {
            if (!this.participantResponses[i]) {
                allParticipantsReady = false;
            }
        }
        return allParticipantsReady;
    }

    start(){
        for(let i in this.participants){
            this.participants[i].socket.once("endMinigameSession", (data)=>{
                this.end(data.message);
            })
        }
    }

    /**
     * Documentation
     * Emits a message to participants ending the minigame and
     * runs the callback given by MinigameHandler instance to end game.
     * @param {string} message message to display to clients
     */
    end(message){

        for(let i in this.participants){
            this.participants[i].emit("endMinigameSession", {message: message, sessionID: this.id});
        }

        this.endCallback(this.id);
    }

    /**
     * Emits game data to clients' sockets
     * @param {Object} gameData holds all data for the specific minigame being played
     */
    updateClients(gameData){
        for(let i in this.participants){
            this.participants[i].socket.emit("minigameData", {sessionID: this.id, gameData: gameData});
        }
    }

    update(deltaTime, gameData){
        this.updateClients(gameData);
    }

}

module.exports = Minigame;