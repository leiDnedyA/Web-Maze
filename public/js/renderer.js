
const motionBlur = .7; //number between 0 and 1
const textMargin = 3;

class Renderer{
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        this.tileSheet = new Image();
        this.tileMap = null;

        this.canvas.width = 1000;
        this.canvas.height = 1000;

        this.unitSize = 30;
        this.textSize = 25;

        this.render = this.render.bind(this);
        this.renderTiles = this.renderTiles.bind(this);
        this.renderGameObjects = this.renderGameObjects.bind(this);
        this.renderNametag = this.renderNametag.bind(this);
        this.setTileMap = this.setTileMap.bind(this);
        this.setTileSheetSRC = this.setTileSheetSRC.bind(this);

    }

    render(gameObjects){
        
        //clear the canvas
        this.ctx.fillStyle = `rgba(0, 0, 0, ${motionBlur})`
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.renderTiles();
        this.renderGameObjects(gameObjects);           
    }

    renderTiles(){
        for(let i = 0; i < this.tileMap.rows; i++){
            for (let j = 0; j < this.tileMap.cols; j++){
                let sheetPos = this.tileMap.getTile(i, j);
                this.ctx.drawImage(this.tileMap.tileSheet, sheetPos.x, sheetPos.y, sheetPos.height, sheetPos.width, j * this.unitSize, i * this.unitSize, this.unitSize, this.unitSize);
            }
        }
    }

    renderGameObjects(gameObjects){
        for (let i in gameObjects) {
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(gameObjects[i].position.x * this.unitSize, gameObjects[i].position.y * this.unitSize, this.unitSize, this.unitSize);
            this.renderNametag(gameObjects[i]);
        }
    }

    renderNametag(gameObject){
        this.ctx.font = `${this.textSize}px sans`;
        this.ctx.fillStyle = 'white';
        let textWidth = this.ctx.measureText(gameObject.name).width;
        console.log(textWidth)
        this.ctx.fillText(gameObject.name, gameObject.position.x * this.unitSize - (textWidth / 2) + this.unitSize / 2, gameObject.position.y * this.unitSize - textMargin);
    }

    setTileMap(tileMap){
        this.tileMap = new TileMap(tileMap, this.tileSheet);
    }

    setTileSheetSRC(src){
        this.tileSheet.src = src;
        this.tileMap.tileSheet.src = src;
    }  
}