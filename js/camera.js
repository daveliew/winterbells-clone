//! create a function that can return an array of random numbers to use to set a bell with
//! has an inner function to generate random number

const prevX = 2;
const range = 5;

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

const start = 6;
const numBells = 10;
console.log(generateXArr(start, numBells, range));
