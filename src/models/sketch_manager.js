import UniformGrid from './uniform_grid';
import Emoji from './emoji';
import VelocityGradient from './velocity_gradient';

export default class SketchManager {
  constructor(sketch) {
    this.sketch = sketch;
    // on screen elements saved as instance variables
    this.numOfEmojisInput = sketch.select('#num-of-emojis-input');
    this.speedInput = sketch.select('#speed-input');
    this.sizeInput = sketch.select('#size-input');
    this.widthInput = sketch.select('#width-input');
    this.heightInput = sketch.select('#height-input');
    // checkboxes (toggles enable/disable)
    this.displayRadiusButton = sketch.select('#display-collision-radius');
    this.displayVelocityButton = sketch.select('#display-velocity-vector');
    // play/pause button
    this.playPauseButton = sketch.select('#play-pause-button');
    this.playPauseButton.mousePressed(() => this.playPauseEventHandler());
    this.isPaused = false;

    this.resetButton = sketch.select('#reset-button');
    this.resetButton.mousePressed(() => this.resetEventHandler());

    // create grid and emojis
    this.grid = this.createGrid();
    this.emojis = this.createEmojis();
    // canvas append to correct container
    this.canvas = sketch.createCanvas(this.getWidth(), this.getHeight());
    this.canvas.parent('p5-main-canvas');
    // create danger gradient for coloring vectors...
    this.dangerGradient = new VelocityGradient(this.emojis, this.getSpeed(), sketch);
  }

  playPauseEventHandler() {
    if (this.sketch.isLooping()) {
      this.playPauseButton.html('Play');
      this.isPaused = true;
      this.sketch.noLoop();
    } else {
      this.playPauseButton.html('Pause');
      this.isPaused = false;
      this.sketch.loop();
    }
  }

  resetEventHandler() {
    this.grid = this.createGrid();
    this.emojis = this.createEmojis();
    this.setCanvas();
  }

  setCanvas() {
    this.sketch.resizeCanvas(this.getWidth(), this.getHeight());
  }

  createGrid() {
    return new UniformGrid(this.getEmojiSize(), this.getWidth(), this.getHeight());
  }

  createEmojis() {
    const emojis = [];
    const x = this.sketch.random(this.getWidth());
    const y = this.sketch.random(this.getHeight());
    const speed = this.sketch.random(this.getSpeed());
    const size = this.getEmojiSize();

    for (let i = 1; i <= this.getEmojiCount(); i++) {
      emojis.push(new Emoji(i, x, y, speed, size, this.grid));
    }

    emojis.forEach((e) => {
      this.grid.checkForCollisions(e);
    });

    return emojis;
  }

  windowDetails() {
    return {
      sketchWidth: this.getWidth(),
      sketchHeight: this.getHeight(),
      emojiCount: this.getEmojiCount(),
      emojiSpeed: this.getSpeed(),
      emojiSize: this.getEmojiSize(),
      displayRadius: this.displayRadiusButton.checked(),
      displayVelocity: this.displayVelocityButton.checked(),
      sketchIsPaused: this.isPaused,
      gameOver: this.gameOver(),
    };
  }

  getWidth() {
    return this.sketch.int(this.widthInput.value());
  }

  getHeight() {
    return this.sketch.int(this.heightInput.value());
  }

  getEmojiCount() {
    return this.sketch.int(this.numOfEmojisInput.value());
  }

  getSpeed() {
    return this.sketch.int(this.speedInput.value());
  }

  getEmojiSize() {
    return this.sketch.int(this.sizeInput.value());
  }

  gameOver() {
    return this.emojis.every((emoji) => emoji.char === this.emojis[0].char);
  }
}
