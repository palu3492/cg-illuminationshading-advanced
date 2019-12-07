
class Game {
    constructor(webgl, canvas) {
        this.webgl = webgl;
        this.canvas = canvas;

        this.pointerLockSetup();

    }

    pointerLockSetup(){
        // check if user supports pointer lock
        let havePointerLock = 'pointerLockElement' in document ||
            'mozPointerLockElement' in document ||
            'webkitPointerLockElement' in document;
        if(havePointerLock) {
            document.addEventListener('pointerlockchange', this.pointerLockChange, false);
            document.addEventListener('mozpointerlockchange', this.pointerLockChange, false);
            document.addEventListener('webkitpointerlockchange', this.pointerLockChange, false);

            this.canvas.requestPointerLock = this.canvas.requestPointerLock ||
                this.canvas.mozRequestPointerLock ||
                this.canvas.webkitRequestPointerLock;

            this.canvas.requestPointerLock();
        }
    }

    pointerLockChange(e){
        console.log('change');
        console.log(e);
        if (document.pointerLockElement === this.canvas ||
            document.mozPointerLockElement === this.canvas ||
            document.webkitPointerLockElement === this.canvas) {
            // Pointer was just locked
            // Enable the mousemove listener
            document.addEventListener("mousemove", this.mouseMove, false);
            console.log('add listener');
        } else {
            // Pointer was just unlocked
            // Disable the mousemove listener
            document.removeEventListener("mousemove", this.mouseMove, false);
            console.log('remove listener');
        }
    }

    mouseMove(){
        console.log('move');

        // let dir;
        // let rotate;
        // // LEFT Arrow
        // rotate = glMatrix.mat4.create();
        // glMatrix.mat4.rotate(rotate, rotate, Math.PI / 32, scene.camera.up);
        // dir = glMatrix.vec4.fromValues(scene.camera.direction[0], scene.camera.direction[1],
        //     scene.camera.direction[2], 1.0);
        // glMatrix.vec4.transformMat4(dir, dir, rotate);
        // glMatrix.vec3.set(scene.camera.direction, dir[0], dir[1], dir[2]);
        // glapp.UpdateScene(scene);

    }

    gameLoop(){
        console.log('Render');
        // this.webgl.scene.camera = scene1.camera;
        // this.webgl.scene.models = scene1.models;
        // this.webgl.scene.light = scene1.light;
        this.webgl.scene = scene1;
        this.webgl.UpdateScene();
        this.webgl.Render();

        // When done rendering, request next frame
        window.requestAnimationFrame(() => {
            this.gameLoop();
        });
    }
}