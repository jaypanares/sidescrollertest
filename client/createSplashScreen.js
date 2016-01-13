createSplashScreen = () => {
  let texture = PIXI.Texture.fromImage('images/splash-resized.jpg');
  let bitmap = new PIXI.Sprite(texture);

  let container = new PIXI.Container();
  container.addChild(bitmap);

  bitmap.anchor.y = 0.5;
  bitmap.position.y = Game.renderer.height / 2;

  Meteor.setTimeout(() => {
    requestAnimationFrame(exitSplashScreen);
  }, 2000);

  return container;

  function exitSplashScreen() {
    if (container.alpha > 0) {
      container.alpha -= 0.02;
      requestAnimationFrame(exitSplashScreen);
    }else {
      Game.removeChildren();
      Game.addChild(createMainMenu());
    }

    Game.renderStage();
  }
};
