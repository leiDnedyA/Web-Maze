const express = require("express");
const http = require("http");
const Socket = require("socket.io");
const Client = require("./script/server/client/client");
const Chat = require("./script/chat/chat");
require("dotenv").config()

//routing stuff
const resRoute = require('./script/routes/Res')

//module imports
const Engine = require('./script/engine');
const World = require("./script/world/world");

//room generator
const generateRoom = require("./script/world/rooms/roomGenerator.js");

//server setup
const app = express();
const server = http.createServer(app);
const io = new Socket.Server(server);
const clientList = {};
const worldList = [];
const port = 3000;
const tickSpeed = 60;
const chatChatLimit = 240;
const xssFilter = /<(.*)>/;

//change these for tests
const roomDimension = 100;
const wallFrequency = .55; //.45 by default
const randomRoomDimensions = [roomDimension, roomDimension]; //[100, 100] by default
const roomsToGenerate = 50;

const usedDoorPositions = [];
const randomDoorPos = (dimensions)=>{
    let pos;
    let match = false;

    do{
        pos = [Math.floor(Math.random() * (dimensions[0] - 1)), Math.floor(Math.random() * (dimensions[1] - 1))];
        for(let i in usedDoorPositions){
            if(usedDoorPositions[i][0] === pos[0] && usedDoorPositions[i][1] === pos[1]){
                match = true;
            }else{
                match = false;
            }
        }
    }while(match)

    usedDoorPositions.push(pos);

    return pos;
}

const lobbyStartDoor = {
    'lobby': [2, 4],
    'level0': randomDoorPos(randomRoomDimensions)
}

const finalDoorPos = randomDoorPos(randomRoomDimensions);
const finalLevelName = `level${roomsToGenerate - 1}`

const sampleWorldData = {
    startRoom: "lobby",
    roomList: {
        'lobby': {
            name: 'lobby',
            startPos: {x: 2, y: 3},
            tileMap: {
                cols: 5,
                rows: 5,
                tsize: 16,
                tiles: [
                    2, 2, 2, 2, 2,
                    2, 2, 2, 2, 2,
                    2, 2, 2, 2, 2,
                    2, 2, 2, 2, 2,
                    2, 2, 5, 2, 2,
                ]
            },
            doors: [
                lobbyStartDoor
            ],
            bounds: [
                [0, 0],
                [4, 0],
                [4, 4],
                [0, 4]
            ],
            dimensions: [5,  5]
        },
        'finish': {
            name: 'finish',
            startPos: { x: 2, y: 3 },
            message: `Congradulations, you made it through all ${roomsToGenerate} rooms! Take the door below to return to the lobby.`,
            tileMap: {
                cols: 5,
                rows: 5,
                tsize: 16,
                tiles: [
                    2, 2, 2, 2, 2,
                    2, 2, 2, 2, 2,
                    2, 2, 5, 2, 2,
                    2, 2, 2, 2, 2,
                    2, 2, 5, 2, 2,
                ]
            },
            doors: [
                //note: add door from last level to finish room here
                {'finish': [2, 4], 'lobby': [2, 4]},
            ],
            bounds: [
                [0, 0],
                [4, 0],
                [4, 4],
                [0, 4]
            ],
            dimensions: [5, 5]
        },
        // 'outdoors': generateRoom('outdoors', 100, 100, 'lobby')
    }
}

const endDoor = {};
endDoor[finalLevelName] = finalDoorPos;
endDoor.finish = [2, 2];
sampleWorldData.roomList.finish.doors.push(endDoor);

let randomRooms = [];

let doorsPerRoom = 4; //gets multiplied by 2
let doorList = [] //index is first entrance index


for(let i = 0; i < roomsToGenerate; i++){

    let roomName = `level${i}`;
    let nextDoor = {};
    nextDoor[roomName] = randomDoorPos(randomRoomDimensions);
    
    if(i !== roomsToGenerate - 1){
        nextDoor[`level${i + 1}`] = randomDoorPos(randomRoomDimensions);
    }else{
        nextDoor = endDoor;
    }
    
    doorList.push(nextDoor);
    if(i == 0){
        randomRooms.push(generateRoom(roomName, randomRoomDimensions[0], randomRoomDimensions[1], lobbyStartDoor, [nextDoor], wallFrequency));
    }
    else{
        randomRooms.push(generateRoom(roomName, randomRoomDimensions[0], randomRoomDimensions[1], doorList[i - 1], [nextDoor], wallFrequency));
    }
}

for(let i in randomRooms){
    sampleWorldData.roomList[randomRooms[i].name] = randomRooms[i];
}

const sendWave = (senderID, recieverID)=>{
    // console.log(`${clientList[senderID].username} waved to ${clientList[recieverID].username}`)
    clientList[recieverID].emit('wave', { senderID: senderID, senderName: clientList[senderID].username });
}

//world setup
const testWorld = new World('Labyrinth', 60, tickSpeed, sampleWorldData, `Welcome. Use WASD or ARROW keys to move arround and press SPACE to use ladders.`);
worldList.push(testWorld);

const world2 = new World('Test World', 10, tickSpeed, sampleWorldData);
worldList.push(world2);

//engine setup
const engine = new Engine(tickSpeed);
engine.addUpdateFunc((deltaTime) => {
    for (let i in worldList) {
        worldList[i].update(deltaTime);
    }
})
engine.start();

app.use(express.static("public"));
app.use('/res', resRoute);

io.on('connection', (socket) => {

    console.log('new client connected');
    let client = new Client(socket);

    clientList[client.id] = client;

    socket.on('disconnect', () => {
        if(client.player){;
            client.disconnect();
        }

        delete clientList[client.id];
    })

    socket.on('loginData', (data) => {
        client.init(data.username);
        socket.emit('clientData', {
            id: client.getId(),
            worldList: worldList.map(world => ({ name: world.name, maxPlayers: world.maxPlayers, currentPlayers: world.getCurrentPlayers(), isFull: world.isFull() }))
        })

        socket.on('joinWorldRequest', data => {

            let clientWorld = worldList[data.worldIndex];

            console.log(`Client ${client.username} is requesting to join world ${worldList[data.worldIndex].name}`);
            
            let connectionAttempt = client.generatePlayer(worldList[data.worldIndex]);
            socket.emit("connectionStatus", { successful: connectionAttempt })

            socket.emit("assets", {'tileSheetURL': 'res/mario_tileset0.png'});

            if(connectionAttempt){ //all inputs and chats should go here because it requires the connection to work
                socket.on('inputData', (data)=>{
                    client.player.charController.setInput(data);
                })

                socket.on('wave', (data)=>{
                    sendWave(client.id, data.targetID);
                })

                socket.on('battleRequest', (data)=>{
                    // console.log(`${client.username} requested to battle ${clientList[data.targetID].username}`);
                    try{
                        clientWorld.newBattleRequest(client.id, data.targetID, data.gamemode);
                    }catch(e){
                        console.log(`ERROR: ${e}`);
                    }
                })

                socket.on('newChat', (data)=>{
                    //filters chat and then sends

                    if(data.message.length < chatChatLimit && !xssFilter.test(data.message)){
                        clientWorld.emitChat({ message: data.message, clientID: client.id, clientName: client.username });
                    }
                })

            }

        })
    })
})

server.listen(process.env.PORT, () => {
    console.log(`Server listening on port : ${process.env.PORT}`);
});
