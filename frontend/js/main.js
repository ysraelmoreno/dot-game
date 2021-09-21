const gameScreen = document.getElementById('gameScreen');
const gameScore = document.getElementById('gameScore');
const gameUsername = document.getElementById('gameUsername');
const BG_COLOUR = '#231f20';
const FOOD_COLOUR = 'rgb(21, 255, 0)';
const SNAKE_COLOUR = '#f5f5f5';

let ctx;


const gameState = {
  player: {
    pos: {
      x: 3,
      y: 10
    },
    speed: {
      x: 1,
      y: 1
    },
    score: 0
  },
  food: [
    {
      x: 3,
      y: 6
    }
  ],
  gridSize: 20,
  handlers: [
    {
      event: 'keydown',
      handler: keydown
    }
  ]
}

function setState(stateToChange,newState) {
  Object.assign(stateToChange, newState)
}

function start() {
  console.log("Ready to play!")
  console.log("You can play the game with the arrows of your keyboard, have fun! 🚀")

  ctx = gameScreen.getContext('2d');

  gameScreen.width = gameScreen.height = 600
  ctx.fillStyle = BG_COLOUR;
  ctx.clearRect(0, 0, gameScreen.width, gameScreen.height);
  handleScore(gameState.player.score)
  handlers(gameState.handlers)
  paintGame(gameState);

}

function setGameTime(time = 3000) {
  setTimeout(() => {
    finishGame();
  }, time)
}

function finishGame() {
  document.removeEventListener('keydown', keydown);

  window.alert(`Game Over ${gameUsername.innerHTML}! Your score is ${gameState.player.score}`);
}

function handlers(handlers) {
  handlers.forEach(handler => {
    document.addEventListener(handler.event, handler.handler);
  })
}

requestAnimationFrame(start)

function handleScore(score) {
  gameScore.innerHTML = `Score: ${score}`;
}

function foodRegeneration(state) {
  const foods = state.food;

  const position = Math.floor(Math.random() * (19 - 0 + 1) + 0);

  foods.forEach(food => {
    console.log(food)
    setState(food, { x: position, y: position })
    foodGenerate(state)
  })
}

function foodGenerate(state) {
  const size = gameScreen.width / state.gridSize;

  state.food.forEach(food => {
    ctx.fillStyle = FOOD_COLOUR;
    ctx.fillRect(food.x * size, food.y * size, size, size);
  })
}

function moveRight(player) {
  ctx.clearRect(0, 0, gameScreen.width, gameScreen.height);
  foodGenerate(gameState);

  const size = gameScreen.width / gameState.gridSize;

  if(player.pos.x >= gameState.gridSize - 1) {
    fillCanvasPlayer(player.pos.x, player.pos.y, size, SNAKE_COLOUR);
    return;
  }

  const newState = { x: player.pos.x + player.speed.x }

  setState(player.pos, newState)
  fillCanvasPlayer(player.pos.x, player.pos.y, size, SNAKE_COLOUR);
}

function moveLeft(player) {
  ctx.clearRect(0, 0, gameScreen.width, gameScreen.height);
  foodGenerate(gameState);

  const size = gameScreen.width / gameState.gridSize;

  if(player.pos.x <= 0) {
    fillCanvasPlayer(player.pos.x, player.pos.y, size, SNAKE_COLOUR);
    return;
  }

  const newState = { x: player.pos.x - player.speed.x }

  setState(player.pos, newState)
  fillCanvasPlayer(player.pos.x, player.pos.y, size, SNAKE_COLOUR);
}

function moveUp(player) {
  ctx.clearRect(0, 0, gameScreen.width, gameScreen.height);
  foodGenerate(gameState);

  const size = gameScreen.width / gameState.gridSize;

  if(player.pos.y <= 0) {
    fillCanvasPlayer(player.pos.x, player.pos.y, size, SNAKE_COLOUR);
    return;
  }

  const newState = { y: player.pos.y - player.speed.y }

  setState(player.pos, newState)
  fillCanvasPlayer(player.pos.x, player.pos.y, size, SNAKE_COLOUR);
}

function stateListener(state) {
  const player = state.player;
  const food = state.food;

  food.forEach(item => {
    if(player.pos.x === item.x && player.pos.y === item.y) {
      Object.assign(player, { score: player.score + 1 })
      handleScore(gameState.player.score)
      foodRegeneration(gameState);
    }
  })

}

function moveDown(player) {
  ctx.clearRect(0, 0, gameScreen.width, gameScreen.height);
  foodGenerate(gameState);
  const size = gameScreen.width / gameState.gridSize;

  if(player.pos.y >= gameState.gridSize - 1) {
    fillCanvasPlayer(player.pos.x, player.pos.y, size, SNAKE_COLOUR);
    return;
  }

  const newState = { y: player.pos.y + player.speed.y }

  setState(player.pos, newState)
  fillCanvasPlayer(player.pos.x, player.pos.y, size, SNAKE_COLOUR);
}

function keydown(e) {
  const player = gameState.player;
  const keyboardState = {
    ArrowRight: moveRight,
    ArrowLeft: moveLeft,
    ArrowUp: moveUp,
    ArrowDown: moveDown
  }

  if(!Object.keys(keyboardState).includes(e.key)) return;

  keyboardState[e.key](player);

  stateListener(gameState);
}

function fillCanvasPlayer(xPosition,yPosition, size, color) {
  ctx.fillStyle = color;
  ctx.fillRect(xPosition * size, yPosition * size, size, size);
}

function paintGame(state) {
  ctx.fillStyle = BG_COLOUR;

  const gridSize = state.gridSize;

  const size = gameScreen.width / gridSize;

  foodGenerate(state)

  paintPlayer(state.player, size, SNAKE_COLOUR)
}


function paintPlayer(player, size, colour) {
  const playerPosition = player.pos;

  ctx.fillStyle = colour;
  ctx.fillRect(playerPosition.x * size, playerPosition.y * size, size, size);
}
