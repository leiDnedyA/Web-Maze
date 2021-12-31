const Chat = require('../chat/chat.js');
const Player = require('./entities/player.js');
const PhysicsEngine = require('./physics/physics.js');
const Vector2 = require('./physics/vector2.js');
const ActionsHandler = require('./actionsHandler.js')
const BattleRequestHandler = require('./battles/battle_request_handler.js');
const MinigameHandler = require('./battles/minigames/minigame_handler.js');

class World {
    constructor(name = 'Sample World', maxPlayers = 20, tickSpeed = 30, worldData) {
        this.name = name;
        this.maxPlayers = maxPlayers;
        this.tickSpeed = tickSpeed;
        this.players = {};
        this.clients = {};
        this.worldData = worldData;
        this.rooms = worldData.roomList;

        this.actionsHandler = new ActionsHandler(this);
        this.physicsEngine = new PhysicsEngine(this.tickSpeed, this.rooms);
        this.chat = new Chat(this.clients);
        this.battleRequestHandler = new BattleRequestHandler((participants, gamemode)=>{
            this.newMinigame(participants, gamemode);
        });
        this.minigameHandler = new MinigameHandler();

        this.update = this.update.bind(this);
        this.isFull = this.isFull.bind(this);
        this.newBattleRequest = this.newBattleRequest.bind(this);
        this.requestPlayerJoin = this.requestPlayerJoin.bind(this);
        this.playerDisconnect = this.playerDisconnect.bind(this);
        this.getCurrentPlayers = this.getCurrentPlayers.bind(this);
        this.changeClientRoom = this.changeClientRoom.bind(this);
        this.emitChat = this.emitChat.bind(this);
        this.newMinigame = this.newMinigame.bind(this);
    }

    update(deltaTime) {

        //updating clients on world data
        this.physicsEngine.update(deltaTime);
        this.actionsHandler.handleAllActions(this.clients, this.worldData);        
        this.battleRequestHandler.update();
        this.minigameHandler.update(deltaTime);

        let entityList = this.physicsEngine.getEntityList();
        
        for(let i in this.rooms){
            let worldData = Object.keys(entityList)
                .map((a) => {
                    return entityList[a]
                })
                .filter((a)=>{
                    if(a.room == i){
                        return true;
                    }
                    return false;
                })
                .map((entity, index) => {
                    return { id: entity.id, name: entity.name, position: { x: entity.position.x, y: entity.position.y } }
                })
            for (let j in this.clients) {
                if(this.clients[j].room == i){
                    this.clients[j].emit("worldData", worldData);
                }
            }
        }

        

    }

    isFull() { //returns a bool value of whether or not the world is full
        return (Object.keys(this.players).length >= this.maxPlayers)
    }

    addEntity(entity, room){
        this.physicsEngine.addEntity(entity);
        if(room){
            this.physicsEngine.entities[entity.id].setRoom(room);
        }else{
            this.physicsEngine.entities[entity.id].setRoom(this.worldData.startRoom);
        }
    }

    newBattleRequest(senderID, recieverID){
        //takes Client ID for sender and reciever
        if (!this.clients.hasOwnProperty(senderID)){
            throw('A client with the id senderID does not exist in this world!')
        }
        if(!this.clients.hasOwnProperty(recieverID)){  
            throw ('A client with the id recieverID does not exist in this world!')
        }
        this.battleRequestHandler.newBattleRequest(this.clients[senderID], this.clients[recieverID]);
    }

    newMinigame(participants, gamemode){
        this.minigameHandler.newMinigame(participants, "drawing"); //eventually change 'drawing' to show the gamemode requested by the players
    }

    changeClientRoom(client, roomName){
        client.setRoom(roomName, this.worldData.roomList[roomName]);
        this.physicsEngine.entities[client.id].setRoom(roomName);
    }

    removeEntity(id){
        this.physicsEngine.removeEntity(id);
    }

    requestPlayerJoin(client) {
        if (!this.isFull()) {

            let room = this.worldData.startRoom;

            let roomData = this.worldData.roomList[room];

            this.clients[client.id] = client;
            let player = new Player(client.id, client.username, new Vector2(roomData.startPos.x, roomData.startPos.y));
            this.players[client.id] = player;

            
            this.addEntity(player, room);
            client.setRoom(room, this.worldData.roomList[room]);
            client.setPlayer(player);
            client.setWorld(this);

            return true;
        }

        return false;
    }

    emitChat(chat){
        this.chat.handleChat(chat);
    }

    playerDisconnect(id) {

        delete this.clients[id];
        delete this.players[id];
        this.physicsEngine.removeEntity(id);
    
    }

    getCurrentPlayers() {
        return Object.keys(this.players).length;
    }
}

module.exports = World;