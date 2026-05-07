function getGameSize() {
  var mobilePortrait = window.innerWidth <= 900 && window.innerHeight > window.innerWidth;
  return mobilePortrait ? { width: 720, height: 1280 } : { width: 1280, height: 720 };
}

var gameSize = getGameSize();

const config = {
  type: Phaser.AUTO,
  width: gameSize.width,
  height: gameSize.height,
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

window.addEventListener('orientationchange', function () {
  window.setTimeout(function () {
    window.location.reload();
  }, 250);
});
