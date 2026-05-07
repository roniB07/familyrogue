class ItemScene extends Phaser.Scene {
  constructor() {
    super('ItemScene');
  }

  init(data) {
    this.player = data.player;
    this.waveManager = data.waveManager;
    this.runStats = data.runStats;
    this.bossReward = data.bossReward;
  }

  create() {
    this.cameras.main.setBackgroundColor('#11131b');
    this.add.text(42, 38, this.bossReward ? 'Boss besiegt: Vollheilung + Item' : 'Wave geschafft: Waehle ein Item', { fontSize: '28px', fontStyle: 'bold', color: '#ffffff' });
    this.add.text(44, 80, this.player.name + ' HP ' + Math.ceil(this.player.currentHp) + '/' + this.player.stats.hp, { fontSize: '16px', color: '#cbd2e1' });
    this.items = Phaser.Utils.Array.Shuffle(ITEMS.slice()).slice(0, 3);
    this.items.forEach(function (item, index) {
      this.drawItemCard(item, 130 + index * 225, 170);
    }, this);
  }

  drawItemCard(item, x, y) {
    var rect = this.add.rectangle(x, y, 190, 220, 0x202838).setStrokeStyle(2, 0x4b556f).setInteractive({ useHandCursor: true });
    this.add.text(x, y - 78, item.name, { fontSize: '20px', fontStyle: 'bold', color: '#ffffff', align: 'center', wordWrap: { width: 160 } }).setOrigin(0.5);
    this.add.text(x, y - 25, item.category.toUpperCase(), { fontSize: '13px', color: '#90caf9' }).setOrigin(0.5);
    this.add.text(x, y + 22, item.description, { fontSize: '16px', color: '#ffd166', align: 'center', wordWrap: { width: 155 } }).setOrigin(0.5);
    this.add.text(x, y + 78, 'NEHMEN', { fontSize: '16px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
    rect.on('pointerdown', function () {
      BattleSystem.applyItem(this.player, item);
      var enemy = this.waveManager.nextWave();
      this.scene.start('BattleScene', {
        player: this.player,
        waveManager: this.waveManager,
        enemy: enemy,
        runStats: this.runStats
      });
    }, this);
  }
}
