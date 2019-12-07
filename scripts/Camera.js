class Camera {
    constructor() {
        this.position = {
            x: 0,
            y: 0,
            z: 0
        };
        this.direction = {
            x: 0,
            y: 0,
            z: 0
        };
        this.up = {
            x: 0,
            y: 0,
            z: 0
        };

        this.setUp();
    }

    convertToWebGL(){
        return {
            position: glMatrix.vec3.fromValues(this.position.x, this.position.y, this.position.z),
            direction: glMatrix.vec3.fromValues(this.direction.x, this.direction.y, this.direction.z),
            up: glMatrix.vec3.fromValues(this.up.x, this.up.y, this.up.z)
        }
    }

    setUp(){
        this.position.x = 0.0;
        this.position.y = 1.8;
        this.position.z = 0.0;

        this.direction.x = 0.0;
        this.direction.y = 0.0;
        this.direction.z = -1.0;

        this.up.x = 0.0;
        this.up.y = 1.0;
        this.up.z = 0.0;

        this.convertToWebGL();
    }

}