const particlesArray = [];
const trailLength = 30;
let hue = 0;

class Particle {
  constructor() {
    this.x = player.x;
    this.y = player.y + player.height / 2;
    this.size = Math.floor(Math.random() * 4) + 1;
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
    if (player.jumping) {
      particlesArray[i].y += 5;
    }
    particlesArray[i].update();
    particlesArray[i].draw();
  }
  if (particlesArray.length > trailLength) {
    for (let i = 0; i < Math.floor(trailLength / 2); i++) {
      particlesArray.pop(particlesArray[i]);
    }
  }
};

//! floating Messages not executing properly
// const floatingMessages = [];
// class Message {
//   constructor(value, x, y, size, color) {
//     this.value = value;
//     this.x = x;
//     this.y = y;
//     this.size = size;
//     this.lifeSpan = 0;
//     this.color = color;
//     this.opacity = 1;
//   }
//   update() {
//     this.y = -0.3;
//     this.lifeSpan += 1;
//     if (this.opacity > 0.05) {
//       this.opacity -= 0.05;
//     }
//   }
//   draw() {
//     ctx.globalAlpha = this.opacity;
//     ctx.fillStyle = this.color;
//     ctx.font = this.size + "px Josefin Sans";
//     ctx.fillText(this.value, this.x, this.y);
//     ctx.globalAlpha = 1;
//   }
// }

// const floatingMessagesHandler = () => {
//   for (let i = 0; i < floatingMessages.length; i++) {
//     floatingMessages[i].update();
//     floatingMessages[i].draw();
//     if (floatingMessages[i].lifeSpan >= 50) {
//       floatingMessages.splice(i, 1);
//       i--;
//     }
//   }
// };
