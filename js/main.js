/** @type {HTMLCanvasElement} */
//! TO DO LIST
//* unfinished business
//? add bird to double bonus
//? floating message score
//? tune bellRender() --> translation causes bells to end up in same col?
//? add viewport + fix bg image
//? add pre-rendering for main character
//////////////////
//* ***DATA*** *//
//////////////////
const restartButton = document.getElementById("restart");
const gameOverMessage = document.getElementById("gameover");
const canvasPosition = canvas.getBoundingClientRect(); // retrieve canvas x, y pos

//* customisable game settings
const bgMusic = new Audio("/assets/winterbells.mp3");
const rocketSound = new Audio("/assets/rocket.wav");
const burstSound = new Audio("/assets/burst.wav");
const awwSound = new Audio("/assets/aww.mp3");
bgMusic.play();

const gravityPull = 2.5;
const framesPerSnow = 200;
const startNumBells = 10; //* change number of bells generated on load

//* initial game settings
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

let playerActivated = false;
let mouseClick = false;
let gameFrame = 0;
let lowestBell = {};
let firstClick = true;
let boosts = 10;
let bursts = 0;

//* in-game calculations
let playerHeight = 0;
let crossedHeight = false;
let score = 0;
let highScore = 0;

/////////////////////////
//* *** FUNCTIONS *** *//
/////////////////////////
const checkHighScore = (score) => {
  highScore = parseInt(localStorage.getItem("highscore"));
  if (score > highScore) {
    localStorage.setItem("highscore", score);
  }
};

const hasCollided = (player, obj) => {
  const collisionDistance = player.width / 2 + obj.size / 2;

  const distance = Math.sqrt(
    Math.pow(player.x - obj.x, 2) + Math.pow(player.y - obj.y, 2)
  );

  if (distance < collisionDistance) {
    player.collided = true;
    obj.collided = true;
    player.jumping = true;
    player.y = playerJump;
    player.velocityY = playerJumpVelocity;
    player.addScore();

    return true;
  }
};

const gameOver = () => {
  console.log("YOU LOST!");
  canvas.style.cursor = "pointer";
  if (score === highScore) {
    gameOverMessage.textContent = `Nice! You set a new high score ${highScore}.`;
  } else {
    gameOverMessage.textContent = `Good try! Your score is ${score}.`;
  }
  restartButton.style.display = "block";
  gameOverMessage.style.display = "block";

  playerActivated = false;
  window.cancelAnimationFrame(id);
};

//* Game Loop Settings (research delta time!)
let secondsPassed,
  lastTimeStamp,
  timeStamp,
  highestHeight = 0;
let fps = 1;
let movingSpeed = 50; //! is this used?

////////////////////////////////
//* *** GAME LOOP *** *//
////////////////////////////////
const gameLoop = (timeStamp) => {
  let id = window.requestAnimationFrame;

  //* time calculation
  secondsPassed = (timeStamp - lastTimeStamp) / 1000; // number of frames to produce this.
  secondsPassed = Math.min(secondsPassed, 0.1);
  lastTimeStamp = timeStamp;
  fps = 1 / secondsPassed;

  //* clear screen for next frame phase
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bgCtx.clearRect(0, 0, canvas.width, canvas.height);
  snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

  //* check gameover
  checkHighScore(score);
  if (firstClick === false && score > 0) {
    if (player.y >= canvas.height - player.height || boosts === 0) {
      awwSound.play();
      gameOver();
    }
  }

  //* bell code
  bellRender(bellArray);
  balloonHandler();

  //* player position calculations
  playerHeight = Math.floor((canvas.height - player.y) / 100);

  if (playerHeight > highestHeight && playerHeight === 3) {
    highestHeight = playerHeight;
    crossedHeight = true;

    if (highestHeight >= 2 && highestHeight % 2 === 0) {
      crossedHeight = false;
    }
  }

  //* player code
  player.update(secondsPassed);
  player.draw();
  lowestBell = bellArray[0];
  hasCollided(player, lowestBell);

  //* snow code
  snowCtx.fillStyle = "rgba(40,48,56,0.25)";
  snowRender(snow.snowArray);
  if (gameFrame % framesPerSnow === 0) {
    generateSnow(); //only generate snow every 200 frames
    // console.log("***BELLS STATUS***", bellArray);
  }

  //* screen cosmetics
  bgCtx.font = "16px Josefin Sans";
  bgCtx.fillStyle = "white";
  bgCtx.fillText(
    `Score: ${score}  |  Boosts: ${boosts} | Bursts: ${bursts}`,
    20,
    20
  );
  // bgCtx.fillText(
  //   `HighScore: ${highScore} | Score: ${score}  |  Boosts: ${boosts} | Bursts: ${bursts}`,
  //   20,
  //   20
  // ); //! highscore doesn't seem to work on vercel
  particlesHandler();

  //* Incrementors + resets
  hue += 2; // change trail colour
  gameFrame++;

  requestAnimationFrame(gameLoop); // recursive game loop

  //! TEST AREA
  // console.log("player X pos and velocity", player.x, player.velocityX);
  // console.log("player Y pos and velocity", player.y, player.velocityY);
  // console.log("ground level: ",canvas.height - player.height);
  // console.log("playerHeight", playerHeight, "highestHeight", highestHeight);
  // console.log("FPS: ",fps);
};

////////////////////////////////
//* *** INITIALIZE GAME  *** *//
////////////////////////////////

const player = new Player();
generateSnow();

if (localStorage.getItem("highscore" === null)) {
  highScore = localStorage.setItem("highscore", 0);
} else {
  highScore = localStorage.getItem("highscore");
}

const makeNewBells = generateXArr(currCol, startNumBells, difficulty);
const startingBellY = player.y - canvas.height / 2;
generateBell(makeNewBells, startingBellY, startNumBells);

if (playerActivated) {
  gameLoop(timeStamp);
} else {
  const h1Text = "Welcome to !Winterbells";
  const h1TextWidth = snowCtx.measureText(h1Text).width;
  snowCtx.font = "36px Josefin Sans";
  snowCtx.fillStyle = "white";

  const h2Text =
    "Move mouse for left or right. Left Click to boost. Careful - there's a price!";
  const h2TextWidth = ctx.measureText(h2Text).width;
  ctx.font = "16px Josefin Sans";
  ctx.fillStyle = "darkslategreen";

  const h3Text = "(P.S. Avoid the shiny things)";
  const h3TextWidth = bgCtx.measureText(h3Text).width;
  bgCtx.font = "13px Josefin Sans";
  bgCtx.fillStyle = "darkslategrey";

  snowCtx.fillText(
    h1Text,
    snowCanvas.width / 2 - h1TextWidth * 1.8,
    snowCanvas.height / 2 - 50
  );
  ctx.fillText(h2Text, canvas.width / 2 - 250, canvas.height / 2 + 50);
  bgCtx.fillText(h3Text, GAME_WIDTH - 200, GAME_HEIGHT - 10);
  console.log("GAME READY");
}

//* ***EVENT LISTENERS*** *//
// resize canvas when window size changes
window.addEventListener("resize", () => {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
});

// detect mouse moves
document.addEventListener("mousemove", (event) => {
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;
});

// detect mouse clicks
document.addEventListener("mousedown", (event) => {
  mouseClick = true;
  player.jumping = false;
  player.velocityY = playerJumpVelocity;

  if (playerActivated === false) {
    playerActivated = true;
    gameLoop(timeStamp);
  } else {
    boosts -= 1;
    rocketSound.play();
  }

  console.log(event + "detected");
});

// detect user selecting restart
restartButton.addEventListener("click", () => {
  console.log("restarting!");
  document.location.reload();
});
