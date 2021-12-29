
/*

FORMAT FOR MINIGAME INSTANCE CLASS
Constructor parameters: int "instanceID" --> sent from server
Required methods:
serverStream(data) --> updates game with data from server
update(deltaTime) --> called on every tick and given deltaTime in milliseconds

*/

class MinigameController{
    constructor(socket, chatBox){
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('minigameCanvas');

        this.overlay = document.createElement('div');
        this.overlay.classList.add('overlay');

        this.overlay.appendChild(this.canvas);

        this.chatBox = chatBox;

        this.socket = socket;
        this.clientID;
    
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
    
    /**
    * Documentation
    * @param {number} clientID ID of client
    */
    init(clientID){

        this.clientID = clientID;

        document.body.appendChild(this.overlay);

        this.socket.on("minigameInit", (data)=>{
            if(this.currentMinigameInstance == null){
                this.socket.emit("minigameConfirm", {ready: true});

                this.startMinigame(data.instanceID, data.gamemode, data.participants);

            }else{
                this.socket.emit("minigameConfirm", {ready: false, message: "Client already playing minigame!"});
            }
        })
    }

    update(deltaTime){
        if(this.active){
            this.currentMinigameInstance.update();
        }
    }

    startMinigame(instanceID, gamemode, participants){

        //should check with server to make sure the minigame instance is actually running

        if(this.newMinigameInstance.hasOwnProperty(gamemode)){
            this.startSession();
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
        this.overlay.style.visibility = "visible";
    }

    hideCanvas(){
        this.overlay.style.visibility = "hidden";
    }

}