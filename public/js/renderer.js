
const motionBlur = .8; //number between 0 and 1
const textMargin = 3;
const cameraPadding = 5;
const backgroundColor = '#000210';
const textColor = '#db2e2e';

const playerTile = 0;
const backgroundTile = 1;

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        this.tileSheet = new Image();
        this.tileMap = null;

        this.canvas.width = 1600/2;
        this.canvas.height = 900/2;

        //throwing the kitchen sink at the canvas image scaling problem VVV
        this.canvas.style.cssText = 'image-rendering: optimizeSpeed;' + // FireFox < 6.0
            'image-rendering: -moz-crisp-edges;' + // FireFox
            'image-rendering: -o-crisp-edges;' +  // Opera
            'image-rendering: -webkit-crisp-edges;' + // Chrome
            'image-rendering: crisp-edges;' + // Chrome
            'image-rendering: -webkit-optimize-contrast;' + // Safari
            'image-rendering: pixelated; ' + // Future browsers
            '-ms-interpolation-mode: nearest-neighbor;'; // IE

        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;

        this.unitSize = 30;
        this.textSize = 25;

        this.canvasSizeUnits = [this.canvas.width / this.unitSize, this.canvas.height / this.unitSize];

        this.cameraOffset = new Vector2(0, 0);
        this.cameraTarget = null;

        this.adjustedTileMap = {
            offset: [0, 0],
            croppedMap: null
        };

        this.render = this.render.bind(this);
        this.adjustCamera = this.adjustCamera.bind(this);
        this.renderTiles = this.renderTiles.bind(this);
        this.renderGameObjects = this.renderGameObjects.bind(this);
        this.renderNametag = this.renderNametag.bind(this);
        this.renderChats = this.renderChats.bind(this);
        this.setTileMap = this.setTileMap.bind(this);
        this.setTileSheetSRC = this.setTileSheetSRC.bind(this);
        this.relativePos = this.relativePos.bind(this);
        this.adjustTileMap = this.adjustTileMap.bind(this);
        this.checkWorldPosOnscreen = this.checkWorldPosOnscreen.bind(this);

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

        // old way of rendering
        // for (let i = 0; i < this.tileMap.rows; i++) {
        //     for (let j = 0; j < this.tileMap.cols; j++) {

        //         let adjPos = this.relativePos(new Vector2(j, i));
                
        //         let sheetPos = this.tileMap.getTile(i, j);
        //         this.ctx.drawImage(this.tileMap.tileSheet, sheetPos.x, sheetPos.y, sheetPos.height, sheetPos.width, adjPos.x * this.unitSize, adjPos.y * this.unitSize, this.unitSize, this.unitSize);
        //     }
        // }

        let testMap = this.adjustedTileMap;

        let offset = [this.cameraOffset.x - Math.floor(this.cameraOffset.x), this.cameraOffset.y - Math.floor(this.cameraOffset.y)];

        //optimized rendering
        for (let i = 0; i < testMap.cols; i++){
            for(let j = 0; j < testMap.rows; j++){
                let t = testMap.tiles[i * (testMap.rows) + j];
                let args = [(i - offset[0]) * this.unitSize, (j - offset[1]) * this.unitSize, this.unitSize, this.unitSize];
                if(t == -1){
                    this.ctx.fillStyle = backgroundColor;
                    // this.ctx.fillRect(...args);

                    let sheetPos = this.tileMap.getTileFromSheet(backgroundTile);
                    this.ctx.drawImage(this.tileMap.tileSheet, sheetPos.x, sheetPos.y, sheetPos.height, sheetPos.width, ...args);
                } else {
                    let sheetPos = this.tileMap.getTileFromSheet(t);
                    this.ctx.drawImage(this.tileMap.tileSheet, sheetPos.x, sheetPos.y, sheetPos.height, sheetPos.width, ...args);
                }
            }
        }
    }

    renderGameObjects(gameObjects) {
        for (let i in gameObjects) {
            this.ctx.fillStyle = 'red';


            if(this.checkWorldPosOnscreen(gameObjects[i].position)){
                let adjPos = this.relativePos(gameObjects[i].position);
                let sheetPos = this.tileMap.getTileFromSheet(playerTile);
                this.ctx.drawImage(this.tileMap.tileSheet, sheetPos.x, sheetPos.y, sheetPos.height, sheetPos.width, adjPos.x * this.unitSize, adjPos.y * this.unitSize, this.unitSize, this.unitSize);

                // this.ctx.fillRect(adjPos.x * this.unitSize, adjPos.y * this.unitSize, this.unitSize, this.unitSize);
                this.renderNametag(gameObjects[i]);
            }

            

            
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
                    if(this.checkWorldPosOnscreen(gameObjects[j].position)){
                        let adjPos = this.relativePos(gameObjects[j].position);
                        this.ctx.fillStyle = 'white';

                        this.ctx.fillText(chats[i].message, adjPos.x * this.unitSize, (adjPos.y - 1) * this.unitSize);
                    }
                }
            }
        }
    }

    setTileMap(tileMap) {
        this.tileMap = new TileMap(tileMap, this.tileSheet);
        this.adjustTileMap();
    }


    /**
     * Adjusts the cropped version of this.tileMap and stores it in this.adjustedTileMap
     * to optimize rendering.
     */
    adjustTileMap(){ //should be called every time camera is adjusted

        let getIndexFromCoords = (coords, dimensions)=>{
            for(let i in coords){
                if(coords[i] < 0 || coords[i] >= dimensions[i]){
                    return null;
                }
            }
            return (parseInt(dimensions[0]) * parseInt(coords[1]) + parseInt(coords[0]));
        }

        let offset = [Math.floor(this.cameraOffset.x), Math.floor(this.cameraOffset.y)];
        this.adjustedTileMap.offset = offset;
        let dimensions = [Math.ceil(this.canvasSizeUnits[0]) + 3, Math.ceil(this.canvasSizeUnits[1]) + 3];

        // console.log(dimensions);

        
        let adjTiles = [];

        // console.log(offset);
        for(let i = 0; i < dimensions[0]; i++){
            for(let j = 0; j < dimensions[1]; j++){
                let index = getIndexFromCoords([i + offset[0], j + offset[1]], [this.tileMap.cols, this.tileMap.rows]);
                let t = this.tileMap.tiles[index];
                if(index !== NaN && t){
                    adjTiles.push(t);
                }else{
                    adjTiles.push(-1);
                }     
            }
        }
        
        let map = {
            cols: dimensions[0],
            rows: dimensions[1],
            tsize: this.tileMap.tsize,
            tiles: adjTiles
        };
        // console.log(adjTiles)
        this.adjustedTileMap = new TileMap(map, this.tileMap.tileSheet);

    }

    adjustCamera(gameObjects) {

        let cameraChanged = false;

        for (let i in gameObjects) {
            if (gameObjects[i].id == this.cameraTarget) {

                //x axis

                if (gameObjects[i].position.x - cameraPadding < this.cameraOffset.x) {
                    this.cameraOffset.setX(gameObjects[i].position.x - cameraPadding)
                    cameraChanged = true;
                } else if ((gameObjects[i].position.x + 1 + cameraPadding) > (this.cameraOffset.x + (this.canvas.width / this.unitSize))) {
                    this.cameraOffset.setX(gameObjects[i].position.x - (this.canvas.width / this.unitSize) + 1 + cameraPadding);
                    cameraChanged = true;
                }

                //y axis
                if (gameObjects[i].position.y - cameraPadding < this.cameraOffset.y) {
                    this.cameraOffset.setY(gameObjects[i].position.y - cameraPadding)
                    cameraChanged = true;
                } else if ((gameObjects[i].position.y + 1 + cameraPadding) > (this.cameraOffset.y + (this.canvas.height / this.unitSize))) {
                    this.cameraOffset.setY(gameObjects[i].position.y - (this.canvas.height / this.unitSize) + 1 + cameraPadding);
                    cameraChanged = true;
                }


            }
            if(cameraChanged){
                this.adjustTileMap();
            }
        }
    }

    /**
     * Checks if a world position is visible within the bounds of the canvas.
     * 
     * @param {Vector2} pos worldPos
     * @returns {boolean} true --> visible on screen, false --> not visible on screen
     */
    checkWorldPosOnscreen(pos){

        let adjPos = this.relativePos(pos);
        adjPos.setX(adjPos.x * this.unitSize);
        adjPos.setY(adjPos.y * this.unitSize);

        if(adjPos.x < 0 || adjPos.x > this.canvas.width || adjPos.y < 0 || adjPos.y > this.canvas.height){
            return false;
        }
        return true;
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