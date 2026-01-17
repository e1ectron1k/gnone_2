import './styles.css';
import goblinImage from './assets/goblin.png';

class GoblinGame {
  constructor() {
    this.boardSize = 4;
    this.cells = [];
    this.currentPosition = null;
    this.moveInterval = null;
    this.movesCount = 0;
    this.missed = 0;
    this.maxMissed = 5;
    this.isPlaying = false;
    
    this.goblinElement = document.createElement('img');
    this.goblinElement.src = goblinImage;
    this.goblinElement.className = 'goblin';
    this.goblinElement.alt = 'Гоблин';
    
    this.initElements();
    this.initGameBoard();
    this.bindEvents();
    this.updateUI();
  }
  
  initElements() {
    this.gameBoard = document.getElementById('gameBoard');
    this.scoreElement = document.getElementById('score');
    this.missedElement = document.getElementById('missed');
    this.statusElement = document.getElementById('status');
    this.startBtn = document.getElementById('startBtn');
    this.pauseBtn = document.getElementById('pauseBtn');
    this.resetBtn = document.getElementById('resetBtn');
  }
  
  initGameBoard() {
    this.gameBoard.innerHTML = '';
    this.cells = [];
    
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        
        const label = document.createElement('span');
        label.className = 'cell-label';
        label.textContent = `${String.fromCharCode(65 + row)}${col + 1}`;
        cell.append(label);
        
        this.gameBoard.append(cell);
        this.cells.push(cell);
        
        cell.addEventListener('click', () => {
          if (!this.isPlaying) return;
          
          if (cell.classList.contains('has-goblin')) {
            this.hitGoblin();
          } else {
            this.missClick();
          }
        });
      }
    }
  }
  
  getRandomPosition(excludePosition = null) {
    let newPosition;
    do {
      newPosition = Math.floor(Math.random() * this.cells.length);
    } while (excludePosition !== null && newPosition === excludePosition);
    
    return newPosition;
  }
  
  placeGoblinRandomly() {
    if (this.currentPosition !== null) {
      const oldCell = this.cells[this.currentPosition];
      oldCell.classList.remove('has-goblin');
      const goblin = oldCell.querySelector('.goblin');
      if (goblin) {
        goblin.remove();
      }
    }
    
    const newPosition = this.getRandomPosition(this.currentPosition);
    this.currentPosition = newPosition;
    
    const newCell = this.cells[this.currentPosition];
    newCell.append(this.goblinElement);
    newCell.classList.add('has-goblin');
    
    this.goblinTimeout = setTimeout(() => {
      this.missGoblin();
    }, 1000);
  }
  
  hitGoblin() {
    if (!this.isPlaying) return;
    
    clearTimeout(this.goblinTimeout);
    
    if (this.currentPosition !== null) {
      const cell = this.cells[this.currentPosition];
      cell.classList.remove('has-goblin');
      const goblin = cell.querySelector('.goblin');
      if (goblin) {
        goblin.remove();
      }
      
      cell.classList.add('hit');
      setTimeout(() => cell.classList.remove('hit'), 300);
    }
    
    this.movesCount++;
    this.updateUI();
  }
  
  missGoblin() {
    if (!this.isPlaying) return;
    
    if (this.currentPosition !== null) {
      const cell = this.cells[this.currentPosition];
      cell.classList.remove('has-goblin');
      const goblin = cell.querySelector('.goblin');
      if (goblin) {
        goblin.remove();
      }
    }
    
    this.missed++;
    
    if (this.missed >= this.maxMissed) {
      this.gameOver();
    }
    
    this.updateUI();
  }
  
  missClick() {
    if (!this.isPlaying) return;
    
    if (this.movesCount > 0) {
      this.movesCount--;
    }
    this.updateUI();
  }
  
  start() {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.statusElement.textContent = 'Играем';
    this.startBtn.disabled = true;
    this.pauseBtn.disabled = false;
    
    this.placeGoblinRandomly();
    
    this.gameInterval = setInterval(() => {
      this.placeGoblinRandomly();
    }, 2000);
  }
  
  pause() {
    if (!this.isPlaying) return;
    
    clearInterval(this.gameInterval);
    clearTimeout(this.goblinTimeout);
    this.isPlaying = false;
    this.statusElement.textContent = 'Пауза';
    this.startBtn.disabled = false;
    this.pauseBtn.disabled = true;
  }
  
  reset() {
    this.pause();
    
    this.movesCount = 0;
    this.missed = 0;
    this.currentPosition = null;
    
    this.cells.forEach(cell => {
      cell.classList.remove('has-goblin', 'hit');
      const goblin = cell.querySelector('.goblin');
      if (goblin) {
        goblin.remove();
      }
    });
    
    this.statusElement.textContent = 'Готово';
    this.startBtn.disabled = false;
    this.pauseBtn.disabled = true;
    this.updateUI();
  }
  
  gameOver() {
    this.pause();
    this.statusElement.textContent = 'Игра окончена!';
    
    setTimeout(() => {
      alert(`Игра окончена!\n\nВаш счёт: ${this.movesCount}\nПропущено гоблинов: ${this.missed}`);
    }, 500);
  }
  
  updateUI() {
    this.scoreElement.textContent = this.movesCount;
    this.missedElement.textContent = `${this.missed}/${this.maxMissed}`;
    
    this.scoreElement.classList.add('updated');
    this.missedElement.classList.add('updated');
    setTimeout(() => {
      this.scoreElement.classList.remove('updated');
      this.missedElement.classList.remove('updated');
    }, 300);
  }
  
  bindEvents() {
    this.startBtn.addEventListener('click', () => this.start());
    this.pauseBtn.addEventListener('click', () => this.pause());
    this.resetBtn.addEventListener('click', () => this.reset());
    
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        this.isPlaying ? this.pause() : this.start();
      }
      if (event.code === 'KeyR') {
        this.reset();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.game = new GoblinGame();
});