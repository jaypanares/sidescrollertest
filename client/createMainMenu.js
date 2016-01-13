createMainMenu = () => {
  // Create background
  let texture = PIXI.Texture.fromImage('images/starfield-tile.png');
  let tilingSprite = new PIXI.extras.TilingSprite(
                     texture,
                     Game.renderer.width,
                     Game.renderer.height);

  // Create logo
  let logo = new PIXI.Sprite.fromImage('images/logo.png');

  // Create buttons
  let buttonTextArr = ['Game 1', 'Game 2', 'Game 3', 'Exit'];
  let buttonArr = buttonTextArr.map((text) => {
    let button = new PIXI.Container();
    let buttonText = new PIXI.Text(text);
    let buttonBg = new PIXI.Sprite.fromImage('images/buttonBg.png');

    button.addChild(buttonBg);
    button.addChild(buttonText);

    button.interactive = true;
    button.on('mouseup', menuClickHandler.bind(null, text));

    buttonText.anchor.x = 1;
    buttonText.anchor.y = 1;
    buttonText.position.x = button.width / 2;
    buttonText.position.y = button.height / 2;

    return button;
  });

  // Create button container and add buttons
  let buttonContainer = new PIXI.Container();
  buttonArr.map((button, index) => {
    buttonContainer.addChild(button);
    button.position.y = index * 50;
  });

  // Create main container and add children
  let container = new PIXI.Container();
  container.addChild(tilingSprite);
  container.addChild(logo);
  container.addChild(buttonContainer);

  // Reposition children
  logo.anchor.x = 0.5;
  logo.anchor.y = 0.5;
  logo.position.x = Game.renderer.width / 2;
  logo.position.y = Game.renderer.height / 4;

  buttonContainer.position.x = (Game.renderer.width / 2 -
                                buttonContainer.width / 2);
  buttonContainer.position.y = Game.renderer.height / 2;

  animateBackground(container, tilingSprite);

  return container;
};

function animateBackground(container, tilingSprite) {
  let speed = 0.2;

  tilingSprite.tilePosition.x += speed;
  tilingSprite.tilePosition.y += speed;

  Game.renderStage();

  Game.animId = requestAnimationFrame(
    animateBackground.bind(null, container, tilingSprite)
  );
}

function menuClickHandler(text) {
  cancelAnimationFrame(Game.animId);
  Game.removeChildren();

  switch (text) {
  case 'Exit':
    Game.addChild(createSplashScreen());
    break;
  default:
    Game.addChild(createMainGame());
    break;
  }
}
