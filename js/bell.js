/** @type {HTMLCanvasElement} */

const bellSize = 10;
const numBellCols = 7;
const bellArray = [];

//! Thought - shift the bells down on the redraw to give illusion that player has scaled upwards.
//! BELLS ONLY FALL UP TO A CERTAIN Y, then they are static => based on position.

class Bell {
  constructor(posX, posY) {
    this.x = posX;
    this.y = posY;
    this.velocityX = 0;
    this.velocityY = 0;
    this.color = "yellow";
    this.size = bellSize;
    this.collided = false;
  }
  update() {
    //! falling bell generates if player has not touched any bells.
    //! bells will stop when player collides
    // if (score === 0) {
    this.velocityY = 0.5;
    this.x += this.velocityX;
    this.y += this.velocityY;

    this.velocityX *= 0.9;
    this.velocityY *= 0.9;
    // }
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
