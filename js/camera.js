//! testing camera for player

// const yourWorld = {
//   minX: player.x,
//   maxX: player.x,
//   minY: player.y,
//   maxY: player.y,
// };

// const clamp = (value, min, max) => {
//   if (value < min) return min;
//   else if (value > max) return max;
//   return value;
// };

// const cameraDraw = () => {
//   ctx.setTransform(1, 0, 0, 1, 0, 0); //reset the transform matrix as it is cumulative
//   ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the viewport AFTER the matrix is reset

//   //Clamp the camera position to the world bounds while centering the camera around the player
//   var camX = clamp(
//     -player.x + canvas.width / 2,
//     yourWorld.minX,
//     yourWorld.maxX - canvas.width
//   );
//   var camY = clamp(
//     -player.y + canvas.height / 2,
//     yourWorld.minY,
//     yourWorld.maxY - canvas.height
//   );

//   ctx.translate(camX, camY);
// };
