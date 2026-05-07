class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  create() {
    var isMobile = this.scale.height > this.scale.width;
    var width = isMobile ? 720 : 1280;
    var height = isMobile ? 1280 : 720;
    var centerX = width / 2;
    this.cameras.main.setBackgroundColor('#5fb7ff');
    this.stars = [];
    for (var i = 0; i < (isMobile ? 190 : 140); i += 1) {
      var size = Phaser.Math.Between(1, 3);
      var star = this.add.rectangle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        size,
        size,
        0xffffff,
        Phaser.Math.FloatBetween(0.35, 1)
      );
      star.speed = Phaser.Math.FloatBetween(0.12, 0.65);
      this.stars.push(star);
    }

    this.add.rectangle(centerX, height / 2, width, height, 0x8ed8ff, 0.38);
    this.add.circle(isMobile ? 112 : 190, isMobile ? 150 : 126, isMobile ? 54 : 68, 0xffffff, 0.28);
    this.add.circle(isMobile ? 620 : 1100, isMobile ? 946 : 540, isMobile ? 76 : 92, 0xffcf33, 0.22);
    this.add.ellipse(centerX, height - 50, isMobile ? 900 : 1500, isMobile ? 230 : 210, 0x62b64a, 1);
    this.add.ellipse(centerX, height - 88, isMobile ? 720 : 1180, isMobile ? 132 : 120, 0xb6df68, 1);

    var titleStyle = {
      fontFamily: '"Cinzel Decorative", Georgia, serif',
      fontSize: isMobile ? '54px' : '58px',
      fontStyle: 'bold',
      color: '#fff6cf',
      stroke: '#2454a6',
      strokeThickness: 7,
      shadow: { offsetX: 0, offsetY: 4, color: '#05050a', blur: 0, fill: true }
    };
    this.title = this.add.text(centerX, isMobile ? 398 : 230, 'FamilyRogue', titleStyle).setOrigin(0.5);
    this.subtitle = this.add.text(centerX, isMobile ? 470 : 292, 'Endless Family Battle', {
      fontSize: isMobile ? '24px' : '21px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#2454a6',
      strokeThickness: 4
    }).setOrigin(0.5);

    this.press = this.add.text(centerX, isMobile ? 690 : 448, isMobile ? 'TAP TO START' : 'CLICK OR PRESS ENTER', {
      fontSize: isMobile ? '23px' : '19px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#2454a6',
      strokeThickness: 5
    }).setOrigin(0.5);

    this.add.text(centerX, isMobile ? 1120 : 610, 'Programmatic Phaser roguelite | no spritesheets', {
      fontSize: isMobile ? '14px' : '13px',
      color: '#2454a6'
    }).setOrigin(0.5);

    this.tweens.add({ targets: this.title, y: this.title.y - 12, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: this.press, alpha: 0.2, duration: 720, yoyo: true, repeat: -1 });
    this.input.once('pointerdown', this.startMenu, this);
    this.input.keyboard.once('keydown-ENTER', this.startMenu, this);
  }

  update() {
    var width = this.scale.height > this.scale.width ? 720 : 1280;
    var height = this.scale.height > this.scale.width ? 1280 : 720;
    this.stars.forEach(function (star) {
      star.y += star.speed;
      if (star.y > height + 4) {
        star.y = -4;
        star.x = Phaser.Math.Between(0, width);
      }
    });
  }

  startMenu() {
    this.scene.start('MenuScene');
  }
}
