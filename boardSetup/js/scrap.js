
class Fruit extends Phaser.Sprite {
  constructor (name, speed, value) {
   // super(this, 'any properties toset on phaser') //phaser.call(this, x, y, z )
   this.name = name
   this.speed = speed;
   this.value = value
   //add
  }
}



class RedFruit extends Fruit {
  constructor(name, val){
    super(this, name, 0.5, 1)

  }
}

// this.effect =

class GreenFruit extends Fruit {
  constructor(name){
    super(this, name, 0.5)

  }
}

}

var redfruit = new RedFruit(fruit1, 0.5, 0.8)
redfruit.effect('');