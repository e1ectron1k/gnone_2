export default class Goblin {
    constructor(board) {
      this.board = board;
      this.currentCell = null;
      this.timeout = null;
      this.isVisible = false;
      
      // Создаем элемент гоблина
      this.element = document.createElement('div');
      this.element.className = 'goblin';
      this.element.innerHTML = '👹';
    }
    
    show() {
      if (this.isVisible) return false;
      
      // Выбираем случайную свободную клетку
      const emptyCells = this.board.getEmptyCells();
      if (emptyCells.length === 0) return false;
      
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.currentCell = randomCell;
      
      // Добавляем гоблина в клетку
      this.currentCell.append(this.element);
      this.currentCell.classList.add('has-goblin');
      this.isVisible = true;
      
      // Автоматическое скрытие через 1 секунду
      this.timeout = setTimeout(() => {
        this.hide();
      }, 1000);
      
      return true;
    }
    
    hide() {
      if (!this.isVisible) return;
      
      clearTimeout(this.timeout);
      
      if (this.currentCell) {
        this.currentCell.classList.remove('has-goblin');
        const goblinElement = this.currentCell.querySelector('.goblin');
        if (goblinElement) {
          goblinElement.remove();
        }
      }
      
      this.currentCell = null;
      this.isVisible = false;
    }
    
    hit() {
      if (!this.isVisible) return false;
      
      this.hide();
      return true;
    }
  }