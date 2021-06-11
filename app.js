//? add pre-rendering for main character
//? use multiple frames

//* player character affected by jumping

//! DATA
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const gravityPull = -0.7;
const numBells = 5;
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
      this.speedX = Math.random() * 3 - 1.5; //* create -ve and +ve vector
      this.speedY = Math.random() * gravityPull + 1;
      this.color = `hsl(${hue}, 100%, 50%)`;
    }
    update() {
      this.x += Math.random() * 1 - 0.5; //* 2D vector creation
      this.y += this.speedY;
    }
    draw() {
      bgCtx.fillStyle = this.color;
      bgCtx.beginPath(); //* like a paint path
      bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      bgCtx.fill();
    }
  }

  let preventSameBellX = 0; //? check on this

  class Bell {
    constructor() {
      // const r = Math.floor(Math.random() * numBells); //?fix code
      this.x = Math.random() * canvas.width;
      this.y = 0;
      this.color = "white";
    }
    update() {
      this.x += Math.random() * 1 - 0.5;
      this.y -= gravityPull; //? code looks suspect, revisit!
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath(); //* like a paint path
      ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    hasCollided() {}
  }
  //* Generate Player

  class Player {
    constructor() {
      this.width = 20;
      this.height = 20;
      this.x = canvas.width / 2;
      this.y = canvas.height - this.height;
      this.speedX = 10;
      this.speedY = 5;
      this.frame = 0;
    }
    update() {
      if (!playerActivated) return; //* prevent left right movement till screen is clicked.

      //? trying this method to "calibrate mouse move to x move"
      let dx = Math.floor((mouse.x - this.x) / 8);

      //* scale down dx
      if (dx > 8) {
        dx /= 8;
      }

      this.x += dx;
      player.y -= gravityPull;

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
    //? find a way to remove mousedown after click
  });

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

  //? fix the bell code to have one bell come down every X frames in random X pos
  //* Generate bell
  const generateBell = () => {
    for (let i = 0; i < numBells; i++) {
      bellArray.push(new Bell());
    }
  };

  const bellRender = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i].update();
      arr[i].draw();
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
    player.speedY += 1.5;

    //* bell code
    bellRender(bellArray);
    if (gameFrame % 300 === 0) {
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
