export default class GameBoard {
    constructor(containerId, size = 4) {
      this.container = document.getElementById(containerId);
      this.size = size;
      this.cells = [];
      this.init();
    }
    
    init() {
      this.container.innerHTML = '';
      this.cells = [];
      
      // Создаем сетку size x size
      this.container.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
      this.container.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
      
      for (let i = 0; i < this.size * this.size; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        
        // Добавляем координаты для отладки
        const row = Math.floor(i / this.size);
        const col = i % this.size;
        const label = document.createElement('span');
        label.className = 'cell-label';
        label.textContent = `${row + 1}-${col + 1}`;
        cell.append(label);
        
        this.container.append(cell);
        this.cells.push(cell);
      }
    }
    
    getEmptyCells() {
      return this.cells.filter(cell => !cell.classList.contains('has-goblin'));
    }
    
    getAllCells() {
      return this.cells;
    }
    
    addClickListener(callback) {
      this.container.addEventListener('click', (event) => {
        const cell = event.target.closest('.cell');
        if (cell) {
          callback(cell);
        }
      });
    }
    
    highlightCell(index) {
      this.cells.forEach((cell, i) => {
        cell.classList.toggle('highlight', i === index);
      });
    }
    
    clearHighlights() {
      this.cells.forEach(cell => cell.classList.remove('highlight'));
    }
  }