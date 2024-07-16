const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const canvasNext = document.getElementById('next');
const ctxNext = canvasNext.getContext('2d');

let accountValues = {
  score: 0,
  level: 0,
  lines: 0
};

let selectedCandidate = null;
let board = null;
let requestId = null;
let time = null;

const account = new Proxy(accountValues, {
  set: (target, key, value) => {
    target[key] = value;
    updateAccount(key, value);
    return true;
  }
});

function updateAccount(key, value) {
  const element = document.getElementById(key);
  if (element) {
    element.textContent = value;
  }
}

let globalScores = { biden: 0, trump: 0 };

function loadGlobalScores() {
  const savedScores = localStorage.getItem('globalScores');
  if (savedScores) {
    globalScores = JSON.parse(savedScores);
  }
  updateGlobalScores();
}

function saveGlobalScores() {
  localStorage.setItem('globalScores', JSON.stringify(globalScores));
}

function updateGlobalScores() {
  document.getElementById('biden-score').textContent = globalScores.biden;
  document.getElementById('trump-score').textContent = globalScores.trump;
}

function selectCandidate(candidate) {
  selectedCandidate = candidate;
  document.getElementById('character-select').style.display = 'none';
  document.getElementById('game-board').style.display = 'flex';
  initGame();
}

function initGame() {
  board = new Board(ctx, ctxNext, selectedCandidate);
  time = { start: performance.now(), elapsed: 0, level: LEVEL[0] };
  updateAccount(account);
  initNext();
}

function initNext() {
  ctxNext.canvas.width = 4 * BLOCK_SIZE;
  ctxNext.canvas.height = 4 * BLOCK_SIZE;
  ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function addEventListener() {
  document.removeEventListener('keydown', handleKeyPress);
  document.addEventListener('keydown', handleKeyPress);
}

function handleKeyPress(event) {
  if (event.keyCode === KEY.P) {
    pause();
  } else if (event.keyCode === KEY.ESC) {
    gameOver();
  } else if (moves[event.keyCode]) {
    event.preventDefault();
    let p = moves[event.keyCode](board.piece);
    if (event.keyCode === KEY.SPACE) {
      while (board.valid(p)) {
        account.score += POINTS.HARD_DROP;
        board.piece.move(p);
        p = moves[KEY.DOWN](board.piece);
      }
      board.piece.hardDrop();
    } else if (board.valid(p)) {
      board.piece.move(p);
      if (event.keyCode === KEY.DOWN) {
        account.score += POINTS.SOFT_DROP;
      }
    }
  }
}

function resetGame() {
  account.score = 0;
  account.lines = 0;
  account.level = 0;
  board.reset();
  time = { start: performance.now(), elapsed: 0, level: LEVEL[account.level] };
}

function play() {
  resetGame();
  addEventListener();

  if (requestId) {
    cancelAnimationFrame(requestId);
  }

  animate();
  document.querySelector('#play-btn').style.display = 'none';
  document.querySelector('#pause-btn').style.display = 'block';
}

function animate(now = 0) {
  time.elapsed = now - time.start;
  if (time.elapsed > time.level) {
    time.start = now;
    if (!board.drop()) {
      gameOver();
      return;
    }
  }

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  board.draw();
  requestId = requestAnimationFrame(animate);
}

function gameOver() {
  cancelAnimationFrame(requestId);
  ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'red';
  ctx.fillText('GAME OVER', 1.8, 4);
  
  globalScores[selectedCandidate] += account.score;
  saveGlobalScores();
  updateGlobalScores();

  document.querySelector('#pause-btn').style.display = 'none';
  document.querySelector('#play-btn').style.display = 'block';
}

function pause() {
  if (!requestId) {
    animate();
    return;
  }

  cancelAnimationFrame(requestId);
  requestId = null;

  ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'yellow';
  ctx.fillText('PAUSED', 3, 4);
  document.querySelector('#play-btn').style.display = 'block';
  document.querySelector('#pause-btn').style.display = 'none';
}

loadGlobalScores();