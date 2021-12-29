
class CharController {
    constructor() {

        this.gameCanvas = document.querySelector("#gameCanvas");

        this.canvasSelected = true;

        this.keysDown = {
            'w': false,
            'a': false,
            's': false,
            'd': false,
            ' ': false
        };

        this.start = this.start.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleKeyup = this.handleKeyup.bind(this);
        this.getKeysDown = this.getKeysDown.bind(this);

    }

    start() {

        window.addEventListener('click', (e)=>{
            //checks if player has gameCanvas selected
            this.canvasSelected = (this.gameCanvas == e.target);
        })

        window.addEventListener('keydown', this.handleKeydown);
        window.addEventListener('keyup', this.handleKeyup)
    }

    handleKeydown(e) {
        if(this.canvasSelected){
            let key = e.key.toLowerCase();
            if (this.keysDown.hasOwnProperty(key) && !this.keysDown[key]) {
                this.keysDown[key] = true;
            }
        }

    }

    handleKeyup(e) {
        if(this.canvasSelected){
            let key = e.key.toLowerCase();
            if (this.keysDown.hasOwnProperty(key) && this.keysDown[key]) {
                this.keysDown[key] = false;
            }
        }
    }

    getKeysDown(){
        return this.keysDown;
    }
}