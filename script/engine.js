
/* NOTE: All update functions will be passed deltaTime as the first parameter*/
class Engine {
    constructor(tickSpeed){
        
        //var for deltaTime calc
        this.lastTime = Date.now();

        this.functionList = [];
        this.update = ()=>{

            //deltaTime calculations
            let currentTime = Date.now();
            let deltaTime = currentTime - this.lastTime;
            this.lastTime = currentTime;

            for(let i in this.functionList){
                this.functionList[i](deltaTime);
            }
        };

        this.tickSpeed = tickSpeed;



        //binding 'this' to both methods of the Engine class
        this.addUpdateFunc = this.addUpdateFunc.bind(this);
        this.start = this.start.bind(this);
    }

    start(){
        setInterval(this.update, 1000/this.tickSpeed)
    }

    addUpdateFunc(newUpdate){
        this.functionList.push(newUpdate);
    }
}

module.exports = Engine;