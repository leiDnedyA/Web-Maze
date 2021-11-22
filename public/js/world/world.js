
class World{
    constructor(){
        this.gameObjects = [];
        this.updateGameObjects = this.updateGameObjects.bind(this);
        this.getGameObjects = this.getGameObjects.bind(this);
    }

    updateGameObjects(data){
        this.gameObjects = data;
    }

    getGameObjects(){
        return this.gameObjects
    }

}