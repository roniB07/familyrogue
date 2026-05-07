class BattleSystem {
  static typeMultiplier(attackingType, defendingType, attacker, defender) {
    var multiplier = 1;
    if (attackingType === 'trickster') multiplier *= 1.25;
    if (defendingType === 'trickster') multiplier *= 1.25;

    var table = {
      wise: { tank: 1.5, speedster: 0.75 },
      tank: { speedster: 1.5, support: 0.75 },
      speedster: { support: 1.5, wise: 0.75 },
      support: { wise: 1.5, tank: 0.75 }
    };

    if (table[attackingType] && table[attackingType][defendingType]) {
      multiplier *= table[attackingType][defendingType];
    }
    if (attacker && attacker.runMods && attacker.runMods.typeCharm && multiplier > 1) {
      multiplier += attacker.runMods.typeCharm;
    }
    return multiplier;
  }

  static stageMultiplier(stage) {
    if (stage >= 0) return (2 + stage) / 2;
    return 2 / (2 + Math.abs(stage));
  }

  static getStat(fighter, stat) {
    var base = fighter.stats[stat];
    var stage = fighter.stages[stat] || 0;
    return Math.max(1, Math.floor(base * BattleSystem.stageMultiplier(stage)));
  }

  static createFighter(character, level, isBoss) {
    var scale = 1 + (level - 5) * 0.045;
    var stats = {
      hp: Math.floor(character.baseStats.hp * scale),
      atk: Math.floor(character.baseStats.atk * scale),
      def: Math.floor(character.baseStats.def * scale),
      spd: Math.floor(character.baseStats.spd * scale),
      spatk: Math.floor(character.baseStats.spatk * scale)
    };
    if (isBoss) {
      stats.hp = Math.floor(stats.hp * 1.45);
      stats.atk = Math.floor(stats.atk * 1.08);
      stats.def = Math.floor(stats.def * 1.08);
      stats.spatk = Math.floor(stats.spatk * 1.08);
    }
    return {
      id: character.id,
      name: character.name,
      initials: character.initials,
      color: character.color,
      type: character.type,
      passive: character.passive,
      passiveDesc: character.passiveDesc,
      moves: character.moves.map(function (moveId) {
        var move = MOVE_BY_ID[moveId];
        return Object.assign({}, move, { currentPp: move.pp });
      }),
      level: level,
      stats: stats,
      currentHp: stats.hp,
      stages: { atk: 0, def: 0, spd: 0, spatk: 0 },
      runMods: {},
      isBoss: Boolean(isBoss),
      shieldCount: isBoss ? BattleSystem.getShieldCount(level) : 0,
      brokenShields: 0
    };
  }

  static getShieldCount(level) {
    if (level >= 41) return 4;
    if (level >= 29) return 3;
    return 2;
  }

  static calculateDamage(attacker, defender, move, waveType) {
    if (!move || move.power <= 0) {
      return { damage: 0, critical: false, multiplier: 1 };
    }
    var attackStat = move.category === 'special' ? 'spatk' : 'atk';
    var atk = BattleSystem.getStat(attacker, attackStat);
    var def = BattleSystem.getStat(defender, 'def');
    var multiplier = BattleSystem.typeMultiplier(move.type, defender.type, attacker, defender);
    var critChance = 1 / 16 + ((attacker.runMods && attacker.runMods.critChance) || 0);
    var critical = Math.random() < critChance;
    var random = Phaser.Math.FloatBetween(0.85, 1);
    var damage = (((2 * attacker.level / 5 + 2) * move.power * atk / def / 50) + 2) * multiplier * random;
    if (critical) damage *= 1.5;
    if (attacker.passive === 'Starkster im Raum' && attacker.currentHp === attacker.stats.hp) damage *= 1.1;
    if (attacker.runMods && attacker.runMods.bossDamage && defender.isBoss) damage *= 1 + attacker.runMods.bossDamage;
    if (defender.runMods && defender.runMods.damageReduction) damage *= 1 - defender.runMods.damageReduction;
    return { damage: Math.max(1, Math.floor(damage)), critical: critical, multiplier: multiplier };
  }

  static applyMove(attacker, defender, move, waveType) {
    if (!move) move = BattleSystem.basicMove();
    var accuracyBonus = attacker.runMods && attacker.runMods.accuracy ? attacker.runMods.accuracy * 100 : 0;
    if (move.accuracy + accuracyBonus < Phaser.Math.Between(1, 100)) {
      return { hit: false, damage: 0, messages: [attacker.name + ' setzt ' + move.name + ' ein.', attacker.name + ' verfehlt ' + defender.name + '!'] };
    }
    if (move.currentPp !== undefined) move.currentPp = Math.max(0, move.currentPp - 1);

    var messages = [attacker.name + ' nutzt ' + move.name + '!'];
    var damageResult = BattleSystem.calculateDamage(attacker, defender, move, waveType);
    if (damageResult.damage > 0) {
      defender.currentHp = Math.max(0, defender.currentHp - damageResult.damage);
      messages.push(defender.name + ' wurde getroffen: -' + damageResult.damage + ' HP');
      if (damageResult.critical) messages.push('KRITISCH!');
      if (damageResult.multiplier >= 1.5) messages.push('Sehr effektiv!');
      if (damageResult.multiplier <= 0.75) messages.push('Nicht sehr effektiv.');
    }
    BattleSystem.applyEffect(attacker, defender, move, messages);
    return { hit: true, damage: damageResult.damage, critical: damageResult.critical, messages: messages };
  }

  static applyEffect(attacker, defender, move, messages) {
    if (!move.effect || move.effect === 'none') return;
    var parts = move.effect.split('_');
    if (parts[0] === 'heal') {
      var amount = Math.floor(attacker.stats.hp * (parseInt(parts[1], 10) / 100));
      if (attacker.passive === 'Stammesaelteste') amount = Math.floor(amount * 1.1);
      attacker.currentHp = Math.min(attacker.stats.hp, attacker.currentHp + amount);
      messages.push(attacker.name + ' heilt ' + amount + ' HP.');
    }
    if (parts[0] === 'damage') {
      var bonus = parseInt(parts[1], 10);
      defender.currentHp = Math.max(0, defender.currentHp - bonus);
      messages.push(defender.name + ' nimmt ' + bonus + ' Bonus-Schaden.');
    }
    if (parts[0] === 'stat' && parts[1] === 'boost') {
      var stat = parts[2];
      attacker.stages[stat] = Math.min(6, (attacker.stages[stat] || 0) + 1);
      messages.push(attacker.name + ': ' + stat.toUpperCase() + ' steigt!');
      if (attacker.passive === 'Guter Rat') {
        attacker.currentHp = Math.min(attacker.stats.hp, attacker.currentHp + 8);
      }
    }
    if (parts[0] === 'debuff') {
      var debuffStat = parts[1];
      defender.stages[debuffStat] = Math.max(-6, (defender.stages[debuffStat] || 0) - 1);
      messages.push(defender.name + ' ist verwirrt: ' + debuffStat.toUpperCase() + ' sinkt!');
    }
  }

  static triggerPassives(fighters) {
    fighters.forEach(function (fighter) {
      if (!fighter || fighter.currentHp <= 0) return;
      var regen = 0;
      if (fighter.passive === 'Kochkunst' || fighter.passive === 'Stammesaeltester') regen += 0.05;
      if (fighter.runMods && fighter.runMods.regen) regen += fighter.runMods.regen;
      if (regen > 0) {
        fighter.currentHp = Math.min(fighter.stats.hp, fighter.currentHp + Math.floor(fighter.stats.hp * regen));
      }
    });
  }

  static basicMove() {
    return { id: 'basis_angriff', name: 'Basis-Angriff', type: 'tank', category: 'physical', power: 30, accuracy: 100, pp: 999, currentPp: undefined, effect: 'none' };
  }

  static applyItem(fighter, item) {
    var apply = item.apply;
    if (apply.allStats) {
      ['hp', 'atk', 'def', 'spd', 'spatk'].forEach(function (stat) {
        fighter.stats[stat] = Math.floor(fighter.stats[stat] * (1 + apply.allStats));
      });
    }
    if (apply.stat) {
      fighter.stats[apply.stat] = Math.floor(fighter.stats[apply.stat] * (1 + apply.percent));
    }
    if (apply.maxHp) fighter.stats.hp += apply.maxHp;
    if (apply.fullHeal) fighter.currentHp = fighter.stats.hp;
    if (apply.healFlat) fighter.currentHp = Math.min(fighter.stats.hp, fighter.currentHp + apply.healFlat);
    if (apply.ppRestore) fighter.moves.forEach(function (move) { move.currentPp = move.pp; });
    ['typeCharm', 'critChance', 'bossDamage', 'accuracy', 'damageReduction', 'regen'].forEach(function (key) {
      if (apply[key]) fighter.runMods[key] = (fighter.runMods[key] || 0) + apply[key];
    });
  }
}
