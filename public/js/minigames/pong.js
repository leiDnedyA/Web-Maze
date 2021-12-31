

class PongInstance extends Minigame{
    constructor(instanceID, socket, canvas){
        super(instanceID, socket, canvas);

        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.serverStream = this.serverStream.bind(this);
    }

    update(deltaTime){
        console.log('wa')
        super.update(deltaTime);
        this.render();
    }

    render(){
        super.render();

    }

    serverStream(data){

    }
}