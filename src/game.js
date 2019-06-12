
var cursors;
var player;
var speed = 175;
var layer;
let map;
let music;
let tileset;
let worldLayer;
let goombas;
let coins;
var isDead = false;

const config = {
  type: Phaser.AUTO, // Which renderer to use
  width: 400, // Canvas width in pixels
  height: 300, // Canvas height in pixels
  parent: "game-container", // ID of the DOM element to add the canvas to
  backgroundColor: "#728BF8",
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },// Top down game, so no gravity
    }
  }
};

const game = new Phaser.Game(config);

function preload()
{
  this.load.image("tiles", "../assets/map/tileset.png");
  this.load.tilemapTiledJSON("map", "../assets/map/lv_4.json");
  this.load.spritesheet("mario", "../assets/npc/mario_animation.png",{ frameWidth: 16, frameHeight: 16 });
  this.load.audio('music', "../assets/music/super_mario_song.mp3");
  this.load.audio('fail_sound',"../assets/music/mario_dead.mp3")
  this.load.spritesheet('coin', '../assets/items/coin.png', { frameWidth: 16, frameHeight: 16 });
  this.load.spritesheet('goomba', '../assets/npc/goomba.png', { frameWidth: 16, frameHeight: 16 });


}

function create()
{
  setAnimations(this);
  createMap(this);
  createPlayer(this);
  createGoomba(this);
  createCoins(this);

  this.physics.add.collider(player, worldLayer);
  this.physics.add.collider(goombas, worldLayer);
  this.physics.add.collider(coins, worldLayer);
  this.physics.add.overlap(player, goombas, enemyTouch, null, this);
  this.physics.add.overlap(player, coins, coinTouch, null, this);

  cursors = this.input.keyboard.createCursorKeys();


  setCamera(this);
  prepareMusic(this);

}

function playerMovement(that)
{
  if (cursors.left.isDown)
  {
      player.setVelocityX(-160);
      player.anims.play('left', true);
      console.log("left")
  }
  else if (cursors.right.isDown)
  {
      player.setVelocityX(160);
      player.anims.play('right', true);
      console.log("right")

  }
  else if (cursors.up.isDown )
  {
    player.setVelocityY(-160);
    player.anims.play('up', true);
    console.log("up")
  }
  else
  {
    player.setVelocityX(0);
  }
}

function createCoins(that)
{
    coins = that.physics.add.group({
      key: 'coin',
      repeat: 10,
      setXY: { x: 300, y: 0, stepX: 50 }
    });
    coins.playAnimation('coin_movement');
}

function update(time, delta)
{
  playerMovement(this);
}

function createMap(that)
{
  map = that.make.tilemap({ key: "map" });
  tileset = map.addTilesetImage("tileset", "tiles");
  worldLayer = map.createStaticLayer("World", tileset, 0, 0);
  worldLayer.setCollisionByProperty({ collidates: true });
}

function createPlayer(that)
{
  player = that.physics.add.sprite(100, 50, "mario");
  player.setBounce(0.2);
}

function createGoomba(that)
{
  goombas = that.physics.add.group({
    key: 'goomba',
    repeat: 15,
    setXY: { x: 300, y: 50, stepX: 100, stepY: 30 }
  });
  goombas.playAnimation('goomba_movement');

  goombas.children.iterate(function (child) {
    var distance_x = Phaser.Math.FloatBetween(-100, 100);

    var tween = that.tweens.add({
      targets: child,
      x: -200,
      ease: 'Linear',
      duration: 30000,
      repeat: 10,
      yoyo: true
    });

  });

}


function setCamera(that)
{
    camera = that.cameras.main;
    camera.setZoom(1);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.startFollow(player);
}

function prepareMusic(that)
{
    musicOn = true;
    music = that.sound.add('music');
    music.setLoop(true);
    music.play();
}

function setAnimations(that)
{
    that.anims.create({
     key: 'right',
     frames: that.anims.generateFrameNumbers('mario', { start: 0, end: 3 }),
     frameRate: 8,
     repeat: 1
   });

   that.anims.create({
    key: 'left',
    frames: that.anims.generateFrameNumbers('mario', { start: 7, end: 10 }),
    frameRate: 8,
    repeat: 1
  });

  that.anims.create({
   key: 'up',
   frames: that.anims.generateFrameNumbers('mario', { start: 5, end: 5 }),
   frameRate: 8,
   repeat: 1
  });

  that.anims.create({
   key: 'goomba_movement',
   frames: that.anims.generateFrameNumbers('goomba', { start: 0, end: 1 }),
   frameRate: 8,
   repeat: -1
  });

  that.anims.create({
   key: 'coin_movement',
   frames: that.anims.generateFrameNumbers('coin', { start: 0, end: 2 }),
   frameRate: 8,
   repeat: -1
  });
}

function coinTouch(player, coins)
{
  coins.disableBody(true, true);
}

function disableGoombaBody(goombas)
{
  goombas.disableBody(true, true);
}

function disablePlayerBody(player)
{
  player.disableBody(true, true);
}

function enemyTouch(player, goombas)
{
  if (player.body.touching.down) {

    console.log("killed")
    goombas.setFrame(2);
    var timer = this.time.addEvent({
    delay: 100,                // ms
    callback: disableGoombaBody,
    args: [goombas],
    loop: true
    });

  } else {
    console.log("dead")
    player.setFrame(6);

    if(!isDead)
    {
      isDead = true;
      music.stop();
      var deadMusic = this.sound.add('fail_sound');
      deadMusic.play();
      player.setVelocityY(-200);
    }

    var timer = this.time.addEvent({
    delay: 300,
    callback: disablePlayerBody,
    args: [player],
    loop: true
    });

  }

}
