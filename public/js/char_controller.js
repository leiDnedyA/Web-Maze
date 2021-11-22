
class CharController {
    constructor() {

        this.targetElement = window;

        this.keysDown = {
            'w': false,
            'a': false,
            's': false,
            'd': false,
            ' ': false
        };



        console.log('char controller started');
        console.log(this.targetElement)

        this.start = this.start.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleKeyup = this.handleKeyup.bind(this);
        this.getKeysDown = this.getKeysDown.bind(this);

    }

    start() {
        this.targetElement.addEventListener('keydown', this.handleKeydown);
        this.targetElement.addEventListener('keyup', this.handleKeyup)
    }

    handleKeydown(e) {
        let key = e.key.toLowerCase();
        if(this.keysDown.hasOwnProperty(key) && !this.keysDown[key]){
            this.keysDown[key] = true;
        }

    }

    handleKeyup(e) {
        let key = e.key.toLowerCase();
        if(this.keysDown.hasOwnProperty(key) && this.keysDown[key]){
            this.keysDown[key] = false;
        }
    }

    getKeysDown(){
        return this.keysDown;
    }
}