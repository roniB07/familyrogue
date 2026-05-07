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
    var isMobile = this.scale.height > this.scale.width;
    if (isMobile) return this.createMobile(save);
    this.cameras.main.setBackgroundColor('#8bd7ff');
    this.add.rectangle(640, 360, 1280, 720, 0xbcecff, 0.65);
    this.add.ellipse(640, 708, 1500, 230, 0x6ec655, 1);
    this.add.rectangle(640, 360, 760, 560, 0xf8fbff, 0.96).setStrokeStyle(4, 0x2454a6);
    this.add.text(640, 110, 'Run beendet', { fontSize: '52px', fontStyle: 'bold', color: '#2454a6' }).setOrigin(0.5);
    this.add.text(640, 188, this.player.name + ' hat bis Wave ' + this.runStats.wave + ' gekaempft.', { fontSize: '24px', color: '#111827' }).setOrigin(0.5);
    var stats = [
      'Score: ' + (this.runStats.score || 0),
      'Geld: ' + (this.runStats.money || 0),
      'Schaden: ' + this.runStats.damage,
      'Zeit: ' + this.runStats.time + 's',
      'Beste Wave: ' + save.highestWave,
      'Runs gesamt: ' + save.totalRuns,
      'Freigeschaltet: ' + save.unlockedCharacters.length + '/' + CHARACTERS.length
    ];
    stats.forEach(function (line, index) {
      this.add.text(640, 258 + index * 38, line, { fontSize: '23px', color: '#111827' }).setOrigin(0.5);
    }, this);
    var button = this.add.rectangle(640, 610, 310, 68, 0xffd166).setStrokeStyle(3, 0x2454a6).setInteractive({ useHandCursor: true });
    this.add.text(640, 610, 'ZURUECK ZUM MENU', { fontSize: '22px', fontStyle: 'bold', color: '#111827' }).setOrigin(0.5);
    button.on('pointerdown', function () {
      this.scene.start('MenuScene');
    }, this);
  }

  createMobile(save) {
    this.cameras.main.setBackgroundColor('#8bd7ff');
    this.add.rectangle(360, 640, 720, 1280, 0xbcecff, 0.65);
    this.add.ellipse(360, 1260, 920, 230, 0x6ec655, 1);
    this.add.rectangle(360, 640, 640, 1020, 0xf8fbff, 0.96).setStrokeStyle(4, 0x2454a6);
    this.add.text(360, 196, 'Run beendet', { fontSize: '50px', fontStyle: 'bold', color: '#2454a6' }).setOrigin(0.5);
    this.add.text(360, 282, this.player.name + ' hat bis Wave ' + this.runStats.wave + ' gekaempft.', {
      fontSize: '24px',
      color: '#111827',
      align: 'center',
      wordWrap: { width: 560, useAdvancedWrap: true }
    }).setOrigin(0.5);
    var stats = [
      'Score: ' + (this.runStats.score || 0),
      'Geld: ' + (this.runStats.money || 0),
      'Schaden: ' + this.runStats.damage,
      'Zeit: ' + this.runStats.time + 's',
      'Beste Wave: ' + save.highestWave,
      'Runs gesamt: ' + save.totalRuns,
      'Freigeschaltet: ' + save.unlockedCharacters.length + '/' + CHARACTERS.length
    ];
    stats.forEach(function (line, index) {
      this.add.text(360, 402 + index * 58, line, { fontSize: '25px', color: '#111827' }).setOrigin(0.5);
    }, this);
    var button = this.add.rectangle(360, 1038, 520, 76, 0xffd166).setStrokeStyle(3, 0x2454a6).setInteractive({ useHandCursor: true });
    this.add.text(360, 1038, 'ZURUECK ZUM MENU', { fontSize: '23px', fontStyle: 'bold', color: '#111827' }).setOrigin(0.5);
    button.on('pointerdown', function () {
      this.scene.start('MenuScene');
    }, this);
  }
}
