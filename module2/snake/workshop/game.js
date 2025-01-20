const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const BLOCK_SIZE = 20;

// Colors
const COLORS = {
    background: "white",
    snake: "black",
    food: "gray",
    text: "black",
    gameOver: "red",
};

// Game state
let state;
const startState = {
    snake: [{ x: canvas.width / 2, y: canvas.height / 2 }],
    direction: { x: 0, y: 0 },
    food: { x: getRandomPosition(canvas.width), y: getRandomPosition(canvas.height) },
    score: 0,
    gameOver: false,
    stop: false,
    speed: 150,
}

// Utility functions
function getRandomPosition(max) {
    return Math.floor(Math.random() * (max / BLOCK_SIZE)) * BLOCK_SIZE;
}

function drawRect(color, x, y, width, height) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawText(text, color, x, y, size = 20) {
    ctx.fillStyle = color;
    ctx.font = `${size}px Arial`;
    ctx.fillText(text, x, y);
}

function resetGame() {
    state = structuredClone(startState);
}

// Game loop
function update() {
    if (state.gameOver) return;

    const head = { x: state.snake[0].x + state.direction.x, y: state.snake[0].y + state.direction.y };

    // Check collisions with walls
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        state.gameOver = true;
        return;
    }

    // Check collisions with self
    if(state.snake.length > 1) {
        for (let block of state.snake) {
            if (head.x === block.x && head.y === block.y) {
                state.gameOver = true;
                return;
            }
        }
    }

    // Add new head to the snake
    state.snake.unshift(head);

    // Check if snake eats the food
    if (head.x === state.food.x && head.y === state.food.y) {
        state.score++;
        state.speed = Math.max(10, state.speed-10);
        state.food = { x: getRandomPosition(canvas.width), y: getRandomPosition(canvas.height) };
    } else {
        // Remove the tail
        state.snake.pop();
    }
}

function draw() {
    // Clear the canvas
    drawRect(COLORS.background, 0, 0, canvas.width, canvas.height);

    // Draw the food
    drawRect(COLORS.food, state.food.x, state.food.y, BLOCK_SIZE, BLOCK_SIZE);

    // Draw the snake
    for (let block of state.snake) {
        drawRect(COLORS.snake, block.x, block.y, BLOCK_SIZE, BLOCK_SIZE);
    }

    // Draw the score
    drawText(`Score: ${state.score}`, COLORS.text, 10, 20);

    if (state.gameOver) {
        drawText("Game Over! Press R to Restart", COLORS.gameOver, canvas.width / 4, canvas.height / 2, 30);
    }

    if(state.stop) {
        drawText("Game Paused! Press R to Resume", COLORS.gameOver, canvas.width / 4, canvas.height / 2, 30);
    }
}

function gameLoop() {
    update();
    draw();
    if (!state.gameOver && !state.stop) {
        setTimeout(gameLoop, state.speed);
    }
}

// Event listener for controls
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && state.direction.y === 0) {
        state.direction = { x: 0, y: -BLOCK_SIZE };
    } else if (event.key === "ArrowDown" && state.direction.y === 0) {
        state.direction = { x: 0, y: BLOCK_SIZE };
    } else if (event.key === "ArrowLeft" && state.direction.x === 0) {
        state.direction = { x: -BLOCK_SIZE, y: 0 };
    } else if (event.key === "ArrowRight" && state.direction.x === 0) {
        state.direction = { x: BLOCK_SIZE, y: 0 };
    } else if (["r","R"].includes(event.key) && state.gameOver) {
        resetGame();
        gameLoop();
    } else if (["r","R"].includes(event.key) && state.stop) {
        state.stop = false;
        gameLoop();
    } else if (["s","S"].includes(event.key)) {
        state.stop = true;
    }
});

resetGame();
gameLoop();