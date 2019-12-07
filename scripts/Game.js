
class Game {
    constructor(webgl, canvas) {
        this.webgl = webgl;
        // this.canvas = canvas;
        this.controls = new Controls(canvas, this.webgl);

    }

    gameLoop(){
        this.controls.checkChange();
        // console.log('Render');
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