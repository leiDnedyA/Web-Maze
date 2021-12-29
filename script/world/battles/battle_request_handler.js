

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
        this.deleteRequest = this.deleteRequest.bind(this);
    }

    update(){

        //filters requests and declines those that have gone over the timeOut period
        for(let i in this.liveRequests){
            if(Date.now() - this.liveRequests[i].initTime > this.requestTimeOut * 1000){
                this.declineRequest(this.liveRequests[i], this.liveRequests[i].sender, 'Request timeout');
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
        sender.socket.emit("battleRequestResponse", {accepted: false, declineMessage: message})

        this.deleteRequest(request);
    }

    acceptRequest(request, sender, reciever){

        sender.socket.emit("battleRequestResponse", {accepted: true});
        reciever.socket.emit("battleRequestResponse", {accepted: true});

        this.acceptRequestCallback([sender, reciever], request.gamemode);

        this.deleteRequest(request);

    }

    deleteRequest(request){
        //takes actual request instance, not ID

        request.reciever.socket.removeAllListeners("battleRequestResponse");

        if (this.liveRequests.hasOwnProperty(request.id)) {
            delete this.liveRequests[request.id];
        } else {
            console.log(this.liveRequests);
            console.log("somethings has gone very wrong with battle request handler...");
        }
    }

}

module.exports = BattleRequestHandler;