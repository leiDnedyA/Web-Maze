
const motionBlur = .7; //number between 0 and 1
const textMargin = 3;
const cameraPadding = 4;

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        this.tileSheet = new Image();
        this.tileMap = null;

        this.canvas.width = 1600/2;
        this.canvas.height = 900/2;

        this.unitSize = 30;
        this.textSize = 25;

        this.cameraOffset = new Vector2(0, 0);
        this.cameraTarget = null;

        this.render = this.render.bind(this);
        this.adjustCamera = this.adjustCamera.bind(this);
        this.renderTiles = this.renderTiles.bind(this);
        this.renderGameObjects = this.renderGameObjects.bind(this);
        this.renderNametag = this.renderNametag.bind(this);
        this.renderChats = this.renderChats.bind(this);
        this.setTileMap = this.setTileMap.bind(this);
        this.setTileSheetSRC = this.setTileSheetSRC.bind(this);
        this.relativePos = this.relativePos.bind(this);

    }

    render(gameObjects, chats) {

        //pre-rendering tasks
        this.adjustCamera(gameObjects);

        //clear the canvas
        this.ctx.fillStyle = `rgba(0, 0, 0, ${motionBlur})`
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.renderTiles();
        this.renderGameObjects(gameObjects);
        this.renderChats(chats, gameObjects);
    }

    renderTiles() {
        for (let i = 0; i < this.tileMap.rows; i++) {
            for (let j = 0; j < this.tileMap.cols; j++) {
                let sheetPos = this.tileMap.getTile(i, j);

                let adjPos = this.relativePos(new Vector2(j, i));

                this.ctx.drawImage(this.tileMap.tileSheet, sheetPos.x, sheetPos.y, sheetPos.height, sheetPos.width, adjPos.x * this.unitSize, adjPos.y * this.unitSize, this.unitSize, this.unitSize);
            }
        }
    }

    renderGameObjects(gameObjects) {
        for (let i in gameObjects) {
            this.ctx.fillStyle = 'red';

            let adjPos = this.relativePos(gameObjects[i].position)

            this.ctx.fillRect(adjPos.x * this.unitSize, adjPos.y * this.unitSize, this.unitSize, this.unitSize);
            this.renderNametag(gameObjects[i]);
        }
    }

    renderNametag(gameObject) {
        this.ctx.font = `${this.textSize}px sans`;
        this.ctx.fillStyle = 'white';

        let textWidth = this.ctx.measureText(gameObject.name).width;
        let parentAdjPos = this.relativePos(gameObject.position);

        this.ctx.fillText(gameObject.name, parentAdjPos.x * this.unitSize - (textWidth / 2) + this.unitSize / 2, parentAdjPos.y * this.unitSize - textMargin);
    }

    renderChats(chats, gameObjects){

        for(let i in chats){
            for(let j in gameObjects){
                if(gameObjects[j].id == chats[i].senderID){
                    let adjPos = this.relativePos(gameObjects[j].position);
                    this.ctx.fillStyle = 'white';

                    this.ctx.fillText(chats[i].message, adjPos.x * this.unitSize, (adjPos.y - 1) * this.unitSize);

                }
            }
        }
    }

    setTileMap(tileMap) {
        this.tileMap = new TileMap(tileMap, this.tileSheet);
    }

    adjustCamera(gameObjects) {

        for (let i in gameObjects) {
            if (gameObjects[i].id == this.cameraTarget) {

                //x axis

                if (gameObjects[i].position.x - cameraPadding < this.cameraOffset.x) {
                    this.cameraOffset.setX(gameObjects[i].position.x - cameraPadding)
                } else if ((gameObjects[i].position.x + 1 + cameraPadding) > (this.cameraOffset.x + (this.canvas.width / this.unitSize))) {
                    this.cameraOffset.setX(gameObjects[i].position.x - (this.canvas.width / this.unitSize) + 1 + cameraPadding);
                }

                //y axis
                if (gameObjects[i].position.y - cameraPadding < this.cameraOffset.y) {
                    this.cameraOffset.setY(gameObjects[i].position.y - cameraPadding)
                } else if ((gameObjects[i].position.y + 1 + cameraPadding) > (this.cameraOffset.y + (this.canvas.height / this.unitSize))) {
                    this.cameraOffset.setY(gameObjects[i].position.y - (this.canvas.height / this.unitSize) + 1 + cameraPadding);
                }


            }
        }
    }

    relativePos(pos) { //adjusts a world pos based on factors like the camera offset
        return new Vector2(pos.x - this.cameraOffset.x, pos.y - this.cameraOffset.y)
    }

    setCameraTargetID(id) {
        this.cameraTarget = id;
    }

    setTileSheetSRC(src) {
        this.tileSheet.src = src;
        this.tileMap.tileSheet.src = src;
    }
}