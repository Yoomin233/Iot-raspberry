const r = require("rpio");
const posArr = [21, 22, 23, 24, 26, 27, 28, 29];
const negArr = [31, 32, 33, 35, 36, 37, 38, 40];

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  for (let i = 0, l = posArr.length; i < l; i++) {
    posArr.forEach((pin, index) => {
      index === i
        ? r.open(pin, r.OUTPUT, r.HIGH)
        : r.open(pin, r.OUTPUT, r.LOW);
    });
    for (let j = 0, l = negArr.length; j < l; j++) {
      negArr.forEach((pin, index) => {
        index === j
          ? r.open(pin, r.OUTPUT, r.LOW)
          : r.open(pin, r.OUTPUT, r.HIGH);
      });
      await wait(100);
      console.log(`testing pos: ${i}, neg: ${j}`);
    }
  }
}

main();
// process.exit();