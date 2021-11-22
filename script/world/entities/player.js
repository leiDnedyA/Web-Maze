const CharController = require('./charController.js');
const Entity = require('./entity.js')

/* The Player object takes care of the actual in-game entity of the player */

class Player extends Entity{
    constructor(id, username, position){
        super(id, username, position, false);
        this.charController = new CharController(this);        
    }
}

module.exports = Player;