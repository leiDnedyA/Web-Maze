
/*

FORMAT FOR MINIGAME INSTANCE CLASS
Constructor parameters: int "instanceID" --> sent from server
Required methods:
serverStream(data) --> updates game with data from server
update(deltaTime) --> called on every tick and given deltaTime in milliseconds

*/

class MinigameController{
    constructor(socket, clientID){
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('minigameCanvas');

        this.socket = socket;
        this.clientID = clientID;
    
        this.active = false;

        this.currentMinigameInstance; //will hold the current instance of whatever minigame is being played

        //an object containing methods that will return a new instance of the minigame referenced
        this.newMinigameInstance = {
            pong : (instanceID)=>{
                return new PongInstance(instanceID, this.socket, this.canvas);
            }
        }

        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
        this.startMinigame = this.startMinigame.bind(this);
        this.startSession = this.startSession.bind(this);
        this.endSession = this.endSession.bind(this);
        this.showCanvas = this.showCanvas.bind(this);
        this.hideCanvas = this.hideCanvas.bind(this);

    }

    init(){
        
    }

    update(deltaTime){
        if(this.active){
            this.currentMinigameInstance.update();
        }
    }

    startMinigame(instanceID, gamemode){

        //should check with server to make sure the minigame instance is actually running

        if(this.newMinigameInstance.hasOwnProperty(gamemode)){
            this.socket.emit("initMinigame", {instanceID: instanceID, gamemode: gamemode});
            this.socket.once("initMinigame", (data)=>{
                this.currentMinigameInstance = this.newMinigameInstance[gamemode](instanceID);
                this.startSession();
            });
        }else{
            this.endSession();
            console.log("WARNING: method startMinigame was passed in a gamemode that doesn't exist!");
        }

    }

    startSession(){
        this.active = true;
        this.showCanvas();
    }

    endSession(){
        this.active = false;
        this.hideCanvas();
    }

    showCanvas(){
        this.canvas.style.display = "block";
    }

    hideCanvas(){
        this.canvas.style.display = "none";
    }

}