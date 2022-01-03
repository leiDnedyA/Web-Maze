
/* 
Will store data including
-sender
-reciever
-timestamps
-gamemode

Also emits information to clients upon creation, denial, or acceptance
*/

class BattleRequest{
    constructor(sender, reciever, gamemode = 'N/A'){
        this.sender = sender;
        this.reciever = reciever;
        this.id = parseInt(Math.random() * 10000000);

        this.gamemode = gamemode;

        this.initTime = Date.now(); //stores the time at which the request was initialized in milliseconds
        reciever.socket.emit('recievedBattleRequest', {requestID: this.id, senderID: this.sender.id, gamemode: this.gamemode}); //note to self: change 'N/A' to show the specific game when I add it
        sender.socket.emit('sentBattleRequest', {requestID: this.id, recieverID: this.reciever.id, gamemode: this.gamemode});

    }

}

module.exports = BattleRequest;