import { Vector3 } from './vector3.js';
import { Cuaternion } from './cuaternion.js';

export class ArcBall {
  constructor(width, height) {
    this.Epsilon = 1.0e-5;
    this.U = new Vector3();
    this.V = new Vector3();
    this.ajusta(width, height);
  }

  ajusta(w, h) {
    if (!(w > 1.0 && h > 1.0)) {
      throw new Error("Dimensiones inválidas para ArcBall.");
    }

    this.ajustaAncho = 2.0 / (w - 1.0);
    this.ajustaAlto = 2.0 / (h - 1.0);
  }

  obtieneVector(destino, x, y) {
    let px = (x * this.ajustaAncho) - 1.0;
    let py = 1.0 - (y * this.ajustaAlto);
    let len2 = px * px + py * py;

    if (len2 > 1.0) {
      let norma = 1.0 / Math.sqrt(len2);
      destino.x = px * norma;
      destino.y = py * norma;
      destino.z = 0.0;
    } else {
      destino.x = px;
      destino.y = py;
      destino.z = Math.sqrt(1.0 - len2);
    }
  }

  primerPunto(x, y) {
    this.obtieneVector(this.U, x, y);
  }

  segundoPunto(x, y) {
    const q = new Cuaternion();
    this.obtieneVector(this.V, x, y);

    const normal = this.U.producto_vectorial(this.V);

    if (normal.longitud() > this.Epsilon) {
      q.x = normal.x;
      q.y = normal.y;
      q.z = normal.z;
      q.w = this.U.producto_escalar(this.V);
    } else {
      q.x = q.y = q.z = q.w = 0.0;
    }

    return q;
  }
}
