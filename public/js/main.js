const socket = io();

const gameCanvas = document.querySelector("#gameCanvas");
const loginForm = document.querySelector("#loginForm");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const usernameInput = document.querySelector("#usernameInput");
const loadingText = document.createElement("h2");
loadingText.innerHTML = "loading...";

var worldTableElement = null;

const updateFunc = (deltaTime) => {
    renderer.render(world.getGameObjects(), chat.getChats());
    chat.update();
    socket.emit('inputData', charController.getKeysDown());
    canvasController.setCameraOffset(renderer.cameraOffset);
}

const engine = new Engine(60, updateFunc);
const renderer = new Renderer(gameCanvas);
const world = new World();
const charController = new CharController();
const chat = new Chat(socket, chatForm, chatInput);
const canvasController = new CanvasController(gameCanvas, renderer.unitSize);

const contextMenuOptions = {
    "wave": (target) => {
        console.log(`waved to ${target.name}`)
        socket.emit("wave", {targetID: target.id});
    },
    "request battle": () => {
        
    }
}

const awaitJoinWorld = () => { // figure out how to do async await and do it here
    worldTableElement.style.display = 'none';
    document.body.appendChild(loadingText);
    socket.on('connectionStatus', (data) => {
        if (data.successful == true) {
            canvasController.setContextMenuOptions(contextMenuOptions);
            loadingText.style.display = 'none';
            startCanvas();
            charController.start();
            engine.start();
            chat.start();
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
    loginForm.style.display = 'none';
    // gameCanvas.style.display = 'block';
})