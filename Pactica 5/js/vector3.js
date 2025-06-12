export class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  // v1 + v2
  mas(v2) {
    return new Vector3(this.x + v2.x, this.y + v2.y, this.z + v2.z);
  }

  // v1 - v2
  menos(v2) {
    return new Vector3(this.x - v2.x, this.y - v2.y, this.z - v2.z);
  }

  // Producto cruz: v1 × v2
  producto_vectorial(v2) {
    return new Vector3(
      this.y * v2.z - this.z * v2.y,
      this.z * v2.x - this.x * v2.z,
      this.x * v2.y - this.y * v2.x
    );
  }

  // Producto punto: v1 • v2
  producto_escalar(v2) {
    return this.x * v2.x + this.y * v2.y + this.z * v2.z;
  }

  // Longitud del vector
  longitud() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  // Normaliza el vector (magnitud 1)
  normaliza() {
    const l = this.longitud();
    if (l > 0) {
      this.x /= l;
      this.y /= l;
      this.z /= l;
    }
  }

  // Calcula la normal a un triángulo (v1, v2, v3)
  static normal(v1, v2, v3) {
    const u = v2.menos(v1);
    const v = v3.menos(v1);
    const n = u.producto_vectorial(v);
    n.normaliza();
    return n;
  }

  toString() {
    return `Vector3 [x=${this.x}, y=${this.y}, z=${this.z}]`;
  }
}
