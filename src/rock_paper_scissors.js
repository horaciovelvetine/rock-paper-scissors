import { sketch } from 'p5js-wrapper';
import { SketchManager } from './models';

let sketchManager;

sketch.setup = () => {
  sketchManager = new SketchManager(sketch);
};

sketch.draw = () => {
  background('black');
  textAlign(CENTER, CENTER);
  sketchManager.emojis.forEach((emoji) => {
    emoji.draw(sketchManager);
    emoji.update();
  });

  fill('white');
  const {
    sketchWidth, sketchHeight, sketchIsPaused, gameOver,
  } = sketchManager.windowDetails();

  if (sketchIsPaused) {
    text('Paused', sketchWidth / 2, sketchHeight / 2);
  } else if (gameOver) {
    text('Game Over', sketchWidth / 2, sketchHeight / 2);
  }
};
