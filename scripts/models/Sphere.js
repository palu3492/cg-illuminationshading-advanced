class Sphere extends Model {
    constructor() {
        super('sphere', 'color');
        this.setUp();
    }

    setUp(){
        this.material.color.r = 0.1;
        this.material.color.g = 0.4;
        this.material.color.b = 0.9;

        this.material.specular.r = 1.0;
        this.material.specular.g = 1.0;
        this.material.specular.b = 1.0;

        this.material.shininess = 10;

        this.center.x = 2.0;
        this.center.y = 0.5;
        this.center.z = -5.0;

        this.size.w = 1.0;
        this.size.h = 1.0;
        this.size.d = 1.0;
        this.convertToWebGL();
    }


}