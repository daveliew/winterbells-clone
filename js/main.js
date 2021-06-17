/** @type {HTMLCanvasElement} */
//! TO DO LIST
//* core game build
//? add viewport + fix bg image
//? add sprites
//? add bird to double bonus
//? refactor code --> clear all //? stuff.
//* optimisation
//? tune bellRender() --> translation causes bells to end up in same col?
//? add delta time
//? save max score to local storage?
//? create background image
//? add pre-rendering for main character
//////////////////
//* ***DATA*** *//
//////////////////
const restartButton = document.getElementById("restart");
const gameOverMessage = document.getElementById("gameover");

//* customisable game settings
const audioObj = new Audio("/assets/winterbells.mp3");
audioObj.play();

const gravityPull = 2.5;
const framesPerSnow = 200;
const startNumBells = 10; //* change number of bells generated on load

//* initial game settings
const mouse = {
  x: canvas.width,
  y: canvas.height,
};

let playerActivated = false;
let mouseClick = false;
let gameFrame = 0;
let lowestBell = {}; //! is this useless?
let firstClick = true;

//* in-game calculations
let playerHeight = 0;
let crossedHeight = false;
let score = 0;
let cameraPositionY = 0; //! work on viewport later

/////////////////////////
//* *** FUNCTIONS *** *//
/////////////////////////
const hasCollided = (player, bell) => {
  const collisionDistance = player.width + bell.size;

  const distance = Math.sqrt(
    Math.pow(player.x - bell.x, 2) + Math.pow(player.y - bell.y, 2)
  );

  if (distance < collisionDistance) {
    player.collided = true;
    bell.collided = true;
    player.y = playerJump;
    player.velocityY = playerJumpVelocity;
    player.addScore();
    return true;
  }
};

const gameOver = () => {
  console.log("YOU LOST!");
  restartButton.style.display = "block";
  gameOverMessage.textContent = `Good try! Your score is ${score}.`;
  gameOverMessage.style.display = "block";
  playerActivated = false;
  window.cancelAnimationFrame(id);
};

//* ***EVENT LISTENERS*** *//
window.addEventListener("resize", () => {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
});

window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

//? fix this code
window.addEventListener("mousedown", (event) => {
  mouseClick = true;
  player.jumping = false;
  player.velocityY = playerJumpVelocity;

  if (playerActivated === false) {
    playerActivated = true;
    gameLoop(timeStamp);
  }

  console.log(event + "detected");
});

restartButton.addEventListener("click", () => {
  console.log("restarting!");
  document.location.reload();
  // resetGame();
});

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
  lastTimeStamp = timeStamp;

  secondsPassed = Math.min(secondsPassed, 0.1);
  fps = 1 / secondsPassed;

  //* clear screen for next frame phase
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bgCtx.clearRect(0, 0, canvas.width, canvas.height);
  snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

  //* check gameover
  if (firstClick === false && score > 0) {
    if (player.y >= canvas.height - player.height) {
      gameOver();
    }
  }

  //* bell code
  bellRender(bellArray);

  //* player position calculations
  playerHeight = Math.floor((canvas.height - player.y) / 100);

  if (playerHeight > highestHeight) {
    highestHeight = playerHeight;
    crossedHeight = true;
    if (highestHeight >= 2 && highestHeight % 2 === 0) {
      //! tune this
      crossedHeight = false;
      console.log("CROSSED HEIGHT!");
    }
  }

  //* player code
  player.update(secondsPassed);
  player.draw();
  // lowestBell = bellArray[0];
  // hasCollided(player, lowestBell); //! think about which bell it is later

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
  bgCtx.fillText(`Score: ${score}`, 20, 20);
  particlesHandler();

  //* camera translate
  // cameraDraw();

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

const makeNewBells = generateXArr(currCol, startNumBells, difficulty);
const startingBellY = player.y - canvas.height / 2;
generateBell(makeNewBells, startingBellY, startNumBells);

if (playerActivated) {
  gameLoop(timeStamp);
} else {
  const message1 = "Welcome to Winterbells!";
  const textWidth1 = snowCtx.measureText(message1).width;
  snowCtx.font = "36px Josefin Sans";
  snowCtx.fillStyle = "white";

  const message2 = "Left-click to start. Use the mouse to move left or right.";
  const textWidth2 = ctx.measureText(message2).width;
  ctx.font = "20px Josefin Sans";
  ctx.fillStyle = "darkslategreen";

  snowCtx.fillText(
    message1,
    snowCanvas.width / 2 - textWidth1 * 1.8,
    snowCanvas.height / 2 - 50
  );
  ctx.fillText(message2, canvas.width / 2 - textWidth2, canvas.height / 2 + 50);
  console.log("NOT STARTED");
}
