class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.runStats = data.runStats;
    this.player = data.player;
  }

  create() {
    var save = SaveSystem.load();
    this.cameras.main.setBackgroundColor('#120f18');
    this.add.text(400, 90, 'Run beendet', { fontSize: '42px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(400, 158, this.player.name + ' hat bis Wave ' + this.runStats.wave + ' gekaempft.', { fontSize: '20px', color: '#e8edf8' }).setOrigin(0.5);
    var stats = [
      'Schaden: ' + this.runStats.damage,
      'Zeit: ' + this.runStats.time + 's',
      'Beste Wave: ' + save.highestWave,
      'Runs gesamt: ' + save.totalRuns,
      'Freigeschaltet: ' + save.unlockedCharacters.length + '/' + CHARACTERS.length
    ];
    stats.forEach(function (line, index) {
      this.add.text(400, 225 + index * 34, line, { fontSize: '20px', color: '#cbd2e1' }).setOrigin(0.5);
    }, this);
    var button = this.add.rectangle(400, 470, 230, 58, 0x2f9e44).setStrokeStyle(2, 0x8ce99a).setInteractive({ useHandCursor: true });
    this.add.text(400, 470, 'ZURUECK ZUM MENU', { fontSize: '18px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
    button.on('pointerdown', function () {
      this.scene.start('MenuScene');
    }, this);
  }
}
