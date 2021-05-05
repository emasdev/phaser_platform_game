import Phaser from "phaser";

const gameOptions = {
  platformStartSpeed: 350,
  spawnRange: [100, 250],
  platformSizeRange: [80, 250],
  playerGravity: 900,
  jumpForce: 400,
  playerStartPosition: 200,
  jumps: 3,
};

let credString =
  "The good life is one inspired by love and guided by knowledge";
credString += "\ntip: you can jump 3 times after touching land";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create() {
    const { anims, physics, add } = this;

    add.image(400, 300, "background");
    this.score = 0;

    // Creating animations
    anims.create({
      key: "run",
      frames: anims.generateFrameNumbers("player", { start: 1, end: 4 }),
      frameRate: 10,
      repeat: -1,
    });

    anims.create({
      key: "jump",
      frames: [{ key: "player", frame: 0 }],
      frameRate: 20,
    });

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

    this.coinGroup = add.group({
      // once a coin is removed, it's added to the pool
      removeCallback(coin) {
        coin.scene.coinPool.add(coin);
      },
    });

    this.coinPool = add.group({
      // once a coin is removed from the pool, it's added to the active coins group
      removeCallback(coin) {
        coin.scene.coinGroup.add(coin);
      },
    });

    // number of consecutive jumps made by the player
    this.playerJumps = 0;

    // adding a platform to the game, the arguments are platform width and x position
    this.addPlatform(800, 800 / 2);

    // adding the player;
    this.player = physics.add.sprite(
      gameOptions.playerStartPosition,
      600 / 2,
      "player"
    );
    this.player.setGravityY(gameOptions.playerGravity);

    // add poem with triforce
    this.triforce = 0;
    this.poem = [
      "Windows of my room,",
      "The room of one of the world's millions nobody knows about",
      "(And if they knew about me, what would they know?)",
      "You open onto the mystery of a street continually crossed by people,",
      "A street inaccessible to any thought,",
      "Real, impossibly real, certain, unknowingly certain,",
      "With the mystery of things beneath the stones and beings,",
      "With death making the walls damp and the hair of men white,",
      "With Destiny driving the wagon of everything down the road of nothing.",
      "",
      "Today I am defeated, as if I knew the truth.",
      "Today I am clear-minded, as if I were about to die",
      "And had no greater kinship with things",
      "Than to say goodbye, this building and this side of the street becoming",
      "A row of train cars, departing at the sound of a whistle",
      "Blowing from inside my head,",
      "And a jolt to my nerves and a creak of bones as we go.",
      "",
      "Today I am bewildered, as one who wondered and discovered and forgot.",
      "Today I am torn between the loyalty I owe",
      "To the outward reality of the Tobacco Shop across the street",
      "And to the inward reality of my feeling that everything is but a dream.",
      "",
      "I failed in everything.",
      "Since I had no aims, maybe everything was indeed nothing.",
      "What I was taught,",
      "I climbed out of that, down from the window at the back of the house.",
      "I went to the countryside with grand plans,",
      "But all I found there was grass and trees,",
      "And when there were people, they were just like the others.",
      "I step back from the window and sit in a chair. What should I think about now?",
      "",
      "What do I know of what I shall be, I who do not know what I am?",
      "Be what I think I am? But I think of so many things!",
      "And there are so many who think to be the same thing- there can’t be that many!",
      "Genius? At this moment",
      "A hundred thousand minds dream themselves geniuses like I do,",
      "And history will not register, who knows? not even one,",
      "Nor will it remain but manure from so many future conquests.",
      "",
      "No, I do not believe in myself.",
      "In every mental asylum there are mad deranged people with so many certainties!",
      "I, who do not have any certainties, am more or less right?",
      "No, not even in myself…",
      "In how many garrets and non-garrets of the world",
      "Are not there geniuses dreaming unto themselves?",
      "How many aspirations high and noble and lucid-",
      "- yes, truly high, noble and lucid-",
      "And, who knows, maybe accomplishable,",
      "Will never see the light of the real sun, nor be heard by human ears?",
      "",
      "The world is for those born to conquer it",
      "And not for those who dream they can conquer it, even though they may be right.",
      "I have dreamt more than Napoleon accomplished;",
      "I have clasped to my hypothetical breast more humanity than Christ;",
      "I contrived philosophies in secret that no Kant ever wrote.",
      "But I am, and maybe I shall always be, the one in the garret,",
      "Even if I don’t live in one;",
      "I shall always be the one who was not born for that;",
      "I shall always be only the one who had (good) qualities;",
      "I shall always be the one who waited for the door to be opened by a doorless wall,",
      "And sang the song of the Infinite in a chicken-house,",
      "And heard the voice of God inside a plugged well.",
      "",
      "Believe in myself? No, not in anything.",
      "May Nature pour over my ardent head",
      "Its sun; its rain, the wind that finds my hair.",
      "And the rest that may come if it comes, or if it has to come, or if it has not.",
      "Cardiac slaves to the stars,",
      "We conquer the world even before we rise from bed;",
      "But we wake up and it is opaque,",
      "We get up and it is alien,",
      "We go out and it is the whole Earth,",
      "Plus the Solar System and the Milky Way and the Indefinite.",
      "",
      "(Eat  chocolates, little girl;",
      "Eat  chocolates! Believe me, there is no metaphysics in the world other than chocolates;",
      "Believe me, all the religions together do not teach more than the candy-shop.",
      "Eat, dirty girl, eat!",
      "I wish I could eat chocolates as earnestly as you!",
      "But I think and, on peeling the silvery paper, which is made from tin foil,",
      "I drop it all to the ground, as I have done with my life.)",
      "",
      "But at least it remains from the sorrow of what I shall never be",
      "The rapid calligraphy of these verses,",
      "Collapsed portico to the Impossible.",
      "But at least I confer upon myself a tearless contempt,",
      "Noble at least in the grand gesture with which",
      "I throw the dirty laundry that is me, in a washing-list, unto the course of things,",
      "And stay home shirtless.",
      "",
      "(You who comfort, who do not exist and therefore comfort,",
      "Either Greek godess, conceived as a living statue,",
      "Or else Roman patrician, impossibly noble and baneful,",
      "Or princess sung by troubadours, most charming and colourful,",
      "Or eighteenth century marquise, décolletée and distant,",
      "Or celebrated courtesan from the time of our parents,",
      "Or modern whatever- I don’t really know what-",
      "All that, whatever you may be, inspire if you can!",
      "",
      "My heart is a bucket that was emptied.",
      "As those who invoke spirits, summon spirits I summon",
      "Myself and find nothing.",
      "I go to the window and see the street with absolute sharpness.",
      "I see the shops, I see the street-walks, I see the passing cars,",
      "I see the clothed living beings who cross each other,",
      "I see the dogs which also exist,",
      "And all this weighs on me as a sentence of exile,",
      "And all this is foreign, as is everything.",
      "",
      "I lived, studied, loved and even believed,",
      "And today, there is no beggar I do not envy simply because he is not me.",
      "I consider in each one the rags and the sores and the lie,",
      "And I muse: maybe you never lived, or studied, or loved, or believed",
      "(because it is possible to construct the reality of it all without actually doing any of that);",
      "Maybe you merely existed, like a lizard to which the tail is cut off",
      "And which is tail a-twisting this side of the lizard.",
      "",
      "I made of myself what I did not know how,",
      "And what I could have made of myself I failed to do.",
      "The domino costume that I wore was all wrong",
      "And I was immediately recognized as someone I was not and I did not deny it, and was lost.",
      "When I tried to take off the mask,",
      "It was stuck to my face.",
      "When I took it off and looked myself in the mirror,",
      "I had already grown old.",
      "I was drunk, and I no longer knew how to put on the costume that I had not taken off.",
      "I threw the mask away and slept in the dressing room",
      "Like a dog tolerated by the management",
      "Because it is harmless.",
      "And I am going to write this story to prove that I am sublime.",
      "",
      "Musical essence of my useless verses,",
      "If only I could face you as something I had made",
      "Instead of always facing the Tobacco Shop across the street,",
      "Treading at my feet the consciousness of existing,",
      "Like a rug a drunkard stumbles on",
      "Or a doormat stolen by gypsies and not worth a thing.",
      "",
      "But the Tobacco Shop owner has come to the door and is standing there.",
      "I look at him with the discomfort of an half-turned head",
      "Compounded by the discomfort of an half-grasping soul.",
      "He shall die and I shall die.",
      "He shall leave his signboard and I shall leave my poems.",
      "His sign will also eventually die, and so will my poems.",
      "Eventually the street where the sign was will die,",
      "And so will the language in which the poems were written.",
      "Then the whirling planet where all of this happened will die.",
      "On other satellites of other systems some semblance of people",
      "Will go on making things like poems and living under things like signs,",
      "Always one thing facing the other,",
      "Always one thing as useless as the other,",
      "Always the impossible as stupid as reality,",
      "Always the mystery of the bottom as true as the shadow of mystery of the top.",
      "Always this thing or always some other, or neither one nor the other.",
      "",
      "But a man has entered the Tobacco Shop (to buy tobacco?),",
      "And plausible reality suddenly hits me.",
      "I half rise to my feet -energetic, sure of myself, human-",
      "And I will try to write these verses in which I say the opposite.",
      "I light up a cigarette as I think about writing them,",
      "And in that cigarette I savor a freedom from all thoughts.",
      "I follow the smoke as if it were my own trail,",
      "And enjoy, for a sensitive and adequate moment",
      "The liberation from all speculation",
      "And the awareness that metaphysics is a consequence of not feeling well.",
      "",
      "Afterwards I lean back in the chair",
      "And keep smoking.",
      "As long as Destiny allows, I will keep smoking.",
      "(If I married my washwoman's daughter",
      "I might conceivably be happy.)",
      "Given this, I rise and go to the window.",
      "The man has come out of the Tobacco Shop (putting change into his pocket?).",
      "Ah, I know him: he is Esteves without methaphysics.",
      "(The Tobacco Shop owner has come to the door.)",
      "As if by a divine instinct, Esteves turned around and saw me.",
      'He waved hello, I shouted back "Hello there, Esteves!" and the universe',
      "Reconstructed itself to me, without ideals or hope, and the owner of the Tobacco Shop smiled...",
    ];
    this.poemText = this.poem[this.triforce];
    this.poemPrint = this.add.text(100, 600 / 3, this.poemText, {
      align: "right",
    });

    // setting collisions between the player and the platform group
    physics.add.collider(this.player, this.platformGroup, () => {
      if (!this.player.anims.isPlaying) {
        this.player.anims.play("run");
      }
    });

    physics.add.overlap(
      this.player,
      this.coinGroup,
      this.collectCoin,
      null,
      this
    );

    // checking for input
    this.input.on("pointerdown", this.jump, this);
    this.input.keyboard.on("keydown-SPACE", this.jump, this);

    // Creating display for Scores
    this.scoreText = add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#FFFFFF",
    });

    this.creditText = add.text(240, 570, credString, {
      fontSize: "15px",
      fill: "#FFFFFF",
    });
  }

  collectCoin(player, coin) {
    this.triforce += 1;
    this.coinGroup.killAndHide(coin);
    this.coinGroup.remove(coin);
    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);
    if (this.triforce <= this.poem.length) {
      if (
        this.poem[this.triforce] == undefined &&
        this.triforce <= this.poem[this.triforce]
      ) {
        this.poemText = this.poemText + "\n";
      } else {
        this.poemText = this.poemText + "\n" + this.poem[this.triforce];
      }
      this.poemPrint.setText(this.poemText);
      this.poemPrint.setY(this.poemPrint.y - 15);
    }
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
    let platform;
    if (this.platformPool.getLength()) {
      platform = this.platformPool.getFirst();
      platform.x = posX;
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
    } else {
      platform = this.physics.add.sprite(posX, 600 * 0.8, "platform");
      platform.setImmovable(true);
      platform.setVelocityX(gameOptions.platformStartSpeed * -1);
      this.platformGroup.add(platform);
    }
    platform.displayWidth = platformWidth;
    this.nextPlatformDistance = Phaser.Math.Between(
      gameOptions.spawnRange[0],
      gameOptions.spawnRange[1]
    );
    const coinAppear = Phaser.Math.Between(0, 10);
    if (coinAppear > 5) {
      this.addCoin(posX);
    }
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
      this.player.anims.play("jump");
      this.player.setVelocityY(gameOptions.jumpForce * -1);
      this.playerJumps += 1;
    }
  }

  update() {
    // game over
    if (this.player.y > 600) {
      this.scene.start("Submit", this.score);
    }
    this.player.x = gameOptions.playerStartPosition;

    // recycling platforms
    let minDistance = 800;
    this.platformGroup.getChildren().forEach(platform => {
      const platformDistance = 800 - platform.x - platform.displayWidth / 2;
      minDistance = Math.min(minDistance, platformDistance);
      if (platform.x < -platform.displayWidth / 2) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    }, this);

    // recycling coins
    this.coinGroup.getChildren().forEach(coin => {
      if (coin.x < -20) {
        this.coinGroup.killAndHide(coin);
        this.coinGroup.remove(coin);
      }
    }, this);

    // adding new platforms
    if (minDistance > this.nextPlatformDistance) {
      const nextPlatformWidth = Phaser.Math.Between(
        gameOptions.platformSizeRange[0],
        gameOptions.platformSizeRange[1]
      );
      this.addPlatform(nextPlatformWidth, 800 + nextPlatformWidth / 2);
    }
  }
}
