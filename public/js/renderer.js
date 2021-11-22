
class Renderer{
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = 1000;
        this.canvas.height = 500;

        this.unitSize = 30;

        this.render = this.render.bind(this);
    
    }

    render(gameObjects){
        this.ctx.fillStyle = 'rgba(255, 255, 255, .3)'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for(let i in gameObjects){
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(gameObjects[i].position.x * this.unitSize, gameObjects[i].position.y * this.unitSize, this.unitSize, this.unitSize);
        }
    }
}