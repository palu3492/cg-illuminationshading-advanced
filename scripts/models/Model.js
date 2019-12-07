class Model {
    constructor(type, shader) {
        this.type = type;
        this.shader = shader;
        this.material = {
            color: {
                r: 0,
                g: 0,
                b: 0
            },
            specular: {
                r: 0, // red
                g: 0, // green
                b: 0 // blue
            },
            shininess: 0
        };
        this.center = {
            x: 0,
            y: 0,
            z: 0
        };
        this.size = {
            w: 0, // width
            h: 0, // height
            d: 0 // depth
        };
        this.convertToWebGL();
    }

    convertToWebGL(){
        this.webGLRepresenation = {
            type: this.type,
            shader: this.shader,
            material: {
                color: glMatrix.vec3.fromValues(this.material.color.r, this.material.color.g, this.material.color.b),  // red, green, blue
                specular: glMatrix.vec3.fromValues(this.material.specular.r, this.material.specular.g, this.material.specular.b),  // red, green, blue
                shininess: this.material.shininess
            },
            center: glMatrix.vec3.fromValues(this.center.x, this.center.y, this.center.z), // x, y, z
            size: glMatrix.vec3.fromValues(this.size.w, this.size.h, this.size.d)
        }
    }


}