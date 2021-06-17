// Balloons is a feature that players must avoid
const balloonsArray = [];
let balloonHue = 0;
let balloonProduction = 100;

class Balloon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocityX = 1;
    this.velocityY = Math.round(Math.random() * 2) - 1;
    this.color = `hsl(${balloonHue}, 100%, 50%)`;
    this.size = Math.floor(Math.random() * 5 + 5);
    this.collided = false;
  }
  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const balloonHandler = () => {
  for (let i = 0; i < balloonsArray.length; i++) {
    balloonsArray[i].color = `hsl(${balloonHue}, 100%, 50%)`;
    balloonsArray[i].update();
    balloonsArray[i].draw();
    if (hasCollided(player, balloonsArray[i])) {
      score -= 1000;
      bursts += 1;
      burstSound.play();
      balloonsArray.splice(i, 1);
      console.log(balloonsArray);
    }
    balloonHue++;
  }
  if (gameFrame % balloonProduction == 0) {
    let x = Math.floor(Math.random() * canvas.width);
    let y = Math.floor(Math.random() * canvas.height - canvas.height / 2);
    let balloon = new Balloon(x, y);
    balloonsArray.push(balloon);
  }
};
