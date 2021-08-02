const canvas = document.getElementById("game-layer");
const ctx = canvas.getContext("2d");
const bellImg = new Image();
bellImg.src = "/assets/bell.png";

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

let bellID = 0;

class Bell {
  constructor(posX, posY) {
    this.x = posX;
    this.y = posY;
    this.velocityX = 0;
    this.velocityY = 0;
    this.color = "yellow";
    this.size = bellSize;
    this.collided = false;
    this.id = 0;
  }
  update() {
    // if (score === 0) {
    this.velocityY = 0.5;
    this.x += this.velocityX;
    this.y += this.velocityY;

    this.velocityX *= 0.9;
    this.velocityY *= 0.9;
    // }
  }
  draw(secondsPassed) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.drawImage(
      bellImg,
      this.x,
      this.y,
      bellImg.width / 15,
      bellImg.height / 15
    );
    // ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

//* Bell Production Settings*//
const bellArray = [];
const difficulty = 5;
const bellSize = 20;
const bellSpacing = canvas.height / 10; //vertical height

//* Chop up Canvas into <numBellCols> Columns*//
const numBellCols = 9;
const colWidth = Math.floor((canvas.width * 0.9) / numBellCols);
const SCREEN_X_MID = Math.floor(canvas.width / 2);

//* refactored this to Simon's suggestion if there's time --> next bell takes a random pos from the array of possibilities
// [ 0 1 2 3 4 5 6 7 8]
// [ - - - - - X - - -] 5
// [ - X - - - - - - -] 4
// [ - - - X - - - - -] 3
// [ - - - - - X - - -] 2
// [ - - - - X - - - -] 1
const bellXPos = [
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

let currCol = Math.floor(bellXPos.length / 2); //4, start at centre

const randNum = (num, range) => {
  let r = 0;
  r = Math.round(Math.random() * (range - 1)) - Math.floor((range - 1) / 2);
  return num + r;
};

const generateXArr = (start, arrLength, range) => {
  let result = [];
  result.push(start);
  let curr = start;
  let next = curr;

  for (i = 0; i < arrLength - 1; i++) {
    curr = next;
    while (curr === next) {
      next = randNum(start, range);
    }
    result.push(next);
  }
  return result;
};

const generateBell = (arr, posY, numBells) => {
  let prevY = posY;
  for (let i = 0; i < numBells; i++) {
    let bell = new Bell(bellXPos[arr[i]], prevY);
    prevY -= bellSpacing;
    bellID += 1; //label each bell
    bell.id = bellID;
    bellArray.push(bell);
  }
  console.log("***BELLS CREATED***", bellArray);
};

const bellRender = (arr) => {
  const bellTranslation = bellSpacing;
  for (let i = 0; i < arr.length; i++) {
    if (crossedHeight || arr[1].y < canvas.height / 3) {
      arr[i].y = arr[i].y + bellTranslation;
      console.log("we're going places!");
    }
    arr[i].update();
    arr[i].draw(secondsPassed);
    hasCollided(player, arr[i]);
    if (arr[i].collided) {
      player.bellsCollected += 1;
    }
    if (arr[i].collided || arr[i].y > canvas.height - 100) {
      // remove bell from array to manage total #objects
      arr.splice(i, 1);
    }
  }

  const minBells = Math.floor(startNumBells / 1.5);

  if (arr.length <= minBells) {
    const makeNewBells = generateXArr(currCol, minBells, difficulty);
    const getBellX = bellArray[0].x; // extract x position of bell in minBells-th position

    currCol = bellXPos.indexOf(getBellX); // store that index number for next array creation

    generateBell(makeNewBells, arr[arr.length - 1].y - bellSpacing, minBells);
  }

  crossedHeight = false; // reset trigger for bell translation
  return currCol;
};
