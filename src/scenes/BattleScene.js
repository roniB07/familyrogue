class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
  }

  init(data) {
    this.player = data.player;
    this.waveManager = data.waveManager || new WaveManager(data.wave || 1);
    this.enemy = data.enemy || this.waveManager.getEnemy();
    this.runStats = data.runStats || { damage: 0, startTime: Date.now() };
    this.turnLocked = false;
    this.logs = [];
  }

  create() {
    this.waveType = this.waveManager.getWaveType();
    this.biome = this.waveManager.currentBiome;
    this.cameras.main.setBackgroundColor(this.biome.bgColor);
    this.add.rectangle(400, 300, 800, 600, Phaser.Display.Color.HexStringToColor(this.biome.bgColor).color);
    this.add.text(24, 18, 'Wave ' + this.waveManager.currentWave + ' | ' + this.biome.name + ' | ' + this.waveType.toUpperCase(), { fontSize: '18px', fontStyle: 'bold', color: '#ffffff' });
    this.add.text(560, 18, 'Items: nach Sieg', { fontSize: '15px', color: '#ffd166' });
    this.drawFighters();
    this.drawLog();
    this.drawMoves();
    this.pushLog('Ein ' + this.enemy.name + ' erscheint!');
  }

  drawFighters() {
    this.enemySprite = this.drawCharacter(260, 148, this.enemy);
    this.enemyHpBar = this.drawHpBar(165, 230, this.enemy, true);
    this.add.text(165, 86, this.enemy.name + ' Lv.' + this.enemy.level, { fontSize: '18px', color: '#ffffff' });

    this.playerSprite = this.drawCharacter(260, 392, this.player);
    this.playerHpBar = this.drawHpBar(165, 474, this.player, false);
    this.add.text(165, 330, this.player.name + ' Lv.' + this.player.level, { fontSize: '18px', color: '#ffffff' });
  }

  drawCharacter(x, y, fighter) {
    var group = this.add.container(x, y);
    var body = this.add.rectangle(0, 0, 92, 72, Phaser.Display.Color.HexStringToColor(fighter.color).color).setStrokeStyle(3, 0xffffff);
    var text = this.add.text(0, 0, fighter.initials, { fontSize: '28px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
    group.add([body, text]);
    group.bodyRect = body;
    return group;
  }

  drawHpBar(x, y, fighter, enemy) {
    var bar = {
      x: x,
      y: y,
      width: 210,
      bg: this.add.rectangle(x, y, 210, 16, 0x111111).setOrigin(0),
      fill: this.add.rectangle(x, y, 210, 16, 0x3ad66e).setOrigin(0),
      text: this.add.text(x, y + 22, '', { fontSize: '13px', color: '#ffffff' }),
      lines: []
    };
    if (fighter.isBoss) {
      for (var i = 1; i < fighter.shieldCount; i += 1) {
        bar.lines.push(this.add.rectangle(x + (bar.width / fighter.shieldCount) * i, y - 2, 2, 20, 0xffffff).setOrigin(0.5, 0));
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
    this.add.rectangle(655, 330, 250, 330, 0x151a24).setStrokeStyle(2, 0x3a4255);
    this.add.text(545, 185, 'Moves', { fontSize: '20px', fontStyle: 'bold', color: '#ffffff' });
    this.player.moves.forEach(function (move, index) {
      var y = 230 + index * 72;
      var rect = this.add.rectangle(655, y, 218, 52, move.currentPp > 0 ? 0x273142 : 0x181b22).setInteractive({ useHandCursor: move.currentPp > 0 });
      rect.setStrokeStyle(2, 0x586174);
      var label = this.add.text(555, y - 17, move.name, { fontSize: '14px', color: '#ffffff' });
      var pp = this.add.text(555, y + 4, move.type + ' | PP ' + move.currentPp + '/' + move.pp, { fontSize: '12px', color: '#cbd2e1' });
      rect.on('pointerdown', function () { this.playerChooseMove(move); }, this);
      this.moveButtons.push({ rect: rect, label: label, pp: pp, move: move });
    }, this);
  }

  refreshMoves() {
    this.moveButtons.forEach(function (button) {
      button.pp.setText(button.move.type + ' | PP ' + button.move.currentPp + '/' + button.move.pp);
      button.rect.fillColor = button.move.currentPp > 0 ? 0x273142 : 0x181b22;
    });
  }

  drawLog() {
    this.add.rectangle(235, 540, 410, 78, 0x11151d).setStrokeStyle(2, 0x343c50);
    this.logText = this.add.text(42, 508, '', { fontSize: '14px', color: '#e8edf8', wordWrap: { width: 385 } });
  }

  pushLog(message) {
    this.logs.unshift(message);
    this.logs = this.logs.slice(0, 3);
    if (this.logText) this.logText.setText(this.logs.join('\n'));
  }

  playerChooseMove(move) {
    if (this.turnLocked || move.currentPp <= 0) return;
    this.turnLocked = true;
    var enemyMove = AIController.chooseMove(this.enemy, this.player);
    var playerFirst = BattleSystem.getStat(this.player, 'spd') >= BattleSystem.getStat(this.enemy, 'spd');
    var order = playerFirst ? [
      { attacker: this.player, defender: this.enemy, move: move, sprite: this.enemySprite, bar: this.enemyHpBar },
      { attacker: this.enemy, defender: this.player, move: enemyMove, sprite: this.playerSprite, bar: this.playerHpBar }
    ] : [
      { attacker: this.enemy, defender: this.player, move: enemyMove, sprite: this.playerSprite, bar: this.playerHpBar },
      { attacker: this.player, defender: this.enemy, move: move, sprite: this.enemySprite, bar: this.enemyHpBar }
    ];
    this.resolveAction(order, 0);
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
    this.time.delayedCall(650, function () { this.resolveAction(order, index + 1); }, [], this);
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
      this.addFloatingText(400, 160, 'SCHILD GEBROCHEN!', '#ff3b3b');
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
  }

  handleVictory() {
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
