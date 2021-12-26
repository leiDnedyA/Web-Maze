
const BattleRequest = require("./battle_request");

class BattleRequestHandler{
    constructor(){

        this.liveRequests = []

        this.createBattleRequest = this.createBattleRequest.bind(this);

    }

    createBattleRequest(sender, reciever){
        
    }
}

module.exports = BattleRequestHandler;