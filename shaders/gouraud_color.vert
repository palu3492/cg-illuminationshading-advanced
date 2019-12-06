#version 300 es

precision highp float;

in vec3 vertex_position;
in vec3 vertex_normal;

uniform vec3 light_ambient; // Ia
uniform vec3 light_position[10];
uniform vec3 light_color[10]; // Ip
uniform vec3 camera_position;
uniform float material_shininess; // n
uniform mat4 model_matrix;
uniform mat4 view_matrix; //the transformation of the camera
uniform mat4 projection_matrix;
uniform int light_count_vert;

out vec3 ambient;
// Ia * Ka
// light_ambient * material_color [fragment shader]
out vec3 diffuse[10];
// Ip * Kd * (N DOT L)
// light_color * material_color [fragment shader] * (normalized vertex_normal DOT normalized light direction)
out vec3 specular[10];
// Ip * (R DOT V)^n
// light_color * material_specular [fragment shader] * (normalized reflect light direction DOT normalized view direction)

void main() {
    //Do transformations to vertex position and normal
    //vertex by model matrix
    //normal by normal matrix (derive from model matrix)
    //flip so lightposition - vertex position

    // L, N, R, V
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
}
