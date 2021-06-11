//? add pre-rendering for main character
//? use multiple frames

//* player character affected by jumping

//! DATA
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const gravityPull = 20;
let hue = 0;
let playerActivated = false;

const snow = {
  snowArray: [],
  snowSize: 5,
  snowAmt: 10,
};

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

  //* Mouse Movements

  const mouse = {
    x: undefined,
    y: undefined,
  };

  //* passes mouse click coordinates to global variable
  canvas.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  canvas.addEventListener("click", (event) => {
    playerActivated = true;
    player.speedY = -0.5;

    console.log("let's go!");
    canvas.addEventListener.off();
  });

  class Snow {
    constructor() {
      this.x = Math.random() * bg.width;
      this.y = Math.random() * gravityPull + 1;
      this.size = Math.random() * snow.snowSize + 1;
      this.speedX = Math.random() * 3 - 1.5; //* create -ve and +ve vector
      this.speedY = Math.random() * 2 + 0.5;
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

  //* Generate Player

  class Player {
    constructor() {
      this.width = 20;
      this.height = 20;
      this.x = 100;
      this.y = 100;
      this.speedX = 10;
      this.speedY = 5;
    }
    update() {
      if (!playerActivated) return;

      let dx = Math.round((mouse.x - this.x) / 8);
      console.log(dx);

      //* scale down dx
      if (dx > 8) {
        dx /= 8;
      }
      console.log("adjusted", dx);

      this.x += dx;

      //*prevent player from leaving canvas
      if (this.x < 0) {
        this.x = 0;
      } else if (this.x + this.width > canvas.width) {
        this.x = canvas.width - this.width;
      }
    }
    draw() {
      ctx.fillStyle = "blue";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  const player = new Player();
  console.log("🚀 ~ file: app.js ~ line 92 ~ player", player);

  //* Generate snow
  const init = () => {
    for (let i = 0; i < 100; i++) {
      snow.snowArray.push(new Snow());
    }
  };
  init();

  const handleSnow = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i].update();
      arr[i].draw();
    }
  };

  //* Animate / Game loop

  const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bgCtx.clearRect(0, 0, bg.width, bg.height);
    bgCtx.fillStyle = "rgba(0,0,0,0.1)"; // rectangle that covers screen over and over

    handleSnow(snow.snowArray);
    // renderPlayer(player);
    player.update();
    player.draw();
    hue += 2;

    requestAnimationFrame(gameLoop);
  };
  gameLoop();
});
