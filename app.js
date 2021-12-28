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

const sampleWorldData = {
    startRoom: "lobby",
    roomList: {
        'lobby': {
            name: 'lobby',
            startPos: {x: 11, y: 23},
            tileMap: {
                cols: 25,
                rows: 25,
                tsize: 16,
                tiles: [
                    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 2, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2
                ]
            },
            doors: [
                {
                    position: [11, 23],
                    destination: 'outdoors'
                }
            ],
            bounds: [
                [1, 1],
                [23, 1],
                [23, 23],
                [1, 23]
            ],
            dimensions: [25,  25]
        },
        'outdoors': {
            name: 'outdoors',
            startPos: { x: 11, y: 30 },
            tileMap: {
                cols: 25,
                rows: 25,
                tsize: 16,
                tiles: [
                    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 2, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
                    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2
                ]
            },
            doors: [
                {
                    position: [11, 20],
                    destination: 'lobby'
                }
            ],
            bounds: [
                [1, 1],
                [23, 1],
                [23, 23],
                [1, 23]
            ],
            dimensions: [25, 25]
        }
    }
}

const sendWave = (senderID, recieverID)=>{
    // console.log(`${clientList[senderID].username} waved to ${clientList[recieverID].username}`)
    clientList[recieverID].emit('wave', { senderID: senderID, senderName: clientList[senderID].username });
}

//world setup
const testWorld = new World('Test World', 420, tickSpeed, sampleWorldData);
worldList.push(testWorld);

const world2 = new World('world2', 3, tickSpeed, sampleWorldData);
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
                        clientWorld.newBattleRequest(client.id, data.targetID);
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