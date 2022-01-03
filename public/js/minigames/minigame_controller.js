
/*

FORMAT FOR MINIGAME INSTANCE CLASS
Constructor parameters: int "instanceID" --> sent from server
Required methods:
serverStream(data) --> updates game with data from server
update(deltaTime) --> called on every tick and given deltaTime in milliseconds

*/

class MinigameController{

    /**
     * 
     * @param {Socket} socket instance of socket
     * @param {ChatBox} chatBox instance of ChatBox
     */
    constructor(socket, chatBox){
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('minigameCanvas');

        this.endButton = document.createElement('button');
        this.endButton.innerHTML = 'x';
        this.endButton.classList.add('endMinigameButton');

        this.overlay = document.createElement('div');
        this.overlay.classList.add('overlay');

        this.overlay.appendChild(this.canvas);
        this.overlay.appendChild(this.endButton);

        window.addEventListener('resize', this.resizeCanvas);

        this.chatBox = chatBox;

        this.socket = socket;
        this.clientID;
    
        this.active = false;

        this.currentSession = {
            id: null,
        };

        this.currentMinigameInstance; //will hold the current instance of whatever minigame is being played

        this.newMinigameInstance = {
            pong : (instanceID)=>{
                return new PongInstance(instanceID, this.socket, this.canvas);
            }, 
            drawing: (instanceID)=>{
                return new DrawingMinigameInstance(instanceID, this.socket, this.canvas);
            }
        }

        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
        this.startMinigame = this.startMinigame.bind(this);
        this.startSession = this.startSession.bind(this);
        this.endSession = this.endSession.bind(this);
        this.showCanvas = this.showCanvas.bind(this);
        this.hideCanvas = this.hideCanvas.bind(this);
        this.resizeCanvas = this.resizeCanvas.bind(this);

    }
    
    /**
    * Documentation
    * @param {number} clientID ID of client
    */
    init(clientID){

        this.clientID = clientID;
        this.resizeCanvas();
        document.body.appendChild(this.overlay);

        this.socket.on("minigameInit", (data)=>{

            console.log(data);

            if(this.currentMinigameInstance == null){
                this.socket.emit("minigameConfirm", {ready: true});
                this.socket.once("endMinigameSession", (data)=>{
                    this.endSession(data.message);
                })
                this.startMinigame(data.instanceID, data.gamemode, data.participants, data.startMessage);

            }else{
                this.socket.emit("minigameConfirm", {ready: false, message: "Client already playing minigame!"});
            }
        })

        this.socket.on("minigameData", (data)=>{
            if(this.currentMinigameInstance == null || data.sessionID != this.currentSession.id){
                // console.log(`Client session ID: ${this.currentSession.id}, Server session ID: ${data.sessionID}`)
                // console.log('WARNING: recieving minigame data from the wrong minigame!');
            }else{
                this.currentMinigameInstance.handleServerInput(data);
            }
        })

        this.endButton.addEventListener('click', ()=>{
            //think about adding popup to confirm that the user wants to end the game
            this.endSession();
        })
    }

    /**
     * 
     * @param {number} deltaTime time in milliseconds since the last update 
     */
    update(deltaTime){
        if(this.active){
            this.currentMinigameInstance.update(deltaTime);
        }
    }

    /**
     * Starts minigame session on client
     * @param {number} instanceID 
     * @param {string} gamemode 
     * @param {Array.<string>} participants 
     * @param {string} startMessage comes up on screen in alert
     */
    startMinigame(instanceID, gamemode, participants, startMessage){


        // console.log(`instanceID: ${instanceID}, gamemode: ${gamemode}`);
        //should check with server to make sure the minigame instance is actually running

        if(this.newMinigameInstance.hasOwnProperty(gamemode)){
            this.currentMinigameInstance = this.newMinigameInstance[gamemode](instanceID);
            this.startSession();
            this.currentSession.id = instanceID;
            setTimeout(()=>{
                alert(startMessage);
            }, 40);
        }else{
            this.endSession();
            console.log("WARNING: method startMinigame was passed in a gamemode that doesn't exist!");
        }

    }

    startSession(){
        this.active = true;
        this.showCanvas();
    }

    endSession(message){
        this.socket.removeAllListeners("endMinigameSession");
        this.socket.emit('endMinigameSession', {sessionID: this.currentSession.id});
        this.active = false;
        this.hideCanvas();
        this.currentSession.id = null;
        this.currentMinigameInstance = null;
        if(message){
            alert(message);
        }
    }

    showCanvas(){
        this.overlay.style.visibility = "visible";
    }

    hideCanvas(){
        this.overlay.style.visibility = "hidden";
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth * .4;
        this.canvas.height = window.innerHeight * .4;
    }

}