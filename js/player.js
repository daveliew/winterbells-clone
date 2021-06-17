//! add player image sprite
//! to investigate view port + culling

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
    //! do we need secondsPassed or mass?
    if (!playerActivated) {
      return;
    } // prevent left right movement till screen is clicked.
    this.calibrateMouse();
    this.playerJump();
    this.hasCollided();
    this.checkBoundaries();

    this.y += gravityPull * 2;
    this.velocityY *= 0.9;
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.restore();
  }
  addScore() {
    score += 100;
  }
  calibrateMouse() {
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
      // jumped = true; //! camera pan?
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
    }
  }
  playerJump() {
    if (mouseClick && this.jumping === false) {
      if (firstClick) {
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
