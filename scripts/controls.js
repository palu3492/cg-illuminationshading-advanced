
// event handler for pressing arrow keys
document.addEventListener('keydown', OnKeyDown, false);

function OnKeyDown(event) {
    let dir;
    let rotate;
    switch (event.keyCode) {
        case 37: // LEFT Arrow
            rotate = glMatrix.mat4.create();
            glMatrix.mat4.rotate(rotate, rotate, Math.PI / 32, scene.camera.up);
            dir = glMatrix.vec4.fromValues(scene.camera.direction[0], scene.camera.direction[1],
                scene.camera.direction[2], 1.0);
            glMatrix.vec4.transformMat4(dir, dir, rotate);
            glMatrix.vec3.set(scene.camera.direction, dir[0], dir[1], dir[2]);
            glapp.UpdateScene(scene);
            break;
        case 38: // UP Arrow
            dir = glMatrix.vec3.create();
            glMatrix.vec3.scale(dir, scene.camera.direction, 0.5);
            glMatrix.vec3.add(scene.camera.position, scene.camera.position, dir);
            glapp.UpdateScene(scene);
            break;
        case 39: // RIGHT Arrow
            rotate = glMatrix.mat4.create();
            glMatrix.mat4.rotate(rotate, rotate, -Math.PI / 32, scene.camera.up);
            dir = glMatrix.vec4.fromValues(scene.camera.direction[0], scene.camera.direction[1],
                scene.camera.direction[2], 1.0);
            glMatrix.vec4.transformMat4(dir, dir, rotate);
            glMatrix.vec3.set(scene.camera.direction, dir[0], dir[1], dir[2]);
            glapp.UpdateScene(scene);
            break;
        case 40: // DOWN Arrow
            dir = glMatrix.vec3.create();
            glMatrix.vec3.scale(dir, scene.camera.direction, 0.5);
            glMatrix.vec3.subtract(scene.camera.position, scene.camera.position, dir);
            glapp.UpdateScene(scene);
            break;
        case 65: // A key
            dir = glMatrix.vec3.create();
            glMatrix.vec3.cross(dir, scene.camera.direction, scene.camera.up);
            glMatrix.vec3.scale(dir, dir, 0.5);
            glMatrix.vec3.subtract(scene.camera.position, scene.camera.position, dir);
            glapp.UpdateScene(scene);
            break;
        case 68: // D key
            dir = glMatrix.vec3.create();
            glMatrix.vec3.cross(dir, scene.camera.direction, scene.camera.up);
            glMatrix.vec3.scale(dir, dir, 0.5);
            glMatrix.vec3.add(scene.camera.position, scene.camera.position, dir);
            glapp.UpdateScene(scene);
            break;
    }
}