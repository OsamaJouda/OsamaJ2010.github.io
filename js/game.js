$(document).ready(function() {
  $('a[href*=#]').bind('click', function(e) {
      e.preventDefault(); // prevent hard jump, the default behavior

      var target = $(this).attr("href"); // Set the target as variable

      // perform animated scrolling by getting top-position of target-element and set it as scroll target
      $('html, body').stop().animate({
          scrollTop: $(target).offset().top
      }, 1000, function() {
          location.hash = target; //attach the hash (#jumptarget) to the pageurl
      });

      return false;
  });
  });

  $(window).scroll(function() {
      var scrollDistance = $(window).scrollTop();
      $('.page-section').each(function(i) {
              if ($(this).position().top <= scrollDistance) {
                      $('.navigation a.active').removeClass('active');
                      $('.navigation a').eq(i).addClass('active');
              }
      });
}).scroll();
////////////////////////////////////////////////////////////////////////////
(function () {
  let requestAnimationFrame = window.requestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();
//------------------------- VARIABLES--------------------------------//
let drawRocket = new DrawRocket();
let drawSky = new DrawSky();
let drawStares = new DrawStares();
let collision = new Collision();

// MAIN

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let width = canvas.clientWidth ;
let height = canvas.clientHeight ;
canvas.width = width;
canvas.height = height;
let counterInterval;
let speedText="1x";
let curSpeed = 1;
let speed = 5;
let goldScore = 0;
let redScore = 0;

//ROCKET

let rocket = new Image();
    rocket.src="./assets/rocket.png";    
let rocketX = 0;
let rocketY = -150;
let rocketW = 40;
let rocketH = 110;
let lives = 3;


// MOVMENTS

let puse = false;
let counter = 5 ;
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
let space = false;
let anim;
let sho;

// AUDIO

let audioo = new Audio("./sound/boomSound.mp3");
let backMusic = new Audio("./sound/BattleTheme.mp3");
let star = new Audio("./sound/star.mp3");
let shootSound = new Audio("./sound/shoot.wav")
let gameOverSound = new Audio("./sound/No_mercy.wav");

audioo.muted = true;
backMusic.muted = true;
star.muted = true;
let time =0;
backMusic.volume = 0.1;

// STARES
let redStar = new Image();
    redStar.src="./assets/redStar.png";
let redX = Math.floor(Math.random() * (+width - 0)) + 0; 
let redY = -70;
let redW = 50;
let redH = 50;
let rStatuse = 1;

let goldStar = new Image();
    goldStar.src="./assets/goldStar.png";
let goldX =Math.floor(Math.random() * (+width - 0)) + 0; 
let goldY = -70;
let goldW = 50;
let goldH = 50;
let gStatuse = 1;

// PLANE

let plane = new Image();
    plane.src="./assets/airplane.png";
let planShield = new Image();
    planShield.src = "./assets/airplaneShield.png";
let x = width / 2  ;
let y = height -100;
let pWidth = 50; //plane image width
let pHeight = 50; //plane image hiegt 
let shield = 1;

// SHOOTS
let shootBulet = new Image();
    shootBulet.src = "./assets/shoot.png";
let shootX = x;
let shootY = y;
let relativeX ;
let relativeY ;


//---------------Tha Main GAME   ---------------------//
//----------------------------------------------------//

// TIMERS

let timer = setInterval(runTimer,1000);
let redTimer = setInterval(drawRed,5000);


draw();
function draw(){ 
  if (!puse){
    drawSky.drawSky();
    drawPlane();
    drawStares.drawGoldStares()    
    drawScore();
    drawLives()
    drawRocket.drawRocket(x, y, pWidth, width, height, speed );
    requestAnimationFrame(draw);
  }
  else{    //GAME OVER
    gameOverSound.play();
    mute();
    ctx.clearRect(0, 0, width, height);
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("GAME OVER", canvas.width/2 - 100, height/2);   
    drawLives();    
    clearInterval(redTimer);
    clearInterval(timer);
    cancelAnimationFrame(anim);
    cancelAnimationFrame(sho);
    
  }
  
  
}
//----------------------- MOVES ---------------------------//
function moves(){
     
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);
  
  if(rightPressed && x < canvas.width-pWidth) {
    x += 7;
  }
  else if(leftPressed && x > 0) {
    x -= 7;
  }
    else if (upPressed && y > 10 ){
      y -= 10;
    }
      else if (downPressed && y < height-50){
        y += 10;
      }
      else if (space && y > 0 ){
       shootX = x;
       shootY = y;
      }
    
   

  function keyDownHandler(e) {
    if(e.key==" " || e.key == "space"){
      space = true;
    }
    else if(e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = true;
    }
      else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
      }
        else if(e.key == "Up" || e.key == "ArrowUp") {
          upPressed = true;
        }
          else if(e.key == "Down" || e.key == "ArrowDown") {
            downPressed = true;
          }
    
  } // keyDown

  function keyUpHandler(e) {
    if(e.key==" " || e.key == "space"){
      space = false;
    }
    else if(e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = false;
    }
      else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
      }
        else if(e.key == "Up" || e.key == "ArrowUp") {
          upPressed = false;
        }
          else if(e.key == "Down" || e.key == "ArrowDown") {
            downPressed = false;
          }
  } // keyUp

  function mouseMoveHandler(e) {
    relativeX = e.clientX - 450;
    relativeY = e.clientY ;
    if(relativeX > 29 && relativeX < canvas.width - 25) {
      x = relativeX - pWidth/2;
    }
    if (relativeY > 50 && relativeY < canvas.height - 10){
      y = relativeY - pHeight ;
    }
  }//MouseMoves

}
//------------------------- DRAW PLANE  --------------------------------//


function drawPlane(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (shield == 1){
  ctx.drawImage(plane, x, y,pWidth ,pHeight);
  }
  else{
    ctx.drawImage(planShield, x, y,pWidth ,pHeight);
  }
  moves();
    
}//draw Plane

//-------------------------------SCORES -------------------------------//

function drawScore() {
   document.getElementById("score").innerHTML = goldScore +" <=> "+ redScore;

}
//--------------------------------- LIVES ------------------------------//
function drawLives() {
  document.getElementById("lives").innerHTML = "Lives : " + lives;
}
//-------------------------- TIMEING AND SPEED ------------------------//

function runTimer(){  
  time = time +1;
  document.getElementById("timer").innerHTML = "Time : " + time;
  let morSpeed = time % 20;
  if (morSpeed == 0 ){
    speed += 5;
    curSpeed += 1;
    speedText = curSpeed + "x";
  }
  document.getElementById("speed").innerHTML = "Speed :"+ speedText;
} // RUN TIMER

//--------------------------SHOOTING-------------------------------//

document.addEventListener("click",  mouseClick, false);// MOUSE CLICK 
function mouseClick(){
  if(!puse){
  shootX = relativeX -25 ;
  shootY =  relativeY ;
  shootSound.play();
  shootSound.currentTime = 0;
  drawShooting();
  }
}

document.body.onkeyup = function(e){       //SPACE BAR 
  if(e.keyCode == 32){
    if(!puse){
    shootSound.play(); 
    shootSound.currentTime = 0;
    drawShooting();
  }
}
    
}
  drawShooting();
  function drawShooting(){     
    ctx.clearRect(shootX,shootY+10, 5, 20);     
    ctx.drawImage(shootBulet,shootX + 36, shootY);  
    ctx.drawImage(shootBulet,shootX +10 , shootY); 
    
    
    Collision.collision(shootX + 8  , shootY , 20 , rocketX , rocketY, rocketW , rocketH ); 
    if (!collision){      
      if (shootY > 0 ){                    
        shootY -=14;
        sho = requestAnimationFrame(drawShooting);       
      }
      else{
        shootY = y;        
        cancelAnimationFrame(sho);          
      }
    }
    else {
      rocketY =0;
      rocketX =Math.floor(Math.random() * (+width - +0)) + +0;
      
    }
  }//DRAW SHOOTING
  


  window.addEventListener('keydown', function(e) {
    if(e.keyCode == 32 && e.target == document.body) {
      e.preventDefault();
    }
  });