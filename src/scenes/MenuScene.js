class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.save = SaveSystem.load();
    this.selected = null;
    this.cameras.main.setBackgroundColor('#10131d');
    this.add.text(32, 22, 'FamilyRogue', { fontSize: '34px', fontStyle: 'bold', color: '#ffffff' });
    this.add.text(34, 62, 'Starter-Budget: 10 | Waehle einen freigeschalteten Kaempfer', { fontSize: '16px', color: '#cbd2e1' });
    this.add.text(560, 30, 'Runs: ' + this.save.totalRuns + '  Best Wave: ' + this.save.highestWave, { fontSize: '14px', color: '#aeb7cc' });

    this.cardLayer = this.add.container(0, 0);
    this.drawCards();
    this.drawPlayButton();
  }

  drawCards() {
    var unlocked = this.save.unlockedCharacters;
    CHARACTERS.forEach(function (character, index) {
      var col = index % 5;
      var row = Math.floor(index / 5);
      var x = 34 + col * 150;
      var y = 105 + row * 125;
      var isUnlocked = unlocked.indexOf(character.id) !== -1;
      var card = this.add.container(x, y);
      var bg = this.add.rectangle(0, 0, 132, 104, isUnlocked ? 0x1d2330 : 0x12151d).setOrigin(0);
      bg.setStrokeStyle(2, character.id === this.selected ? 0xffffff : 0x394154);
      var portrait = this.add.rectangle(14, 12, 46, 38, Phaser.Display.Color.HexStringToColor(character.color).color).setOrigin(0);
      var initials = this.add.text(37, 31, character.initials, { fontSize: '18px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
      var name = this.add.text(68, 12, character.name, { fontSize: '14px', fontStyle: 'bold', color: isUnlocked ? '#ffffff' : '#6f7788', wordWrap: { width: 58 } });
      var type = this.add.text(14, 58, character.type.toUpperCase(), { fontSize: '11px', color: '#90caf9' });
      var cost = this.add.text(14, 76, 'Kosten ' + character.starterCost, { fontSize: '12px', color: '#ffd166' });
      var desc = this.add.text(68, 56, isUnlocked ? character.passive : 'Gesperrt', { fontSize: '11px', color: isUnlocked ? '#cbd2e1' : '#636b7b', wordWrap: { width: 55 } });
      card.add([bg, portrait, initials, name, type, cost, desc]);
      if (isUnlocked) {
        bg.setInteractive({ useHandCursor: true }).on('pointerdown', function () {
          this.selected = character.id;
          this.cardLayer.destroy(true);
          this.cardLayer = this.add.container(0, 0);
          this.drawCards();
          this.updateSelectionText(character);
        }, this);
      }
      this.cardLayer.add(card);
    }, this);
  }

  drawPlayButton() {
    this.selectionText = this.add.text(36, 505, 'Kein Starter gewaehlt', { fontSize: '16px', color: '#e8edf8' });
    var button = this.add.rectangle(650, 522, 210, 52, 0x2f9e44).setInteractive({ useHandCursor: true });
    button.setStrokeStyle(2, 0x8ce99a);
    this.add.text(650, 522, 'SPIELEN', { fontSize: '22px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
    button.on('pointerdown', function () {
      if (!this.selected) return;
      var character = CHARACTER_BY_ID[this.selected];
      var fighter = BattleSystem.createFighter(character, 5, false);
      this.scene.start('BattleScene', { player: fighter, wave: 1, runStats: { damage: 0, startTime: Date.now() } });
    }, this);
  }

  updateSelectionText(character) {
    this.selectionText.setText(character.name + ' | ' + character.type + ' | ' + character.passive + ': ' + character.passiveDesc);
  }
}
