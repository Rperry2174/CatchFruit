
var tween;
var tween1;
var tween2;
var redFruit;
var goldFruit;
var SpikeFruit;
var fruitsGroup;
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

// Fruits = function (game, image) {
//   Phaser.Group.call(this, game);
//   this.enableBody = true;
//   this.physicsBodyType = Phaser.Physics.ARCADE;
//   this.setAll('checkWorldBounds', true);

//   for (var x = 0; x < 5; x++){
//     if(x === 100){
//       var fruit = new IndividualFruit(game, x*100, 50, 'apple');
//       fruit.goldifyFruit();
//       this.add(fruit);
//       fruit.body.velocity.y = Math.random() * 100;
//     } else {
//       var fruit = new IndividualFruit(game, x*100, 50, 'apple');
//       this.add(fruit);
//       fruit.body.velocity.y = Math.random() * 100;
//     }
//   }

// };

// Fruits.prototype = Object.create(Phaser.Group.prototype);
// Fruits.prototype.constructor = Fruits;

var GameState = {
  preload: function(){
    game.load.image('background', 'assets/forrest_background.png');
    game.load.image('kirby', 'assets/kirby.png');
    game.load.image('redFruit', 'assets/apple.png')
    game.load.image('goldFruit', 'assets/goldApple.png')
    game.load.image('watermellon', 'assets/watermellon.png')
    game.load.image('spikeFruit', 'assets/spikeBall.png')
    game.load.spritesheet('scott', 'assets/scottpilgrim_test864x280.png', 864 / 8 , 280 / 2, 16)
  },

  create:function(){

    //setup game background
    game.background = game.add.sprite(0, 0, 'background');

    //start game physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //set game gravity
    // game.physics.arcade.gravity.y = 100;

    redFruit = new RedFruit(game, 100, 10, 'redFruit');
    goldFruit = new GoldFruit(game, 200, 10, 'goldFruit');
    spikeFruit = new SpikeFruit(game, 300, 10, 'spikeFruit');

    fruitsGroup = game.add.group();
    fruitsGroup.add(redFruit);
    fruitsGroup.add(goldFruit);
    fruitsGroup.add(spikeFruit);

    console.log("fruitsGroup", fruitsGroup);
    fruitsGroup.setAll('body.collideWorldBounds', true);
    //fruitsGroup.setAll('body.bounce.y', 0.2);

  },

  update:function(){

    fruitsGroup.forEach(function(fruit){
        if(fruit.alive){
          if(fruit.body.onFloor()){
          console.log(fruit, " is on floor");
          fruit.kill();
          console.log('after kill', fruitsGroup)
        }
      }
    });

    // var fallPhase = !redFruit.body.onFloor() && !redFruit.hasBounced;
    // var fallPhaseEnd = redFruit.body.onFloor() && !redFruit.hasBounced;
    // var bouncePhase = !redFruit.body.onFloor() && redFruit.hasBounced;
    // var bouncePhaseEnd = redFruit.body.onFloor() && redFruit.hasBounced;

    // if(fallPhase){
    //   console.log("in fall phase");
    // }
    // if(fallPhaseEnd){
    //   console.log("fall phase END ================")
    //   //After the fruit has hit the ground, players can't pick them up
    //   redFruit.hasBounced = true;
    //   redFruit.value = 0;
    // }
    // if(bouncePhase){
    //   console.log("in bounce phase");
    // }

    // if(bouncePhaseEnd){
    //   console.log("bounce phase END ==============");
    //   setTimeout(redFruit.kill(), 1000);
    //   console.log(fruitsGroup);
    // }

    if (game.time.now > fallingTimer){
      // console.log("game.time.now", game.time.now);
      // console.log("fallingTimer", fallingTimer)
      fruitFalls();
      reviveFruit();

      fallingTimer += 2000;
    }
  }

};

//create game and initialize game state
var game = new Phaser.Game(600, 400, Phaser.CANVAS);
game.state.add('GameState', GameState);
game.state.start('GameState');


function fruitFalls(){

  fruit = fruitsGroup.getRandom();
  fruit.wiggleFruit();
  fruit.body.gravity.y = game.rnd.integerInRange(50, 200);
  console.log("fruitsGroup in falling", fruitsGroup);

}

function reviveFruit() {
  //  Get a dead item
  var fruit = fruitsGroup.getFirstDead();
  if (fruit){
    fruit.reset(game.world.randomX, 10);
    fruit.body.gravity.y = 0;
    fruit.angle = 0;
  }
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



