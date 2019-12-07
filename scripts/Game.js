
class Game {
    constructor(webgl, canvas) {
        this.webgl = webgl;
        // this.canvas = canvas;
        this.scene = new Scene(webgl);

        this.controls = new Controls(canvas, this.webgl, this.scene);


        this.webgl.scene_setup = true;
    }

    gameLoop(){
        this.controls.keyPressed();

        this.scene.updateWebGLScene();
        this.webgl.UpdateScene();
        this.webgl.Render();

        // When done rendering, request next frame
        window.requestAnimationFrame(() => {
            this.gameLoop();
        });
    }
}