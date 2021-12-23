
//Handles canvas/game interactions like clicking on players
class CanvasController{
    constructor(canvas, unitSize = 25){
        this.canvas = canvas;
        this.cameraOffset = new Vector2(0, 0)
        this.unitSize = unitSize; //unitSize is the scale of in-game units to pixels on the canvas
        this.contextMenuActivated = false;
        this.playerSelectCallback = null;
        this.contextMenu = new ContextMenu({
            "wave": (player) => {
                console.log(`wave to`);
            },
            "request battle": () => {
                
            }
        });
        
        this.start = this.start.bind(this);
        this.checkEntityMouseHover = this.checkEntityMouseHover.bind(this);
        this.setGameObjects = this.setGameObjects.bind(this);
        this.setCameraOffset = this.setCameraOffset.bind(this);

    }


   

    start(menuOptions){
        if(menuOptions){
            this.contextMenu.updateMenuOptions(menuOptions);
        }

        this.canvas.addEventListener('contextmenu', (e)=>{
            e.preventDefault();
            this.contextMenu.display({x: e.clientX, y: e.clientY});
        });

        this.canvas.addEventListener('click', (e)=>{
            
            let mousePosition = { x: e.offsetX, y: e.offsetY };

            let mouseOverCheck = this.checkEntityMouseHover(mousePosition);

            if(mouseOverCheck.status){
                this.contextMenu.display(mousePosition, { target: mouseOverCheck.targetIndex });
                console.log(mouseOverCheck.targetIndex)
            }else{
                this.contextMenu.hide();
            }
        })

        this.canvas.addEventListener('mousemove', (e)=>{
            if (this.checkEntityMouseHover(new Vector2(e.offsetX, e.offsetY)).status){
                this.canvas.style.cursor = "pointer";
            }else{
                this.canvas.style.cursor = "default";
            }
        })

    }
 
    checkEntityMouseHover(mousePos){

        let worldMousePos = new Vector2((mousePos.x / this.unitSize) + this.cameraOffset.x, (mousePos.y / this.unitSize) + this.cameraOffset.y)

        for(let i in this.gameObjects){
            let result = {'x': false, 'y': false};

            for(let j in result){

                if (worldMousePos[j] >= this.gameObjects[i].position[j]
                    && worldMousePos[j] <= this.gameObjects[i].position[j] + 1){
                        result[j] = true;
                    }
            }
            if(result.x && result.y){
                return {
                    status: true,
                    targetIndex: i
                }
            }
        }

        return {
            status: false,
            targetIndex: null
        };

    }

    //gameObjects should only contain entities that you want a mouseover event to occur on
    setGameObjects(gameObjects){
        this.gameObjects = gameObjects;
    }

    setCameraOffset(cameraOffset){
        this.cameraOffset = cameraOffset;
    }

}