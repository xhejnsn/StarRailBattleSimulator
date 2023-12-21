const { Character, MoveA } = require('../core/character');
const { AlwaysAStrategy } = require('../core/strategy');

 // TODO: this is a hack because ShenJun doesn't have a concept of AEQ
class ShenjunMove extends MoveA {
  execute(character, context, target) {
    super.execute(character, context, target);
    character.hitsPerAction = 3; // reset HPA
  }
}

class Shenjun extends Character {
  constructor(context, extraHPA) {
    // TODO: this is a hack b/c ShenJun doesn't have a concept of energy
    super('ShenJun', 60, -1, new AlwaysAStrategy());
    this.context = context;
    this.moves.A = new ShenjunMove();
    this.hitsPerAction = 3 + extraHPA;
  }

  getSpeed() {
    return this.baseSpeed + (this.hitsPerAction - 3) * 10;
  }

  incHPA(amount) {
    this.hitsPerAction += amount;
    if (this.hitsPerAction > 10) {
      this.hitsPerAction = 10;
    }
  }

  startRound() {
    if (this.context.verbose) {
      console.log(`${this.name} current HPA: ${this.hitsPerAction}`);
    }
  }
}

module.exports = Shenjun;
