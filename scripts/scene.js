class Scene {
    constructor(webgl) {
        this.webgl = webgl;


        this.models = [];
        this.point_lights = [];

        this.setScene();
        this.convertToWebGLScene();
    }

    setScene(){
        this.scene_ = {
            models: [],
            light : {
                ambient: glMatrix.vec3.fromValues(0.5, 0.5, 0.5),
                point_lights: []
            }
        };

        let cube = new Cube();
        let sphere = new Sphere();
        this.models.push(cube);
        this.models.push(sphere);

        let point_light = new PointLight();
        this.point_lights.push(point_light);

        this.camera = new Camera();
        this.scene_.camera = this.camera.convertToWebGL();
    }

    convertToWebGLScene(){
        this.scene_.models = [];
        this.models.forEach(model => {
            this.scene_.models.push(
                model.convertToWebGL()
            );
        });

        this.scene_.light.point_lights = [];
        this.point_lights.forEach(light => {
            this.scene_.light.point_lights.push(
                light.convertToWebGL()
            );
        });
    }

    get scene(){
        return this.scene_;
    }

    set scene(scene){
        this.scene_ = scene;
    }

    // set camera(camera){
    //     this.scene_.camera = camera;
    // }

    addModel(model){
        this.scene_.models.push(model);
    }

    addPointLight(light){
        this.scene_.light.point_lights.push(light);
    }

    updateWebGLScene(){
        this.webgl.scene = this.scene_;
    }
}