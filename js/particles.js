const particlesArray = [];

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
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
  }
}

const particlesHandler = () => {
  particlesArray.unshift(new Particle());
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
  }
  if (particlesArray.length > 50) {
    for (let i = 0; i < 20; i++) {
      particlesArray.pop(particlesArray[i]);
    }
  }
};
