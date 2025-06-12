// Convierte grados a radianes
export function toRadians(grados) {
  return grados * Math.PI / 180;
}

// Matriz identidad
export function identidad(r) {
  r[0] = 1; r[4] = 0; r[8]  = 0; r[12] = 0;
  r[1] = 0; r[5] = 1; r[9]  = 0; r[13] = 0;
  r[2] = 0; r[6] = 0; r[10] = 1; r[14] = 0;
  r[3] = 0; r[7] = 0; r[11] = 0; r[15] = 1;
}

// Traslación
export function traslacion(matriz, tx, ty, tz) {
  const r = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    tx, ty, tz, 1
  ];
  multiplica(matriz, matriz, r);
}

// Escalación
export function escalacion(matriz, sx, sy, sz) {
  const r = [
    sx, 0,  0,  0,
    0,  sy, 0,  0,
    0,  0,  sz, 0,
    0,  0,  0,  1
  ];
  multiplica(matriz, matriz, r);
}

// Rotación en X
export function rotacionX(matriz, theta) {
  const c = Math.cos(toRadians(theta));
  const s = Math.sin(toRadians(theta));
  const r = [
    1, 0,  0, 0,
    0, c, -s, 0,
    0, s,  c, 0,
    0, 0,  0, 1
  ];
  multiplica(matriz, matriz, r);
}

// Rotación en Y
export function rotacionY(matriz, theta) {
  const c = Math.cos(toRadians(theta));
  const s = Math.sin(toRadians(theta));
  const r = [
     c, 0, s, 0,
     0, 1, 0, 0,
    -s, 0, c, 0,
     0, 0, 0, 1
  ];
  multiplica(matriz, matriz, r);
}

// Rotación en Z
export function rotacionZ(matriz, theta) {
  const c = Math.cos(toRadians(theta));
  const s = Math.sin(toRadians(theta));
  const r = [
     c, -s, 0, 0,
     s,  c, 0, 0,
     0,  0, 1, 0,
     0,  0, 0, 1
  ];
  multiplica(matriz, matriz, r);
}

// Proyección ortogonal
export function ortho(r, izq, der, abj, arr, cerca, lejos) {
  r[0] = 2 / (der - izq); r[4] = 0;               r[8]  = 0;                r[12] = -(der + izq) / (der - izq);
  r[1] = 0;               r[5] = 2 / (arr - abj); r[9]  = 0;                r[13] = -(arr + abj) / (arr - abj);
  r[2] = 0;               r[6] = 0;               r[10] = -2 / (lejos - cerca); r[14] = -(lejos + cerca) / (lejos - cerca);
  r[3] = 0;               r[7] = 0;               r[11] = 0;                r[15] = 1;
}

// Proyección perspectiva (tipo gluPerspective)
export function perspective(r, fovy, aspecto, cerca, lejos) {
  const ang = fovy * 0.5;
  const f = (Math.abs(Math.sin(toRadians(ang))) < 1e-8 ? 0 : 1) / Math.tan(toRadians(ang));
  r[0] = f / aspecto; r[4] = 0; r[8]  = 0;                               r[12] = 0;
  r[1] = 0;           r[5] = f; r[9]  = 0;                               r[13] = 0;
  r[2] = 0;           r[6] = 0; r[10] = -(lejos + cerca) / (lejos - cerca); r[14] = -2 * lejos * cerca / (lejos - cerca);
  r[3] = 0;           r[7] = 0; r[11] = -1;                              r[15] = 0;
}

// Multiplicación de matrices 4x4
export function multiplica(c, a, b) {
  const r = new Array(16);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let s = 0;
      for (let k = 0; k < 4; k++) {
        s += a[i + k * 4] * b[k + j * 4];
      }
      r[i + j * 4] = s;
    }
  }
  for (let i = 0; i < 16; i++) {
    c[i] = r[i];
  }
}
