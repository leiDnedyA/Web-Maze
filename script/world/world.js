const Player = require('./entities/player.js');
const PhysicsEngine = require('./physics/physics.js');
const Vector2 = require('./physics/vector2.js');

class World {
    constructor(name = 'Sample World', maxPlayers = 20, tickSpeed = 30, roomData) {
        this.name = name;
        this.maxPlayers = maxPlayers;
        this.rooms = {};
        this.players = {};
        this.clients = {};

        this.physicsEngine = new PhysicsEngine(tickSpeed);
        // this.clientHandler --> make a class for the world to communicate with clients

        this.update = this.update.bind(this);
        this.isFull = this.isFull.bind(this);
        this.requestPlayerJoin = this.requestPlayerJoin.bind(this);
        this.playerDisconnect = this.playerDisconnect.bind(this);
        this.getCurrentPlayers = this.getCurrentPlayers.bind(this);
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

    addEntity(entity){
        this.physicsEngine.addEntity(entity);
    }

    removeEntity(id){
        this.physicsEngine.removeEntity(id);
    }

    requestPlayerJoin(client) { //add a better system at some point
        if (!this.isFull()) {
            this.clients[client.id] = client;
            let player = new Player(client.id, client.username, new Vector2(parseInt(5 * Math.random()), parseInt(5 * Math.random())));
            this.players[client.id] = player;
            this.addEntity(player);
            client.setPlayer(player);
            client.setWorld(this);

            return true;
        }

        return false;
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