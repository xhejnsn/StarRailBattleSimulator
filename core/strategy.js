class Strategy {
  execute(character, context=null) {
    throw("not implemeted")
  }
}

class AlwaysAStrategy extends Strategy {
  execute(character, context = null) {
    character.performMove('A');
  }
}

module.exports = { Strategy, AlwaysAStrategy };