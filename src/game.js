
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
  this.load.tilemapTiledJSON("map", "../assets/map/lv_2.json");
  this.load.spritesheet("mario", "../assets/npc/mario_animation.png",{ frameWidth: 16, frameHeight: 16 });
  this.load.audio('music', "../assets/music/super_mario_song.mp3");
  this.load.spritesheet('coin', '../assets/items/coin.png', { frameWidth: 16, frameHeight: 16 });
  this.load.spritesheet('goomba', '../assets/npc/goomba.png', { frameWidth: 16, frameHeight: 16 });

}

function create()
{
  createMap(this);
  createPlayer(this);
  createGoomba(this);

  this.physics.add.collider(player, worldLayer);
  this.physics.add.collider(goombas, worldLayer);
  this.physics.add.overlap(player, goombas, enemyTouch, null, this);
  cursors = this.input.keyboard.createCursorKeys();

  setAnimations(this);
  setCamera(this);
  prepareMusic(this);

}

function playerMovement(that)
{
  if (cursors.left.isDown)
  {
      player.setVelocityX(-160);
      player.anims.play('left', true);
  }
  else if (cursors.right.isDown)
  {
      player.setVelocityX(160);
      player.anims.play('right', true);

  }
  else if (cursors.up.isDown)
  {
    player.setVelocityY(-160);
    player.anims.play('up', true);
  }
  else
  {
    player.setVelocityX(0);
  }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}

function goombasMovement(that)
{

}

function update(time, delta)
{
  playerMovement(this);
  goombasMovement(this);
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
    repeat: 5,
    setXY: { x: 10, y: 0, stepX: 80 }
  });

  goombas.children.iterate(function (child) {
    var distance = Phaser.Math.FloatBetween(-200, 200);

    var tween = that.tweens.add({
      targets: child,
      x: distance,               // '+=100'              // '+=100'
      ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 5000,
      repeat: 1,            // -1: infinity
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
   repeat: 1
  });
}

function enemyTouch(player, goombas)
{
  if (player.body.touching.down) {

    goombas.disableBody(true, true);

  } else {

    player.disableBody(true, true);

  }

}
