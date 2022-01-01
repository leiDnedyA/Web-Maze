
//CLIENT!!

class DrawingMinigameInstance extends Minigame{
    constructor(instanceID, socket, canvas){
        super(instanceID, socket, canvas);
    

        this.gameVars = {
            mousePos : {
                x: null,
                y: null,
            }
        }

        
        
        this.updateMousePos = this.updateMousePos.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
    
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mousedown', this.updateMousePos);
    
    }

    
    
    updateMousePos(e){
        this.gameVars.mousePos.x = e.clientX;
        this.gameVars.mousePos.y = e.clientY;
        super.emitData({ backgroundData: {}, gameData: { mousePos: this.gameVars.mousePos } });
    }

    handleMouseMove(e) {
        if (e.buttons !== 1) { return };
        this.updateMousePos(e);
    }

    update(deltaTime){
        super.update(deltaTime);
        this.render();
    }

    render(){
        super.render();
    }
}