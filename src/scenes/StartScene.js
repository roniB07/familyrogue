class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#5fb7ff');
    this.stars = [];
    for (var i = 0; i < 140; i += 1) {
      var size = Phaser.Math.Between(1, 3);
      var star = this.add.rectangle(
        Phaser.Math.Between(0, 1280),
        Phaser.Math.Between(0, 720),
        size,
        size,
        0xffffff,
        Phaser.Math.FloatBetween(0.35, 1)
      );
      star.speed = Phaser.Math.FloatBetween(0.12, 0.65);
      this.stars.push(star);
    }

    this.add.rectangle(640, 360, 1280, 720, 0x8ed8ff, 0.38);
    this.add.circle(190, 126, 68, 0xffffff, 0.28);
    this.add.circle(1100, 540, 92, 0xffcf33, 0.22);
    this.add.ellipse(640, 670, 1500, 210, 0x62b64a, 1);
    this.add.ellipse(640, 632, 1180, 120, 0xb6df68, 1);

    var titleStyle = {
      fontFamily: '"Cinzel Decorative", Georgia, serif',
      fontSize: '58px',
      fontStyle: 'bold',
      color: '#fff6cf',
      stroke: '#2454a6',
      strokeThickness: 7,
      shadow: { offsetX: 0, offsetY: 4, color: '#05050a', blur: 0, fill: true }
    };
    this.title = this.add.text(640, 230, 'FamilyRogue', titleStyle).setOrigin(0.5);
    this.subtitle = this.add.text(640, 292, 'Endless Family Battle', {
      fontSize: '21px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#2454a6',
      strokeThickness: 4
    }).setOrigin(0.5);

    this.press = this.add.text(640, 448, 'CLICK OR PRESS ENTER', {
      fontSize: '19px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#2454a6',
      strokeThickness: 5
    }).setOrigin(0.5);

    this.add.text(640, 610, 'Programmatic Phaser roguelite | no spritesheets', {
      fontSize: '13px',
      color: '#2454a6'
    }).setOrigin(0.5);

    this.tweens.add({ targets: this.title, y: 218, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: this.press, alpha: 0.2, duration: 720, yoyo: true, repeat: -1 });
    this.input.once('pointerdown', this.startMenu, this);
    this.input.keyboard.once('keydown-ENTER', this.startMenu, this);
  }

  update() {
    this.stars.forEach(function (star) {
      star.y += star.speed;
      if (star.y > 724) {
        star.y = -4;
        star.x = Phaser.Math.Between(0, 1280);
      }
    });
  }

  startMenu() {
    this.scene.start('MenuScene');
  }
}
