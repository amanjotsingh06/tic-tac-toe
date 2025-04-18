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
        const board = this.gameState.board.slice();
        const best = this.minimax(board, 'O');
        return best.index;
    }

    minimax(board, player) {
        const opponent = player === 'O' ? 'X' : 'O';
        const emptyIndices = board
            .map((val, idx) => val === '' ? idx : null)
            .filter(idx => idx !== null);

        if (this.checkWinner(board, 'X')) return { score: -10 };
        if (this.checkWinner(board, 'O')) return { score: 10 };
        if (emptyIndices.length === 0) return { score: 0 };

        const moves = [];

        for (let i = 0; i < emptyIndices.length; i++) {
            const index = emptyIndices[i];
            const newBoard = board.slice();
            newBoard[index] = player;

            const result = this.minimax(newBoard, opponent);
            moves.push({
                index: index,
                score: result.score
            });
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -Infinity;
            moves.forEach(move => {
                if (move.score > bestScore) {
                    bestScore = move.score;
                    bestMove = move;
                }
            });
        } else {
            let bestScore = Infinity;
            moves.forEach(move => {
                if (move.score < bestScore) {
                    bestScore = move.score;
                    bestMove = move;
                }
            });
        }

        return bestMove;
    }

    checkWinner(board, player) {
        return this.winPatterns.some(pattern => {
            return pattern.every(index => board[index] === player);
        });
    }

    checkWin() {
        return this.checkWinner(this.gameState.board, this.gameState.currentPlayer);
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
