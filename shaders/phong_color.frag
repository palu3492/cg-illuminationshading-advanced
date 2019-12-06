#version 300 es

precision mediump float;

in vec3 frag_pos;
in vec3 frag_normal;

uniform vec3 light_ambient;
uniform vec3 light_position[10];
uniform vec3 light_color[10];
uniform vec3 camera_position;
uniform vec3 material_color;      // Ka and Kd
uniform vec3 material_specular;   // Ks
uniform float material_shininess; // n
uniform int light_count_frag;

out vec4 FragColor;

void main() {
    vec3 diffuse, specular, lightVector, surfaceNormalVector, reflectLightVector, viewVector;

    vec3 illumination;
    for(int i=0;i<light_count_frag;i++){
        lightVector = normalize(light_position[i] - frag_pos);// L vector
        surfaceNormalVector = normalize(frag_normal);// N vector

        reflectLightVector = normalize(-reflect(lightVector, surfaceNormalVector));// R vector
        viewVector = normalize(camera_position - frag_pos);// V vector

        diffuse = light_color[i] * clamp(dot(surfaceNormalVector, lightVector), 0.0, 1.0);
        specular = light_color[i] * pow(dot(reflectLightVector, viewVector), material_shininess);

        vec3 diffuseNew = diffuse*material_color;
        vec3 diffuseClamped = clamp(diffuseNew, vec3 (0.0, 0.0, 0.0), vec3 (1.0, 1.0, 1.0));

        vec3 specularNew = specular*material_specular;
        vec3 specularClamped = clamp(specularNew, vec3 (0.0, 0.0, 0.0), vec3 (1.0, 1.0, 1.0));

        illumination += diffuseClamped + specularClamped;
    }
    vec3 ambientNew = light_ambient*material_color;
    vec3 ambientClamped = clamp(ambientNew, vec3 (0.0, 0.0, 0.0), vec3 (1.0, 1.0, 1.0));
    illumination += ambientClamped;

    vec3 clamped = clamp(illumination, vec3 (0.0,0.0,0.0), vec3 (1.0,1.0,1.0));
    FragColor = vec4(clamped, 1.0);
}
