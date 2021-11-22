
class CharController {
    constructor(player){
        this.player = player;

        this.keysDown = {
            'w': false,
            'a': false,
            's': false,
            'd': false,
            ' ': false
        };

        this.update = this.update.bind(this);
        this.setInput = this.setInput.bind(this);
    }

    update(deltaTime){

    }

    setInput(data){
        this.keysDown = data;
    }

}

module.exports = CharController;