const hashPairs = [];
for (let j = 0; j < 32; j++) {
  hashPairs.push(tokenData.hash.slice(2 + (j * 2), 4 + (j * 2)));
}
const decPairs = hashPairs.map(x => {
  return parseInt(x, 16);
});

S=Uint32Array.from([0,1,s=t=2,3].map(i=>parseInt(tokenData.hash.substr(i*8+2,8),16)));R=_=>(t=S[3],S[3]=S[2],S[2]=S[1],S[1]=s=S[0],t^=t<<11,S[0]^=(t^t>>>8)^(s>>>19),S[0]/2**32);

const seed = parseInt(tokenData.hash.slice(2,16), 16);

let callCount = 0

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
    callCount += 1;
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
  carbon: {
    light: [204, 204, 204],
    dark: [67, 71, 74],
    ac_light: [235, 242, 247],
    ac_dark: [14, 22, 28]
  },
  barok: {
    light: [194, 165, 99],
    dark: [156, 68, 23],
    ac_light: [247, 227, 168],
    ac_dark: [79, 18, 6]
  },
  pyrrol: {
    light: [237, 64, 45],
    dark: [125, 20, 9],
    ac_light: [217, 50, 97],
    ac_dark: [97, 30, 49]
  },
  ultramarine: {
    // light: [0, 131, 193],
    // dark: [0, 52, 99],
    // ac_light: [162,249,240],
    // ac_dark: [44, 77, 60]
    // ALTERNATE PALETTE
    light: [25, 91, 214],
    dark: [35, 52, 99],
    ac_light: [204, 235, 230],
    ac_dark: [44, 77, 60]
  },
  ochre: {
    light: [206, 119, 81],
    dark: [81, 70, 46],
    ac_light: [221, 154, 5],
    ac_dark: [25, 15, 0]
  },
  cerulean: {
    light: [42, 151, 237],
    dark: [150, 83, 123],
    ac_light: [250, 107, 148],
    ac_dark: [222, 82, 67]
  },
  vermillion: {
    light: [249, 114, 122],
    dark: [191,44,73],
    ac_light: [252,149,149],
    ac_dark: [120,0,53]
  },
  violet: {
    light: [255,204,143],
    dark: [167,96,255],
    ac_light: [255,218,175],
    ac_dark: [202,130,255]
  },
  flemish: {
    light: [224, 77, 1],
    dark: [37, 29, 58],
    ac_light: [255, 119, 0],
    ac_dark: [42, 37, 80]
  },
  magenta: {
    light: [255, 184, 128],
    dark: [255, 77, 129],
    ac_light: [229, 148, 173],
    ac_dark: [154, 2, 56]
  },
  cobalt: {
    light: [3, 4, 94],
    dark: [144, 224,239],
    ac_light: [0, 180, 216],
    ac_dark: [202, 240, 248]
  }
}

const mOps = {
  gold: {
    mc1: [247,234,178],
    mc2: [244,242,188],
    mc3: [242,210,117]
  },
  whitegold: {
    mc1: [239,237,228],
    mc2: [247,225,220],
    mc3: [244,226,208]
  },
  silver: {
    mc1: [194,209,213],
    mc2: [214,236,242],
    mc3: [228,243,249]
  },
  platinum: {
    mc1: [246,239,239],
    mc2: [220,215,217],
    mc3: [203,210,210]
  },
  rosegold: {
    mc1: [215,150,148],
    mc2: [232,193,171],
    mc3: [206,167,143]
  },
  palladium: {
    mc1: [229,229,229],
    mc2: [216,216,216],
    mc3: [191,191,191]
  }
}

let rds;
let cV;

// GENERAL
let cCoeff;

// BUFFERS
let bg1;
let graphics;
let rings;
let flag;
let moths;

// FOR fractals & shards
const slices = 150;
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
let fM_noiseScale = 200, fM_noiseStrength = 1;
let BMs = [];
let BMs2 = [];

let spiralMoths = []
let numP_spiralMoths;

let gridType;
let gP = []
let gP_LG = []
let numPoints;

let cresMet;

let sV;

let gS; // gridScale

let cresExists;

//FLAG

let drips = [];
let numDrips;

let play = true;


function setup() {
  noiseSeed(seed)
  const smD = windowWidth < windowHeight ? windowWidth : windowHeight;
  createCanvas(smD, smD);
  let pixDen = map(smD,0,4500,2,1)
  pixelDensity(pixDen)
  // pixelDensity(12)
  sV = width/120
  rds = radians
  cV = createVector

  //pal = chPalette()
  pal = palettes.flemish;

  bgEffect = chBackgroundEffect()
  //bgEffect = singularity

  setWater()

  gS = chScale();

  bg1 = createGraphics(smD/5,smD/5)

  bg1.translate(bg1.width/2,bg1.height/2)

  if (bgEffect === flagg) {
    flag = createGraphics(smD,smD)

    flag.translate(flag.width/2,flag.height/2)
  
    flagg()

    flagDrips()
  }
  if (bgEffect === singularity) {
    flag = createGraphics(smD,smD)
    flag.translate(flag.width/2,flag.height/2)
  }
  if (bgEffect === etched) {
    flag = createGraphics(smD,smD)
    flag.translate(flag.width/2,flag.height/2)
    if (frameCount % 6 ==0) {
      etched()
    }
  }

  setFractals()
  setAura()

  graphics = createGraphics(smD,smD);

  rings = createGraphics(smD/3,smD/3)

  rings.translate(rings.width/2,rings.height/2)

  gridType = chGrid()

  chTexture(gridType)

  // if (exTyP < .13) {
  //   expTy = 'ripple'
  // }else if (exTyP < .26){
  //   expTy = 'filament'
  // }else if (exTyP < .37){
  //   expTy = 'catalyst'
  // }else if (exTyP < .48){
  //   expTy = 'emission'
  // }else if (exTyP < .58){
  //   expTy = 'diffused'
  // }else if (exTyP < .68){
  //   expTy = 'quantum'
  // }else if (exTyP < .78){
  //   expTy = 'aether'
  // }else if (exTyP < .86){
  //   expTy = 'spirograph'
  // }else if (exTyP < .94){
  //   expTy = 'sonar'
  // }else{
  //   expTy = 'concentric'
  // }

  exType = chexpTy()
  //exType = 'quantum'
  //console.log(exType)

  setIrregCircles(exType, gridType)

  cresExists = chCrescent()

  cresMet = chElement()

  setFog() 

  if (gridType === 'vortex') {
    setSpiralMoths(gS)
  }else{
    mothsSetup(gridType, gS)
  }
}

function draw() {
  frameRate(32)
  translate(width/2,height/2)
  imageMode(CENTER)
  let cCoeff = map(sin(frameCount / 60),-1,1,.1,.85)
  if (mouseIsPressed) {
    cCoeff = map(mouseY,0,h(1),0,1)
  }
  // let cCoeff = .2
  background(pal.dark[0]*cCoeff, pal.dark[1]*cCoeff, pal.dark[2]*cCoeff, 100*cCoeff)
  //fractals()
  if (bgEffect === flagg) {
    image(flag,0,0,width,height)
    drawDrips()
    textureOverFlag2()
  }
  if (bgEffect === etched || bgEffect === singularity) {
    image(flag,0,0,width,height)
    textureOverFlag2()
  }
  image(bg1,0,0,width,height)
  if (bgEffect != flagg) {
    bgEffect(gridType)
  }

  water()

  image(graphics, 0, 0)

  image(rings, 0, 0, width, height)
  rings.clear()

  drawIrregCircles()

  //let blackBgOp = map(sin(frameCount/60+rds(90)),-1,1,65,0)
  let blackBgOp = 55
  // if (mouseIsPressed) {
  //   blackBgOp = map(mouseY,0,h(1),65,0)
  // }
  background(0,blackBgOp) // SIMPLE FADE TO 50% BLACK

  if (cresExists == 'yes') {
    crescent(cresMet, gS)
  }

  if (gridType === 'vortex') {
    drawSpiralMoths()
  }else{
    drawGridMoths()
  }

  topFog()

}


function keyPressed() {
  if (keyCode == 32) {
    play = !play;
    play ? loop() : noLoop()
  }
}

function doubleClicked() {
  play = !play;
  play ? loop() : noLoop()
} 

// chRS

function chPalette() {
  const pP = map(decPairs[1],0,255,0,1);
    if (pP < .18) {
      chP = palettes.ultramarine
    }else if (pP < .33){
      chP = palettes.ochre
    }else if (pP < .48){
      chP = palettes.cobalt
    }else if (pP < .58){
      chP = palettes.flemish
    }else if (pP < .68){
      chP = palettes.barok
    }else if (pP < .76){
      chP = palettes.pyrrol
    }else if (pP < .83){
      chP = palettes.vermillion
    }else if (pP < .87){
      chP = palettes.violet
    }else if (pP < .93){
      chP = palettes.cerulean
    }else if (pP < .98){
      chP = palettes.magenta
    }else{
      chP = palettes.carbon
    }
    return chP
}

function chGrid() {
  const gP = map(decPairs[2],0,255,0,1);
    if (gP < .22) {
      chG = 'chaos'
    }else if (gP < .41) {
      chG = 'gyre'
    }else if (gP < .57) {
      chG = 'silo'
    }else if (gP < .71) {
      chG = 'vortex'
    }else if (gP < .84) {
      chG = 'halo'
    }else if (gP < .92) {
      chG = 'cradle'
    }else if (gP < .96) {
      chG = 'entropy'
    }else {
      chG = 'shoal'
    }
    return chG;
}

function chBackgroundEffect() {
  const wP = map(decPairs[3],0,255,0,1);
    if (wP < .26) {
      chEf = shards
    }else if (wP < .48) {
      chEf = fractals
    }else if (wP < .68) {
      chEf = aura
    }else if (wP < .86) {
      chEf = singularity
    }else if (wP < .96) {
      chEf = etched
    }else{
      chEf = flagg
    }
    return chEf;
}

function chTexture(grid) {
  const texP = map(decPairs[4],0,255,0,1);
    if (texP < .4) {
      chalk(.001, pal.ac_light)
    }else if (texP < .75) {
      bristle(.1, pal.light, grid)
    } else{
      hatched(pal.light)
    }
}

function chexpTy() {
  const exTyP = map(decPairs[5],0,255,0,1);
    if (exTyP < .13) {
      expTy = 'ripple'
    }else if (exTyP < .26){
      expTy = 'filament'
    }else if (exTyP < .37){
      expTy = 'catalyst'
    }else if (exTyP < .48){
      expTy = 'emission'
    }else if (exTyP < .58){
      expTy = 'diffused'
    }else if (exTyP < .68){
      expTy = 'quantum'
    }else if (exTyP < .78){
      expTy = 'aether'
    }else if (exTyP < .86){
      expTy = 'spirograph'
    }else if (exTyP < .94){
      expTy = 'sonar'
    }else{
      expTy = 'concentric'
    }
    return expTy

    
}

function chScale() {
  const gSP = map(decPairs[6],0,255,0,1);
    if (gSP < .3) {
      gridScale = 'nano'
    }else if (gSP < .85) {
      gridScale = 'standard'
    }else{
      gridScale = 'kilo'
    }
    return gridScale;
}

function chCrescent() {
  const cresPercent = map(decPairs[7],0,255,0,1);
    if (cresPercent < .99) {
      cres = 'no'
    }else{
      cres = 'yes'
    }
    return cres;
}

function chElement() {
  const elP = map(decPairs[8],0,255,0,1);
  if (elP < .3) {
    chEl = mOps.silver
  }else if (elP < .57){
    chEl = mOps.whitegold
  }else if (elP < .8){
    chEl = mOps.gold
  }else if (elP < .95){
    chEl = mOps.rosegold
  }else if (elP < .99){
    chEl = mOps.platinum
  }else{
    chEl = mOps.palladium
  }
  return chEl;
}

function chElement2() {
  const el2P = map(decPairs[9],0,255,0,1);
  if (el2P < .3) {
    chEl2 = mOps.silver
  }else if (el2P < .57){
    chEl2 = mOps.whitegold
  }else if (el2P < .8){
    chEl2 = mOps.gold
  }else if (el2P < .95){
    chEl2 = mOps.rosegold
  }else if (el2P < .99){
    chEl2 = mOps.platinum
  }else{
    chEl2 = mOps.palladium
  }
  return chEl2;
}

// STATIC

function stripe(r,g,b,left,right, top, bottom, weight) {
  for (let i = 0; i < 50; i++) {
    let y = map(i, 0, 50, top, bottom);
    let x1 = left
    let x2 = right
    tS_original_flag(x1, y, x2, y, weight, r, g, b, 50) 
  }
}

function stripe_vert(r,g,b,left,right, top, bottom, weight) {
  for (let i = 0; i < 50; i++) {
    let x = map(i, 0, 50, left, right);
    let y1 = top
    let y2 = bottom
    tS_original_flag(x, y1, x, y2, weight, r, g, b, 12) 
  }
}

function flagg() {
  push()
  for (let i = 0; i < 200; i++) {
    let x = map(i, 0, 200, -w(.5), 0);
    let y1 = -h(.5)
    let y2 = -h(.05)
    tS_original_flag(x, y1, x, y2, w(.1), pal.ac_dark[0], pal.ac_dark[1], pal.ac_dark[2], 25) 
  }

  for (let i = 0; i < 200; i++) {
    let y = map(i, 0, 200, -h(.5), -h(.05));
    let x1 = -w(.5)
    let x2 = 0
    tS_original_flag(x1, y, x2, y, w(.1), pal.ac_dark[0], pal.ac_dark[1], pal.ac_dark[2], 45) 
  }


  flagDrips(20, -w(.5), 0, -h(.5), pal.ac_dark[0], pal.ac_dark[1], pal.ac_dark[2]) // blue
  flagDrips(10, -w(.5), 0, -h(.5), pal.dark[0], pal.dark[1], pal.dark[2]) 


  for (let i = 0; i < 13; i++) {
    let col1 = pal.dark
    let col2 = pal.ac_dark
    if (i % 2) {
      col1 = pal.light
      col2 = pal.ac_light
    }
    let top = map(i,0,13,-h(.5),h(.47))
    let bottom = top + h(.1)
    let left = -w(.005);
    let numDrips = rnd(7,14)
    if (i >= 6) {left = -w(.5); numDrips = rnd(14,28)}

    stripe(col1[0], col1[1], col1[2], left, w(.5), top, bottom, w(.12))
    stripe(col2[0], col2[1], col2[2], left, w(.5), top, bottom, w(.12))
    flagDrips(numDrips, left, w(.5), top, col1[0], col1[1], col1[2])
    flagDrips(numDrips/2, left, w(.5), top, col2[0], col2[1], col2[2])
    flagDrips(numDrips/3, left, w(.5), top+h(.08), col1[0], col1[1], col1[2])

  }

  pop()
}

function etched() {
  push()
  if (frameCount < 2) {
    stripe(pal.light[0], pal.light[1], pal.light[2],-w(.27),w(.27), -h(.38), h(.38), w(.32))
    stripe(pal.light[0], pal.light[1], pal.light[2],-w(.38),w(.38), -h(.27), h(.27), w(.32))
    stripe(pal.ac_dark[0], pal.ac_dark[1], pal.ac_dark[2],-w(.27),w(.27), -h(.38), h(.38), w(.32))
    stripe(pal.ac_dark[0], pal.ac_dark[1], pal.ac_dark[2],-w(.38),w(.38), -h(.27), h(.27), w(.32))
    
    stripe_vert(pal.dark[0], pal.dark[1], pal.dark[2],-w(.27),w(.27), -h(.38), h(.38), w(.32))
    stripe_vert(pal.dark[0], pal.dark[1], pal.dark[2],-w(.38),w(.38), -h(.27), h(.27), w(.32))
    stripe_vert(pal.ac_light[0], pal.ac_light[1], pal.ac_light[2],-w(.27),w(.27), -h(.38), h(.38), w(.32))
    stripe_vert(pal.ac_light[0], pal.ac_light[1], pal.ac_light[2],-w(.38),w(.38), -h(.27), h(.27), w(.32))
  }
  pop()
}

// BG1 FUNCTIONS

function setFractals() {
  for(var i = 0; i < slices*2 ; i++){
    randomWeights[i] = rnd(700, 1000);
  }
}

function fractals() {
  push()
  let cCoeff = map(sin(frameCount / 120),-1,1,.1,.85)
  if (mouseIsPressed) {
    cCoeff = map(mouseY,-h(.5),h(.5),0,1)
  }
  bg1.background(pal.dark[0]*cCoeff, pal.dark[1]*cCoeff, pal.dark[2]*cCoeff, 38)
  bg1.noStroke()
  bg1.rotate(rds(1));
  for (let blobNum = 0; blobNum < 6; blobNum++){
    size_inc = bg1_w(.003)
    blobSize = map(blobNum,0,6,bg1_w(.45),bg1_w(.015))
    let fadeIn = 1
    if (frameCount < 180) {
      fadeIn = map(frameCount,0,180,0,1)
    }
    bg1.fill(map(blobNum,0,5,pal.ac_dark[0],pal.ac_light[0]*1.1),map(blobNum,0,5,pal.ac_dark[1],pal.ac_light[1]*1.1),map(blobNum,0,5,pal.ac_dark[2],pal.ac_light[2]*1.1),map(blobNum,0,5,2,40)*fadeIn)
    bg1.beginShape();
    for(var i = 0, j = 0; i < TWO_PI; i += TWO_PI/slices, j++){
      let x = sin(i) * blobSize + map(cos(millis()/2/randomWeights[j]), -1, 1, -bg1_w(.1), bg1_w(.1))
      let y = cos(i) * blobSize + map(sin(millis()/2/randomWeights[j+ slices]), -1, 1, -bg1_w(.1), bg1_w(.1))
      bg1.curveVertex(x,y)
    }
    bg1.endShape(CLOSE);
    blobSize += size_inc
  }
  pop()
}

function shards() {
  push()
  let cCoeff = map(sin(frameCount / 120),-1,1,.1,.85)
  if (mouseIsPressed) {
    cCoeff = map(mouseY,-h(.5),h(.5),0,1)
  }
  bg1.background(pal.dark[0]*cCoeff, pal.dark[1]*cCoeff, pal.dark[2]*cCoeff, 38)
  bg1.noStroke()
  for (let blobNum = 0; blobNum < 5; blobNum++){
    size_inc = bg1_w(.003)
    blobSize = map(blobNum,0,5,bg1_w(1),bg1_w(.035))
    if (blobSize > bg1_w(1)){
      blobSize = bg1_w(.025)
    }
    let fadeIn = 1
    if (frameCount < 200) {
      fadeIn = map(frameCount,0,200,0,1)
    }
    bg1.fill(map(blobNum,0,5,pal.ac_dark[0],pal.ac_light[0]*1.1),map(blobNum,0,5,pal.ac_dark[1],pal.ac_light[1]*1.1),map(blobNum,0,5,pal.ac_dark[2],pal.ac_light[2]*1.1),map(blobNum,0,5,2,40)*fadeIn)
    bg1.beginShape();
    for(var i = 0, j = 0; i < TWO_PI; i += TWO_PI/slices, j++){
      let x = sin(i) * blobSize + map(cos(millis()/2/randomWeights[j]), -1, 1, -bg1_w(.1), bg1_w(.1))
      let y = cos(i) * blobSize + map(sin(millis()/2/randomWeights[j+ slices]), -1, 1, -bg1_w(.1), bg1_w(.1)*8) - bg1_h(.35)
      bg1.curveVertex(x,y)
    }
    bg1.endShape(CLOSE);
    blobSize += size_inc
  }
  pop()
}

function blrEll(x,y,size,r,g,b,a) {
  for (let i = 0; i < 4; i++){ // reduced to be lighter
    fill(r,g,b,a*i*.1)
    noStroke()
    ellipse(x,y,1.6*size - (size/3)*i)
  }
}

function blrEll_Sp(x,y,size,r,g,b,a) {
  for (let i = 0; i < 5; i++){//change to i < 5
    let coeff = map(dist(x,y,0,0),0,bg1_w(.65),1,0) // new, more effective light to dark transition
    bg1.fill(r*coeff,g*coeff,b*coeff,a*(i)) // change to a*i ----> then also lower size and opacity in assembly function to increase layer transparency
    bg1.ellipse(x,y,size - (size/6)*i)
  }
}

function blrEll_bg1(x,y,size,r,g,b,a) {
  for (let i = 0; i < 4; i++){ // reduced to be lighter
    bg1.fill(r,g,b,a*i*.1)
    bg1.noStroke()
    bg1.ellipse(x,y,1.6*size - (size/3)*i)
  }
}

function fogEllipse(x,y,size,r,g,b,a) {
  for (let i = 0; i < 4; i++){ // reduced to be lighter 
    fill(r,g,b,a*i*.1)
    noStroke()
    ellipse(x,y,1.6*size - (size/3)*i)
  }
}

function drawCirc_Vert_SOLIDS(radius, t_offset, r, g, b, a, grid) {
  push()
  bg1.strokeWeight(3)
  bg1.fill(255)
  bg1.noStroke()

  let t = frameCount / 60
  let distort = map(sin(t),-1,1,.8,1.2)
  let speed_coeff = map(radius,0,bg1_w(1.3),2,1)
  let rad_mult = map(frameCount,0,500,1,1.8)

  let x = radius * rad_mult * 1.25 * cos(speed_coeff*t+t_offset) + map(sin(t),-1,1,-bg1_w(.03),bg1_w(.03))
  let y = radius * rad_mult * 1.25 * sin(speed_coeff*t+t_offset) + map(sin(t),-1,1,-bg1_w(.005),bg1_w(.005)) 
  if (grid == 'halo' || grid == 'cradle') {
    x = radius * rad_mult * 2.45 * cos(speed_coeff*t+t_offset) + map(sin(t),-1,1,-bg1_w(.03),bg1_w(.03)) * distort
    y = ((radius + bg1_w(.02)) * rad_mult * 2.8 * sin(speed_coeff*t+t_offset) + map(sin(t),-1,1,-bg1_w(.005),bg1_w(.005))) * 1.5 + bg1_h(.2) * distort
  }
  if (grid == 'silo') {
    y = (radius * rad_mult * sin(speed_coeff*t+t_offset) + map(sin(t),-1,1,-bg1_w(.005),bg1_w(.005))) * 3.5 //+ bg1_h(.35)
  }
  let size = map(sin(t+rds(180)),-1,1,bg1_w(.01),bg1_w(.04)) + map(dist(x,y,width/2,height/2),0,bg1_w(1),0,bg1_w(.03))

  let coeff = map(radius,0,w(.25),1.8,.1)
  let alpha_coeff = map(dist(x,y,0,0),0,bg1_w(.65),1,.2)
  blrEll_Sp(x,y,size, r*coeff, g*coeff, b*coeff, a*alpha_coeff)
  pop()
}

function drawSpSolids(r, g, b, a, a_inc, grid) {
  push()
  let num_circs = 12
  let begin = 0
  if (frameCount > begin) {
    for (let i = 0; i < num_circs; i++) {
      //let off = rnd(30,80)
      let rad = bg1_w(.005)+i*bg1_w(.03)
      if (grid === 'halo' || grid === 'cradle') {
        rad = bg1_w(.015)+i*bg1_w(.025)
      }
      drawCirc_Vert_SOLIDS(rad, 60*i, r, g, b, a + a_inc*i, grid)
    }
  }
  pop()
}

function singularity(grid) {
  if (frameCount < 600) {
    drawSpSolids(pal.ac_light[0], pal.ac_light[1], pal.ac_light[2], .00000001, .33, grid) // use a = 3 and a_inc = .5 for earlier version
  }
}

function setAura() {
  numP = 100;
  for (let i = 0; i < numP; i++){
    let radius = map(i,0,numP,bg1_w(.003),bg1_w(.65))
    let colVals = [pal.ac_light[0], pal.ac_light[1], pal.ac_light[2]]
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

function aura() {
  push()
  // let cCoeff = map(sin(frameCount / 120),-1,1,.1,.85)
  // if (mouseIsPressed) {
  //   cCoeff = map(mouseY,-h(.5),h(.5),0,1)
  // }
  let cCoeff = .1
  bg1.background(pal.dark[0]*cCoeff, pal.dark[1]*cCoeff, pal.dark[2]*cCoeff, 15)
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
    this.alpha = _alpha; // inverse values when using blrEll
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
    let c = map(dist(this.x,this.y,0,0),0,bg1_w(.65),.8,.1)
    let mouseC = map(dist(this.x,this.y,mouseX-width/2,mouseY-height/2),0,bg1_w(.25),map(c,.8,.1,3,10),0)
    let adjSize = map(dist(this.x,this.y,0,0),0,bg1_w(.65),.5,2.5) * this.size
    blrEll_bg1(this.x,this.y,adjSize,this.col[0]*c+mouseC,this.col[1]*c+mouseC,this.col[2]*c+mouseC,this.alpha) 
    push()
    bg1.rotate(-rds(.003)) // new for 7-12.js
    blrEll_bg1(this.x * 1.3,this.y * 1.3,adjSize,this.col[0]*c+mouseC,this.col[1]*c+mouseC,this.col[2]*c+mouseC,this.alpha) 
    pop()
  }
}

function flagDrips(num,left,right,y,r,g,b) {
  numDrips = num;
  for (let i = 0; i < numDrips; i++) {
    let xPos = rnd(left,right);
    let yPos = y;
    let start = rnd(120);
    let alpha = 18;
    let rndArray = []
    for (let i = 0; i < 500; i++) {
      let shift = rnd(-w(.001),w(.001))
      rndArray.push(shift)
    }
    drips.push(new Drip(left, right, xPos, yPos, rnd(w(.02)), r, g, b, alpha, start, rndArray));
  }
}

function drawDrips() {
  for (let i = 0; i < drips.length; i++) {
    drips[i].move();
    drips[i].show();
		if (drips[i].y > height) {
			drips.splice(i, 1);
		}
  }
}

class Drip {
  constructor(left, right, x, y, size, r, g, b, alpha, start, rndArray) {
    this.left = left;
    this.right = right;
    this.x = x;
    this.y = y;
    this.yOrig = y;
    this.size = size;
		this.final = size/3;
    this.alpha = alpha;
    this.color = [r, g, b, alpha];
    this.start = start;
    this.level = this.y + rnd(h(.12),h(.24));
    this.rndArray = rndArray;
  }
  move(){
    if (frameCount > this.start) {
      this.y+=h(.0005);
      let t = 0;
      t += 5
      this.x += this.rndArray[frameCount]
      //this.x += map(sin(frameCount/this.divi + rds(map(sin(this.angle),-1,1,-3,3))*this.aMult),-1,1,-w(.001),w(.001)) //+ rnd(-w(.002),w(.002))
      this.size*=.995
      this.alpha-=.1
      if(this.size>this.final) this.size*=.78;
    }
  }
  show(){
    if (frameCount > this.start) {
      flag.noStroke();
      flag.fill(this.color);
      flag.ellipse(this.x, this.y, this.size, this.size);
    }
  }
}

function textureOverFlag2() {
  //push()
  let darkness = 375
  if (frameCount < 30) {
    for (let i = 0; i < darkness; i++) {
      let angle = rnd(TWO_PI)
      let radius = rnd(w(.63))
      let x = radius * sin(angle) 
      let y = radius * cos(angle) * 1.35
      flag.noStroke()
      let whiteAlpha = 2
      if (dist(x,y,0,0) > w(.15)) {
        whiteAlpha = map(dist(x,y,0,0),w(.15),w(.75),2,0)
      }
      flag.fill(255,255,255,whiteAlpha)
      flag.ellipse(x,y,map(dist(x,y,0,0),0,w(.65),w(.06),0))
      flag.fill(0,0,0,map(dist(x,y,0,0),w(.15),w(.75),0,30))
      flag.ellipse(x,y,map(dist(x,y,0,0),0,w(.65),0,w(.06)))
      flag.fill(pal.light[0], pal.light[1], pal.light[2],map(dist(x,y,0,0),w(.25),w(.75),0,8))
      flag.ellipse(x,y,map(dist(x,y,0,0),0,w(.65),0,w(.06)))
    }
  }
  //pop()
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

function tS_original_flag(x1, y1, x2, y2, weight, r, g, b, alpha) {
  push()
  const relWeight = flag.map(weight, 0, width, 1, 40);
  flag.stroke(r, g, b, alpha)
  flag.strokeWeight(w(0.001));
  for (let i = 0; i < relWeight; i++){
    let theta = rnd(TWO_PI);
    let nx1 = x1 + 0.15*rnd(weight/2)*flag.cos(theta);
    let ny1 = y1 + 0.5*rnd(weight/2)*flag.sin(theta);
    let nx2 = x2 + 0.15*rnd(weight/2)*flag.cos(theta);
    let ny2 = y2 + 0.5*rnd(weight/2)*flag.sin(theta);
    flag.line(nx1, ny1, nx2, ny2)
  }
  pop()
  flag.noLoop();
}

function texturedCircle(i_dist,line_val,size,inc,diff,max_distort,col,grid) {
  push()
  let zoff = 0
  let t = frameCount * 3 + rnd(TWO_PI)
  let d = 1
  graphics.angleMode(graphics.DEGREES)
  if (frameCount < 90) {
    let xoff = map(cos(t+diff), -1, 1, 0, 1)
    let yoff = map(sin(t-diff), -1, 1, 0, 1)
    let r = map(noise(xoff, yoff), 0, 1, size, size-rnd(w(.01),max_distort*noise(xoff, yoff, zoff)))
    let x1 = graphics.width/2 + i_dist + d*r * cos(t)
    let y1 = graphics.height/2 + i_dist + d*r * sin(t)
    let x2 = graphics.width/2 + i_dist + d*r * cos(t + line_val*2)
    let y2 = graphics.height/2 + i_dist + d*r * sin(t + line_val*2)
    let coeff = map(dist(x2-x1,y2-y1,0,0),0,w(.25),0,1)
    let alpha_coeff = map(dist(x2-x1,y2-y1,0,0),w(.01),w(.02),0,1)
    if (grid == 'halo' || grid == 'cradle') {
      y1 = (graphics.height/2 + i_dist + d*r * sin(t)) * 1.6
      y2 = (graphics.height/2 + i_dist + d*r * sin(t + line_val*2)) * 1.6
    }
    if (grid == 'silo') {
      coeff = map(dist(x2-x1,y2-y1,0,0),0,w(.25),0,1)
      alpha_coeff = map(dist(x2-x1,y2-y1,0,0),w(.01),w(.02),.65,1.5)
      y1 = (graphics.height/2 + i_dist + d*r * sin(t)) * 3.2 - h(1)
      y2 = (graphics.height/2 + i_dist + d*r * sin(t + line_val*2)) * 3.2 - h(1)
    }
    let weight_coeff = map(dist(x2-x1,y2-y1,0,0),w(.01),w(.65),.1,1.5)
    tS_original(x1, y1, x2, y2, w(.15)*weight_coeff, col[0]*coeff, col[1]*coeff, col[2]*coeff, rnd(4.5)*alpha_coeff)
    zoff += inc/5;
  }
  pop()
}

function bristle(line_val, col, grid) {
  graphics.noFill()
  let num_circs = 3200
  for (let i = 0; i < num_circs; i++) {
    let i_d = rnd(-w(.05), w(.05))
    translate(rnd(w(.01)),rnd(h(.01)))
    let size = map(i,0,num_circs,w(.023),w(.85))
    let inc = .003
    rotate(i*30)
    texturedCircle(i_d,line_val,size,inc,0,w(.03),col,grid)
    texturedCircle(i_d,line_val,size,inc*15,30,w(.03),col,grid)
    texturedCircle(i_d,line_val,size,inc*25,60,w(.03),col,grid)
  }
}

function bzL(i_dist,line_val,size,inc,diff,max_distort) {
  push()
  let zoff = 0
  let d = .9
  graphics.angleMode(graphics.DEGREES)
  for (let i = 0; i < 14; i++) {
    graphics.rotate(rds(i*10))
    let t = 5*i*rnd(TWO_PI)
    let xoff = map(cos(t+diff), -1, 1, 0, 1)
    let yoff = map(sin(t-diff), -1, 1, 0, 1)
    let r = map(noise(xoff, yoff), 0, 1, size, size-rnd(w(.01),max_distort*noise(xoff, yoff, zoff)))
    let x1 = graphics.width/2 + i_dist + r * cos(t)
    let y1 = graphics.height/3 + i_dist + d*r * sin(t)
    let x2 = graphics.width/2 + i_dist + r * cos(t + line_val)
    let y2 = graphics.height + i_dist + d*r * sin(t + line_val*1.5)
    let xc1 = graphics.width/2 + (x1+x2)/4 + rnd(-w(.05),w(.05))
    let yc1 = (y1+y2)/4 + rnd(-w(.05),w(.05))
    let xc2 = graphics.width/2 + (x1+x2)/2 + rnd(-w(.05),w(.05))
    let yc2 = (y1+y2)/2 + rnd(-w(.05),w(.05))
    let dis = rnd(.94,1.06)
    let dis2 = rnd(.88,1.12)
    graphics.bezier(x1,y1,xc1,yc1,xc2,yc2,x2,y2)
    graphics.bezier(x1*dis,y1*dis,xc1,yc1,xc2,yc2,x2*dis,y2*dis)
    graphics.bezier(x1*dis2,y1*dis2,xc1,yc1,xc2,yc2,x2*dis2,y2*dis2)
    zoff += inc/5;
  }
  pop()
}

function chalk(line_val, col) {
  graphics.noFill()
  let num_circs = 60
  for (let i = 0; i < num_circs; i++) {
    let i_d = rnd(-w(.003), w(.003))*i
    translate(rnd(w(.01)),rnd(h(.01)))
    let size = map(i,0,num_circs,w(.01),w(.75))
    let inc = .003
    let c = map(size,0,w(1),0,2)
    let alpha_coeff = map(size,0,w(.15),.1,.6)
    graphics.stroke(col[0] * c, col[1] * c, col[2] * c, 30 * alpha_coeff)
    graphics.strokeWeight(rnd(w(.00015)))
    bzL(i_d,line_val,size,inc,0,w(.06))
    bzL(i_d,line_val,size,inc*15,30,w(.06))
    bzL(i_d,line_val,size,inc*25,60,w(.06))
    graphics.stroke(col[0] * c, col[1] * c, col[2] * c, 20 * alpha_coeff)
    bzL(i_d,line_val,size,inc*15,90,w(.06))
    bzL(i_d,line_val,size,inc*25,120,w(.06))
    graphics.stroke(col[0] * c, col[1] * c, col[2] * c, 10 * alpha_coeff)
    bzL(i_d,line_val,size,inc*15,270,w(.06))
    bzL(i_d,line_val,size,inc*25,300,w(.06))
  }
}

function hatched(col) {
  graphics.noFill()
  let num_rows = 12;
  let lineWeight = rnd(w(.025),w(.25))
  for (let i = 0; i < num_rows; i++) {
    let yTop = map(i,0,num_rows,0,graphics.height);
    let yBot = yTop + graphics.height/12;
    let num_lines = 240;
    for (let j = 0; j < num_lines; j++) {
      let xTop = rnd(width);
      let xBot = xTop + rnd(-w(.05),w(.05))
      tS_original(xTop, yTop, xBot, yBot, lineWeight, col[0], col[1], col[2], rnd(10))
    }
  }
}

function setWater() {
  push()
  bgNumRows = 8;
  scl = width/bgNumRows;
  for (let y = 0; y < bgNumRows * 2; y++) {
    for (let x = 0; x < bgNumRows * 2; x++) {
      let xPos = x * scl - width/2 + scl/2;
      let yPos = y * scl - height/2 + scl/2;
      let col = [pal.light[0], pal.light[1], pal.light[2]]; // 25, 91, 214 // inverse alpha
      p = new ParticleWater(xPos,yPos,w(.03),col,55);
      particlesWater.push(p);
    }
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
    this.alpha = _alpha; // inverse values when using blrEll
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
    blrEll(this.x,this.y,adjSize,this.col[0]*c+mouseC,this.col[1]*c+mouseC,this.col[2]*c+mouseC,this.alpha) 
  }
}

function shimmerPixels() {
  let rows = 30;
  let cols = rows;
  let size = width/rows;
  for (let i = 0; i < rows; i++){
    let yPos = size*i
    for ( let j = 0; j < cols; j++){
      let xPos = size*j
      noStroke()
      let coeff = map(dist(xPos,yPos,width/2,height/2),0,w(.5),255,0)
      fill(coeff,map(sin(frameCount/60),-1,1,15,65))
      rect(xPos-width/2,yPos-height/2,size,size)
    }
  }
}


////////////////////////       MOVING TEXTURE       ///////////////////////////////

function irC(radius,noiseVal,grid) {
  for (let a = 0; a <= TWO_PI; a += .22) {
    let wavingAngle = frameCount / 60 + a
    let wavingX = map(sin(wavingAngle),-1,1,-w(.01),w(.01))
    let wavingY = map(cos(wavingAngle),-1,1,-w(.01),w(.01))
    let xoff = map(cos(a), -1, 1, noiseVal/3, noiseVal);
    let yoff = map(sin(a), -1, 1, noiseVal/3, noiseVal);
    let diff = map(noise(xoff, yoff, zoff), 0, 1, .65, 1.35);
    let x = radius * diff * cos(a);
    let y = radius * diff * sin(a);
    let x2 = radius * diff * cos(a+5) + wavingX;
    let y2 = radius * diff * sin(a+5) + wavingY;
    let x3 = radius * diff * cos(a+3) + wavingX*2;
    let y3 = radius * diff * sin(a+3) + wavingY*2;
    if (grid === 'halo' || grid === 'cradle') {
      y = (radius * diff * sin(a)) * 1.5;
      y2 = (radius * diff * sin(a+5) + wavingY) * 1.5;
      y3 = (radius * diff * sin(a+3) + wavingY*2) * 1.5;
    }
    if (grid === 'silo') {
      y = (radius * diff * sin(a)) * 2.5;
      y2 = (radius * diff * sin(a+5) + wavingY) * 2.5;
      y3 = (radius * diff * sin(a+3) + wavingY*2) * 2.5;
    }
    line(x,y,x2,y2)
    line(x2,y2,x3,y3)
  }
  zoff += 0.0001;
}

function irC_2(radius,noiseVal) {
  for (let a = 0; a <= TWO_PI; a += .22) {
    let wavingAngle = frameCount / 60 + a
    let wavingX = map(sin(wavingAngle),-1,1,-w(.01),w(.01))
    let wavingY = map(cos(wavingAngle),-1,1,-w(.01),w(.01))
    let xoff = map(cos(a), -1, 1, noiseVal/3, noiseVal);
    let yoff = map(sin(a), -1, 1, noiseVal/3, noiseVal);
    let diff = map(noise(xoff, yoff, zoff), 0, 1, .65, 1.35);
    let x = radius * diff * cos(a);
    let y = radius * diff * sin(a);
    let x2 = radius * diff * cos(a+rds(15)) + wavingX;
    let y2 = radius * diff * sin(a+rds(15)) + wavingY;
    let x3 = radius * diff * cos(a+rds(30)) + wavingX*2;
    let y3 = radius * diff * sin(a+rds(30)) + wavingY*2;
    let x4 = radius * diff * cos(a+rds(45)) + wavingX*2;
    let y4 = radius * diff * sin(a+rds(45)) + wavingY*2;
    line(x,y,x2,y2)
    line(x2,y2,x3,y3)
    line(x3,y3,x4,y4)
  }
  
  zoff += 0.0001;
}

function irEx(radius,noiseVal,grid) {
  rings.beginShape();
  for (let a = 0; a <= TWO_PI; a += rds(6)) {
    let xoff = map(cos(a), -1, 1, noiseVal/3, noiseVal);
    let yoff = map(sin(a), -1, 1, noiseVal/3, noiseVal);
    let diff = map(noise(xoff, yoff, zoff), 0, 1, .65, 1.35);
    let x = radius * diff * cos(a);
    let y = radius * diff * sin(a);
    if (grid === 'halo' || grid === 'cradle') {
      y = (radius * diff * sin(a) * 1.5);
    }
    if (grid === 'silo') {
      y = (radius * diff * sin(a) * 2.5);
    }
    rings.vertex(x,y)
  }
  rings.endShape(CLOSE);
  
  zoff += 0.0001;
}

function spExpand(radius,noiseVal,numC) {
  let angle = frameCount / 60
  for (let i = 0; i < numC + 1; i++) {
    let newAngle = angle + rds(75)*i
    for (let i = 0; i < 12; i++) {
      let xoff = map(cos(newAngle), -1, 1, noiseVal/3, noiseVal);
      let yoff = map(sin(newAngle), -1, 1, noiseVal/3, noiseVal);
      let diff = map(noise(xoff, yoff, zoff), 0, 1, .9, 1.1);
      let x = radius * cos(newAngle-i*.1) * diff - i*(radius/20)
      let y = radius * sin(newAngle-i*.1) * diff - i*(radius/20)
      let size  = w(.03)-i*(w(.001))
      let alphaMult = map(radius,0,w(.1),0,1)
      if (radius > w(.1)) {alphaMult = map(radius,w(.1),w(.65),1,0)}
      blrEll(x,y,size,pal.light[0],pal.light[1],pal.light[2],(85-i*2)*alphaMult)
    }
  }
}

function spExpandSmooth(radius,noiseVal,numC) {
  let angle = frameCount / 60
  for (let i = 0; i < numC + 2; i++) {
    let newAngle = angle + rds(60)*i
    for (let i = 0; i < 10; i++) {
      let xoff = map(cos(newAngle), -1, 1, noiseVal/3, noiseVal)*i;
      let yoff = map(sin(newAngle), -1, 1, noiseVal/3, noiseVal)*i;
      let diff = map(noise(xoff, yoff, zoff), 0, 1, .9, 1.1);
      let x = (radius * cos(newAngle-i*.1) * diff) * map(i,0,10,.1,1)
      let y = (radius * sin(newAngle-i*.1) * diff) * map(i,0,10,.1,1)
      let size  = (w(.03)-i*(w(.001))) * map(radius,0,w(.7),1,6)
      blrEll(x,y,size,pal.light[0],pal.light[1],pal.light[2],map(i,0,10,100,5)*map(radius,0,w(.65),1,.2))
    }
  }
}

function irExShimmer(radius,noiseVal,grid,alphaMult) {
  for (let a = 0; a <= TWO_PI - rds(3); a += rds(6)) {
    let xoff = map(cos(a), -1, 1, noiseVal/3, noiseVal);
    let yoff = map(sin(a), -1, 1, noiseVal/3, noiseVal);
    let diff = map(noise(xoff, yoff, zoff), 0, 1, .65, 1.35);
    let x = radius * diff * cos(a);
    let y = radius * diff * sin(a);
    if (grid === 'halo' || grid === 'cradle') {
      y = (radius * diff * sin(a)) * 1.5;
    }
    if (grid === 'silo') {
      diff = map(noise(xoff, yoff, zoff), 0, 1, .3, 3.35);
      x = radius * diff * cos(a);
      y = (radius * diff * sin(a)) * 2.5;
    }
    let alphaBase = map(sin(a),-1,1,0,45)
    for (let i = 0; i < 4; i ++) {
      let alphaVal = sin(map(i,0,4,0,TWO_PI),-1,1,5,45) + alphaBase
      sizeMult = 1 + .6*i
      shimmerSize = map(sin(frameCount / 15 + a*i),-1,1,0,w(.01))
      rings.noStroke()
      rings.fill(pal.ac_light[0],pal.ac_light[1],pal.ac_light[2],alphaVal*alphaMult)
      rings.ellipse(x*sizeMult, y*sizeMult, shimmerSize)
    }
  }
  zoff += 0.0001;
}

function setIrregCircles(expTy, gridType) {
  numCircs = 4;
  for (let i = 0; i < numCircs; i++) {
    radius = map(i,0,numCircs,w(.03),w(.65))
    noiseVal = rnd(1,3)
    circ = new IrregCircle(radius,noiseVal,expTy,numCircs,gridType);
    irregCircs.push(circ);
  }
}

function drawIrregCircles() {
  for (let i = 0; i < irregCircs.length; i++){
    irregCircs[i].run();
  }
}

function linC(r,nV,grid) {
  irC(r,nV,grid)
  irC(r*1.33,nV*2,grid)
  irC(r*1.66,nV*3,grid)
}

function linC2(r,nV) {
  irC_2(r,nV)
  irC_2(r*1.33,nV*2)
  irC_2(r*1.66,nV*3)
}

class IrregCircle{
  constructor(_radius,_noiseVal,_expTy,_numC,_grid) {
    this.radius = _radius;
    this.noiseVal = _noiseVal;
    this.expTy = _expTy;
    this.numC = _numC;
    this.grid = _grid;
  }

  run() {
    this.update()
    this.checkEdges()
    this.show()
  }

  update() {
    if (this.expTy == 'quantum' || this.expTy == 'concentric' || this.expTy == 'catalyst') {
      this.radius += r_w(.0015)
    }else{
      this.radius += w(.0015)
    }
  }

  checkEdges() {
    if (this.expTy == 'quantum' || this.expTy == 'concentric' || this.expTy == 'catalyst') {
      if (this.radius > r_w(.21)) {
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
    if (this.expTy === 'aether'){
      stroke(200,2)
      strokeWeight(w(.003))
      linC(this.radius,this.noiseVal,this.grid)
    }
    if (this.expTy === 'filament'){
      let outCoeff = map(this.radius,0,w(.6),1,.3)
      stroke(pal.light[0]*outCoeff,pal.light[1]*outCoeff,pal.light[2]*outCoeff,map(this.radius,0,w(.6),25,12))
      strokeWeight(w(.0035))
      linC(this.radius,this.noiseVal,this.grid) 
    }
    if (this.expTy === 'spirograph'){
      let outwardColor = map(this.radius,0,w(.6),235,100)
      stroke(outwardColor,map(this.radius,0,w(.6),25,12))
      strokeWeight(w(.0035))
      linC(this.radius,this.noiseVal,this.grid) 
    }
    if (this.expTy === 'sonar'){
      stroke(pal.light[0],pal.light[1],pal.light[2],7)
      strokeWeight(rnd(w(.0035))) // RND FOR FLICKER\
      linC(this.radius,this.noiseVal,this.grid)
    }
    if (this.expTy === 'quantum'){
      push()
      if (this.grid !== 'silo') {
        rings.rotate(rds(.1))
      }
      let alphaVal = 1
      if (this.radius > r_w(.15)) {
        alphaVal = map(this.radius, r_w(.15), r_w(.25), 1, 0)
      }
      rings.stroke(pal.light[0],pal.light[1],pal.light[2],25 * alphaVal)
      rings.strokeWeight(r_w(.002)) 
      irEx(this.radius,this.noiseVal,this.grid)
      irEx(this.radius*1.15,this.noiseVal*1.35,this.grid)
      irEx(this.radius*1.3,this.noiseVal*1.7,this.grid)
      pop()
    }
    if (this.expTy === 'concentric'){
      push()
      if (this.grid !== 'silo' && this.grid !== 'halo') {
        rings.rotate(rds(.1))
      }
      let alphaVal = 1
      if (this.radius > r_w(.1)) {
        alphaVal = map(this.radius, r_w(.1), r_w(.21), 1, 0)
      }
      let sW_Val = map(this.radius, 0, r_w(.65), .5, 2.5)
      rings.stroke(pal.light[0],pal.light[1],pal.light[2],85 * alphaVal)
      rings.strokeWeight(r_w(.005)*sW_Val) 
      rings.background(pal.dark[0], pal.dark[1], pal.dark[2], 5)
      let nV = this.noiseVal * .75
      irEx(this.radius,nV,this.grid)
      irEx(this.radius*1.3,nV*1.35,this.grid)
      rings.stroke(pal.light[0],pal.light[1],pal.light[2],25 * alphaVal)
      rings.strokeWeight(r_w(.015)*sW_Val) 
      irEx(this.radius,nV,this.grid)
      irEx(this.radius*1.27,nV*1.35,this.grid)
      pop()
    }
    if (this.expTy === 'catalyst'){
      push()
      if (this.grid !== 'silo' && this.grid !== 'halo') {
        rings.rotate(rds(.15))
      }
      let alphaVal = 1
      if (this.radius > r_w(.15)) {
        alphaVal = map(this.radius, r_w(.15), r_w(.21), 1, 0)
      }
      irExShimmer(this.radius,this.noiseVal,this.grid,alphaVal)
      pop()
    }
    if (this.expTy === 'emission'){
      push()
      rotate(frameCount / 240)
      spExpand(this.radius,this.noiseVal,this.numC)
      spExpand(this.radius*1.2,this.noiseVal*2,this.numC)
      pop()
    }
    if (this.expTy === 'diffused'){
      push()
      spExpandSmooth(this.radius,this.noiseVal,this.numC)
      pop()
    }
    if (this.expTy === 'ripple'){
      let outCoeff = map(this.radius,0,w(.6),1,.3)
      stroke(pal.light[0]*outCoeff,pal.light[1]*outCoeff,pal.light[2]*outCoeff,map(this.radius,0,w(.6),25,12))
      strokeWeight(w(.0035))
      linC2(this.radius,this.noiseVal)
    }
  }
}

function setFog() {
  numP_Top = 175;
  for (let i = 0; i < numP_Out; i++){
    let radius = map(i,0,numP,w(.01),w(.3))
    let colVals = [pal.dark[0], pal.dark[1], pal.dark[2]]
    p = new ParticleTop(radius,w(.05),colVals,w(.02),135);
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
    this.alpha = _alpha; // inverse values when using blrEll
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
    let c = map(dist(this.x,this.y,0,0),0,w(.35),.8,0)
    let adjSize = map(dist(this.x,this.y,0,0),0,w(.65),.5,2.5) * this.size
    fogEllipse(this.x,this.y,adjSize,pal.ac_light[0]*c,pal.ac_light[1]*c,pal.ac_light[2]*c,this.alpha*c) 
    fogEllipse(this.x2,this.y2,adjSize,pal.ac_light[0]*c,pal.ac_light[1]*c,pal.ac_light[2]*c,this.alpha*c) 
  }
}



////////////////////////      MOTHS      ///////////////////////////////

function gyre(gS) {
  let numCircs = 7;
  let numInnerCircs = 5;
  let maxR = w(.25)
  if (gS === 'standard') {
    numCircs = 7;
    numInnerCircs = 3;
    maxR = w(.33)
  }else if (gS === 'kilo') {
    numCircs = 9;
    numInnerCircs = 6;
    maxR = w(.41)
  }
  for (let i = 0; i < numCircs; i++) {
    let radius = map(i,0,numCircs,maxR,w(.005)) //+ map(i,0,numCircs,0,w(.04))
    let numPoints = 1.65*numCircs - floor(1.5*i)
    for (let j = 0; j < numPoints; j++) {
      let angle = map(j,0,numPoints,0,TWO_PI)
      let x = radius * cos(angle + rds(rnd(-6,6)))
      let y = radius * sin(angle + rds(rnd(-6,6)))
      let point = cV(x, y)
      gP.push(point)
    }
  }
  for (let i = 0; i < numInnerCircs; i++) {
    let radius = maxR*.5 + rnd(maxR*.2)
    let angle = map(i,0,numInnerCircs,0,TWO_PI-rds(30)) + rds(rnd(-5,5))
    let x = radius*cos(angle + rds(20))
    let y = radius*sin(angle + rds(20))
    let point = cV(x, y)
    if (i < floor(numInnerCircs/2)) {
      let radius2 = maxR*.15 + rnd(maxR*.1)
      let angle2 = map(i,0,numInnerCircs/2,0,TWO_PI-rds(30)) + rds(rnd(-15,15))
      let x2 = radius2*cos(angle2 + rds(35))
      let y2 = radius2*sin(angle2 + rds(35))
      let centerPoint = cV(x2, y2)
      gP_LG.push(centerPoint)
    }
    gP_LG.push(point)
  }
}

function cradle(gS) {
  if (gS == 'nano') {
    numArcs = 3
    numTopPoints = 15
    rMult = .87
  }
  if (gS == 'standard') {
    numArcs = 4
    numTopPoints = 12
    rMult = 1
  }
  if (gS == 'kilo') {
    numArcs = 4
    numTopPoints = 8
    rMult = 1.2
  }
  for (let i = 0; i < numArcs; i++) {
    let radius = (w(.27) + i * w(.03))*rMult*rnd(.95,1.05)
    let numPoints = numArcs*2 + i*2 // previously multiplied numArcs by three
    let anDi = 90/numPoints
    for (let j = 0; j < numPoints; j++) {
      let angle  = map(j,0,numPoints,PI+rds(6),TWO_PI+rds(12)) + (rds(rnd(-anDi,anDi)))
      let x = radius * cos(angle)
      let y = radius * sin(angle) * 2 + h(.47)
      let point = cV(x, y)
      gP.push(point)
    }
  }
  for (let k = 0; k < numTopPoints; k++) {
    let radius = w(.33)*rMult*rnd(.9,1.1)
    let anDi = 60/numTopPoints
    let angle = map(k,0,numTopPoints,PI + rds(5),TWO_PI + rds(15)) + (rds(rnd(-anDi,anDi)))
    let x = radius * cos(angle)
    let y = radius * sin(angle) * 2 + h(.47)
    let point = cV(x, y)
    gP_LG.push(point)
  }
}

function silo(gS) {
  push()
  if (gS == 'nano') {
    num_rows = 8
    num_cols = 4
    r_inc_1 = w(.023)
    num_rows2 = 12
    num_cols2 = 4
    r_inc_2 = w(.014)
  }
  if (gS == 'standard') {
    num_rows = 8
    num_cols = 3
    r_inc_1 = w(.025)
    num_rows2 = 12
    num_cols2 = 3
    r_inc_2 = w(.02)
  }
  if (gS == 'kilo') {
    num_rows = 8
    num_cols = 2
    r_inc_1 = w(.04)
    num_rows2 = 12
    num_cols2 = 4
    r_inc_2 = w(.025)
  }
  for (let i = 0; i < num_rows; i++) {
    let y = map(i,0,num_rows,-h(.5),h(.6)) + rnd(-h(.05),h(.05))
    for (let j = 0; j < num_cols; j++) {
      let x = (map(j,0,num_cols,0-num_cols/2*r_inc_1,num_cols/2*r_inc_1)+ r_inc_1/2) * map(num_cols,0,10,2.3,1)
      let point = cV(x + rnd(-w(.025),w(.025)),y + rnd(-h(.025),h(.025)))
      gP.push(point)
    }  
  }
  for (let i = 0; i < num_rows; i++) {
    let y = map(i,0,num_rows,-h(.5),h(.6)) + rnd(-h(.05),h(.05))
    for (let j = 0; j < num_cols2; j++) {
      let x = (map(j,0,num_cols2,0-num_cols2/2*r_inc_2,num_cols2/2*r_inc_2)+ r_inc_2/2) * map(num_cols2,0,10,2.3,1)
      let point = cV(x + rnd(-w(.025),w(.025)),y + rnd(-h(.025),h(.025)))
      gP_LG.push(point)
    }  
  }
  pop()
}

function halo(gS) {
  push()
  if (gS === 'nano') {
    numCircs = 9;
    minM = 4;
    maxM = 32;
  }
  if (gS === 'standard') {
    numCircs = 8;
    minM = 3;
    maxM = 24;
  }
  if (gS === 'kilo') {
    numCircs = 6;
    minM = 3;
    maxM = 20;
  }
  for (let i = 0; i < numCircs; i++) {
    let radius = map(i,0,numCircs,w(.06),w(.45))
    let numMoths = map(i,0,numCircs,3,20)
    let anDi = map(i,0,numCircs,4,9)
    for (let j = 0; j < numMoths; j++) {
      let angle = map(j,0,numMoths,PI - rds(8),TWO_PI + rds(8))
      let x = radius * cos(angle + rds(rnd(-anDi,anDi)))
      let y = radius * 2.2 * sin(angle + rds(rnd(-anDi,anDi))) + h(.55)
      let point = cV(x, y)
      gP.push(point)
    }
  }
}

function entropy(gS) {
  push()
  if (gS == 'nano') {
    num_rows = 9
    diff = w(.1)
  }
  if (gS == 'standard') {
    num_rows = 8
    diff = w(.12)
  }
  if (gS == 'kilo') {
    num_rows = 7
    diff = w(.14)
  }
  for (let i = 0; i < num_rows; i++) {
    let y = map(i,0,num_rows,-h(.5),h(.5)) + (width/(num_rows*2))
    let num_cols = num_rows
    for (let j = 0; j < num_cols; j++) {
      let x = map(j,0,num_cols,-w(.5),w(.5)) + (width/(num_rows*2))
      let point = cV(x + rnd(-diff,diff),y + rnd(-diff,diff))
      gP.push(point)
    }
  }
  pop()
}

function shoal(gS) {
  push()
  if (gS == 'nano') {
    num_rows = 11
    diff = w(.025)
  }
  if (gS == 'standard') {
    num_rows = 9
    diff = w(.035)
  }
  if (gS == 'kilo') {
    num_rows = 7
    diff = w(.05)
  }
  for (let i = 0; i < num_rows; i++) {
    let y = map(i,0,num_rows,-h(.5),h(.5)) + (width/(num_rows*2))
    let num_cols = num_rows
    for (let j = 0; j < num_cols; j++) {
      let x = map(j,0,num_cols,-w(.5),w(.5)) + (width/(num_rows*2))
      let point = cV(x + rnd(-diff,diff),y + rnd(-diff,diff))
      gP.push(point)
    }
  }
  pop()
}

function chaos(gS) {
  push()
  let sclAdjust;
  if (gS == 'nano') {
    numCircs = 5
    sclAdjust = .7
    maxR = w(.15)
  }
  if (gS == 'standard') {
    numCircs = 5
    sclAdjust = 1
    maxR = w(.19)
  }
  if (gS == 'kilo') {
    numCircs = 5
    sclAdjust = 1.2
    maxR = w(.2)
  }
  for (let i = 0; i < numCircs; i++) {
    let radius  = map(i,0,numCircs,w(.001),maxR*sclAdjust) + i*w(.006*i);
    let numMoths = i * 5;
    if (i <= numCircs/2) {
      numMoths = i * 4
    }
    let yDiff = map(i,0,numCircs,-w(.03),0)
    for (let j = 0; j < numMoths; j++) {
      let angle = map(j,0,numMoths,0,TWO_PI)
      let anDi = map(numMoths,3,30,10,3)
      let x = radius*cos(angle + rds(rnd(-anDi,anDi) + 45))
      let y = radius*sin(angle + rds(rnd(-anDi,anDi) + 45)) + yDiff
      let point = cV(x * map(dist(0,y,0,0),0,h(.5),1,1.13), y * 1.25)
      gP.push(point)
    }
  }
  for (let i = 0; i < numCircs; i++) {
    let radius  = map(i,0,numCircs,w(.003),(maxR*1.15)*sclAdjust) + i*w(.006*i);
    let numMoths = i * 3;
    if (i <= numCircs/2) {
      numMoths = i * 4
    }
    let yDiff = map(i,0,numCircs,-w(.03),0)
    for (let j = 0; j < numMoths; j++) {
      let angle = map(j,0,numMoths,0,TWO_PI) + rds(15)
      let anDi = map(numMoths,3,30,10,3)
      let x = radius*cos(angle + rds(rnd(-anDi,anDi)))
      let y = radius*sin(angle + rds(rnd(-anDi,anDi))) + yDiff
      let point = cV(x * map(dist(0,y,0,0),0,h(.5),1,1.1), y * 1.25)
      gP_LG.push(point)
    }
  }
  pop()
}

function mothsSetup(grid, gS) {
  let met1 = chElement()
  let met2 = chElement2()

  if (grid === 'halo'){
    halo(gS)
    for (let i = 0; i < gP.length; i++) {
      if (gS === 'kilo') {range = rnd(1.2,1.45); met2div = 4}
      if (gS === 'standard') {range = rnd(.8,1.2); met2div = 2}
      if (gS === 'nano') {range = rnd(.3,.8); met2div = 3}
      let mSc = range
      let loc = cV(gP[i].x,gP[i].y)
      let dir = cV(cos(0), sin(0));
      let speed = -rnd(.1,.5);
      let moth = chMoth()
      let met = met1
      if (i % met2div) {met = met2}
      let start = rnd(10,60)
      let rot = rnd(-TWO_PI,TWO_PI)
      let anOf = rnd(TWO_PI)
      BMs.push(new BM(loc, dir, speed, moth, mSc, met, start, rot, grid, anOf));
    }
  }
  if (grid === 'shoal'){
    shoal(gS)
    for (let i = 0; i < gP.length; i++) {
      if (gS === 'kilo') {range = rnd(1.9,2.4); met2div = 2}
      if (gS === 'standard') {range = rnd(1.4,1.9); met2div = 2}
      if (gS === 'nano') {range = rnd(.8,1.4); met2div = 4}
      let mSc = range
      let loc = cV(gP[i].x,gP[i].y)
      let dir = cV(cos(0), sin(0));
      let speed = -rnd(.1,.5);
      let moth = chMoth()
      let met = met1
      if (i % met2div) {met = met2}
      let start = rnd(10,60)
      let rot = rnd(-TWO_PI,TWO_PI)
      let anOf = rnd(TWO_PI)
      BMs.push(new BM(loc, dir, speed, moth, mSc, met, start, rot, grid, anOf));
    }
  }
  if (grid === 'entropy'){
    entropy(gS)
    for (let i = 0; i < gP.length; i++) {
      let loc = cV(gP[i].x,gP[i].y)
      let distMult = map(dist(gP[i].x,gP[i].y,0,0),0,w(.7),1.35,.2)
      if (gS === 'kilo') {range = rnd(1.25,1.8); met2div = 2}
      if (gS === 'standard') {range = rnd(.75,1.35); met2div = 2}
      if (gS === 'nano') {range = rnd(.15,1); met2div = 4}
      let mSc = range*distMult
      let dir = cV(cos(0), sin(0));
      let speed = -rnd(.1,.5);
      let moth = chMoth()
      let met = met1
      if (i % met2div) {met = met2}
      let start = rnd(10,60)
      let rot = rnd(-TWO_PI,TWO_PI)
      let anOf = rnd(TWO_PI)
      BMs.push(new BM(loc, dir, speed, moth, mSc, met, start, rot, grid, anOf));
    }
  }
  if (grid === 'cradle'){
    if (gS === 'kilo') {mSc = 1.5}
    if (gS === 'standard') {mSc = 1}
    if (gS === 'nano') {mSc = .55}
    cradle(gS)
    for (let i = 0; i < gP.length; i++) {
      let loc = cV(gP[i].x,gP[i].y)
      let dir = cV(cos(0), sin(0));
      let speed = -rnd(.1,.5);
      let moth = chMoth()
      let sclAdjust = .5
      let start = rnd(10,60)
      let rot = rnd(-TWO_PI,TWO_PI)
      let anOf = rnd(TWO_PI)
      BMs.push(new BM(loc, dir, speed, moth, mSc*sclAdjust, met1, start, rot, grid, anOf));
    }
    for (let i = 0; i < gP_LG.length; i++) {
      let loc = cV(gP_LG[i].x,gP_LG[i].y)
      let dir = cV(cos(0), sin(0));
      let speed = -rnd(.1,.5);
      let moth = chMoth()
      let sclAdjust = 1.25
      let start = rnd(10,60)
      let rot = rnd(-TWO_PI,TWO_PI)
      let anOf = rnd(TWO_PI)
      BMs.push(new BM(loc, dir, speed, moth, mSc*sclAdjust, met2, start, rot, grid, anOf));
    }
  }
  if (grid === 'gyre'){
    if (gS === 'kilo') {mSc = 1.3}
    if (gS === 'standard') {mSc = 1}
    if (gS === 'nano') {mSc = .65}
    gyre(gS)
    for (let i = 0; i < gP.length; i++) {
      let loc = cV(gP[i].x,gP[i].y)
      let dir = cV(cos(0), sin(0));
      let speed = -rnd(.1,.5);
      let moth = chMoth()
      let sclAdjust = map(dist(gP[i].x,gP[i].y,0,0),0,w(.5),.75,.3)
      let start = rnd(10,60)
      let rot = rnd(-TWO_PI,TWO_PI)
      let anOf = rnd(TWO_PI)
      BMs.push(new BM(loc, dir, speed, moth, mSc*sclAdjust, met1, start, rot, grid, anOf));
    }
    for (let i = 0; i < gP_LG.length; i++) {
      let loc = cV(gP_LG[i].x,gP_LG[i].y)
      let dir = cV(cos(0), sin(0));
      let speed = -rnd(.1,.5);
      let moth = chMoth()
      let sclAdjust = map(dist(gP_LG[i].x,gP_LG[i].y,0,0),0,w(.3),1.85,1.4)
      let start = rnd(10,60)
      let rot = rnd(-TWO_PI,TWO_PI)
      let anOf = rnd(TWO_PI)
      BMs.push(new BM(loc, dir, speed, moth, mSc*sclAdjust, met2, start, rot, grid, anOf));
    }
  }
  if (grid === 'chaos'){
    if (gS === 'kilo') {mSc = 1}
    if (gS === 'standard') {mSc = .8}
    if (gS === 'nano') {mSc = .55}
    chaos(gS)
    for (let i = 0; i < gP.length; i++) {
      let loc = cV(gP[i].x,gP[i].y)
      let dir = cV(cos(0), sin(0));
      let speed = -rnd(.1,.5);
      let moth = chMoth()
      let sclAdjust = map(dist(gP[i].x,gP[i].y,0,0),0,w(.5),.5,2.4)
      let start = rnd(10,60)
      let rot = rnd(-TWO_PI,TWO_PI)
      let anOf = rnd(TWO_PI)
      BMs.push(new BM(loc, dir, speed, moth, mSc*sclAdjust, met1, start, rot, grid, anOf));
    }
    for (let i = 0; i < gP_LG.length; i++) {
      let loc = cV(gP_LG[i].x,gP_LG[i].y)
      let dir = cV(cos(0), sin(0));
      let speed = -rnd(.1,.5);
      let moth = chMoth()
      let sclAdjust = map(dist(gP_LG[i].x,gP_LG[i].y,0,0),0,w(.5),.5,2.5)
      let start = rnd(10,60)
      let rot = rnd(-TWO_PI,TWO_PI)
      let anOf = rnd(TWO_PI)
      BMs.push(new BM(loc, dir, speed, moth, mSc*sclAdjust, met2, start, rot, grid, anOf));
    }
  }
  if (grid === 'silo'){
    silo(gS)
    if (gS === 'kilo') {mSc1 = 1.7; mSc2 = .8}
    if (gS === 'standard') {mSc1 = 1; mSc2 = 1}
    if (gS === 'nano') {mSc1 = .3; mSc2 = .5}
    for (let i = 0; i < gP.length; i++) {
      let loc = cV(gP[i].x,gP[i].y)
      let dir = cV(cos(0), sin(0));
      let speed = -rnd(.1,.5);
      let moth = chMoth()
      let start = rnd(10,60)
      let rot = rnd(-PI,PI)
      let anOf = rnd(TWO_PI)
      BMs.push(new BM(loc, dir, speed, moth, mSc1, met1, start, rot*3, grid, anOf, gS));
    }
    for (let i = 0; i < gP_LG.length; i++) {
      let loc = cV(gP_LG[i].x,gP_LG[i].y)
      let dir = cV(cos(0), sin(0));
      let speed = -rnd(.1,.5);
      let moth = chMoth()
      let start = rnd(10,60)
      let rot = rnd(-PI,PI)
      let anOf = rnd(TWO_PI)
      BMs.push(new BM(loc, dir, speed, moth, mSc2, met2, start, rot*3, grid, anOf, gS));
    }
  }
}

function setSpiralMoths(gS) {
  if (gS == 'kilo') {mSc = 1.5;numP_spiralMoths = 48;speedMult=.8}
  if (gS == 'standard') {mSc = 1;numP_spiralMoths = 60;speedMult=.7}
  if (gS == 'nano') {mSc = .55;numP_spiralMoths = 72;speedMult=.6}
  let met1 = chElement()
  let met2 = chElement2()
  for (let i = 0; i < numP_spiralMoths; i++) {
    let radius = rnd(w(.01),w(.65))
    let angle = rnd(TWO_PI)
    let size = rnd(w(.01),w(.03))
    let diff = rnd(.85,1.15)
    let spCo = rnd(.5,1) * speedMult
    let x = radius*cos(angle)*diff
    let y = radius*sin(angle)*diff
    let anOf = rnd(TWO_PI)
    let start = rnd(25,125)
    let moth = chMoth()
    let rot = rnd(-PI,PI)
    if (i < numP_spiralMoths/2) {
      let rotDir = 'cw'
      p = new BM_Spiral(x,y,size,radius,angle,spCo,met1,start,moth,rot,mSc,anOf,rotDir)
    }else{
      let rotDir = 'cCw'
      p = new BM_Spiral(x,y,size,radius,angle,spCo,met2,start,moth,rot,mSc,anOf,rotDir)
    }
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
  for (let i = 0; i < BMs.length; i++) {
    BMs[i].run();
  }
  for (let i = 0; i < BMs2.length; i++) {
    BMs2[i].run();
  }
}

function chMoth() { 
  const mothTypePercent = rnd();
    if (mothTypePercent < .35) {
      mothType = moth7
    }else if (mothTypePercent < .5) {
      mothType = moth8
    }else if (mothTypePercent < .65) {
      mothType = moth9
    }else{
      mothType = moth10
    }
    return mothType;
}

function topHalf(x,y,sc,rot) {
  translate(x,y)
  let rotOption = rot
  let mouseDist = dist(x,y,mouseX-width/2,mouseY-height/2)
  if (mouseDist < w(.2)) {
    rotOption = map(mouseDist,w(.2),0,rot,atan2(mouseY - y, mouseX - x));
  }
  rotate(rotOption)
  scale(sc * .85)
}

function botHalf(x,y,shapes,fadeIn,metl) {
  const denC = 1000

  let c = map(sin(frameCount / 12), -1, 1, .99, 1.05)
  let mouseDist = dist(x,y,mouseX-width/2,mouseY-height/2)
  if (mouseIsPressed && mouseDist < w(.2)) {
    c = map(dist(x,y,mouseX-width/2,mouseY-height/2),0,w(.2),0,1)
    fill(0,0,0,200*c)
  }

  let alpha = map(frameCount,fadeIn,fadeIn+12,0,215)
  let c1 = color(metl.mc1[0]*c, metl.mc1[1]*c, metl.mc1[2]*c, alpha);
  let c2 = color(metl.mc2[0]*c, metl.mc2[1]*c, metl.mc2[2]*c, alpha);
  let c3 = color(metl.mc3[0]*c, metl.mc3[1]*c, metl.mc3[2]*c, alpha);

  noStroke();

  for (let i = 0; i < shapes.length; i++) {
    let relcoords = [];
    shapes[i].forEach(j => relcoords.push([w(j[0]/denC) - w(.5),h(j[1]/denC) - h(.5)]))
    let thisCol = c1
    let inter = lerpColor(c1,c2,map(sin(frameCount / 4 + rds(i*10)), -1, 1, 0, 1))
    if (i % 2) {
      thisCol = c2
      inter = lerpColor(c2,c3,map(sin(frameCount / 7 + rds(i*10)), -1, 1, 0, 1))
    }
    fill(inter);
    beginShape()
      relcoords.forEach(j => vertex(j[0],j[1]))
    endShape()
  }
}

function moth7(x,y,sc,rot,fadeIn,metl) {
  push()

  topHalf(x,y,sc,rot)

  let shapes = [

    [[477.3,475],
    [478.1,474.3],
    [480.2,474.2],
    [483.5,475.8],
    [487.1,480.6],
    [487.3,486.7],
    [489.3,493],
    [492.2,497.2],
    [492.4,507.5],
    [490.4,508.4],
    [487.5,506.7],
    [484.3,489.2],
    [481.1,485.1],
    [478.1,479.4],
    [477.3,475]],

    [[488.3,481.5],
    [487.7,485.9],
    [489.3,489.8],
    [489.3,493],
    [491.8,496.6],
    [492.3,493.2],
    [496.6,494],
    [497,491.1],
    [494.6,486.5],
    [490.8,482.7],
    [488.3,481.5]],

    [[492.4,507.5],
    [494,506],
    [495.3,505.9],
    [497.5,502.8],
    [497.9,500.1],
    [496.6,498.2],
    [496.1,495.9],
    [496.6,494],
    [492.3,493.2],
    [493,494.3],
    [492.2,497.2],
    [492.4,507.5]],

    [[496.5,508.5],
    [495.3,505.9],
    [496.6,504],
    [498.5,503],
    [500.5,503.2],
    [501.5,504.8],
    [501.3,506.7],
    [500.2,507.7],
    [497.4,506.6],
    [500.9,509.2],
    [500.7,513.2],
    [500.2,513.5],
    [498.9,512.6],
    [498.6,511.2],
    [498.6,509.8],
    [496.5,508.5]],

    [[503.9,520.1],
    [500.9,509.2],
    [500.5,516.5],
    [498.2,523],
    [498.6,524.9],
    [500.4,525.5],
    [502.4,524.3],
    [503.9,520.1]],

    [[505.8,517.1],
    [505.6,513.9],
    [504.3,511.2],
    [502.5,509.1],
    [500.9,509.2],
    [502,513.2],
    [503.6,514.7],
    [503.5,516.4],
    [504.1,519],
    [504.8,519],
    [505.8,517.1]],

    [[483.1,533.9],
    [484.8,534.1],
    [487.4,533],
    [495.3,521.2],
    [496.2,517.6],
    [494.6,519],
    [496.3,516.6],
    [496.8,515.3],
    [496.1,513.8],
    [496.3,511.7],
    [495,510],
    [493.5,510.9],
    [492.5,514.9],
    [494.4,515.7],
    [493.4,518.3],
    [491.4,519.4],
    [492,521.5],
    [488.8,529.1],
    [485.1,530.7],
    [483.1,533.9]],

    [[492.9,511],
    [491.7,510.5],
    [490.1,511.1],
    [489.3,513.1],
    [489.1,512.2],
    [488.3,512.2],
    [487.4,513.1],
    [487.4,515.1],
    [489,518.2],
    [488.8,520],
    [489.1,520.9],
    [490.1,520.9],
    [492,518.5],
    [493.6,517.7],
    [494.4,515.7],
    [492.5,514.9],
    [492.9,513.2],
    [492.5,512.6],
    [492.9,511]],

    [[483.1,533.9],
    [483.1,531.8],
    [485.6,528],
    [490.2,522.4],
    [490.1,520.9],
    [491.4,519.4],
    [492,521.5],
    [491,522.5],
    [488.7,528.4],
    [488.8,529.1],
    [485.1,530.7],
    [483.1,533.9]],

    [[499.8,499.9],
    [499.3,499.6],
    [498.8,496.5],
    [500.5,492.2],
    [502.4,485.1],
    [512.4,475.6],
    [513.5,475.4],
    [510.8,481.9],
    [508.8,483.3],
    [508.3,484.2],
    [511.5,482],
    [514.6,474.2],
    [516.3,471.4],
    [517.9,470.3],
    [521.6,469.1],
    [522.3,469.5],
    [522.1,473],
    [520.8,476.7],
    [522.3,481.3],
    [521.8,482.7],
    [519.7,484.3],
    [520.2,486.2],
    [517.1,487],
    [519.3,487.5],
    [521,486.3],
    [522.6,487.8],
    [522.5,490.3],
    [523.4,491],
    [523.8,493.8],
    [519.8,499.3],
    [512.5,503.6],
    [510.9,501.6],
    [515.8,488.5],
    [512.4,484.4],
    [503.7,487.7],
    [502,496.8],
    [499.8,499.9]],

    [[502.1,505.1],
    [501.2,502.6],
    [500.1,501.8],
    [499.8,499.9],
    [502,496.8],
    [503.7,487.7],
    [508.8,485.8],
    [510.6,487.9],
    [508,494.3],
    [508.4,500.6],
    [503.6,504.8],
    [502.1,505.1]],

    [[514.9,488],
    [511.7,485.5],
    [509.6,486.8],
    [510.6,487.9],
    [508,494.3],
    [508.4,500.7],
    [503.6,504.8],
    [505.1,506.9],
    [507.2,507.6],
    [506.8,508.6],
    [507.3,508.8],
    [510.4,507.8],
    [508.9,505.1],
    [509.3,504.9],
    [510.7,505.8],
    [514.3,504.7],
    [513.9,503.8],
    [512.5,503.6],
    [510.9,501.6],
    [513.2,495.4],
    [512.9,493.5],
    [514.4,492.4],
    [514.9,488]],

    [[510.2,513.3],
    [509.1,512.6],
    [512.4,509.4],
    [508.8,511.6],
    [507.5,511.5],
    [506.3,510.7],
    [507.1,509.4],
    [510.4,507.8],
    [509.6,506.4],
    [510.1,505.4],
    [511,506.2],
    [516.5,504.2],
    [518.9,504],
    [519.3,504.7],
    [520,505.2],
    [520.3,506.4],
    [519.1,508.8],
    [510.2,513.3]],

    [[511.8,518.2],
    [509.9,516.1],
    [509.6,514.5],
    [510.2,513.3],
    [519.1,508.8],
    [519.9,507.1],
    [520.3,508.7],
    [516.6,514.1],
    [516.7,514.7],
    [517.8,513],
    [518.2,516.3],
    [517.6,518.5],
    [515,520],
    [512.9,520.1],
    [511.8,518.2]],

    [[512.9,530.2],
    [514.3,529.5],
    [517.1,523.8],
    [517.6,518.5],
    [515,520],
    [514.9,520.7],
    [513.3,521.3],
    [511.6,527.7],
    [512.9,530.2]],

    //EXTRAS

    [[566.1,307],
    [566.1,309.4],
    [568,310.3],
    [568,308.6],
    [566.1,307]],

    [[210.9,916.3],
    [212,918],
    [207.6,919.1],
    [210.9,916.3]],

    [[845,733.2],
    [847.4,731.7],
    [847.4,735.4],
    [845,733.2]]
  ]

  botHalf(x,y,shapes,fadeIn,metl)

  pop()
}

function moth8(x,y,sc,rot,fadeIn,metl) {
  push()
  
  topHalf(x,y,sc,rot)

  let shapes = [
 
    [[498.8,526.7],
    [501.1,522.3],
    [500.5,520.3],
    [497,521.3],
    [500.2,519.3],
    [503,510.5],
    [501.1,510.5],
    [498.7,516.8],
    [495.7,518.6],
    [495.5,520],
    [493.2,521.3],
    [491.7,521.3],
    [490.7,522.5],
    [491.9,526.3],
    [498.8,526.7]],

    [[500.2,531.1],
    [499.1,529.6],
    [500.3,529],
    [500.2,527.4],
    [499.5,529.2],
    [498.2,529.1],
    [497.8,527.5],
    [500.3,525.5],
    [500.5,524.2],
    [503.2,522.9],
    [506.8,523.9],
    [506.8,524.9],
    [507.7,526],
    [508.5,528.8],
    [504.8,531.6],
    [500.2,531.1]],

    [[502.3,512.6],
    [500.2,519.3],
    [501.1,522.3],
    [506.8,523.9],
    [510.4,521.1],
    [512.3,521.2],
    [514.9,519.7],
    [514.7,517.8],
    [514,516.6],
    [514.9,514.5],
    [514.3,512.9],
    [511.7,512],
    [511.2,509.8],
    [509.1,508.5],
    [502.3,512.6]],

    [[489.6,483],
    [491.7,478.6],
    [502.9,470.2],
    [505.2,470.3],
    [493.6,478],
    [488.9,494.8],
    [489.6,483]],

    [[503.9,502.1],
    [501.6,499.2],
    [503.2,493.3],
    [514.6,487],
    [527.3,490],
    [524.8,498],
    [520.9,501.4],
    [514.4,501.8],
    [511.2,503],
    [505.8,501.1],
    [503.9,502.1]],

    [[523.7,473.2],
    [523.7,473.8],
    [530.4,481.4],
    [529,476.3],
    [525.2,473.4],
    [523.7,473.2]],

    [[527.3,490],
    [529.6,487.7],
    [530.1,483.5],
    [526.4,482.5],
    [522.1,484.8],
    [519.9,487.8],
    [527.3,490]],

    [[501.1,500.3],
    [502.3,495.5],
    [530.4,481.4],
    [522.5,473.2],
    [516.9,473.6],
    [499.6,485.5],
    [489.5,494.3],
    [488.7,502.3],
    [501.1,500.3]],

    [[493.6,478],
    [490,492.5],
    [490.4,492.6],
    [494.6,486.5],
    [497.1,485.6],
    [497.3,475.5],
    [493.6,478]],

    [[506.2,477.6],
    [508.6,476.4],
    [510.5,474.6],
    [511.3,471.6],
    [510.3,469.3],
    [509.5,469.2],
    [508.5,475.1],
    [506.2,477.6]],

    [[487.4,501.8],
    [486.2,502.3],
    [485.1,501.2],
    [485.2,498.4],
    [487.5,494],
    [486.6,494.5],
    [485.6,494.1],
    [484.7,491.7],
    [485.5,487],
    [486.9,485],
    [488.5,484.3],
    [488.8,500.9],
    [488.1,499.7],
    [487.1,500.5],
    [487.4,501.8]],

    [[481.8,495.1],
    [481.9,493.5],
    [480.7,491.7],
    [478.7,491.4],
    [477.2,492.1],
    [478.6,495.1],
    [476.5,492.6],
    [475.7,494.4],
    [476.1,495.8],
    [479.7,497],
    [481.8,495.1]],

    [[477.7,507.2],
    [477.9,500.5],
    [478.4,499.2],
    [479.6,499.2],
    [482.2,503.8],
    [482.6,507.2],
    [480.4,503],
    [478.8,503.5],
    [478.7,506.1],
    [477.7,507.2]],

    [[472.9,512.3],
    [471.1,513.8],
    [469.4,516.8],
    [469.6,517.2],
    [470.1,516.8],
    [473.3,515.3],
    [473,513.9],
    [472.9,512.3]],

    [[476.9,508.2],
    [478.2,507.3],
    [478.7,506.1],
    [478.8,503.5],
    [480.1,503.6],
    [482.6,507.2],
    [481.8,509],
    [479.3,510.2],
    [478.1,511],
    [477.7,512.3],
    [476.4,513.8],
    [475.8,512.5],
    [476.2,510.9],
    [475.4,512.5],
    [475.8,513.3],
    [476,514.3],
    [474.1,516.4],
    [470.7,518.6],
    [469.7,518.5],
    [469.2,517.6],
    [470.1,516.8],
    [473.3,515.3],
    [473.4,512.5],
    [476.9,508.2]],

    [[501.1,510.5],
    [499.9,513.8],
    [499.6,510.8],
    [499.6,509.9],
    [497.2,507.9],
    [496.5,507.9],
    [495.4,506.9],
    [497.2,506.6],
    [503.5,506.2],
    [509.1,506.7],
    [509.1,508.5],
    [504,514],
    [502.3,512.6],
    [503,510.5],
    [501.1,510.5]],

    [[509.1,506.7],
    [511.4,506.9],
    [513.5,506.2],
    [515,506.1],
    [515.7,507.1],
    [514.1,508],
    [512.6,507.6],
    [511,508.6],
    [509.1,508.5],
    [509.1,506.7]],

    [[490.1,507.4],
    [489.6,507.4],
    [489.4,506.7],
    [490.4,506],
    [492.7,505.9],
    [495.4,506.9],
    [499.6,510.8],
    [499.9,513.8],
    [499.2,515.5],
    [498.2,512.3],
    [498.7,516.8],
    [492.5,520.5],
    [491,520.8],
    [489.5,519.9],
    [491.4,518.2],
    [488.4,517.2],
    [489,514.1],
    [491.1,513.2],
    [490.7,512.9],
    [491.7,510.2],
    [490.1,507.4]],

    [[514.1,508],
    [514.1,509.1],
    [515.4,511.4],
    [517.4,512],
    [517.4,512.6],
    [514.3,512.9],
    [511.7,512],
    [511,508.6],
    [514.1,508]],

    [[499.5,485],
    [497.1,485.6],
    [497.7,476],
    [499,474.4],
    [505.2,470.3],
    [506.4,468.5],
    [509.1,468.1],
    [509.9,469],
    [508.1,475.1],
    [505,477.9],
    [503.2,481.9],
    [499.5,485]],

    [[485.7,518.4],
    [486.4,521.2],
    [488.4,523.9],
    [490.8,524.5],
    [491.2,524],
    [489.2,522.7],
    [488.6,521],
    [490.7,518.2],
    [488.4,517.2],
    [489,514.1],
    [491,511.9],
    [491.7,508.9],
    [490.4,508],
    [489.5,508.6],
    [489,509.7],
    [488.6,506.9],
    [486.8,507.4],
    [485.5,508.8],
    [484.9,511.4],
    [486,514.5],
    [485.7,518.4]],

    [[64.1,762.5],
    [64.1,762.1],
    [64.5,761.8],
    [64.1,762.5]],

    [[911.7,141.8],
    [911.7,142.5],
    [912.5,143.1],
    [912.5,142.2],
    [911.7,141.8]],

    [[353.2,361.7],
    [353.2,362.9],
    [354.3,362.9],
    [353.2,361.7]]
  
  ]

  /*let coords_c = [

    [492.4,484.4,1.2],
    [488.7,485.5,1.3],
    [513.6,487.6,1.2],
    [492.7,522.2,1.2],
    [493.7,514,1.2],
    [514.9,507.4,1.2],
    [513.9,520.1,1.2],
    [505.9,523.1,1.2],
    [489.9,502.1,1.2],
    [529.5,484.7,1.2],
    [478.1,492.3,1.2],
    [472.9,516.2,1.2],
    [503.3,501,1.2],
    [503,492.9,2.3],
    [521.7,498.4,3.3],
    [506.8,515.9,2]

  ]*/

  botHalf(x,y,shapes,fadeIn,metl)

  pop()
}

function moth9(x,y,sc,rot,fadeIn,metl) {
  push()
  
  topHalf(x,y,sc,rot)

  let shapes = [
 
    [[462.4,474.7],
    [462.2,472.8],
    [463.5,471.9],
    [467.4,472.7],
    [472.7,476.1],
    [474,481],
    [473.6,483.2],
    [471.3,485.2],
    [474,484.2],
    [478.6,485.9],
    [483.1,490.9],
    [479.4,493],
    [479,494.4],
    [478.4,494.4],
    [476.6,493],
    [475,490.4],
    [472,489.1],
    [470,488.8],
    [469.3,487.8],
    [469.9,485.7],
    [468.8,485.9],
    [466.2,483.3],
    [464.4,479.6],
    [462.4,474.7]],

    [[485.7,479.8],
    [485.4,478.4],
    [486.6,478.1],
    [488.5,478.7],
    [491,479],
    [494.6,478.7],
    [497.2,479.4],
    [499.6,482.2],
    [500.1,484.8],
    [498.5,488.8],
    [498.2,492.8],
    [497.7,493.7],
    [498.2,499.4],
    [500.1,500.3],
    [499.7,501.4],
    [498.1,501.7],
    [497.2,500.7],
    [496.1,501.1],
    [491.4,495.5],
    [489.2,485.9],
    [485.7,479.8]],

    [[509.8,490.5],
    [512,494.5],
    [514.2,495.8],
    [510.8,490.5],
    [511.2,488.4],
    [513,486.3],
    [511.4,483.2],
    [510.3,485.1],
    [509,484.7],
    [507.7,483.7],
    [506,484.3],
    [506.2,488.9],
    [508.7,491.2],
    [509.7,495.3],
    [510.4,497.1],
    [508.5,497.5],
    [505.5,494.1],
    [507.1,497.1],
    [507,499.3],
    [505.2,501.4],
    [507.5,507],
    [510.2,506.8],
    [512,502],
    [511.7,495.3],
    [509.8,490.5]],

    [[496.2,513.6],
    [495.1,510.7],
    [495.3,508.1],
    [499,507.6],
    [503.1,509],
    [506.7,508.5],
    [507.7,508.8],
    [508.1,511.7],
    [503.3,514.7],
    [501.9,514.4],
    [500,515.1],
    [498.4,515],
    [496.2,513.6]],

    [[503.1,509],
    [499,507.6],
    [495.3,508.1],
    [495.9,506],
    [500.4,501.8],
    [502,501.2],
    [502.8,499.7],
    [503.1,498.6],
    [502.8,497.9],
    [501.4,498.2],
    [500.1,500.3],
    [498.2,499.4],
    [498.6,498.7],
    [498.5,488.8],
    [500.1,484.8],
    [499.6,482.2],
    [500.6,481.8],
    [502.3,482.2],
    [503.8,483.5],
    [503.9,484.6],
    [505.2,488.3],
    [505.5,494.1],
    [507.1,497.1],
    [507,499.3],
    [505.2,501.4],
    [505.3,503.7],
    [507.5,507],
    [510.2,506.8],
    [510,509.1],
    [509.3,509.8],
    [508.4,509.4],
    [507.3,508],
    [503.1,509]],

    [[508.1,533.5],
    [507,532.2],
    [507.4,530.9],
    [507.2,523.5],
    [506,519.3],
    [504.2,517.1],
    [505.4,517.4],
    [507.7,521.7],
    [508.6,525.6],
    [509.7,524.4],
    [510.3,527.7],
    [510.1,530],
    [508.8,533.5],
    [508.1,533.5]],

    [[508.4,540.7],
    [508.9,539.8],
    [508.9,535.2],
    [509.3,534.2],
    [508.8,533.5],
    [508.1,533.5],
    [507,532.2],
    [507.4,539.7],
    [508.4,540.7]],

    [[509,546.5],
    [507.5,545.7],
    [506.7,542.6],
    [507.4,539.7],
    [508.4,540.7],
    [509.1,542.9],
    [509,546.5]],

    [[506.8,482.2],
    [503,480.5],
    [502,478.8],
    [503.1,478.1],
    [508.1,480.3],
    [508.5,481.8],
    [506.8,482.2]],

    [[508.9,481.4],
    [508.4,479.9],
    [506.2,479.5],
    [503.1,478.1],
    [502.5,478.5],
    [502.3,477.7],
    [503.7,476.6],
    [506.9,476.6],
    [509.1,478.4],
    [509.4,479.7],
    [508.9,481.4]],

    [[519.4,498.7],
    [522,499.3],
    [523.9,497.4],
    [523.9,495.5],
    [525.4,493.1],
    [525.4,487.8],
    [523.3,484.3],
    [519.9,482.4],
    [522.3,483.1],
    [524.2,483],
    [525.4,481.6],
    [525.1,477],
    [518.9,473.8],
    [518.6,471.9],
    [517.1,471.5],
    [512.9,474.1],
    [511.7,477.2],
    [510.6,478.7],
    [510.2,480.4],
    [511.4,483.2],
    [513,486.3],
    [511.7,487.8],
    [514.4,494.2],
    [519.4,498.7]],

    [[520,501.6],
    [518.8,500.4],
    [519.4,498.7],
    [522,499.3],
    [520,501.6]],

    [[514.9,496.3],
    [512,494.5],
    [512.5,500.9],
    [515.7,510.9],
    [517.6,511.7],
    [518.6,509.8],
    [518.3,506.1],
    [516.2,503.4],
    [516.5,499.9],
    [514.9,496.3]],

    [[534.2,480.2],
    [532.4,479.9],
    [528.3,481.6],
    [527.6,484.3],
    [524.2,483],
    [522.3,483.9],
    [523.3,484.3],
    [525.4,487.8],
    [525.4,493.1],
    [526.8,492.6],
    [527.8,492.9],
    [529.1,490.7],
    [531.3,490.9],
    [533.4,490.5],
    [535.2,487.3],
    [535.2,482.4],
    [534.2,480.2]],

    [[531,496.1],
    [529.1,496.1],
    [527.6,498.6],
    [525.8,499.2],
    [525,501.3],
    [525.8,503.7],
    [525.3,505],
    [524.5,503.4],
    [524.7,501.5],
    [525.8,498.7],
    [527.5,498.4],
    [528,495.5],
    [527.3,494.2],
    [525.7,494.2],
    [523.9,495.5],
    [523.9,497.4],
    [520,501.6],
    [520.1,503.4],
    [519.7,505.6],
    [520.7,507.7],
    [524.4,509.6],
    [525.8,510.2],
    [528.3,509.9],
    [530.2,504.4],
    [532.1,503.4],
    [532.8,497.9],
    [531,496.1]],

    [[528.3,494],
    [529,492],
    [532.8,491.2],
    [534.8,492.3],
    [535.1,496.6],
    [534.4,498.8],
    [532.2,502.1],
    [532.8,497.9],
    [531,496.1],
    [529.1,496.1],
    [528.3,494]],

    [[525.8,510.2],
    [527.9,520.6],
    [528.3,509.9],
    [525.8,510.2]],

    [[528.6,535.7],
    [527.6,535],
    [527.1,534.1],
    [527.5,531.6],
    [527,529.7],
    [526.9,526.8],
    [526.6,525.3],
    [528,526.2],
    [529.2,529],
    [529,532.1],
    [528.8,533.1],
    [529.3,534.9],
    [528.6,535.7]],

    [[526.7,514.7],
    [526.3,512.4],
    [525.2,514.6],
    [525.8,516.1],
    [525.8,521.3],
    [526.6,525.3],
    [528,526.2],
    [528.4,524.2],
    [526.7,514.7]],

    [[530.3,455.3],
    [527.6,457.8],
    [525.3,459.4],
    [525,461.1],
    [526.3,462.3],
    [527.9,462.7],
    [531.2,476],
    [531.1,477.2],
    [532.4,479.9],
    [534.2,480.2],
    [536,479.2],
    [535.9,476.9],
    [537,476],
    [536.7,473.7],
    [535.5,472.1],
    [534.8,466.4],
    [535.7,461.5],
    [537,459.3],
    [537.4,456.2],
    [536.5,454.4],
    [533.6,454],
    [530.3,455.3]],

    [[294.1,922.5],
    [294.1,922.1],
    [294.5,921.8],
    [294.1,922.5]],

    [[851.7,421.8],
    [851.7,422.5],
    [852.5,423.1],
    [852.5,422.2],
    [851.7,421.8]],

    [[233.2,221.7],
    [233.2,222.9],
    [234.3,222.9],
    [233.2,221.7]],

    [[500.5,515.8],
    [500.5,514.9],
    [501.9,514.4],
    [503.3,514.7],
    [506.3,517.7],
    [506.1,516.1],
    [503.7,514.4],
    [505.7,513.2],
    [508.7,514.1],
    [510.2,515.8],
    [510.5,518.6],
    [509.7,520.9],
    [509.7,524.4],
    [509.1,525.1],
    [508.1,523.4],
    [507.7,521.7],
    [507,521.4],
    [505.4,517.4],
    [501.3,516.5],
    [500.5,515.8]],

    [[531.2,476],
    [533.1,471.8],
    [532.6,466.2],
    [531.1,463],
    [527.9,462.7],
    [525.8,463.1],
    [525,462.8],
    [522.1,464.4],
    [519,468.3],
    [517.8,471.7],
    [518.6,471.9],
    [518.9,473.8],
    [525.1,477],
    [525.4,481.6],
    [524.7,482.4],
    [527.3,482.4],
    [527.8,481],
    [530.5,479.9],
    [531.2,478.7],
    [530.5,477.3],
    [527.9,476.7],
    [527.1,475.6],
    [529.2,476.3],
    [531.2,476]],

    [[474.3,479.8],
    [474.3,483.7],
    [479.8,486.2],
    [481.1,488.7],
    [480.1,492.6],
    [480.3,495.7],
    [481.4,498.2],
    [481.8,500.7],
    [482.9,502.6],
    [482.9,503.8],
    [484.4,504.6],
    [486.9,505.3],
    [490.5,505.1],
    [492.7,505.6],
    [495.3,504.6],
    [497.2,502.6],
    [493.4,497.7],
    [491.4,495.5],
    [489.2,485.9],
    [483.4,476.9],
    [478.2,474.4],
    [473.5,473.8],
    [470.9,474.2],
    [470.7,474.8],
    [487.8,492.8],
    [487,487.8],
    [487,487.3],
    [487.9,489.2],
    [487.9,493.1],
    [485.7,494.6],
    [485,500.2],
    [484,501.1],
    [484.6,499.7],
    [485.5,494.4]],

    //extras

    [[294.1,922.5],
    [294.1,922.1],
    [294.5,921.8],
    [294.1,922.5]],

    [[851.7,421.8],
    [851.7,422.5],
    [852.5,423.1],
    [852.5,422.2],
    [851.7,421.8]],

    [[233.2,221.7],
    [233.2,222.9],
    [234.3,222.9],
    [233.2,221.7]]



  ]

  botHalf(x,y,shapes,fadeIn,metl)

  pop()
}

function moth10(x,y,sc,rot,fadeIn,metl) {
  push()
  
  topHalf(x,y,sc,rot)

  let shapes = [
 
    [[468.2,484.9],
    [477.2,475.3],
    [481.4,473.9],
    [483.6,474.4],
    [484.5,476.3],
    [472.8,492.9],
    [471.4,490.8],
    [469.1,488.6],
    [468.2,484.9]],

    [[484.1,494.9],
    [490.5,490.7],
    [490.5,485],
    [494.1,483.8],
    [490.7,479.7],
    [488.3,476.3],
    [484.5,476.3],
    [472.8,492.9],
    [475.8,495.6],
    [479.6,494.3],
    [484.1,494.9]],

    [[481.4,473.9],
    [476.6,473.5],
    [473.4,473.9],
    [472.7,476.2],
    [468.8,477.3],
    [467.1,480.7],
    [468.2,484.9],
    [477.2,475.3],
    [481.4,473.9]],

    [[484.1,494.9],
    [488.8,494.9],
    [491.3,495.6],
    [494.6,496.2],
    [496.8,495.5],
    [498.1,492.9],
    [497.7,487],
    [496.3,485.5],
    [492,486.3],
    [490.5,485],
    [490.5,490.7],
    [484.1,494.9]],

    [[489.3,497.1],
    [484.5,496.9],
    [480,497.6],
    [476.3,499.1],
    [472.6,500.6],
    [470.7,503.5],
    [470.2,507.6],
    [471.3,511],
    [478.9,507],
    [482.2,501.3],
    [484.5,499.1],
    [486.8,498.3],
    [489.3,497.1]],

    [[490.4,497.4],
    [487.6,498.9],
    [485.2,499.5],
    [483.4,501.1],
    [483.4,502.7],
    [484.5,503.9],
    [486.7,503.9],
    [490.8,503.1],
    [491.7,501.9],
    [492.1,499.8],
    [491.7,497.8],
    [490.4,497.4]],

    [[483.4,502.7],
    [482.8,503.7],
    [481.1,503.1],
    [478.9,507],
    [471.3,511],
    [472.3,512.8],
    [474.9,515],
    [478,515.7],
    [480.4,515.3],
    [486.1,511.4],
    [486.7,503.9],
    [484.5,503.9],
    [483.4,502.7]],

    [[486.3,518.8],
    [485.3,517.5],
    [486.1,511.4],
    [486.7,503.9],
    [488.6,503.5],
    [490.1,507.1],
    [489.8,513.4],
    [488.6,517.6],
    [488,518.5],
    [487.2,519],
    [486.3,518.8]],

    [[493.4,499.9],
    [494.8,498.3],
    [496.5,497.7],
    [498.1,498.4],
    [498.5,500.5],
    [497.6,502.9],
    [496.1,505.2],
    [492.1,511.5],
    [491.1,511.9],
    [490.5,508.4],
    [490.7,505.8],
    [492,502.1],
    [493.4,499.9]],

    [[488.6,517.6],
    [490.8,513.8],
    [491,512.5],
    [490.2,509.8],
    [490.9,504.3],
    [491.4,503],
    [488.6,503.5],
    [490.1,507.1],
    [489.8,513.4],
    [488.6,517.6]],

    [[499.7,497],
    [498.8,496.1],
    [498.6,492.4],
    [500.3,490.7],
    [502.2,490.4],
    [504.8,491.9],
    [505.7,493.8],
    [505.2,495.8],
    [503.8,497.2],
    [501.7,497.6],
    [499.7,497]],

    [[500.6,503],
    [498.9,503.9],
    [494.8,509.5],
    [493,514.9],
    [493.6,519.8],
    [495.7,523.4],
    [499.5,525.8],
    [503.3,526],
    [504.6,525],
    [505.2,520.7],
    [503.9,516.2],
    [501.3,512.9],
    [499.8,509.2],
    [499.9,506.1],
    [500.7,504.4],
    [500.6,503]],

    [[503.9,508],
    [503,508],
    [501.6,506.1],
    [500.6,503],
    [500.7,504.4],
    [499.9,506.1],
    [500.4,507.9],
    [500.3,509.4],
    [500.9,510.8],
    [503.1,512.2],
    [505,512.2],
    [506.3,510.7],
    [505.7,508.7],
    [503.9,508]],

    [[505.6,525.3],
    [503.3,526],
    [504.6,525],
    [505.2,520.7],
    [505.6,519.8],
    [504.5,515.1],
    [502.5,513.3],
    [502.2,512.2],
    [505,512.2],
    [506.3,510.7],
    [508.2,513.2],
    [509.4,516.2],
    [507.4,519],
    [505.6,525.3]],

    [[507.7,523.7],
    [509.5,520.9],
    [509.9,518.4],
    [509.4,516.2],
    [507.4,519],
    [505.6,525.3],
    [507.7,523.7]],

    [[503.9,508],
    [502.3,505.4],
    [501.8,501.9],
    [502.6,498.9],
    [505.2,495.8],
    [507.1,496.2],
    [508.9,500.7],
    [508.7,506.1],
    [505.7,508.7],
    [503.9,508]],

    [[517.1,516.8],
    [513.3,515.8],
    [509.2,513.4],
    [506.3,510.7],
    [505.7,508.7],
    [508.7,506.1],
    [514.3,505.7],
    [520.5,506.7],
    [525.3,509.5],
    [528.4,512.8],
    [528.2,514.9],
    [524.8,516.2],
    [517.1,516.8]],

    [[505.2,495.8],
    [507.2,494.8],
    [510.5,494.3],
    [516.6,495.4],
    [522.3,497.7],
    [526.7,500.5],
    [527.1,502.3],
    [524.6,504.2],
    [518.2,504.8],
    [508.9,500.7],
    [507.1,496.2],
    [505.2,495.8]],

    [[508.8,503],
    [511.7,502.7],
    [514.9,503.9],
    [516.1,503.9],
    [518.2,504.8],
    [524.6,504.2],
    [527.1,502.3],
    [528.4,502.3],
    [531.4,504.7],
    [532.4,507.3],
    [532.1,510.2],
    [529.3,511.9],
    [525.1,508.3],
    [521.9,507.5],
    [520.5,506.7],
    [514.3,505.7],
    [508.7,506.1],
    [508.8,503]],

    [[529.6,513.9],
    [528.9,513.8],
    [528.7,512.2],
    [525.6,508.7],
    [529.3,511.9],
    [532.1,510.2],
    [531.3,512.5],
    [529.6,513.9]]

  ]

  botHalf(x,y,shapes,fadeIn,metl)

  pop()
}

function crescent(met, gS) {

  push()

  if (gS == 'nano'){scale(.8); translate(w(.15),-h(.15))}
  if (gS == 'standard'){scale(1.1)}
  if (gS == 'kilo'){scale(1.55); translate(-w(.125),h(.125))}

  let fadeIn = 25;

  let shapes = [

    [[851.7,421.8],
    [851.7,422.5],
    [852.5,423.1],
    [852.5,422.2],
    [851.7,421.8]],

    [[907.5,76.7],
    [901,77.1],
    [896,79.4],
    [891.5,83.2],
    [887.7,88.5],
    [886,94.1],
    [885.5,99.1],
    [886.4,104.2],
    [886.5,100],
    [888,93.3],
    [891,88.3],
    [894.8,84.1],
    [899.2,81.2],
    [903,79.1],
    [905.8,78.1],
    [909.9,77.2],
    [907.5,76.7]],

    [[887.7,106.3],
    [887.1,101.5],
    [887.4,96.1],
    [888,93.3],
    [891,88.3],
    [896.3,83.1],
    [901.2,80.1],
    [894.9,85.3],
    [893.6,88.5],
    [892.9,94],
    [893.1,99.1],
    [895.2,103.2],
    [897.7,105.8],
    [900.9,108],
    [896,108],
    [891.7,106.5],
    [889.1,105.1],
    [887.7,106.3]],

    [[896.1,113.9],
    [892.4,111.6],
    [889.5,109],
    [887.7,106.3],
    [889.1,105.1],
    [891.7,106.5],
    [896.3,108.8],
    [901.9,108.6],
    [906.1,110.4],
    [909.9,110.8],
    [914.8,110.8],
    [910.4,113.1],
    [903.9,114.8],
    [898,114.8],
    [896.1,113.9]],

    [[927.7,102.9],
    [924.7,106],
    [920.4,109.3],
    [914.8,110.8],
    [910.4,113.1],
    [903.9,114.8],
    [911.6,116.2],
    [918.2,115.2],
    [923.2,112.2],
    [926.5,108],
    [927.7,105.1],
    [927.7,102.9]],

    [[895,114.8],
    [900.9,117.2],
    [907.2,118.2],
    [912.6,117.9],
    [918.2,115.2],
    [911.6,116.2],
    [903.9,114.8],
    [897.7,115.2],
    [895,114.8]],

    [[895,114.8],
    [890.7,111.9],
    [888.4,109.5],
    [886.7,105.8],
    [887.4,104.2],
    [887.7,106.3],
    [889.5,109],
    [892.4,111.6],
    [896.1,113.9],
    [898,114.8],
    [903.9,114.8],
    [897.7,115.2],
    [895,114.8]]

  ]

  const denC = 1000

  let alpha = map(frameCount,fadeIn,fadeIn+12,0,215)
  let c1 = color(met.mc1[0], met.mc1[1], met.mc1[2], alpha);
  let c2 = color(met.mc2[0], met.mc2[1], met.mc2[2], alpha);
  let c3 = color(met.mc3[0], met.mc3[1], met.mc3[2], alpha);

  noStroke();

  for (let i = 0; i < shapes.length; i++) {
    let relcoords = [];
    shapes[i].forEach(j => relcoords.push([w(j[0]/denC) - w(.5),h(j[1]/denC) - h(.5)]))
    thisCol = c1
    let inter = lerpColor(c1,c3,map(sin(frameCount / 4 + rds(i*10)), -1, 1, 0, 1))
    if (i % 2) {
      thisCol = c2
      inter = lerpColor(c3,c2,map(sin(frameCount / 7 + rds(i*10)), -1, 1, 0, 1))
    }
    if (i % 3) {
      thisCol = c3
      inter = lerpColor(c2,c1,map(sin(frameCount / 10 + rds(i*10)), -1, 1, 0, 1))
    }
    fill(inter);
    beginShape()
      relcoords.forEach(j => vertex(j[0],j[1]))
    endShape()
  }

  pop()
}

class BM{
  constructor(_loc,_dir,_speed,_moth,_mSc,_met,_start,_rot,_grid,_anOf,_gS){
    this.loc = _loc;
    this.dir = _dir;
    this.speed = _speed;
    this.moth = _moth;
    this.mSc = _mSc;
    this.met = _met;
    this.start = _start;
    this.rot = _rot;
    this.grid = _grid;
    this.anOf = _anOf;
    this.gS = _gS;
  }
  run() {
    this.move()
    if (this.grid === 'silo'){
      this.checkEdges();
    }
    this.update();
  }
  move(){
    let angle = frameCount / 5
    this.dir.x = cos(angle);
    this.dir.y = sin(angle);
    if (this.grid === 'silo') {
      angle = frameCount/60 + this.anOf * this.speed
      if (this.gS === 'nano') {
        this.dir.x = map(dist(0,this.loc.y,0,0),0,w(.5),0,cos(angle*2)*w(.0035));
      }
      if (this.gS === 'standard') {
        this.dir.x = map(dist(0,this.loc.y,0,0),0,w(.5),0,cos(angle*2)*w(.0015));
      }
      if (this.gS === 'kilo') {
        this.dir.x = cos(angle*2)*w(.001);
      }
      this.dir.y = -noise(angle)*w(.0025);
      var vel = this.dir.copy();
      this.loc.add(vel); //loc = loc + vel
    }
  }
  checkEdges(){
    if (this.grid === 'silo'){
      if (this.loc.y < -h(.55)) {
        this.loc.x = 0
        this.loc.y = h(.53)
        this.start = frameCount
      }
    }
  }
  update(){
    let brrAngle = frameCount / 30
    let brr = map(sin(brrAngle + this.anOf),-1,1,1,1.1)
    noStroke()
    if (this.grid === 'silo') {
      this.moth(this.loc.x * brr, this.loc.y, this.mSc, this.rot + map(sin(frameCount/90 + this.anOf),-1,1,0,this.rot),this.start,this.met);
    }else if (this.grid === 'cradle' || this.grid === 'halo') {
      this.moth(this.loc.x * brr, this.loc.y, this.mSc*(map(dist(this.loc.x,this.loc.y,0,0),0,w(.65),1.5,.8)), this.rot + map(sin(frameCount/90 + this.anOf),-1,1,0,this.rot),this.start,this.met);
    }else if (this.grid === 'gyre' || this.grid === 'chaos') {
      push()
      this.moth(this.loc.x * brr, this.loc.y * brr, this.mSc, this.rot + map(sin(frameCount/90 + this.anOf),-1,1,0,this.rot),this.start,this.met);
      pop()
    }else if (this.grid === 'entropy'){
      brr = map(sin(brrAngle + this.anOf),-1,1,1,1.15)
      this.moth(this.loc.x * brr, this.loc.y * brr, this.mSc, this.rot + map(sin(frameCount/90 + this.anOf),-1,1,0,this.rot),this.start,this.met);
    }else{
      brr = map(sin(brrAngle + this.anOf),-1,1,1,1.03)
      this.moth(this.loc.x * brr, this.loc.y * brr, this.mSc, this.rot + map(sin(frameCount/90 + this.anOf),-1,1,0,this.rot),this.start,this.met);
    }
  }
}

class BM_Spiral{
  constructor(_x,_y,_size,_radius,_angle,_spCo,_met,_start,_moth,_rot,_mSc,_anOf,_rotDir){
    this.x = _x;
    this.y = _y;
    this.size = _size;
    this.radius = _radius;
    this.angle = _angle;
    this.spCo = _spCo;
    this.met = _met;
    this.start = _start
    this.moth = _moth;
    this.rot = _rot;
    this.mSc = _mSc;
    this.history = [];
    this.anOf = _anOf;
    this.rotDir = _rotDir;
  }

  run(fM_xoff,fM_yoff) {
    this.update();
    this.show(fM_xoff,fM_yoff);
  }

  update() {
    let t = 0
    let relSpeed = this.spCo * map(dist(this.x,this.y,0,0),w(.7),0,.1,3)
    t += .5 * relSpeed
    let tr = 0
    if (this.rotDir == 'cw') {
      rotate(rds(frameCount * .01))
    }
    if (this.rotDir == 'cCw') {
      rotate(-rds(frameCount * .01))
    }
    this.x *= map(t,0,50,1,.6)
    this.y *= map(t,0,50,1,.6)
    tr += 25 * this.spCo
    if (dist(this.x,this.y,0,0) <= w(.05)) {
      this.start = frameCount
      let newRadius = w(.65)
      this.x = newRadius*cos(this.angle)
      this.y = newRadius*sin(this.angle)
    }
  }

  show(fM_xoff,fM_yoff) {

    let brrAngle = frameCount / 30
    let brr = map(sin(brrAngle + this.anOf),-1,1,1,1.15)

    let c = map(noise(fM_xoff, fM_yoff), 0, 1, 0, map(dist(this.x,this.y,mouseX-width/2,mouseY-height/2),w(.05),w(.2),0,.3));
    fill(c * this.met[0],c * this.met[1],c * this.met[2], 1)
    noStroke()
    let sclAdjust = map(dist(this.x,this.y,0,0),w(.7),w(.1),2.5,.35)
    if (dist(this.x,this.y,0,0) < w(.1)) {
      sclAdjust = map(dist(this.x,this.y,0,0),w(.1),w(.05),.35,0)
    }
    this.moth(this.x * brr, this.y * brr, this.mSc * sclAdjust, map(sin(frameCount/60 + this.anOf),-1,1,0,this.rot),this.start,this.met);
  }
}
