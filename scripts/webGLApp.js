class GlApp {
    constructor(canvas_id, width, height, scene) {
        this.canvas = document.getElementById(canvas_id);
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl = this.canvas.getContext('webgl2');
        if (!this.gl) {
            alert('Unable to initialize WebGL 2. Your browser may not support it.');
        }

        this.scene = scene;
        this.algorithm = 'phong';
        this.shader = {
            phong_color: null, phong_texture: null
        };
        this.vertex_position_attrib = 0;
        this.vertex_normal_attrib = 1;
        this.vertex_texcoord_attrib = 2;

        //transform that moves and scales model into world coordinates
        this.projection_matrix = glMatrix.mat4.create();
        //defines where the virtual camera is
        this.view_matrix = glMatrix.mat4.create();
        //projection matrix
        this.model_matrix = glMatrix.mat4.create();

        this.vertex_array = { plane: null, cube: null, sphere: null };

        let phong_color_vs = this.GetFile('shaders/phong_color.vert');
        let phong_color_fs = this.GetFile('shaders/phong_color.frag');
        let phong_texture_vs = this.GetFile('shaders/phong_texture.vert');
        let phong_texture_fs = this.GetFile('shaders/phong_texture.frag');
        let emissive_vs = this.GetFile('shaders/emissive.vert');
        let emissive_fs = this.GetFile('shaders/emissive.frag');

        //loads and compiles stuff on graphics card
        Promise.all([phong_color_vs, phong_color_fs, phong_texture_vs, phong_texture_fs,emissive_vs, emissive_fs])
            .then((shaders) => this.LoadShaders(shaders))
            .catch((error) => console.log(error));

        this.initialized = false;
    }

    InitializeGlApp() {
        //where we want to draw in the canvas
        this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
        //erasing previous frame, putting light grey into framebuffer
        this.gl.clearColor(0.8, 0.8, 0.8, 1.0);
        //enables z-buffer
        this.gl.enable(this.gl.DEPTH_TEST);

        //creates the vertex array objects
        this.vertex_array.plane = CreatePlaneVao(this);
        this.vertex_array.cube = CreateCubeVao(this);
        this.vertex_array.sphere = CreateSphereVao(this);

        let fov = 45.0 * (Math.PI / 180.0);
        let aspect = this.canvas.width / this.canvas.height;
        //creates projections matrix based on field of view and aspect ratio
        glMatrix.mat4.perspective(this.projection_matrix, fov, aspect, 1.0, 50.0);

        let cam_pos = this.scene.camera.position;
        let cam_target = glMatrix.vec3.create();
        let cam_up = this.scene.camera.up;
        glMatrix.vec3.add(cam_target, cam_pos, this.scene.camera.direction);
        //sets vrp and vpn
        glMatrix.mat4.lookAt(this.view_matrix, cam_pos, cam_target, cam_up);

        this.initialized = true;
    }

    // InitializeTexture(image_url) {
    //     let texture = this.gl.createTexture();
    //
    //     this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    //     this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE,
    //         new Uint8Array([255, 255, 255, 255])); // make texture all white while image loads
    //     this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    //
    //     // load the actual image
    //     let image = new Image();
    //     image.crossOrigin = 'anonymous';
    //     image.addEventListener('load', (event) => {
    //         this.UpdateTexture(texture, image);
    //     }, false);
    //     image.src = image_url;
    //
    //     return texture;
    // }
    //
    // UpdateTexture(texture, image_element) {
    //     this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    //     this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA,this.gl.UNSIGNED_BYTE, image_element);
    //     this.gl.generateMipmap(this.gl.TEXTURE_2D);
    //     this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    //     this.Render(); // Render again with image this time
    // }

    Render() {
        //clear color and depth
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // draw all models --> note you need to properly select shader here
        // this will be dependent on the this.algorithm and the color/texture shader

        for (let i = 0; i < this.scene.models.length; i++) {

            //goroud or phong
            //loop through models
            //-based on texture undefined or not, run different scripts
            let shader = this.scene.models[i].shader; // 'color' or 'texture'

            let shaderType = 'emissive';
            if(this.algorithm !== 'emissive'){
                shaderType = this.algorithm+'_'+shader; // phong_color
            }

            //this tells us which program shader to use
            this.gl.useProgram(this.shader[shaderType].program);
            // console.log(this.scene.models[i].texture);

            // building up the model matrix, which is the translate and scale matrix
            glMatrix.mat4.identity(this.model_matrix);
            glMatrix.mat4.translate(this.model_matrix, this.model_matrix, this.scene.models[i].center);
            glMatrix.mat4.scale(this.model_matrix, this.model_matrix, this.scene.models[i].size);

            // Add texture to model
            if(shader === 'texture'){
                this.gl.uniform2fv(this.shader[shaderType].uniform.tex_scale, this.scene.models[i].texture.scale);
                this.gl.bindTexture(this.gl.TEXTURE_2D, null);
                let texture = this.scene.models[i].texture.id;
                this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
                // this.gl.activeTexture(this.gl.TEXTURE0);
            }

            //uniforms are global per model values
            //uploads information to the graphics card: uniform data per model
            //three floating values representing model color r,g,b

            // model
            this.gl.uniform3fv(this.shader[shaderType].uniform.material_col, this.scene.models[i].material.color);
            this.gl.uniform3fv(this.shader[shaderType].uniform.material_spec, this.scene.models[i].material.specular);
            this.gl.uniform1f(this.shader[shaderType].uniform.shininess, this.scene.models[i].material.shininess);
            // camera
            this.gl.uniform3fv(this.shader[shaderType].uniform.camera_pos, this.scene.camera.position);
            // lights
            this.gl.uniform3fv(this.shader[shaderType].uniform.light_ambient, this.scene.light.ambient);
            let program = this.shader[shaderType].program;
            this.gl.uniform1i(this.gl.getUniformLocation(program, 'light_count_vert'), this.scene.light.point_lights.length);
            this.gl.uniform1i(this.gl.getUniformLocation(program, 'light_count_frag'), this.scene.light.point_lights.length);
            for(let l=0;l<this.scene.light.point_lights.length;l++){
                let light_col_uniform = this.gl.getUniformLocation(program, 'light_color['+l+']');
                let camera_pos_uniform = this.gl.getUniformLocation(program, 'light_position['+l+']');
                this.gl.uniform3fv(camera_pos_uniform, this.scene.light.point_lights[l].position);
                this.gl.uniform3fv(light_col_uniform, this.scene.light.point_lights[l].color);
            }

            //parameters (shader's variable, transpose, actual 16 values to be 4x4matrix)
            this.gl.uniformMatrix4fv(this.shader[shaderType].uniform.projection, false, this.projection_matrix);
            this.gl.uniformMatrix4fv(this.shader[shaderType].uniform.view, false, this.view_matrix);
            this.gl.uniformMatrix4fv(this.shader[shaderType].uniform.model, false, this.model_matrix);

            this.gl.bindVertexArray(this.vertex_array[this.scene.models[i].type]);
            this.gl.drawElements(this.gl.TRIANGLES, this.vertex_array[this.scene.models[i].type].face_index_count, this.gl.UNSIGNED_SHORT, 0);
            this.gl.bindVertexArray(null);
        }
        //leave this hardcoded for the lights
        // draw all light sources
        for (let i = 0; i < this.scene.light.point_lights.length; i++) {
            this.gl.useProgram(this.shader['emissive'].program);

            glMatrix.mat4.identity(this.model_matrix);
            glMatrix.mat4.translate(this.model_matrix, this.model_matrix, this.scene.light.point_lights[i].position);
            glMatrix.mat4.scale(this.model_matrix, this.model_matrix, glMatrix.vec3.fromValues(0.1, 0.1, 0.1));

            this.gl.uniform3fv(this.shader['emissive'].uniform.material, this.scene.light.point_lights[i].color);
            this.gl.uniformMatrix4fv(this.shader['emissive'].uniform.projection, false, this.projection_matrix);
            this.gl.uniformMatrix4fv(this.shader['emissive'].uniform.view, false, this.view_matrix);
            this.gl.uniformMatrix4fv(this.shader['emissive'].uniform.model, false, this.model_matrix);

            this.gl.bindVertexArray(this.vertex_array['sphere']);
            this.gl.drawElements(this.gl.TRIANGLES, this.vertex_array['sphere'].face_index_count, this.gl.UNSIGNED_SHORT, 0);
            this.gl.bindVertexArray(null);
        }
    }

    UpdateScene(scene) {
        this.scene = scene;

        let cam_pos = this.scene.camera.position;
        let cam_target = glMatrix.vec3.create();
        let cam_up = this.scene.camera.up;
        glMatrix.vec3.add(cam_target, cam_pos, this.scene.camera.direction);
        glMatrix.mat4.lookAt(this.view_matrix, cam_pos, cam_target, cam_up);

        // this.Render();
    }

    GetFile(url) {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200) {
                    resolve(req.response);
                }
                else if (req.readyState === 4) {
                    reject({ url: req.responseURL, status: req.status });
                }
            };
            req.open('GET', url, true);
            req.send();
        });
    }

    LoadShaders(shaders) {
        this.LoadColorShader(shaders[0], shaders[1], 'phong_color');
        this.LoadTextureShader(shaders[2], shaders[3], 'phong_texture');
        this.LoadEmissiveShader(shaders[4], shaders[5], 'emissive');

        this.InitializeGlApp();
    }

    LoadColorShader(vs_source, fs_source, program_name) {
        let vertex_shader = this.CompileShader(vs_source, this.gl.VERTEX_SHADER);
        let fragment_shader = this.CompileShader(fs_source, this.gl.FRAGMENT_SHADER);

        let program = this.CreateShaderProgram(vertex_shader, fragment_shader);

        this.gl.bindAttribLocation(program, this.vertex_position_attrib, 'vertex_position');
        this.gl.bindAttribLocation(program, this.vertex_normal_attrib, 'vertex_normal');
        this.gl.bindAttribLocation(program, 0, 'FragColor');

        this.LinkShaderProgram(program);

        let light_ambient_uniform = this.gl.getUniformLocation(program, 'light_ambient');
        let light_pos_uniform = this.gl.getUniformLocation(program, 'light_position');
        let light_col_uniform = this.gl.getUniformLocation(program, 'light_color');
        let camera_pos_uniform = this.gl.getUniformLocation(program, 'camera_position');
        let material_col_uniform = this.gl.getUniformLocation(program, 'material_color');
        let material_spec_uniform = this.gl.getUniformLocation(program, 'material_specular');
        let shininess_uniform = this.gl.getUniformLocation(program, 'material_shininess');
        let projection_uniform = this.gl.getUniformLocation(program, 'projection_matrix');
        let view_uniform = this.gl.getUniformLocation(program, 'view_matrix');
        let model_uniform = this.gl.getUniformLocation(program, 'model_matrix');

        this.shader[program_name] = {
            program: program,
            uniform: {
                light_ambient: light_ambient_uniform,
                light_pos: light_pos_uniform,
                light_col: light_col_uniform,
                camera_pos: camera_pos_uniform,
                material_col: material_col_uniform,
                material_spec: material_spec_uniform,
                shininess: shininess_uniform,
                projection: projection_uniform,
                view: view_uniform,
                model: model_uniform
            }
        };
    }

    LoadTextureShader(vs_source, fs_source, program_name) {
        let vertex_shader = this.CompileShader(vs_source, this.gl.VERTEX_SHADER);
        let fragment_shader = this.CompileShader(fs_source, this.gl.FRAGMENT_SHADER);

        let program = this.CreateShaderProgram(vertex_shader, fragment_shader);

        this.gl.bindAttribLocation(program, this.vertex_position_attrib, 'vertex_position');
        this.gl.bindAttribLocation(program, this.vertex_normal_attrib, 'vertex_normal');
        this.gl.bindAttribLocation(program, this.vertex_texcoord_attrib, 'vertex_texcoord');
        this.gl.bindAttribLocation(program, 0, 'FragColor');

        this.LinkShaderProgram(program);

        let light_ambient_uniform = this.gl.getUniformLocation(program, 'light_ambient');
        let light_pos_uniform = this.gl.getUniformLocation(program, 'light_position');
        let light_col_uniform = this.gl.getUniformLocation(program, 'light_color');
        let camera_pos_uniform = this.gl.getUniformLocation(program, 'camera_position');
        let material_col_uniform = this.gl.getUniformLocation(program, 'material_color');
        let material_spec_uniform = this.gl.getUniformLocation(program, 'material_specular');
        let tex_scale_uniform = this.gl.getUniformLocation(program, 'texture_scale');
        let image_uniform = this.gl.getUniformLocation(program, 'image');
        let shininess_uniform = this.gl.getUniformLocation(program, 'material_shininess');
        let projection_uniform = this.gl.getUniformLocation(program, 'projection_matrix');
        let view_uniform = this.gl.getUniformLocation(program, 'view_matrix');
        let model_uniform = this.gl.getUniformLocation(program, 'model_matrix');

        this.shader[program_name] = {
            program: program,
            uniform: {
                light_ambient: light_ambient_uniform,
                light_pos: light_pos_uniform,
                light_col: light_col_uniform,
                camera_pos: camera_pos_uniform,
                material_col: material_col_uniform,
                material_spec: material_spec_uniform,
                tex_scale: tex_scale_uniform,
                image: image_uniform,
                shininess: shininess_uniform,
                projection: projection_uniform,
                view: view_uniform,
                model: model_uniform
            }
        };
    }

    LoadEmissiveShader(vs_source, fs_source, program_name) {
        let vertex_shader = this.CompileShader(vs_source, this.gl.VERTEX_SHADER);
        let fragment_shader = this.CompileShader(fs_source, this.gl.FRAGMENT_SHADER);

        let program = this.CreateShaderProgram(vertex_shader, fragment_shader);

        this.gl.bindAttribLocation(program, this.vertex_position_attrib, 'vertex_position');
        this.gl.bindAttribLocation(program, 0, 'FragColor');

        this.LinkShaderProgram(program);

        let material_uniform = this.gl.getUniformLocation(program, 'material_color');
        let projection_uniform = this.gl.getUniformLocation(program, 'projection_matrix');
        let view_uniform = this.gl.getUniformLocation(program, 'view_matrix');
        let model_uniform = this.gl.getUniformLocation(program, 'model_matrix');

        this.shader[program_name] = {
            program: program,
            uniform: {
                material: material_uniform,
                projection: projection_uniform,
                view: view_uniform,
                model: model_uniform
            }
        };
    }

    CompileShader(source, type) {
        // Create a shader object
        let shader = this.gl.createShader(type);

        // Send the source to the shader object
        this.gl.shaderSource(shader, source);

        // Compile the shader program
        this.gl.compileShader(shader);

        // Check to see if it compiled successfully
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shader: ' + this.gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    CreateShaderProgram(vertex_shader, fragment_shader) {
        let program = this.gl.createProgram();
        this.gl.attachShader(program, vertex_shader);
        this.gl.attachShader(program, fragment_shader);

        return program;
    }

    LinkShaderProgram(program) {
        this.gl.linkProgram(program);

        // Check to see if it linked successfully
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            alert('An error occurred linking the shader program.');
        }
    }
}
