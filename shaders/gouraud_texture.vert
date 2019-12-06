#version 300 es

precision highp float;

in vec3 vertex_position;
in vec3 vertex_normal;
in vec2 vertex_texcoord;

uniform vec3 light_ambient;
uniform vec3 light_position[10];
uniform vec3 light_color[10];
uniform vec3 camera_position;
uniform float material_shininess;
uniform vec2 texture_scale;
uniform mat4 model_matrix;
uniform mat4 view_matrix;
uniform mat4 projection_matrix;
uniform int light_count_vert;

out vec3 ambient;
out vec3 diffuse[10];
out vec3 specular[10];
out vec2 frag_texcoord;

void main() {

    vec3 lightVector, surfaceNormalVector, reflectLightVector, viewVector, transVertPos, transVertNorm;
    transVertPos = vec3(model_matrix*vec4(vertex_position,1.0));
    transVertNorm = inverse(transpose(mat3(model_matrix))) * vertex_normal;
    for(int i=0;i<light_count_vert;i++){
        // For diffuse
        lightVector = normalize(light_position[i] - transVertPos); // L vector
        surfaceNormalVector = normalize(transVertNorm); // N vector
        // For specular
        //negative reflect light vector fixed this, but we don't know why
        reflectLightVector = normalize(-reflect(lightVector, surfaceNormalVector)); // R vector
        viewVector = normalize(camera_position - transVertPos); // V vector

        diffuse[i] = light_color[i] * clamp(dot(surfaceNormalVector, lightVector),0.0,1.0);
        specular[i] = light_color[i] * pow(dot(reflectLightVector, viewVector), material_shininess);
    }
    ambient = light_ambient;

    gl_Position = projection_matrix * view_matrix * model_matrix * vec4(vertex_position, 1.0);
    frag_texcoord = vertex_texcoord * texture_scale;
}
