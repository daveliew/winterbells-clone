/** @type {HTMLCanvasElement} */
//! TO DO LIST
//* core game build
//? fix game physics (play jump, bell render)
//? add delta time
//? collision detection
//? add score
//? add viewport
//* finesse
//? add music
//? add sprites
//? create max width and height
//? create background image
//* optimisation
//? add pre-rendering for main character
//? multiple js files to better read code
//? refactor code --> clear all //? stuff.

//! DATA
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const gravityPull = 0.7;
const bellSize = 10;
const bellSpacing = 70;
const numBells = 8; //! test
const numBellCols = 7;
const difficulty = 3;
const playerJump = bellSpacing * 2;

let hue = 0;
let playerActivated = false;
let mouseClick = false;
let collision = false;
let gameFrame = 0;

const snow = {
  snowArray: [],
  size: 3,
  amt: 15,
};

const bellArray = [];

//! FIX this
//*Handle Dynamic Frames using Delta Time
let secondsPassed,
  oldTimeStamp,
  timeStamp = 0;
let movingSpeed = 50;

//* MAIN PROGRAMME *//
document.addEventListener("DOMContentLoaded", function (event) {
  //* background layer
  const bg = document.getElementById("background-layer");
  const bgCtx = bg.getContext("2d");
  bg.width = window.innerWidth;
  bg.height = window.innerHeight;

  //* game layer
  const canvas = document.getElementById("game-layer");
  const ctx = canvas.getContext("2d");
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
  const colWidth = Math.floor(canvas.width / numBellCols);
  const SCREEN_X_MID = Math.floor(canvas.width / 2);

  const bellXpos = [
    SCREEN_X_MID - colWidth * 3,
    SCREEN_X_MID - colWidth * 2,
    SCREEN_X_MID - colWidth * 1,
    SCREEN_X_MID,
    SCREEN_X_MID + colWidth * 1,
    SCREEN_X_MID + colWidth * 2,
    SCREEN_X_MID + colWidth * 3,
  ];

  window.addEventListener("resize", () => {
    bg.width = SCREEN_WIDTH;
    bg.height = SCREEN_HEIGHT;
  });

  //* Generate snow
  class Snow {
    constructor() {
      this.x = Math.floor(Math.random() * bg.width);
      this.y = Math.floor(Math.random() - 10) + 5;
      this.size = Math.floor(Math.random() * snow.size) + 1;
      this.velocityX = Math.random() * 3 - 1.5;
      this.velocityY = Math.random() * gravityPull + 0.5;
      this.color = `hsl(${hue}, 100%, 50%)`;
    }
    update() {
      this.x += Math.random() * 1 - 0.5; //* 2D vector creation
      this.y += this.velocityY;
    }
    draw() {
      bgCtx.fillStyle = this.color;
      bgCtx.beginPath(); //* like a paint path
      bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      bgCtx.fill();
    }
  }

  const generateSnow = () => {
    for (let i = 0; i < snow.amt; i++) {
      snow.snowArray.push(new Snow());
    }
  };

  const snowRender = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i].update();
      arr[i].draw();
    }
  };

  //* Generate Bell
  //! BELLS ONLY FALL UP TO A CERTAIN Y, then they are static => based on position.
  //? BUG - Bells will generate if canvas Y not adjusted to centre on Player.

  class Bell {
    constructor(posX, posY) {
      this.x = posX;
      this.y = posY;
      this.velocityX = 0;
      this.velocityY = 0;
      this.color = "white";
      this.size = bellSize;
      this.collided = false;
    }
    update() {
      //! falling bell generates if player has not touched any bells.
      //! bells will stop when player collides
      // this.velocityY += Math.round(gravityPull) / 20;
      this.x += this.velocityX;
      this.y += this.velocityY;

      this.velocityX *= 0.9;
      // this.velocityY *= 0.9;
      this.hasCollided();
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath(); //* like a paint path
      ctx.arc(this.x, this.y, this.size, 0, Math.PI);
      ctx.fill();
    }
    hasCollided() {
      //? add collision detection and add y velocity to player
      const distance = Math.sqrt(
        Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2)
      );
      if (distance <= 20) {
        console.log("touched");
        this.collided = true;
        player.y -= playerJump;
      }
      return (collision = true);
    }
  }

  //* Generate Player
  class Player {
    constructor() {
      this.width = 20;
      this.height = 20;
      this.mass = 5;
      this.x = canvas.width / 2;
      this.y = canvas.height - this.height; //! testing
      this.velocityX = 5;
      this.velocityY = 0;
      this.frame = 0;
      this.jumping = false;
      this.secondsPassed = 0;
      this.collision = false;
    }
    update(secondsPassed) {
      if (!playerActivated) {
        return;
      } // prevent left right movement till screen is clicked.
      //! testing
      if (this.collision) {
        console.log("Hit a bell!");
      }
      if (mouseClick && this.jumping === false) {
        // this.y += 50 * secondsPassed;
        this.y -= 50; //! change to seconds
        // mouseClick = false;//! testing
        console.log("***player jump detected in player obj***");
        console.log("player y pos and velocity", player.y, player.velocityY);

        this.jumping = true;
        this.y += this.velocityY;
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
        // this.velocityY = 0;
        // this.jumping = false;
      }
    }
    draw() {
      ctx.fillStyle = "blue";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

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

  //* Generate bell
  //? refactor this to Simon's suggestion if there's time --> next bell takes a random pos from the array of possibilities
  // [ - - - X - - -] 5
  // [ - X - - - - -] 4
  // [ - - - X - - -] 3
  // [ - - - - - X -] 2
  // [ - - X - - - -] 1
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

  const generateBell = () => {
    let prevY = 0;
    while (bellArray.length < numBells) {
      let newX = randBellX();
      //! trying to slow down bell production
      let bell = new Bell(bellXpos[newX], prevY);
      prevY += bellSpacing;
      bellArray.push(bell);
      console.log("bell created", bell);
    }
  };

  const bellRender = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i].update();
      arr[i].draw();
      if (
        arr[i].collided === true ||
        arr[i].y > canvas.height ||
        arr[i].y - player.y > 100
      ) {
        //! key condition
        arr.splice(i, 1); // remove bell from array when it leaves screen
      }
    }
  };

  //* Animate / Game loop
  const player = new Player();
  console.log("🚀 ~ file: app.js ~ line 92 ~ player", player);
  generateSnow();

  const gameLoop = (timeStamp) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collision = false;
    //* time calculation
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    secondsPassed = Math.min(secondsPassed, 0.1);
    oldTimeStamp = timeStamp;

    //* bell code

    //* player code
    player.update(secondsPassed);

    player.draw();

    generateBell();
    bellRender(bellArray);

    //* snow code
    bgCtx.clearRect(0, 0, bg.width, bg.height);
    bgCtx.fillStyle = "rgba(0,0,0,0.1)"; // rectangle that covers screen over and over
    snowRender(snow.snowArray);
    if (gameFrame % 200 === 0) {
      generateSnow();
    }

    //* Incrementors + resets
    hue += 2;
    gameFrame++;
    collision = false;

    requestAnimationFrame(gameLoop); // recursive game loop

    //! TEST AREA
    // console.log("player y pos and velocity", player.y, player.velocityY);
  };

  gameLoop(timeStamp);
});

//! potentially useless code lol
// const controller = {
//   clicked: false,
//   mouseListener(event) {
//     const mouse_state = event.type === "mousedown" ? true : false;

//     switch(event){
// case "mousedown" :

//     }
//     mouseClick = mouse_state;
//     console.log("mouse click detected in MouseListener");
//   },
// };

// window.addEventListener("mousemove", controller.mouseListener);
// window.addEventListener("mousedown", controller.mouseListener);
