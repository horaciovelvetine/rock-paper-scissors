import CollisionEntity from './collision_entity';

export default class Emoji extends CollisionEntity {
  constructor(id, x, y, speed, size, grid) {
    super(id, x, y, speed, size, grid);
    this.char = this.getRandomEmoji();
  }

  draw(sketchManager) {
    const { displayRadius, displayVelocity } = sketchManager.windowDetails();
    sketchManager.sketch.textSize(this.radius);

    if (displayVelocity) {
      this.drawVelocityVector(sketchManager);
    }

    if (displayRadius) {
      this.drawCollisionRadius(sketchManager);
    }

    sketchManager.sketch.fill('white');
    sketchManager.sketch.text(this.char, this.position.x, this.position.y);
  }

  drawCollisionRadius(sketchManager) {
    sketchManager.sketch.fill('rgba(255, 255, 255, 0.55)');
    sketchManager.sketch.circle(this.position.x, this.position.y, this.radius);
  }

  drawVelocityVector(sketchManager) {
    const rgbColor = sketchManager.dangerGradient.getColorFromVelocity(this.velocity);
    const velocityVector = this.velocity.copy().normalize().mult(this.radius * 2);

    sketchManager.sketch.strokeWeight(3);
    sketchManager.sketch.stroke(rgbColor.levels);
    sketchManager.sketch.line(this.position.x, this.position.y, (this.position.x + velocityVector.x), (this.position.y + velocityVector.y));
  }

  checkForCollision(other) {
    const collided = this.checkCollision(other);

    if (collided) {
      if ((this.char === '🪨' && other.char === '✂️') || (this.char === '✂️' && other.char === '🪨')) {
        this.char = '🪨';
        other.char = '🪨';
      } else if ((this.char === '📝' && other.char === '🪨') || (this.char === '🪨' && other.char === '📝')) {
        this.char = '📝';
        other.char = '📝';
      } else if ((this.char === '✂️' && other.char === '📝') || (this.char === '📝' && other.char === '✂️')) {
        this.char = '✂️';
        other.char = '✂️';
      }
    }
  }

  getRandomEmoji() {
    // Pick a random emoji Rock, Paper, or Scissors
    const emojis = ['🪨', '📝', '✂️'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }
}
