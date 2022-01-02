
//CLIENT!!

class DrawingMinigameInstance extends Minigame{
    constructor(instanceID, socket, canvas){
        super(instanceID, socket, canvas);
    
        this.config = {
            minPointDistance: 20,
            lineWidth: 10
        }

        this.gameVars = {
            currentLine: [],
            mouseDown : false
        }
        
        this.updateMousePos = this.updateMousePos.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.drawLine = this.drawLine.bind(this);
        this.resetGameVars = this.resetGameVars.bind(this);

        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        window.addEventListener('mouseup', this.handleMouseUp);
    
    }

    
    
    handleMouseDown(e){
        this.gameVars.mouseDown = true;
        this.updateMousePos(e);
    }

    updateMousePos(e){

        let currentMousePos = [e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop];
        if(this.gameVars.currentLine.length > 0){
            let lastCurrentLineIndex = this.gameVars.currentLine.length - 1;
            if (Math.abs(currentMousePos[0] - this.gameVars.currentLine[lastCurrentLineIndex][0]) >= this.config.minPointDistance || Math.abs(currentMousePos[1] - this.gameVars.currentLine[lastCurrentLineIndex][1]) >= this.config.minPointDistance) {
                this.gameVars.currentLine.push(currentMousePos);
            }
        }else{
            this.gameVars.currentLine.push(currentMousePos);
        }
        
    }

    handleMouseMove(e) {
        if (e.buttons !== 1) { return };
        this.updateMousePos(e);
    }

    handleMouseUp(e) {
        super.emitData({backgroundData: {}, gameUpdate: {newLine: this.gameVars.currentLine}});
        this.resetGameVars();
    }

    update(deltaTime){
        super.update(deltaTime);
        this.render();
    }

    render(){
        super.render();

        //render current line
        this.drawLine(this.gameVars.currentLine);
        

        //render lines from super.getGameData();
        let gameData = super.getGameData();

        for(let i in gameData){
            for(let j in gameData[i].lines){

                this.drawLine(gameData[i].lines[j]);
            }
        }

    }

    drawLine(line){
        if (line.length > 0) {
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = this.config.lineWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(line[0][0], line[0][1]);
            for (let i = 1; i < line.length; i++) {
                this.ctx.lineTo(line[i][0], line[i][1]);
            }
            this.ctx.stroke();
        }
    }

    resetGameVars() {
        this.gameVars.currentLine = [];
        this.gameVars.mouseDown = false;
    }

}