var rpio = require("rpio");
// console.log('executing!')
/*
 * Set the initial state to low.  The state is set prior to the pin
 * being actived, so is safe for devices which require a stable setup.
 */
rpio.open(36, rpio.OUTPUT, rpio.LOW);

/*
 * The sleep functions block, but rarely in these simple programs does
 * one care about that.  Use a setInterval()/setTimeout() loop instead
 * if it matters.
 */
// for (var i = 0; i < 5; i++) {
//   /* On for 1 second */
//   rpio.write(36, rpio.HIGH);
//   console.log("blink!");
//   rpio.sleep(1);

//   /* Off for half a second (500ms) */
//   rpio.write(36, rpio.LOW);
//   rpio.msleep(500);
// }

let blinkCount = 0;
setTimeout(function anony() {
  // console.log('blink!')
  rpio.write(36, rpio.HIGH);
  setTimeout(() => {
    rpio.write(36, rpio.LOW);
    blinkCount++;
    if (blinkCount < 5) {
      setTimeout(anony, 500);
    }
  }, 500);
  // rpio.msleep(500);
}, 0);
