
export function ortho(r, izq, der, abj, arr, cerca, lejos) {
  r[0] = 2 / (der - izq);
  r[1] = 0;
  r[2] = 0;
  r[3] = 0;

  r[4] = 0;
  r[5] = 2 / (arr - abj);
  r[6] = 0;
  r[7] = 0;

  r[8] = 0;
  r[9] = 0;
  r[10] = -2 / (lejos - cerca);
  r[11] = 0;

  r[12] = -(der + izq) / (der - izq);
  r[13] = -(arr + abj) / (arr - abj);
  r[14] = -(lejos + cerca) / (lejos - cerca);
  r[15] = 1;
}

export function multiplica(c, a, b) {
  for (let i = 0; i < 4; ++i) {
    for (let j = 0; j < 4; ++j) {
      c[i + j * 4] = 0;
      for (let k = 0; k < 4; ++k) {
        c[i + j * 4] += a[i + k * 4] * b[k + j * 4];
      }
    }
  }
}

export function compilaEnlazaLosShaders(gl) {
  const vs = document.getElementById("vs").text.trim();
  const fs = document.getElementById("fs").text.trim();

  const shaderDeVertice = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(shaderDeVertice, vs);
  gl.compileShader(shaderDeVertice);
  if (!gl.getShaderParameter(shaderDeVertice, gl.COMPILE_STATUS)) {
    console.error("Error de shader de vértice:", gl.getShaderInfoLog(shaderDeVertice));
  }

  const shaderDeFragmento = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(shaderDeFragmento, fs);
  gl.compileShader(shaderDeFragmento);
  if (!gl.getShaderParameter(shaderDeFragmento, gl.COMPILE_STATUS)) {
    console.error("Error de shader de fragmento:", gl.getShaderInfoLog(shaderDeFragmento));
  }

  const programa = gl.createProgram();
  gl.attachShader(programa, shaderDeVertice);
  gl.attachShader(programa, shaderDeFragmento);
  gl.linkProgram(programa);

  if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) {
    console.error("Error de enlace del programa:", gl.getProgramInfoLog(programa));
  }

  gl.useProgram(programa);
  return programa;
}