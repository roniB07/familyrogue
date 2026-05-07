class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
  }

  init(data) {
    this.player = data.player;
    this.waveManager = data.waveManager || new WaveManager(data.wave || 1);
    this.enemy = data.enemy || this.waveManager.getEnemy(this.player.id);
    this.runStats = data.runStats || { damage: 0, score: 0, money: 0, startTime: Date.now() };
    this.runStats.score = this.runStats.score || 0;
    this.runStats.money = this.runStats.money || 0;
    this.turnLocked = false;
    this.logs = [];
  }

  create() {
    this.waveType = this.waveManager.getWaveType();
    this.biome = this.waveManager.currentBiome;
    this.drawArena();
    this.drawFighters();
    this.drawMoves();
    this.drawLog();
    this.drawBattleMenu();
    this.pushLog('Ein ' + this.enemy.name + ' erscheint!');
  }

  drawArena() {
    var bgColor = Phaser.Display.Color.HexStringToColor(this.biome.bgColor).color;
    this.cameras.main.setBackgroundColor('#8bd7ff');
    this.add.rectangle(640, 96, 1280, 192, 0x8bd7ff);
    this.add.circle(170, 105, 48, 0xffffff, 0.38);
    this.add.circle(1070, 112, 34, 0xffffff, 0.26);
    this.add.rectangle(640, 292, 1280, 392, bgColor, 0.66);
    this.add.rectangle(640, 292, 1280, 392, 0x7bd88f, 0.18);
    for (var i = 0; i < 11; i += 1) {
      this.add.rectangle(110 + i * 112, 305 + (i % 2) * 18, 70, 5, 0xffffff, 0.14);
    }
    this.add.rectangle(640, 488, 1280, 176, 0x5aa43d);
    this.add.ellipse(902, 246, 348, 78, 0x5f8f45, 1);
    this.add.ellipse(902, 246, 312, 54, 0xb6d96a, 1);
    this.add.ellipse(338, 438, 430, 94, 0x5f8f45, 1);
    this.add.ellipse(338, 438, 386, 66, 0xb6d96a, 1);
    this.add.rectangle(640, 28, 1280, 56, 0x2454a6, 0.96);
    this.add.text(34, 16, 'Wave ' + this.waveManager.currentWave, { fontSize: '20px', fontStyle: 'bold', color: '#ffffff' });
    this.add.text(160, 17, this.biome.name, { fontSize: '19px', color: '#c7d2fe' });
    this.add.text(345, 17, this.waveType.toUpperCase(), { fontSize: '19px', color: this.waveType === 'boss' ? '#ff7070' : '#ffd166' });
    this.scoreText = this.add.text(560, 17, 'Score ' + this.runStats.score, { fontSize: '19px', color: '#ffffff' });
    this.moneyText = this.add.text(760, 17, '$ ' + this.runStats.money, { fontSize: '19px', color: '#fff6cf' });
    this.add.text(1060, 16, 'FamilyRogue', { fontSize: '21px', fontStyle: 'bold', color: '#fff6cf' });
  }

  drawFighters() {
    this.enemySprite = this.drawCharacter(900, 198, this.enemy, 1.1);
    this.enemyHpBar = this.drawHpBar(70, 80, this.enemy, true);

    this.playerSprite = this.drawCharacter(338, 388, this.player, 1.3);
    this.playerHpBar = this.drawHpBar(760, 340, this.player, false);
  }

  drawCharacter(x, y, fighter, scale) {
    var group = this.add.container(x, y);
    var shadow = this.add.ellipse(0, 52 * scale, 116 * scale, 24 * scale, 0x111111, 0.28);
    var body = this.add.rectangle(0, 0, 92 * scale, 72 * scale, Phaser.Display.Color.HexStringToColor(fighter.color).color).setStrokeStyle(4, 0x1f2937);
    var shine = this.add.rectangle(-22 * scale, -18 * scale, 26 * scale, 12 * scale, 0xffffff, 0.18);
    var text = this.add.text(0, 0, fighter.initials, { fontSize: Math.floor(28 * scale) + 'px', fontStyle: 'bold', color: '#ffffff', stroke: '#111827', strokeThickness: 4 }).setOrigin(0.5);
    group.add([shadow, body, shine, text]);
    group.bodyRect = body;
    return group;
  }

  drawHpBar(x, y, fighter) {
    this.add.rectangle(x + 184, y + 46, 368, 92, 0x111827, 1).setOrigin(0.5);
    this.add.rectangle(x + 180, y + 42, 352, 78, 0xf8fafc, 1).setOrigin(0.5).setStrokeStyle(3, 0x111827);
    var nameText = this.add.text(x + 18, y + 7, fighter.name.toUpperCase(), {
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#111827',
      wordWrap: { width: 242, useAdvancedWrap: true },
      fixedWidth: 242,
      fixedHeight: 32
    });
    this.fitTextToBox(nameText, 242, 32, 12);
    this.add.text(x + 276, y + 9, 'Lv.' + fighter.level, { fontSize: '17px', fontStyle: 'bold', color: '#111827' });
    var bar = {
      x: x + 72,
      y: y + 43,
      width: 238,
      bg: this.add.rectangle(x + 72, y + 43, 238, 15, 0x111111).setOrigin(0),
      fill: this.add.rectangle(x + 72, y + 43, 238, 15, 0x3ad66e).setOrigin(0),
      text: this.add.text(x + 105, y + 62, '', { fontSize: '14px', fontStyle: 'bold', color: '#111827', fixedWidth: 190, fixedHeight: 18 }),
      lines: []
    };
    if (fighter.isBoss) {
      for (var i = 1; i < fighter.shieldCount; i += 1) {
        bar.lines.push(this.add.rectangle(bar.x + (bar.width / fighter.shieldCount) * i, bar.y - 2, 2, 19, 0xffffff).setOrigin(0.5, 0));
      }
    }
    this.updateHpBar(bar, fighter);
    return bar;
  }

  updateHpBar(bar, fighter) {
    var ratio = Phaser.Math.Clamp(fighter.currentHp / fighter.stats.hp, 0, 1);
    this.tweens.add({ targets: bar.fill, displayWidth: bar.width * ratio, duration: 220, ease: 'Sine.easeOut' });
    bar.fill.fillColor = ratio < 0.3 ? 0xef476f : ratio < 0.6 ? 0xffd166 : 0x3ad66e;
    bar.text.setText(Math.ceil(fighter.currentHp) + ' / ' + fighter.stats.hp + ' HP');
  }

  drawMoves() {
    this.moveButtons = [];
    this.add.rectangle(640, 624, 1280, 192, 0x2e66c8).setStrokeStyle(4, 0xf8fafc);
    this.add.rectangle(302, 624, 560, 156, 0xf8fafc, 1).setStrokeStyle(4, 0x111827);
    this.add.rectangle(914, 624, 650, 156, 0xf8fafc, 1).setStrokeStyle(4, 0x111827);
    this.add.rectangle(914, 624, 616, 122, 0xeaf7ff, 1).setStrokeStyle(2, 0x91c8ff);
    this.player.moves.forEach(function (move, index) {
      var col = index % 2;
      var row = Math.floor(index / 2);
      var x = 764 + col * 300;
      var y = 596 + row * 66;
      var rect = this.add.rectangle(x + 3, y + 3, 282, 58, 0x111827, 0.22);
      var face = this.add.rectangle(x, y, 282, 58, move.currentPp > 0 ? 0xffffff : 0xcbd2df).setInteractive({ useHandCursor: move.currentPp > 0 });
      face.setStrokeStyle(3, 0x243044);
      var typeColor = this.getTypeColor(move.type);
      this.add.rectangle(x - 127, y, 8, 46, typeColor).setOrigin(0.5);
      var label = this.add.text(x - 128, y - 22, move.name, {
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#111827',
        wordWrap: { width: 252, useAdvancedWrap: true },
        fixedWidth: 252,
        fixedHeight: 24
      });
      this.fitTextToBox(label, 252, 24, 12);
      var info = this.add.text(x - 128, y + 5, this.getMoveInfo(move), {
        fontSize: '12px',
        color: '#475569',
        fixedWidth: 252,
        fixedHeight: 32,
        wordWrap: { width: 252, useAdvancedWrap: true }
      });
      face.on('pointerdown', function () { this.playerChooseMove(move); }, this);
      this.moveButtons.push({ rect: face, shadow: rect, label: label, info: info, move: move });
    }, this);
  }

  refreshMoves() {
    this.moveButtons.forEach(function (button) {
      button.rect.fillColor = button.move.currentPp > 0 ? 0xeaf2ff : 0xb8becb;
      button.rect.setAlpha(button.move.currentPp > 0 ? 1 : 0.55);
      button.info.setText(this.getMoveInfo(button.move));
    }, this);
  }

  drawLog() {
    this.logText = this.add.text(38, 570, '', {
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#111827',
      wordWrap: { width: 500, useAdvancedWrap: true },
      fixedWidth: 500,
      fixedHeight: 124,
      maxLines: 4
    });
  }

  getMoveInfo(move) {
    var power = move.power > 0 ? 'Pow ' + move.power : 'Status';
    return move.type.toUpperCase() + ' | ' + power + ' | Acc ' + move.accuracy + ' | PP ' + move.currentPp + '/' + move.pp;
  }

  getTypeColor(type) {
    var colors = {
      wise: 0x7f77dd,
      tank: 0xd96c3d,
      speedster: 0x35a7ff,
      support: 0x2f9e44,
      trickster: 0xef476f
    };
    return colors[type] || 0x64748b;
  }

  drawBattleMenu() {
    var menu = this.add.container(0, 0);
    var box = this.add.rectangle(1190, 92, 150, 58, 0xf8fafc, 0.97).setStrokeStyle(3, 0x111827).setInteractive({ useHandCursor: true });
    var text = this.add.text(1190, 92, 'MENU', { fontSize: '18px', fontStyle: 'bold', color: '#111827' }).setOrigin(0.5);
    menu.add([box, text]);
    box.on('pointerdown', function () {
      this.toggleRunMenu();
    }, this);
  }

  toggleRunMenu() {
    if (this.runMenuLayer) {
      this.runMenuLayer.destroy(true);
      this.runMenuLayer = null;
      return;
    }
    this.runMenuLayer = this.add.container(0, 0);
    var blocker = this.add.rectangle(640, 360, 1280, 720, 0x2454a6, 0.18).setInteractive();
    var panel = this.add.rectangle(640, 360, 430, 260, 0xffffff, 0.98).setStrokeStyle(4, 0x2454a6);
    var title = this.add.text(640, 270, 'RUN MENU', { fontSize: '28px', fontStyle: 'bold', color: '#2454a6' }).setOrigin(0.5);
    var continueBtn = this.add.rectangle(640, 348, 300, 54, 0xeaf7ff).setStrokeStyle(3, 0x2454a6).setInteractive({ useHandCursor: true });
    var continueText = this.add.text(640, 348, 'WEITERKAEMPFEN', { fontSize: '20px', fontStyle: 'bold', color: '#111827' }).setOrigin(0.5);
    var endBtn = this.add.rectangle(640, 424, 300, 54, 0xffd2c9).setStrokeStyle(3, 0x2454a6).setInteractive({ useHandCursor: true });
    var endText = this.add.text(640, 424, 'RUN BEENDEN', { fontSize: '20px', fontStyle: 'bold', color: '#111827' }).setOrigin(0.5);
    continueBtn.on('pointerdown', function () { this.toggleRunMenu(); }, this);
    endBtn.on('pointerdown', function () { this.endRun(false); }, this);
    this.runMenuLayer.add([blocker, panel, title, continueBtn, continueText, endBtn, endText]);
  }

  pushLog(message) {
    this.logs.unshift(message);
    this.logs = this.logs.slice(0, 4);
    if (this.logText) this.logText.setText(this.logs.join('\n'));
  }

  fitTextToBox(textObject, maxWidth, maxHeight, minSize) {
    var size = parseInt(textObject.style.fontSize, 10);
    while ((textObject.width > maxWidth || textObject.height > maxHeight) && size > minSize) {
      size -= 1;
      textObject.setFontSize(size);
    }
  }

  playerChooseMove(move) {
    if (this.runMenuLayer || this.turnLocked || move.currentPp <= 0) return;
    this.turnLocked = true;
    this.setMoveButtonsEnabled(false);
    this.pushLog(this.player.name + ' waehlt ' + move.name + '.');
    var enemyMove = AIController.chooseMove(this.enemy, this.player);
    var playerFirst = BattleSystem.getStat(this.player, 'spd') >= BattleSystem.getStat(this.enemy, 'spd');
    var order = playerFirst ? [
      { attacker: this.player, defender: this.enemy, move: move, sprite: this.enemySprite, bar: this.enemyHpBar },
      { attacker: this.enemy, defender: this.player, move: enemyMove, sprite: this.playerSprite, bar: this.playerHpBar }
    ] : [
      { attacker: this.enemy, defender: this.player, move: enemyMove, sprite: this.playerSprite, bar: this.playerHpBar },
      { attacker: this.player, defender: this.enemy, move: move, sprite: this.enemySprite, bar: this.enemyHpBar }
    ];
    try {
      this.resolveAction(order, 0);
    } catch (error) {
      console.error(error);
      this.pushLog('Der Zug wurde abgebrochen. Du kannst weiterkaempfen.');
      this.turnLocked = false;
      this.setMoveButtonsEnabled(true);
    }
  }

  resolveAction(order, index) {
    if (index >= order.length) {
      BattleSystem.triggerPassives([this.player, this.enemy]);
      this.updateHpBar(this.playerHpBar, this.player);
      this.updateHpBar(this.enemyHpBar, this.enemy);
      this.refreshMoves();
      return this.checkEndOrUnlock();
    }
    var action = order[index];
    if (action.attacker.currentHp <= 0 || action.defender.currentHp <= 0) return this.resolveAction(order, index + 1);
    var before = action.defender.currentHp;
    var result = BattleSystem.applyMove(action.attacker, action.defender, action.move, this.waveType);
    if (action.attacker === this.player) this.runStats.damage += result.damage;
    result.messages.forEach(this.pushLog, this);
    this.updateHpBar(action.bar, action.defender);
    if (before > action.defender.currentHp) this.hitEffect(action.sprite);
    if (action.defender.isBoss) this.checkBossShield(action.defender, before);
    this.time.delayedCall(650, function () {
      try {
        this.resolveAction(order, index + 1);
      } catch (error) {
        console.error(error);
        this.pushLog('Der Zug wurde abgebrochen. Du kannst weiterkaempfen.');
        this.turnLocked = false;
        this.setMoveButtonsEnabled(true);
      }
    }, [], this);
  }

  hitEffect(sprite) {
    sprite.bodyRect.fillColor = 0xffffff;
    this.tweens.add({ targets: sprite, x: sprite.x + 10, yoyo: true, repeat: 3, duration: 45 });
    this.time.delayedCall(180, function () {
      var fighter = sprite === this.enemySprite ? this.enemy : this.player;
      sprite.bodyRect.fillColor = Phaser.Display.Color.HexStringToColor(fighter.color).color;
    }, [], this);
  }

  checkBossShield(boss, beforeHp) {
    var segment = boss.stats.hp / boss.shieldCount;
    var beforeBroken = Math.floor((boss.stats.hp - beforeHp) / segment);
    var nowBroken = Math.floor((boss.stats.hp - boss.currentHp) / segment);
    if (nowBroken > beforeBroken && boss.currentHp > 0) {
      boss.brokenShields += 1;
      var stats = ['atk', 'def', 'spd', 'spatk'];
      var stat = Phaser.Utils.Array.GetRandom(stats);
      boss.stages[stat] = Math.min(6, boss.stages[stat] + 1);
      boss.currentHp = Math.min(boss.stats.hp, boss.currentHp + Math.floor(boss.stats.hp * 0.08));
      this.pushLog('SCHILD GEBROCHEN!');
      this.addFloatingText(640, 205, 'SCHILD GEBROCHEN!', '#ff3b3b');
      this.cameras.main.flash(160, 255, 0, 0);
    }
  }

  addFloatingText(x, y, text, color) {
    var label = this.add.text(x, y, text, { fontSize: '24px', fontStyle: 'bold', color: color }).setOrigin(0.5);
    this.tweens.add({ targets: label, y: y - 40, alpha: 0, duration: 900, onComplete: function () { label.destroy(); } });
  }

  checkEndOrUnlock() {
    if (this.enemy.currentHp <= 0) {
      this.pushLog(this.enemy.name + ' besiegt!');
      this.time.delayedCall(700, this.handleVictory, [], this);
      return;
    }
    if (this.player.currentHp <= 0) {
      this.endRun(false);
      return;
    }
    this.turnLocked = false;
    this.setMoveButtonsEnabled(true);
  }

  setMoveButtonsEnabled(enabled) {
    if (!this.moveButtons) return;
    this.moveButtons.forEach(function (button) {
      if (enabled && button.move.currentPp > 0) {
        button.rect.setInteractive({ useHandCursor: true });
        button.rect.setAlpha(1);
      } else {
        button.rect.disableInteractive();
        button.rect.setAlpha(button.move.currentPp > 0 ? 0.78 : 0.45);
      }
    });
  }

  handleVictory() {
    var reward = this.waveType === 'boss' ? 250 : this.waveType === 'trainer' ? 120 : 70;
    this.runStats.score += reward + Math.floor(this.player.currentHp);
    this.runStats.money += Math.floor(reward / 5);
    this.player.level += 1;
    if (this.player.passive === 'Groesster Vorteil') this.player.stats.spd += 1;
    var boss = this.waveType === 'boss';
    if (boss) this.player.currentHp = this.player.stats.hp;
    this.scene.start('ItemScene', {
      player: this.player,
      waveManager: this.waveManager,
      runStats: this.runStats,
      bossReward: boss
    });
  }

  endRun(won) {
    this.runStats.wave = this.waveManager.currentWave;
    this.runStats.time = Math.floor((Date.now() - this.runStats.startTime) / 1000);
    this.runStats.won = won;
    SaveSystem.recordRun(this.runStats);
    this.scene.start('GameOverScene', { runStats: this.runStats, player: this.player });
  }
}
