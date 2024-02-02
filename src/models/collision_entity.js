import { p5 } from 'p5js-wrapper';

class CollisionEntity {
  constructor(id, x, y, speed, size, grid) {
    this.id = id;
    this.position = new p5.Vector(x, y);
    this.speedMax = speed;
    this.velocity = p5.Vector.random2D().mult(speed);
    this.mass = 1; // Shut up Newton
    this.radius = size;
    this.collisionFrameBuffer = 0;
    this.lastCollidedEnt = null;
    this.grid = grid;
  }

  update() {
    this.position.add(this.velocity);
    const clamped = this.clampCords();
    // this approach omits the edge case where the ent would be clamped and collide
    // with another ent on the same frame, which shouldn't be a problem for now...
    if (!clamped) {
      // check for collisions
      this.grid.checkForCollisions(this);
    }

    this.grid.updateGrid(this);

    if (this.collisionFrameBuffer > 0) {
      this.collisionFrameBuffer -= 1;
    } else if (this.collisionFrameBuffer === 0) {
      this.lastCollidedEnt = null;
    }
  }

  clampCords() {
    // width and height here are the width and height of the canvas
    // those values are being held in the background by the sketch/p5 instance
    const xPos = Math.max(this.radius, Math.min(width - this.radius, this.position.x));
    const yPos = Math.max(this.radius, Math.min(height - this.radius, this.position.y));

    const xClamp = xPos !== this.position.x;
    const yClamp = yPos !== this.position.y;

    if (xClamp) {
      this.position.x = xPos;
      this.velocity.x *= -1;
    }

    if (yClamp) {
      this.position.y = yPos;
      this.velocity.y *= -1;
    }

    return xClamp || yClamp;
  }

  checkCollision(other) {
    const isEligible = this.lastCollidedEnt === null && this.collisionFrameBuffer === 0;
    // These recently collided and they might need to be nudged apart
    const isInDanger = this.lastCollidedEnt > 0 && this.lastCollidedEnt === other;
    const distanceVector = p5.Vector.sub(this.position, other.position);
    const distanceMagnitude = distanceVector.mag();

    if (distanceMagnitude < this.radius) {
      if (isEligible) {
        this.calculateCollisionAndUpdate(other, distanceVector);

        this.applyOffsetCorrection(other, distanceMagnitude, distanceVector, 4.0);

        this.initializeCollisionBuffer(other);
        other.initializeCollisionBuffer(this);
        return true;
      } if (isInDanger) {
        // resets the collisions buffer and nudges them apart a bit.
        this.applyOffsetCorrection(other, distanceMagnitude, distanceVector);

        this.initializeCollisionBuffer(other);
        other.initializeCollisionBuffer(this);
        return true;
      }
    }
    return false;
  }

  applyOffsetCorrection(other, distanceMagnitude, distanceVector, factor = 2.0) {
    const distanceCorrection = (this.radius - distanceMagnitude) / factor;
    const d = distanceVector.copy();
    const correctionVector = d.normalize().mult(distanceCorrection);
    other.position.add(correctionVector);
    this.position.sub(correctionVector);
  }

  calculateCollisionAndUpdate(other, distanceVector) {
    /*
		 * This function is based on the following:
		 * https://p5js.org/examples/motion-circle-collision.html
		 * Which serves as a p5js port of the following:
		 * https://processing.org/examples/circlecollision.html
		 * Which is based on a solution by Keith Peters: Foundation Actionscript 3.0 Animation: Making Things Move!
		 */

    const theta = distanceVector.heading();
    const sine = Math.sin(theta);
    const cosine = Math.cos(theta);

    const vTempRotations = [new p5.Vector(), new p5.Vector()];
    vTempRotations[0].x = cosine * this.velocity.x + sine * this.velocity.y;
    vTempRotations[0].y = cosine * this.velocity.y - sine * this.velocity.x;

    vTempRotations[1].x = cosine * other.velocity.x + sine * other.velocity.y;
    vTempRotations[1].y = cosine * other.velocity.y - sine * other.velocity.x;

    const vFinalRotations = [new p5.Vector(), new p5.Vector()];
    vFinalRotations[0].x = ((this.mass - other.mass) * vTempRotations[0].x + 2 * other.mass * vTempRotations[1].x) / (this.mass + other.mass);
    vFinalRotations[0].y = vTempRotations[0].y;

    vFinalRotations[1].x = ((other.mass - this.mass) * vTempRotations[1].x + 2 * this.mass * vTempRotations[0].x) / (this.mass + other.mass);
    vFinalRotations[1].y = vTempRotations[1].y;

    const vFinal = [new p5.Vector(), new p5.Vector()];
    vFinal[0].x = cosine * vFinalRotations[0].x - sine * vFinalRotations[0].y;
    vFinal[0].y = cosine * vFinalRotations[0].y + sine * vFinalRotations[0].x;

    vFinal[1].x = cosine * vFinalRotations[1].x - sine * vFinalRotations[1].y;
    vFinal[1].y = cosine * vFinalRotations[1].y + sine * vFinalRotations[1].x;

    this.velocity.x = vFinal[0].x;
    this.velocity.y = vFinal[0].y;

    other.velocity.x = vFinal[1].x;
    other.velocity.y = vFinal[1].y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    other.position.x += other.velocity.x;
    other.position.y += other.velocity.y;
  }

  initializeCollisionBuffer(other) {
    this.collisionFrameBuffer = 24; // ideally this number is as low as possible and a multiple of 4
    this.lastCollidedEnt = other;
  }
}

export default CollisionEntity;
