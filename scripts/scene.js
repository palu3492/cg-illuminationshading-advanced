
let scene1 = {
    camera: {
        position: glMatrix.vec3.fromValues(0.0, 1.8, 0.0),  // x, y, z
        direction: glMatrix.vec3.fromValues(0.0, 0.0, -1.0),  // vector pointing in direction camera is looking
        up: glMatrix.vec3.fromValues(0.0, 1.0, 0.0)  // vector pointing in camera's up direction
    },
    models: [
        {
            type: 'plane',
            shader: 'color',
            material: {
                color: glMatrix.vec3.fromValues(0.7, 0.1, 0.1),  // red, green, blue
                specular: glMatrix.vec3.fromValues(0.0, 0.0, 0.0),  // red, green, blue
                shininess: 1
            },
            center: glMatrix.vec3.fromValues(0.0, 0.0, -8.0),  // x, y, z
            size: glMatrix.vec3.fromValues(8.0, 1.0, 8.0)  // width, 1.0, depth
        },
        {
            type: 'sphere',
            shader: 'color',
            material: {
                color: glMatrix.vec3.fromValues(0.1, 0.4, 0.9),  // red, green, blue
                specular: glMatrix.vec3.fromValues(1.0, 1.0, 1.0),  // red, green, blue
                shininess: 20
            },
            center: glMatrix.vec3.fromValues(0.0, 1.0, -6.0), // x, y, z
            size: glMatrix.vec3.fromValues(2.0, 2.0, 2.0)  // width, height, depth
        },
        {
            type: 'sphere',
            shader: 'color',
            material: {
                color: glMatrix.vec3.fromValues(0.1, 0.4, 0.9),  // red, green, blue
                specular: glMatrix.vec3.fromValues(1.0, 1.0, 1.0),  // red, green, blue
                shininess: 20
            },
            center: glMatrix.vec3.fromValues(2.0, 0.5, -5.0), // x, y, z
            size: glMatrix.vec3.fromValues(1.0, 1.0, 1.0)  // width, height, depth
        },
        {
            type: 'cube',
            shader: 'color',
            material: {
                color: glMatrix.vec3.fromValues(0.1, 0.4, 0.9),  // red, green, blue
                specular: glMatrix.vec3.fromValues(1.0, 1.0, 1.0),  // red, green, blue
                shininess: 10
            },
            center: glMatrix.vec3.fromValues(-3.0, 0.5, -7.5), // x, y, z
            size: glMatrix.vec3.fromValues(1.0, 1.0, 1.0)  // width, height, depth
        },
        {
            type: 'cube',
            shader: 'color',
            material: {
                color: glMatrix.vec3.fromValues(0.1, 0.4, 0.9),  // red, green, blue
                specular: glMatrix.vec3.fromValues(1.0, 1.0, 1.0),  // red, green, blue
                shininess: 10
            },
            center: glMatrix.vec3.fromValues(0, 4, -5.5), // x, y, z
            size: glMatrix.vec3.fromValues(1.0, 1.0, 1.0)  // width, height, depth
        }
    ],
    light: {
        ambient: glMatrix.vec3.fromValues(0.5, 0.5, 0.5),  // red, green, blue
        point_lights: [
            {
                "position": [2.2, 2.5, -4.8],
                "color": [1.0, 1.0, 1.0]
            },
            {
                "position": [-1.5, 0.8, -3.1],
                "color": [1.0, 1.0, 1.0]
            }
        ]
    }
};