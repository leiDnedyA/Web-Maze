const express = require("express");
const http = require("http");
const Socket = require("socket.io");
const Client = require("./script/server/client/client");
require("dotenv").config()

//module imports
const Engine = require('./script/engine');
const World = require("./script/world/world");

//server setup
const app = express();
const server = http.createServer(app);
const io = new Socket.Server(server);
const clientList = [];
const worldList = [];
const port = 3000;
const tickSpeed = 60;

//world setup
const testWorld = new World('Test World', 5, tickSpeed);
worldList.push(testWorld);

const world2 = new World('world2', 3);
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

io.on('connection', (socket) => {

    console.log('a client connected');
    let client = new Client(socket);

    socket.on('disconnect', () => {
        if(client.player){;
            client.disconnect();
        }
    })

    socket.on('loginData', (data) => {
        client.init(data.username);
        socket.emit('clientData', {
            id: client.getId(),
            worldList: worldList.map(world => ({ name: world.name, maxPlayers: world.maxPlayers, currentPlayers: world.getCurrentPlayers(), isFull: world.isFull() }))
        })
        socket.on('joinWorldRequest', data => {

            console.log(`Client ${client.username} is requesting to join world ${worldList[data.worldIndex].name}`);
            
            let connectionAttempt = client.generatePlayer(worldList[data.worldIndex]);
            socket.emit("connectionStatus", { successful: connectionAttempt })

            if(connectionAttempt){
                socket.on('inputData', (data)=>{
                    client.player.charController.setInput(data);
                })
            }

        })
    })
})

server.listen(process.env.PORT, () => {
    console.log(`Server listening on port : ${process.env.PORT}`);
});