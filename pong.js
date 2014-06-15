//old handler
//window.addEventListener('load',init,false);


/*Player Position class instanced*/
var PlayerPosition = new function() {
    this.LEFT = 1;
	this.RIGHT = -1;
}

/*Players Score class instanced*/
var Score = new function() {
    this.playerLeft = 0;
	this.playerRight = 0;
}

var Random = new function() {
	
	this.seed = 10;
	
	this.value = function(seed) {
	    if (seed != null) {
			this.seed = seed;
		}
        return parseInt(Math.random() * this.seed);
    }
	
	this.polarityRandom = function() {
        var p = Math.random() * 2;
        if (p > 1) {
            return 1;
        }
        return -1;
    }
}
 
/**
 * Initialize the Game and start it.
 */ 
var game = new Game();
window.init();

/*Window init function*/
function init(){
   if (game.init()) {
		game.start();
    }
}

/*Game class*/
function Game() {

    this.init = function() {

        this.canvas = document.getElementById('pongCourt');

        if (this.canvas.getContext) {
			this.canvas.style.background = '#000';
			this.context = this.canvas.getContext('2d');
		    
			Player.prototype.context = this.context;
		    Player.prototype.canvasWidth = this.canvas.width;
			Player.prototype.canvasHeight = this.canvas.height;
			
			Ball.prototype.context = this.context;
			Ball.prototype.canvasWidth = this.canvas.width;
			Ball.prototype.canvasHeight = this.canvas.height;
			
			this.pongBall = new Ball(680, 200, 10);
			this.player1 = new Player(20, 200, 10, 80, PlayerPosition.LEFT, this.pongBall);
			this.player2 = new Player(770, 200, 10, 80, PlayerPosition.RIGHT, this.pongBall);
			
			return true;
        }
		return false;
	}
	
	this.start = function() {
		this.paint();
		this.pongBall.draw();
		this.player1.draw();
		this.player2.draw();
        //call the callback-able function :)
		animate();
	}

    this.paint = function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.fillText('Player 1 - Score: ' + Score.playerLeft.toString(), 200, 10);
        this.context.fillText('Player 2 - Score: ' + Score.playerRight.toString(), 500, 10);
    }
}

/*Player class*/
function Player(x, y, width, height, position, pongball) {

    Drawable.call(this, x, y, width, height);
	this.PLAYERESTEP = 10;
	this.position = position;
	this.pongBall = pongball;

 	this.draw = function() {
		this.context.fillStyle = '#fff';
        this.context.fillRect(this.x, this.y, this.width, this.height);
	};
	
	this.move = function () {
	    if (KEY_STATUS.upPlay || KEY_STATUS.downPlay || KEY_STATUS.down || KEY_STATUS.up) {
		    // The ship moved, so erase it's current image so it can
			// be redrawn in it's new location
			this.context.clearRect(this.x, this.y, this.width, this.height);
			
		    // Change Direction
			if (position == PlayerPosition.LEFT) {
			    if (KEY_STATUS.upPlay) {
					this.y -= this.PLAYERESTEP;
				}
				if (KEY_STATUS.downPlay) {
					this.y += this.PLAYERESTEP;
				}
			} else {
				if (KEY_STATUS.up) {
					this.y -= this.PLAYERESTEP;
				}
				if (KEY_STATUS.down) {
					this.y += this.PLAYERESTEP;
				}
			}
			//restricted movement for players
			if (this.y + 80 >= this.canvasHeight) {
			    this.y = this.canvasHeight - 80;
		    }
			if (this.y <= 0) {
				this.y = 0;
			}
		}

		if (this.pongBall.intersects(this)) {
		    this.pongBall.dezX = this.position * Random.value();
		    this.pongBall.x += this.pongBall.dezX;
		}
	    
	}
}
Player.prototype = new Drawable();

/*Ball class*/
function Ball(x, y, width) {

    Drawable.call(this, x, y, width, width);
	
	this.draw = function() {
		this.context.fillStyle = '#fff';
        this.context.fillRect(this.x, this.y, this.width, this.height);
	};
	  
	this.move = function() {
		
	  this.x += this.dezX;
	  this.y += this.dezY;
	  
	  if (this.x + this.width >= this.canvasWidth) {
		 this.dezX = PlayerPosition.RIGHT * Random.value();
		 Score.playerRight--;
	  }
	  if (this.y + this.width >= this.canvasHeight ) {
		 this.dezY = PlayerPosition.RIGHT * Random.value();
      }
	  if (this.x <= 0) {
		 this.dezX = PlayerPosition.LEFT * Random.value();
		 Score.playerLeft--;
	  }
	  if (this.y <= 0) {
		 this.dezY = PlayerPosition.LEFT * Random.value();
      }
	}

	this.intersects = function(player) {
		if (player.position == PlayerPosition.LEFT) {
		    if (player.x + player.width >= this.x &&
		        player.y < this.y + this.height &&
		        player.y + player.height > this.y) {
			        Score.playerLeft++;
				    return true;
			}
		} else if (player.position == PlayerPosition.RIGHT){
		    if (player.x <= this.x + this.width &&
				player.y < this.y + this.height &&
				player.y + player.height > this.y) {
					Score.playerRight++;
					return true;
			}
		}
		return false; 
	}
	
	this.dezX = PlayerPosition.LEFT * Random.value();
	this.dezY = PlayerPosition.RIGHT * Random.value();
}
Ball.prototype = new Drawable();

/*also known as run()*/
function animate() {
    requestAnimFrame( animate );
    game.paint();
	game.player1.move();//Check intersect
	game.player2.move();//Check intersect
	game.pongBall.move();
	game.pongBall.draw();
	game.player1.draw();
	game.player2.draw();
}
