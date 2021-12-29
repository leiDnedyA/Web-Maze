

/*
Will handle battle requests -- meant to be used within the context of a specific world



*/


const BattleRequest = require("./battle_request");

class BattleRequestHandler{
    constructor(acceptRequestCallback, requestTimeOut = 30){

        this.acceptRequestCallback = acceptRequestCallback;
        this.requestTimeOut = requestTimeOut; //timeOut for each request in seconds
        this.liveRequests = {} //will store all live battle requests at a key based on ID

        this.update = this.update.bind(this);
        this.newBattleRequest = this.newBattleRequest.bind(this);
        this.declineRequest = this.declineRequest.bind(this);
        this.acceptRequest = this.acceptRequest.bind(this);

    }

    update(){

        //filters requests and declines those that have gone over the timeOut period
        for(let i in this.liveRequests){
            if(Date.now() - this.liveRequests[i].initTime > this.requestTimeOut * 1000){
                this.declineRequest(this.liveRequests[i].sender, 'Request timeout');
                this.liveRequests[i].sender.socket.removeAllListeners("battleRequestResponse");
            }
        }
    }

    newBattleRequest(sender, reciever){
        //takes Client objects for the sender and reciever of the request
        let request = new BattleRequest(sender, reciever);
        this.liveRequests[request.id] = request;

        reciever.socket.once("battleRequestResponse", (data)=>{
            if(data.isAccept){
                this.acceptRequest(request, sender, reciever);
            }else{
                this.declineRequest(request, sender, `Request to battle ${reciever.username} declined...`);
            }
        });

        console.log(`Battle request created from ${sender.username} to ${reciever.username}`);

    }

    declineRequest(request, sender, message){
        if(this.liveRequests.hasOwnProperty(request.id)){
            delete this.liveRequests[request.id];
        }else{
            console.log("somethings has gone very wrong with battle request handler...");
        }
        sender.socket.emit("battleRequestResponse", {accepted: false, declineMessage: message})
    }

    acceptRequest(request, sender, reciever){

        sender.socket.emit("battleRequestResponse", {accepted: true});
        reciever.socket.emit("battleRequestResponse", {accepted: true});

        this.acceptRequestCallback([sender, reciever], request.gamemode);

        if (this.liveRequests.hasOwnProperty(request.id)) {
            delete this.liveRequests[request.id];
        } else {
            console.log("somethings has gone very wrong with battle request handler...");
        }

    }

}

module.exports = BattleRequestHandler;