class WaveManager {
  constructor(startWave) {
    this.currentWave = startWave || 1;
    this.currentBiome = this.getBiome();
  }

  getBiome() {
    var wave = this.currentWave;
    return BIOMES.find(function (biome) {
      return wave >= biome.waves[0] && wave <= biome.waves[1];
    }) || BIOMES[BIOMES.length - 1];
  }

  getWaveType() {
    if (this.currentWave % 10 === 0) return 'boss';
    if (this.currentWave % 5 === 0) return 'mystery';
    if (this.currentWave % 3 === 0) return 'trainer';
    return 'normal';
  }

  getEnemy() {
    this.currentBiome = this.getBiome();
    var pool = this.currentBiome.enemies;
    var id = Phaser.Utils.Array.GetRandom(pool);
    var character = CHARACTER_BY_ID[id] || CHARACTERS[0];
    var level = Math.floor(this.currentWave * 1.2) + 5;
    var type = this.getWaveType();
    var enemy = BattleSystem.createFighter(character, level, type === 'boss');
    if (type === 'trainer') {
      enemy.stats.hp = Math.floor(enemy.stats.hp * 1.15);
      enemy.currentHp = enemy.stats.hp;
      enemy.stats.atk = Math.floor(enemy.stats.atk * 1.1);
      enemy.stats.spatk = Math.floor(enemy.stats.spatk * 1.1);
    }
    return enemy;
  }

  nextWave() {
    this.currentWave += 1;
    this.currentBiome = this.getBiome();
    return this.getEnemy();
  }
}
