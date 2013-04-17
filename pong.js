window.addEventListener('load',init,false);
var canvas=null,ctx=null;
var PLAYERESTEP=10;
var ballWidth=10;
var lastKey1=0;
var lastKey2=0;
var dezX=random(10), dezY=(-1)*random(10);
var player1=new Rectangle(20,200,10,80,001);
var player2=new Rectangle(770,200,10,80,002);
var pongBall=new Rectangle(680,200,ballWidth,ballWidth);

function init(){
 canvas=document.getElementById('canvas');
 canvas.style.background='#000';
 ctx=canvas.getContext('2d');
 run(ctx);
}

function run(){
 setTimeout(run, 1000 / 60);
 game();
 paint(ctx);
}

function game(){
  // Change Direction
  if(lastKey1==87)
   player1.y-=PLAYERESTEP;
  if(lastKey1==83)
   player1.y+=PLAYERESTEP;
  if(lastKey2==38)
   player2.y-=PLAYERESTEP;
  if(lastKey2==40)
   player2.y+=PLAYERESTEP;

  // movement restricted for players
  if(player1.y+80>=canvas.height)
   player1.y=canvas.height-80;
  if(player1.y<=0)
   player1.y=0;

  if(player2.y+80>=canvas.height)
   player2.y=canvas.height-80;
  if(player2.y<=0)
   player2.y=0;

  if(player1.intersects(pongBall)) {
     player1.score++;
     dezX=random(10);
     pongBall.x += dezX;
     return;  
  }
  if(player2.intersects(pongBall)) {
     player2.score++;
     dezX=(-1)*random(10);
     pongBall.x += dezX;
     return;
  }
    
  pongBall.x += dezX;
  pongBall.y += dezY;
  
  if( pongBall.x+ballWidth>=canvas.width){
     dezX=(-1)*random(10);
     player2.score--;
  }
  if(pongBall.y+ballWidth>=canvas.height )
     dezY=(-1)*random(10);
  if( pongBall.x<=0){
     dezX=random(10);
     player1.score--;
  }
  if( pongBall.y<=0)
     dezY=random(10);
  
//  lastKey1=lastKey2=0;
}

function paint(ctx){
 ctx.clearRect(0,0,canvas.width,canvas.height);

 ctx.fillStyle='#fff';
 ctx.fillRect(player1.x,player1.y,player1.width,player1.height);
 ctx.fillStyle='#fff';
 ctx.fillRect(pongBall.x,pongBall.y,pongBall.width,pongBall.height);
 ctx.fillStyle='#fff';
 ctx.fillRect(player2.x,player2.y,player2.width,player2.height);
 ctx.fillText('Player 1 score '+player1.score.toString(),200,10);
 ctx.fillText('Player 2 score '+player2.score.toString(),500,10);
}

function random(max){
 return parseInt(Math.random()*max);
}

function polarityRandom(){
  var p=Math.random()*2;
  if(p>1){ return 1;}
  return -1;
}

 function player1movement(evt){
   lastKey1=evt.keyCode;
 }

 function player2movement(evt){
   lastKey2=evt.keyCode;
 }


document.addEventListener('keydown',player1movement,true);
document.addEventListener('keydown',player2movement,true);


function Rectangle(x,y,width,height,id){
 this.id=id;
 this.score=0;
 this.x=(x==null)?0:x;
 this.y=(y==null)?0:y;
 this.width=(width==null)?0:width;
 this.height=(height==null)?this.width:height;

 this.intersects=function(ball){
   var ping=false;  
   if(ball!=null){
	  if(this.id==1){
		 ping = this.x+this.width  >= ball.x &&
			this.y < ball.y+ball.height &&
		    this.y+this.height > ball.y;
     } else if(this.id==2){
    	 ping = this.x <= ball.x+ball.width &&
			this.y < ball.y+ball.height &&
		    this.y+this.height > ball.y;
     }
   }
   return ping; 
 }

}
