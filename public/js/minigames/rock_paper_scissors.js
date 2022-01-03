
class RockPaperScissorsClient{
    constructor(instanceID, socket, canvas){
        this.instanceID = instanceID;
        this.socket = socket;
        this.canvas = canvas;

        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.serverStream = this.serverStream.bind(this);
    }

    update(deltaTime){
        this.render();
    }

    render(){

    }

    serverStream(data){

    }
}