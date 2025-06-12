import { Vector3 } from './vector3.js';

export class Cuaternion {
  constructor(w = 0, x = 0, y = 0, z = 0) {
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  inicializa(w, v) {
    this.w = w;
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
  }

  norma2() {
    return this.w ** 2 + this.x ** 2 + this.y ** 2 + this.z ** 2;
  }

  conjugado() {
    return new Cuaternion(this.w, -this.x, -this.y, -this.z);
  }

  static multiplica(a, b) {
    return new Cuaternion(
      a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
      a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
      a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
      a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w
    );
  }

  static multiplica_escalar(a, b) {
    return new Cuaternion(
      a.w * b,
      a.x * b,
      a.y * b,
      a.z * b
    );
  }

  inverso() {
    const n = this.norma2();
    if (n <= 1e-8) {
      throw new Error("Inverso: cuaternión con norma cero");
    }
    return Cuaternion.multiplica_escalar(this.conjugado(), 1 / n);
  }

  rota(p) {
    const p_hom = new Cuaternion(0, p.x, p.y, p.z);
    const q_inv = this.inverso();
    const res = Cuaternion.multiplica(Cuaternion.multiplica(this, p_hom), q_inv);
    return new Vector3(res.x, res.y, res.z);
  }

  static rota2(a, q) {
    let d = q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w;
    let s = d > 0.0 ? 2.0 / d : 0.0;

    a[0] = 1.0 - (q.y * q.y + q.z * q.z) * s;
    a[1] = (q.x * q.y + q.w * q.z) * s;
    a[2] = (q.x * q.z - q.w * q.y) * s;
    a[3] = 0;

    a[4] = (q.x * q.y - q.w * q.z) * s;
    a[5] = 1.0 - (q.x * q.x + q.z * q.z) * s;
    a[6] = (q.y * q.z + q.w * q.x) * s;
    a[7] = 0;

    a[8] = (q.x * q.z + q.w * q.y) * s;
    a[9] = (q.y * q.z - q.w * q.x) * s;
    a[10] = 1.0 - (q.x * q.x + q.y * q.y) * s;
    a[11] = 0;

    a[12] = 0;
    a[13] = 0;
    a[14] = 0;
    a[15] = 1;
  }

  toString() {
    return `Cuaternion [w=${this.w}, x=${this.x}, y=${this.y}, z=${this.z}]`;
  }
}
