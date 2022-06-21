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
    dark: [35, 52, 99],
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
let particlesWater = [];
let particlesIn = [];
let particlesIn2 = [];
let spiralMoths = []
let numP;
let numP_Out;
let numP_Top;
let bgNumRows;
let numP_In;
let numP_In2;
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

let zoff = 0;
let irregCircs = []
let numCircs;


///////////////////////////////////////////////////////

function setup() {
  noiseSeed(seed)
  const smD = windowWidth < windowHeight ? windowWidth : windowHeight;
  createCanvas(smD, smD);
  graphics = createGraphics(smD,smD);
  bg = createGraphics(smD,smD);

  pal = choosePalette()
  console.log(choosePalette_Name())

  gridType = chooseGrid()

  //linearTexture()

  setIrregCircles()

  setWater()
  setMovingBackground()
  setFog()
  //setInParticles()
  setInParticles2(gridType)

  //daubing()
  //patchDaubing()

  setBgDaubs()
  setBgDaubs_blackWhite()


  if (gridType === 'spirals_in') {
    setSpiralMoths()
  }
  if (gridType === circleGrid || shaftGrid) {
    mothsSetup(gridType)
  }


  moths = createGraphics(smD,smD, WEBGL);


}

function draw() {
  let cCoeff = map(mouseY,-h(.5),h(.5),0,1)
  background(pal.dark[0]*cCoeff, pal.dark[1]*cCoeff, pal.dark[2]*cCoeff,125)
  moths.background(pal.dark[0]*cCoeff, pal.dark[1]*cCoeff, pal.dark[2]*cCoeff,125)


  translate(width/2,height/2)


  //oldWater()


  imageMode(CENTER)
  image(bg, 0, 0)
  image(graphics, 0, 0)
  concTexture(.1, pal.light)

  drawIrregCircles()

  water()
  movingBackground()
  //inParticles()
  inParticles2()
  
  gridType = chooseGrid()

  //let light2_mouse = mouseX-w(.5)
  moths.ambientLight(90)
  moths.pointLight(78, 57, 39, moths.mouseX, moths.mouseY, w(.08))

  if (gridType === 'spirals_in') {
    drawSpiralMoths()
  }
  if (gridType === circleGrid || shaftGrid) {
    drawGridMoths()
  }

  image(moths, 0, 0)

  topFog()


  if (play){
    loop()
  }else{
    noLoop()
  }
  play != play;
  console.log(frameRate())
}


///////////////////////////////////////////////////////


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
    if (gridPercent < .33) {
      chosenGrid = circleGrid
    }else if (gridPercent < .66) {
      chosenGrid = shaftGrid
    }else{
      chosenGrid = 'spirals_in'
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


////////////////////// TEXTURE COMPONENETS ///////////////////////


function tS_original(x1, y1, x2, y2, weight, r, g, b, alpha) {
  push()
  const relWeight = graphics.map(weight, 0, width, 1, 40);
  graphics.stroke(r, g, b, alpha)
  graphics.strokeWeight(w(0.001));
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

function texturedCircle(init_distort,line_val,size,inc,diff,max_distort,col) {
  push()
  let zoff = 0
  let t = frameCount * 3 + rnd(TWO_PI)
  let d = 1
  graphics.angleMode(graphics.DEGREES)
  if (frameCount < 50) {
    let xoff = map(cos(t+diff), -1, 1, 0, 1)
    let yoff = map(sin(t-diff), -1, 1, 0, 1)
    let r = map(noise(xoff, yoff), 0, 1, size, size-rnd(w(.01),max_distort*noise(xoff, yoff, zoff)))
    let x1 = graphics.width/2 + init_distort + d*r * cos(t)
    let y1 = graphics.height/2 + init_distort + d*r * sin(t)
    let x2 = graphics.width/2 + init_distort + d*r * cos(t + line_val*2)
    let y2 = graphics.height/2 + init_distort + d*r * sin(t + line_val*2)
    let alpha_coeff = map(dist(x2-x1,y2-y1,0,0),w(.01),w(.02),0,1)
    let coeff = map(dist(x2-x1,y2-y1,0,0),0,w(.25),0,1)
    let weight_coeff = map(dist(x2-x1,y2-y1,0,0),w(.01),w(.65),.1,1.5)
    tS_original(x1, y1, x2, y2, w(.15)*weight_coeff, col[0]*coeff, col[1]*coeff, col[2]*coeff, rnd(7)*alpha_coeff)
    zoff += inc/5;
  }
  pop()
}

function concTexture(line_val, col) {
  push()
  graphics.blendMode(graphics.OVERLAY)
  graphics.noFill()
  //graphics.translate(-graphics.width/2,0)
  let num_circs = 50
  let xoff = 0
  for (let i = 0; i < num_circs; i++) {
    let i_d = rnd(-w(.05), w(.05))
    //let i_d = 0
    translate(rnd(w(.01),rnd(h(.01))))
    let size = map(i,0,num_circs,w(.023),w(.85))
    let inc = .003
    let c = map(size,0,w(1),0,2)
    let alpha_coeff = map(size,0,w(.15),.1,.6)
    rotate(i*30)
    texturedCircle(i_d,line_val,size,inc,0,w(.03),col)
    texturedCircle(i_d,line_val,size,inc*15,30,w(.03),col)
    texturedCircle(i_d,line_val,size,inc*25,60,w(.03),col)
    texturedCircle(i_d,line_val,size,inc*15,90,w(.03),col)
    //texturedCircle(i_d,line_val,size,inc*25,120,w(.03),col)
    //texturedCircle(i_d,line_val,size,inc*15,270,w(.03),col)
    //texturedCircle(i_d,line_val,size,inc*25,300,w(.03),col)
    xoff += .01
  }
  pop()
}

function linearTexture() {
  push()
  graphics.blendMode(graphics.BLEND)
  graphics.translate(graphics.width/2,0)
  for (let i = 0; i < 250; i++){
    let ts_x = map(i,0,250,-graphics.width/2,graphics.width/2)
    let c = map(dist(ts_x,0,0,0),0,graphics.width/2,0,.5)
    let ALPHA_COEFF = map(dist(ts_x,0,0,0),0,graphics.width/2,0.4,1)
    let ts_y1 = -h(0.1)
    let ts_y2 = h(1.1)
    tS_original(ts_x, ts_y1, ts_x, ts_y2, w(.35), 10*c, 10*c, 10*c, 10*ALPHA_COEFF)
    tS_original(ts_x, ts_y1, ts_x, ts_y2, w(.35), pal.light[0]*c, pal.light[1]*c, pal.light[2]*c, 20*ALPHA_COEFF)
  }
  graphics.noLoop();
  pop()
}

function oldWater() {
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
      let xPos = x * scl;
      let yPos = y * scl;
      // IF USING THIS VERSION OF c - use general brightness as potential attribute
      let c = map(noise(xoff, yoff), 0, 1, -1, map(mouseY,0,width,0,2)) + map(dist(xPos,yPos,mouseX,mouseY),0,w(1),1.8,0)
      fill(c * pal.light[0], c * pal.light[1], c * pal.light[2], c * 5); // 25, 91, 214
      noStroke();
      xoff += 0.6;
      //var angle = atan2(width/2,height/2);
      var mult = map(sin(x*y*30),-1,1,.3,.9)
      //rect(xPos, yPos, scl, scl);
      ellipse(xPos, yPos, scl*mult*1.5)
      fill(c * pal.light[0], c * pal.light[1], c * pal.light[2], c * 10); // 25, 91, 214
      ellipse(xPos, yPos, scl*mult)
    }
    yoff += 0.6;
  }
  pop()
}

function blurredEllipse(x,y,size,r,g,b,a) {
  for (let i = 0; i < 4; i++){ // reduced to be lighter
    let off = w(.005)
    fill(r,g,b,a*i*.5)
    noStroke()
    ellipse(x+off*i,y+off*i,1.6*size - (size/3)*i)
  }
}

function blurredEllipse_bg(x,y,size,r,g,b,a) {
  for (let i = 0; i < 4; i++){ // reduced to be lighter
    //let off = rnd(-w(.01),w(.01))
    let angle = rnd(TWO_PI)
    let radius = rnd(w(.12))
    let off_x = sin(angle) * i * radius
    let off_y = cos(angle) * i * radius
    bg.fill(r,g,b,a*i*.5)
    bg.noStroke()
    bg.ellipse(x+off_x*i,y+off_y*i,1.6*size - (size/3)*i)
  }
}

function fogEllipse(x,y,size,r,g,b,a) {
  for (let i = 0; i < 4; i++){ // reduced to be lighter 
    fill(r,g,b,(i/a)*(2.5*i))
    noStroke()
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


////////////////////// TEXTURE SETUP AND DRAW FUNCS ///////////////////////

function setBgDaubs() {
  push()
  let col = pal.accent_dark
  let num_dots = 60
  let cell_size = height/num_dots
  let xoff = 0
  let inc = 10/num_dots
  let default_size = 2.5*cell_size
  bg.noStroke()
  for (let i = 0; i < num_dots; i++){
    let yoff = 0
    for (let j = 0; j < num_dots; j++){
      let x = i*cell_size + w(.01 * noise(xoff, yoff));
      let y = j*cell_size + w(0.01 * noise(xoff + 1000, yoff + 1000))
      //let colorCoeff = map(sin(x*j),-1,1,-45,45)
      let colorCoeff = map(dist(x,y,width/2,height/2),0,w(.6),1.1,.6)
      //bg.fill(col[0]+colorCoeff, col[1]+colorCoeff, col[2]+colorCoeff, 222)
      //bg.ellipse(x,y,default_size * noise(xoff + 2000, yoff + 2000))
      blurredEllipse_bg(x,y,default_size * noise(xoff + 2000, yoff + 2000),col[0]*colorCoeff, col[1]*colorCoeff, col[2]*colorCoeff, 100)
      yoff += inc
    }
    xoff += inc
  }
  pop()
}

function setBgDaubs_blackWhite() {
  push()
  let col = pal.accent_dark
  let num_dots = 30
  let cell_size = height/num_dots
  let xoff = 0
  let inc = 10/num_dots
  let default_size = .5*cell_size
  bg.noStroke()
  for (let i = 0; i < num_dots; i++){
    let yoff = 0
    for (let j = 0; j < num_dots; j++){
      let x = i*cell_size + w(.01 * noise(xoff, yoff));
      let y = j*cell_size + w(0.01 * noise(xoff + 1000, yoff + 1000))
      //let colorCoeff = map(sin(x*j),-1,1,-45,45)
      let c = rnd(255)
      //bg.fill(col[0]+colorCoeff, col[1]+colorCoeff, col[2]+colorCoeff, 222)
      //bg.ellipse(x,y,default_size * noise(xoff + 2000, yoff + 2000))
      blurredEllipse_bg(x,y,default_size * noise(xoff + 2000, yoff + 2000),c,c,c, 25)
      yoff += inc
    }
    xoff += inc
  }
  pop()
}

function setWater() {
  push()
  //translate(-width/2 + scl/2,-height/2 + scl/2)
  bgNumRows = 8;
  scl = width/bgNumRows;
  yoff = 0;
  for (let y = 0; y < bgNumRows * 2; y++) {
    xoff = 0;
    for (let x = 0; x < bgNumRows * 2; x++) {
      let xPos = x * scl - width/2 + scl/2;
      let yPos = y * scl - height/2 + scl/2;
      let col = [pal.light[0], pal.light[1], pal.light[2]]; // 25, 91, 214 // inverse alpha
      p = new ParticleWater(xPos,yPos,w(.03),col,30);
      particlesWater.push(p);
      xoff += 0.6;
    }
    yoff += 0.6;
  }
  pop()
}

function water() {
  push()
  for (let i = 0; i < particlesWater.length; i++) {
    particlesWater[i].run()
  }
  pop()
}

function setMovingBackground() {
  numP = 150;
  for (let i = 0; i < numP; i++){
    let radius = map(i,0,numP,w(.003),w(.65))
    let colVals = [pal.accent_light[0], pal.accent_light[1], pal.accent_light[2]]
    p = new Particle(radius,w(.06),colVals,w(.15),60);
    particles.push(p);
  }
  numP_Out = 110;
  for (let i = 0; i < numP_Out; i++){
    let radius = map(i,0,numP,w(.05),w(.65))
    let colVals = [pal.accent_dark[0], pal.accent_dark[1], pal.accent_dark[2]]
    p = new Particle(radius,w(.03),colVals,w(.25),35);
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
  numP_Top = 250;
  for (let i = 0; i < numP_Out; i++){
    let radius = map(i,0,numP,w(.01),w(.3))
    let colVals = [pal.accent_light[0], pal.accent_light[1], pal.accent_light[2]]
    p = new ParticleTop(radius,w(.05),colVals,w(.02),.2);
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

function setInParticles2(gridType) {
  numP_In2 = 250;
  for (let i = 0; i < numP_In2; i++) {
    let radius = rnd(w(.01),w(.65))
    let angle = rnd(TWO_PI)
    let size = rnd(w(.01),w(.03))
    //let diff = random(.85,1.15)
    let speedCoeff = random(1,3)
    let x = radius*cos(angle)
    let y = radius*sin(angle)
    let c = rnd(255)
    let col = [c,c,c]
    let p = new ParticleIn2(x,y,size,radius,angle,speedCoeff,col,gridType)
    particlesIn2.push(p);
  }
}

function inParticles2() {
  push()
  for (let i = 0; i < particlesIn2.length; i++){
    particlesIn2[i].run();
  }
  pop()
}


////////////////////// GRIDS ///////////////////////


////////////////////// CLASSES ///////////////////////

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
    if (this.x < -w(.55) || this.x > w(.55) || this.y < -h(.55) || this.y > h(.55)) {    
      this.x = 0
      this.y = 0
    }
  }

  show() {
    noStroke()
    fill(255)
    //ellipse(this.x+this.off,this.y+this.off,w(.001))
    let c = map(dist(this.x,this.y,0,0),0,w(.65),.8,.1)
    let mouseC = map(dist(this.x,this.y,mouseX-width/2,mouseY-height/2),0,w(.65),map(c,.8,.1,25,80),12)
    let adjSize = map(dist(this.x,this.y,0,0),0,w(.65),.5,2.5) * this.size
    blurredEllipse(this.x,this.y,adjSize,this.col[0]*c+mouseC,this.col[1]*c+mouseC,this.col[2]*c+mouseC,this.alpha) 
  }
}

class ParticleWater{
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
    let mouseC = map(dist(this.x,this.y,mouseX-width/2,mouseY-height/2),0,w(.35),map(c,.8,.1,20,60),10)
    let adjSize = map(dist(this.x,this.y,0,0),0,w(.65),.5,2.5) * this.size
    blurredEllipse(this.x,this.y,adjSize,this.col[0]*c+mouseC,this.col[1]*c+mouseC,this.col[2]*c+mouseC,this.alpha,this.col[3]) 
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
    fogEllipse(this.x,this.y,adjSize,this.col[0]*c,this.col[1]*c,this.col[2]*c,this.alpha*(1/c)) 
    fogEllipse(this.x2,this.y2,adjSize,this.col[0]*c,this.col[1]*c,this.col[2]*c,this.alpha*(1/c)) 
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
    let c = map(dist(this.x,this.y,0,0),0,w(.7),.5,.25)
    //let mouseC = map(dist(this.x,this.y,mouseX-width/2,mouseY-height/2),0,w(.65),map(c,.8,.1,30,150),15)
    let adjSize = map(dist(this.x,this.y,0,0),0,w(.8),0,1) * this.size
    //fogEllipse(this.x,this.y,adjSize,this.col[0],this.col[1],this.col[2],3*c) 
    fill(this.col[0],this.col[1],this.col[2],50)
    ellipse(this.x,this.y,adjSize)
  }
}

class ParticleIn2{
  constructor(_x,_y,_size,_radius,_angle,_speedCoeff,_col,_gridType){
    this.x = _x;
    this.y = _y;
    this.size = _size;
    this.radius = _radius;
    this.angle = _angle;
    this.speedCoeff = _speedCoeff;
    this.col = _col;
    this.gridType = _gridType
  }

  run() {
    this.update();
    this.checkEdges();
    this.show();
  }

  update() {
    if (this.gridType === shaftGrid) {
      t = 0
      t += .5 * this.speedCoeff
      let tr = frameCount * .001
      tr *= sin(t)
      rotate(tr)
      this.x *= map(t,0,50,1,.1)
      this.y *= map(t,0,50,1,.1)
    }

    if (this.gridType === 'spirals_in') {
      let t = 0
      t += .5 * this.speedCoeff
      let tr = 0
      //rotate(frameCount * .0001)
      this.x *= map(t,0,50,1,.1)
      this.y *= map(t,0,50,1,.1)
      tr += 50 * this.speedCoeff
    }

    if (this.gridType === circleGrid) {
      let breathingAngle = frameCount / 30
      let breathingX = map(sin(breathingAngle),-1,1,-w(.001),w(.001))
      let breathingY = map(sin(breathingAngle),-1,1,-h(.001),h(.001))
      this.x += breathingX
      this.y += breathingY
    }

  }

  checkEdges() {
    if (dist(this.x,this.y,0,0) < w(.1)) {
      let newRadius = random(w(.45),w(.65))
      let newAngle = frameCount / 90
      this.x = newRadius*cos(this.angle)
      this.y = newRadius*sin(this.angle)
    }
  }

  show() {
    /*let breathing = 1
    if (this.gridType === circleGrid) {
      let breathingAngle = frameCount / 30
      breathing = map(sin(breathingAngle),-1,1,1,1.1)
    }*/
    noStroke()
    fill(255)
    let c = map(dist(this.x,this.y,0,0),0,w(.7),.5,.25)
    //let mouseC = map(dist(this.x,this.y,mouseX-width/2,mouseY-height/2),0,w(.65),map(c,.8,.1,30,150),15)
    let adjSize = map(dist(this.x,this.y,0,0),0,w(.8),.3,1) * this.size
    fogEllipse(this.x,this.y,adjSize,this.col[0],this.col[1],this.col[2],1*c) 
    //fill(this.col[0],this.col[1],this.col[2],50)
    //ellipse(this.x,this.y,adjSize)
  }
}


////////////////////// GRIDS ///////////////////////

function circleGrid() {
  push()
  let num_rows = 13
  let r_inc = w(.055)
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

function mothsSetup(grid) {
  push()

  if (grid === 'sprials_in') {
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
      let rot = rnd(-PI,PI) + i/15
      //let rot = rnd(TWO_PI) + i/2

      p = new Buttermoth_Spiral(x,y,size,radius,angle,speedCoeff,met,moth,rot,mothScale)
      spiralMoths.push(p);
    }
  }
  if (grid === circleGrid){
    circleGrid()
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
      let rot = rnd(-TWO_PI,TWO_PI) + rnd(PI)
      buttermoths.push(new Buttermoth(loc, dir, speed, moth, mothScale, met, start, rot, grid));
      console.log(buttermoths.length)
    }
  }
  if (grid === shaftGrid){
    shaftGrid()
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
      let rot = rnd(-PI,PI) + i/15 + rnd(PI)
      buttermoths.push(new Buttermoth(loc, dir, speed, moth, mothScale, met, start, rot, grid));
      console.log(buttermoths.length)
    }
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

function drawGridMoths() {
  let fM_xoff = 0;
  let fM_yoff = 1000;
  let fM_inc = .1;
  for (let i = 0; i < buttermoths.length; i++) {
    buttermoths[i].run(fM_xoff,fM_yoff);
    fM_xoff += fM_inc;
    fM_yoff += fM_inc;
  }
}


////////////////////// MOTHS ///////////////////////

function chooseMoth() { 
  const mothOptions = [moth_5, moth_6, moth_7, moth_9];
  return mothOptions[floor(rnd()*mothOptions.length)];
}

function moth_5(x,y,sc,rot) {

  moths.push()
  //translate(-width/2,-height/2)
  moths.translate(x,y)
  moths.rotate(rot + frameCount / 300)
  moths.scale(sc)

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

  let coords_c = [

    [7257,2203,6],
    [3233,6112,8],

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
    [5091,5106,7],
    [4867,5001,6],
    [5083,5020,24],
    [5117,4997,3]]

  let relcoords_c = [];
  const denC = 10000
  coords_c.forEach(i => relcoords_c.push([w(i[0]/denC) - w(.5),h(i[1]/denC) - h(.5),w(i[2]/(denC/2))]))
  relcoords_c.forEach(i => moths.ellipse(i[0],i[1],i[2]))

  let relCoords_tr = [];
  const denTr = 10000
  coords_tr.forEach(i => relCoords_tr.push([w(i[0]/denTr) - w(.5),h(i[1]/denTr) - h(.5),w(i[2]/denTr) - w(.5),h(i[3]/denTr) - h(.5),w(i[4]/denTr) - w(.5),h(i[5]/denTr) - h(.5)]))
  relCoords_tr.forEach(i => moths.triangle(i[0],i[1],i[2],i[3],i[4],i[5]))
  moths.pop()
}

function moth_6(x,y,sc,rot) {

  moths.push()
  //translate(-width/2,-height/2)
  moths.translate(x,y)
  moths.rotate(rot + frameCount / 300)
  moths.scale(sc)

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

  let coords_c = [

    [4137,1645,12],
    [6888,9000,7],

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
    [4953,5323,8],
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
  relcoords_c.forEach(i => moths.ellipse(i[0],i[1],i[2]))

  let relCoords_tr = [];
  const denTr = 10000
  coords_tr.forEach(i => relCoords_tr.push([w(i[0]/denTr) - w(.5),h(i[1]/denTr) - h(.5),w(i[2]/denTr) - w(.5),h(i[3]/denTr) - h(.5),w(i[4]/denTr) - w(.5),h(i[5]/denTr) - h(.5)]))
  relCoords_tr.forEach(i => moths.triangle(i[0],i[1],i[2],i[3],i[4],i[5]))

  moths.pop()
}

function moth_7(x,y,sc,rot) {

  moths.push()
  //translate(-width/2,-height/2)
  moths.translate(x,y)
  moths.rotate(rot + frameCount / 300)
  moths.scale(sc)

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

  let coords_c = [

    [2112,3845,8],
    [8191,2344,12],

    [4835,4958,5],
    [4806,4901,25],
    [4812,4830,13],
    [4794,4827,8],
    [4873,4942,5],
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
    [4919,5050,8],
    [4928,4974,31],
    [4914,4999,15],
    [4915,5017,14],
    [4885,5143,9],
    [4883,5124,2],
    [4961,5172,21],
    [4981,5096,32],
    [4975,5011,7],
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
    [5220,4906,6],
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
  relcoords_c.forEach(i => moths.ellipse(i[0],i[1],i[2]))

  let relCoords_tr = [];
  const denTr = 10000
  coords_tr.forEach(i => relCoords_tr.push([w(i[0]/denTr) - w(.5),h(i[1]/denTr) - h(.5),w(i[2]/denTr) - w(.5),h(i[3]/denTr) - h(.5),w(i[4]/denTr) - w(.5),h(i[5]/denTr) - h(.5)]))
  relCoords_tr.forEach(i => moths.triangle(i[0],i[1],i[2],i[3],i[4],i[5]))

  moths.pop()
}

function moth_8(x,y,sc,rot) {    
  
  moths.push()
  //translate(-width/2,-height/2)
  moths.translate(x,y)
  moths.rotate(rot + frameCount / 300)
  moths.scale(sc)

  let coords_tr = [
      
    [4703,4846,4724,4816,4835,4808],
    [4731,4866,4736,4907,4772,4928],
    [4772,4938,4812,4966,4879,4951],
    [4925,5002,4953,4979,4990,4970],
    [4995,4974,4977,5077,5012,5018],
    [4940,5050,4947,5100,4975,5152],
    [4999,5195,4979,5167,4997,5141],
    [5085,5063,5076,5096,5088,5144],
    [5087,5173,5099,5125,5101,5151],
    [5090,4915,5117,4863,5210,4818],
    [5104,4947,5131,4921,5169,4964],
    [5182,4956,5213,4954,5236,4933],
    [5205,4918,5233,4890,5242,4830],
    [5248,4825,5242,4867,5294,4818],
    [5070,4991,5090,4966,5140,4985],
    [5120,5072,5130,5033,5174,5034],
    [5154,5027,5186,5026,5195,5006],
    [4882,4829,4928,4839,4992,4894],
    [4842,4852,4866,4908,4984,4938],
    [4905,4921,4935,4961,5008,4951],
    [4944,5035,4955,4993,4996,4969],
    [4791,4881,4799,4816,4842,4905],
    [4993,4932,4954,4878,4992,4899],
    [5201,4905,5246,4820,5212,4830],
    [4902,5005,4917,5005,4936,4989],
    [4979,5081,4994,5058,4993,5096],
    [5073,5034,5089,5009,5086,5027]]

  let coords_c = [

    [4759,4858,37],
    [4708,4845,6],
    [4808,4916,39],
    [4827,4940,29],
    [4840,4845,33],
    [4876,4862,35],
    [4970,4934,26],
    [4880,4946,7],
    [4899,4916,18],
    [4902,5020,15],
    [4930,5027,26],
    [4987,4983,12],
    [4993,4969,3],
    [4970,5101,19],
    [4972,5053,26],
    [4987,5157,13],
    [4997,5195,3],
    [5085,5177,2],
    [5088,5167,5],
    [5128,5020,37],
    [5181,5008,16],
    [5192,4993,2],
    [5072,4993,2],
    [5086,4997,7],
    [5091,5084,11],
    [5104,5062,16],
    [5092,5130,7],
    [5099,5117,7],
    [5103,5105,5],
    [5105,5098,4],
    [5087,5104,8],
    [5091,5150,4],
    [5164,4914,49],
    [5103,4920,12],
    [5090,4919,4],
    [5076,4937,5],
    [5106,4932,11],
    [5082,4942,4],
    [5105,4949,6],
    [5228,4934,11],
    [5253,4829,22],
    [5281,4817,7],
    [5229,4816,4],
    [5212,4813,2],
    [5205,4850,24],
    [5212,4878,7],
    [5295,4815,2],
    [5238,4861,9],
    [4921,4858,2],
    [4737,4892,16],
    [4718,4875,2],
    [4835,4811,3],
    [4867,4909,3],
    [4875,4923,8],
    [4878,4929,8],
    [4983,5107,15],
    [4990,5115,12],
    [4991,5128,1],
    [5087,5001,8],
    [5100,5058,15],
    [5093,5044,18],
    [5173,5034,4],
    [5114,5099,1],
    [5117,5079,3],
    [5050,4934,3],
    [4986,5012,12]]

  let relcoords_c = [];
  const denC = 10000
  coords_c.forEach(i => relcoords_c.push([w(i[0]/denC) - w(.5),h(i[1]/denC) - h(.5),w(i[2]/(denC/2))]))
  relcoords_c.forEach(i => moths.ellipse(i[0],i[1],i[2]))

  let relCoords_tr = [];
  const denTr = 10000
  coords_tr.forEach(i => relCoords_tr.push([w(i[0]/denTr) - w(.5),h(i[1]/denTr) - h(.5),w(i[2]/denTr) - w(.5),h(i[3]/denTr) - h(.5),w(i[4]/denTr) - w(.5),h(i[5]/denTr) - h(.5)]))
  relCoords_tr.forEach(i => moths.triangle(i[0],i[1],i[2],i[3],i[4],i[5]))

  moths.pop()
}

function moth_9(x,y,sc,rot) {

  moths.push()
  //translate(-width/2,-height/2)
  moths.translate(x,y)
  moths.rotate(rot + frameCount / 300)
  moths.scale(sc)

  let coords_tr = [

    [4529,4614,4632,4584,4544,4633],
    [4565,4663,4647,4584,4544,4633],
    [4853,4686,4805,4637,4647,4584],
    [4659,4782,4611,4744,4572,4663],
    [4589,4671,4757,4870,4708,4727],
    [4601,4629,4853,4686,4647,4584],
    [4836,4688,4893,4716,4948,4799],
    [4757,4870,4836,4688,4708,4727],
    [4970,4829,4953,4870,4841,4699],
    [4899,4813,4934,4862,4923,4870],
    [4601,4629,4652,4688,4836,4688],
    [4772,4870,4841,4699,4865,4799],
    [4772,4870,4836,4891,4923,4878],
    [4811,4859,4892,4754,4926,4870],
    [4768,4995,4806,4941,4910,4901],
    [4861,5108,4768,4995,4917,4898],
    [4880,5145,4865,5191,4876,5263],
    [4899,5394,4910,5325,4888,5243],
    [4913,5102,4951,5083,4951,4992],
    [4939,4965,4967,4927,4934,4888],
    [4951,4992,4939,4965,4913,5102],
    [4880,5145,4873,5062,4932,4898],
    [4876,5263,4917,4992,4926,5105],
    [4993,5006,4976,4965,4988,4907],
    [5000,4862,5014,4927,5020,4878],
    [5000,4901,5014,5011,5027,4965],
    [5039,4907,5061,4880,5154,5047],
    [5048,4930,5062,5030,5089,5090],
    [5074,4977,5100,5102,5119,5031],
    [5061,4880,5227,4923,5168,5042],
    [5233,4927,5241,4954,5168,5042],
    [5125,5039,5154,5112,5119,5192],
    [5126,5221,5114,5263,5134,5383],
    [5136,5367,5154,5332,5124,5138],
    [5035,4817,5101,4686,5435,4715],
    [5035,4825,5374,4791,5279,4850],
    [5130,4681,5149,4654,5435,4715],
    [5168,4649,5278,4605,5435,4715],
    [5379,4613,5391,4678,5442,4713],
    [5388,4611,5462,4652,5442,4713],
    [5287,4602,5342,4594,5435,4616],
    [5000,4850,5014,4812,5000,4794]]

  let coords_c = [

    [5422,4631,21],
    [5446,4647,28],
    [5078,4818,39],
    [4991,4824,24],
    [4998,4895,18],
    [5002,4997,18],
    [4997,4926,04],
    [4995,4866,03],
    [4668,4653,41],
    [4712,4668,45],
    [4756,4838,33],
    [4561,4643,20],
    [4531,4614,5],
    [4536,4596,20],
    [4871,4973,61],
    [4896,5395,7],
    [4887,5268,12],
    [4882,5287,14],
    [4882,5305,18],
    [4886,5327,13],
    [4902,5137,16],
    [5126,5189,11],
    [5136,5206,13],
    [5144,5130,2],
    [5216,4981,22],
    [5050,4888,03],
    [5086,4985,32],
    [5117,5013,26],
    [5136,5072,14],
    [5084,5072,10],
    [5074,5057,15],
    [5069,5040,9],
    [5128,5124,22],
    [5143,515,12],
    [5133,5377,12],
    [5130,5412,4],
    [5308,4769,56],
    [5353,4764,35],
    [5384,4754,17],
    [5400,4751,1],
    [5433,4696,22],
    [5450,4673,16],
    [4932,4856,6],
    [4944,4804,9],
    [4954,4813,05],
    [3124,1570,19],
    [6468,6807,6],
    [1931,8322,23]]

  let relcoords_c = [];
  const denC = 10000
  coords_c.forEach(i => relcoords_c.push([w(i[0]/denC) - w(.5),h(i[1]/denC) - h(.5),w(i[2]/(denC/2))]))
  relcoords_c.forEach(i => moths.ellipse(i[0],i[1],i[2]))

  let relCoords_tr = [];
  const denTr = 10000
  coords_tr.forEach(i => relCoords_tr.push([w(i[0]/denTr) - w(.5),h(i[1]/denTr) - h(.5),w(i[2]/denTr) - w(.5),h(i[3]/denTr) - h(.5),w(i[4]/denTr) - w(.5),h(i[5]/denTr) - h(.5)]))
  relCoords_tr.forEach(i => moths.triangle(i[0],i[1],i[2],i[3],i[4],i[5]))

  moths.pop()
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
    this.move()
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

    moths.noStroke()
    moths.specularMaterial(c * this.met[0], c * this.met[1], c * this.met[2], map(frameCount,this.start,this.start+10,0,10) + c * 0.2);
    //moths.specularMaterial(this.met[0], this.met[1], this.met[2], map(frameCount,this.start,this.start+10,0,90));

    this.moth(this.loc.x * breathing, this.loc.y * breathing, this.mothScale, map(sin(frameCount/120),-1,1,0,this.rot));

    //moths.specularMaterial(c * this.met[0], c * this.met[1], c * this.met[2], map(frameCount,this.start,this.start+10,0,90) + c * 0.8);
    //this.moth(this.loc.x * breathing, this.loc.y * breathing, this.mothScale, map(sin(frameCount/120),-1,1,0,this.rot));
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
    let relSpeed = this.speedCoeff * map(dist(this.x,this.y,0,0),w(.8),0,.5,2.5)
    t += .5 * relSpeed
    let tr = 0
    rotate(frameCount * .0003)
    this.x *= map(t,0,50,1,.1)
    this.y *= map(t,0,50,1,.1)
    tr += 50 * this.speedCoeff
  }

  checkEdges() {
    if (dist(this.x,this.y,0,0) < w(.02)) {
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
    moths.specularMaterial(c * this.met[0],c * this.met[1],c * this.met[2], map(dist(this.x,this.y,0,0),w(.045),w(.023),255,0))
    moths.noStroke()
    
    this.moth(this.x, this.y, this.mothScale * map(dist(this.x,this.y,0,0),w(.8),0,1.8,.35), map(sin(frameCount/120),-1,1,0,this.rot));
  }
}

////////////////////// EXTRA TEXTURE ///////////////////////

function irregCircle(radius,noiseVal) {
  //beginShape();
  for (let a = 0; a <= TWO_PI; a += .22) {
    let wavingAngle = frameCount / 60 + a
    let wavingX = map(sin(wavingAngle),-1,1,-w(.01),w(.01))
    let wavingY = map(cos(wavingAngle),-1,1,-w(.01),w(.01))
    let xoff = map(cos(a), -1, 1, noiseVal/3, noiseVal);
    let yoff = map(sin(a), -1, 1, noiseVal/3, noiseVal);
    let diff = map(noise(xoff, yoff, zoff), 0, 1, .65, 1.35);
    //let diff = 1
    let x = radius * diff * cos(a);
    let y = radius * diff * sin(a);
    let x2 = radius * diff * cos(a+5) + wavingX;
    let y2 = radius * diff * sin(a+5) + wavingY;
    let x3 = radius * diff * cos(a+3) + wavingX*2;
    let y3 = radius * diff * sin(a+3) + wavingY*2;
    //vertex(x, y);
    line(x,y,x2,y2)
    line(x2,y2,x3,y3)
  }
  //endShape(CLOSE);
  
  zoff += 0.0001;
}

function setIrregCircles() {
  numCircs = 6;
  for (let i = 0; i < numCircs; i++) {
    radius = map(i,0,numCircs,w(.03),w(.65))
    noiseVal = rnd(1,3)
    circ = new IrregCircle(radius,noiseVal);
    irregCircs.push(circ);
  }
}

function drawIrregCircles() {
  for (let i = 0; i < irregCircs.length; i++){
    irregCircs[i].run();
  }
}

class IrregCircle{
  constructor(_radius,_noiseVal) {
    this.radius = _radius;
    this.noiseVal = _noiseVal;
  }

  run() {
    this.update()
    this.checkEdges()
    this.show()
  }

  update() {
    this.radius += w(.001)
  }

  checkEdges() {
    if (this.radius > w(.73)) {
      this.radius = w(.01)
    }
  }

  show() {
    noFill()
    stroke(200,40)
    strokeWeight(1)
    irregCircle(this.radius,this.noiseVal)
    irregCircle(this.radius*1.33,this.noiseVal*2)
    irregCircle(this.radius*1.66,this.noiseVal*3)
  }
}