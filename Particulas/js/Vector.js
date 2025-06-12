export class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  sup(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  }

  mul(n) {
    this.x *= n;
    this.y *= n;
  }

  div(n) {
    this.x /= n;
    this.y /= n;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const mag = this.mag();
    if (this.x === 0 || mag === 0) {
      this.x = 0;
    } else {
      this.x = this.x / mag;
    }
    if (this.y === 0 || mag === 0) {
      this.y = 0;
    } else {
      this.y = this.y / mag;
    }
  }

  ZERO() {
    this.x = 0;
    this.y = 0;
  }
}