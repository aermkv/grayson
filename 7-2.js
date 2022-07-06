tokenData.hash = '0x95ed83b248cad08ea0a8aa90f4b986a8e7df31beb69b84c08630675f32377a73'
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

function bg1_w(val) {if (val == null) return bg1.width;return bg1.width * val;}
function bg1_h(val) {if (val == null) return bg1.height;return bg1.height * val;}

function r_w(val) {if (val == null) return rings.width;return rings.width * val;}
function r_h(val) {if (val == null) return rings.height;return rings.height * val;}

const palettes = {
  gray: {
    light: [204, 204, 204],
    dark: [67, 71, 74],
    accent_light: [235, 242, 247],
    accent_dark: [14, 22, 28]
  },
  orange: {
    light: [194, 165, 99],
    dark: [156, 68, 23],
    accent_light: [247, 227, 168],
    accent_dark: [79, 18, 6]
  },
  red: {
    light: [237, 64, 45],
    dark: [125, 20, 9],
    accent_light: [217, 50, 97],
    accent_dark: [97, 30, 49]
  },
  blue: {
    light: [25, 91, 214],
    dark: [35, 52, 99],
    accent_light: [204, 235, 230],
    accent_dark: [44, 77, 60]
  },
  yellow: {
    light: [252, 186, 3],
    dark: [255, 240, 199],
    accent_light: [255, 252, 82],
    accent_dark: [181, 130, 27]
  },
  matisse: {
    light: [199, 221, 237],
    dark: [177, 151, 204],
    accent_light: [250, 187, 217],
    accent_dark: [222, 82, 67]
  },
  pinks: {
    light: [255, 231, 191],
    dark: [255,134,158],
    accent_light: [255,196,196],
    accent_dark: [161,0,53]
  },
  sunset: {
    light: [255,204,143],
    dark: [167,96,255],
    accent_light: [255,218,175],
    accent_dark: [202,130,255]
  },
  night: {
    light: [224, 77, 1],
    dark: [37, 29, 58],
    accent_light: [255, 119, 0],
    accent_dark: [42, 37, 80]
  },
  candy: {
    light: [255, 227, 169],
    dark: [255, 140, 140],
    accent_light: [255, 195, 195],
    accent_dark: [255, 93, 93]
  }
}

const metalOptions = {
  gold: {
    mc1: [250, 221, 140],
    mc2: [227, 147, 77],
    mc3: [252, 235, 217]
  },
  othergold: {
    mc1: [255, 248, 205],
    mc2: [255, 224, 93],
    mc3: [255, 150, 66]
  },
  silver: {
    mc1: [241, 243, 248],
    mc2: [214, 224, 240],
    mc3: [141, 147, 171]
  },
  platinum: {
    mc1: [251, 240, 240],
    mc2: [223, 211, 211],
    mc3: [184, 176, 176]
  },
  rosegold: {
    mc1: [243, 197, 197],
    mc2: [193, 163, 163],
    mc3: [136, 111, 111]
  }
}

// GENERAL
let time;
let cCoeff;

// BUFFERS
let bg1;
let graphics;
let rings;

// FOR fracturedSun & wallOfFire
const slices = 180;
let blobSize;
let randomWeights = [];

// PARTICLE SYSTEMS
let particles = [];
let numP;
let particlesOut = [];
let numP_Out;
let particlesTop = [];
let numP_Top;
let particlesWater = [];
let bgNumRows;

// IRREG CIRCS
let zoff = 0;
let irregCircs = []
let numCircs;

// MOTHS
let buttermoths_num = 50;
let fM_noiseScale = 200, fM_noiseStrength = 1;
let buttermoths = [];
let buttermoths2 = [];

let spiralMoths = []
let numP_spiralMoths;

let gridType;
let gridPoints = []
let gridPoints_LG = []
let numPoints;

let cresMetal;


function setup() {
  noiseSeed(seed)
  const smD = windowWidth < windowHeight ? windowWidth : windowHeight;
  createCanvas(smD, smD);
  pixelDensity(1)
  time = 0

  pal = choosePalette()

  setWater()

  bg1 = createGraphics(smD/5,smD/5)

  bg1.translate(bg1.width/2,bg1.height/2)

  setFracturedSun()
  setMovingBackground()

  graphics = createGraphics(smD,smD);

  rings = createGraphics(smD/3,smD/3)

  rings.translate(rings.width/2,rings.height/2)

  moths = createGraphics(smD,smD);

  gridType = chooseGrid()
  console.log(gridType)

  bgEffect = chooseBackgroundEffect()
  console.log(bgEffect)

  exType = chooseExpandType()
  console.log(exType)

  setIrregCircles(exType, gridType)

  cresMetal = chooseMetal()

  daubing()

  setFog() 

  if (gridType === 'spirals_in') {
    setSpiralMoths()
  }else{
    mothsSetup(gridType)
  }


}

function draw() {
  translate(width/2,height/2)
  imageMode(CENTER)
  let cCoeff = map(mouseY,-h(.5),h(.5),.1,.85)
  background(pal.dark[0]*cCoeff, pal.dark[1]*cCoeff, pal.dark[2]*cCoeff, 83)
  
  image(bg1,0,0,width,height)
  bgEffect(gridType)
  //bg1.clear()
  //fracturedSun()
  //wallOfFire()
  //bigBrushTexture(gridType)
  //movingBackground()

  water()

  image(graphics, 0, 0)
  chooseTexture(gridType)

  image(rings, 0, 0, width, height)
  rings.clear()

  drawIrregCircles()

  moths.clear()
  if (gridType === 'spirals_in') {
    drawSpiralMoths()
  }else{
    drawGridMoths()
  }
  image(moths, 0, 0)

  topFog()

  time += .1
  console.log(frameRate())
}

// CHOOSERS

function choosePalette() {
  const palPercent = map(decPairs[1],0,255,0,1);
    if (palPercent < .1) {
      chosenPal = palettes.gray
    }else if (palPercent < .2){
      chosenPal = palettes.orange
    }else if (palPercent < .3){
      chosenPal = palettes.yellow
    }else if (palPercent < .4){
      chosenPal = palettes.matisse
    }else if (palPercent < .5){
      chosenPal = palettes.pinks
    }else if (palPercent < .6){
      chosenPal = palettes.sunset
    }else if (palPercent < .7){
      chosenPal = palettes.night
    }else if (palPercent < .8){
      chosenPal = palettes.candy
    }else if (palPercent < .9){
      chosenPal = palettes.blue
    }else{
      chosenPal = palettes.red
    }
    return chosenPal
}

function chooseGrid() {
  const gridPercent = map(decPairs[3],0,255,0,1);
    if (gridPercent < .15) {
      chosenGrid = 'circleGrid'
    }else if (gridPercent < .3) {
      chosenGrid = 'circleGridLarge'
    }else if (gridPercent < .45) {
      chosenGrid = 'circleLayers'
    }else if (gridPercent < .6) {
      chosenGrid = 'arcGrid'
    }else if (gridPercent < .75) {
      chosenGrid = 'arcLayers'
    }else if (gridPercent < .9) {
      chosenGrid = 'shaftGrid'
    }else{
      chosenGrid = 'spirals_in'
    }
    return chosenGrid;
}

function chooseBackgroundEffect() {
  const waterPercent = map(decPairs[8],0,255,0,1);
    if (waterPercent < .25) {
      chosenEffect = movingBackground
    }else if (waterPercent < .5) {
      chosenEffect = wallOfFire
    }else if (waterPercent < .75) {
      chosenEffect = bigBrushTexture
    }else{
      chosenEffect = fracturedSun
    }
    return chosenEffect;
}

function chooseTexture(grid) {
  const texturePercent = map(decPairs[9],0,255,0,1);
    if (texturePercent < .5) {
      //chosenTexture = concTexture
      concTexture(.1, pal.light, grid)
    }else{
      //chosenTexture = vanish_P
      bezierLineTexture(.001, pal.accent_light)
    }
}

function chooseExpandType() {
  const expandTypePercent = map(decPairs[6],0,255,0,1);
    if (expandTypePercent < .1) {
      expandType = 'normal'
    }else if (expandTypePercent < .2){
      expandType = 'intense'
    }else if (expandTypePercent < .3){
      expandType = 'intense-white'
    }else if (expandTypePercent < .4){
      expandType = 'ellipses'
    }else if (expandTypePercent < .5){
      expandType = 'ellipses-rose'
    }else if (expandTypePercent < .6){
      expandType = 'spirals'
    }else if (expandTypePercent < .7){
      expandType = 'spirals-smooth'
    }else if (expandTypePercent < .8){
      expandType = 'ellipses-shimmer'
    }else if (expandTypePercent < .9){
      expandType = 'nebula'
    }else{
      expandType = 'strobe'
    }
    return expandType
}

function chooseMothScale() {
  const mothScalePercent = map(decPairs[5],0,255,0,1);
    if (mothScalePercent < .25) {
      mothScale = rnd(.35,.65)
    }else if (mothScalePercent < .5) {
      mothScale = rnd(.65,.9)
    }else if (mothScalePercent < .75) {
      mothScale = rnd(.35,1)
    }else{
      mothScale = rnd(.9,1.15)
    }
    return mothScale;
}

function chooseMetal() {
  let keys = Object.keys(metalOptions);
  return metalOptions[keys[ keys.length * rnd() << 0]]
  /*let metalPercent = rnd(1)
  if (metalPercent < .33) {
    chosenMet = metalOptions.gold
  }else if (metalPercent < .66){
    chosenMet = metalOptions.silver
  }else{
    chosenMet = metalOptions.platinum
  }
  return chosenMet;*/
}

// STATIC

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

// BG1 FUNCTIONS

function setFracturedSun() {
  for(var i = 0; i < slices*2 ; i++){
    randomWeights[i] = rnd(700, 1000);
  }
}

function fracturedSun() {
  push()
  let cCoeff = map(mouseY,-h(.5),h(.5),.1,.85)
  bg1.background(pal.dark[0]*cCoeff, pal.dark[1]*cCoeff, pal.dark[2]*cCoeff, 38)
  bg1.noStroke()
  bg1.rotate(radians(1));
  for (let blobNum = 0; blobNum < 7; blobNum++){
    size_inc = bg1_w(.003)
    blobSize = map(blobNum,0,7,bg1_w(1),bg1_w(.035))
    if (blobSize > bg1_w(1)){
      blobSize = bg1_w(.025)
    }
    let fadeIn = 1
    if (frameCount < 180) {
      fadeIn = map(frameCount,0,180,0,1)
    }
    bg1.fill(map(blobNum,0,7,pal.dark[0],pal.light[0]),map(blobNum,0,7,pal.dark[1],233),map(blobNum,0,7,pal.light[2],pal.dark[2]),map(blobNum,0,7,3,10)*fadeIn)
    //bg1.strokeWeight(map(blobNum,0,7,bg1_w(.015),bg1_w(.003)))
    //let angle = radians(frameCount / 200) + radians(blobNum*15)
    bg1.beginShape();
    for(var i = 0, j = 0; i < TWO_PI; i += TWO_PI/slices, j++){
      let x = sin(i) * blobSize + map(cos(millis()/randomWeights[j]), -1, 1, -bg1_w(.1), bg1_w(.1))
      let y = cos(i) * blobSize + map(sin(millis()/randomWeights[j+ slices]), -1, 1, -bg1_w(.1), bg1_w(.1))
      //bg1.curveVertex(sin(i) * blobSize + map(cos(millis()/randomWeights[j]), -1, 1, -bg1_w(.1), bg1_w(.1)), cos(i) * blobSize + map(sin(millis()/randomWeights[j+ slices]), -1, 1, -bg1_w(.1), bg1_w(.1)));
      bg1.curveVertex(x,y,x/2,y/2)
    }
    bg1.endShape(CLOSE);
    blobSize += size_inc
  }
  pop()
}

function wallOfFire() {
  push()
  let cCoeff = map(mouseY,-h(.5),h(.5),.1,.85)
  bg1.background(pal.dark[0]*cCoeff, pal.dark[1]*cCoeff, pal.dark[2]*cCoeff, 38)
  bg1.noStroke()
  for (let blobNum = 0; blobNum < 7; blobNum++){
    size_inc = bg1_w(.003)
    blobSize = map(blobNum,0,7,bg1_w(1),bg1_w(.035))
    if (blobSize > bg1_w(1)){
      blobSize = bg1_w(.025)
    }
    let fadeIn = 1
    if (frameCount < 200) {
      fadeIn = map(frameCount,0,200,0,1)
    }
    bg1.fill(map(blobNum,0,7,pal.accent_dark[0],pal.accent_light[0]),map(blobNum,0,7,pal.accent_dark[1],233),map(blobNum,0,7,pal.accent_light[2],pal.accent_dark[2]),map(blobNum,0,7,3,10)*fadeIn)
    bg1.beginShape();
    for(var i = 0, j = 0; i < TWO_PI; i += TWO_PI/slices, j++){
      //curveVertex(sin(i) * blobSize + map(cos(millis()/3/randomWeights[j]), -1, 1, -bg1_w(.1), bg1_w(.1)), cos(i) * blobSize + map(sin(millis()/3/randomWeights[j+ slices]), -1, 1, -bg1_w(.1), bg1_w(.1)) * 8);
      let x = sin(i) * blobSize + map(cos(millis()/randomWeights[j]), -1, 1, -bg1_w(.1), bg1_w(.1))
      let y = cos(i) * blobSize + map(sin(millis()/randomWeights[j+ slices]), -1, 1, -bg1_w(.1), bg1_w(.1)*8) - bg1_h(.35)
      bg1.curveVertex(x,y,x/2,y/2)
    }
    bg1.endShape(CLOSE);
    blobSize += size_inc
  }
  pop()
}

function blurredEllipse(x,y,size,r,g,b,a) {
  for (let i = 0; i < 4; i++){ // reduced to be lighter
    fill(r,g,b,a*i*.1)
    noStroke()
    ellipse(x,y,1.6*size - (size/3)*i)
  }
}

function blurredEllipse_Sp(x,y,size,r,g,b,a) {
  for (let i = 0; i < 5; i++){//change to i < 5
    let coeff = map(dist(x,y,0,0),0,bg1_w(.65),1,0) // new, more effective light to dark transition
    bg1.fill(r*coeff,g*coeff,b*coeff,a*(i)) // change to a*i ----> then also lower size and opacity in assembly function to increase layer transparency
    bg1.ellipse(x,y,size - (size/6)*i)
  }
}

function blurredEllipse_bg1(x,y,size,r,g,b,a) {
  for (let i = 0; i < 4; i++){ // reduced to be lighter
    bg1.fill(r,g,b,a*i*.1)
    bg1.noStroke()
    bg1.ellipse(x,y,1.6*size - (size/3)*i)
  }
}

function fogEllipse(x,y,size,r,g,b,a) {
  for (let i = 0; i < 4; i++){ // reduced to be lighter 
    fill(r,g,b,(i/a)*(1.5*i))
    noStroke()
    ellipse(x,y,1.6*size - (size/3)*i)
  }
}

function drawCirc_Vert_SOLIDS(radius, t_offset, limit, r, g, b, a, grid) {
  push()
  bg1.strokeWeight(3)
  bg1.fill(255)
  bg1.noStroke()
  let xoff = 0

  let t = frameCount / 60
  let distort = rnd(.8,1.2)
  let speed_coeff = map(radius,0,bg1_w(1.3),2,1)
  let rad_mult = map(frameCount,0,500,1,1.8)

  let x = radius * rad_mult * 1.25 * cos(speed_coeff*t+t_offset) + map(sin(t),-1,1,-bg1_w(.03),bg1_w(.03))
  let y = radius * rad_mult * 1.25 * sin(speed_coeff*t+t_offset) + rnd(-bg1_w(.005),bg1_w(.005))
  if (grid == 'arcGrid' || grid == 'arcLayers') {
    x = radius * rad_mult * 2.45 * cos(speed_coeff*t+t_offset) + map(sin(t),-1,1,-bg1_w(.03),bg1_w(.03)) * distort
    y = ((radius + bg1_w(.02)) * rad_mult * 2.8 * sin(speed_coeff*t+t_offset) + rnd(-bg1_w(.005),bg1_w(.005))) * 1.5 + bg1_h(.2) * distort
  }
  if (grid == 'shaftGrid') {
    y = (radius * rad_mult * sin(speed_coeff*t+t_offset) + rnd(-bg1_w(.005),bg1_w(.005))) * 3.5 //+ bg1_h(.35)
  }
  let size = map(sin(t+180),-1,1,bg1_w(.01),bg1_w(.04)) + map(dist(x,y,width/2,height/2),0,bg1_w(1),0,bg1_w(.03))

  //if (frameCount < limit) {
    let coeff = map(radius,0,w(.25),1.8,.1)
    let alpha_coeff = map(dist(x,y,0,0),0,bg1_w(.65),1,.2)
    blurredEllipse_Sp(x,y,size, r*coeff, g*coeff, b*coeff, a*alpha_coeff)
    xoff += 0.05
  //}
  pop()
}

function drawSpirals_SOLIDS(r, g, b, a, grid) {
  push()
  let num_circs = 12
  let begin = 0
  if (frameCount > begin) {
    for (let i = 0; i < num_circs; i++) {
      let rad = bg1_w(.005)+i*bg1_w(.03)
      if (grid == 'arcGrid' || grid == 'arcLayers') {
        rad = bg1_w(.015)+i*bg1_w(.025)
      }
      //let coeff = map(rad,0,bg1_w(.005)+num_circs*bg1_w(.03),1,0)
      drawCirc_Vert_SOLIDS(rad, 60*i, begin + 180 + 3*i, r, g, b, a + .5*i, grid)
    }
  }
  pop()
}

function bigBrushTexture(grid) {
  if (frameCount < 600) {
    drawSpirals_SOLIDS(pal.accent_light[0], pal.accent_light[1], pal.accent_light[2], 3, grid)
    //drawSpirals_SOLIDS_OUTSIDE(pal.dark[0], pal.dark[1], pal.dark[2], 3)
  }
}

function setMovingBackground() {
  numP = 100;
  for (let i = 0; i < numP; i++){
    let radius = map(i,0,numP,bg1_w(.003),bg1_w(.65))
    let colVals = [pal.accent_light[0], pal.accent_light[1], pal.accent_light[2]]
    p = new Particle(radius,bg1_w(.06),colVals,bg1_w(.15),60);
    particles.push(p);
  }
  numP_Out = 70;
  for (let i = 0; i < numP_Out; i++){
    let radius = map(i,0,numP,bg1_w(.05),bg1_w(.65))
    let colVals = [pal.light[0], pal.light[1], pal.light[2]]
    p = new Particle(radius,bg1_w(.03),colVals,bg1_w(.25),35);
    particlesOut.push(p);
  }
}

function movingBackground() {
  push()
  let cCoeff = map(mouseY,-h(.5),h(.5),.1,.85)
  bg1.background(pal.dark[0]*cCoeff, pal.dark[1]*cCoeff, pal.dark[2]*cCoeff, 38)
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
    this.vx = rnd(-bg1_w(.003),bg1_w(.003))
    this.vy = rnd(-bg1_h(.003),bg1_h(.003))
    this.off = rnd(-bg1_w(.05),bg1_w(.05))
  }

  run() {
    this.update();
    this.checkEdges();
    this.show();
  }

  update() {
    this.x += this.vx * map(dist(this.x,this.y,0,0),0,bg1_w(.65),.3,1)
    this.y += this.vy * map(dist(this.x,this.y,0,0),0,bg1_w(.65),.3,1)
  }

  checkEdges() {
    if (this.x < -bg1_w(.55) || this.x > bg1_w(.55) || this.y < -bg1_h(.55) || this.y > bg1_h(.55)) {    
      this.x = 0
      this.y = 0
    }
  }

  show() {
    bg1.noStroke()
    //ellipse(this.x+this.off,this.y+this.off,w(.001))
    let c = map(dist(this.x,this.y,0,0),0,bg1_w(.65),.8,.1)
    let mouseC = map(dist(this.x,this.y,mouseX-width/2,mouseY-height/2),0,bg1_w(.65),map(c,.8,.1,25,80),12)
    let adjSize = map(dist(this.x,this.y,0,0),0,bg1_w(.65),.5,2.5) * this.size
    blurredEllipse_bg1(this.x,this.y,adjSize,this.col[0]*c+mouseC,this.col[1]*c+mouseC,this.col[2]*c+mouseC,this.alpha) 
  }
}

// TEXTURE FUNCTIONS

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

function texturedCircle(init_distort,line_val,size,inc,diff,max_distort,col,grid) {
  push()
  let zoff = 0
  let t = frameCount * 3 + rnd(TWO_PI)
  let d = 1
  graphics.angleMode(graphics.DEGREES)
  if (frameCount < 90) {
    let xoff = map(cos(t+diff), -1, 1, 0, 1)
    let yoff = map(sin(t-diff), -1, 1, 0, 1)
    let r = map(noise(xoff, yoff), 0, 1, size, size-rnd(w(.01),max_distort*noise(xoff, yoff, zoff)))
    let x1 = graphics.width/2 + init_distort + d*r * cos(t)
    let y1 = graphics.height/2 + init_distort + d*r * sin(t)
    let x2 = graphics.width/2 + init_distort + d*r * cos(t + line_val*2)
    let y2 = graphics.height/2 + init_distort + d*r * sin(t + line_val*2)
    let coeff = map(dist(x2-x1,y2-y1,0,0),0,w(.25),0,1)
    let alpha_coeff = map(dist(x2-x1,y2-y1,0,0),w(.01),w(.02),0,1)
    if (grid == 'arcGrid' || grid == 'arcLayers') {
      y1 = (graphics.height/2 + init_distort + d*r * sin(t)) * 1.6
      y2 = (graphics.height/2 + init_distort + d*r * sin(t + line_val*2)) * 1.6
    }
    if (grid == 'shaftGrid') {
      coeff = map(dist(x2-x1,y2-y1,0,0),0,w(.25),0,1)
      alpha_coeff = map(dist(x2-x1,y2-y1,0,0),w(.01),w(.02),.65,1.5)
      y1 = (graphics.height/2 + init_distort + d*r * sin(t)) * 3.2 - h(1)
      y2 = (graphics.height/2 + init_distort + d*r * sin(t + line_val*2)) * 3.2 - h(1)
    }
    let weight_coeff = map(dist(x2-x1,y2-y1,0,0),w(.01),w(.65),.1,1.5)
    tS_original(x1, y1, x2, y2, w(.15)*weight_coeff, col[0]*coeff, col[1]*coeff, col[2]*coeff, rnd(4.5)*alpha_coeff)
    zoff += inc/5;
  }
  pop()
}

function concTexture(line_val, col, grid) {
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
    texturedCircle(i_d,line_val,size,inc,0,w(.03),col,grid)
    texturedCircle(i_d,line_val,size,inc*15,30,w(.03),col,grid)
    texturedCircle(i_d,line_val,size,inc*25,60,w(.03),col,grid)
    xoff += .01
  }
  pop()
}

function bezierLines(init_distort,line_val,size,inc,diff,max_distort) {
  push()
  //translate(width/2,0)
  //line_val is for line length - 0 is a dot, .2 is a line
  let zoff = 0
  let t = frameCount * 3 + rnd(TWO_PI)
  let d = .9
  graphics.angleMode(graphics.DEGREES)
  if (frameCount < 25) {
    graphics.rotate(radians(frameCount*10))
    let xoff = map(cos(t+diff), -1, 1, 0, 1)
    let yoff = map(sin(t-diff), -1, 1, 0, 1)
    let r = map(noise(xoff, yoff), 0, 1, size, size-rnd(w(.01),max_distort*noise(xoff, yoff, zoff)))
    let x1 = graphics.width/2 + init_distort + r * cos(t)
    let y1 = graphics.height/3 + init_distort + d*r * sin(t)
    let x2 = graphics.width/2 + init_distort + r * cos(t + line_val)
    let y2 = graphics.height + init_distort + d*r * sin(t + line_val*1.5)
    let xc1 = graphics.width/2 + (x1+x2)/4 + rnd(-w(.05),w(.05))
    let yc1 = (y1+y2)/4 + rnd(-w(.05),w(.05))
    let xc2 = graphics.width/2 + (x1+x2)/2 + rnd(-w(.05),w(.05))
    let yc2 = (y1+y2)/2 + rnd(-w(.05),w(.05))
    let x_alt = graphics.width/2 + init_distort + r * cos(t + line_val)
    let y_alt = init_distort + d*r * sin(t + line_val*2)
    let dis = rnd(.94,1.06)
    let dis2 = rnd(.88,1.12)
    graphics.bezier(x1,y1,xc1,yc1,xc2,yc2,x2,y2)
    graphics.bezier(x1*dis,y1*dis,xc1,yc1,xc2,yc2,x2*dis,y2*dis)
    graphics.bezier(x1*dis2,y1*dis2,xc1,yc1,xc2,yc2,x2*dis2,y2*dis2)
    graphics.line(x1*dis,y1*dis,x_alt*dis,y_alt*dis) // DARKER & MORE CHAOTIC
    zoff += inc/5;
  }
  pop()
}

function bezierLineTexture(line_val, col) {
  push()
  graphics.blendMode(graphics.OVERLAY)
  graphics.noFill()
  //graphics.translate(0,graphics.height/2)
  //let angle = random(TWO_PI);
  let num_circs = 60
  let xoff = 0
  for (let i = 0; i < num_circs; i++) {
    let i_d = rnd(-w(.003), w(.003))*i
    translate(rnd(w(.01),rnd(h(.01))))
    //let c = map(mouseX,0,width,0,2);
    let size = map(i,0,num_circs,w(.01),w(.75))
    let inc = .003
    let c = map(size,0,w(1),0,2)
    let alpha_coeff = map(size,0,w(.15),.1,.6)
    graphics.stroke(col[0] * c, col[1] * c, col[2] * c, 30 * alpha_coeff)
    graphics.strokeWeight(rnd(w(.00015)))
    //graphics.strokeWeight(map(i,0,num_circs,w(.0005),w(.002)))
    //graphics.ellipse(0,0,size)
    bezierLines(i_d,line_val,size,inc,0,w(.06))
    bezierLines(i_d,line_val,size,inc*15,30,w(.06))
    bezierLines(i_d,line_val,size,inc*25,60,w(.06))
    graphics.stroke(col[0] * c, col[1] * c, col[2] * c, 38 * alpha_coeff)
    bezierLines(i_d,line_val,size,inc*15,90,w(.06))
    bezierLines(i_d,line_val,size,inc*25,120,w(.06))
    graphics.stroke(col[0] * c, col[1] * c, col[2] * c, 15 * alpha_coeff)
    bezierLines(i_d,line_val,size,inc*15,270,w(.06))
    bezierLines(i_d,line_val,size,inc*25,300,w(.06))
    xoff += .01
  }
  pop()
}

function setWater() {
  push()
  //translate(-width/2 + scl/2,-height/2 + scl/2)
  bgNumRows = 5;
  scl = width/bgNumRows;
  yoff = 0;
  for (let y = 0; y < bgNumRows * 2; y++) {
    xoff = 0;
    for (let x = 0; x < bgNumRows * 2; x++) {
      let xPos = x * scl - width/2 + scl/2;
      let yPos = y * scl - height/2 + scl/2;
      let col = [pal.light[0], pal.light[1], pal.light[2]]; // 25, 91, 214 // inverse alpha
      p = new ParticleWater(xPos,yPos,w(.03),col,60);
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
    let c = map(dist(this.x,this.y,0,0),0,w(.65),1,.5)
    let mouseC = map(dist(this.x,this.y,mouseX-width/2,mouseY-height/2),0,w(.35),map(c,1,.5,20,60),10)
    let adjSize = map(dist(this.x,this.y,0,0),0,w(.65),.5,2.5) * this.size
    blurredEllipse(this.x,this.y,adjSize,this.col[0]*c+mouseC,this.col[1]*c+mouseC,this.col[2]*c+mouseC,this.alpha) 
  }
}


////////////////////////       MOVING TEXTURE       ///////////////////////////////

function irregCircle(radius,noiseVal,grid) {
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
    if (grid === 'arcGrid' || grid === 'arcLayers') {
      y = (radius * diff * sin(a)) * 1.5;
    }
    if (grid === 'shaftGrid') {
      y = (radius * diff * sin(a)) * 2.5;
    }
    let x2 = radius * diff * cos(a+5) + wavingX;
    let y2 = radius * diff * sin(a+5) + wavingY;
    if (grid === 'arcGrid' || grid === 'arcLayers') {
      y2 = (radius * diff * sin(a+5) + wavingY) * 1.5;
    }
    if (grid === 'shaftGrid') {
      y2 = (radius * diff * sin(a+5) + wavingY) * 2.5;
    }
    let x3 = radius * diff * cos(a+3) + wavingX*2;
    let y3 = radius * diff * sin(a+3) + wavingY*2;
    if (grid === 'arcGrid' || grid === 'arcLayers') {
      y3 = (radius * diff * sin(a+3) + wavingY*2) * 1.5;
    }
    if (grid === 'shaftGrid') {
      y3 = (radius * diff * sin(a+3) + wavingY*2) * 2.5;
    }
    //vertex(x, y);
    line(x,y,x2,y2)
    line(x2,y2,x3,y3)
  }
  //endShape(CLOSE);
  
  zoff += 0.0001;
}

function irregCircle_2(radius,noiseVal) {
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
    let x2 = radius * diff * cos(a+radians(15)) + wavingX;
    let y2 = radius * diff * sin(a+radians(15)) + wavingY;
    let x3 = radius * diff * cos(a+radians(30)) + wavingX*2;
    let y3 = radius * diff * sin(a+radians(30)) + wavingY*2;
    let x4 = radius * diff * cos(a+radians(45)) + wavingX*2;
    let y4 = radius * diff * sin(a+radians(45)) + wavingY*2;
    //vertex(x, y);
    line(x,y,x2,y2)
    line(x2,y2,x3,y3)
    line(x3,y3,x4,y4)
  }
  //endShape(CLOSE);
  
  zoff += 0.0001;
}

function irregExpand(radius,noiseVal,grid) {
  rings.beginShape();
  for (let a = 0; a <= TWO_PI; a += radians(6)) {
    let xoff = map(cos(a), -1, 1, noiseVal/3, noiseVal);
    let yoff = map(sin(a), -1, 1, noiseVal/3, noiseVal);
    let diff = map(noise(xoff, yoff, zoff), 0, 1, .65, 1.35);
    //let diff = 1
    let x = radius * diff * cos(a);
    let y = radius * diff * sin(a);
    if (grid === 'arcGrid' || grid === 'arcLayers') {
      y = (radius * diff * sin(a) * 1.5);
    }
    if (grid === 'shaftGrid') {
      y = (radius * diff * sin(a) * 2.5);
    }
    rings.vertex(x,y)
  }
  rings.endShape(CLOSE);
  
  zoff += 0.0001;
}

function spiralExpand(radius,noiseVal,numC) {
  let angle = frameCount / 60
  for (let i = 0; i < numC + 1; i++) {
    let newAngle = angle + radians(75)*i
    for (let i = 0; i < 12; i++) {
      let xoff = map(cos(newAngle), -1, 1, noiseVal/3, noiseVal);
      let yoff = map(sin(newAngle), -1, 1, noiseVal/3, noiseVal);
      let diff = map(noise(xoff, yoff, zoff), 0, 1, .9, 1.1);
      let x = radius * cos(newAngle-i*.1) * diff - i*(radius/20)
      let y = radius * sin(newAngle-i*.1) * diff - i*(radius/20)
      let size  = w(.03)-i*(w(.001))
      blurredEllipse(x,y,size,pal.light[0],pal.light[1],pal.light[2],(85-i*2)*map(radius,0,w(.65),1,0))
    }
  }
}

function spiralExpandSmooth(radius,noiseVal,numC) {
  let angle = frameCount / 60
  for (let i = 0; i < numC + 2; i++) {
    let newAngle = angle + radians(60)*i
    for (let i = 0; i < 10; i++) {
      let xoff = map(cos(newAngle), -1, 1, noiseVal/3, noiseVal)*i;
      let yoff = map(sin(newAngle), -1, 1, noiseVal/3, noiseVal)*i;
      let diff = map(noise(xoff, yoff, zoff), 0, 1, .9, 1.1);
      let x = (radius * cos(newAngle-i*.1) * diff) * map(i,0,10,.1,1)
      let y = (radius * sin(newAngle-i*.1) * diff) * map(i,0,10,.1,1)
      let size  = (w(.03)-i*(w(.001))) * map(radius,0,w(.7),1,6)
      blurredEllipse(x,y,size,pal.light[0],pal.light[1],pal.light[2],map(i,0,10,100,5)*map(radius,0,w(.65),1,.2))
    }
  }
}

function irregExpandShimmer(radius,noiseVal,grid) {
  for (let a = 0; a <= TWO_PI - radians(3); a += radians(6)) {
    let xoff = map(cos(a), -1, 1, noiseVal/3, noiseVal);
    let yoff = map(sin(a), -1, 1, noiseVal/3, noiseVal);
    let diff = map(noise(xoff, yoff, zoff), 0, 1, .65, 1.35);
    //let diff = 1
    let x = radius * diff * cos(a);
    let y = radius * diff * sin(a);
    if (grid == 'arcGrid' || grid == 'arcLayers') {
      y = (radius * diff * sin(a)) * 1.5;
    }
    if (grid == 'shaftGrid') {
      y = (radius * diff * sin(a)) * 2.5;
    }
    shimmerSize = map(sin(frameCount / 15 + a),-1,1,0,w(.01))
    ellipse(x, y, shimmerSize);
    ellipse(x*1.5, y*1.5, shimmerSize);
    ellipse(x*1.85, y*1.85, shimmerSize);
    ellipse(x*2.15, y*2.15, shimmerSize);
  }
  
  zoff += 0.0001;
}

function setIrregCircles(expandType, gridType) {
  numCircs = 4;
  for (let i = 0; i < numCircs; i++) {
    radius = map(i,0,numCircs,w(.03),w(.65))
    noiseVal = rnd(1,3)
    circ = new IrregCircle(radius,noiseVal,expandType,numCircs,gridType);
    irregCircs.push(circ);
  }
}

function drawIrregCircles() {
  for (let i = 0; i < irregCircs.length; i++){
    irregCircs[i].run();
  }
}

function linearCircs(r,nV,grid) {
  irregCircle(r,nV,grid)
  irregCircle(r*1.33,nV*2,grid)
  irregCircle(r*1.66,nV*3,grid)
}

function linearCircs2(r,nV) {
  irregCircle_2(r,nV)
  irregCircle_2(r*1.33,nV*2)
  irregCircle_2(r*1.66,nV*3)
}

class IrregCircle{
  constructor(_radius,_noiseVal,_expandType,_numC,_grid) {
    this.radius = _radius;
    this.noiseVal = _noiseVal;
    this.expandType = _expandType;
    this.numC = _numC;
    this.grid = _grid;
  }

  run() {
    this.update()
    this.checkEdges()
    this.show()
  }

  update() {
    if (this.expandType == 'ellipses' || this.expandType == 'ellipses-rose') {
      this.radius += r_w(.0015)
    }else{
      this.radius += w(.0015)
    }
  }

  checkEdges() {
    if (this.expandType == 'ellipses' || this.expandType == 'ellipses-rose') {
      if (this.radius > r_w(.63)) {
        this.radius = r_w(.01)
      }
    }else{
      if (this.radius > w(.73)) {
        this.radius = w(.01)
      }
    }
  }

  show() {
    noFill()
    rings.noFill()
    if (this.expandType === 'normal'){
      stroke(200,2)
      strokeWeight(w(.003))
      linearCircs(this.radius,this.noiseVal,this.grid)
    }
    if (this.expandType === 'intense'){
      let outwardColorCoeff = map(this.radius,0,w(.6),1,.3)
      stroke(pal.light[0]*outwardColorCoeff,pal.light[1]*outwardColorCoeff,pal.light[2]*outwardColorCoeff,map(this.radius,0,w(.6),25,12))
      strokeWeight(w(.0035))
      linearCircs(this.radius,this.noiseVal,this.grid) 
    }
    if (this.expandType === 'intense-white'){
      let outwardColor = map(this.radius,0,w(.6),235,100)
      stroke(outwardColor,map(this.radius,0,w(.6),25,12))
      strokeWeight(w(.0035))
      linearCircs(this.radius,this.noiseVal,this.grid) 
    }
    if (this.expandType === 'strobe'){
      stroke(pal.light[0],pal.light[1],pal.light[2],7)
      strokeWeight(rnd(w(.0035))) // RND FOR FLICKER\
      linearCircs(this.radius,this.noiseVal,this.grid)
    }
    if (this.expandType === 'ellipses'){
      push()
      //rings.clear()
      if (this.grid === 'circleGrid' || this.grid === 'circleGridLarge' || this.grid === 'circleLayers' || this.grid === 'spirals-in') {
        rings.rotate(radians(.1))
      }
      rings.stroke(pal.light[0],pal.light[1],pal.light[2],20)
      rings.strokeWeight(r_w(.002)) 
      irregExpand(this.radius,this.noiseVal,this.grid)
      irregExpand(this.radius*1.15,this.noiseVal*1.35,this.grid)
      irregExpand(this.radius*1.3,this.noiseVal*1.7,this.grid)
      pop()
    }
    if (this.expandType === 'ellipses-rose'){
      push()
      //rings.clear()
      if (this.grid === 'circleGrid' || this.grid === 'circleGridLarge' || this.grid === 'circleLayers' || this.grid === 'spirals-in') {
        rings.rotate(radians(.1))
      }
      let alphaVal = 1
      if (this.radius > r_w(.15)) {
        alphaVal = map(this.radius, r_w(.15), r_w(.5), 1, 0)
      }
      let sW_Val = map(this.radius, 0, r_w(.65), .5, 2.5)
      rings.stroke(pal.light[0],pal.light[1],pal.light[2],85 * alphaVal)
      rings.strokeWeight(r_w(.005)*sW_Val) 
      rings.background(pal.dark[0], pal.dark[1], pal.dark[2], 5)
      let nV = this.noiseVal * .75
      irregExpand(this.radius,nV,this.grid)
      irregExpand(this.radius*1.3,nV*1.35,this.grid)
      irregExpand(this.radius*1.6,nV*1.7,this.grid)
      rings.stroke(pal.light[0],pal.light[1],pal.light[2],25 * alphaVal)
      rings.strokeWeight(r_w(.01)*sW_Val) 
      irregExpand(this.radius,nV,this.grid)
      irregExpand(this.radius*1.27,nV*1.35,this.grid)
      irregExpand(this.radius*1.57,nV*1.7,this.grid)
      pop()
    }
    if (this.expandType === 'ellipses-shimmer'){
      push()
      rotate(frameCount / 90)
      //stroke(map(this.radius,0,w(.7),220,0),35)
      fill(pal.accent_light[0],pal.accent_light[1],pal.accent_light[2],85)
      //strokeWeight(3) 
      noStroke()
      irregExpandShimmer(this.radius,this.noiseVal,this.grid)
      pop()
    }
    if (this.expandType === 'spirals'){
      push()
      rotate(frameCount / 240)
      spiralExpand(this.radius,this.noiseVal,this.numC)
      spiralExpand(this.radius*1.2,this.noiseVal*2,this.numC)
      pop()
    }
    if (this.expandType === 'spirals-smooth'){
      push()
      //rotate(frameCount / 60)
      spiralExpandSmooth(this.radius,this.noiseVal,this.numC)
      pop()
    }
    if (this.expandType === 'nebula'){
      let outwardColorCoeff = map(this.radius,0,w(.6),1,.3)
      stroke(pal.light[0]*outwardColorCoeff,pal.light[1]*outwardColorCoeff,pal.light[2]*outwardColorCoeff,map(this.radius,0,w(.6),25,12))
      strokeWeight(w(.0035))
      linearCircs2(this.radius,this.noiseVal)
    }
  }
}

function setFog() {
  numP_Top = 175;
  for (let i = 0; i < numP_Out; i++){
    let radius = map(i,0,numP,w(.01),w(.3))
    let colVals = [pal.accent_light[0], pal.accent_light[1], pal.accent_light[2]]
    p = new ParticleTop(radius,w(.05),colVals,w(.02),.15);
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
    if (dist(this.x,this.y,0,0) > w(.35)) {
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



////////////////////////      MOTHS      ///////////////////////////////

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

function circleGridLarge() {
  push()
  let num_rows = 16
  let r_inc = w(.072)
  for (let i = 0; i < num_rows; i++) {
    let y = map(i,0,num_rows,-r_inc*num_rows/2,r_inc*num_rows/2)
    let num_cols = round(map(dist(y,0,0,0), 0, num_rows/2 * r_inc, 12, 0))
    for (let j = 0; j < num_cols; j++) {
      let x = (map(j,0,num_cols,0-num_cols/2*r_inc,num_cols/2*r_inc)+ r_inc/2) * map(num_cols,0,12,2.8,1.2)
      let point = createVector(x + rnd(-w(.015),w(.015)),y + rnd(-h(.015),h(.015)))
      gridPoints.push(point)
    }  
  }
  pop()
}

function arcGrid() {
  push()
  for (let i = 0; i < 65; i++) {
    let angle = map(i,0,65,PI-radians(7),TWO_PI+radians(7)) + radians(rnd(-3,3))
    let radius = rnd(w(.23),w(.38))
    let x = radius * cos(angle)
    let y = radius * sin(angle) + h(.25)
    let compressionMult = map(dist(x,0,0,0),0,w(.5),1,2.9)
    let compressionSubtract = map(dist(x,0,0,0),0,w(.5),w(.25),0)
    let point = createVector(x,y*compressionMult - compressionSubtract)
    gridPoints.push(point)
  }
  pop()
}

function arcLayers() {
  push()
  numPoints = 30
  for (let i = 0; i < numPoints; i++) {
    let angle = map(i,0,numPoints,PI-radians(5),TWO_PI+radians(5)) + rnd(radians(3))
    let angle2 = map(i,0,numPoints/3,PI-radians(5),TWO_PI+radians(5))
    let radius = w(.25)
    let radius2 = w(.32)
    let radiusLG = w(.29)
    let smallRandomOffsetX = rnd(-w(.05),w(.05))
    let smallRandomOffsetY = rnd(-h(.05),h(.05))
    let x = radius * cos(angle) + smallRandomOffsetX
    let y = radius * sin(angle) + h(.3) + smallRandomOffsetY
    let x2 = radius2 * cos(angle) + smallRandomOffsetX
    let y2 = radius2 * sin(angle) + h(.3) + smallRandomOffsetY
    let x3 = radiusLG * cos(angle2)
    let y3 = radiusLG * sin(angle2) + h(.3)
    let compressionMult = map(dist(x,0,0,0),0,w(.5),1,2.9)
    let compressionSubtract = map(dist(x,0,0,0),0,w(.5),w(.25),0)
    let point = createVector(x,y*compressionMult - compressionSubtract)
    let point2 = createVector(x2,y2*compressionMult - compressionSubtract)
    let point3 = createVector(x3,y3*compressionMult - compressionSubtract)
    gridPoints.push(point)
    gridPoints.push(point2)
    if (i < numPoints / 3) {
      gridPoints_LG.push(point3)
    }
  }
  pop()
}

function circleLayers() {
  push()
  let num_rows = 13
  let r_inc = w(.06)
  for (let i = 0; i < num_rows; i++) {
    let y = map(i,0,num_rows,-r_inc*num_rows/2,r_inc*num_rows/2) + rnd(-h(.03),h(.03))
    let num_cols = round(map(dist(y,0,0,0), 0, num_rows/2 * r_inc, 11, 0))
    for (let j = 0; j < num_cols; j++) {
      let x = (map(j,0,num_cols,0-num_cols/2*r_inc,num_cols/2*r_inc)+ r_inc/2) * map(num_cols,0,11,2.3,1) + rnd(-w(.02),w(.02))
      let point = createVector(x + rnd(-w(.015),w(.015)),y + rnd(-h(.015),h(.015)))
      gridPoints.push(point)
    }  
  }
  let num_rows_2 = 5
  let r_inc_2 = w(.125)
  for (let i = 0; i < num_rows_2; i++) {
    let y = map(i,0,num_rows_2,-r_inc_2*num_rows_2/2,r_inc_2*num_rows_2/2)
    let num_cols = round(map(dist(y,0,0,0), 0, num_rows_2/2 * r_inc_2, 4, 0))
    for (let j = 0; j < num_cols; j++) {
      let x = (map(j,0,num_cols,0-num_cols/2*r_inc_2,num_cols/2*r_inc_2)+ r_inc_2/2) * map(num_cols,0,4,2.3,1)
      let point = createVector(x + rnd(-w(.015),w(.015)),y + rnd(-h(.015),h(.015)))
      gridPoints_LG.push(point)
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
  if (grid === 'circleGrid'){
    circleGrid()
    mothScale = chooseMothScale()
    for (let i = 0; i < gridPoints.length; i++) {
      //let sclAdjust = 
      let loc = createVector(gridPoints[i].x,gridPoints[i].y)
      let met = chooseMetal()
      let angle = 0; //any value to initialize
      let dir = createVector(cos(angle), sin(angle));
      let speed = -random(.1,.5);
      let start = rnd(20,200)
      let moth = chooseMoth()
      let rot = rnd(-TWO_PI,TWO_PI)
      let angleOffset = rnd(TWO_PI)
      buttermoths.push(new Buttermoth(loc, dir, speed, moth, mothScale, met, start, rot, grid, angleOffset));
      //console.log(buttermoths.length)
    }
  }
  if (grid === 'circleGridLarge'){
    circleGridLarge()
    mothScale = chooseMothScale()
    for (let i = 0; i < gridPoints.length; i++) {
      //let sclAdjust = 
      let randX = rnd(-w(.01),w(.01))
      let randY = rnd(-h(.01),h(.01))
      let loc = createVector(gridPoints[i].x + randX, gridPoints[i].y + randY)
      let met = chooseMetal()
      let angle = 0; //any value to initialize
      let dir = createVector(cos(angle), sin(angle));
      let speed = -random(.1,.5);
      let start = rnd(20,200)
      let moth = chooseMoth()
      let rot = rnd(-TWO_PI,TWO_PI)
      let angleOffset = rnd(TWO_PI)
      buttermoths.push(new Buttermoth(loc, dir, speed, moth, mothScale * 1.5, met, start, rot, grid, angleOffset));
      //console.log(buttermoths.length)
    }
  }
  if (grid === 'arcGrid'){
    arcGrid()
    for (let i = 0; i < gridPoints.length; i++) {
      //let sclAdjust = 
      let loc = createVector(gridPoints[i].x,gridPoints[i].y)
      let met = chooseMetal()
      let angle = 0; //any value to initialize
      let dir = createVector(cos(angle), sin(angle));
      let speed = -random(.1,.5);
      let start = rnd(20,200)
      let moth = chooseMoth()
      let rot = rnd(-TWO_PI,TWO_PI)
      let angleOffset = rnd(TWO_PI)
      let smallerScale = rnd(.25,.4)
      buttermoths.push(new Buttermoth(loc, dir, speed, moth, smallerScale, met, start, rot, grid, angleOffset));
    }
  }
  if (grid === 'arcLayers'){
    arcLayers()
    for (let i = 0; i < gridPoints.length; i++) {
      let loc = createVector(gridPoints[i].x,gridPoints[i].y)
      let met = chooseMetal()
      let angle = 0; //any value to initialize
      let dir = createVector(cos(angle), sin(angle));
      let speed = -random(.1,.5);
      let start = rnd(20,200)
      let moth = chooseMoth()
      let rot = rnd(-TWO_PI,TWO_PI)
      let angleOffset = rnd(TWO_PI)
      let smallerScale = rnd(.25,.4)
      buttermoths.push(new Buttermoth(loc, dir, speed, moth, smallerScale, met, start, rot, grid, angleOffset));
    }
    for (let i = 0; i < gridPoints_LG.length; i++) {
      let loc = createVector(gridPoints_LG[i].x,gridPoints_LG[i].y)
      let met = chooseMetal()
      let angle = 0; //any value to initialize
      let dir = createVector(cos(angle), sin(angle));
      let speed = -random(.1,.5);
      let start = rnd(20,200)
      let moth = chooseMoth()
      let rot = rnd(-TWO_PI,TWO_PI)
      let angleOffset = rnd(TWO_PI)
      let biggerScale = rnd(.8,1.1)
      buttermoths2.push(new Buttermoth(loc, dir, speed, moth, biggerScale, met, start, rot, grid, angleOffset));
    }
  }
  if (grid === 'circleLayers'){
    circleLayers()
    for (let i = 0; i < gridPoints.length; i++) {
      let loc = createVector(gridPoints[i].x,gridPoints[i].y)
      let met = chooseMetal()
      let angle = 0; //any value to initialize
      let dir = createVector(cos(angle), sin(angle));
      let speed = -random(.1,.5);
      let start = rnd(20,200)
      let moth = chooseMoth()
      let rot = rnd(-TWO_PI,TWO_PI)
      let angleOffset = rnd(TWO_PI)
      let smallerScale = rnd(.2,.35)
      buttermoths.push(new Buttermoth(loc, dir, speed, moth, smallerScale, met, start, rot, grid, angleOffset));
    }
    for (let i = 0; i < gridPoints_LG.length; i++) {
      let loc = createVector(gridPoints_LG[i].x,gridPoints_LG[i].y)
      let met = chooseMetal()
      let angle = 0; //any value to initialize
      let dir = createVector(cos(angle), sin(angle));
      let speed = -random(.1,.5);
      let start = rnd(20,200)
      let moth = chooseMoth()
      let rot = rnd(-TWO_PI,TWO_PI)
      let angleOffset = rnd(TWO_PI)
      let biggerScale = rnd(.9,1.15)
      buttermoths2.push(new Buttermoth(loc, dir, speed, moth, biggerScale, met, start, rot, grid, angleOffset));
    }
  }
  if (grid === 'shaftGrid'){
    shaftGrid()
    mothScale = chooseMothScale()
    for (let i = 0; i < gridPoints.length; i++) {
      //let sclAdjust = 
      let loc = createVector(gridPoints[i].x,gridPoints[i].y)
      let met = chooseMetal()
      let angle = 0; //any value to initialize
      let dir = createVector(cos(angle), sin(angle));
      let speed = rnd(.1,1);
      let start = rnd(50,200)
      let moth = chooseMoth()
      let rot = rnd(-PI,PI)
      let angleOffset = rnd(TWO_PI)
      buttermoths.push(new Buttermoth(loc, dir, speed, moth, mothScale, met, start, rot*3, grid, angleOffset));
      //console.log(buttermoths.length)
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
    let diff = rnd(.85,1.15)
    let speedCoeff = rnd(.5,1)
    let x = radius*cos(angle)*diff
    let y = radius*sin(angle)*diff

    //let gold = [255,231,122]
    //let platinum = [227, 222, 197]
    //let silver = [209, 233, 237]
    //metals = [gold,platinum,silver]
    //met = metals[floor(rnd()*metals.length)]
    let met = chooseMetal()

    let start = rnd(25,125)
    let moth = chooseMoth()
    let rot = rnd(-PI,PI)
    //let rot = rnd(TWO_PI) + i/2
    p = new Buttermoth_Spiral(x,y,size,radius,angle,speedCoeff,met,start,moth,rot,mothScale)
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
  for (let i = 0; i < buttermoths2.length; i++) {
    buttermoths2[i].run(fM_xoff,fM_yoff);
    fM_xoff += fM_inc;
    fM_yoff += fM_inc;
  }
}

function chooseMoth() { 
  const mothOptions = [moth_9,moth_10,moth_11,moth_12];
  return mothOptions[floor(rnd()*mothOptions.length)];
}

function moth_9(x,y,sc,rot,fadeIn,metl) {

  push()
  let x1 = x
  let y1 = y
  let x2 = x + sc * w(.15) * cos(frameCount / 30)
  let y2 = y + sc * w(.15) * sin(frameCount / 60)
  let c = .9
  let mouseDist = dist(x,y,mouseX-width/2,mouseY-height/2)
  if (mouseDist < w(.2)) {
    c = map(dist(x,y,mouseX-width/2,mouseY-height/2),0,w(.2),.1,1)
  }
  let gradient = drawingContext.createLinearGradient(x1,y1,x2,y2)
  let alpha = map(frameCount,fadeIn,fadeIn+25,0,200)
  //let c1 = color(250*c, 221*c, 140*c, alpha);
  //let c2 = color(227*c, 147*c, 77*c, alpha);
  //let c3 = color(252*c, 235*c, 217*c, alpha);
  let c1 = color(metl.mc1[0]*c, metl.mc1[1]*c, metl.mc1[2]*c, alpha);
  let c2 = color(metl.mc2[0]*c, metl.mc2[1]*c, metl.mc2[2]*c, alpha);
  let c3 = color(metl.mc3[0]*c, metl.mc3[1]*c, metl.mc3[2]*c, alpha);
  gradient.addColorStop(0,   c1.toString());
  gradient.addColorStop(0.33, c2.toString());
  gradient.addColorStop(0.66,   c1.toString());
  gradient.addColorStop(1,   c3.toString());
  drawingContext.fillStyle = gradient;
  //resetMatrix()
  //translate(-width/2,-height/2)
  translate(x,y)
  let rotOption = rot
  if (mouseDist < w(.2)) {
    rotOption = map(mouseDist,w(.2),0,rot,atan2(mouseY - y, mouseX - x));
  }
  rotate(rotOption)
  scale(sc)

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
  relcoords_c.forEach(i => ellipse(i[0],i[1],i[2]))

  let relCoords_tr = [];
  const denTr = 10000
  coords_tr.forEach(i => relCoords_tr.push([w(i[0]/denTr) - w(.5),h(i[1]/denTr) - h(.5),w(i[2]/denTr) - w(.5),h(i[3]/denTr) - h(.5),w(i[4]/denTr) - w(.5),h(i[5]/denTr) - h(.5)]))
  relCoords_tr.forEach(i => {
    //fill(30 + i,10,20)
    triangle(i[0],i[1],i[2],i[3],i[4],i[5])
    //triangle_rgb(i[0],i[1],i[2],i[3],i[4],i[5],255,15,35,200)
  });

  pop()
}

function moth_10(x,y,sc,rot,fadeIn,metl) {

  push()
  let x1 = x
  let y1 = y
  let x2 = x + sc * w(.15) * cos(frameCount / 30)
  let y2 = y + sc * w(.15) * sin(frameCount / 60)
  let c = .9
  let mouseDist = dist(x,y,mouseX-width/2,mouseY-height/2)
  if (mouseDist < w(.2)) {
    c = map(dist(x,y,mouseX-width/2,mouseY-height/2),0,w(.2),.1,1)
  }
  let gradient = drawingContext.createLinearGradient(x1,y1,x2,y2)
  let alpha = map(frameCount,fadeIn,fadeIn+25,0,200)
  //let c1 = color(219*c, 248*c, 255*c, alpha);
  //let c2 = color(245*c, 251*c, 252*c, alpha);
  //let c3 = color(227*c, 242*c, 255*c, alpha);
  let c1 = color(metl.mc1[0]*c, metl.mc1[1]*c, metl.mc1[2]*c, alpha);
  let c2 = color(metl.mc2[0]*c, metl.mc2[1]*c, metl.mc2[2]*c, alpha);
  let c3 = color(metl.mc3[0]*c, metl.mc3[1]*c, metl.mc3[2]*c, alpha);
  gradient.addColorStop(0,   c1.toString());
  gradient.addColorStop(0.33, c2.toString());
  gradient.addColorStop(0.66,   c1.toString());
  gradient.addColorStop(1,   c3.toString());
  drawingContext.fillStyle = gradient;
  //resetMatrix()
  //translate(-width/2,-height/2)
  translate(x,y)
  let rotOption = rot
  if (mouseDist < w(.2)) {
    rotOption = map(mouseDist,w(.2),0,rot,atan2(mouseY - y, mouseX - x));
  }
  rotate(rotOption)
  scale(sc)

  let coords_tr = [

    [4863,4971,5056,4906,5059,4955],
    [4840,4983,4809,5002,4829,5032],
    [4842,5032,4861,5057,4927,5099],
    [4915,5113,4895,5175,4895,5240],
    [4891,5228,4895,5253,4885,5274],
    [4718,4735,4775,4728,4901,4770],
    [4885,4883,4912,4893,4847,4948],
    [5003,4879,4885,4917,4920,4887],
    [5127,4852,5103,4867,5117,4963],
    [5091,4983,5080,5006,5105,5060],
    [5138,5099,5129,5130,5136,5184],
    [5129,5166,5126,5209,5138,5243],
    [5194,4826,5219,4820,5287,4845],
    [5235,4981,5277,4931,5290,4893],
    [4765,4787,4788,4784,4845,4813],
    [4940,4879,4890,4825,4880,4766],
    [4772,4829,4752,4931,4772,4952],
    [5102,4915,5147,5061,5111,5069],
    [5068,4988,5080,4961,5070,4883],
    [5074,4874,5087,4869,5092,4879],
    [5063,4988,5059,4975,5068,4934],
    [5248,4920,5251,4942,5150,5052],
    [4845,5024,4845,4983,4908,5076],
    [4876,4940,4905,4915,5001,4914],
    [5046,4854,5058,4867,5058,4883],
    [5008,4913,5024,4901,5053,4898],
    [4777,4851,4777,4797,4814,4822],
    [4790,4782,4823,4794,4812,4760],
    [4777,4783,4815,4755,4748,4751],
    [5022,5033,5041,5019,5046,4976],
    [5046,4992,5051,4986,5053,4954]]

  let coords_c = [

    [5092,4829,15],
    [5205,4882,57],
    [5182,4955,57],
    [5147,5021,4],
    [5144,5060,21],
    [4952,5052,53],
    [4990,5006,43],
    [5024,4957,29],
    [4905,4998,37],
    [4855,4851,5],
    [4932,4825,43],
    [4983,4845,31],
    [5023,4867,27],
    [4752,4794,3],
    [4729,4754,28],
    [5080,4917,11],
    [4800,4922,33],
    [4834,4913,37],
    [4784,4874,32],
    [4857,4787,28],
    [5266,4875,33],
    [5156,4876,37]]

  let relcoords_c = [];
  const denC = 10000
  coords_c.forEach(i => relcoords_c.push([w(i[0]/denC) - w(.5),h(i[1]/denC) - h(.5),w(i[2]/(denC/2))]))
  relcoords_c.forEach(i => ellipse(i[0],i[1],i[2]))

  let relCoords_tr = [];
  const denTr = 10000
  coords_tr.forEach(i => relCoords_tr.push([w(i[0]/denTr) - w(.5),h(i[1]/denTr) - h(.5),w(i[2]/denTr) - w(.5),h(i[3]/denTr) - h(.5),w(i[4]/denTr) - w(.5),h(i[5]/denTr) - h(.5)]))
  relCoords_tr.forEach(i => triangle(i[0],i[1],i[2],i[3],i[4],i[5]))

  pop()
}

function moth_11(x,y,sc,rot,fadeIn,metl) {

  push()
  let x1 = x
  let y1 = y
  let x2 = x + sc * w(.15) * cos(frameCount / 30)
  let y2 = y + sc * w(.15) * sin(frameCount / 60)
  let c = .9
  let mouseDist = dist(x,y,mouseX-width/2,mouseY-height/2)
  if (mouseDist < w(.2)) {
    c = map(dist(x,y,mouseX-width/2,mouseY-height/2),0,w(.2),.1,1)
  }
  let gradient = drawingContext.createLinearGradient(x1,y1,x2,y2)
  let alpha = map(frameCount,fadeIn,fadeIn+25,0,200)
  //let c1 = color(252*c, 248*c, 194*c, alpha);
  //let c2 = color(224*c, 202*c, 150*c, alpha);
  //let c3 = color(237*c, 237*c, 235*c, alpha);
  let c1 = color(metl.mc1[0]*c, metl.mc1[1]*c, metl.mc1[2]*c, alpha);
  let c2 = color(metl.mc2[0]*c, metl.mc2[1]*c, metl.mc2[2]*c, alpha);
  let c3 = color(metl.mc3[0]*c, metl.mc3[1]*c, metl.mc3[2]*c, alpha);
  gradient.addColorStop(0,   c1.toString());
  gradient.addColorStop(0.33, c2.toString());
  gradient.addColorStop(0.66,   c1.toString());
  gradient.addColorStop(1,   c3.toString());
  drawingContext.fillStyle = gradient;
  //resetMatrix()
  //translate(-width/2,-height/2)
  translate(x,y)
  let rotOption = rot
  if (mouseDist < w(.2)) {
    rotOption = map(mouseDist,w(.2),0,rot,atan2(mouseY - y, mouseX - x));
  }
  rotate(rotOption)
  scale(sc)

  let coords_tr = [

    [4694,5150,4729,5114,4712,5170],
    [4723,5155,4740,5093,4747,5111],
    [4814,5072,4814,5034,4825,5021],
    [4791,4948,4810,4902,4816,4916],
    [4803,4894,4791,4894,4786,4948],
    [4885,4929,4881,4894,4848,4892],
    [4852,4905,4885,4929,4875,4932],
    [4881,4996,4920,4947,4952,4983],
    [4851,4971,4889,4992,4870,5012],
    [4893,4921,5020,4813,5022,4867],
    [5121,4745,5185,4722,5262,4724],
    [5076,4777,5066,4738,5099,4715],
    [4893,4838,4908,4785,4970,4730],
    [4893,4896,4901,4860,4970,4830],
    [4754,5091,4786,5071,4774,5066],
    [4774,5006,4764,5061,4789,5031],
    [4946,5054,5016,5052,5123,5054],
    [4858,5102,4872,5201,4901,5155],
    [4881,5212,4909,5232,4924,5224],
    [5009,5117,4905,5222,5009,5256],
    [5011,5134,5013,5232,5048,5194],
    [5040,5251,5060,5224,5083,5240],
    [5081,5204,5048,5232,5023,5224],
    [5108,5099,5173,5115,5144,5092],
    [5096,5098,5146,5120,5128,5152],
    [4958,5164,4999,5118,4953,5115],
    [4958,5111,5018,5065,4961,5055],
    [4896,5051,4852,5072,4854,5091],
    [5004,4870,5051,4790,5109,4760],
    [5082,4974,5140,5017,5164,4993],
    [4983,4971,5009,4992,5029,4982],
    [5273,4873,5298,4861,5298,4806],
    [4973,4732,5000,4700,5039,4682],
    [4901,5145,4901,5187,4918,5188],
    [4858,4971,4926,4929,4885,4929],
    [5039,4697,5058,4773,5032,4769]]


  let coords_c = [

    [5160,4890,94],
    [5213,4817,82],
    [4901,5102,42],
    [4905,5068,19],
    [4946,5086,31],
    [5028,5256,32],
    [5076,5159,45],
    [5046,5105,5],
    [4962,4937,47],
    [5035,4923,58],
    [5086,4967,35],
    [5131,4785,42],
    [4961,4797,41],
    [5003,4755,33],
    [4884,4853,21],
    [4867,4886,14],
    [5076,4707,25],
    [4785,4914,15],
    [4779,4937,1],
    [4800,5028,24],
    [4788,4996,18],
    [4789,5064,15],
    [4751,5109,16],
    [4933,5164,26],
    [5146,5138,8],
    [5119,5169,19],
    [5069,5314,4],
    [5282,4782,24],
    [5128,5090,14],
    [5100,5075,15],
    [5147,5052,5],
    [5123,5067,13],
    [5187,4981,17],
    [5221,4966,18]]

  let relcoords_c = [];
  const denC = 10000
  coords_c.forEach(i => relcoords_c.push([w(i[0]/denC) - w(.5),h(i[1]/denC) - h(.5),w(i[2]/(denC/2))]))
  relcoords_c.forEach(i => ellipse(i[0],i[1],i[2]))

  let relCoords_tr = [];
  const denTr = 10000
  coords_tr.forEach(i => relCoords_tr.push([w(i[0]/denTr) - w(.5),h(i[1]/denTr) - h(.5),w(i[2]/denTr) - w(.5),h(i[3]/denTr) - h(.5),w(i[4]/denTr) - w(.5),h(i[5]/denTr) - h(.5)]))
  relCoords_tr.forEach(i => triangle(i[0],i[1],i[2],i[3],i[4],i[5]))

  pop()
}

function moth_12(x,y,sc,rot,fadeIn,metl) {

  push()
  let x1 = x
  let y1 = y
  let x2 = x + sc * w(.15) * cos(frameCount / 30)
  let y2 = y + sc * w(.15) * sin(frameCount / 60)
  let c = .9
  let mouseDist = dist(x,y,mouseX-width/2,mouseY-height/2)
  if (mouseDist < w(.2)) {
    c = map(dist(x,y,mouseX-width/2,mouseY-height/2),0,w(.2),.1,1)
  }
  let gradient = drawingContext.createLinearGradient(x1,y1,x2,y2)
  let alpha = map(frameCount,fadeIn,fadeIn+25,0,200)
  //let c1 = color(250*c, 221*c, 140*c, alpha);
  //let c2 = color(227*c, 147*c, 77*c, alpha);
  //let c3 = color(252*c, 235*c, 217*c, alpha);
  let c1 = color(metl.mc1[0]*c, metl.mc1[1]*c, metl.mc1[2]*c, alpha);
  let c2 = color(metl.mc2[0]*c, metl.mc2[1]*c, metl.mc2[2]*c, alpha);
  let c3 = color(metl.mc3[0]*c, metl.mc3[1]*c, metl.mc3[2]*c, alpha);
  gradient.addColorStop(0,   c1.toString());
  gradient.addColorStop(0.33, c2.toString());
  gradient.addColorStop(0.66,   c1.toString());
  gradient.addColorStop(1,   c3.toString());
  drawingContext.fillStyle = gradient;
  //resetMatrix()
  //translate(-width/2,-height/2)
  translate(x,y)
  let rotOption = rot
  if (mouseDist < w(.2)) {
    rotOption = map(mouseDist,w(.2),0,rot,atan2(mouseY - y, mouseX - x));
  }
  rotate(rotOption)
  scale(sc)

  let coords_tr = [

    [4851,4904,4828,4879,4772,4744],
    [4885,4815,4973,4915,4959,4980],
    [4806,4744,4772,4744,4880,4830],
    [4840,4810,4871,5053,4905,5088],
    [4978,5022,4919,5084,4843,4801],
    [5075,5071,5232,4949,5224,4887],
    [5201,4775,5005,4920,5212,4824],
    [5200,4658,5053,4824,5009,4911],
    [5185,4847,4999,4949,5224,4887],
    [4987,4979,5033,5060,5192,4949],
    [5066,5088,5153,5034,5212,5056],
    [5086,5106,5096,5152,5200,5080],
    [5132,5181,5099,5161,5200,5080],
    [5177,5165,5130,5295,5160,5165],
    [4843,5331,4910,5224,4946,5224],
    [4880,5130,4910,5224,4954,5107],
    [4983,5081,5005,5152,5023,5102],
    [4987,5230,5016,5123,5039,5117]]

  let coords_c = [

    [4983,5069,26],
    [4930,5165,32],
    [4914,5129,18],
    [4950,5139,1],
    [4943,5188,14],
    [5006,5230,19],
    [5030,5143,18],
    [5029,5169,22],
    [5066,5052,21],
    [5210,4677,22],
    [5174,4769,37],
    [5171,5052,25],
    [5168,5161,12],
    [5130,5286,9],
    [5136,5267,1],
    [5025,5198,8],
    [5023,5106,1],
    [4907,5080,13],
    [4839,4813,33],
    [4770,4748,6],
    [4806,4774,11],
    [4974,5016,7],
    [5005,4975,18],
    [5018,4920,7],
    [5011,4939,14],
    [5148,4933,71],
    [5207,4799,14],
    [5213,4709,14],
    [5215,4739,5],
    [5107,4831,5],
    [5004,4912,3],
    [5042,4879,11],
    [5092,5091,19],
    [5061,5092,4],
    [5133,5172,12],
    [5201,5109,3],
    [5199,5033,4],
    [5232,4916,3],
    [5214,4825,4],
    [4971,4933,6],
    [4971,5160,4],
    [4940,5221,7],
    [4888,5158,1],
    [4892,5205,6],
    [4881,5131,5],
    [4867,5312,8],
    [4855,5323,4],
    [4834,5342,3],
    [4843,5338,5]]

  let relcoords_c = [];
  const denC = 10000
  coords_c.forEach(i => relcoords_c.push([w(i[0]/denC) - w(.5),h(i[1]/denC) - h(.5),w(i[2]/(denC/2))]))
  relcoords_c.forEach(i => ellipse(i[0],i[1],i[2]))

  let relCoords_tr = [];
  const denTr = 10000
  coords_tr.forEach(i => relCoords_tr.push([w(i[0]/denTr) - w(.5),h(i[1]/denTr) - h(.5),w(i[2]/denTr) - w(.5),h(i[3]/denTr) - h(.5),w(i[4]/denTr) - w(.5),h(i[5]/denTr) - h(.5)]))
  relCoords_tr.forEach(i => triangle(i[0],i[1],i[2],i[3],i[4],i[5]))

  pop()
}

function crescent(sc,fadeIn,metl) {

  push()
  let x1 = x
  let y1 = y
  let x2 = x + sc * w(.5) * cos(frameCount / 30)
  let y2 = y + sc * w(.5) * sin(frameCount / 60)
  let c = .9
  let mouseDist = dist(x,y,mouseX-width/2,mouseY-height/2)
  if (mouseDist < w(.2)) {
    c = map(dist(x,y,mouseX-width/2,mouseY-height/2),0,w(.2),.1,1)
  }
  let gradient = drawingContext.createLinearGradient(x1,y1,x2,y2)
  let alpha = map(frameCount,fadeIn,fadeIn+25,0,200)
  let c1 = color(metl.mc1[0]*c, metl.mc1[1]*c, metl.mc1[2]*c, alpha);
  let c2 = color(metl.mc2[0]*c, metl.mc2[1]*c, metl.mc2[2]*c, alpha);
  let c3 = color(metl.mc3[0]*c, metl.mc3[1]*c, metl.mc3[2]*c, alpha);
  gradient.addColorStop(0,   c1.toString());
  gradient.addColorStop(0.33, c2.toString());
  gradient.addColorStop(0.66,   c1.toString());
  gradient.addColorStop(1,   c3.toString());
  drawingContext.fillStyle = gradient;

  let coords_tr = [

    [8499,995,8521,869,8571,869],
    [8657,685,8521,869,8571,869],
    [8823,750,8823,609,8657,685],
    [8521,869,8571,765,8657,685],
    [9022,660,8823,609,8823,750],
    [8965,788,9022,660,8823,756],
    [8578,863,8673,791,8657,685],
    [8823,756,8673,791,8657,685],
    [9022,660,909,887,8965,788],
    [9258,880,909,887,9037,675],
    [9240,1093,9258,880,9090,880],
    [9161,1094,9240,1093,9090,880],
    [9258,880,9276,1007,9248,110],
    [8823,609,8942,609,9022,660],
    [9258,880,9216,777,9037,675],
    [8942,609,9064,651,9022,660],
    [9216,777,9064,651,9022,660],
    [9124,1247,9161,1094,9234,1100],
    [9037,1344,9093,1298,9155,1270],
    [9124,1247,9155,1278,9093,1290],
    [9240,1106,9155,1278,9124,1240],
    [9155,1278,9216,1214,9248,1100],
    [9276,1007,9267,1093,9216,1210],
    [9064,651,9144,701,9216,777],
    [8657,685,8734,634,8823,609]]

  let relCoords_tr = [];
  const denTr = 10000
  coords_tr.forEach(i => relCoords_tr.push([w(i[0]/denTr) - w(.5),h(i[1]/denTr) - h(.5),w(i[2]/denTr) - w(.5),h(i[3]/denTr) - h(.5),w(i[4]/denTr) - w(.5),h(i[5]/denTr) - h(.5)]))
  relCoords_tr.forEach(i => triangle(i[0],i[1],i[2],i[3],i[4],i[5]))

  pop()

}

class Buttermoth{
  constructor(_loc,_dir,_speed,_moth,_mothScale,_met,_start,_rot,_grid,_angleOffset){
    this.loc = _loc;
    this.dir = _dir;
    this.speed = _speed;
    this.moth = _moth;
    this.mothScale = _mothScale;
    this.met = _met;
    this.start = _start;
    this.rot = _rot;
    this.grid = _grid;
    this.angleOffset = _angleOffset;
    
  	// var col;
  }
  run(fM_xoff,fM_yoff) {
    this.move()
    if (this.grid == 'shaftGrid'){
      this.checkEdges();
    }
    this.update(fM_xoff,fM_yoff);
  }
  move(){
    //let angle = noise(this.loc.x/fM_noiseScale, this.loc.y/fM_noiseScale, frameCount/fM_noiseScale)*TWO_PI*fM_noiseStrength; //0-2PI
    let angle = frameCount / 5
    this.dir.x = cos(angle);
    this.dir.y = sin(angle);
    var vel = this.dir.copy();
    var d = .5;  //direction change 
    vel.mult(this.speed*d); //vel = vel * (speed*d)
    this.loc.add(vel); //loc = loc + vel
    if (this.grid == 'shaftGrid'){
      angle = frameCount/ 90 + this.angleOffset * this.speed
      this.dir.x = cos(angle)*.3;
      this.dir.y = -noise(angle)*5;
      var vel = this.dir.copy();
      //var d = 1;  //direction change 
      //vel.mult(this.speed*d); //vel = vel * (speed*d)
      this.loc.add(vel); //loc = loc + vel
    }
    if (this.grid == 'circleGrid' || this.grid == 'circleLayers') {
      let angle = frameCount / 90
      //this.dir.x = cos(angle);
      //this.dir.y = sin(angle);
      //var vel = this.dir.copy();
      //var d = .5;  //direction change 
      //vel.mult(this.speed*d); //vel = vel * (speed*d)
      //this.loc.add(vel); //loc = loc + vel
      let radius = dist(0,0,this.loc.x,this.loc.y)
      this.loc.x = radius * cos(angle+radians(this.start*2))
      this.loc.y = radius * sin(angle+radians(this.start*2))
    }
  }
  checkEdges(){
    if (this.grid == 'shaftGrid'){
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

    let c = map(noise(fM_xoff, fM_yoff), 0, 1, 0, map(dist(this.loc.x,this.loc.y,mouseX-width/2,mouseY-height/2),w(.05),width/2,0,1));
    let breathingAngle = frameCount / 30
    let breathing = map(sin(breathingAngle),-1,1,1,1.1)
    let t = 0
    t += 30

    background(0,.5)
    noStroke()
    fill(c * this.met[0], c * this.met[1], c * this.met[2], map(frameCount,this.start,this.start+10,0,10) + c * 0.2);
    if (this.grid == 'arcLayers' || this.grid == 'arcGrid' || this.grid == 'shaftGrid') {
      this.moth(this.loc.x * breathing, this.loc.y, this.mothScale, this.rot + map(sin(frameCount/90 + this.angleOffset),-1,1,0,this.rot),this.start,this.met);
    }else if (this.grid == 'circleGrid' || this.grid == 'circleLayers') {
      push()
      //rotate(frameCount / 90)
      this.moth(this.loc.x * breathing, this.loc.y * breathing, this.mothScale, this.rot + map(sin(frameCount/90 + this.angleOffset),-1,1,0,this.rot),this.start,this.met);
      pop()
    }else{
      this.moth(this.loc.x * breathing, this.loc.y * breathing, this.mothScale, this.rot + map(sin(frameCount/90 + this.angleOffset),-1,1,0,this.rot),this.start,this.met);
    }
  }
}

class Buttermoth_Spiral{
  constructor(_x,_y,_size,_radius,_angle,_speedCoeff,_met,_start,_moth,_rot,_mothScale){
    this.x = _x;
    this.y = _y;
    this.size = _size;
    this.radius = _radius;
    this.angle = _angle;
    this.speedCoeff = _speedCoeff;
    this.met = _met;
    this.start = _start
    this.moth = _moth;
    this.rot = _rot;
    this.mothScale = _mothScale;
    this.history = []
  }

  run(fM_xoff,fM_yoff) {
    this.update();
    this.checkEdges();
    this.show(fM_xoff,fM_yoff);
  }

  update() {
    let t = 0
    let relSpeed = this.speedCoeff * map(dist(this.x,this.y,0,0),w(.8),0,.1,2)
    t += .5 * relSpeed
    let tr = 0
    rotate(radians(frameCount * .01))
    this.x *= map(t,0,50,1,.6)
    this.y *= map(t,0,50,1,.6)
    tr += 50 * this.speedCoeff
  }

  checkEdges() {
    if (dist(this.x,this.y,0,0) < w(.045)) {
      this.start = frameCount
      let newRadius = rnd(w(.25),w(.75))
      //let newAngle = frameCount / 90
      this.x = newRadius*cos(this.angle)
      this.y = newRadius*sin(this.angle)
    }
  }

  show(fM_xoff,fM_yoff) {

    let c = map(noise(fM_xoff, fM_yoff), 0, 1, 0, map(dist(this.x,this.y,mouseX-width/2,mouseY-height/2),w(.05),w(.2),0,.3));
    fill(c * this.met[0],c * this.met[1],c * this.met[2], map(dist(this.x,this.y,0,0),w(.045),w(.023),255,0))
    noStroke()
    //background(0,1.3)
    this.moth(this.x, this.y, this.mothScale * map(dist(this.x,this.y,0,0),w(.8),0,1.3,.45), map(sin(frameCount/60),-1,1,0,this.rot),this.start,this.met);
  }
}
