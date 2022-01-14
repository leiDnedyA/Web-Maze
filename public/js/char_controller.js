

class CharController {
/**
 * 
 * @param {Array<>} moveCancelers list of elements that, when selected, will result in input not being taken
 */
    constructor(moveCancelers) {

        this.moveCancelers = moveCancelers;

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
        this.reset = this.reset.bind(this);
        this.stopMovement = this.stopMovement.bind(this);
        this.checkMoveCanceler = this.checkMoveCanceler.bind(this);
        this.filterKey = this.filterKey.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleKeyup = this.handleKeyup.bind(this);
        this.getKeysDown = this.getKeysDown.bind(this);

    }

    start() {

        window.addEventListener('click', (e)=>{
            //checks if player has gameCanvas selected
            this.checkMoveCanceler(e);
        })

        window.addEventListener('submit', (e)=>{
            this.checkMoveCanceler(e);
        });

        window.addEventListener('keydown', this.handleKeydown);
        window.addEventListener('keyup', this.handleKeyup)
    }

    stopMovement(){
        this.canvasSelected = false;
    }

    reset(){
        this.keysDown = {
            'w': false,
            'a': false,
            's': false,
            'd': false,
            ' ': false
        };
    }

    checkMoveCanceler(e){
        console.log(e.target);

        this.canvasSelected = true;
        for (let i in this.moveCancelers) {
            if (e.target === this.moveCancelers[i]) {
                this.canvasSelected = false;
            }
        }
    }

    filterKey(key){
        let k = key.toLowerCase();
        let keyConversions = {
            'arrowup' : 'w',
            'arrowdown' : 's',
            'arrowleft' : 'a',
            'arrowright' : 'd'
        }

        for(let i in keyConversions){
            if(k === i){
                k = keyConversions[i];
            }
        }

        return k;

    }

    handleKeydown(e) {
        if(this.canvasSelected){
            let key = this.filterKey(e.key);
            if (this.keysDown.hasOwnProperty(key) && !this.keysDown[key]) {
                this.keysDown[key] = true;
            }
        }

    }

    handleKeyup(e) {
        if(this.canvasSelected){
            let key = this.filterKey(e.key);
            if (this.keysDown.hasOwnProperty(key) && this.keysDown[key]) {
                this.keysDown[key] = false;
            }
        }
    }

    getKeysDown(){
        return this.keysDown;
    }
}