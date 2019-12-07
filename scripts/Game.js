
class Game {
    constructor(webgl, canvas) {
        this.webgl = webgl;
        // this.canvas = canvas;
        this.scene = new Scene(webgl);

        this.controls = new Controls(canvas, this.webgl, this.scene);


        this.webgl.scene_setup = true;
    }

    gameLoop(){
        // this.scene.models[0].center.x += 0.01;
        // this.scene.models[1].center.x -= 0.01;
        // this.scene.models[1].center.z -= 0.01;
        // this.scene.point_lights[0].position.x -= 0.01;
        this.controls.keyPressed();

        this.scene.convertToWebGLScene();
        this.scene.updateWebGLScene();
        this.webgl.UpdateScene();
        this.webgl.Render();

        // When done rendering, request next frame
        window.requestAnimationFrame(() => {
            this.gameLoop();
        });
    }
}