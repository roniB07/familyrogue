class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.save = SaveSystem.load();
    this.selected = null;
    this.cameras.main.setBackgroundColor('#7fd0ff');
    for (var i = 0; i < 60; i += 1) {
      this.add.rectangle(Phaser.Math.Between(0, 1280), Phaser.Math.Between(0, 720), 2, 2, 0xffffff, Phaser.Math.FloatBetween(0.25, 0.9));
    }
    this.add.rectangle(640, 360, 1280, 720, 0xbcecff, 0.55);
    this.add.ellipse(640, 704, 1500, 220, 0x6ec655, 1);
    this.add.rectangle(640, 360, 1180, 650, 0xf8fbff, 0.96).setStrokeStyle(4, 0x2454a6);
    this.add.text(70, 38, 'FamilyRogue', {
      fontFamily: '"Cinzel Decorative", Georgia, serif',
      fontSize: '44px',
      fontStyle: 'bold',
      color: '#fff6cf',
      stroke: '#2454a6',
      strokeThickness: 5
    });
    this.add.text(74, 98, 'Starter-Budget: 10 | Waehle einen freigeschalteten Kaempfer', { fontSize: '19px', color: '#2454a6' });
    this.add.text(930, 62, 'Runs ' + this.save.totalRuns + '  Best Wave ' + this.save.highestWave, { fontSize: '17px', color: '#2454a6' });
    this.add.rectangle(944, 378, 390, 450, 0xf8fafc, 0.97).setStrokeStyle(4, 0x111827);
    this.add.rectangle(944, 170, 390, 34, 0xffd166).setStrokeStyle(2, 0x2454a6);
    this.add.text(766, 158, 'CHARACTER INFO', { fontSize: '18px', fontStyle: 'bold', color: '#111827' });

    this.cardLayer = this.add.container(0, 0);
    this.drawCards();
    this.drawPlayButton();
    this.drawDetails(null);
  }

  drawCards() {
    var unlocked = this.save.unlockedCharacters;
    CHARACTERS.forEach(function (character, index) {
      var col = index % 3;
      var row = Math.floor(index / 5);
      row = Math.floor(index / 3);
      var x = 76 + col * 208;
      var y = 150 + row * 96;
      var isUnlocked = unlocked.indexOf(character.id) !== -1;
      var card = this.add.container(x, y);
      var bg = this.add.rectangle(0, 0, 180, 70, isUnlocked ? 0xffffff : 0xd6e0ef).setOrigin(0);
      bg.setStrokeStyle(3, character.id === this.selected ? 0xffa62b : 0x2454a6);
      var portrait = this.add.rectangle(14, 14, 42, 42, Phaser.Display.Color.HexStringToColor(character.color).color).setOrigin(0);
      var initials = this.add.text(35, 35, character.initials, { fontSize: '17px', fontStyle: 'bold', color: '#ffffff', stroke: '#111827', strokeThickness: 3 }).setOrigin(0.5);
      var name = this.add.text(68, 18, isUnlocked ? character.name : 'Gesperrt', {
        fontSize: '16px',
        fontStyle: 'bold',
        color: isUnlocked ? '#111827' : '#6f7788',
        wordWrap: { width: 100, useAdvancedWrap: true },
        fixedWidth: 100,
        fixedHeight: 36
      });
      this.fitTextToBox(name, 100, 36, 11);
      card.add([bg, portrait, initials, name]);
      if (isUnlocked) {
        bg.setInteractive({ useHandCursor: true }).on('pointerdown', function () {
          this.selected = character.id;
          this.cardLayer.destroy(true);
          this.cardLayer = this.add.container(0, 0);
          this.drawCards();
          this.updateSelectionText(character);
          this.drawDetails(character);
        }, this);
      }
      this.cardLayer.add(card);
    }, this);
  }

  drawPlayButton() {
    this.add.rectangle(392, 650, 650, 58, 0xffffff).setStrokeStyle(3, 0x2454a6);
    this.selectionText = this.add.text(86, 632, 'Kein Starter gewaehlt', { fontSize: '17px', fontStyle: 'bold', color: '#111827', wordWrap: { width: 600, useAdvancedWrap: true }, fixedWidth: 600, fixedHeight: 42 });
    var button = this.add.rectangle(1030, 650, 260, 60, 0xffd166).setInteractive({ useHandCursor: true });
    button.setStrokeStyle(3, 0x2454a6);
    this.add.text(1030, 650, 'START RUN', { fontSize: '25px', fontStyle: 'bold', color: '#111827' }).setOrigin(0.5);
    button.on('pointerdown', function () {
      if (!this.selected) return;
      var character = CHARACTER_BY_ID[this.selected];
      var fighter = BattleSystem.createFighter(character, 5, false);
      this.scene.start('BattleScene', { player: fighter, wave: 1, runStats: { damage: 0, score: 0, money: 0, startTime: Date.now() } });
    }, this);
  }

  updateSelectionText(character) {
    this.selectionText.setText(character.name + ' ausgewaehlt');
  }

  drawDetails(character) {
    if (this.detailLayer) this.detailLayer.destroy(true);
    this.detailLayer = this.add.container(0, 0);
    if (!character) {
      this.detailLayer.add(this.add.text(778, 210, 'Waehle links einen Charakter.', { fontSize: '20px', color: '#111827', wordWrap: { width: 320 } }));
      return;
    }
    var portrait = this.add.rectangle(832, 238, 96, 76, Phaser.Display.Color.HexStringToColor(character.color).color).setStrokeStyle(3, 0x111827);
    var initials = this.add.text(832, 238, character.initials, { fontSize: '32px', fontStyle: 'bold', color: '#ffffff', stroke: '#111827', strokeThickness: 4 }).setOrigin(0.5);
    var title = this.add.text(900, 202, character.name, { fontSize: '26px', fontStyle: 'bold', color: '#111827', wordWrap: { width: 210 } });
    var type = this.add.text(900, 244, character.type.toUpperCase() + ' | Kosten ' + character.starterCost, { fontSize: '17px', fontStyle: 'bold', color: '#2563eb' });
    var passive = this.add.text(780, 312, character.passive, { fontSize: '20px', fontStyle: 'bold', color: '#111827' });
    var passiveDesc = this.add.text(780, 342, character.passiveDesc, { fontSize: '16px', color: '#334155', wordWrap: { width: 320, useAdvancedWrap: true } });
    var desc = this.add.text(780, 410, character.description, { fontSize: '17px', color: '#111827', wordWrap: { width: 320, useAdvancedWrap: true } });
    var stats = this.add.text(780, 505, 'HP ' + character.baseStats.hp + '  ATK ' + character.baseStats.atk + '  DEF ' + character.baseStats.def + '\nSPD ' + character.baseStats.spd + '  SPATK ' + character.baseStats.spatk, { fontSize: '17px', fontStyle: 'bold', color: '#111827', lineSpacing: 8 });
    this.detailLayer.add([portrait, initials, title, type, passive, passiveDesc, desc, stats]);
  }

  fitTextToBox(textObject, maxWidth, maxHeight, minSize) {
    var size = parseInt(textObject.style.fontSize, 10);
    while ((textObject.width > maxWidth || textObject.height > maxHeight) && size > minSize) {
      size -= 1;
      textObject.setFontSize(size);
    }
  }
}
