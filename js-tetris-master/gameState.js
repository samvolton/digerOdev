class GameState {
    constructor() {
      this.score = 0;
      this.lines = 0;
      this.level = 0;
      this.playTime = 0;
      this.highScores = [];
    }
  
    updateScore(points) {
      this.score += points;
      this.updateLevel();
    }
  
    updateLines(clearedLines) {
      this.lines += clearedLines;
      this.updateLevel();
    }
  
    updateLevel() {
      this.level = Math.floor(this.lines / 10);
    }
  
    resetGame() {
      this.score = 0;
      this.lines = 0;
      this.level = 0;
      this.playTime = 0;
    }
  
    addHighScore(name, score) {
      this.highScores.push({ name, score });
      this.highScores.sort((a, b) => b.score - a.score);
      this.highScores = this.highScores.slice(0, 10); // Keep only top 10
    }
}
  
const gameState = new GameState();