const CollisionDetector = require("./collisions");
const Vector2 = require("./vector2");

const DP = 3; //default decimal place to round to

const round = (number, decimalPlaces)=>{
    let i = (Math.pow(10, decimalPlaces));

    return Math.round(number * i) / i
}

class PhysicsEngine {
    constructor(tickSpeed, roomList) {
        this.entities = {};
        this.rooms = roomList;
        this.collisionDetector = new CollisionDetector(this.rooms);

        this.tork = 5;
        this.maxV = 5;
        this.maxA = .5;
        this.jerk = 5000;
        this.frictionScale = 1;

        this.update = this.update.bind(this);
        this.addEntity = this.addEntity.bind(this);
        this.removeEntity = this.removeEntity.bind(this);
        this.getEntityList = this.getEntityList.bind(this);
    }

    update(deltaTime) {

        for (let i in this.entities) {

            //updating acceleration
                let deltaA = new Vector2(0, 0); //change in acceleration

                let controlled = { x: false, y: false };

                if (this.entities[i].hasOwnProperty('charController')) {
                    let inputs = this.entities[i].charController.keysDown;

                    if (inputs.w) {
                        deltaA.setY(deltaA.y - 1);
                        controlled.y = true;
                    }
                    if (inputs.s) {
                        deltaA.setY(deltaA.y + 1);
                        controlled.y = true;
                    }
                    if (inputs.a) {
                        deltaA.setX(deltaA.x - 1);
                        controlled.x = true;
                    }
                    if (inputs.d) {
                        deltaA.setX(deltaA.x + 1);
                        controlled.x = true;
                    }
                }

                let currentA = this.entities[i].acceleration;
                let currentV = this.entities[i].velocity;
                let currentPos = this.entities[i].position;

                let potentialAcceleration = new Vector2(round(currentA.x + (deltaA.x * this.jerk / deltaTime), DP), round(currentA.y + (deltaA.y * this.jerk / deltaTime), DP));

                if (controlled.x) {

                    if (potentialAcceleration.x > this.maxA) {
                        potentialAcceleration.setX(this.maxA);
                    } else if (potentialAcceleration.x < -this.maxA) {
                        potentialAcceleration.setX(-this.maxA);
                    }

                } else {

                    potentialAcceleration.setX(-(currentV.x * this.frictionScale))

                }

                if (controlled.y) {

                    if (potentialAcceleration.y > this.maxA) {
                        potentialAcceleration.setY(this.maxA);
                    } else if (potentialAcceleration.y < -this.maxA) {
                        potentialAcceleration.setY(-this.maxA);
                    }

                } else {

                    potentialAcceleration.setY(-(currentV.y * this.frictionScale))

                }

                this.entities[i].acceleration = potentialAcceleration;
                
                let potentialV = new Vector2(round(currentV.x + (this.entities[i].acceleration.x * this.tork / deltaTime), DP), round(currentV.y + (this.entities[i].acceleration.y * this.tork / deltaTime), DP));

                if(potentialV.x > this.maxV){
                    potentialV.setX(this.maxV);
                }else if(potentialV.x < -this.maxV){
                    potentialV.setX(-this.maxV);
                }

                if (potentialV.y > this.maxV) {
                    potentialV.setY(this.maxV);
                } else if (potentialV.y < -this.maxV) {
                    potentialV.setY(-this.maxV);
                }

                this.entities[i].velocity = potentialV;

                let potentialPos = new Vector2(round(currentPos.x + (this.entities[i].velocity.x / deltaTime), DP), round(currentPos.y + (this.entities[i].velocity.y / deltaTime), DP));

                let collisionResult = this.collisionDetector.solveCollision(this.entities[i], potentialPos);

                this.entities[i].position = new Vector2(collisionResult.position.x, collisionResult.position.y);
                if(collisionResult.collisionOccured.x){
                    this.entities[i].velocity.setX(0);
                    this.entities[i].acceleration.setX(0);
                }

                if(collisionResult.collisionOccured.y){
                    this.entities[i].velocity.setY(0);
                    this.entities[i].acceleration.setY(0);
                }
                

        }

    }

    addEntity(entity) {
        this.entities[entity.id] = entity;
    }

    removeEntity(id) {
        delete this.entities[id];
    }

    getEntityList() {
        return this.entities;
    }
}

module.exports = PhysicsEngine;