export class Ejes {
  constructor(gl, uColor) {
    const vertices = [
      -2.0, 0.0,
      16.0, 0.0,
      0.0, -2.0,
      0.0, 16.0
    ];

    this.uColor = uColor;

    this.ejesVAO = gl.createVertexArray();
    gl.bindVertexArray(this.ejesVAO);

    const codigoVertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, codigoVertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  dibuja(gl) {
    gl.bindVertexArray(this.ejesVAO);
    gl.uniform4f(this.uColor, 1, 1, 0, 1);
    gl.drawArrays(gl.LINES, 0, 4);
    gl.bindVertexArray(null);
  }
}