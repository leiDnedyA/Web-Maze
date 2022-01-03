
class World{
    constructor(){
        this.gameObjects = [];
        this.updateGameObjects = this.updateGameObjects.bind(this);
        this.getGameObjects = this.getGameObjects.bind(this);
        this.getGameObjectByID = this.getGameObjectByID.bind(this);
    }

    updateGameObjects(data){
        this.gameObjects = data;
    }

    getGameObjects(){
        return this.gameObjects
    }

    getGameObjectByID(id){
        for(let i in this.gameObjects){
            if(this.gameObjects[i].id == id){
                return this.gameObjects[i];
            }
        }
    }

}