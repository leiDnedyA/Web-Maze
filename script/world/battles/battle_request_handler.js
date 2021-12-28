

/*
Will handle battle requests -- meant to be used within the context of a specific world



*/


const BattleRequest = require("./battle_request");

class BattleRequestHandler{
    constructor(requestTimeOut = 30){

        this.requestTimeOut = requestTimeOut; //timeOut for each request in seconds
        this.liveRequests = {} //will store all live battle requests at a key based on the ID of the sender

        this.update = this.update.bind(this);
        this.newBattleRequest = this.newBattleRequest.bind(this);
        this.declineRequest = this.declineRequest.bind(this);
        this.acceptRequest = this.acceptRequest.bind(this);

    }

    update(){

        //filters requests and declines those that have gone over the timeOut period
        for(let i in this.liveRequests){
            if(Date.now() - this.liveRequests[i].initTime > this.requestTimeOut * 1000){
                this.declineRequest(i, 'Request timeout');
            }
        }
    }

    newBattleRequest(sender, reciever){
        //takes Client objects for the sender and reciever of the request
        let request = new BattleRequest(sender, reciever);
        this.liveRequests[sender.id] = request;
        console.log(`Battle request created from ${sender.username} to ${reciever.username}`);

    }

    declineRequest(senderID, message){

    }

    acceptRequest(senderID){

    }

}

module.exports = BattleRequestHandler;