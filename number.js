const rpio = require("rpio");
const fetch = require("node-fetch");

const posArr = [13, 15, 16, 18];
const negArr = [31, 32, 33, 35, 36, 37, 38, 40];

// rpio.init({
//   gpiomem: true /* Use /dev/gpiomem */,
//   mapping: "physical" /* Use the P1-P40 numbering scheme */,
//   mock: true /* Emulate specific hardware in mock mode */
// });

//
posArr.concat(negArr).forEach(pin => rpio.open(pin, rpio.OUTPUT, rpio.LOW));

const numObj = {
  // 设置低电位以亮起
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
  ".": [33]
};

let timer;

function displayNumber(num) {
  // let timer;
  if (num > 10000 || num < 0) {
    return;
  }
  // 先加上最多小数位数
  let strNum = num.toFixed(3).slice(0, 5);
  // 记录小数点位置后去掉小数点
  const dpIndex = strNum.indexOf(".");
  strNum = strNum.replace(".", "");
  let strNumLength = strNum.length;
  // 从共阳极0位置开始扫描
  let currentPos = 0;
  // posArr.forEach(pin => rpio.write(pin, rpio.HIGH))
  timer = setInterval(() => {
    if (currentPos === strNumLength) {
      currentPos = 0;
    }
    let currentNum = strNum[currentPos];
    // 设置相应正极高电位, 其他正极低电位
    posArr.forEach((pin, index) => {
      index === currentPos
        ? rpio.write(pin, rpio.HIGH)
        : rpio.write(pin, rpio.LOW);
    });
    // 抹掉之前的低电位设置
    const lowArr = numObj[currentNum].concat(
      currentPos === dpIndex - 1 ? numObj["."] : []
    );
    negArr.forEach(pin =>
      rpio.write(pin, lowArr.includes(pin) ? rpio.LOW : rpio.HIGH)
    );
    // if (currentNum === ".") {
    //   currentNum = strNum[strNumLength - currentPos - 2];
    //   numObj[currentNum]
    //     .concat(numObj["."])
    //     .forEach(pin => rpio.write(pin, rpio.LOW));
    //   // currentPos += 2
    // } else {
    // console.log(currentNum);

    // .forEach(pin => rpio.write(pin, rpio.LOW));
    // }
    currentPos++;
  }, 0);
  // negArr.forEach(pin => rpio.write(pin, rpio.HIGH));

  // for (let i = 0; i < strNum.length; i++) {
  //   const thisPos =
  // }
  // 设置低电位以显示
  // numObj[num].forEach(pin => rpio.write(pin, rpio.LOW));
  // return timer;
}

// displayNumber(32.3);
// const latestPrice = 0;
function main(coinName) {
  fetch(`https://data.gateio.io/api2/1/ticker/${coinName}_usdt`)
    .then(res => res.json())
    .then(json => {
      const { last } = json;
      clearTimeout(timer);
      displayNumber(Number(last));
    });
}

let mainTimer = setInterval(function anony() {
  try {
    main("eos");
  } catch (e) {
    clearTimeout(mainTimer);
    console.log(
      "error encountered fetching latest price, retrying in 10 secs..."
    );
    setInterval(anony, 10000);
  }
}, 10000);

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
