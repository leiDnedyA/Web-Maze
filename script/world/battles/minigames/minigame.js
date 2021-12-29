
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

        this.init = this.init.bind(this);
        this.start = this.start.bind(this);
        this.end = this.end.bind(this);
        this.update = this.update.bind(this);
        this.checkPlayerResponses = this.checkPlayerResponses.bind(this);
    }

    init(){

        //sets up connections with participants and either starts or ends the minigame based on responses recieved

        console.log('Minigame init!');

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
        console.log('Minigame started!');
    }

    end(message){
        this.endCallback(this.id);
    }

    update(deltaTime){

    }

}

module.exports = Minigame;