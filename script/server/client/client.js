const Player = require('../../world/entities/player.js');

/* The Client object handles all of the server-related data, tasks, and implications of a client, and stores an instance of a Player object */

class Client {
    constructor(socket){

        this.id = parseInt(Math.random() * 10000000);
        this.socket = socket;

        this.username = null;
        this.player = null;

        this.world = null;

        this.emit = this.emit.bind(this);

        this.init = this.init.bind(this);
        this.generatePlayer = this.generatePlayer.bind(this);
        this.disconnect = this.disconnect.bind(this);
        
        this.getId = this.getId.bind(this);
        this.getPlayer = this.getPlayer.bind(this);
        this.getWorld = this.getWorld.bind(this);

        this.setPlayer = this.setPlayer.bind(this);
        this.setWorld = this.setWorld.bind(this);
    }

    init(username){
        this.username = username;
    }

    generatePlayer(world){
        if (world.requestPlayerJoin(this)){
            console.log(`Player: ${this.username} joined world '${world.name}'`);
            return true;
        }
        return false;
    }

    emit(tag, data){
        this.socket.emit(tag, data);
    }

    disconnect(){
        console.log(`Player '${this.username}' has disconnected`)
        if(this.world){
            this.world.playerDisconnect(this.id);
        }
    }

    getPlayer(){
        return this.player;
    }

    getWorld(){
        return this.world;
    }

    getId(){
        return this.id;
    }

    setPlayer(p){
        this.player = p;
    }

    setWorld(w){
        this.world = w;
    }

}

module.exports = Client;