const Minigame = require("./minigame.js");

class Pong extends Minigame{
    constructor(participants, endCallback){
        super('pong', participants, endCallback);
        this.update = this.update.bind(this);
    }

    update(deltaTime){
        super.update(deltaTime); //runs the update function from the Minigame class
    }
}

module.exports = Pong;