
/* 
Will store data including
-sender
-reciever
-timestamps
-gamemode

Methods including
-denyRequest
-acceptRequest

Also emits information to clients upon creation, denial, or acceptance
*/

class BattleRequest{
    constructor(sender, reciever, gamemode = 'N/A'){
        this.sender = sender;
        this.reciever = reciever;

        this.gamemode = gamemode;

        this.initTime = Date.now(); //stores the time at which the request was initialized in milliseconds
        reciever.socket.emit('recievedBattleRequest', {senderID: this.sender.id, gamemode: this.gamemode}); //note to self: change 'N/A' to show the specific game when I add it
        sender.socket.emit('sentBattleRequest', {recieverID: this.reciever.id, gamemode: this.gamemode});

        this.denyRequest = this.denyRequest.bind(this);
        this.acceptRequest = this.acceptRequest.bind(this);

    }

    denyRequest(){
        
    }

    acceptRequest(){

    }

}

module.exports = BattleRequest;