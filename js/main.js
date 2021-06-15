/** @type {HTMLCanvasElement} */
//! TO DO LIST
//* core game build
//? add delta time
//? add viewport + fix bg image
//? add condition that after first bell is caught, gameover sequence triggered
//* finesse
//? player gravity
//? bell generation in endless loop
//? add music
//? add sprites
//? create max width and height
//? create background image
//* optimisation
//? add pre-rendering for main character
//? ==> https://www.html5rocks.com/en/tutorials/canvas/performance/
//? ==> https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
//? multiple js files to better read code
//? refactor code --> clear all //? stuff.

//! DATA
const canvas = document.getElementById("game-layer");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = 32 * 15;
const GAME_HEIGHT = 32 * 20;
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const colWidth = Math.floor(canvas.width / numBellCols);
const SCREEN_X_MID = Math.floor(canvas.width / 2);

const gravityPull = 0.7;
const collisionDistance = 20;
const difficulty = 3;

const numBells = 10; //* change number of bells
const bellSpacing = 100;
const playerJump = bellSpacing * 1.3;
const minBellHeight = playerJump - bellSize;

let playerActivated = false;
let mouseClick = false;
let collision = false;
let gameFrame = 0;
let lowestBell = {}; //! is this useless?

let playerHeight = 0;
let crossedHeight = false;

// window.addEventListener("resize", () => {
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
// });

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
  let prevY = canvas.height - minBellHeight;
  while (bellArray.length < numBells) {
    let newX = randBellX();
    //! trying to slow down bell production
    let bell = new Bell(bellXpos[newX], prevY);
    prevY -= bellSpacing;
    bellArray.push(bell);
    console.log("***BELL CREATED***", bell);
  }
};

const bellRender = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    // if (crossedHeight) {
    //   arr[i].y = arr[i].y + 200;
    //   console.log("we're going places!");
    // }
    arr[i].update();
    arr[i].draw();
    hasCollided(player, arr[i]);
    if (
      arr[i].collided === true ||
      arr[i].y > canvas.height ||
      arr[i].y - player.y > canvas.height / 2 //! buggy! Want to make a way that bell disappears if it's too far away
    ) {
      //! key condition
      arr.splice(i, 1); // remove bell from array when it leaves screen
    }
  }
};

//* Generate Player
//? use a jumping method inside
class Player {
  constructor() {
    this.width = 20;
    this.height = 20;
    this.mass = 20;
    this.x = canvas.width / 2;
    this.y = canvas.height - this.height; //! testing
    this.velocityX = 5;
    this.velocityY = -10; //? what is a good boost rate?
    this.frame = 0;
    this.jumping = false; //? not using this well, try to obtimise
    this.secondsPassed = 0;
    this.collision = false;
    this.parallax = this.y;
    this.score = 0;
  }
  update(secondsPassed) {
    if (!playerActivated) {
      return;
    } // prevent left right movement till screen is clicked.

    if (mouseClick && this.jumping === false) {
      // this.y += 50 * secondsPassed;
      this.y -= 50; //! change to seconds
      // mouseClick = false;//! testing
      console.log("***player jump detected in player obj***");
      this.jumping = true;
      this.parallax = GAME_HEIGHT - this.y;
      this.y += this.velocityY * this.mass; //! balance out player falling. feels too floaty
    }

    //? trying this method to "calibrate mouse move to x move". wrap this in condition?

    let dx = Math.floor((mouse.x - this.x) / this.velocityX);

    //* scale down dx
    if (dx > this.velocityX) {
      dx /= this.velocityX;
      dx = Math.round(dx);
    }
    this.x += dx;
    this.y += 1 + gravityPull / 2;
    // this.velocityY = 0;
    // this.y += this.velocityY; //! major bug around here
    // this.velocityY *= 0.9;

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
    this.score += 1;
    console.log("Player score", this.score);
  }
}

//* Initialize game *//
//* Mouse Movements

const mouse = {
  //? centres mouse in canvas mid, not sure if necessary?
  x: canvas.width / 2,
  y: canvas.height / 2,
};

//* passes mouse click coordinates to global variable
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

generateSnow();
generateBell();
const player = new Player();

//* Collision Detection Function
const hasCollided = (player, bell) => {
  const distance = Math.sqrt(
    Math.pow(player.x - bell.x, 2) + Math.pow(player.y - bell.y, 2)
  );
  if (distance <= collisionDistance) {
    console.log("touched");
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
  timeStamp = 0;
let canvasMarker = canvas.height;

//* *** GAME LOOP *** *//
const gameLoop = (timeStamp) => {
  // requestAnimationFrameId = window.requestAnimationFrame(gameLoop);
  //* reset variables for next frame phase
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  playerHeight = Math.floor(canvasMarker - player.y);
  if (canvasMarker % 2 === 0) {
    crossedHeight = true;
    playerHeight = 0;
  }

  //* time calculation
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  secondsPassed = Math.min(secondsPassed, 0.1);
  oldTimeStamp = timeStamp;

  //* bell code

  bellRender(bellArray);
  //! think of when to generate bell
  // if (score >= 5) {
  //   generateBell();
  //   console.log("Hold it ... calling in the calvary!");
  // }

  //* player code
  player.update(secondsPassed);
  player.draw();
  // lowestBell = bellArray[0];
  // hasCollided(player, lowestBell); //! think about which bell it is later

  //* snow code
  snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
  snowCtx.fillStyle = "rgba(0,0,0,0.1)"; // rectangle that covers screen over and over
  snowRender(snow.snowArray);
  if (gameFrame % 200 === 0) {
    //only generate snow every 200 frames
    generateSnow();
  }

  //* Incrementors + resets
  hue += 2; // change snow colour
  gameFrame++;
  crossedHeight = false;
  canvasMarker = Math.floor(player.y / 100);
  console.log(Math.floor(player.y / 100));
  requestAnimationFrame(gameLoop); // recursive game loop

  //! TEST AREA

  // console.log("player y pos and velocity", player.y, player.velocityY);
};

gameLoop(timeStamp);
