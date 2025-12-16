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
  message.textContent = `Mode: ${selected === 'player' ? 'Player vs Player' : 'Player vs Computer'}`;
}

function checkWinner() {
  for (let combo of winCombos) {
    const [a,b,c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameOver = true;
      combo.forEach(i => cells[i].classList.add('win'));
      message.textContent = `🎉 ${board[a]} MENANG!`;
      return;
    }
  }

  if (!board.includes('')) {
    gameOver = true;
    message.textContent = '😐 Seri';
  }
}

function computerMove() {
  let empty = board.map((v,i) => v === '' ? i : null).filter(v => v !== null);
  if (empty.length === 0) return;
  let move = empty[Math.floor(Math.random() * empty.length)];
  board[move] = 'O';
  cells[move].textContent = 'O';
  cells[move].classList.add('o');
  checkWinner();
  currentPlayer = 'X';
}

cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const i = cell.dataset.index;
    if (board[i] || gameOver) return;

    board[i] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    checkWinner();

    if (!gameOver) {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      if (mode === 'computer' && currentPlayer === 'O') {
        setTimeout(computerMove, 400);
      }
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