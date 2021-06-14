/** @type {HTMLCanvasElement} */
//! TO DO LIST
//* core game build
//? add delta time
//? add score
//? add viewport
//* finesse
//? player gravity
//? bell generation in endless loop
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
const collisionDistance = 20;

const difficulty = 3;
const bellSpacing = 70;
const playerJump = bellSpacing * 2;

let playerActivated = false;
let mouseClick = false;
let collision = false;
let gameFrame = 0;

//! FIX this
//*Handle Dynamic Frames using Delta Time
let secondsPassed,
  oldTimeStamp,
  timeStamp = 0;
let movingSpeed = 50;

//* MAIN PROGRAMME *//
document.addEventListener("DOMContentLoaded", function (event) {
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
      if (this.y > canvas.height - 400)
        //? what's optimal?
        this.velocityY += Math.round(gravityPull) / 20;
      this.x += this.velocityX;
      this.y += this.velocityY;

      this.velocityX *= 0.9;
      this.velocityY *= 0.9;
      this.hasCollided(); // check for collision with Player
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
      if (distance <= collisionDistance) {
        console.log("touched");
        this.collided = true;
        player.y -= playerJump;
      }
      return (collision = true);
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
    let prevY = -100; //! does this work?
    while (bellArray.length < numBells) {
      let newX = randBellX();
      //! trying to slow down bell production
      let bell = new Bell(bellXpos[newX], prevY);
      prevY += bellSpacing;
      bellArray.push(bell);
      console.log("***BELL CREATED***", bell);
    }
  };

  const bellRender = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i].update();
      arr[i].draw();
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
