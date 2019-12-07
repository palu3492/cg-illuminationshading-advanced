class PointLight {
    constructor() {

        this.position = {
            x: 0,
            y: 0,
            z: 0
        };
        this.color = {
            r: 0,
            g: 0,
            b: 0
        };

        this.setUp();
        this.convertToWebGL();
    }

    convertToWebGL(){
        return {
            position: [this.position.x, this.position.y, this.position.z],
            color: [this.color.r, this.color.g, this.color.b]
        }
    }

    setUp(){
        this.position.x = 2.2;
        this.position.y = 2.5;
        this.position.z = -4.8;

        this.color.r = 1.0;
        this.color.g = 1.0;
        this.color.b = 1.0;
    }
}