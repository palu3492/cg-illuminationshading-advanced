class Sphere {
    constructor() {
        this.model = {
            type: 'sphere',
            shader: 'color',
            material: {
                color: glMatrix.vec3.fromValues(0.1, 0.4, 0.9),  // red, green, blue
                specular: glMatrix.vec3.fromValues(1.0, 1.0, 1.0),  // red, green, blue
                shininess: 20
            },
            center: glMatrix.vec3.fromValues(2.0, 0.5, -5.0), // x, y, z
            size: glMatrix.vec3.fromValues(1.0, 1.0, 1.0)  // width, height, depth
        }
    }


}