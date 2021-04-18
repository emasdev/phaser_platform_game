import Phaser from "phaser";

const gameOptions = {
  spawnRange: [100, 250],
  platformSizeRange: [80, 250],
  playerGravity: 900,
  playerSpeed: 350,
  jumpForce: 400,
  slideForce: 400,
  playerStartPosition: 200,
  jumps: 12,
  slides: 1,
};

const credString = "Made with ♥ by Mari Roque Developer";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create() {
    const { anims, physics, add } = this;

    add.image(400, 300, "background");
    this.score = 0;
    this.platforms = [];
    // /Platform Group and Pool//

    this.platformGroup = add.group({
      // once a platform is removed, it's added to the pool
      removeCallback(platform) {
        platform.scene.platformPool.add(platform);
      },
    });

    this.platformPool = add.group({
      // once a platform is removed from the pool, it's added to the active platforms group
      removeCallback(platform) {
        platform.scene.platformGroup.add(platform);
      },
    });

    // COIN GROUP AND POOL //
    // number of consecutive jumps made by the player
    this.playerJumps = 0;
    this.playerSlides = 0;

    // adding a platform to the game, the arguments are platform width and x position
    // this.addPlatform(800, 800 / 2);

    // adding the player;
    this.player = physics.add.sprite(
      gameOptions.playerStartPosition,
      600 / 2,
      "player"
    );
    //this.player = physics.add.sprite(gameOptions.playerStartPosition, 600 / 2, 'player');
    this.player.setGravityY(gameOptions.playerGravity);
    this.cameras.main.startFollow(this.player);

    // this.cameras.main.setBounds(0,0, 800, 600);

    // adding plataform
    this.addPlatform(1000, this.player.x);
    this.addPlatform(600, this.player.x + 1000 + 400);

    // setting collisions between the player and the platform group
    physics.add.collider(this.player, this.platforms, () => {
      // if (!this.player.anims.isPlaying) {
      //   this.player.anims.play('run');
      // }
    });

    // physics.add.overlap(this.player, this.coinGroup, this.collectStar, null, this);

    // checking for input
    this.input.on("pointerdown", this.jump, this);
    this.input.keyboard.on("keydown-SPACE", this.slide, this);
    this.input.keyboard.on("keydown-ESC", this.exit, this);

    // Creating display for Scores
    this.scoreText = add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#000",
    });

    this.creditText = add.text(480, 570, credString, {
      fontSize: "15px",
      fill: "#000",
    });
  }

  collectStar(player, coin) {
    this.coinGroup.killAndHide(coin);
    this.coinGroup.remove(coin);
    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  // the core of the script: platform are added from the pool or created on the fly

  addCoin(posX) {
    let coin;
    if (this.coinPool.getLength()) {
      coin = this.coinPool.getFirst();
      coin.x = posX;
      coin.active = true;
      coin.visible = true;
      this.coinPool.remove(coin);
    } else {
      coin = this.physics.add.image(posX, 600 * 0.7, "coin");
      coin.setVelocityX(gameOptions.platformStartSpeed * -1);
      this.coinGroup.add(coin);
    }
  }

  addPlatform(platformWidth, posX) {
    let platform = this.physics.add.sprite(posX, 600 * 0.8, "platform");
    platform.setImmovable(true);
    platform.displayWidth = platformWidth;
    this.platforms.push(platform);
    this.nextPlatformDistance = Phaser.Math.Between(
      gameOptions.spawnRange[0],
      gameOptions.spawnRange[1]
    );
  }

  removePlatform(platform) {
    console.log(platform);
  }

  // the player jumps when on the ground, or once in the air as long as there are jumps
  // left and the first jump was on the ground
  jump() {
    if (
      this.player.body.touching.down ||
      (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps)
    ) {
      if (this.player.body.touching.down) {
        this.playerJumps = 0;
      }
      //this.player.anims.play('jump');
      this.player.setVelocityY(gameOptions.jumpForce * -1);
      this.playerJumps += 1;
    }
  }

  // the player slides when on the ground, or once in the air as long as there are slides
  // left and the first jump was on the ground
  slide() {
    if (
      !this.player.body.touching.down ||
      (this.playerSlides > 0 && this.playerSlides < gameOptions.slides)
    ) {
      if (!this.player.body.touching.down) {
        this.playerSlides = 0;
      }
      //this.player.anims.play('slide');
      this.player.setVelocityX(gameOptions.slideForce * 10);
      this.playerSlides += 1;
    }
  }

  update() {
    // game over
    if (this.player.y > 600) {
      this.exit();
      return;
    }

    this.player.setVelocityX(gameOptions.playerSpeed);

    if (this.platforms.length > 0) {
      const platform = this.platforms[0];
      const distance = platform.x + platform.displayWidth - this.player.x;
      console.log(
        platform.x +
          " : " +
          platform.displayWidth +
          " : " +
          this.player.x +
          " : " +
          distance
      );

      // const distance = platform.x + platform.displayWidth - this.player.x;
      if (this.player.x > distance) {
        console.log("kill platform");
        this.removePlatform(platform);
      }
    }

    // recycling platforms
    // let distance = 800;
    //console.log(this.platformGroup.getChildren().length);
    // this.platformGroup.getChildren().forEach(platform => {
    //   const platformDistance = 800 - this.player.x - platform.displayWidth / 2;
    //   //console.log(platformDistance);
    //   //minDistance = Math.min(minDistance, platformDistance);
    //   distance = platform.x + platform.displayWidth - this.player.x;
    //   console.log(distance);
    //   // console.log("player: " + this.player.x + "platform: " + platform);
    //   if (this.player.x > distance) {
    //     console.log("kill platform");
    //     this.platformGroup.killAndHide(platform);
    //     this.platformGroup.remove(platform);
    //     const nextPlatformWidth = Phaser.Math.Between(
    //       gameOptions.platformSizeRange[0],
    //       gameOptions.platformSizeRange[1]
    //     );
    //     console.log(
    //       "distance:nextPlatform = " +
    //         distance +
    //         ":" +
    //         this.nextPlatformDistance
    //     );
    //     this.addPlatform(
    //       nextPlatformWidth,
    //       this.player.x + this.nextPlatformDistance
    //     );
    //   }
    // }, this);

    // adding new platforms
    //this.cameras.main.centerOn(this.player.x, this.player.y)
  }

  exit() {
    //his.scene.stop();
    this.scene.start("Title");
  }
}
