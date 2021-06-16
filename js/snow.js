const bgCanvas = document.getElementById("background-layer");
const bgCtx = bgCanvas.getContext("2d");
bgCanvas.width = window.innerWidth;
bgCanvas.height = window.innerHeight;
//! background image
//const img = new Image();
// img.src = "../assets/maria-vojtovicova-snow.jpg";

//* snow layer
const snowCanvas = document.getElementById("snow-layer");
const snowCtx = snowCanvas.getContext("2d");
snowCanvas.width = bgCanvas.width;
snowCanvas.height = bgCanvas.height;

const snow = {
  snowArray: [],
  size: 3,
  amt: 15,
};

class Snow {
  constructor() {
    this.x = Math.floor(Math.random() * snowCanvas.width);
    this.y = Math.floor(Math.random() - 10) + 5;
    this.size = Math.floor(Math.random() * snow.size) + 1;
    this.velocityX = Math.random() * 3 - 1.5;
    this.velocityY = Math.random() * gravityPull + 0.5;
    this.color = "rgba(220, 220, 220, 0.7)";
  }
  update() {
    this.x += Math.random() * 1 - 0.5; //* 2D vector creation
    this.y += this.velocityY;
  }
  draw() {
    snowCtx.fillStyle = this.color;
    snowCtx.beginPath(); //* like a paint path
    snowCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    snowCtx.fill();
    // bgCtx.drawImage(img, 0, this.y, 800, 600); //! Endless scroller?
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
