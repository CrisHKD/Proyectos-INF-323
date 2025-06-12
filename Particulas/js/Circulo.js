export class Circulo {
  constructor(gl) {
    const vertices = [];
    for(let i=0; i<360; i++) {
      vertices.push(Math.cos(i * Math.PI / 180));
      vertices.push(Math.sin(i * Math.PI / 180));
    }

    this.circuloVAO = gl.createVertexArray();
    gl.bindVertexArray(this.circuloVAO);

    const codigoVertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, codigoVertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  dibuja(gl, llenado) {
    gl.bindVertexArray(this.circuloVAO);
    gl.drawArrays(llenado ? gl.TRIANGLE_FAN : gl.LINE_LOOP, 0, 360);
    gl.bindVertexArray(null);
  }
}