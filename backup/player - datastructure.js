const bellRing = new Audio("/assets/bell.wav");
const playerJump = bellSpacing * 1.5;
const playerJumpVelocity = -8;
let jumped = false;

let chosenSprite;
const playerRunSprite = new Image();
playerRunSprite.src = "/assets/Cubeman_jump.png";

const playerJumpSprite = new Image();
playerJumpSprite.src = "/assets/Cubeman_jump.png";

const spriteWidth = 1000;
const spriteHeight = 1000;
let frameX = 0;
const staggerFrames = 5;
const spriteAnimations = [];
const spriteInfo = [
  {
    name: "run",
    img: playerRunSprite,
    frames: 10,
    frameX: 493,
    frameY: 450,
  },
  {
    name: "jump",
    img: playerJumpSprite,
    frames: 11,
    frameX: 410,
    frameY: 450,
  },
];
spriteInfo.forEach((sprite) => {
  let frames = {
    loc: [],
  };
  for (let i = 0; i < sprite.frames; i++) {
    let posX = i * sprite.frameX;
    let posY = sprite.frameY;
    frames.loc.push({ x: posX, y: posY });
  }
  spriteAnimations[sprite.name] = frames;
});
console.log(spriteAnimations[spriteInfo[0].name].loc); //array of location objects
console.log(playerRunSprite.src); //image src
console.log(spriteInfo[0]); // individual sprite obj

/////////////////////////
//* Generate Player
/////////////////////////
class Player {
  constructor() {
    this.width = 50;
    this.height = 50;
    this.x = canvas.width / 2;
    this.y = canvas.height - this.height;
    this.color = "rgba(250,38,38,0.8)";
    this.velocityX = 4;
    this.velocityY = -8;
    this.jumping = false;
    this.collided = false;
    this.bellsCollected = 0;
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
    let currFrame = 0;
    if (this.velocityY === 0) {
      chosenSprite = spriteInfo[0];
    }
    //ctx.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh)
    let position =
      Math.floor(gameFrame / staggerFrames) %
      spriteAnimations[spriteInfo[0].name].loc.length;
    console.log("position", position);
    // ctx.drawImage(
    //   playerRunSprite,
    //   spriteInfo[0].frameX,
    //   spriteInfo[0].frameY,
    //   chosenSprite.frameX,
    //   chosenSprite.frameY,
    //   this.x,
    //   this.y,
    //   this.width,
    //   this.height
    // );
    // ctx.drawImage(
    //   playerRunSprite,
    //   spriteWidth,
    //   spriteHeight,
    //   spriteWidth,
    //   spriteHeight,
    //   this.x,
    //   this.y,
    //   this.width,
    //   this.height
    // );
    ctx.drawImage(
      playerRunSprite,
      currFrame * spriteWidth,
      0,
      spriteWidth,
      spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
    if (gameFrame % staggerFrames === 0) {
      if (currFrame < 10) {
        currFrame++;
      } else {
        currFrame = 0;
      }
    }

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
