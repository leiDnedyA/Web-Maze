
class DrawingMinigameInstance extends Minigame{
    constructor(instanceID, socket, canvas){
        super(instanceID, socket, canvas);
    

        this.gameVars = {
            mouseDown : false
        }

        this.canvas.addEventListener("mousedown", this.handleMouseDown);
        this.canvas.addEventListener("mouseup", this.handleMouseUp);

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
    }

    handleMouseDown(e){
        console.log(`Mouse down at (${e.clientX}, ${e.clientY})`);
    }

    handleMouseUp(e) {
        console.log(`Mouse up at (${e.clientX}, ${e.clientY})`);
    }

    update(deltaTime){
        super.update(deltaTime);
        this.render();
    }

    render(){
        super.render();
    }
}