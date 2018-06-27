// import { clearInterval } from "timers";

const rpio = require("rpio");
const fetch = require("node-fetch");

const posArr = [21, 22, 23, 24, 26, 27, 28, 29];
const negArr = [31, 32, 33, 35, 36, 37, 38, 40];

// rpio.init({
//   gpiomem: true /* Use /dev/gpiomem */,
//   mapping: "physical" /* Use the P1-P40 numbering scheme */,
//   mock: true /* Emulate specific hardware in mock mode */
// });

//
posArr.concat(negArr).forEach(pin => rpio.open(pin, rpio.OUTPUT, rpio.LOW));

const displayMap = {
  0: [31, 32, 35, 37, 38, 40],
  1: [37, 35],
  2: [40, 37, 36, 32, 31],
  3: [40, 37, 35, 32, 36],
  4: [38, 36, 37, 35],
  5: [40, 38, 36, 35, 32],
  6: [31, 32, 35, 36, 38, 40],
  7: [40, 37, 35],
  8: [31, 32, 35, 36, 37, 38, 40],
  9: [32, 35, 36, 37, 38, 40],
  ".": [33],
  A: [31, 35, 36, 37, 38, 40],
  E: [31, 32, 36, 38, 40],
  O: [31, 32, 35, 37, 38, 40],
  S: [32, 35, 36, 38, 40],
  "-": [36],
  error: [31, 36]
};

// let lastTime = 0;

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function displayNumber(str = "AAA-", num = 0) {
  // let timer;
  if (num > 10000 || num < 0) {
    return;
  }
  // 先加上最多小数位数
  let strNum = num.toFixed(3).slice(0, 5);
  strNum = str + strNum;
  // 记录小数点位置后去掉小数点
  const dpIndex = strNum.indexOf(".");
  strNum = strNum.replace(".", "");
  // let totalLen = 8;
  // 从共阳极最右边位置开始扫描
  let currentPos = 0;
  // posArr.forEach(pin => rpio.write(pin, rpio.HIGH))
  let timer = setInterval(async () => {
    const lastPos = currentPos === 0 ? 7 : currentPos - 1;
    if (currentPos === 8) {
      currentPos = 0;
    }
    const currentChar = strNum[currentPos];
    // 设置相应正极高电位, 其他正极低电位
    // posArr.forEach((pin, index) => {
    //   index === currentPos
    //     ? rpio.write(pin, rpio.HIGH)
    //     : rpio.write(pin, rpio.LOW);
    // });
    rpio.write(posArr[lastPos], rpio.LOW);
    // await wait(1);
    rpio.write(posArr[currentPos], rpio.HIGH);
    // 抹掉之前的低电位设置
    const lowArr = displayMap[currentChar].concat(
      currentPos === dpIndex - 1 ? displayMap["."] : []
    );
    // negArr.forEach(pin => rpio.write(pin, rpio.HIGH))
    // lowArr.forEach(pin => rpio.write(pin, rpio.LOW))
    // await wait(1);
    negArr.forEach(pin =>
      rpio.write(pin, lowArr.includes(pin) ? rpio.LOW : rpio.HIGH)
    );
    currentPos++;
    // process.nextTick(anony);
    // const now = process.uptime();
    // console.log(`single scan time use: ${(now - lastTime) * 1000}ms`);
    // lastTime = now;
  }, 0);
  return timer;
}

// displayNumber(32.3);
// const latestPrice = 0;
let timer;
function main(coinName) {
  return fetch(`https://data.gateio.io/api2/1/ticker/${coinName}_usdt`)
    .then(res => res.json())
    .then(json => {
      const { last } = json;
      if (last) {
        clearInterval(timer);
        // posArr.forEach(pin => rpio.write(pin, rpio.LOW));
        timer = displayNumber(`${coinName.toUpperCase()}-`, Number(last));
      } else {
        throw new Error("json invalid!");
      }
    });
}

let mainTimer = setInterval(async function lambda() {
  try {
    await main("eos");
  } catch (e) {
    clearTimeout(mainTimer);
    console.log(
      "error encountered fetching latest price, retrying in 10 secs..."
    );
    mainTimer = setInterval(lambda, 10000);
  }
}, 5000);

// 翻译表
//  -a
// |f|b
//  -g
// |e|c
//  -d.dp
// a => 11 => pin 40
// b => 7 => pin 37
// c => 4 => pin 35
// d => 2 => pin 32
// e => 1 => pin 31
// f => 10 => pin 38
// g => 5 => pin 36
// dp => 3 => pin 33

// 针脚定义
// 共阳管 正极: posArr => 共阳管针脚12, 9, 8, 6
// 共阳管 阴极: negArr =》 共阳管针脚1, 2, 3, 4, 5, 7, 10, 11
// 共阳管针脚定义参见./img*.jpg
