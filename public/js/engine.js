
class Engine{
    constructor(tickSpeed, updateFunc){
        this.tickSpeed = tickSpeed;

        this.updateFuncList = [updateFunc];

        this.start = this.start.bind(this);
        this.update = this.update.bind(this);
        this.addUpdateFunction = this.addUpdateFunction.bind(this);
    }

    start(){
        setInterval(this.update, 1000/this.tickSpeed);
    }

    update(){
        for(let i in this.updateFuncList){
            if ( typeof this.updateFuncList[i] == "function"){
                this.updateFuncList[i]();
            }else{
                console.log(`WARNING: your update function at index: ${i} IS NOT A FUNCTION!`);
            }
        }
    }

    addUpdateFunction(newFunc){
        this.updateFuncList.push(newFunc);
    }
}