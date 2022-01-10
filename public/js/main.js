const socket = io();

//references to DOM elements
const gameCanvas = document.querySelector("#gameCanvas");
const loginForm = document.querySelector("#loginForm");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const chatBoxDiv = document.querySelector('#chatBox');
const usernameInput = document.querySelector("#usernameInput");
const loadingText = document.createElement("h2");
const mainPageDiv = document.querySelector("#mainPageDiv");
const roomLabel = document.querySelector("#roomLabel");
const controlsButton = document.querySelector("#controlsButton");

loadingText.innerHTML = "loading...";
const helpMessage = 'CONTROLS: WASD or ARROW KEYS to move, SPACE to enter a door, CLICK on players to interact.\n Make sure that the GAME WINDOW is selected to move around.';

var worldTableElement = null;
var clientID = null;

const updateFunc = (deltaTime) => {
    renderer.render(world.getGameObjects(), world.animationObjects, chat.getChats(), deltaTime);
    chat.update();
    socket.emit('inputData', charController.getKeysDown());
    canvasController.setCameraOffset(renderer.cameraOffset);
    minigameController.update(deltaTime);
}

//model related stuff
const engine = new Engine(60, updateFunc);
const renderer = new Renderer(gameCanvas);
const world = new World();
const charController = new CharController();

//view controllers
const canvasController = new CanvasController(gameCanvas, renderer.unitSize);
const battleRequestHandler = new BattleRequestHandler(socket);
const chatBox = new ChatBox(chatBoxDiv);
const chat = new Chat(socket, chatBox, chatForm, chatInput);
const minigameController = new MinigameController(socket, chatBox);

const contextMenuOptions = {
    "wave": {
        callback: (target) => {
            if (target) {
                console.log(`waved to ${target.name}`)
                socket.emit("wave", { targetID: target.id });
            }
        },
        condition: (target) => {
            if (target == null) {
                return false;
            }

            return true;
        }
    },
    "play drawing": {
        callback: (target) => {
            if (target) {
                socket.emit("battleRequest", { targetID: target.id, gamemode: 'drawing' });
            }
        },
        condition: (target)=>{
            if (target == null) {
                return false;
            }
            if (target.id == clientID) {
                return false;
            }

            return true;
        }
    },
    "play pong": {
        callback: (target) =>{
            // if(target){
            //     socket.emit("battleRequest", {targetID: target.id, gamemode: 'pong'})
            // }
        }, 
        condition: (target)=>{
            return false;
        }
    }
}

const startGame = ()=>{

    /* 
    should be called once a successful connection is established,
    initializes a bunch of stuff
    */

    canvasController.setContextMenuOptions(contextMenuOptions);
    loadingText.style.display = 'none';
    startCanvas();
    roomLabel.style.display = 'block';
    charController.start();
    engine.start();
    chat.start();
    chatBox.start();
    battleRequestHandler.start();
    // controlsButton.style.visibility = 'visible';
    controlsButton.addEventListener('click', ()=>{
        alert(helpMessage);
    })
}

const awaitJoinWorld = () => { // figure out how to do async await and do it here
    worldTableElement.style.display = 'none';
    document.body.appendChild(loadingText);
    socket.on('connectionStatus', (data) => {
        if (data.successful == true) {

            startGame();
            
        }
    })
}

const startCanvas = () => {
    gameCanvas.style.display = 'inline-block';
    canvasController.start();
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    socket.emit('loginData', {
        'username': usernameInput.value
    })
    socket.on('clientData', (data) => {
        worldTableElement = generateWorldTable(data.worldList, socket, awaitJoinWorld);
        document.body.appendChild(worldTableElement);
        clientID = data.id;
        renderer.setCameraTargetID(clientID);
        console.log(`Client ID: ${clientID}`);
        minigameController.init(clientID);
    })
    socket.on("roomUpdate", (data) => {
        roomLabel.innerHTML = `Current room: ${data.name}`;
        renderer.setTileMap(data.tileMap);
    })
    socket.on('assets', (data) => {
        renderer.setTileSheetSRC(data.tileSheetURL);
    })
    socket.on("worldData", (data) => {
        world.updateGameObjects(data);
        canvasController.setGameObjects(world.getGameObjects());
    })
    socket.on("wave", (data) => {
        if(data.senderID == clientID){
            console.log(`You waved to yourself!`);
            chatBox.newWave(data, true);
        }else{
            console.log(`${data.senderName} waved to you!`);
            chatBox.newWave(data, false);
        }
    })
    socket.on("sentBattleRequest", (data)=>{
        let reciever = world.getGameObjectByID(data.recieverID);
        chatBox.newSentBattleRequest(reciever, data.gamemode);
        console.log(`Battle request successfully sent to ${reciever.name}.`);
    })
    socket.on("recievedBattleRequest", (data)=>{
        console.log(data);
        let sender = world.getGameObjectByID(data.senderID);
        chatBox.newRecievedBattleRequest(sender, data.gamemode);
        console.log(`Battle request recieved from ${sender.name}`);
        battleRequestHandler.newRequest(data.requestID, sender, data.gamemode);
    })
    loginForm.style.display = 'none';
    mainPageDiv.style.display = 'none';
})