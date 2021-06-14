//* Generate Player
//? use a jumping method inside
class Player {
  constructor() {
    this.width = 20;
    this.height = 20;
    this.mass = 20;
    this.x = canvas.width / 2;
    this.y = canvas.height - this.height; //! testing
    this.velocityX = 5;
    this.velocityY = -10; //? what is a good boost rate?
    this.frame = 0;
    this.jumping = false; //? not using this well, try to obtimise
    this.secondsPassed = 0;
    this.collision = false;
  }
  update(secondsPassed) {
    if (!playerActivated) {
      return;
    } // prevent left right movement till screen is clicked.
    if (mouseClick && this.jumping === false) {
      // this.y += 50 * secondsPassed;
      this.y -= 50; //! change to seconds
      // mouseClick = false;//! testing
      console.log("***player jump detected in player obj***");
      console.log("player y pos and velocity", player.y, player.velocityY);

      this.jumping = true;
      this.y += this.velocityY * this.mass; //! balance out player falling. feels too floaty
    }

    //? trying this method to "calibrate mouse move to x move". wrap this in condition?

    let dx = Math.floor((mouse.x - this.x) / this.velocityX);

    //* scale down dx
    if (dx > this.velocityX) {
      dx /= this.velocityX;
      dx = Math.round(dx);
    }

    this.x += dx;
    this.y += 1 + gravityPull / 2;

    // this.velocityY = 0;
    // this.y += this.velocityY; //! major bug around here

    // this.velocityY *= 0.9;

    //*prevent player from leaving canvas
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + this.width > canvas.width) {
      this.x = canvas.width - this.width;
    }

    if (this.y >= canvas.height - this.height) {
      this.y = canvas.height - this.height;
      this.velocityY = 0; //? learn this properly
      this.jumping = false;
    }
  }
  draw() {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
