
class Controls {

    constructor(canvas, webgl, scene) {
        this.canvas = canvas;
        this.webgl = webgl;
        this.keys = {};
        this.scene = scene;
        this.pointerLockSetup();
    }

    pointerLockSetup(){
        // call from anonymous function to keep correct 'this'
        this.canvas.addEventListener('click', () => {this.lockPointer()}, false);

        document.addEventListener('pointerlockchange', () => {this.pointerLockChange()}, false);
        document.addEventListener('mozpointerlockchange', () => {this.pointerLockChange()}, false);
        document.addEventListener('webkitpointerlockchange', () => {this.pointerLockChange()}, false);

    }

    lockPointer(){
        this.canvas.requestPointerLock();
    }

    pointerLockChange(e){
        if (document.pointerLockElement === this.canvas ||
            document.mozPointerLockElement === this.canvas ||
            document.webkitPointerLockElement === this.canvas) {
            // Pointer was just locked
            // Enable the mousemove listener
            this.mouseMoveCaller = (e) => {this.mouseMove(e)};
            document.addEventListener("mousemove", this.mouseMoveCaller, false);
            this.keyDownCaller = (e) => {this.keyDown(e)};
            document.addEventListener("keydown", this.keyDownCaller, false);
            this.keyUpCaller = (e) => {this.keyUp(e)};
            document.addEventListener("keyup", this.keyUpCaller, false);
        } else {
            // Pointer was just unlocked
            // Disable the mousemove listener
            document.removeEventListener("mousemove", this.mouseMoveCaller, false);
            document.removeEventListener("keydown", this.keyDownCaller, false);
            document.removeEventListener("keyup", this.keyUpCaller, false);
        }
    }

    mouseMove(e){
        let movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
        // let movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
        // console.log(movementX);
        let dir;
        let rotate;
        let scene = this.scene.scene;

        rotate = glMatrix.mat4.create();
        glMatrix.mat4.rotate(rotate, rotate, (Math.PI / 100) * (-movementX/40), scene.camera.up);
        dir = glMatrix.vec4.fromValues(scene.camera.direction[0], scene.camera.direction[1],
            scene.camera.direction[2], 1.0);
        glMatrix.vec4.transformMat4(dir, dir, rotate);
        glMatrix.vec3.set(scene.camera.direction, dir[0], dir[1], dir[2]);

        this.scene.scene = scene;
    }

    keyDown(e){
        this.keys[e.keyCode] = true;
    }

    keyUp(e){
        delete this.keys[e.keyCode];
    }

    keyPressed(){
        let dir;
        let scene = this.scene.scene;
        // W, A, S, D
        for(let key in this.keys) {
            key = parseInt(key);
            // W
            if(key === 87){
                dir = glMatrix.vec3.create();
                glMatrix.vec3.scale(dir, scene.camera.direction, 0.2);
                glMatrix.vec3.add(scene.camera.position, scene.camera.position, dir);
            // S
            } else if(key === 83){
                dir = glMatrix.vec3.create();
                glMatrix.vec3.scale(dir, scene.camera.direction, 0.2);
                glMatrix.vec3.subtract(scene.camera.position, scene.camera.position, dir);
            // A
            } else if(key === 65){
                dir = glMatrix.vec3.create();
                glMatrix.vec3.cross(dir, scene.camera.direction, scene.camera.up);
                glMatrix.vec3.scale(dir, dir, 0.2);
                glMatrix.vec3.subtract(scene.camera.position, scene.camera.position, dir);
            // D
            } else if(key === 68){
                dir = glMatrix.vec3.create();
                glMatrix.vec3.cross(dir, scene.camera.direction, scene.camera.up);
                glMatrix.vec3.scale(dir, dir, 0.2);
                glMatrix.vec3.add(scene.camera.position, scene.camera.position, dir);
            }
        }
        this.scene.scene = scene;
    }
}