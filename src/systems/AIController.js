class AIController {
  static chooseMove(enemy, player) {
    var usable = enemy.moves.filter(function (move) { return move.currentPp > 0; });
    if (usable.length === 0) return BattleSystem.basicMove();

    var healMove = usable.find(function (move) { return move.effect && move.effect.indexOf('heal_') === 0; });
    if (enemy.currentHp / enemy.stats.hp < 0.3 && healMove && Math.random() < 0.8) {
      return healMove;
    }

    var weaknessMoves = usable.filter(function (move) {
      return BattleSystem.typeMultiplier(move.type, player.type, enemy, player) > 1;
    });
    if (weaknessMoves.length > 0 && Math.random() < 0.6) {
      return Phaser.Utils.Array.GetRandom(weaknessMoves);
    }

    usable.sort(function (a, b) { return b.power - a.power; });
    return usable[0];
  }
}
