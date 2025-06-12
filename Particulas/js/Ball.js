import { Vector } from "./Vector.js";

export class Ball {
  constructor(mass, x, y, t = false, ToLive = 0) {
    this.mass = mass;
    this.position = new Vector(x, y);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0.000, -0.005);
    this.dragging = false;
    this.time = t
    this.timeToLive = ToLive
  }

  applyForce(force) {
    const f = force.copy();
    f.div(this.mass);
    this.acceleration.add(f);
  }

  update() {
    if (!this.dragging) {
      if(this.time){
        this.timeToLive-=0.05
      }
      
      //this.applyForce(new Vector(0, -0.01))
      this.velocity.x = this.velocity.x + this.acceleration.x
      this.velocity.y = this.velocity.y + this.acceleration.y
      this.position.add(this.velocity);
      this.acceleration.mul(0);
    }
  }

  checkEdges(width, height) {
    if (this.position.x > width) {
      this.position.x = width;
      this.velocity.x *= -0.3;
    } else if (this.position.x < 0) {
      this.velocity.x *= -0.2;
    }

    if (this.position.y > height) {
      this.velocity.y *= 1;
    } else if (this.position.y < -height) {
      this.position.y = -height;
      this.velocity.y *= -0.8;
    }
  }

  setPos(x, y) {
    this.position.set(x, y);
    this.velocity.set(0, 0);
    this.acceleration.set(0, 0);
  }
}