const Chat = require('../chat/chat.js');
const Player = require('./entities/player.js');
const PhysicsEngine = require('./physics/physics.js');
const Vector2 = require('./physics/vector2.js');

class World {
    constructor(name = 'Sample World', maxPlayers = 20, tickSpeed = 30, worldData) {
        this.name = name;
        this.maxPlayers = maxPlayers;
        this.tickSpeed = tickSpeed;
        this.players = {};
        this.clients = {};
        this.worldData = worldData;
        this.rooms = worldData.roomList;

        this.physicsEngine = new PhysicsEngine(this.tickSpeed, this.rooms);
        this.chat = new Chat(this.clients);
        // this.clientHandler --> make a class for the world to communicate with clients

        this.update = this.update.bind(this);
        this.isFull = this.isFull.bind(this);
        this.requestPlayerJoin = this.requestPlayerJoin.bind(this);
        this.playerDisconnect = this.playerDisconnect.bind(this);
        this.getCurrentPlayers = this.getCurrentPlayers.bind(this);
        this.emitChat = this.emitChat.bind(this);
    }

    update(deltaTime) {

        //updating clients on world data
        this.physicsEngine.update(deltaTime);

        let entityList = this.physicsEngine.getEntityList();

        let worldData = Object.keys(entityList)
            .map((a) => {
                return entityList[a]
            })
            .map((entity, index) => {
                return { id: entity.id, name: entity.name, position: { x: entity.position.x, y: entity.position.y } }
            })

        for (let i in this.clients) {
            this.clients[i].emit("worldData", worldData);
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

    removeEntity(id){
        this.physicsEngine.removeEntity(id);
    }

    requestPlayerJoin(client) { //add a better system at some point
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