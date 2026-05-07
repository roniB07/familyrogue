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
    this.cameras.main.setBackgroundColor('#8bd7ff');
    this.add.rectangle(640, 360, 1280, 720, 0xbcecff, 0.6);
    this.add.ellipse(640, 708, 1500, 230, 0x6ec655, 1);
    this.add.rectangle(640, 360, 1140, 610, 0xf8fbff, 0.96).setStrokeStyle(4, 0x2454a6);
    this.add.text(74, 56, this.bossReward ? 'Boss besiegt: Vollheilung + Item' : 'Wave geschafft: Waehle ein Item', { fontSize: '36px', fontStyle: 'bold', color: '#2454a6' });
    this.add.text(78, 112, this.player.name + ' HP ' + Math.ceil(this.player.currentHp) + '/' + this.player.stats.hp + ' | Score ' + (this.runStats.score || 0) + ' | $ ' + (this.runStats.money || 0), { fontSize: '20px', color: '#2454a6' });
    this.items = Phaser.Utils.Array.Shuffle(ITEMS.slice()).slice(0, 3);
    this.items.forEach(function (item, index) {
      this.drawItemCard(item, 300 + index * 340, 330);
    }, this);
  }

  drawItemCard(item, x, y) {
    var rarityColor = item.category === 'special' ? 0xc77dff : item.category === 'stat' ? 0xffd166 : 0x7bd88f;
    var rect = this.add.rectangle(x, y, 270, 270, 0xffffff).setStrokeStyle(4, 0x2454a6).setInteractive({ useHandCursor: true });
    this.add.rectangle(x, y - 108, 270, 42, rarityColor).setStrokeStyle(2, 0x2454a6);
    this.add.text(x, y - 92, item.name, { fontSize: '24px', fontStyle: 'bold', color: '#111827', align: 'center', wordWrap: { width: 230, useAdvancedWrap: true } }).setOrigin(0.5);
    this.add.text(x, y - 32, item.category.toUpperCase(), { fontSize: '15px', fontStyle: 'bold', color: '#2454a6' }).setOrigin(0.5);
    this.add.text(x, y + 28, item.description, { fontSize: '19px', color: '#111827', align: 'center', wordWrap: { width: 225, useAdvancedWrap: true } }).setOrigin(0.5);
    this.add.text(x, y + 100, 'NEHMEN', { fontSize: '18px', fontStyle: 'bold', color: '#2454a6' }).setOrigin(0.5);
    rect.on('pointerdown', function () {
      BattleSystem.applyItem(this.player, item);
      var enemy = this.waveManager.nextWave(this.player.id);
      this.scene.start('BattleScene', {
        player: this.player,
        waveManager: this.waveManager,
        enemy: enemy,
        runStats: this.runStats
      });
    }, this);
  }
}
