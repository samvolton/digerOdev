class Board {
  constructor(ctx, ctxNext, candidate) {
    this.ctx = ctx;
    this.ctxNext = ctxNext;
    this.candidate = candidate;
    this.init();
  }

  init() {
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
    this.colors = CANDIDATE_COLORS[this.candidate];
  }

  reset() {
    this.grid = this.getEmptyGrid();
    this.piece = new Piece(this.ctx, this.candidate);
    this.piece.setStartingPosition();
    this.getNewPiece();
  }

  getNewPiece() {
    const { width, height } = this.ctxNext.canvas;
    this.next = new Piece(this.ctxNext, this.candidate);
    this.ctxNext.clearRect(0, 0, width, height);
    this.next.draw();
  }

  draw() {
    this.piece.draw();
    this.drawBoard();
  }

  drop() {
    let p = moves[KEY.DOWN](this.piece);
    if (this.valid(p)) {
      this.piece.move(p);
    } else {
      this.freeze();
      this.clearLines();
      if (this.piece.y === 0) {
        // Game over
        return false;
      }
      this.piece = this.next;
      this.piece.ctx = this.ctx;
      this.piece.setStartingPosition();
      this.getNewPiece();
    }
    return true;
  }
  
  clearLines() {
    let lines = 0;

    this.grid.forEach((row, y) => {
      if (row.every((value) => value > 0)) {
        lines++;
        this.grid.splice(y, 1);
        this.grid.unshift(Array(COLS).fill(0));
      }
    });

    if (lines > 0) {
      account.score += this.getLinesClearedPoints(lines);
      account.lines += lines;

      if (account.lines >= LINES_PER_LEVEL) {
        account.level++;
        account.lines -= LINES_PER_LEVEL;
        time.level = LEVEL[account.level];
      }
    }
  }

  valid(p) {
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx;
        let y = p.y + dy;
        return value === 0 || (this.isInsideWalls(x, y) && this.notOccupied(x, y));
      });
    });
  }

  freeze() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.grid[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
  }

  drawBoard() {
    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = this.colors[value - 1];
          this.ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  getEmptyGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  isInsideWalls(x, y) {
    return x >= 0 && x < COLS && y <= ROWS;
  }

  notOccupied(x, y) {
    return this.grid[y] && this.grid[y][x] === 0;
  }

  rotate(piece, direction) {
    let p = JSON.parse(JSON.stringify(piece));
    if (!piece.hardDropped) {
      for (let y = 0; y < p.shape.length; ++y) {
        for (let x = 0; x < y; ++x) {
          [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
        }
      }
      if (direction === ROTATION.RIGHT) {
        p.shape.forEach((row) => row.reverse());
      } else if (direction === ROTATION.LEFT) {
        p.shape.reverse();
      }
    }
    return p;
  }

  getLinesClearedPoints(lines, level) {
    const lineClearPoints =
      lines === 1
        ? POINTS.SINGLE
        : lines === 2
        ? POINTS.DOUBLE
        : lines === 3
        ? POINTS.TRIPLE
        : lines === 4
        ? POINTS.TETRIS
        : 0;
    return (account.level + 1) * lineClearPoints;
  }
}