
const roomSwitchDelay = .5; //in seconds

/* Handles all player actions other than movement and chat.
 Includes door requests(pressing space),  battle requests*/

class ActionsHandler{
    constructor(world){

        this.world = world;
        this.handleAllActions = this.handleAllActions.bind(this);

        this.handleDoorRequests = this.handleDoorRequests.bind(this);
    }

    handleAllActions(clientList, worldData){
        this.handleDoorRequests(clientList, worldData);
    }

    handleDoorRequests(clientList, worldData){
        for (let i in clientList){
            let player = clientList[i].getPlayer();
            if (player.charController.keysDown[' ']){
                if (Date.now() - clientList[i].lastRoomSwitch > roomSwitchDelay * 1000){ //puts delay on time between room switches
                    let room = worldData.roomList[clientList[i].room];
                    for (let j in room.doors) {

                        let door = room.doors[j];

                        //door[key] = [x, y] of door's entrance in room "key"

                        if(door){
                            console.log(door);
                            if(door.hasOwnProperty(room.name)){
                                let entrances = Object.keys(door);
                                let destination = '';
                                for(let j in entrances){
                                    if(entrances[j] !== room.name){
                                        destination = entrances[j];
                                    }
                                }
                                
                                

                                if (Math.abs(player.position.x - (door[room.name][0])) < 1 && Math.abs(player.position.y - (door[room.name][1])) < 1) {
                                    let exitPos = (door[destination] === []) ? [worldData.roomList[destination].startPos.x, worldData.roomList[destination].startPos.y] : door[destination];
                                    this.world.changeClientRoom(clientList[i], destination, exitPos);
                                }
                            }
                        }
                    }
                }
            
            }
        }
    }

}

module.exports = ActionsHandler;