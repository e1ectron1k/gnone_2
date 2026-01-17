import './styles.css';
import gnomeImage from './gnome.png';

class SimpleGame {
  constructor() {
    this.boardSize = 4;
    this.cells = [];
    this.currentPosition = null;
    this.moveInterval = null;
    this.movesCount = 0;
    
    this.initElements();
    this.initGameBoard();
    this.placeGnomeRandomly();
    this.startMoving();
    this.bindEvents();
  }
  
  initElements() {
    this.gameBoard = document.getElementById('gameBoard');
    this.positionElement = document.getElementById('position');
    this.movesElement = document.getElementById('moves');
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
  
  placeGnomeRandomly() {
    if (this.currentPosition !== null) {
      const oldCell = this.cells[this.currentPosition];
      oldCell.classList.remove('active');
      const gnome = oldCell.querySelector('.gnome');
      if (gnome) {
        gnome.remove();
      }
    }
    
    const newPosition = this.getRandomPosition(this.currentPosition);
    this.currentPosition = newPosition;
    
    const gnomeElement = document.createElement('img');
    gnomeElement.src = gnomeImage;
    gnomeElement.className = 'gnome';
    gnomeElement.alt = 'Гном';
    
    const newCell = this.cells[this.currentPosition];
    newCell.append(gnomeElement);
    newCell.classList.add('active');
    
    this.movesCount++;
    this.updateUI();
  }
  
  updateUI() {
    if (this.currentPosition !== null) {
      const row = Math.floor(this.currentPosition / this.boardSize);
      const col = this.currentPosition % this.boardSize;
      const positionLabel = `${String.fromCharCode(65 + row)}${col + 1}`;
      
      this.positionElement.textContent = positionLabel;
      this.movesElement.textContent = this.movesCount - 1;
    }
  }
  
  startMoving() {
    this.stopMoving();
    
    this.moveInterval = setInterval(() => {
      this.placeGnomeRandomly();
    }, 2000);
  }
  
  stopMoving() {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = null;
    }
  }
  
  bindEvents() {
    this.beforeUnloadHandler = this.cleanup.bind(this);
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
    
    this.visibilityHandler = () => {
      if (document.hidden) {
        this.stopMoving();
      } else {
        this.startMoving();
      }
    };
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }
  
  cleanup() {
    this.stopMoving();
    
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
    document.removeEventListener('visibilitychange', this.visibilityHandler);
    
    this.gameBoard.innerHTML = '';
    this.cells = [];
    this.currentPosition = null;
  }
}

let gameInstance = null;

function initGame() {
  if (gameInstance) {
    gameInstance.cleanup();
  }
  gameInstance = new SimpleGame();
}

window.addEventListener('beforeunload', () => {
  if (gameInstance) {
    gameInstance.cleanup();
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}