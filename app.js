/** @type {HTMLCanvasElement} */
//! TO DO LIST
//* core game build
//? collision detection
//? fix game physics (play jump, bell render)
//? add score
//? add delta time
//? add viewport
//* finesse
//? add music
//? add sprites
//? create max width and height
//? create background image
//* optimisation
//? add pre-rendering for main character
//? multiple js files to better read code
//? refactor code

//! DATA
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const gravityPull = -0.7;
const bellSize = 10;
const numBells = 7; //? try to optimise this later
const numBellCols = 7;
const difficulty = 3;
const playerXAcceleration = 8;
const colWidth = Math.floor(SCREEN_WIDTH / numBellCols);
const SCREEN_X_MID = Math.floor(SCREEN_WIDTH / 2);
const bellXpos = [
  SCREEN_X_MID - colWidth * 3,
  SCREEN_X_MID - colWidth * 2,
  SCREEN_X_MID - colWidth * 1,
  SCREEN_X_MID,
  SCREEN_X_MID + colWidth * 1,
  SCREEN_X_MID + colWidth * 2,
  SCREEN_X_MID + colWidth * 3,
];
let hue = 0;
let playerActivated = false;
let gameFrame = 0;

const snow = {
  snowArray: [],
  size: 3,
  amt: 15,
};

const bellArray = [];

//! MAIN
document.addEventListener("DOMContentLoaded", function (event) {
  const bg = document.getElementById("background-layer");
  const bgCtx = bg.getContext("2d"); //* add context via bgCtx
  const canvas = document.getElementById("game-layer");
  const ctx = canvas.getContext("2d");
  bg.width = SCREEN_WIDTH;
  bg.height = SCREEN_HEIGHT;

  window.addEventListener("resize", () => {
    bg.width = SCREEN_WIDTH;
    bg.height = SCREEN_HEIGHT;
  });

  class Snow {
    constructor() {
      this.x = Math.floor(Math.random() * bg.width);
      this.y = Math.floor(Math.random()) + 1;
      this.size = Math.floor(Math.random() * snow.size) + 1;
      this.velocityX = Math.random() * 3 - 1.5; //* create -ve and +ve vector
      this.velocityY = Math.random() * gravityPull + 1;
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

  //* Generate snow
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
  //! FIND A WAY TO MAKE STATIC BELLS FIRST.
  //! BELLS ONLY FALL UP TO A CERTAIN Y, then they are static.

  let prevR = 0;
  let currR = Math.floor(bellXpos.length / 2); //3, start at centre

  const randBellX = () => {
    prevR = currR;
    while (
      currR === prevR || //prevents a random bell from having same X as a previous bell
      currR - prevR <= -difficulty || //prevents a bell from being too far from a current bell
      currR - prevR >= difficulty
    ) {
      currR = Math.floor(Math.random() * bellXpos.length);
    }
    return currR;
  };

  class Bell {
    constructor() {
      this.x = bellXpos[randBellX()];
      this.y = 0 + bellSize;
      this.velocityX = 0;
      this.velocityY = 0;
      this.color = "white";
      this.size = bellSize;
    }
    update() {
      this.x += Math.random() - 0.5;
      this.y -= gravityPull / 2; //? code looks suspect, revisit
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath(); //* like a paint path
      ctx.arc(this.x, this.y, this.size, 0, Math.PI);
      ctx.fill();
    }
    hasCollided() {} //? add collision detection and add y velocity to player
  }

  //* Generate Player
  //? can we add friction to player?
  class Player {
    constructor() {
      this.width = 20;
      this.height = 20;
      this.x = canvas.width / 2;
      this.y = canvas.height - this.height;
      this.velocityX = 10;
      this.velocityY = 5;
      this.frame = 0;
      this.jumping = false;
    }
    update() {
      if (!playerActivated) {
        return;
      } //* prevent left right movement till screen is clicked.

      //? trying this method to "calibrate mouse move to x move"
      let dx = Math.floor((mouse.x - this.x) / playerXAcceleration);

      //* scale down dx
      if (dx > playerXAcceleration) {
        dx /= playerXAcceleration;
      }

      this.x += dx;
      this.y -= gravityPull;

      //*prevent player from leaving canvas
      if (this.x < 0) {
        this.x = 0;
      } else if (this.x + this.width > canvas.width) {
        this.x = canvas.width - this.width;
      }
      if (this.y > canvas.height - this.height) {
        this.y = canvas.height - this.height;
      }
    }
    draw() {
      ctx.fillStyle = "blue";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  //* Mouse Movements

  const mouse = {
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
    player.y -= 50;

    console.log("mouse click detected");
    //? find a way to remove mousedown after click so that player must use bells to jump
    //? https://www.geeksforgeeks.org/javascript-removeeventlistener-method-with-examples/
  });

  //* Generate bell
  const generateBell = () => {
    let bell = new Bell();
    bellArray.push(bell);
  };

  const bellRender = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i].update();
      arr[i].draw();
      if (arr[i].y > canvas.height) {
        arr.splice(i, 1);
      }
    }
  };

  //* Animate / Game loop
  const player = new Player();
  console.log("🚀 ~ file: app.js ~ line 92 ~ player", player);
  generateSnow();

  const gameLoop = () => {
    //* player code
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    player.draw();

    //* bell code
    console.log(bellArray);
    bellRender(bellArray);
    if (gameFrame % 30 === 0) {
      generateBell();
    }

    //* snow code
    bgCtx.clearRect(0, 0, bg.width, bg.height);
    bgCtx.fillStyle = "rgba(0,0,0,0.1)"; // rectangle that covers screen over and over
    snowRender(snow.snowArray);
    if (gameFrame % 200 === 0) {
      generateSnow();
    }
    //* Incrementors
    hue += 2;
    gameFrame++;

    requestAnimationFrame(gameLoop); // recursive game loop
  };
  gameLoop();
});
