
//Handles canvas/game interactions like clicking on players
class CanvasController{
    constructor(canvas, unitSize = 25, menuOptions){
        this.canvas = canvas;
        this.cameraOffset = new Vector2(0, 0)
        this.unitSize = unitSize; //unitSize is the scale of in-game units to pixels on the canvas
        this.contextMenuActivated = false;
        this.playerSelectCallback = null;
        this.contextMenu = new ContextMenu({
            "wave": (target) => {
                console.log(`wave to ${target.name}`);
            },
            "request battle": () => {
                
            }
        });

        this.start = this.start.bind(this);
        this.checkEntityMouseHover = this.checkEntityMouseHover.bind(this);
        this.setGameObjects = this.setGameObjects.bind(this);
        this.setCameraOffset = this.setCameraOffset.bind(this);
        this.setContextMenuOptions = this.setContextMenuOptions.bind(this);

    }


   

    start(menuOptions){
        if(menuOptions){
            this.setContextMenuOptions(menuOptions);
        }

        this.canvas.addEventListener('contextmenu', (e)=>{
            e.preventDefault();
            this.contextMenu.display({x: e.clientX, y: e.clientY});
        });

        this.canvas.addEventListener('click', (e)=>{
            
            let mousePosition = { x: e.offsetX, y: e.offsetY };

            let mouseOverCheck = this.checkEntityMouseHover(mousePosition);

            if(mouseOverCheck.status){
                this.contextMenu.display(mousePosition, { target: mouseOverCheck.target });
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


        /* 
        
            returns an objects structured as follows
            {
                status: boolean --> whether or not there is a target entity,
                target: gameObject of target

            }

        */

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
                    target: this.gameObjects[i]
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

    setContextMenuOptions(menuOptions){
        this.contextMenu.setMenuOptions(menuOptions);
    }

    setCameraOffset(cameraOffset){
        this.cameraOffset = cameraOffset;
    }

}