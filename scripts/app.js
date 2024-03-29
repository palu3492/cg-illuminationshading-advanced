
class App {
    constructor() {
        // let scene = new Scene();
        // console.log(scene.scene);
        let canvas = document.getElementById('view');
        this.webgl = new WebGLApp(canvas, 1080, 720); // Renders everything
        this.game = new Game(this.webgl, canvas); // Controls game logic
    }
}

let app_;
function initApp() {
    app_ = new App();
    // Wait for WebGL to be initialized
    app_.webgl.initPromise.then(() => {
        app_.game.gameLoop(); // start game loop
    });
}