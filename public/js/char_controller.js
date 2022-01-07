
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
        this.filterKey = this.filterKey.bind(this);
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