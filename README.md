# project-1

## Winterbells - a Tribute to Adobe Flash

Welcome to my game project as part of SEI-30. You can view my pre-project work **[here](https://docs.google.com/document/d/1FPpK08GfnCg-nzXYBe4s_IeFqKawccZENnjvBIqs-nE/edit?usp=sharing)**.

### Winterbells is a classic from my childhood Adobe Flash games era. Credit to Ferry Halim & Orisinal Games.

> Simple mechanics, a soothing snow-filled backdrop, and a personal challenge to beat your previous high score. What's not to like?

### Credits: 
- Winterbells: Ferry Halim
- 2D Game Assets: @bevouliin (https://bevouliin.com)
- "Bell, Counter, A.wav" by InspectorJ (www.jshaw.co.uk) of Freesound.org
- The many Canvas tutorials out there, including:
  - Frank Poth - https://pothonprogramming.github.io/
  - Frank's Laboratory - https://www.youtube.com/channel/UCEqc149iR-ALYkGM6TG-7vQ
  - Hunor Márton Borbély - https://www.youtube.com/channel/UCxhgW0Q5XLvIoXHAfQXg9oQ

-----------------
*** Things I've learnt: ***
1. Better use of Arrays, Classes. Better understanding of HTML Canvas for animation.
2. Organisation of code into smaller parts, and piecing them together with functions. Still trying to learn how professionals handle code testing and production, especially in groups of coders. 
3. Starting to understand how to use Git, to create backups and branches to better manage the production and testing of code.

-----------------
### Code Samples:

**Function to loop through array with management of state and rendering**
```JavaScript
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
```

**Code for generating objects randomly across defined points of my canvas via nested functions, loops and arrays**

*Example Output*
```
 [ 0 1 2 3 4 5 6 7 8]
 [ - - - - - X - - -] 5
 [ - X - - - - - - -] 4
 [ - - - X - - - - -] 3
 [ - - - - - X - - -] 2
 [ - - - - X - - - -] 1
```

```JavaScript
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
``
