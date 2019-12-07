
let app;
class App {
    constructor() {
        // setup webGL with canvas to render everything
        this.webgl = new GlApp('view', 1080, 720, scene);
        // console.log(this.webgl);
        this.runGame();
    }

    runGame(){
        if(this.webgl.initialized){
            this.webgl.Render();
        }
        window.requestAnimationFrame(() => {
            console.log('frame');
            this.runGame();
        });
    }
}

function init() {
    app = new App();
}