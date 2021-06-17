const particlesArray = [];
const trailLength = 20;
let hue = 0;

class Particle {
  constructor() {
    this.x = player.x + player.width / 2;
    this.y = player.y + player.height;
    this.size = Math.floor(Math.random() * 2) + 1;
    this.speedY = Math.random() * 1;
    this.color = `hsl(${hue}, 100%, 50%)`;
  }
  update() {
    this.y += this.speedY;
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }
}

const particlesHandler = () => {
  particlesArray.unshift(new Particle());
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
  }
  if (particlesArray.length > trailLength) {
    for (let i = 0; i < Math.floor(trailLength / 2); i++) {
      particlesArray.pop(particlesArray[i]);
    }
  }
};
