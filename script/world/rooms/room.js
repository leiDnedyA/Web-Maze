const Vector2 = require("../physics/vector2");


class Room{
    constructor(config){
        this.config = config;
        this.name = config.name;
        this.startPos = new Vector2(config.startPos.x, config.startPos.y);
    }
}

module.exports = Room;