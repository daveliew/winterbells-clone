//* background layer
const bg = document.getElementById("background-layer");
const bgCtx = bg.getContext("2d");
bg.width = window.innerWidth;
bg.height = window.innerHeight;

let hue = 0;

const snow = {
  snowArray: [],
  size: 3,
  amt: 15,
};

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
