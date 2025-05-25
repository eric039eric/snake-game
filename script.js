const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = "RIGHT";
let food = {
  x: Math.floor(Math.random() * 19) * box,
  y: Math.floor(Math.random() * 19) * box
};
let score = 0;
let startTime = null;
let elapsedTime = 0;
let timerInterval = null;


document.addEventListener("keydown", changeDirection);

document.querySelectorAll(".dir-btn").forEach(button => {
  button.addEventListener("click", function () {
    const dir = this.getAttribute("data-dir");
    if (dir === "UP" && direction !== "DOWN") direction = "UP";
    if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
    if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
    if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
  });
});


function changeDirection(e) {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function drawGame() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 畫蛇
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#0f0" : "#7cfc00";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // 畫食物
  ctx.fillStyle = "#f00";
  ctx.fillRect(food.x, food.y, box, box);

  // 移動蛇
  let head = { x: snake[0].x, y: snake[0].y };

  if (direction === "LEFT") head.x -= box;
  if (direction === "UP") head.y -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "DOWN") head.y += box;

  // 吃到食物
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 19) * box,
      y: Math.floor(Math.random() * 19) * box
    };
  } else {
    snake.pop(); // 沒吃就移除尾巴
  }

  // 撞牆或撞自己
  if (
  head.x < 0 || head.x >= canvas.width ||
  head.y < 0 || head.y >= canvas.height ||
  snake.slice(1).some(seg => seg.x === head.x && seg.y === head.y)
) {
  clearInterval(game);
  game = null;
  document.getElementById("restartButton").style.display = "inline-block";
}


  snake.unshift(head);
}

function resetGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "RIGHT";
  food = {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
  };
  score = 0;

  if (game) clearInterval(game);
  game = setInterval(drawGame, 150);
  document.getElementById("restartButton").style.display = "none";
}


let game = null;

document.getElementById("startButton").addEventListener("click", () => {
  if (!game) {
    game = setInterval(drawGame, 150);
    document.getElementById("startButton").style.display = "none";
  }
});

document.getElementById("startButton").addEventListener("click", () => {
  document.getElementById("startOverlay").style.display = "none";
  resetGame();
});

document.getElementById("endOverlay").style.display = "flex";
document.getElementById("endOverlay").innerText =
  `遊戲結束！\n分數：${score} 分\n時間：${Math.floor(elapsedTime / 1000)} 秒`;


document.getElementById("scoreDisplay").innerText = `分數：${score}`;

document.getElementById("restartButton").addEventListener("click", resetGame);

clearInterval(timerInterval);

