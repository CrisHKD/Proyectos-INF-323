export class Cubo {
  constructor(gl) {
    const vertices = [
      // Frente
      -1, -1,  1,  1, -1,  1,  1,  1,  1, -1,  1,  1,
      // Atrás
      -1,  1, -1,  1,  1, -1,  1, -1, -1, -1, -1, -1,
      // Izquierda
      -1, -1, -1, -1, -1,  1, -1,  1,  1, -1,  1, -1,
      // Derecha
       1, -1,  1,  1, -1, -1,  1,  1, -1,  1,  1,  1,
      // Abajo
      -1, -1, -1,  1, -1, -1,  1, -1,  1, -1, -1,  1,
      // Arriba
      -1,  1,  1,  1,  1,  1,  1,  1, -1, -1,  1, -1
    ];

    const colores = [
      // Frente - lila
      ...Array(4).fill([1, 0, 1, 1]).flat(),
      // Atrás - amarillo
      ...Array(4).fill([1, 1, 0, 1]).flat(),
      // Izquierda - celeste
      ...Array(4).fill([0, 1, 1, 1]).flat(),
      // Derecha - rojo
      ...Array(4).fill([1, 0, 0, 1]).flat(),
      // Abajo - azul
      ...Array(4).fill([0, 0, 1, 1]).flat(),
      // Arriba - verde
      ...Array(4).fill([0, 1, 0, 1]).flat()
    ];

    const indices = [
       0,  1,  2,  0,  2,  3,   // Frente
       4,  5,  6,  4,  6,  7,   // Atrás
       8,  9, 10,  8, 10, 11,   // Izquierda
      12, 13, 14, 12, 14, 15,   // Derecha
      16, 17, 18, 16, 18, 19,   // Abajo
      20, 21, 22, 20, 22, 23    // Arriba
    ];

    this.cuboVAO = gl.createVertexArray();
    gl.bindVertexArray(this.cuboVAO);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colores), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // Limpiar bindings
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  dibuja(gl) {
    gl.bindVertexArray(this.cuboVAO);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
  }
}
