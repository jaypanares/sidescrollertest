Template.body.onRendered(() => {
  let loader = new PIXI.loaders.Loader();
  let loadingText = new PIXI.Text('Loading game...', {fill: 0x19f9fc});

  Game.createRenderer(960, 540, 0x000);
  Game.createStage();

  $(document.body).append(Game.renderer.view);

  loadingText.anchor.x = 0.5;
  loadingText.anchor.y = 0.5;
  loadingText.position.x = Game.renderer.width / 2;
  loadingText.position.y = Game.renderer.height / 2;

  Game.addChild(loadingText);

  loader
  .add('splash', 'images/splash-resized.jpg')
  .add('logo', 'images/logo.png')
  .add('stars', 'images/stars-tile.jpg')
  .add('starfield', 'images/starfield-tile.png')
  .add('deathstar', 'images/deathstar-tile.png')
  .add('tieFighter', 'images/tie-fighter-small.png')
  .add('xWing', 'images/xwing-small.png')
  .add('explode', 'images/explode-small.png')
  .add('button', 'images/buttonBg.png');

  loader.once('complete', onAssetsLoaded);

  loader.load();

  function onAssetsLoaded() {
    Game.removeChildren();
    Game.addChild(createSplashScreen());
  }

  //
  // function initializeShip() {
  //   ship.anchor.x = 0.5;
  //   ship.anchor.y = 0.5;
  //
  //   ship.position.x = renderer.width / 4;
  //   ship.position.y = renderer.height / 2;
  // }
});
