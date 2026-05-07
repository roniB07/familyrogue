const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  backgroundColor: '#11131b',
  scene: [BootScene, MenuScene, BattleScene, ItemScene, GameOverScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

window.addEventListener('load', function () {
  window.familyRogueGame = new Phaser.Game(config);
});
