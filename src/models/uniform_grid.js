export default class UniformGrid {
  constructor(radius, sketchWidth, sketchHeight) {
    this.cellSize = radius * 3; //= => this is an arbitrary number...
    this.gridWidth = Math.ceil(sketchWidth / this.cellSize);
    this.gridHeight = Math.ceil(sketchHeight / this.cellSize);
    this.grid = new Array(this.gridHeight * this.gridWidth).fill().map(() => []);
  }

  updateGrid(emoji) {
    const { hashedIndex } = this.getGridPosition(emoji);

    // remove the emoji from the grid
    this.grid.forEach((gridCell) => {
      const emojiIndex = gridCell.indexOf(emoji);
      if (emojiIndex !== -1) {
        gridCell.splice(emojiIndex, 1);
      }
    });

    this.grid[hashedIndex].push(emoji);
  }

  checkForCollisions(emoji) {
    const { xInd, yInd, hashedIndex } = this.getGridPosition(emoji);
    const currentCell = this.grid[hashedIndex];

    // check the current cell for collisions
    currentCell.forEach((other) => {
      if (other.id !== emoji.id) {
        emoji.checkForCollision(other);
      }
    });

    const offsets = [-1, 0, 1];
    // check adjacent cells for collisions...
    offsets.forEach((offsetI) => {
      offsets.forEach((offsetJ) => {
        const adjacentCell = this.grid[(yInd + offsetI) * this.gridWidth + xInd + offsetJ];
        if (adjacentCell) {
          adjacentCell.forEach((other) => {
            if (other.id !== emoji.id) {
              emoji.checkForCollision(other);
            }
          });
        }
      });
    });
  }

  getGridPosition(emoji) {
    // converts the emoji's position to a coordinate to an index in the grid
    const xInd = Math.floor(emoji.position.x / this.cellSize);
    const yInd = Math.floor(emoji.position.y / this.cellSize);
    const hashedIndex = this.hashGridPosition(xInd, yInd);

    return {
      xInd,
      yInd,
      hashedIndex,
    };
  }

  hashGridPosition(xInd, yInd) {
    return yInd * this.gridWidth + xInd;
  }
}
