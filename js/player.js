const bellRing = new Audio("/assets/bell.wav");
const playerJump = bellSpacing * 1.5;
const playerJumpVelocity = -8;
let jumped = false;

/////////////////////////
//* Generate Player
/////////////////////////
//? use a jumping method inside
class Player {
  constructor() {
    this.width = 20;
    this.height = 20;
    this.x = canvas.width / 2;
    this.y = canvas.height - this.height;
    this.color = "rgba(250,38,38,0.8)";
    this.velocityX = 4;
    this.velocityY = -8;
    this.jumping = false;
    this.collided = false;
  }
  update(secondsPassed) {
    if (!playerActivated) return; // prevent left right movement till screen is clicked.

    this.mouseMovement();
    this.playerJump();
    this.hasCollided();
    this.checkBoundaries();

    this.y += gravityPull * 1.5;
    this.velocityY *= 0.9;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
  }
  addScore() {
    score += 100;
    if (score % 1000 === 0) {
      bellRing.play();
    }
  }
  mouseMovement() {
    let dx = Math.round(Math.floor(mouse.x - this.x));

    //* scale down dx
    if (dx > this.velocityX) {
      dx /= this.velocityX;
      dx = Math.round(dx);
    }

    this.x += dx;
  }
  hasCollided() {
    //* checks if player has touched a bell
    if (this.collided) {
      this.velocityY -= playerJump / 2;
      this.y += this.velocityY;
      this.collided = false;
    }
  }
  checkBoundaries() {
    //* prevents player from leaving canvas
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + this.width > canvas.width) {
      this.x = canvas.width - this.width;
    }

    if (this.y >= canvas.height - this.height) {
      this.y = canvas.height - this.height;
      this.velocityY = 0;
      this.jumping = false;
    } else if (this.y <= 0) {
      this.y = 100;
    }
  }
  playerJump() {
    if (mouseClick && this.jumping === false) {
      if (firstClick) {
        canvas.style.cursor = "none";
        firstClick = false;
        this.x = canvas.width / 2;
        this.y = canvas.height - this.height;
      } else {
        this.velocityY -= playerJump * 2.5;
        this.y += this.velocityY;
      }
      mouseClick = false;
      this.jumping = true;
    }
  }
}
