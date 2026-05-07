const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game',
  backgroundColor: '#11131b',
  scene: [BootScene, StartScene, MenuScene, BattleScene, ItemScene, GameOverScene],
  render: {
    pixelArt: false,
    antialias: true,
    antialiasGL: true,
    roundPixels: false
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

window.addEventListener('load', function () {
  window.familyRogueGame = new Phaser.Game(config);
});
