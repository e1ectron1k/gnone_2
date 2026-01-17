export default class Game {
    constructor() {
      this.score = 0;
      this.missed = 0;
      this.isPlaying = false;
      this.gameInterval = null;
      this.goblinInterval = 1000; // 1 секунда
      this.maxMissed = 5;
      
      this.board = null;
      this.goblin = null;
      
      this.initElements();
      this.bindEvents();
    }
    
    initElements() {
      this.scoreElement = document.getElementById('score');
      this.missedElement = document.getElementById('missed');
      this.statusElement = document.getElementById('status');
      this.startBtn = document.getElementById('startBtn');
      this.pauseBtn = document.getElementById('pauseBtn');
      this.resetBtn = document.getElementById('resetBtn');
    }
    
    bindEvents() {
      // Обработчики кнопок
      this.startBtn.addEventListener('click', () => this.start());
      this.pauseBtn.addEventListener('click', () => this.pause());
      this.resetBtn.addEventListener('click', () => this.reset());
      
      // Глобальные горячие клавиши
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
    
    initGame() {
      if (this.board) {
        this.board.container.innerHTML = '';
      }
      
      this.board = new GameBoard('gameBoard', 4);
      this.goblin = new Goblin(this.board);
      
      // Обработка кликов по клеткам
      this.board.addClickListener((cell) => {
        if (!this.isPlaying) return;
        
        if (cell.classList.contains('has-goblin')) {
          this.hitGoblin();
        } else {
          this.missClick();
        }
      });
    }
    
    start() {
      if (this.isPlaying) return;
      
      if (!this.board) {
        this.initGame();
      }
      
      this.isPlaying = true;
      this.updateUI();
      
      // Запускаем появление гоблинов
      this.gameInterval = setInterval(() => {
        if (this.missed >= this.maxMissed) {
          this.gameOver();
          return;
        }
        
        const success = this.goblin.show();
        if (!success) {
          // Если не удалось показать гоблина (все клетки заняты)
          this.goblin.hide(); // Скрываем текущего
          setTimeout(() => this.goblin.show(), 100); // Показываем в новой
        }
      }, this.goblinInterval);
    }
    
    pause() {
      if (!this.isPlaying) return;
      
      clearInterval(this.gameInterval);
      this.isPlaying = false;
      this.updateUI();
      
      // Скрываем гоблина при паузе
      this.goblin.hide();
    }
    
    reset() {
      this.pause();
      
      this.score = 0;
      this.missed = 0;
      this.isPlaying = false;
      
      this.initGame();
      this.updateUI();
    }
    
    hitGoblin() {
      if (this.goblin.hit()) {
        this.score++;
        this.updateScore();
        
        // Визуальный эффект попадания
        if (this.goblin.currentCell) {
          this.goblin.currentCell.classList.add('hit');
          setTimeout(() => {
            if (this.goblin.currentCell) {
              this.goblin.currentCell.classList.remove('hit');
            }
          }, 300);
        }
      }
    }
    
    missGoblin() {
      this.missed++;
      this.updateMissed();
      
      if (this.missed >= this.maxMissed) {
        this.gameOver();
      }
    }
    
    missClick() {
      // Штраф за клик мимо гоблина
      if (this.score > 0) {
        this.score--;
        this.updateScore();
      }
    }
    
    gameOver() {
      clearInterval(this.gameInterval);
      this.isPlaying = false;
      this.statusElement.textContent = 'Игра окончена!';
      this.statusElement.classList.add('game-over');
      
      // Скрываем гоблина
      this.goblin.hide();
      
      // Показываем итоговый счет
      setTimeout(() => {
        alert(`Игра окончена!\n\nВаш счёт: ${this.score}\nПропущено гоблинов: ${this.missed}`);
      }, 500);
    }
    
    updateScore() {
      this.scoreElement.textContent = this.score;
      this.scoreElement.classList.add('updated');
      setTimeout(() => {
        this.scoreElement.classList.remove('updated');
      }, 300);
    }
    
    updateMissed() {
      this.missedElement.textContent = `${this.missed}/${this.maxMissed}`;
      this.missedElement.classList.add('updated');
      setTimeout(() => {
        this.missedElement.classList.remove('updated');
      }, 300);
    }
    
    updateUI() {
      this.statusElement.textContent = this.isPlaying ? 'Играем' : 'Пауза';
      this.statusElement.classList.toggle('playing', this.isPlaying);
      this.statusElement.classList.toggle('paused', !this.isPlaying);
      
      this.startBtn.disabled = this.isPlaying;
      this.pauseBtn.disabled = !this.isPlaying;
      
      this.updateScore();
      this.updateMissed();
    }
  }