const canvas = document.getElementById("game-layer");
const ctx = canvas.getContext("2d");

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

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

//* Generate bell *//
//? refactor this to Simon's suggestion if there's time --> next bell takes a random pos from the array of possibilities

const bellArray = [];

const numBells = 20; //* change number of bells
const bellSize = 10;
const bellSpacing = canvas.height / 12; //vertical height

const numBellCols = 9;
const colWidth = Math.floor((canvas.width * 0.9) / numBellCols);
const SCREEN_X_MID = Math.floor(canvas.width / 2);

// [ - -  - - - X - - -] 5
// [ - X - - - - - - -] 4
// [ - - - X - - - - -] 3
// [ - - - - - X - - -] 2
// [ - - - - X - - - -] 1

const bellXpos = [
  SCREEN_X_MID - colWidth * 4,
  SCREEN_X_MID - colWidth * 3,
  SCREEN_X_MID - colWidth * 2,
  SCREEN_X_MID - colWidth * 1,
  SCREEN_X_MID,
  SCREEN_X_MID + colWidth * 1,
  SCREEN_X_MID + colWidth * 2,
  SCREEN_X_MID + colWidth * 3,
  SCREEN_X_MID + colWidth * 4,
];

const playerJump = bellSpacing * 1.5;
const playerJumpVelocity = -8;

//! Thought - shift the bells down on the redraw to give illusion that player has scaled upwards.
//! BELLS ONLY FALL UP TO A CERTAIN Y, then they are static => based on position.

let prevX = 0;
let currX = Math.floor(bellXpos.length / 2); //4, start at centre

const randBellX = () => {
  prevX = currX;
  while (
    currX === prevX || //prevents a random bell from having same X as a previous bell
    currX - prevX <= -difficulty || //prevents a bell from being too far from a current bell
    currX - prevX >= difficulty
  ) {
    currX = Math.floor(Math.random() * bellXpos.length);
  }

  return currX;
};

const generateBell = (posY) => {
  let prevY = posY;
  while (bellArray.length < numBells) {
    let newX = randBellX();
    let bell = new Bell(bellXpos[newX], prevY);
    prevY -= bellSpacing;
    lowestBell = bell;
    bellArray.push(bell);
  }
  console.log("***BELLS CREATED***", bellArray);
};

const bellRender = (arr) => {
  const bellTranslation = bellSpacing;

  for (let i = 0; i < arr.length; i++) {
    if (crossedHeight || arr[1].y < canvas.height / 4) {
      //! tune this (BELL)
      // if (crossedHeight) {
      arr[i].y = arr[i].y + bellTranslation;
      console.log("we're going places!");
    }
    arr[i].update();
    arr[i].draw();
    hasCollided(player, arr[i]);
    if (arr[i].collided === true || arr[i].y > canvas.height - 100) {
      arr.splice(i, 1); // remove bell from array to manage total #objects
    }
  }

  const minBells = Math.floor(numBells / 2);

  if (arr.length <= minBells) {
    generateBell(arr[0].y - bellSpacing * minBells);
  }

  crossedHeight = false; // reset trigger for bell translation
};
