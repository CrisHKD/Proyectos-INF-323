export function toRadians(grados) {
  return grados * Math.PI / 180;
}

export function identidad(m) {
  m[0]=1; m[4]=0; m[8]=0; m[12]=0;
  m[1]=0; m[5]=1; m[9]=0; m[13]=0;
  m[2]=0; m[6]=0; m[10]=1; m[14]=0;
  m[3]=0; m[7]=0; m[11]=0; m[15]=1;
}

export function multiplica(c, a, b) {
  for (let i=0; i<4; i++) {
    for (let j=0; j<4; j++) {
      let s=0;
      for (let k=0; k<4; k++) {
        s += a[i + k*4] * b[k + j*4];
      }
      c[i + j*4] = s;
    }
  }
}

export function traslacion(m, tx, ty, tz) {
  let r = new Array(16);
  r[0]=1; r[4]=0; r[8]=0; r[12]=tx;
  r[1]=0; r[5]=1; r[9]=0; r[13]=ty;
  r[2]=0; r[6]=0; r[10]=1; r[14]=tz;
  r[3]=0; r[7]=0; r[11]=0; r[15]=1;
  multiplica(m, m, r);
}

export function escalacion(m, sx, sy, sz) {
  let r = new Array(16);
  r[0]=sx; r[4]=0; r[8]=0; r[12]=0;
  r[1]=0; r[5]=sy; r[9]=0; r[13]=0;
  r[2]=0; r[6]=0; r[10]=sz; r[14]=0;
  r[3]=0; r[7]=0; r[11]=0; r[15]=1;
  multiplica(m, m, r);
}

export function ortho(r, izq, der, abj, arr, cerca, lejos) {
  r[0] = 2/(der - izq); r[4] = 0; r[8] = 0; r[12] = -(der + izq)/(der - izq);
  r[1] = 0; r[5] = 2/(arr - abj); r[9] = 0; r[13] = -(arr + abj)/(arr - abj);
  r[2] = 0; r[6] = 0; r[10] = -2/(lejos - cerca); r[14] = -(lejos + cerca)/(lejos - cerca);
  r[3] = 0; r[7] = 0; r[11] = 0; r[15] = 1;
}
