/** @type {HTMLCanvasElement} */
//! TO DO LIST
//* core game build
//? add viewport + fix bg image
//? add condition that after first bell is caught, gameover sequence triggered
//* finesse
//? add sprites
//? create max width and height
//? create background image
//* optimisation
//? add delta time
//? add pre-rendering for main character
//? ==> https://www.html5rocks.com/en/tutorials/canvas/performance/
//? ==> https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
//? multiple js files to better read code
//? refactor code --> clear all //? stuff.

//* ***DATA*** *//
const canvas = document.getElementById("game-layer");
const ctx = canvas.getContext("2d");

const audioObj = new Audio("/assets/winterbells.mp3");
audioObj.play();

const GAME_WIDTH = 32 * 15;
const GAME_HEIGHT = 32 * 20;
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const colWidth = Math.floor(canvas.width / numBellCols);
const SCREEN_X_MID = Math.floor(canvas.width / 2);

const gravityPull = 3;
const collisionDistance = 20;
const difficulty = 3;
const framesPerSnow = 200;

const numBells = 10; //* change number of bells
const bellSpacing = 100;
const playerJump = bellSpacing * 1.3;
const minBellHeight = playerJump - bellSize;
const bellTranslation = 100;

let playerActivated = false;

let mouseClick = false;
let gameFrame = 0;
let lowestBell = {}; //! is this useless?

let playerHeight = 0;
let crossedHeight = false;
let score = 0;

const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

//* ***MAIN PROGRAMME*** *//

//* Generate bell
//? refactor this to Simon's suggestion if there's time --> next bell takes a random pos from the array of possibilities
// [ - - - X - - -] 5
// [ - X - - - - -] 4
// [ - - - X - - -] 3
// [ - - - - - X -] 2
// [ - - X - - - -] 1
const bellXpos = [
  SCREEN_X_MID - colWidth * 3,
  SCREEN_X_MID - colWidth * 2,
  SCREEN_X_MID - colWidth * 1,
  SCREEN_X_MID,
  SCREEN_X_MID + colWidth * 1,
  SCREEN_X_MID + colWidth * 2,
  SCREEN_X_MID + colWidth * 3,
];

let prevX = 0;
let currX = Math.floor(bellXpos.length / 2); //3, start at centre

const randBellX = () => {
  prevX = currX;
  while (
    currX === prevX || //prevents a random bell from having same X as a previous bell
    currX - prevX <= -difficulty || //prevents a bell from being too far from a current bell
    currX - prevX >= difficulty
  ) {
    currX = Math.floor(Math.random() * bellXpos.length);
  }
  return currX;
};

const generateBell = (posY) => {
  let prevY = posY;
  while (bellArray.length < numBells) {
    let newX = randBellX();
    let bell = new Bell(bellXpos[newX], prevY);
    prevY -= bellSpacing;
    lowestBell = bell;
    bellArray.push(bell);
    // console.log("***BELL CREATED***", bell);
  }
};

const bellRender = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    if (crossedHeight) {
      arr[i].y = arr[i].y + bellTranslation;
      console.log("we're going places!");
    }
    arr[i].update();
    arr[i].draw();
    hasCollided(player, arr[i]);
    if (arr[i].collided === true || arr[i].y > canvas.height - 100) {
      arr.splice(i, 1); // remove bell from array to manage total #objects
    }
  }
  const minBells = Math.ceil(numBells / 2);
  if (arr.length <= minBells) {
    generateBell(arr[0].y - bellSpacing * (minBells - 1));
  }

  crossedHeight = false; // reset trigger for bell translation
};

//* Generate Player
//? use a jumping method inside
class Player {
  constructor() {
    this.width = 20;
    this.height = 20;
    this.mass = 10; //?
    this.x = canvas.width / 2;
    this.y = canvas.height - this.height; //! testing
    this.velocityX = 4;
    this.velocityY = -8; //? what is a good boost rate?
    this.jumping = false;
    this.collided = false; //? useless?
    this.parallax = this.y; //? useless?
  }
  update() {
    if (!playerActivated) {
      return;
    } // prevent left right movement till screen is clicked.

    if (mouseClick && this.jumping === false) {
      // this.y += 50 * secondsPassed;  //! change to seconds
      this.y += -100;

      mouseClick = false; //! testing
      this.jumping = true;
      this.parallax = GAME_HEIGHT - this.y; //? useless?
    }

    if (this.collided) {
      this.y += -50;
      this.collided = false;
    }

    //? trying this method to "calibrate mouse move to x move". wrap this in condition?

    let dx = Math.floor((mouse.x - this.x) / this.velocityX);
    //* scale down dx
    if (dx > this.velocityX) {
      dx /= this.velocityX;
      dx = Math.round(dx);
    }
    this.x += dx;

    this.y += gravityPull;
    // this.y += this.velocityY; //! major bug around here
    this.velocityY *= 0.9;

    //*prevent player from leaving canvas
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + this.width > canvas.width) {
      this.x = canvas.width - this.width;
    }

    if (this.y >= canvas.height - this.height) {
      this.y = canvas.height - this.height;
      this.velocityY = 0; //? learn this properly
      this.jumping = false;
    }
  }
  draw() {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // if (this.jumping === true) {
    //   bgCtx.drawImage(img, 0, this.parallax, 800, 600); //! COULD THIS BE IT?? Move background relative to player based on Y conditions
    // }
  }
  addScore() {
    score += 1;
    console.log("Player score", score);
  }
}

//* ***EVENT LISTENERS*** *//
canvas.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

//? fix this code
canvas.addEventListener("mousedown", (event) => {
  playerActivated = true;
  mouseClick = true;
  player.jumping = false;
  console.log(event + "detected");

  //? find a way to remove mousedown after click so that player must use bells to jump
  //? https://www.geeksforgeeks.org/javascript-removeeventlistener-method-with-examples/
});

// const stopGameLoop = () => {
//   window.cancelAnimationFrame(requestAnimationFrameId);
// };
const player = new Player();
generateSnow();
generateBell(player.y - 100);

//* Collision Detection Function
const hasCollided = (player, bell) => {
  const distance = Math.sqrt(
    Math.pow(player.x - bell.x, 2) + Math.pow(player.y - bell.y, 2)
  );
  if (distance <= collisionDistance) {
    player.collided = true;
    bell.collided = true;
    player.y -= playerJump;
    player.addScore();
    return true;
  }
};

//*Handle Dynamic Frames using timeStamp (research Delta Time)
let secondsPassed,
  oldTimeStamp,
  timeStamp,
  highestHeight = 0;

//* *** GAME LOOP *** *//
const gameLoop = (timeStamp) => {
  // requestAnimationFrameId = window.requestAnimationFrame(gameLoop);
  //* reset variables for next frame phase
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  playerHeight = Math.floor((canvas.height - player.y) / 100);

  if (playerHeight > highestHeight) {
    highestHeight = playerHeight;
    // console.log("playerHeight", playerHeight, "highestHeight", highestHeight);
    crossedHeight = true;
    if (highestHeight >= 2 && highestHeight % 2 === 0 && crossedHeight) {
      crossedHeight = false;
      console.log("CROSSED HEIGHT!");
    }
  }

  //* time calculation
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  secondsPassed = Math.min(secondsPassed, 0.1);
  oldTimeStamp = timeStamp;

  //* bell code
  bellRender(bellArray);

  //* player code
  player.update(secondsPassed);
  player.draw();
  // lowestBell = bellArray[0];
  // hasCollided(player, lowestBell); //! think about which bell it is later

  //* snow code
  snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
  snowCtx.fillStyle = "rgba(0,0,0,0.1)"; // rectangle that covers screen over and over
  snowRender(snow.snowArray);
  if (gameFrame % framesPerSnow === 0) {
    generateSnow(); //only generate snow every 200 frames
  }

  //* Incrementors + resets
  hue += 2; // change snow colour
  gameFrame++;

  requestAnimationFrame(gameLoop); // recursive game loop

  //! TEST AREA

  // console.log("player y pos and velocity", player.y, player.velocityY);
};

gameLoop(timeStamp);
