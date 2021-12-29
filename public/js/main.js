const socket = io();

//references to DOM elements
const gameCanvas = document.querySelector("#gameCanvas");
const loginForm = document.querySelector("#loginForm");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const chatBoxDiv = document.querySelector('#chatBox');
const usernameInput = document.querySelector("#usernameInput");
const loadingText = document.createElement("h2");
loadingText.innerHTML = "loading...";

var worldTableElement = null;
var clientID = null;

const updateFunc = (deltaTime) => {
    renderer.render(world.getGameObjects(), chat.getChats());
    chat.update();
    socket.emit('inputData', charController.getKeysDown());
    canvasController.setCameraOffset(renderer.cameraOffset);
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
    "request battle": {
        callback: (target) => {
            if (target) {
                socket.emit("battleRequest", { targetID: target.id });
            }
        },
        condition: (target)=>{
            console.log(target)
            if (target == null) {
                return false;
            }
            if (target.id == clientID) {
                return false;
            }

            return true;
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
    charController.start();
    engine.start();
    chat.start();
    chatBox.start();
    battleRequestHandler.start();
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
        renderer.setCameraTargetID(data.id);
        console.log(`Client ID: ${data.id}`);
    })
    socket.on("roomUpdate", (data) => {
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
        let sender = world.getGameObjectByID(data.senderID);
        chatBox.newRecievedBattleRequest(sender, data.gamemode);
        console.log(`Battle request recieved from ${sender.name}`);
        battleRequestHandler.newRequest(data.requestID, sender, data.gamemode);
    })
    loginForm.style.display = 'none';
})