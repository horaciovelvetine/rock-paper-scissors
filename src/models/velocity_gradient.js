const GRADIENT = [
  [70, 245, 66], // Green
  [245, 245, 66], // Yellow
  [245, 66, 66], // Red
  [245, 1, 1], // Dark Red
];

export default class VelocityGradient {
  constructor(emojis, speedLocalMax, sketch) {
    this.sketch = sketch;
    this.localMax = speedLocalMax;
    const { maxVelocity, minVelocity } = this.findMinMaxVelocity(emojis);
    this.maxVelocity = maxVelocity;
    this.minVelocity = minVelocity;

    this.colorGradient = GRADIENT.map((color) => this.sketch.color(color[0], color[1], color[2]));
  }

  findMinMaxVelocity(emojis) {
    let maxVelocity = 0;
    let minVelocity = this.localMax;
    emojis.forEach((emoji) => {
      if (emoji.velocity.mag() > maxVelocity) {
        maxVelocity = emoji.velocity.mag();
      } else if (emoji.velocity.mag() < minVelocity) {
        minVelocity = emoji.velocity.mag();
      }
    });
    return { maxVelocity, minVelocity };
  }

  getColorFromVelocity(velocity) {
    // Normalize the velocity
    // Normalize the velocity
    const velocityRatioNormalized = this.normalizeVelocityToRgbMax(velocity);

    // Map the normalized velocity to the range [0, 1]
    const colorIndex = this.sketch.map(velocityRatioNormalized, 0, 255, 0, 1);

    // Calculate the indices of the two colors to interpolate between
    const index1 = Math.floor(colorIndex * (this.colorGradient.length - 1));
    const index2 = Math.min(index1 + 1, this.colorGradient.length - 1);

    // Calculate the amount to interpolate by
    const amount = colorIndex * (this.colorGradient.length - 1) - index1;

    // Interpolate between the two colors
    const color1 = this.colorGradient[index1];
    const color2 = this.colorGradient[index2];
    const selectedColor = this.sketch.lerpColor(color1, color2, amount);

    // Return the selected color
    return selectedColor;
  }

  normalizeVelocityToRgbMax(velocity) {
    const velocityMag = velocity.mag();
    const velocityRatio = velocityMag / this.localMax;
    const velocityRatioClamped = Math.min(velocityRatio, 1);
    const velocityRatioNormalized = velocityRatioClamped * 255;
    return Math.round(velocityRatioNormalized);
  }
}
