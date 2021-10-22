var path,mainCyclist;
var player1,player2,player3;
var pathImg,mainRacerImg1,mainRacerImg2;
var shield, shieldOrb, shieldImg, shieldOrbImg, shieldCount;

var oppPink1Img,oppPink2Img;
var oppYellow1Img,oppYellow2Img;
var oppRed1Img,oppRed2Img;
var gameOverImg,cycleBell;
var crashSound;

var pinkCG, yellowCG,redCG, shieldG; 

var END =0;
var PLAY =1;
var START = 2;
var gameState = START;

var distance=0;
var gameOver, restart;

function preload(){
  pathImg = loadImage("Road.png");
  mainRacerImg1 = loadAnimation("mainPlayer1.png","mainPlayer2.png");
  mainRacerImg2= loadAnimation("mainPlayer3.png");

  shieldImg = loadImage("shield.png");
  shieldOrbImg = loadImage("shieldOrb.png");
  
  oppPink1Img = loadAnimation("opponent1.png","opponent2.png");
  oppPink2Img = loadAnimation("opponent3.png");
  
  oppYellow1Img = loadAnimation("opponent4.png","opponent5.png");
  oppYellow2Img = loadAnimation("opponent6.png");
  
  oppRed1Img = loadAnimation("opponent7.png","opponent8.png");
  oppRed2Img = loadAnimation("opponent9.png");
  
  cycleBell = loadSound("bell.mp3");

  gameOverImg = loadImage("gameOver.png");
  crashSound = loadSound("crash.mp3");

  
}

function setup(){
  
createCanvas(1200,300);
// Moving background
path=createSprite(100,150);
path.addImage(pathImg);
path.velocityX = -5;

//creating boy running
mainCyclist  = createSprite(70,150);
mainCyclist.addAnimation("SahilRunning",mainRacerImg1);
mainCyclist.scale=0.07;
  
//set collider for mainCyclist
mainCyclist.setCollider("rectangle",0,0,1100,1300);

//create shield
shieldOrb = createSprite(200, 200);
shieldOrb.addImage(shieldOrbImg);
shieldOrb.scale = 4.5;
shieldOrb.visible = false;
shieldCount = 0;

  
gameOver = createSprite(550,150);
gameOver.addImage(gameOverImg);
gameOver.scale = 0.8;
gameOver.visible = false;  
  
pinkCG = new Group();
yellowCG = new Group();
redCG = new Group();
shieldG = new Group();
  
}

function draw(){
  background(0);
  
  drawSprites();
  textSize(20);
  fill(255);
  text("Distance: "+ distance,900,30);
  
  //code to reset the background
  if(path.x < 0 ){
    path.x = width/2;
  }

  if(gameState===START){
    textSize(50);
    fill(255);
    text("Welcome to The Cycle Race!",300,100);
    textSize(20);
    text("Dodge the other cyclists or collect shields for protection. Press the up arrow to start racing!", 400, 200, 500, 500);

    if(keyDown("UP_ARROW")){
      gameState=PLAY;
    }
  }
  
  if(gameState===PLAY){
    
  distance = distance + Math.round(getFrameRate()/50);
  path.velocityX = -(6 + 2*distance/150);
  
  mainCyclist.y = World.mouseY;
  
  edges= createEdgeSprites();
  mainCyclist.collide(edges);
  
  
  
  //code to play cycle bell sound
  if(keyDown("space")) {
    cycleBell.play();
  }
  
  //creating continous opponent players

  spawnShield();

  

  var select_oppPlayer = Math.round(random(1,3));
  
  if (World.frameCount % 60 == 0) {
    if (select_oppPlayer == 1) {
      pinkCyclists();
    } else if (select_oppPlayer == 2) {
      yellowCyclists();
    } else {
      redCyclists();
    }
  }
  
  shieldOrb.x = mainCyclist.x;
  shieldOrb.y = mainCyclist.y;

  if(shieldCount > 0){
    if(World.frameCount%30==0){
      shieldCount -= 1;
    }

    fill("white");
    text("Shield duration: " + shieldCount, 900, 60);
  }

  if(shieldCount==0){
    shieldOrb.visible = false;
  }

  if(shieldG.isTouching(mainCyclist)){
     shieldCount = 10;
     shieldOrb.visible = true;
     shieldG.destroyEach();
     
  }

  for(var i = 0; i < pinkCG.length; i++){
    if(pinkCG[i].isTouching(mainCyclist)){
      if(shieldCount>0){
        pinkCG[i].destroy();
        shieldCount = 0;
      } else{
        gameState = END;
        pinkCG[i].velocityY = 0;
        pinkCG[i].addAnimation("opponentPlayer1",oppPink2Img);
        crashSound.play();
      }
      
    }
  }

  for(var i = 0; i < yellowCG.length; i++){
    if(yellowCG[i].isTouching(mainCyclist)){
      if(shieldCount>0){
        yellowCG[i].destroy();
        shieldCount = 0;
      } else{
        gameState = END;
        yellowCG[i].velocityY = 0;
        yellowCG[i].addAnimation("opponentPlayer2",oppYellow2Img);
        crashSound.play();
      }
    }
  }
  
  for(var i = 0; i < redCG.length; i++){
    if(redCG[i].isTouching(mainCyclist)){
      if(shieldCount>0){
        redCG[i].destroy();
        shieldCount = 0;
      } else{
        gameState = END;
        redCG[i].velocityY = 0;
        redCG[i].addAnimation("opponentPlayer3",oppRed2Img);
        crashSound.play();
      }
    }
  }
}
    
  if(gameState === END){
    console.log("end");
    gameOver.visible = true;
    textSize(20);
    fill(255);
    text("Press Up Arrow to Restart the game!", 400,200);
    
    path.velocityX = 0;
    mainCyclist.velocityY = 0;
    mainCyclist.addAnimation("SahilRunning",mainRacerImg2);

    shieldG.setVelocityXEach(0);
    shieldG.setLifetimeEach(-1);
    
    pinkCG.setVelocityXEach(0);
    pinkCG.setLifetimeEach(-1);
    
    yellowCG.setVelocityXEach(0);
    yellowCG.setLifetimeEach(-1);
    
    redCG.setVelocityXEach(0);
    redCG.setLifetimeEach(-1);
      

    if(keyDown("UP_ARROW")) {
      reset();
    }
  }



function pinkCyclists(){
        player1 =createSprite(1100,Math.round(random(50, 250)));
        player1.scale =0.06;
        player1.velocityX = -(6 + 2*distance/150);
        player1.addAnimation("opponentPlayer1",oppPink1Img);
        player1.setLifetime=170;
        pinkCG.add(player1);
}

function yellowCyclists(){
        player2 =createSprite(1100,Math.round(random(50, 250)));
        player2.scale =0.06;
        player2.velocityX = -(6 + 2*distance/150);
        player2.addAnimation("opponentPlayer2",oppYellow1Img);
        player2.setLifetime=170;
        yellowCG.add(player2);
}

function redCyclists(){
        player3 =createSprite(1100,Math.round(random(50, 250)));
        player3.scale =0.06;
        player3.velocityX = -(6 + 2*distance/150);
        player3.addAnimation("opponentPlayer3",oppRed1Img);
        player3.setLifetime=170;
        redCG.add(player3);
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  mainCyclist.addAnimation("SahilRunning",mainRacerImg1);
  
  pinkCG.destroyEach();
  yellowCG.destroyEach();
  redCG.destroyEach();
  shieldG.destroyEach();

  shieldCount = 0;
  
  distance = 0;
}

function spawnShield() {
  if(World.frameCount%10==0 && shieldCount==0){
    shield = createSprite(1100,Math.round(random(50, 250)));
    shield.addImage(shieldImg);
    shield.scale = 0.25;
    shield.velocityX = -(6 + 2*distance/150);
    shield.setLifetime=170;
    shield.debug = true;
    shieldG.add(shield);
  }
}

}
