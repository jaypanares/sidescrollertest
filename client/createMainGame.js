createMainGame = () => {
  let gameOver = false; // Game over status

  let intervalId; // ID for setInterval function

  // Create distant layer
  let starLayer = PIXI.Texture.fromImage('images/starfield-tile.png');
  let deathstarLayer = PIXI.Texture.fromImage('images/deathstar-tile.png');
  let tfTexture = PIXI.Texture.fromImage('images/tie-fighter-small.png');
  let xwTexture = PIXI.Texture.fromImage('images/xwing-small.png');
  let lasers = [];

  let tilingStars = new PIXI.extras.TilingSprite(
                    starLayer,
                    Game.renderer.width,
                    Game.renderer.height);

  let tilingDeathstar = new PIXI.extras.TilingSprite(
                    deathstarLayer,
                    Game.renderer.width,
                    Game.renderer.height);

  let xwing = new PIXI.Sprite(xwTexture);

  let fighterPool = new Array(10); // Pending pool of fighters
  let deployed = []; // Fighters deployed on-screen

  let explodeArr = []; // Explosions on-screen

  // Create container and add children
  let container = new PIXI.Container();
  container.addChild(tilingStars);
  container.addChild(tilingDeathstar);
  container.addChild(xwing);

  xwing.anchor.y = 0.5;
  xwing.position.y = Game.renderer.height / 2;
  xwing.position.x = Game.renderer.width / 4;

  keyPressListener();

  createTieFighters();

  // Deploy tie fighters
  intervalId = Meteor.setInterval(deployTieFighters, 2000);

  Game.renderStage();

  requestAnimationFrame(animateMainGame);

  return container;

  function animateMainGame() {
    let farSpeed = 0.3;
    let nearSpeed = 0.6;

    tilingStars.tilePosition.x -= farSpeed;
    tilingDeathstar.tilePosition.x -= nearSpeed;

    // Animate deployed fighters and check for collisions
    animateFighters();
    shipCollisionTest();

    // Animate laser blasts and check for hits
    animateLasers();
    laserHitTest();

    // Animate explosions and check if game over
    animateExplosions();

    Game.renderStage();

    if (!gameOver || explodeArr.length > 0) {
      requestAnimationFrame(animateMainGame);
    }else {
      Meteor.clearInterval(intervalId);
      Game.removeChildren();
      Game.addChild(createMainMenu());
    }
  }

  function animateLasers() {
    lasers.forEach((laser, index) => {
      if (laser.position.x < Game.renderer.width) {
        laser.position.x += 16;
      }else {
        removeLaser(laser, index);
      }
    });
  }

  function laserHitTest() {
    lasers.forEach((laser, laserIndex) => {
      deployed.forEach((fighter, fighterIndex) => {
        if (laser.position.x + laser.width > fighter.position.x + 15 &&
            laser.position.x < fighter.position.x &&
            laser.position.y > fighter.position.y - fighter.height / 2 &&
            laser.position.y < fighter.position.y + fighter.height / 2) {
          explodeShip(fighter);
          resetFighter(fighter, fighterIndex);
          removeLaser(laser, laserIndex);
        }
      });
    });
  }

  function removeLaser(laser, laserIndex) {
    lasers.splice(laserIndex, 1);
    container.removeChild(laser);
  }

  function createTieFighters() {
    for (let i = 0; i < fighterPool.length; i++) {
      let tieFighter = new PIXI.Sprite(tfTexture);
      container.addChild(tieFighter);

      tieFighter.anchor.y = 0.5;
      tieFighter.position.x = Game.renderer.width;
      tieFighter.position.y = i * tieFighter.height;

      fighterPool[i] = tieFighter;
    }
  }

  function deployTieFighters() {
    let deployedFighter = fighterPool.shift();

    deployedFighter.position.y = Math.floor(Math.random() *
      (Game.renderer.height - (deployedFighter.height / 2))) + 1;

    deployed.push(deployedFighter);
  }

  function animateFighters() {
    deployed.forEach((fighter, index) => {
      if (fighter.position.x >= 0 - fighter.width) {
        fighter.position.x -= 8;
      }else {
        resetFighter(fighter, index);
      }
    });
  }

  function resetFighter(fighter, index) {
    fighter.position.x = Game.renderer.width;
    fighterPool.push(deployed.splice(index, 1)[0]);
  }

  function shipCollisionTest() {
    deployed.forEach((fighter, index) => {
      if (fighter.position.x < xwing.position.x + fighter.width &&
              fighter.position.x > xwing.position.x - fighter.width &&
              fighter.position.y - fighter.height / 2 <
              (xwing.position.y + fighter.height / 2) &&
              fighter.position.y + fighter.height / 2 >
              (xwing.position.y - fighter.height / 2)) {
        explodeShip(xwing);
        explodeShip(fighter);

        resetFighter(fighter, index);

        container.removeChild(xwing);
        gameOver = true;
      }
    });
  }

  function explodeShip(ship) {
    let explosionRadius = 40;
    let explodeContainer = new PIXI.ParticleContainer(20, {
      position: true,
      alpha: true,
      scale: true,
    });

    for (let i = 0; i < 20; i++) {
      let explodeSprite = PIXI.Sprite.fromImage('images/explode-small.png');

      explodeSprite.position.x += Math.floor(Math.random() * explosionRadius);
      explodeSprite.position.y += Math.floor(Math.random() * explosionRadius);
      explodeSprite.alpha = Math.floor(Math.random() * 1.2) + 0.6;
      explodeSprite.scale.x = explodeSprite.scale.y =
        Math.floor(Math.random() * 1.3) + 1;

      explodeArr.push(explodeSprite);
      explodeContainer.addChild(explodeSprite);
    }

    explodeContainer.position.x = ship.position.x;
    explodeContainer.position.y = ship.position.y - ship.height / 2;

    container.addChild(explodeContainer);
  }

  function animateExplosions() {
    explodeArr.forEach((sprite, index) => {
      if (sprite.alpha > 0) {
        sprite.alpha -= 0.06;
      }else {
        sprite.parent.removeChild(sprite);
        explodeArr.splice(index, 1);
      }
    });
  }

  function keyPressListener() {
    $(document.body).keydown((event) => {
      let speed = xwing.height / 4;

      switch (event.keyCode) {
      case 38: // Arrow up
        if (xwing.position.y !== xwing.height / 2) {
          xwing.position.y -= speed;
        }
        break;
      case 40: // Arrow down
        if (xwing.position.y !== Game.renderer.height - xwing.height / 2) {
          xwing.position.y += speed;
        }
        break;
      case 32: // Spacebar
        let laserSprite;
        let laserGraphic = new PIXI.Graphics();

        laserGraphic.beginFill(0xFF0000);
        laserGraphic.drawRect(0, 0, 100, 3);

        laserSprite = new PIXI.Sprite(laserGraphic.generateTexture());

        laserSprite.position.x = xwing.position.x + xwing.width;
        laserSprite.position.y = xwing.position.y;

        lasers.push(laserSprite);

        container.addChild(laserSprite);
        break;
      default:
      }
    });
  }
};
