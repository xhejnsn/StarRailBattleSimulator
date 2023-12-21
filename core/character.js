// Base move class
class Move {
  execute(character, context, target) {
    // Base logic for executing a move
  }

  needsTarget() {
    return true;
  }
}

class MoveA extends Move {
  execute(character, context, target) {
    character.addEnergy(20 * character.getEnergyRecEffic());
    if (context.verbose) {
      console.log(
        `[action] ${character.name
        } used move A. Current energy: ${character.currentEnergy.toFixed(2)}`
      );
    }
  }
}

class MoveE extends Move {
  execute(character, context, target) {
    character.addEnergy(30 * character.getEnergyRecEffic());
    if (context.verbose) {
      console.log(
        `[action] ${character.name
        } used move E. Current energy: ${character.currentEnergy.toFixed(2)}`
      );
    }
  }
}

class MoveQ extends Move {
  execute(character, context, target) {
    // Common logic for MoveQ, like consuming all energy
    character.currentEnergy = 0;
    character.addEnergy(5 * character.getEnergyRecEffic());
    if (context.verbose) {
      console.log(
        `[action] ${character.name
        } used move Q. Current energy: ${character.currentEnergy.toFixed(2)}`
      );
    }
  }
}

class MaxDistanceExceededError extends Error {
  constructor() {
    super('Exceeds max distance');
    this.name = 'MaxDistanceExceededError';
  }
}

class Character {
  constructor(
    name,
    baseSpeed,
    maxEnergy,
    strategy,
    extraSpeed = 0,
    extraEnergyRecoveryEfficiency = 0,
    extraEnergy = 0,
  ) {
    this.name = name;
    this.baseSpeed = baseSpeed;
    this.extraSpeed = extraSpeed;
    this.maxEnergy = maxEnergy;
    this.strategy = strategy;
    this.currentEnergy = extraEnergy + maxEnergy / 2;
    this.distanceToComplete = 10000;
    this.extraEnergyRecoveryEfficiency = extraEnergyRecoveryEfficiency;
    this.preTurnBuffs = [];
    this.postTurnBuffs = [];
    this.context = null;
    this.pos = 0;

    // Initialize moves with the general moves (can be overridden)
    this.moves = {
      A: new MoveA(),
      E: new MoveE(),
      Q: new MoveQ(),
    };

  }

  performMove(moveType, target = null) {
    if (this.moves[moveType]) {
      this.moves[moveType].execute(this, this.context, target);
    }
  }

  getSpeed() {
    return this.baseSpeed + this.extraSpeed;
  }

  getTimeToAct() {
    return (10000 - this.pos) / this.getSpeed();
  }

  updatePosMightThrow(timeDelta) {
    let newPos = this.pos + timeDelta * this.getSpeed();
    if (newPos > 10000) {
      throw new MaxDistanceExceededError();
    }
    this.pos = newPos;
  }

  getEnergyRecEffic() {
    return this.extraEnergyRecoveryEfficiency + 1;
  }

  applyPreTurnBuff(buff) {
    this.preTurnBuffs.push(buff);
    buff.apply(this);
  }

  applyPostTurnBuff(buff) {
    this.postTurnBuffs.push(buff);
    buff.apply(this);
  }

  handlePreTurnBuffs() {
    for (let i = this.preTurnBuffs.length - 1; i >= 0; i--) {
      const buff = this.preTurnBuffs[i];
      buff.duration--;

      if (buff.duration <= 0) {
        buff.remove(this);
        this.preTurnBuffs.splice(i, 1); // Remove the expired buff
      }
    }
  }

  handlePostTurnBuffs() {
    for (let i = this.postTurnBuffs.length - 1; i >= 0; i--) {
      const buff = this.postTurnBuffs[i];
      buff.duration--;

      if (buff.duration <= 0) {
        buff.remove(this);
        this.postTurnBuffs.splice(i, 1); // Remove the expired buff
      }
    }
  }

  addEnergy(amount) {
    this.currentEnergy += amount;
    if (this.currentEnergy > this.maxEnergy) {
      this.currentEnergy = this.maxEnergy;
    }
  }

  startBattle() {}

  startRound() {}

  endRound() {}

  act() {
    this.pos = 0;
    this.startRound();
    this.handlePreTurnBuffs(); // Handle buffs at the start of each turn
    this.strategy.execute(this);
    this.handlePostTurnBuffs(); // Handle buffs at the end of each turn
    this.endRound();
  }
}

module.exports = { Character, MoveA, MoveE, MoveQ, MaxDistanceExceededError };
