
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
                    for (let j in worldData.roomList[clientList[i].room].doors) {

                        let door = worldData.roomList[clientList[i].room].doors[j];

                        if(door){
                            if (Math.abs(player.position.x - (door.position[0])) < 1 && Math.abs(player.position.y - (door.position[1])) < 1) {
                                this.world.changeClientRoom(clientList[i], door.destination);
                            }
                        }
                    }
                }
            
            }
        }
    }

}

module.exports = ActionsHandler;