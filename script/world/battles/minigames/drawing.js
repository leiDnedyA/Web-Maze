const Minigame = require("./minigame.js");

class DrawingMinigameInstance extends Minigame{
    constructor(participants, endCallback){
        super('drawing', participants, endCallback);
        this.update = this.update.bind(this);
    }

    update(deltaTime){
        super.update(deltaTime);
    }

}

module.exports = DrawingMinigameInstance;