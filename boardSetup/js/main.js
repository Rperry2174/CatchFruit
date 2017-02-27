
var cursors;
var apple;
var kirby;
var scott;
var fruits;
//var individualFruit;

var scottScoreText;
var kirbyScoreText;

Player = function(game, x, y, name){
  Phaser.Sprite.call(this, game, x, y, name)
  this.score = 0;
  this.speed = 100;
  this.maxSpeed = 300;

  this.physicsBodyType = Phaser.Physics.ARCADE;
}
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.setSpeed = function(multiplier){
  //needs max speed property
  this.speed *= multiplier;
  this.game.time.events.add(Phaser.Timer.SECOND * 2, function(){
    this.speed /= multiplier;
  }, this);
};

IndividualFruit = function(game, x, y, name){
  Phaser.Sprite.call(this,game,x,y,name);
  // this.isGolden = false;
  this.value = 1;
  this.speedMultiplier = 1;
  this.anchor.setTo(0.5,0);
  this.checkWorldBounds = true;
  this.events.onOutOfBounds.add(fruitOut, this);

  this.effect = function(player){
      player.score += this.value;
  }
}

IndividualFruit.prototype =Object.create(Phaser.Sprite.prototype);
IndividualFruit.prototype.constructor = IndividualFruit;

//maybe make different class of fruit instead of alter one?
IndividualFruit.prototype.goldifyFruit = function(){
  this.value = 5;
  this.speedMultiplier = 5;
  this.loadTexture('goldApple', 0);
  this.effect = function(player){
    player.score += this.value;
    player.setSpeed(this.speedMultiplier)
  }
}

//maybe make different class of fruit instead of alter one?
IndividualFruit.prototype.spikifyFruit = function(){
  this.value = -5;
  this.speedMultiplier = 0.5;
  this.loadTexture('spikeBall', 0);
  this.effect = function(player){
    player.score += this.value;
    player.setSpeed(this.speedMultiplier);
  }
}

Fruits = function (game, image) {
  Phaser.Group.call(this, game);
  this.enableBody = true;
  this.physicsBodyType = Phaser.Physics.ARCADE;
  this.setAll('checkWorldBounds', true);

  for (var x = 0; x < 5; x++){
    if(x === 100){
      var fruit = new IndividualFruit(game, x*100, 50, 'apple');
      fruit.goldifyFruit();
      this.add(fruit);
      fruit.body.velocity.y = Math.random() * 100;
    } else {
      var fruit = new IndividualFruit(game, x*100, 50, 'apple');
      this.add(fruit);
      fruit.body.velocity.y = Math.random() * 100;
    }
  }

};

Fruits.prototype = Object.create(Phaser.Group.prototype);
Fruits.prototype.constructor = Fruits;

var GameState = {
  preload: function(){
    game.load.image('background', 'assets/forrest_background.png');
    game.load.image('kirby', 'assets/kirby.png');
    game.load.image('apple', 'assets/apple.png')
    game.load.image('goldApple', 'assets/goldApple.png')
    game.load.image('watermellon', 'assets/watermellon.png')
    game.load.image('spikeBall', 'assets/spikeBall.png')
    game.load.spritesheet('scott', 'assets/scottpilgrim_test864x280.png', 864 / 8 , 280 / 2, 16)
  },

  create:function(){

    //setup game background
    game.background = game.add.sprite(0, 0, 'background');
    game.physics.arcade.gravity.y = 10;

    //setup score texts
    kirbyScoreText = game.add.text(16, 16, 'Kirby: 0', { fontSize: '14px', fill: '#000' });
    scottScoreText = game.add.text(16, 40, 'Scott: 0', { fontSize: '14px', fill: '#000' });

    //setup player (kirby)
    kirby = new Player(game, game.world.centerX, 350, 'kirby');
    game.add.existing(kirby);
    kirby.anchor.setTo(0.5, 0.5);
    kirby.scale.setTo(0.25, 0.25);
    game.physics.enable(kirby, Phaser.Physics.ARCADE);
    kirby.body.gravity.y = 200;

    //setup player (scott)
    scott = new Player(game, game.world.centerX + 200, 350, 'scott');
    game.add.existing(scott);
    scott.anchor.setTo(0.5,0.5);
    game.physics.enable(scott, Phaser.Physics.ARCADE);
    scott.body.gravity.y = 200;
    //setup walk animations (scott)
    walkright = scott.animations.add('walkright', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
    walkleft = scott.animations.add('walkleft', [8, 9, 10, 11, 12, 13, 14, 15], 8, true);

    //make group and add fruits to it
    fruits = new Fruits(game, 'apple')

    //set up cursor responses (arrow-keys)
    cursors = game.input.keyboard.createCursorKeys();

    //set up cursor responses (w-a-s-d)
    cursors_wasd = game.input.keyboard.addKeys(
      { 'up': Phaser.Keyboard.W,
      'down': Phaser.Keyboard.S,
      'left': Phaser.Keyboard.A,
      'right': Phaser.Keyboard.D } )

    //confine players to world & turn off collision checking up and down
    kirby.body.collideWorldBounds = true;
    kirby.body.checkCollision.up = false;
    kirby.body.checkCollision.down = false;

    scott.body.collideWorldBounds = true;
    scott.body.checkCollision.up = false;
    scott.body.checkCollision.down = false;

  },

  update:function(){
    game.physics.arcade.collide(scott, kirby);

    //collisions for when fruits overlap with players
    game.physics.arcade.overlap(fruits, kirby, fruitCollisionHandler, null, this)
    game.physics.arcade.overlap(fruits, scott, fruitCollisionHandler, null, this)

    kirby.body.checkCollision.right = true;
    kirby.body.checkCollision.left = true;
    scott.body.checkCollision.right = true;
    scott.body.checkCollision.left = true;

    kirby.body.velocity.x = 0;
    scott.body.velocity.x = 0;

    if(cursors.left.isDown){
      kirby.body.velocity.x = -kirby.speed;
    };

    if(cursors.right.isDown){
      kirby.body.velocity.x = kirby.speed;
    };

    if(cursors_wasd.right.isDown){
      scott.animations.play('walkright');
      scott.body.velocity.x = scott.speed;
    }

    if(cursors_wasd.left.isDown){
      scott.animations.play('walkleft');
      scott.body.velocity.x = -scott.speed;
    }

    //use respective 'up' keys to bypass other player in case of stall
    if(cursors.right.isDown && cursors_wasd.left.isDown &&
      cursors.up.isDown || cursors_wasd.up.isDown){
      kirby.body.checkCollision.right = false;
      scott.body.checkCollision.left = false;
    };

    if(cursors.left.isDown && cursors_wasd.right.isDown &&
      cursors.up.isDown || cursors_wasd.up.isDown){
      kirby.body.checkCollision.left = false;
      scott.body.checkCollision.right = false;
    };
  }
};

//create game and initialize game state
var game = new Phaser.Game(600, 400, Phaser.CANVAS);
game.state.add('GameState', GameState);
game.state.start('GameState');

//what to do when a fruit exits screen - inefficient
function fruitOut(fruit){
  fruit.kill();
  fruits.remove(fruit);
  console.log("fruits - 1", fruits);

  var randomX = game.rnd.integerInRange(0, 600);
  var newfruit = new IndividualFruit(game, randomX, 50, 'apple');
  randomNumber = Math.random();
  if(randomNumber > 0.8){
    // newfruit.goldifyFruit();
    newfruit.spikifyFruit();
  } else if(randomNumber > 0.6){
    // newfruit.goldifyFruit();
    newfruit.goldifyFruit();
  }
  fruits.add(newfruit);
  wiggleFruit(newfruit, 100)
  setTimeout(function(fruit){newfruit.body.velocity.y = Math.random() * 100;}, 1000, fruit);
}

//what to do when a fruit collides with player
function fruitCollisionHandler(player, fruit){
  console.log("player in collision", player);
  fruit.effect(player);

  kirbyScoreText.text = 'Kirby: ' + kirby.score;
  scottScoreText.text = 'Scott: ' + scott.score;
  fruitOut(fruit);
}

//what to do when a player collides with a player
function playerCollisionHandler(player1, player2){
  player1.body.velocity.x = 0;
  player1.body.velocity.x = 0;
}

//wiggle fruit before it drops - inefficient
function wiggleFruit(fruit, duration){

  setTimeout(function(fruit){tween = game.add.tween(fruit).to({angle:0}, duration, Phaser.Easing.Linear.None, true);}, duration, fruit)
  setTimeout(function(fruit){tween = game.add.tween(fruit).to({angle:10}, duration, Phaser.Easing.Linear.None, true);}, duration*2, fruit)
  setTimeout(function(fruit){tween = game.add.tween(fruit).to({angle:-10}, duration, Phaser.Easing.Linear.None, true);}, duration*3, fruit)
  setTimeout(function(fruit){tween = game.add.tween(fruit).to({angle:0}, duration, Phaser.Easing.Linear.None, true);}, duration*4, fruit)
  setTimeout(function(fruit){tween = game.add.tween(fruit).to({angle:3}, duration, Phaser.Easing.Linear.None, true);}, duration*5, fruit)
  setTimeout(function(fruit){tween = game.add.tween(fruit).to({angle:-3}, duration, Phaser.Easing.Linear.None, true);}, duration*6, fruit)
  setTimeout(function(fruit){tween = game.add.tween(fruit).to({angle:0}, duration, Phaser.Easing.Linear.None, true);}, duration*7, fruit)
}


