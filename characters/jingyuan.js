const { Character, MoveE, MoveQ } = require('../core/character');
const Shenjun = require('./shenjun')

class JingYuanEMove extends MoveE {
  execute(character, context, target) {
    super.execute(character, context, target);
    const shenjun = context.summonCharacters.find(
      (char) => char instanceof Shenjun
    );
    shenjun.incHPA(2);
    if (context.verbose) {
      console.log(`${shenjun.name}'s current HPA: ${shenjun.hitsPerAction}`);
    }
  }
}

class JingYuanQMove extends MoveQ {
  execute(character, context, target) {
    super.execute(character, context, target);
    const shenjun = context.summonCharacters.find(
      (char) => char instanceof Shenjun
    );
    shenjun.incHPA(3);
    if (context.verbose) {
      console.log(`${shenjun.name}'s current HPA: ${shenjun.hitsPerAction}`);
    }
  }

  needsTarget() {
    return false;
  }
}

class JingYuan extends Character {
  constructor(strategy, extraHPA = 0, extraSpeed = 0, extraEnergyRecoveryEfficiency = 0) {
    super('JingYuan', 99, 130, strategy, extraSpeed, extraEnergyRecoveryEfficiency);

    this.moves.E = new JingYuanEMove();
    this.moves.Q = new JingYuanQMove();
    this.extraHPA = extraHPA;
  }

  startBattle() {
    this.addEnergy(15);
    this.context.summonCharacters.push(new Shenjun(this.context, this.extraHPA));
  }
}

module.exports = JingYuan;
