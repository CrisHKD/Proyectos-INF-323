#version 300 es
layout(location = 0) in vec2 aVertices;
void main() {
    gl_Position = vec4(aVertices, 0.0, 1.0);
}