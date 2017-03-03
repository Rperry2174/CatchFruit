
var tween;
var kirby;
var tween1;
var tween2;
var cursors;
var redFruit;
var goldFruit;
var SpikeFruit;
var fruitsGroup;
var kirbyScoreText;
var fallingTimer = 0;


//Sprite ==> Individual Fruit
IndividualFruit = function(game, x, y, name){
  Phaser.Sprite.call(this,game,x,y,name);
  this.anchor.setTo(0.5,0);
  this.hasBounced = false;

  //when checkWorldBounds is true this.events.onOutOfBounds is enabled
  // this.checkWorldBounds = true;
  // this.events.onOutOfBounds.add(fruitOut, this);

  //adds this existing sprite to gameboard
  game.add.existing(this);

  //makes (currently) GLOBAL gravity effect all fruits
  game.physics.enable(this);
  // var tween = game.add.tween(this).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, false);
  // tween.onComplete.add(function(fruit){
  //           fruit.kill()
  //           fruit.alpha = 100;
  //         });

};

IndividualFruit.prototype = Object.create(Phaser.Sprite.prototype);
IndividualFruit.prototype.constructor = IndividualFruit;

IndividualFruit.prototype.wiggleFruit = function(){
  console.log("this, this", this)
  this.angle = 0;

  game.add.tween(this).to({ angle: 45 },
    200, //duration
    function(k) {return Math.sin(Math.PI * k/5);}, //ease
    true, //autostart
    0, //delay before starting
    true);
}


////////////////////////////////////////////
//Sprite ==> Individual Fruit ==> RedFruit//
////////////////////////////////////////////

RedFruit = function(game, x, y, name){
  IndividualFruit.call(this, game, x, y, name);

  this.value = 1;
  this.speedMultiplier = 1;
  console.log("RedFruit", this)
};

RedFruit.prototype = Object.create(IndividualFruit.prototype);
RedFruit.prototype.constructor = RedFruit;

/////////////////////////////////////////////
//Sprite ==> Individual Fruit ==> GoldFruit//
/////////////////////////////////////////////

GoldFruit = function(game, x, y, name){
  IndividualFruit.call(this, game, x, y, name);

  this.value = 5;
  this.speedMultiplier = 2;
  console.log("GoldFruit", this)

};

GoldFruit.prototype = Object.create(IndividualFruit.prototype);
GoldFruit.prototype.constructor = GoldFruit;

//////////////////////////////////////////////
//Sprite ==> Individual Fruit ==> SpikeFruit//
//////////////////////////////////////////////

SpikeFruit = function(game, x, y, name){
  IndividualFruit.call(this, game, x, y, name);

  this.value = -5;
  this.speedMultiplier = 0.5;
  console.log("SpikeFruit", this)

};

SpikeFruit.prototype = Object.create(IndividualFruit.prototype);
SpikeFruit.prototype.constructor = SpikeFruit;


Player = function(game, x, y, name){
  Phaser.Sprite.call(this, game, x, y, name)

  //player shared properties
  game.add.existing(this);
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.collideWorldBounds = true;
  this.body.gravity.y = 200;
  this.anchor.setTo(0.5, 0.5);

  //Player unique properties
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


Fruits = function (game) {
  Phaser.Group.call(this, game);
  this.enableBody = true;
  this.physicsBodyType = Phaser.Physics.ARCADE;

  for (var x = 0; x < 3; x++){
      var fruit1 = new RedFruit(game, x*100, 10, 'redFruit');
      var fruit2 = new GoldFruit(game, x*150, 10, 'goldFruit');
      var fruit3 = new SpikeFruit(game, x*300, 10, 'spikeFruit');

      this.add(fruit1);
      this.add(fruit2);
      this.add(fruit3);
    }

  this.setAll('checkWorldBounds', true);
  this.setAll('body.collideWorldBounds', true);
  this.setAll('body.bounce.y', 0.2);
};

Fruits.prototype = Object.create(Phaser.Group.prototype);
Fruits.prototype.constructor = Fruits;



var GameState = {
  preload: function(){
    game.load.image('background', 'assets/forrest_background.png');
    game.load.image('kirby', 'assets/kirby.png');
    game.load.image('redFruit', 'assets/apple.png')
    game.load.image('goldFruit', 'assets/goldApple.png')
    game.load.image('watermellon', 'assets/watermellon.png')
    game.load.image('spikeFruit', 'assets/spikeBall.png')
    game.load.spritesheet('scott', 'assets/scottpilgrim_test864x280.png', 864 / 8 , 280 / 2, 16)
    game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
  },

  create:function(){
    //setup game background, physics, and gravity
    game.background = game.add.sprite(0, 0, 'background');
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // game.physics.arcade.gravity.y = 100;


    //setup score texts
    kirbyScoreText = game.add.text(16, 350, 'Kirby: 0', { fontSize: '14px', fill: '#000' });


    kirby = new Player(game, game.world.centerX, 350, 'kirby');
    kirby.scale.setTo(0.25, 0.25);
    console.log('kirby', kirby);

    fruitsGroup = new Fruits(game); //all code below condensed into ^

    // redFruit = new RedFruit(game, 100, 10, 'redFruit');
    // goldFruit = new GoldFruit(game, 200, 10, 'goldFruit');
    // spikeFruit = new SpikeFruit(game, 300, 10, 'spikeFruit');

    // fruitsGroup = game.add.group();
    // fruitsGroup.add(redFruit);
    // fruitsGroup.add(goldFruit);
    // fruitsGroup.add(spikeFruit);
    // fruitsGroup.setAll('body.collideWorldBounds', true);
    // fruitsGroup.setAll('body.bounce.y', 0.2);

    console.log("fruitsGroup", fruitsGroup);

    //set up cursor responses
    cursors = game.input.keyboard.createCursorKeys(); //arrow keys


        //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(3, 'kaboom');
    explosions.forEach(setupFruitExplosion, this);


  },

  update:function(){

    game.physics.arcade.overlap(fruitsGroup, kirby, fruitCatchHandler, fruitNoBounced, this)

    fruitsGroup.forEach(function(fruit){
      if(fruit.alive){
        if(fruit.body.onFloor() && !fruit.hasBounced){
          fruit.hasBounced = true;
        } else if(fruit.body.onFloor() && fruit.hasBounced){
          fruit.kill();
        }
      }
    });

    // var fallPhase = !furit.body.onFloor() && !furit.hasBounced;
    // var fallPhaseEnd = furit.body.onFloor() && !furit.hasBounced;
    // var bouncePhase = !furit.body.onFloor() && furit.hasBounced;
    // var bouncePhaseEnd = furit.body.onFloor() && furit.hasBounced;

    if (game.time.now > fallingTimer){
      // console.log("game.time.now", game.time.now);
      // console.log("fallingTimer", fallingTimer)
      fruitFalls();
      reviveFruit();
      fallingTimer += 2000;
    }

    kirby.body.velocity.x = 0;
    if(cursors.left.isDown){
      kirby.body.velocity.x = -kirby.speed;
    };
    if(cursors.right.isDown){
      kirby.body.velocity.x = kirby.speed;
    };

  }

};

//create game and initialize game state
var game = new Phaser.Game(600, 400, Phaser.CANVAS);
game.state.add('GameState', GameState);
game.state.start('GameState');

function fruitFalls(){
  fruit = fruitsGroup.getRandom();
  //fruit.wiggleFruit();
  fruit.body.gravity.y = game.rnd.integerInRange(50, 200);
  // console.log("fruitsGroup in falling", fruitsGroup);
}

function reviveFruit() {
  //  Get a dead item
  var fruit = fruitsGroup.getFirstDead();
  if (fruit){
    fruit.reset(game.world.randomX, 10);
    fruit.body.gravity.y = 0;
    fruit.angle = 0;
    fruit.hasBounced = false;
  }
}

function fruitCatchHandler(player, fruit){
  console.log("player in collision", player);

  if(fruit.value === -5){
    var explosion = explosions.getFirstExists(false);
    explosion.reset(fruit.body.x, fruit.body.y);
    explosion.play('kaboom', 30, false, true);  console.log("fruit in collision", fruit);
  }

  console.log("fruit.value in collision", fruit.value);
  player.score += fruit.value;
  player.setSpeed(fruit.speedMultiplier);
  kirbyScoreText.text = 'Kirby: ' + kirby.score;
  fruit.kill();
}

function fruitNoBounced(player, fruit){
  return(!fruit.hasBounced);
}

function setupFruitExplosion (fruit) {

    fruit.anchor.x = 0.5;
    fruit.anchor.y = 0.5;
    fruit.animations.add('kaboom');

}

