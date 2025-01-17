class Piece {
  constructor(ctx, candidate) {
    this.ctx = ctx;
    this.candidate = candidate;
    this.spawn();
  }

  spawn() {
    this.typeId = this.randomizeTetrominoType(CANDIDATE_COLORS[this.candidate].length - 1);
    this.shape = SHAPES[this.typeId];
    this.color = CANDIDATE_COLORS[this.candidate][this.typeId];
    this.x = 0;
    this.y = 0;
    this.hardDropped = false;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
        }
      });
    });
  }

  move(p) {
    if (!this.hardDropped) {
      this.x = p.x;
      this.y = p.y;
    }
    this.shape = p.shape;
  }

  hardDrop() {
    this.hardDropped = true;
  }

  setStartingPosition() {
    this.x = this.typeId === 4 ? 4 : 3;
  }

  randomizeTetrominoType(noOfTypes) {
    return Math.floor(Math.random() * noOfTypes + 1);
  }
}