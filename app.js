class TicTacToe {
    constructor() {
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.gameState = {
            board: Array(9).fill(''),
            currentPlayer: 'X',
            isComputerMode: true,
            scores: { X: 0, O: 0 },
            gameActive: true
        };

        this.winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        this.elements = {
            cells: document.querySelectorAll('.cell'),
            modeToggle: document.getElementById('mode-toggle'),
            resetBtn: document.getElementById('reset-btn'),
            newGameBtn: document.getElementById('new-game-btn'),
            modal: document.querySelector('.modal'),
            resultMessage: document.getElementById('result-message'),
            scoreDisplay: document.getElementById('score-display'),
            turnDisplay: document.getElementById('turn-display')
        };

        this.updateDisplay();
    }

    setupEventListeners() {
        this.elements.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });
        this.elements.modeToggle.addEventListener('click', () => this.toggleGameMode());
        this.elements.resetBtn.addEventListener('click', () => this.resetGame());
        this.elements.newGameBtn.addEventListener('click', () => this.startNewGame());
    }

    handleCellClick(cell) {
        const index = cell.dataset.index;
        if (this.isValidMove(index)) {
            this.makeMove(index);
            
            if (this.gameState.isComputerMode && this.gameState.gameActive) {
                this.makeComputerMove();
            }
        }
    }

    isValidMove(index) {
        return this.gameState.gameActive && 
               this.gameState.board[index] === '' &&
               (!this.gameState.isComputerMode || this.gameState.currentPlayer === 'X');
    }

    makeMove(index) {
        this.gameState.board[index] = this.gameState.currentPlayer;
        this.updateCell(index);
        
        if (this.checkWin()) {
            this.handleWin();
        } else if (this.checkDraw()) {
            this.handleDraw();
    } else {
            this.switchPlayer();
        }
    }

    makeComputerMove() {
        setTimeout(() => {
            const index = this.getBestMove();
            if (index !== -1) {
                this.makeMove(index);
            }
        }, 500);
    }

    getBestMove() {
        // Try to win
        const winMove = this.findWinningMove('O');
        if (winMove !== -1) return winMove;

        // Block player
        const blockMove = this.findWinningMove('X');
        if (blockMove !== -1) return blockMove;

        // Take center
        if (this.gameState.board[4] === '') return 4;

        // Take any available corner
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => this.gameState.board[i] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        // Take any available side
        const sides = [1, 3, 5, 7];
        const availableSides = sides.filter(i => this.gameState.board[i] === '');
        if (availableSides.length > 0) {
            return availableSides[Math.floor(Math.random() * availableSides.length)];
        }

        return -1;
    }

    findWinningMove(player) {
        for (let i = 0; i < this.gameState.board.length; i++) {
            if (this.gameState.board[i] === '') {
                this.gameState.board[i] = player;
                if (this.checkWin()) {
                    this.gameState.board[i] = '';
                    return i;
                }
                this.gameState.board[i] = '';
            }
        }
        return -1;
    }

    checkWin() {
        return this.winPatterns.some(pattern => {
            const line = pattern.map(i => this.gameState.board[i]);
            return line.every(cell => cell === this.gameState.currentPlayer);
        });
    }

    checkDraw() {
        return this.gameState.board.every(cell => cell !== '');
    }

    handleWin() {
        this.gameState.scores[this.gameState.currentPlayer]++;
        this.gameState.gameActive = false;
        this.showResult(`Player ${this.gameState.currentPlayer} wins!`);
        this.updateDisplay();
    }

    handleDraw() {
        this.gameState.gameActive = false;
        this.showResult("It's a draw!");
    }

    showResult(message) {
        this.elements.resultMessage.textContent = message;
        this.elements.modal.classList.remove('hide');
    }

    switchPlayer() {
        this.gameState.currentPlayer = this.gameState.currentPlayer === 'X' ? 'O' : 'X';
        this.updateDisplay();
    }

    updateCell(index) {
        const cell = this.elements.cells[index];
        cell.textContent = this.gameState.board[index];
        cell.dataset.symbol = this.gameState.board[index];
    }

    updateDisplay() {
        this.elements.scoreDisplay.textContent = 
            `Score - X: ${this.gameState.scores.X} O: ${this.gameState.scores.O}`;
        this.elements.turnDisplay.textContent = 
            `Current Turn: ${this.gameState.currentPlayer}`;
    }

    toggleGameMode() {
        this.gameState.isComputerMode = !this.gameState.isComputerMode;
        this.elements.modeToggle.textContent = 
            this.gameState.isComputerMode ? 'Switch to Player vs Player' : 'Switch to Player vs Computer';
        this.resetGame();
    }

    resetGame() {
        this.gameState.board = Array(9).fill('');
        this.gameState.currentPlayer = 'X';
        this.gameState.gameActive = true;
        this.elements.cells.forEach(cell => {
            cell.textContent = '';
            cell.dataset.symbol = '';
        });
        this.elements.modal.classList.add('hide');
        this.updateDisplay();
    }

    startNewGame() {
        this.resetGame();
    }
}

// Initialize the game
new TicTacToe();