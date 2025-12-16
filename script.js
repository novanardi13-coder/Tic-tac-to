const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');

let board = Array(9).fill('');
let currentPlayer = 'X';
let gameOver = false;
let mode = 'player';

const winCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function setMode(selected) {
  mode = selected;
  restartGame();
  message.textContent = `Mode: ${selected === 'player' ? 'Player vs Player' : 'Player vs Computer (Hard)'}`;
}

function checkWinner(boardCheck = board) {
  for (let combo of winCombos) {
    const [a,b,c] = combo;
    if (boardCheck[a] && boardCheck[a] === boardCheck[b] && boardCheck[a] === boardCheck[c]) {
      return boardCheck[a];
    }
  }
  return boardCheck.includes('') ? null : 'tie';
}

function highlightWin() {
  for (let combo of winCombos) {
    const [a,b,c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      combo.forEach(i => cells[i].classList.add('win'));
    }
  }
}

function minimax(newBoard, player) {
  const result = checkWinner(newBoard);
  if (result === 'O') return { score: 10 };
  if (result === 'X') return { score: -10 };
  if (result === 'tie') return { score: 0 };

  let moves = [];

  newBoard.forEach((cell, i) => {
    if (cell === '') {
      let move = {};
      move.index = i;
      newBoard[i] = player;

      if (player === 'O') {
        move.score = minimax(newBoard, 'X').score;
      } else {
        move.score = minimax(newBoard, 'O').score;
      }

      newBoard[i] = '';
      moves.push(move);
    }
  });

  let bestMove;
  if (player === 'O') {
    let bestScore = -Infinity;
    moves.forEach(m => {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach(m => {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    });
  }

  return bestMove;
}

function computerMove() {
  let best = minimax(board, 'O');
  board[best.index] = 'O';
  cells[best.index].textContent = 'O';
  cells[best.index].classList.add('o');
}

cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const i = cell.dataset.index;
    if (board[i] || gameOver) return;

    board[i] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    let result = checkWinner();
    if (result) {
      gameOver = true;
      if (result !== 'tie') highlightWin();
      message.textContent = result === 'tie' ? '😐 Seri' : `🎉 ${result} MENANG!`;
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (mode === 'computer' && currentPlayer === 'O') {
      setTimeout(() => {
        computerMove();
        let res = checkWinner();
        if (res) {
          gameOver = true;
          if (res !== 'tie') highlightWin();
          message.textContent = res === 'tie' ? '😐 Seri' : `🎉 ${res} MENANG!`;
        }
        currentPlayer = 'X';
      }, 300);
    }
  });
});

function restartGame() {
  board.fill('');
  gameOver = false;
  currentPlayer = 'X';
  message.textContent = '';
  cells.forEach(c => {
    c.textContent = '';
    c.className = 'cell';
  });
}