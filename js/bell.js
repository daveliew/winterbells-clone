/** @type {HTMLCanvasElement} */
// const canvas = document.getElementById("game-layer");
// const ctx = canvas.getContext("2d");

const bellSize = 15;
const numBellCols = 7;
const bellArray = [];

//? Build looping bell sequence
//? Port over Bell class

//! Thought - shift the bells down on the redraw to give illusion that player has scaled upwards.

//! BELLS ONLY FALL UP TO A CERTAIN Y, then they are static => based on position.
//? BUG - Bells will generate if canvas Y not adjusted to centre on Player.

class Bell {
  constructor(posX, posY) {
    this.x = posX;
    this.y = posY;
    this.velocityX = 0;
    this.velocityY = 0;
    this.color = "yellow";
    this.size = bellSize;
    this.collided = false;
    // this.moving = true; //? optimise
  }
  update() {
    //! falling bell generates if player has not touched any bells.
    //! bells will stop when player collides
    if (score === 0) {
      this.velocityY = 0.5;
      this.x += this.velocityX;
      this.y += this.velocityY;

      this.velocityX *= 0.9;
      this.velocityY *= 0.9;
    }
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath(); //* like a paint path
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
