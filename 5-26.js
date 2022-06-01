p5.disableFriendlyErrors = true
const hashPairs = [];
for (let j = 0; j < 32; j++) {
  hashPairs.push(tokenData.hash.slice(2 + (j * 2), 4 + (j * 2)));
}
const decPairs = hashPairs.map(x => {
  return parseInt(x, 16);
});

S=Uint32Array.from([0,1,s=t=2,3].map(i=>parseInt(tokenData.hash.substr(i*8+2,8),16)));R=_=>(t=S[3],S[3]=S[2],S[2]=S[1],S[1]=s=S[0],t^=t<<11,S[0]^=(t^t>>>8)^(s>>>19),S[0]/2**32);

const seed = parseInt(tokenData.hash.slice(2,16), 16);

function rnd(min, max) {
  const rand = R();
  if (typeof min === 'undefined') {
    return rand;
  } else if (typeof max === 'undefined') {
    if (min instanceof Array) {
      return min[floor(rand * min.length)];
    } else {
      return rand * min;
    }
  } else {
    if (min > max) {
      const tmp = min;
      min = max;
      max = tmp;
    }
    return rand * (max - min) + min;
  }
}

function w(val) {if (val == null) return width;return width * val;}
function h(val) {if (val == null) return height;return height * val;}

const palettes = {
  'gray': {
    light: [204, 204, 204],
    dark: [67, 71, 74],
    accent_light: [195, 207, 217],
    accent_dark: [14, 22, 28]
  },
  'orange': {
    light: [194, 165, 99],
    dark: [156, 68, 23],
    accent_light: [247, 227, 168],
    accent_dark: [79, 18, 6]
  },
  'red': {
    light: [237, 64, 45],
    dark: [125, 20, 9],
    accent_light: [217, 50, 97],
    accent_dark: [97, 30, 49]
  },
  'blue': {
    light: [25, 91, 214],
    dark: [8, 8, 30],
    accent_light: [204, 235, 230],
    accent_dark: [44, 77, 60]
  }
}

///////////////////////////////////////////////////////

let graphics;

let play = true;

let pal;

let p;
let particles = [];
let particlesOut = [];
let particlesTop = [];
let particlesBg = [];
let particlesIn = [];
let spiralMoths = []
let numP;
let numP_Out;
let numP_Top;
let bgNumRows;
let numP_In;
let numP_spiralMoths;

// WATER PARTS

let cols, rows;
let scl;
let flying = 0;
let inc;


// FLOATING BUTTERFLIES PARTS

let buttermoths_num = 50;
let fM_noiseScale = 200, fM_noiseStrength = 1;
let buttermoths = [];
let buttermoths_lg = [];

let gridType;
let gridPoints = []

let layout;

let metals;


///////////////////////////////////////////////////////


function setup() {
  noiseSeed(seed)
  const smD = windowWidth < windowHeight ? windowWidth : windowHeight;
  createCanvas(smD, smD);
  graphics = createGraphics(smD,smD);

  pal = choosePalette()
  console.log(choosePalette_Name())

  cols = 35;
  rows = cols;
  scl = width/rows;

  setWater() //particleBg

  setMovingBackground()

  daubing()
  patchDaubing() 

  setFog() 

  gridType = chooseGrid()

  //mothsSetup(gridType)

  setSpiralMoths()

  setInParticles()

}

function draw() {
  translate(width/2,height/2)

  //water() 

  let cCoeff = map(mouseY,-h(.5),h(.5),0,.6)

  background(pal.dark[0]*cCoeff, pal.dark[1]*cCoeff, pal.dark[2]*cCoeff,220)

  imageMode(CENTER)
  image(graphics, 0, 0)
  concTexture(.1, pal.light)

  // new water 
  push()
  for (let i = 0; i < particlesBg.length; i++) {
    particlesBg[i].run()
  }
  pop()


  movingBackground()

  inParticles()



  // BUTTERMOTHS
  push()
  let fM_xoff = 0;
  let fM_yoff = 1000;
  let fM_inc = .1;
  for (let i = 0; i < buttermoths.length; i++) {
    //buttermoths[i].run(fM_xoff,fM_yoff);
    fM_xoff += fM_inc;
    fM_yoff += fM_inc;
  }
  pop()  

  drawSpiralMoths()

  topFog()


  if (play){
    loop()
  }else{
    noLoop()
  }
  play != play;
  console.log(frameRate())
  //console.log(numP)
}

///////////////////////////////

function mousePressed() {
  if (play === true) {
    play = false;
  } else { // implies play === false
    play = true;
  }
}

function choosePalette() {
  const palPercent = map(decPairs[1],0,255,0,1);
    if (palPercent < .25) {
      chosenPal = palettes.gray
    }else if (palPercent < .5){
      chosenPal = palettes.orange
    }else if (palPercent < .75){
      chosenPal = palettes.blue
    }else{
      chosenPal = palettes.red
    }
    return chosenPal
}

function choosePalette_Name() {
  const palPercent = map(decPairs[1],0,255,0,1);
    if (palPercent < .25) {
      chosenPal = 'gray'
    }else if (palPercent < .5){
      chosenPal = 'orange'
    }else if (palPercent < .75){
      chosenPal = 'blue'
    }else{
      chosenPal = 'red'
    }
    return chosenPal
}

function chooseGrid() {
  const gridPercent = map(decPairs[3],0,255,0,1);
    if (gridPercent < .5) {
      chosenGrid = circleGrid
    }else{
      chosenGrid = shaftGrid
    }
    return chosenGrid;
}

function chooseMothScale() {
  const mothScalePercent = map(decPairs[5],0,255,0,1);
    if (mothScalePercent < .33) {
      mothScale = rnd(.35,.65)
    }else if (mothScalePercent < .66) {
      mothScale = rnd(.65,.9)
    }else{
      mothScale = rnd(.9,1.25)
    }
    return mothScale;
}


//////////////////// TEXTURE //////////////////////

function tS_original(x1, y1, x2, y2, weight, r, g, b, alpha) {
  push()
  const relWeight = graphics.map(weight, 0, width, 1, 40);
  graphics.stroke(r, g, b, alpha)
  graphics.strokeWeight(w(0.002));
  for (let i = 0; i < relWeight; i++){
    let theta = rnd(TWO_PI);
    let nx1 = x1 + 0.5*rnd(weight/2)*graphics.cos(theta);
    let ny1 = y1 + 0.5*rnd(weight/2)*graphics.sin(theta);
    let nx2 = x2 + 0.5*rnd(weight/2)*graphics.cos(theta);
    let ny2 = y2 + 0.5*rnd(weight/2)*graphics.sin(theta);
    graphics.line(nx1, ny1, nx2, ny2)
  }
  pop()
  graphics.noLoop();
}

function texturedCircle_vert(init_distort,line_val,size,inc,diff,max_distort,col) {
  push()
  //translate(width/2,0)
  //line_val is for line length - 0 is a dot, .2 is a line
  let zoff = 0
  let t = frameCount * 3 + rnd(TWO_PI)
  let d = .9
  graphics.angleMode(graphics.DEGREES)
  if (frameCount < 50) {
    let xoff = map(cos(t+diff), -1, 1, 0, 1)
    let yoff = map(sin(t-diff), -1, 1, 0, 1)
    let r = map(noise(xoff, yoff), 0, 1, size, size-rnd(w(.01),max_distort*noise(xoff, yoff, zoff)))
    let x1 = graphics.width/2 + init_distort + r * cos(t)
    let y1 = graphics.height/2 + init_distort + d*r * sin(t)
    let x2 = graphics.width/2 + init_distort + r * cos(t + line_val)
    let y2 = graphics.height/2 + init_distort + d*r * sin(t + line_val*2)
    let alpha_coeff = map(dist(x2-x1,y2-y1,graphics.width/2,graphics.height/2),w(.1),w(.85),0,1)
    let coeff = map(dist(x2-x1,y2-y1,graphics.width/2,graphics.height/2),0,w(.85),1,0)
    let x_alt = init_distort + r * cos(t + line_val)
    let y_alt = graphics.height/2 + init_distort + d*r * sin(t + line_val*2)
    let dis = rnd(.94,1.06)
    let dis2 = rnd(.88,1.12)
    /*graphics.line(x1,y1,x2,y2)
    graphics.line(x1*dis,y1*dis,x2*dis,y2*dis)
    graphics.line(x1*dis2,y1*dis2,x2*dis2,y2*dis2)*/
    tS_original(x1, y1, x2, y2, w(.05), col[0]*coeff, col[1]*coeff, col[2]*coeff, rnd(8)*alpha_coeff)
    //graphics.line(x1*dis,y1*dis,x_alt*dis,y_alt*dis) // DARKER & MORE CHAOTIC
    zoff += inc/5;
  }
  pop()
}

function concTexture(line_val, col) {
  push()
  graphics.blendMode(graphics.OVERLAY)
  graphics.noFill()
  //graphics.translate(0,graphics.height/2)
  //let angle = random(TWO_PI);
  let num_circs = 90
  let xoff = 0
  for (let i = 0; i < num_circs; i++) {
    //let i_d = rnd(-w(.003), w(.003))*i
    let i_d = 0
    translate(rnd(w(.01),rnd(h(.01))))
    //let c = map(mouseX,0,width,0,2);
    let size = map(i,0,num_circs,w(.023),w(.85))
    let inc = .003
    let c = map(size,0,w(1),0,2)
    let alpha_coeff = map(size,0,w(.15),.1,.6)
    //graphics.stroke(col[0] * c, col[1] * c, col[2] * c, 40 * alpha_coeff)
    //graphics.strokeWeight(rnd(w(.001)))
    //graphics.strokeWeight(map(i,0,num_circs,w(.0005),w(.002)))
    //graphics.ellipse(0,0,size)
    texturedCircle_vert(i_d,line_val,size,inc,0,w(.03),col)
    texturedCircle_vert(i_d,line_val,size,inc*15,30,w(.03),col)
    texturedCircle_vert(i_d,line_val,size,inc*25,60,w(.03),col)
    //graphics.stroke(col[0] * c, col[1] * c, col[2] * c, 65 * alpha_coeff)
    texturedCircle_vert(i_d,line_val,size,inc*15,90,w(.03),col)
    texturedCircle_vert(i_d,line_val,size,inc*25,120,w(.03),col)
    //graphics.stroke(col[0] * c, col[1] * c, col[2] * c, 25 * alpha_coeff)
    texturedCircle_vert(i_d,line_val,size,inc*15,270,w(.03),col)
    texturedCircle_vert(i_d,line_val,size,inc*25,300,w(.03),col)
    xoff += .01
  }
  pop()
}

function randomDaubs(num, size, r, g, b, spread) {
  push()
  translate(-width/2,0)
  // SPREAD IS INVERSE VALUE  -  MORE CENTERED AT W(.5), MORE SPREAD AT W(.1)
  let num_daubs = num
  for (let i = 0; i < num_daubs; i++) {
    let angle = rnd(TWO_PI)
    //let rad = rnd(w(.75)) - rnd(.58)
    let rad = w(.75)
    x = width/2 + rnd(rad*cos(angle)-rnd((spread/2)*cos(angle)))
    y = height/2 + rnd(rad*sin(angle)-rnd((spread/2)*sin(angle)))
    x2 = width/2 + rnd(rad*cos(angle - 5)-rnd((spread/2)*cos(angle - 5)))
    y2 = height/2 + rnd(rad*sin(angle - 5)-rnd((spread/2)*sin(angle - 5)))
    x3 = width/2 + rnd(rad*cos(angle - 10)-rnd((spread/2)*cos(angle - 10)))
    y3 = height/2 + rnd(rad*sin(angle - 10)-rnd((spread/2)*sin(angle - 10)))
    coeff = map(dist(x,y,width/2,height/2),0,w(.8),1,.1)
    alpha_coeff = map(dist(x,y,width/2,height/2),0,w(.8),.5,1)
    graphics.noStroke()
    //let coeff = map(dist(x,0,0,0),0,w(.6),1,.1)
    //let alpha_coeff = map(dist(x,0,0,0),0,w(.6),.5,1.4)
    let col = [r*coeff,g*coeff,b*coeff]
    daubEllipse(x,y,size,col[0],col[1],col[2],180*alpha_coeff)
    daubEllipse(x2,y2,size,col[0],col[1],col[2],180*alpha_coeff)
    daubEllipse(x3,y3,size,col[0],col[1],col[2],180*alpha_coeff)
  }
  pop()
}

function daubing() {
  let size = rnd(w(.015),w(.035))
  randomDaubs(1500, size, pal.light[0], pal.light[1], pal.light[2], -w(.5))
  //inwardDaubs(1200, pal.light[0], pal.light[1], pal.light[2], -w(.35), lay)
}

function patchDaubing() {
  let c = 255 
  let size = rnd(w(.01),w(.02))
  randomDaubs(1000, size, c,c,c, -w(.8))
}

///////////////////////////////

function blurredEllipse(x,y,size,r,g,b,a) {
  for (let i = 0; i < 4; i++){ // reduced to be lighter 
    fill(r,g,b,(i/a)*(6*i))
    noStroke()
    //filter(BLUR)
    //blendMode(OVERLAY)
    ellipse(x,y,1.6*size - (size/3)*i)
  }
}

function daubEllipse(x,y,size,r,g,b,a) {
  for (let i = 0; i < 5; i++){
    graphics.fill(r,g,b,(i/a)*(25*i))
    graphics.noStroke()
    graphics.ellipse(x,y,1.6*size - (size/7)*i)
  }
}

function fogEllipse(x,y,size,r,g,b,a) {
  for (let i = 0; i < 4; i++){ // reduced to be lighter 
    fill(r,g,b,(i/a)*(2.5*i))
    noStroke()
    ellipse(x,y,1.6*size - (size/3)*i)
  }
}

function water() {
  push()
  noStroke()
  fill(13,24,38)
  rect(-width/2,-height/2,width,height)
  translate(-width/2 + scl/2,-height/2 + scl/2)
  flying += 0.01;
  fill(3,3,15)

  let yoff = flying;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      var posMult = map(sin(x*y*30),-1,1,.9,1.1)
      let xPos = x * scl * posMult;
      let yPos = y * scl * posMult;
      // IF USING THIS VERSION OF c - use general brightness as potential attribute
      let c = map(noise(xoff, yoff), 0, 1, -1, map(mouseY,0,width,0,2)) + map(dist(xPos,yPos,mouseX,mouseY),0,w(1),.5,0)
      fill(c * pal.light[0], c * pal.light[1], c * pal.light[2], c * 100); // 25, 91, 214
      noStroke();
      xoff += 0.6;
      //var angle = atan2(width/2,height/2);
      var mult = map(sin(x*y*30),-1,1,1,1.5)
      //rect(xPos, yPos, scl, scl);
      //ellipse(xPos, yPos, scl*mult*1.5)
      blurredEllipse(xPos, yPos, scl*mult*1.5, c * pal.light[0], c * pal.light[1], c * pal.light[2], 5)
      //fill(c * pal.light[0], c * pal.light[1], c * pal.light[2], c * 255); // 25, 91, 214
      //ellipse(xPos, yPos, scl*mult)
    }
    yoff += 0.6;
  }
  pop()
}

function setWater() {
  push()
  //translate(-width/2 + scl/2,-height/2 + scl/2)
  bgNumRows = 12;
  scl = width/bgNumRows;
  let yoff = 0;
  for (let y = 0; y < bgNumRows * 2; y++) {
    let xoff = 0;
    for (let x = 0; x < bgNumRows * 2; x++) {
      let xPos = x * scl - width/2 + scl/2;
      let yPos = y * scl - height/2 + scl/2;
      let col = [pal.light[0], pal.light[1], pal.light[2], 15]; // 25, 91, 214 // inverse alpha
      p = new ParticleBg(xPos,yPos,w(.03),col,15);
      particlesBg.push(p);
      xoff += 0.6;
    }
    yoff += 0.6;
  }
  pop()
}

function setMovingBackground() {
  numP = 200;
  for (let i = 0; i < numP; i++){
    let radius = map(i,0,numP,w(.003),w(.65))
    let colVals = [215,90,125]
    p = new Particle(radius,w(.06),colVals,w(.15),10);
    particles.push(p);
  }
  numP_Out = 150;
  for (let i = 0; i < numP_Out; i++){
    let radius = map(i,0,numP,w(.05),w(.65))
    let colVals = [252, 186, 3]
    p = new Particle(radius,w(.03),colVals,w(.25),15);
    particlesOut.push(p);
  }
}

function movingBackground() {
  push()
  for (let i = 0; i < particlesOut.length; i++) {
    particlesOut[i].run()
  }
  pop()

  push()
  for (let i = 0; i < particles.length; i++) {
    particles[i].run()
  }
  pop()
}

function setFog() {
  numP_Top = 350;
  for (let i = 0; i < numP_Out; i++){
    let radius = map(i,0,numP,w(.01),w(.3))
    let colVals = [pal.accent_light[0], pal.accent_light[1], pal.accent_light[2]]
    p = new ParticleTop(radius,w(.05),colVals,w(.02),.5);
    particlesTop.push(p);
  }
}

function topFog() {
  push()
  for (let i = 0; i < particlesTop.length; i++) {
    particlesTop[i].run()
  }
  pop()
}

function setInParticles() {
  numP_In = 500;
  for (let i = 0; i < numP; i++) {
    let radius = rnd(w(.01),w(.65))
    let angle = rnd(TWO_PI)
    let size = rnd(w(.01),w(.03))
    let diff = random(.85,1.15)
    let speedCoeff = random(1,3)
    let x = radius*cos(angle)*diff
    let y = radius*sin(angle)*diff
    let c = rnd(255)
    let col = [c,c,c]
    let p = new ParticleIn(x,y,size,radius,angle,speedCoeff,col)
    particlesIn.push(p);
  }
}

function inParticles() {
  push()
  for (let i = 0; i < particlesIn.length; i++){
    particlesIn[i].run();
  }
  pop()
}

function setSpiralMoths() {
  numP_sprialMoths = 50;
  for (let i = 0; i < numP_sprialMoths; i++) {
    let mothScale = chooseMothScale()
    let radius = rnd(w(.01),w(.65))
    let angle = rnd(TWO_PI)
    let size = rnd(w(.01),w(.03))
    let diff = random(.85,1.15)
    let speedCoeff = random(1,3)
    let x = radius*cos(angle)*diff
    let y = radius*sin(angle)*diff

    let gold = [255,231,122]
    let platinum = [227, 222, 197]
    let silver = [209, 233, 237]
    metals = [gold,platinum,silver]
    met = metals[floor(rnd()*metals.length)]

    let moth = chooseMoth()
    //let rot = rnd(-PI,PI) + i/15
    let rot = rnd(TWO_PI) + i/2

    p = new Buttermoth_Spiral(x,y,size,radius,angle,speedCoeff,met,moth,rot,mothScale)
    spiralMoths.push(p);
  }
}

function drawSpiralMoths() {
  push()
  let fM_xoff = 0;
  let fM_yoff = 1000;
  let fM_inc = .1;
  for (let i = 0; i < spiralMoths.length; i++){
    spiralMoths[i].run(fM_xoff,fM_yoff);
    fM_xoff += fM_inc;
    fM_yoff += fM_inc;
  }
  pop()
}

/////////////////////////////

class Particle{
  constructor(_radius,_size,_col,_spread,_alpha){
    this.radius = _radius;
    this.size = _size;
    this.col = _col;
    this.spread = _spread;
    this.alpha = _alpha; // inverse values when using blurredEllipse
    this.angle = rnd(TWO_PI)
    this.x = rnd(this.spread) * Math.cos(this.angle)
    this.y = rnd(this.spread) * Math.sin(this.angle)
    this.vx = rnd(-w(.003),w(.003))
    this.vy = rnd(-h(.003),h(.003))
    this.off = rnd(-w(.05),w(.05))
  }

  run() {
    this.update();
    this.checkEdges();
    this.show();
  }

  update() {
    this.x += this.vx * map(dist(this.x,this.y,0,0),0,w(.65),.3,1)
    this.y += this.vy * map(dist(this.x,this.y,0,0),0,w(.65),.3,1)
  }

  checkEdges() {
    if (this.x < -w(.5) || this.x > w(.5) || this.y < -h(.5) || this.y > h(.5)) {    
      this.x = 0
      this.y = 0
    }
  }

  show() {
    noStroke()
    fill(255)
    //ellipse(this.x+this.off,this.y+this.off,w(.001))
    let c = map(dist(this.x,this.y,0,0),0,w(.65),.8,.1)
    let mouseC = map(dist(this.x,this.y,mouseX-width/2,mouseY-height/2),0,w(.65),map(c,.8,.1,30,150),15)
    let adjSize = map(dist(this.x,this.y,0,0),0,w(.65),.5,2.5) * this.size
    blurredEllipse(this.x,this.y,adjSize,this.col[0]*c+mouseC,this.col[1]*c+mouseC,this.col[2]*c+mouseC,this.alpha) 
  }
}

class ParticleTop{
  constructor(_radius,_size,_col,_spread,_alpha){
    this.radius = _radius;
    this.size = _size;
    this.col = _col;
    this.spread = _spread;
    this.alpha = _alpha; // inverse values when using blurredEllipse
    this.angle = rnd(TWO_PI)
    this.x = rnd(this.spread) * Math.cos(this.angle)
    this.y = rnd(this.spread) * Math.sin(this.angle)
    this.x2 = rnd(this.spread) * Math.cos(this.angle)
    this.y2 = rnd(this.spread) * Math.sin(this.angle)
    this.vx = rnd(-w(.003),w(.003))
    this.vy = rnd(-h(.003),h(.003))
    this.off = rnd(-w(.05),w(.05))
  }

  run() {
    this.update();
    this.checkEdges();
    this.show();
  }

  update() {
    this.x += this.vx * map(dist(this.x,this.y,0,0),0,w(.65),.3,1)
    this.y += this.vy * map(dist(this.x,this.y,0,0),0,w(.65),.3,1)
    this.x2 += this.vx * map(dist(this.x,this.y,0,0),0,w(.65),.3,1)
    this.y2 += this.vy * map(dist(this.x,this.y,0,0),0,w(.65),.3,1)
  }

  checkEdges() {
    if (dist(this.x,this.y,0,0) > w(.3)) {
      let angle = frameCount / 90
      this.x = map(cos(angle),-1,1,-w(.1),w(.1))
      this.y = map(sin(angle),-1,1,-h(.1),h(.1))
    }
    if (dist(this.x2,this.y2,0,0) > w(.35)) {
      this.x2 = 0
      this.y2 = 0
    }
  }

  show() {
    noStroke()
    fill(255)
    //ellipse(this.x+this.off,this.y+this.off,w(.001))
    let c = map(dist(this.x,this.y,0,0),0,w(.3),.8,0)
    //let mouseC = map(dist(this.x,this.y,mouseX-width/2,mouseY-height/2),0,w(.65),map(c,.8,.1,30,150),15)
    let adjSize = map(dist(this.x,this.y,0,0),0,w(.65),.5,2.5) * this.size
    fogEllipse(this.x,this.y,adjSize,this.col[0]*c,this.col[1]*c,this.col[2]*c,this.alpha*(2/c)) 
    fogEllipse(this.x2,this.y2,adjSize,this.col[0]*c,this.col[1]*c,this.col[2]*c,this.alpha*(2/c)) 
  }
}

class ParticleBg{
  constructor(_x,_y,_size,_col,_alpha){
    this.size = _size;
    this.col = _col;
    this.alpha = _alpha; // inverse values when using blurredEllipse
    this.angle = rnd(TWO_PI)
    this.x = _x  * Math.cos(this.angle);
    this.y = _y  * Math.sin(this.angle);
    this.vx = rnd(-w(.003),w(.003)) * Math.cos(this.angle)
    this.vy = rnd(-h(.003),h(.003)) * Math.sin(this.angle)
  }

  run() {
    this.update();
    this.checkEdges();
    this.show();
  }

  update() {
    //let angle = noise(this.x/fM_noiseScale, this.y/fM_noiseScale, frameCount/fM_noiseScale)*TWO_PI*fM_noiseStrength;
    this.x += this.vx * map(dist(this.x,this.y,0,0),0,w(.65),.6,1)
    this.y += this.vy * map(dist(this.x,this.y,0,0),0,w(.65),.6,1)
  }

  checkEdges() {
    if (dist(this.x,this.y,0,0) > w(.65)) {    
      this.x = 0
      this.y = 0
    }
  }

  show() {
    let c = map(dist(this.x,this.y,0,0),0,w(.65),.8,.1)
    let mouseC = map(dist(this.x,this.y,mouseX-width/2,mouseY-height/2),0,w(.65),map(c,.8,.1,30,150),15)
    let adjSize = map(dist(this.x,this.y,0,0),0,w(.65),.5,2.5) * this.size
    blurredEllipse(this.x,this.y,adjSize,this.col[0]*c+mouseC,this.col[1]*c+mouseC,this.col[2]*c+mouseC,this.alpha,this.col[3]) 
  }
}

class ParticleIn{
  constructor(_x,_y,_size,_radius,_angle,_speedCoeff,_col){
    this.x = _x;
    this.y = _y;
    this.size = _size;
    this.radius = _radius;
    this.angle = _angle;
    this.speedCoeff = _speedCoeff;
    this.col = _col;
  }

  run() {
    this.update();
    this.checkEdges();
    this.show();
  }

  update() {
    let t = 0
    t += .5 * this.speedCoeff
    let tr = 0
    rotate(frameCount * .0001)
    this.x *= map(t,0,50,1,.1)
    this.y *= map(t,0,50,1,.1)
    tr += 50 * this.speedCoeff
  }

  checkEdges() {
    if (dist(this.x,this.y,0,0) < w(.01)) {
      let newRadius = random(w(.7),w(.85))
      let newAngle = frameCount / 90
      this.x = newRadius*cos(this.angle)
      this.y = newRadius*sin(this.angle)
    }
  }

  show() {
    noStroke()
    fill(255)
    //ellipse(this.x+this.off,this.y+this.off,w(.001))
    let c = map(dist(this.x,this.y,0,0),0,w(.7),.5,.25)
    //let mouseC = map(dist(this.x,this.y,mouseX-width/2,mouseY-height/2),0,w(.65),map(c,.8,.1,30,150),15)
    let adjSize = map(dist(this.x,this.y,0,0),0,w(.8),0,1) * this.size
    //fogEllipse(this.x,this.y,adjSize,this.col[0],this.col[1],this.col[2],3*c) 
    fill(this.col[0],this.col[1],this.col[2],50)
    ellipse(this.x,this.y,adjSize)
  }
}

class Buttermoth{
  constructor(_loc,_dir,_speed,_moth,_mothScale,_met,_start,_rot,_grid){
    this.loc = _loc;
    this.dir = _dir;
    this.speed = _speed;
    this.moth = _moth;
    this.mothScale = _mothScale;
    this.met = _met;
    this.start = _start;
    this.rot = _rot;
    this.grid = _grid;
    
  	// var col;
  }
  run(fM_xoff,fM_yoff) {
    this.move();
    if (this.grid == shaftGrid){
      this.checkEdges();
    }
    this.update(fM_xoff,fM_yoff);
  }
  move(){
    //let angle = noise(this.loc.x/fM_noiseScale, this.loc.y/fM_noiseScale, frameCount/fM_noiseScale)*TWO_PI*fM_noiseStrength; //0-2PI
    let angle = frameCount / 60
    this.dir.x = cos(angle);
    this.dir.y = sin(angle);
    var vel = this.dir.copy();
    var d = .5;  //direction change 
    vel.mult(this.speed*d); //vel = vel * (speed*d)
    this.loc.add(vel); //loc = loc + vel
    if (this.grid == shaftGrid){
      angle = noise(this.loc.x/fM_noiseScale*3, this.loc.y/fM_noiseScale*3, frameCount/fM_noiseScale)*360*fM_noiseStrength/3; //0-2PI
      this.dir.x = cos(angle);
      this.dir.y = noise(angle)*5;
      var vel = this.dir.copy();
      var d = .6;  //direction change 
      vel.mult(this.speed*d); //vel = vel * (speed*d)
      this.loc.add(vel); //loc = loc + vel
    }
  }
  checkEdges(){
    if (this.grid == shaftGrid){
      if (this.loc.y < -h(.55)) {
        this.loc.x = rnd(-w(.15),w(.15))
        this.loc.y = rnd(h(.35), h(.7))
        this.start = frameCount
      }
    }else{
      if (this.loc.x < w(0) || this.loc.x > w(1) || this.loc.y < 0 || this.loc.y > h(1)) {   
        let radius = rnd(w(.16), w(.27))
        let rt_an = rnd(TWO_PI)
        let conc_x = width/2 + radius*cos(rt_an)/2
        let conc_y = height/2 + radius*sin(rt_an)*1.5
        this.loc.x = conc_x
        this.loc.y = conc_y
      }
    }
  }
  update(fM_xoff,fM_yoff){

    let c = map(noise(fM_xoff, fM_yoff), 0, 1, 0, map(dist(this.loc.x,this.loc.y,mouseX-width/2,mouseY-height/2),w(.05),width/2,0,2));
    let breathingAngle = frameCount / 30
    let breathing = map(sin(breathingAngle),-1,1,1,1.1)
    if (this.grid == shaftGrid){
      breathing = 1
    }
  
    fill(c * this.met[0], c * this.met[1], c * this.met[2], map(frameCount,this.start,this.start+30,0,90) + c * 1.2);
    noStroke()

    this.moth(this.loc.x * breathing, this.loc.y * breathing, this.mothScale, map(sin(frameCount/120),-1,1,0,this.rot));
  }
}

class Buttermoth_Spiral{
  constructor(_x,_y,_size,_radius,_angle,_speedCoeff,_met,_moth,_rot,_mothScale){
    this.x = _x;
    this.y = _y;
    this.size = _size;
    this.radius = _radius;
    this.angle = _angle;
    this.speedCoeff = _speedCoeff;
    this.met = _met;
    this.moth = _moth;
    this.rot = _rot;
    this.mothScale = _mothScale;
  }

  run(fM_xoff,fM_yoff) {
    this.update();
    this.checkEdges();
    this.show(fM_xoff,fM_yoff);
  }

  update() {
    let t = 0
    t += .5 * this.speedCoeff
    let tr = 0
    rotate(frameCount * .0003)
    this.x *= map(t,0,50,1,.1)
    this.y *= map(t,0,50,1,.1)
    tr += 50 * this.speedCoeff
  }

  checkEdges() {
    if (dist(this.x,this.y,0,0) < w(.03)) {
      let newRadius = random(w(.7),w(.85))
      let newAngle = frameCount / 90
      this.x = newRadius*cos(this.angle)
      this.y = newRadius*sin(this.angle)
    }
  }

  show(fM_xoff,fM_yoff) {
    let c = map(noise(fM_xoff, fM_yoff), 0, 1, 0, map(dist(this.x,this.y,mouseX-width/2,mouseY-height/2),w(.05),w(.2),0,.3));
    //let c = map(dist(this.x,this.y,mouseX-width/2,mouseY-height/2),w(.05),width/2,0,.3)
    //fill(c * this.met[0], c * this.met[1], c * this.met[2], map(frameCount,this.start,this.start+30,0,90) * map(dist(this.x,this.y,0,0),w(.13),w(.04),1,0));
    fill(c * this.met[0],c * this.met[1],c * this.met[2], map(dist(this.x,this.y,0,0),w(.13),w(.04),255,0))
    noStroke()
    
    this.moth(this.x, this.y, this.mothScale * map(dist(this.x,this.y,0,0),w(.8),0,2.3,.6), map(sin(frameCount/120),-1,1,0,this.rot));
  }
}

////////////////////////////

function circleGrid() {
  push()
  let num_rows = 13
  let r_inc = w(.045)
  for (let i = 0; i < num_rows; i++) {
    let y = map(i,0,num_rows,-r_inc*num_rows/2,r_inc*num_rows/2)
    let num_cols = round(map(dist(y,0,0,0), 0, num_rows/2 * r_inc, 10, 0))
    for (let j = 0; j < num_cols; j++) {
      let x = (map(j,0,num_cols,0-num_cols/2*r_inc,num_cols/2*r_inc)+ r_inc/2) * map(num_cols,0,10,2.3,1)
      let point = createVector(x + rnd(-w(.015),w(.015)),y + rnd(-h(.015),h(.015)))
      gridPoints.push(point)
    }  
  }
  pop()
}

function shaftGrid() {
  push()
  let num_rows = 20
  let r_inc = w(.035)
  for (let i = 0; i < num_rows; i++) {
    let y = map(i,0,num_rows,-h(.5),h(.6))
    let num_cols = 4
    for (let j = 0; j < num_cols; j++) {
      let x = (map(j,0,num_cols,0-num_cols/2*r_inc,num_cols/2*r_inc)+ r_inc/2) * map(num_cols,0,10,2.3,1)
      let point = createVector(x + rnd(-w(.025),w(.025)),y + rnd(-h(.025),h(.025)))
      gridPoints.push(point)
    }  
  }
  pop()
}

function chooseMoth() { 
  const mothOptions = [moth_4, moth_5, moth_6, moth_7];
  return mothOptions[floor(rnd()*mothOptions.length)];
}

function mothsSetup(grid) {
  push()
  grid()

  mothScale = chooseMothScale()
  for (let i = 0; i < gridPoints.length; i++) {
    //let sclAdjust = 
    let loc = createVector(gridPoints[i].x,gridPoints[i].y)
    let gold = [255,231,122]
    let platinum = [227, 222, 197]
    let silver = [209, 233, 237]
    let metals = [gold,platinum,silver]
    let met = metals[floor(rnd()*metals.length)]
    let angle = 0; //any value to initialize
    let dir = createVector(cos(angle), sin(angle));
    let speed = -random(.1,.5);
    let start = rnd(100,300)
    let moth = chooseMoth()
    let rot = rnd(-PI,PI) + i/15
    buttermoths.push(new Buttermoth(loc, dir, speed, moth, mothScale, met, start, rot, grid));
  }
  pop()
}

function moth_1(x,y,sc,rot) {

  push()
  //translate(-width/2,-height/2)
  translate(x,y)
  rotate(rot + frameCount / 300)
  scale(sc)

  let coords_tr = [

    [47871,48264,48719,48996,47871,48752],
    [48019,49956,48293,50107,48515,50095],
    [48670,49993,48719,48996,49027,49338],
    [47871,48264,48344,48353,48646,48933],
    [48019,49956,47810,49645,48670,49993],
    [47857,50211,48038,50185,48533,50523],
    [48615,50257,48038,50185,48533,50523],
    [48315,51731,48213,51542,48096,51046],
    [48433,51779,48315,51731,48485,51686],
    [47857,50211,47746,50566,47982,50417],
    [48096,51046,48315,50742,47982,50417],
    [48716,51365,48767,51650,48840,51460],
    [49204,51568,49015,51731,48840,51460],
    [49425,51731,49468,51028,49878,51717],
    [49546,51852,49425,51731,49878,51717],
    [49803,49770,50611,50111,50318,49645],
    [49618,49420,49803,49770,50096,49522],
    [51488,49693,51960,49487,51488,49303],
    [52131,49236,51960,49487,51488,49303],
    [50113,51113,50481,50892,50236,50523],
    [50027,50038,50366,50168,50236,50523],
    [51488,49693,51401,50031,51086,50195],
    [49468,51028,49555,50745,50113,51113],
    [50541,50309,50764,50398,50878,50592],
    [48533,50771,48864,50406,48767,50668],
    [48563,50655,48872,50390,48722,50455],
    [49150,50447,49065,50312,49330,50043],
    [49235,50517,49330,50043,49150,50447],
    [49555,50745,49533,50219,49648,50668],
    [49770,49966,49533,50219,49699,50179],
    [49803,50909,49699,50179,50000,50766],
    [49851,49069,50196,48966,50866,49212],
    [51488,49303,51700,48934,50866,49212]]

  let relCoords_tr = [];
  const denTr = 100000
  coords_tr.forEach(i => relCoords_tr.push([w(i[0]/denTr) - w(.5),h(i[1]/denTr) - h(.5),w(i[2]/denTr) - w(.5),h(i[3]/denTr) - h(.5),w(i[4]/denTr) - w(.5),h(i[5]/denTr) - h(.5)]))
  relCoords_tr.forEach(i => triangle(i[0],i[1],i[2],i[3],i[4],i[5]))
  //relCoords.forEach(i => speckling_2(i[0],i[1],i[2],i[3],i[4],i[5]))

  let coords_c = [

    [48234,49860,215],
    [48356,49206,441],
    [48337,48425,96],
    [48428,48529,56],
    [48469,48600,5],
    [47981,48928,183],
    [47919,49175,88],
    [47919,49258,71],
    [47854,49655,44],
    [47940,49723,82],
    [48505,49637,11],
    [48426,50039,71],
    [49270,49753,297],
    [48100,50724,307],
    [47913,50584,178],
    [48440,50581,143],
    [48123,51084,104],
    [48204,51201,131],
    [48497,50954,269],
    [48929,51585,162],
    [48995,51310,264],
    [49055,50650,224],
    [48885,50920,27],
    [48248,51362,67],
    [48366,51655,68],
    [49848,51242,213],
    [49778,51521,156],
    [50096,50929,19],
    [50400,50699,211],
    [50318,50297,138],
    [50019,49590,288],
    [50310,49365,251],
    [50713,49329,194],
    [51017,49992,213],
    [51120,49475,484],
    [51745,49117,229],
    [51902,49109,202],
    [52127,49130,119],
    [51557,48906,28],
    [50400,49764,278],
    [50141,49959,28],
    [49792,49391,174],
    [49851,49169,99],
    [49958,50330,3],
    [49875,50119,186],
    [49678,50783,128],
    [49659,50610,17],
    [49020,50478,172],
    [48443,51450,237],
    [48592,50398,143],
    [48991,50281,25],
    [49150,50003,184],
    [50163,49053,88],
    [51420,49073,96]]

  let relcoords_c = [];
  const denC = 100000
  coords_c.forEach(i => relcoords_c.push([w(i[0]/denC) - w(.5),h(i[1]/denC) - h(.5),w(i[2]/(denC/2))]))
  relcoords_c.forEach(i => ellipse(i[0],i[1],i[2]))
  pop()

}

function moth_2(x,y,sc,rot) {

  push()
  //translate(-width/2,-height/2)
  translate(x,y)
  rotate(rot + frameCount / 300)
  scale(sc)

  let coords_tr = [

    [4945,1859,4962,1924,4978,1885],
    [4703,4846,4720,4823,4783,4812],
    [4772,4934,4737,4906,4727,4872],
    [4915,4838,4835,4808,4762,4821],
    [4772,4934,4801,4962,4841,4966],
    [4938,4861,4974,4954,4997,4942],
    [4992,4894,4938,4861,4997,4925],
    [5079,4952,5068,4938,5123,4861],
    [5106,4952,5173,4965,5173,4946],
    [5125,4901,5154,4838,5248,4808],
    [5225,4895,5248,4808,5291,4818],
    [5173,4946,5210,4954,5236,4930],
    [5091,4968,5068,4991,5084,5083],
    [5101,5133,5084,5083,5079,5114],
    [5087,5167,5085,5142,5101,5133],
    [4997,5193,4976,5159,4968,5125],
    [4916,5048,4948,5081,4953,5026],
    [4886,5024,4916,5048,4933,5007],
    [4966,4978,4990,4970,5005,4976],
    [4968,5125,5005,4976,4953,5026],
    [4997,5193,5001,5184,4996,5088],
    [5084,5083,5133,5037,5115,4976],
    [5177,4987,5195,5003,5142,5039],
    [4772,4934,4938,4861,4841,4823],
    [4790,4938,4841,4966,4894,4935]]

    let relCoords_tr = [];
    const denTr = 10000
    coords_tr.forEach(i => relCoords_tr.push([w(i[0]/denTr) - w(.5),h(i[1]/denTr) - h(.5),w(i[2]/denTr) - w(.5),h(i[3]/denTr) - h(.5),w(i[4]/denTr) - w(.5),h(i[5]/denTr) - h(.5)]))
    relCoords_tr.forEach(i => triangle(i[0],i[1],i[2],i[3],i[4],i[5]))

  let coords_c = [
    
    [47201,48536,193],
    [47771,48743,472],
    [47804,48248,21],
    [48053,48283,87],
    [48336,48297,73],
    [48882,48784,45],
    [49197,49244,329],
    [49330,49430,197],
    [49484,49476,15],
    [49863,48937,7],
    [49929,48971,56],
    [50046,49430,4],
    [48010,49477,151],
    [48079,49575,154],
    [49099,50166,142],
    [48932,50094,163],
    [49693,49985,201],
    [50013,49946,52],
    [50006,50012,82],
    [49953,50214,15],
    [49874,50363,109],
    [49705,50880,259],
    [49697,51141,96],
    [49852,51300,138],
    [49885,51396,122],
    [49905,51498,102],
    [49926,51686,64],
    [49926,51741,41],
    [50009,51842,18],
    [49961,51937,24],
    [49519,50570,73],
    [49907,50548,27],
    [49454,50182,186],
    [49488,50032,12],
    [49471,49854,17],
    [49802,49422,141],
    [51396,49368,229],
    [51239,49015,263],
    [50891,49476,111],
    [51004,49354,8],
    [51104,49301,23],
    [51701,49480,199],
    [52235,49318,116],
    [52336,49208,101],
    [52172,48714,209],
    [52262,48363,238],
    [52868,48155,52],
    [52777,48089,2],
    [51803,49158,191],
    [51800,49026,175],
    [51808,48854,151],
    [51797,48730,124],
    [52030,48939,24],
    [50962,49856,18],
    [51228,49970,141],
    [51382,49950,62],
    [51475,49951,39],
    [50946,50877,121],
    [50927,51059,103],
    [50896,51391,53],
    [50891,51650,36],
    [51282,50355,219],
    [51516,50277,157],
    [51725,50214,123],
    [51888,50177,88],
    [51987,50093,33],
    [50895,50323,149],
    [50978,50158,74],
    [50975,51216,54],
    [51018,51317,21],
    [51691,49976,64],
    [48473,49473,199],
    [48449,49310,161],
    [48439,49129,135],
    [51261,48631,3],
    [51351,48604,21],
    [52532,48516,254],
    [52508,48794,72],
    [52308,49109,73],
    [52192,49042,31],
    [52083,49145,63],
    [51111,50758,44],
    [51825,49924,46],
    [51914,49992,8],
    [49217,50477,118],
    [49462,50807,72],
    [49334,50737,13],
    [49896,51834,52],
    [49859,51974,37],
    [49312,48619,133],
    [50439,49600,8],
    [50384,49670,53],
    [50391,49921,26],
    [52054,48505,359],
    [50983,51478,92]]

  let relcoords_c = [];
  const denC = 100000
  coords_c.forEach(i => relcoords_c.push([w(i[0]/denC) - w(.5),h(i[1]/denC) - h(.5),w(i[2]/(denC/2))]))
  relcoords_c.forEach(i => ellipse(i[0],i[1],i[2]))
  pop()
}

function moth_3(x,y,sc,rot) {

  push()
  //translate(-width/2,-height/2)
  translate(x,y)
  rotate(rot + frameCount / 300)
  scale(sc)

  let coords_tr = [

    [4707,4902,4748,4957,4868,4958],
    [4675,4818,4707,4902,4868,4958],
    [4866,4940,4911,4968,4988,4968],
    [4808,4756,4857,4760,4912,4807],
    [4882,4858,4871,4799,4808,4756],
    [4880,4934,4988,4968,4969,4926],
    [4772,4988,4909,4984,4926,5004],
    [4731,5112,4707,5078,4772,4988],
    [4766,5145,4739,5135,4731,5112],
    [4860,5194,4870,5139,4925,5068],
    [4979,5069,4945,5117,4944,5173],
    [5000,5114,5024,5007,5106,4960],
    [5010,5115,5062,5124,5185,5053],
    [4981,5109,5062,5197,5045,5250],
    [5085,5188,5062,5197,5010,5115],
    [5062,5124,5085,5188,5050,5142],
    [5131,5125,5187,5171,5274,5154],
    [5312,5104,5278,5156,5185,5053],
    [5077,4989,5193,4976,5295,5047],
    [5215,5044,5295,5047,5306,5075],
    [4870,5200,4902,5171,4912,5111],
    [4926,5109,4966,5066,4984,5017],
    [4835,5087,4893,5088,4934,5057],
    [4944,5074,4966,5000,4944,5021],
    [4894,4837,4933,4856,4927,4840],
    [4969,5114,4988,5048,4996,5096],
    [5030,5240,5007,5264,4952,5248]]

  let relCoords_tr = [];
  const denTr = 10000
  coords_tr.forEach(i => relCoords_tr.push([w(i[0]/denTr) - w(.5),h(i[1]/denTr) - h(.5),w(i[2]/denTr) - w(.5),h(i[3]/denTr) - h(.5),w(i[4]/denTr) - w(.5),h(i[5]/denTr) - h(.5)]))
  relCoords_tr.forEach(i => triangle(i[0],i[1],i[2],i[3],i[4],i[5]))


  let coords_c = [

    [4773,4835,91],
    [4867,4884,55],
    [4914,4892,47],
    [4902,4816,16],
    [4913,4826,12],
    [4928,4837,9],
    [4944,4847,2],
    [4977,4945,11],
    [5012,4952,35],
    [4865,4954,9],
    [4852,4960,8],
    [4836,4966,5],
    [4791,4954,9],
    [4776,4951,15],
    [4765,4948,21],
    [4721,4935,4],
    [4678,4842,14],
    [4672,4865,4],
    [4786,5074,68],
    [4780,5005,24],
    [4740,5006,8],
    [4866,5050,43],
    [4898,5007,17],
    [4908,4992,11],
    [4894,4989,7],
    [4927,5004,5],
    [4920,5012,2],
    [4977,5010,22],
    [4960,5031,16],
    [4938,5072,19],
    [4924,5088,18],
    [4910,5119,14],
    [4870,5191,12],
    [4864,5177,6],
    [4869,5133,3],
    [4856,5097,12],
    [4872,5098,3],
    [4979,5142,4],
    [4992,5202,54],
    [5056,5200,34],
    [5119,5117,37],
    [5112,5029,69],
    [5027,5091,33],
    [5007,5063,16],
    [5263,5083,48],
    [5275,5116,33],
    [5228,5006,9],
    [5244,5013,6],
    [5127,4957,4],
    [5168,5094,1],
    [5178,5118,4],
    [5252,5141,24],
    [5236,5169,5],
    [5203,5137,18],
    [5136,5145,16],
    [5149,5153,12],
    [5158,5163,8],
    [5057,5234,14],
  ]

  let relcoords_c = [];
  const denC = 10000
  coords_c.forEach(i => relcoords_c.push([w(i[0]/denC) - w(.5),h(i[1]/denC) - h(.5),w(i[2]/(denC/2))]))
  relcoords_c.forEach(i => ellipse(i[0],i[1],i[2]))
  pop()
}

function moth_4(x,y,sc,rot) {

  push()
  //translate(-width/2,-height/2)
  translate(x,y)
  rotate(rot + frameCount / 300)
  scale(sc)

  let coords_tr = [

    [4817,5123,4811,5074,4873,5007],
    [5028,5073,4976,5053,4951,4990],
    [4907,5073,4937,5031,4976,5053],
    [4837,5175,4919,5077,4890,5163],
    [4826,5235,4987,5274,4868,5281],
    [4988,5008,4971,4943,4983,4890],
    [5029,4834,5071,4716,5087,4801],
    [5181,4864,5132,4961,5168,5048],
    [4996,5280,5054,5194,5042,5260],
    [5018,5307,5032,5274,5074,5235],
    [4910,4822,4892,4894,4909,4955],
    [5019,4816,5028,4707,5052,4726],
    [5000,5008,5065,5097,5128,5102],
    [5036,5102,5128,5104,5098,5126],
    [5010,4874,5166,4765,5150,4868],
    [4919,5077,5100,5135,4953,5162],
    [5054,5230,5061,5192,5143,5154],
    [5102,5167,5110,5135,5155,5145]]

  let relCoords_tr = [];
  const denTr = 10000
  coords_tr.forEach(i => relCoords_tr.push([w(i[0]/denTr) - w(.5),h(i[1]/denTr) - h(.5),w(i[2]/denTr) - w(.5),h(i[3]/denTr) - h(.5),w(i[4]/denTr) - w(.5),h(i[5]/denTr) - h(.5)]))
  relCoords_tr.forEach(i => triangle(i[0],i[1],i[2],i[3],i[4],i[5]))


  let coords_c = [

    [5167,5099,27],
    [5106,5086,26],
    [5083,5061,19],
    [5055,5033,9],
    [5077,4910,9],
    [5142,5026,34],
    [4971,5106,39],
    [5015,5108,29],
    [4932,5196,9],
    [4940,5020,34],
    [4904,5013,31],
    [4839,5118,24],
    [4854,5089,3],
    [5021,4721,17],
    [4995,4740,33],
    [4989,4771,4],
    [4930,4916,3],
    [4939,4859,45],
    [5108,4780,49],
    [5112,4712,19],
    [5077,4716,5],
    [5138,4727,11],
    [5155,4738,5],
    [5157,4863,19],
    [5156,4834,28],
    [5166,4802,16],
    [5161,4772,12],
    [5167,4751,2],
    [5052,4722,5],
    [4923,4953,16],
    [4968,4980,6],
    [4951,4961,11],
    [4868,5051,11],
    [4889,5053,6],
    [4831,5230,11],
    [4834,5208,5],
    [4843,5184,12],
    [5014,5289,2],
    [5013,5314,5],
    [5130,5145,19],
    [5061,5222,15],
    [5082,5214,8],
    [5097,5203,5],
    [5060,5193,13],
    [5033,5154,14],
    [5061,5155,6],
    [5082,5130,17],
    [5077,4910,70],
    [4931,5196,70],
    [5089,5146,7],
    [4807,5112,4],
    [4912,4810,5],
    [4987,4820,23],
    [5017,4827,4],
    [4948,4774,7],
    [5176,4976,6],
    [5155,5140,4],
    [5005,4996,24],
    [5029,4993,1],
    [5047,5005,4],
    [4987,4967,5],
    [5172,5051,6],
    [5131,5066,7],
    [5115,5053,3],
    [4918,5091,6]]

  let relcoords_c = [];
  const denC = 10000
  coords_c.forEach(i => relcoords_c.push([w(i[0]/denC) - w(.5),h(i[1]/denC) - h(.5),w(i[2]/(denC/2))]))
  relcoords_c.forEach(i => ellipse(i[0],i[1],i[2]))
  pop()
}

// smaller moths

function moth_5(x,y,sc,rot) {

  push()
  //translate(-width/2,-height/2)
  translate(x,y)
  rotate(rot + frameCount / 300)
  scale(sc)

  let coords_tr = [

    [4899,5160,4967,5045,4965,5093],
    [4729,5031,4835,5000,4867,5009],
    [5044,4904,5038,4987,5055,5025],
    [5095,5039,5129,4991,5205,4960],
    [5166,5012,5122,5035,5120,5079],
    [5055,5102,5059,5076,5098,5084],
    [5065,5107,5126,5155,5128,5207],
    [5157,5128,5195,5177,5238,5190],
    [5295,5124,5279,5085,5284,5007],
    [5300,5134,5292,5054,5308,5099],
    [5222,4976,5245,4948,5279,4974],
    [5162,5027,5186,4987,5237,4981],
    [5141,4709,5180,4719,5164,4706],
    [5230,4790,5226,4821,5241,4855],
    [5112,5122,5160,5181,5159,5162],
    [4956,5303,5052,5318,5091,5284],
    [4994,5141,5028,5131,5066,5151]]

  let relCoords_tr = [];
  const denTr = 10000
  coords_tr.forEach(i => relCoords_tr.push([w(i[0]/denTr) - w(.5),h(i[1]/denTr) - h(.5),w(i[2]/denTr) - w(.5),h(i[3]/denTr) - h(.5),w(i[4]/denTr) - w(.5),h(i[5]/denTr) - h(.5)]))
  relCoords_tr.forEach(i => triangle(i[0],i[1],i[2],i[3],i[4],i[5]))

  let coords_c = [

    [4776,5090,68],
    [4886,5076,65],
    [4951,5035,9],
    [4819,5121,74],
    [4876,5181,6],
    [5028,5037,37],
    [5149,4796,84],
    [5133,4887,96],
    [5230,4882,11],
    [5241,4869,4],
    [5205,5077,7],
    [5245,5007,4],
    [5256,5141,54],
    [5014,5228,84],
    [4952,5247,52],
    [4966,5207,61],
    [4963,5138,6],
    [4992,5145,14],
    [5103,5220,5],
    [5138,5193,22],
    [5132,5161,19],
    [5149,5211,16],
    [5057,5102,5],
    [5091,5106,2],
    [4867,5001,6],
    [5083,5020,24],
    [5117,4997,3]]

  let relcoords_c = [];
  const denC = 10000
  coords_c.forEach(i => relcoords_c.push([w(i[0]/denC) - w(.5),h(i[1]/denC) - h(.5),w(i[2]/(denC/2))]))
  relcoords_c.forEach(i => ellipse(i[0],i[1],i[2]))
  pop()
}

function moth_6(x,y,sc,rot) {

  push()
  //translate(-width/2,-height/2)
  translate(x,y)
  rotate(rot + frameCount / 300)
  scale(sc)

  let coords_tr = [

      [4735,5488,4829,5277,5000,5094],
      [4951,5304,5058,5339,5116,5336],
      [5238,5212,5141,5113,5265,5190],
      [5237,5164,5237,5062,5168,5012],
      [5076,4512,5141,4614,5141,4695],
      [5136,4711,5151,4967,5191,4912],
      [5220,5248,5216,5305,5025,5297],
      [5168,5253,5000,5094,5034,5084],
      [5063,5033,5037,4860,5084,4623],
      [5076,5111,5088,4814,5191,5091]]

  let relCoords_tr = [];
  const denTr = 10000
  coords_tr.forEach(i => relCoords_tr.push([w(i[0]/denTr) - w(.5),h(i[1]/denTr) - h(.5),w(i[2]/denTr) - w(.5),h(i[3]/denTr) - h(.5),w(i[4]/denTr) - w(.5),h(i[5]/denTr) - h(.5)]))
  relCoords_tr.forEach(i => triangle(i[0],i[1],i[2],i[3],i[4],i[5]))

  let coords_c = [

      [5035,5225,106],
      [4886,5324,47],
      [4763,5483,9],
      [4776,5443,15],
      [4859,5340,5],
      [5056,5055,39],
      [5181,5231,49],
      [5223,5231,27],
      [5192,5118,39],
      [5131,5115,12],
      [5147,4966,18],
      [5157,5001,11],
      [5107,4760,58],
      [5072,4542,23],
      [5096,4710,48],
      [5108,4630,26],
      [5070,4581,12],
      [5066,4613,6],
      [5111,4893,69],
      [4953,5323,1],
      [4929,5252,24],
      [4841,5377,27],
      [4796,5396,25],
      [5070,4678,22],
      [5065,4656,22],
      [5279,5196,6],
      [5118,5325,11]]

  let relcoords_c = [];
  const denC = 10000
  coords_c.forEach(i => relcoords_c.push([w(i[0]/denC) - w(.5),h(i[1]/denC) - h(.5),w(i[2]/(denC/2))]))
  relcoords_c.forEach(i => ellipse(i[0],i[1],i[2]))
  pop()
}

function moth_7(x,y,sc,rot) {

  push()
  //translate(-width/2,-height/2)
  translate(x,y)
  rotate(rot + frameCount / 300)
  scale(sc)

  let coords_tr = [
    
    [4794,4819,4832,4824,4888,4903],
    [4816,5006,4789,4872,4780,4954],
    [4846,5011,4872,4997,4905,4925],
    [4775,5057,4782,5029,4804,5019],
    [4801,5103,4826,5167,4853,5122],
    [4901,5175,4923,5147,4923,5080],
    [4947,5182,4942,5158,4955,5020],
    [4978,4913,5039,4889,5135,4886],
    [4983,4921,4962,4942,4983,4982],
    [5073,5000,5104,5019,5151,4997],
    [5161,4964,5206,4942,5225,4911],
    [5008,5116,5086,5066,5074,5038],
    [4969,4992,4988,4990,5046,5023],
    [4961,5008,4975,5178,5004,5135],
    [4817,5032,4853,5023,4885,5049],
    [4888,5174,4876,5158,4867,5057],
    [4902,5128,4890,5035,4924,5000],
    [4992,4984,5061,5011,5224,4906],
    [4824,5097,4858,5048,4860,5080]]

  let relCoords_tr = [];
  const denTr = 10000
  coords_tr.forEach(i => relCoords_tr.push([w(i[0]/denTr) - w(.5),h(i[1]/denTr) - h(.5),w(i[2]/denTr) - w(.5),h(i[3]/denTr) - h(.5),w(i[4]/denTr) - w(.5),h(i[5]/denTr) - h(.5)]))
  relCoords_tr.forEach(i => triangle(i[0],i[1],i[2],i[3],i[4],i[5]))

  let coords_c = [

    [4835,4958,5],
    [4806,4901,25],
    [4812,4830,13],
    [4794,4827,8],
    [4873,4942,2],
    [4853,4889,19],
    [4826,4875,29],
    [4896,4926,9],
    [4898,4909,3],
    [4884,4904,6],
    [4777,4962,3],
    [4809,5059,36],
    [4820,5107,21],
    [4838,5155,17],
    [4851,5137,12],
    [4892,5160,15],
    [4906,5128,8],
    [4896,5105,21],
    [4901,5070,25],
    [4919,5050,1],
    [4928,4974,31],
    [4914,4999,15],
    [4915,5017,14],
    [4885,5143,9],
    [4883,5124,2],
    [4961,5172,21],
    [4981,5096,32],
    [4975,5011,2],
    [4990,5035,35],
    [5038,5060,25],
    [5062,5044,14],
    [4869,5065,11],
    [4863,5046,4],
    [4830,5026,3],
    [4890,5040,5],
    [4788,4815,3],
    [4791,4862,9],
    [4800,4853,8],
    [4987,4939,27],
    [5133,4987,21],
    [5200,4915,19],
    [5220,4906,1],
    [5139,4921,36],
    [5056,4930,43],
    [4996,4967,11],
    [4993,4980,5],
    [5161,4960,8],
    [5174,4965,1],
    [5144,4965,3],
    [5077,5006,6],
    [5064,5011,3],
    [5102,4892,3],
    [4856,5102,18],
    [5014,5119,7],
    [4987,5175,5],
    [5051,5030,5]]

  let relcoords_c = [];
  const denC = 10000
  coords_c.forEach(i => relcoords_c.push([w(i[0]/denC) - w(.5),h(i[1]/denC) - h(.5),w(i[2]/(denC/2))]))
  relcoords_c.forEach(i => ellipse(i[0],i[1],i[2]))
  pop()
}