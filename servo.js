var rpio = require("rpio");
// console.log('executing!')
/*
 * Set the initial state to low.  The state is set prior to the pin
 * being actived, so is safe for devices which require a stable setup.
 */
rpio.open(16, rpio.OUTPUT, rpio.HIGH);

rpio.open(18, rpio.OUTPUT, rpio.LOW)


let pwmTimer

function PWM(dutyCycle) {
  pwmTimer = setInterval(() => {
    rpio.write(18, rpio.HIGH)
    setTimeout(() => {
      rpio.write(18, rpio.HIGH)
    }, dutyCycle)
  }, 20)
}
PWM(2)