#version 300 es

precision highp float;

in vec3 vertex_position;
in vec3 vertex_normal;

uniform mat4 model_matrix;
uniform mat4 view_matrix;
uniform mat4 projection_matrix;

out vec3 frag_pos;
out vec3 frag_normal;

void main() {
    vec3 transVertPos, transVertNorm;
    transVertPos = vec3(model_matrix*vec4(vertex_position,1.0));
    transVertNorm = inverse(transpose(mat3(model_matrix))) * vertex_normal;
    frag_pos = transVertPos;
    frag_normal = transVertNorm;
    gl_Position = projection_matrix * view_matrix * model_matrix * vec4(vertex_position, 1.0);
}
