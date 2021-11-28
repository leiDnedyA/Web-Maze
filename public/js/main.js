const socket = io();

const gameCanvas = document.querySelector("#gameCanvas");
const loginForm = document.querySelector("#loginForm")
const usernameInput = document.querySelector("#usernameInput");
const loadingText = document.createElement("h2");
loadingText.innerHTML = "loading...";

var worldTableElement = null;


const updateFunc = (deltaTime) => {
    renderer.render(world.getGameObjects())
    socket.emit('inputData', charController.getKeysDown());
}

const engine = new Engine(60, updateFunc);
const renderer = new Renderer(gameCanvas);
const world = new World();
const charController = new CharController();

const awaitJoinWorld = ()=>{ // figure out how to do async await and do it here
    worldTableElement.style.display = 'none';
    document.body.appendChild(loadingText);
    socket.on('connectionStatus', (data)=>{
        if(data.successful == true){
            loadingText.style.display = 'none';
            startCanvas();
            charController.start();
            engine.start();
            
            

        }
    })
}

const startCanvas = ()=>{
    gameCanvas.style.display = 'inline-block';
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    socket.emit('loginData', {
        'username': usernameInput.value
    })
    socket.on('clientData', (data) => {
        worldTableElement = generateWorldTable(data.worldList, socket, awaitJoinWorld);
        document.body.appendChild(worldTableElement);
    })
    socket.on("roomUpdate", (data) => {
        renderer.setTileMap(data.tileMap);
    })
    socket.on('assets', (data) => {
        renderer.setTileSheetSRC(data.tileSheetURL);
    })
    socket.on("worldData", (data) => {
        world.updateGameObjects(data);
    })
    loginForm.style.display = 'none';
    // gameCanvas.style.display = 'block';
})