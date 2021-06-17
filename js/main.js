/** @type {HTMLCanvasElement} */
//! TO DO LIST
//* core game build
//? add gameover
//? add condition that after first bell is caught, gameover sequence triggered
//? add viewport + fix bg image
//? add sprites
//? add bird to double bonus
//? refactor code --> clear all //? stuff.
//* optimisation
//? create background image
//? add delta time
//? save max score
//? add pre-rendering for main character
//////////////////
//* ***DATA*** *//
//////////////////
const audioObj = new Audio("/assets/winterbells.mp3");
audioObj.play();

const gravityPull = 2.5;
const framesPerSnow = 200;

let playerActivated = false;
let mouseClick = false;
let gameFrame = 0;
let lowestBell = {}; //! is this useless?

let playerHeight = 0;
let crossedHeight = false;
let score = 0;
let cameraPositionY = 0; //! work on viewport later

const mouse = {
  x: canvas.width,
  y: canvas.height,
};

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

//* ***EVENT LISTENERS*** *//
window.addEventListener("resize", () => {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
});

document.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

//? fix this code
document.addEventListener("mousedown", (event) => {
  mouseClick = true;
  player.jumping = false;
  player.velocityY = playerJumpVelocity;

  if (playerActivated === false) {
    playerActivated = true;
    gameLoop(timeStamp);
  }

  // player.y += -30;
  console.log(event + "detected");

  //? find a way to remove mousedown after click so that player must use bells to jump
  //? https://www.geeksforgeeks.org/javascript-removeeventlistener-method-with-examples/
});

//! do i need gameover stop?
// const stopGameLoop = () => {
//   window.cancelAnimationFrame(requestAnimationFrameId);
// };

////////////////////////////////
//* *** GAME LOOP *** *//
////////////////////////////////
const gameLoop = (timeStamp) => {
  //* time calculation

  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  secondsPassed = Math.min(secondsPassed, 0.1);
  oldTimeStamp = timeStamp;

  //* reset variables for next frame phase
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
  snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
  snowCtx.fillStyle = "rgba(40,48,56,0.25)";
  snowRender(snow.snowArray);
  if (gameFrame % framesPerSnow === 0) {
    generateSnow(); //only generate snow every 200 frames
    // console.log("***BELLS STATUS***", bellArray);
  }

  //* screen cosmetics
  ctx.font = "20px Josefin Sans";
  ctx.fillStyle = "white";
  ctx.fillText(`Score: ${score}`, 20, 25);
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
  // console.log("playerHeight", playerHeight, "highestHeight", highestHeight);
};

////////////////////////////////
//* *** INITIALIZE GAME  *** *//
////////////////////////////////

const player = new Player();
generateSnow();

const makeNewBells = generateXArr(currX, numBells, difficulty);
console.log("initial", makeNewBells);
const startingBellY = player.y - canvas.height / 2;
generateBell(makeNewBells, startingBellY);

//*Handle Dynamic Frames using timeStamp (research Delta Time)
let secondsPassed,
  oldTimeStamp,
  timeStamp,
  highestHeight = 0;

let movingSpeed = 50;

if (playerActivated) {
  mouse.x = canvas.width / 2;
  mouse.y = canvas.height / 2;
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
  console.log(textWidth1, textWidth2);
}
