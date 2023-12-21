const Shenjun = require('../characters/shenjun');
const JingYuan = require('../characters/jingyuan');
const { Strategy } = require('../core/strategy');
const { MaxDistanceExceededError } = require('../core/character');

class QEEEStrategy extends Strategy {
  constructor() {
    super();
    this.counter = 0;
  }

  execute(character, context = null) {
    if (this.counter % 4 === 0) {
      character.performMove('Q');
    } else if (this.counter % 4 === 1) {
      character.performMove('E');
    } else if (this.counter % 4 === 2) {
      character.performMove('E');
    } else {
      character.performMove('E');
    }
    this.counter++;
  }
}

class MyContext {
  constructor() {
    this.summonCharacters = [];
    this.verbose = false;
  }
}

// the goal is to find JY's speed range that satisfy: Q->E->SJ->E->E->SJ->... 
// within a specified time range
function JY_QESJEESJ_simulate(initStack, totalTime) {
  let pairs = [];
  for (let v = 99; v < 200; v++) {
    let count = JY_QESJEESJ_simulate_helper(v, initStack, totalTime);
    if (count < 0) {
      continue;
    }
    pairs.push({ v, count }); // Store the pair
  }

  // Finding the min/max of v and count separately
  let minV = Infinity,
    maxV = -Infinity;
  let minSJActCount = Infinity,
    maxSJActCount = -Infinity;
  pairs.forEach((pair) => {
    if (pair.v < minV) minV = pair.v;
    if (pair.v > maxV) maxV = pair.v;
    if (pair.count < minSJActCount) minSJActCount = pair.count;
    if (pair.count > maxSJActCount) maxSJActCount = pair.count;
  });

  // Finding the min v that has max count
  let minVWithmaxSJActCount = Infinity;

  pairs.forEach((pair) => {
    if (pair.count === maxSJActCount && pair.v < minVWithmaxSJActCount) {
      minVWithmaxSJActCount = pair.v;
    }
  });

  console.log(
    `in time ${totalTime}, JY's speed should be within [${minV}, ${maxV}]. ` +
      `SJ will act ${minSJActCount}-${maxSJActCount} times. ` +
      (minSJActCount !== maxSJActCount ? `Best speed range: [${minVWithmaxSJActCount}, ${maxV}].` : ``)
  );
}

function JY_QESJEESJ_simulate_helper(v, initStack, totalTime) {
  let context = new MyContext(totalTime);
  let time = 0;

  let SJ = new Shenjun(context, initStack - 3);
  context.summonCharacters.push(SJ);

  let JY = new JingYuan(new QEEEStrategy(), 0, v - 99);
  JY.context = context;

  let SJActCounter = 0;
  // verify Q->E->SJ->E->E->SJ
  // return -1 if the cycle breaks
  try {
    let cyclePosCounter = 0;
    let timeDelta = 0;
    while (time < totalTime) {
      switch (cyclePosCounter % 6) {
        case 0: // Q
          JY.strategy.execute(JY);
          break;
        case 1: // E
        case 3:
        case 4:
          timeDelta = JY.getTimeToAct();
          time += timeDelta;
          SJ.updatePosMightThrow(timeDelta);
          JY.act();
          break;
        case 2: // SJ
        case 5:
          timeDelta = SJ.getTimeToAct();
          time += timeDelta;
          JY.updatePosMightThrow(timeDelta);
          SJ.act();
          SJActCounter++;
          break;
      }
      cyclePosCounter++;
    }
  } catch (error) {
    if (error instanceof MaxDistanceExceededError) {
      return -1;
    } else {
      throw error;
    }
  }
  return SJActCounter;
}

JY_QESJEESJ_simulate(3, 250); // 1t
JY_QESJEESJ_simulate(3, 350); // 2t
JY_QESJEESJ_simulate(3, 450); // 3t
JY_QESJEESJ_simulate(3, 550); // 4t
JY_QESJEESJ_simulate(3, 650); // 5t