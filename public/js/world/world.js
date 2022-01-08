
class World{
    constructor(){
        this.gameObjects = [];
        this.animationObjects = {}; //
        this.updateGameObjects = this.updateGameObjects.bind(this);
        this.getGameObjects = this.getGameObjects.bind(this);
        this.getGameObjectByID = this.getGameObjectByID.bind(this);
    }

    updateGameObjects(data){
        this.gameObjects = data;
        for(let i in data){
            if(!this.animationObjects.hasOwnProperty(data[i].id)){
                this.animationObjects[data[i].id] = {
                    tAccumulator : 0,
                    frame: 0
                }
            }
        }
    }

    getGameObjects(){
        return this.gameObjects
    }

    getAnimationObject(id){
        return this.animationObjects[id];
    }

    getGameObjectByID(id){
        for(let i in this.gameObjects){
            if(this.gameObjects[i].id == id){
                return this.gameObjects[i];
            }
        }
    }

}