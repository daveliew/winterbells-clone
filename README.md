# project-1

## Winterbells - a Tribute to Adobe Flash

Welcome to my game project as part of SEI-30. You can view my pre-project work **[here](https://docs.google.com/document/d/1FPpK08GfnCg-nzXYBe4s_IeFqKawccZENnjvBIqs-nE/edit?usp=sharing)**.

### Winterbells is a classic from my childhood Adobe Flash games era. Credit to Ferry Halim & Orisinal Games.

> Simple mechanics, a soothing snow-filled backdrop, and a personal challenge to beat your previous high score. What's not to like?

**Credits:**
- Winterbells: Ferry Halim
- 2D Game Assets: @bevouliin (https://bevouliin.com)
- "Bell, Counter, A.wav" by InspectorJ (www.jshaw.co.uk) of Freesound.org
- The many Canvas tutorials out there, including:
  - Frank Poth - https://pothonprogramming.github.io/
  - Frank's Laboratory - https://www.youtube.com/channel/UCEqc149iR-ALYkGM6TG-7vQ
  - Hunor Márton Borbély - https://www.youtube.com/channel/UCxhgW0Q5XLvIoXHAfQXg9oQ

-----------------
**Things I've learnt:**
1. Better use of Arrays, Classes. Better understanding of HTML Canvas for animation.
2. Organisation of code into smaller parts, and piecing them together with functions. Still trying to learn how professionals handle code testing and production, especially in groups of coders. 
3. Starting to understand how to use Git, to create backups and branches to better manage the production and testing of code.
4. Code Samples:

`lass Particle {
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
`
