class SaveSystem {
  static key() {
    return 'familyrogue_save';
  }

  static defaultSave() {
    return {
      unlockedCharacters: ['oma_maria', 'opa_peter', 'tante_lisa', 'onkel_hans', 'gjyshi', 'nona'],
      highestWave: 1,
      totalRuns: 0,
      totalWins: 0,
      bestRunStats: { wave: 1, damage: 0, time: 0 }
    };
  }

  static load() {
    try {
      var raw = localStorage.getItem(SaveSystem.key());
      if (!raw) return SaveSystem.defaultSave();
      return Object.assign(SaveSystem.defaultSave(), JSON.parse(raw));
    } catch (error) {
      return SaveSystem.defaultSave();
    }
  }

  static save(data) {
    localStorage.setItem(SaveSystem.key(), JSON.stringify(data));
  }

  static recordRun(runStats) {
    var save = SaveSystem.load();
    save.totalRuns += 1;
    save.highestWave = Math.max(save.highestWave, runStats.wave);
    if (runStats.won) save.totalWins += 1;
    if (!save.bestRunStats || runStats.wave >= save.bestRunStats.wave) {
      save.bestRunStats = { wave: runStats.wave, damage: runStats.damage, time: runStats.time };
    }
    SaveSystem.unlockProgress(save);
    SaveSystem.save(save);
    return save;
  }

  static unlockProgress(save) {
    var locked = CHARACTERS.filter(function (character) {
      return save.unlockedCharacters.indexOf(character.id) === -1;
    });
    if (locked.length === 0) return;
    if (save.totalRuns % 2 === 0 || save.highestWave >= 10 + save.unlockedCharacters.length) {
      save.unlockedCharacters.push(locked[0].id);
    }
  }
}
