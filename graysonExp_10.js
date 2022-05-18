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
//function d(val) {if (val == null) return height;return height * val;}

//////////////////////////////////////

const palettes = {
  'gray': {
    light: [230, 227, 223],
    dark: [56, 55, 55],
    accent_light: [179, 179, 179],
    accent_dark: [46, 38, 18]
  },
  'orange': {
    light: [250, 148, 5],
    dark: [99, 88, 70],
    accent_light: [250, 240, 95],
    accent_dark: [148, 146, 114]
  },
  'red': {
    light: [230, 34, 60],
    dark: [99, 40, 48],
    accent_light: [237, 175, 40],
    accent_dark: [59, 43, 10]
  },
  'blue': {
    light: [25, 91, 214],
    dark: [8, 8, 30],
    accent_light: [204, 235, 230],
    accent_dark: [44, 77, 60]
  }
}

let play = true

let conc, vert;
let lay;
let moving = false;
let pal;

// GRAPHICS

let graphics;

// WATER PARTS

let cols, rows;
let scl;
let flying = 0;
let inc;

// SPIRAL SETUP

let sp_angle = 2;
let offset = 300;
let scalar = 3.5;
let speed = 0.1;

// FLOATING BUTTERFLIES PARTS

let buttermoths_num = 50;
let fM_noiseScale = 200, fM_noiseStrength=1;
let buttermoths = [];

// IRREG CIRCLE

let circs_num = 23
let circs = [circs_num]
let oldPt;

//////////////////////////////////////

function setup() {
  noiseSeed(seed)
  const smD = windowWidth < windowHeight ? windowWidth : windowHeight;
  createCanvas(smD, smD);
  graphics = createGraphics(smD,smD);
  spirals = createGraphics(smD,smD);

  lay = chooseLayout() 
  console.log(lay)

  pal = choosePalette()
  console.log(choosePalette_Name())

  cols = 80;
  rows = cols;
  scl = width/cols

  // BUTTERMOTHS
  push()
  for (let i = 0; i < buttermoths_num; i++) {
    if (lay === 'vert'){
      loc = createVector(rnd(w(.35),w(.65)), rnd(height), w(.2));
    }
    if (lay === 'conc'){
      let radius = rnd(w(.16), w(.27))
      let rt_an = map(i,0,buttermoths_num,0,TWO_PI)
      let conc_x = width/2 + radius*cos(rt_an)
      let conc_y = height/2 + radius*sin(rt_an)
      loc = createVector(conc_x, conc_y, w(.2));
    }
    let angle = 0; //any value to initialize
    let dir = createVector(cos(angle), sin(angle));
    let speed = -random(.1,.5);
    //let speed = random(5,map(mouseX,0,width,5,20));   // faster
    let moth = chooseMoth()
    //buttermoths[i] = new FlowButtermothConc(loc, dir, speed, moth, lay, moving);
    buttermoths.push(new FlowButtermoth(loc, dir, speed, moth, lay, moving));
  }
  pop()

  randomDaubs(500, pal.dark[0], pal.dark[1], pal.dark[2])
  inwardDaubs(1000, 135, 30, 50)
  draw_tS()
  //console.log(lay)
}

function draw() {
  translate(width/2,height/2)

  water()

  if (lay === 'vert') {
    roughTexture()
  }


  drawSpirals_Vert(lay)

  verticalTexture(lay)

  imageMode(CENTER)
  image(graphics, 0, 0)
  image(spirals, 0, 0)

  // BUTTERMOTHS
  push()
  let fM_xoff = 0;
  let fM_yoff = 1000;
  let fM_inc = .1;
  fill(15,35,60, 25);
  noStroke();
  //rect(-width/2, -height/2, width, height);
  translate(-w(.22),-h(.22))
  for (let i = 0; i < buttermoths.length; i++) {
    /*let thisMoth = buttermoths[i]
    for (let j = 0; j < buttermoths.length; j++) {
      let other = buttermoths[j]
      if (other != thisMoth) {
        let sep = dist(thisMoth.loc.x,thisMoth.loc.y,other.loc.x,other.loc.y)
        if (sep > w(.02)) {
          buttermoths[i].run(fM_xoff,fM_yoff);
        }
      }
    }*/
    buttermoths[i].run(fM_xoff,fM_yoff);
    fM_xoff += fM_inc;
    fM_yoff += fM_inc;
  }
  pop()

  if (play === false){
    noLoop()
  }else{
    loop()
  }
  console.log(frameRate())
}

function mousePressed() {
  if (play === true) {
    play = false;
  } else { // implies play === false
    play = true;
  }
}

function chooseLayout() {
  const layout_options = ['conc','vert']
  const choice = layout_options[floor(map(decPairs[2],0,255,0,layout_options.length - 0.001))]
  return choice
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

function water() {
  push()
  translate(-width/2,-height/2)
  flying += 0.05;
  fill(3,3,15)

  let yoff = flying;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let xPos = x * scl;
      let yPos = y * scl;
      // IF USING THIS VERSION OF c - use general brightness as potential attribute
      let c = map(noise(xoff, yoff), 0, 1, -1, map(mouseY,0,width,0,2)) + map(dist(xPos,yPos,mouseX,mouseY),0,w(1),1.8,0)
      fill(c * 163, c * 157, c * 135, c * 90); // 25, 91, 214
      noStroke();
      xoff += 0.6;
      var angle = atan2(width/2,height/2);
      rect(xPos, yPos, scl, scl);
      //ellipse(xPos,yPos,scl/2)
    }
    yoff += 0.6;
  }
  pop()
}

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

function draw_tS() {
  push()
  graphics.blendMode(graphics.BLEND)
  graphics.translate(graphics.width/2,0)
  for (let i = 0; i < 250; i++){
    let ts_x = map(i,0,250,-graphics.width/2,graphics.width/2)
    let c = map(dist(ts_x,0,0,0),0,graphics.width/2,0,.5)
    let ALPHA_COEFF = map(dist(ts_x,0,0,0),0,graphics.width/2,0.25,1)
    let ts_y1 = -h(0.1)
    let ts_y2 = h(1.1)
    tS_original(ts_x, ts_y1, ts_x, ts_y2, w(.35), 10*c, 10*c, 10*c, 10*ALPHA_COEFF)
    tS_original(ts_x, ts_y1, ts_x, ts_y2, w(.35), pal.light[0]*c, pal.light[1]*c, pal.light[2]*c, 10*ALPHA_COEFF)
  }
  graphics.noLoop();
  pop()
}

function texturedCircle(init_distort,size,inc,diff,max_distort) {
  push()
  //translate(width/2,0)
  let zoff = 0
  let t = frameCount * 3 + rnd(TWO_PI)
  graphics.angleMode(graphics.DEGREES)
  //graphics.translate(graphics.width/2,0)
  //graphics.beginShape()
  if (frameCount < 65) {
    let xoff = map(cos(t+diff), -1, 1, 0, 1)
    let yoff = map(sin(t-diff), -1, 1, 0, 1)
    let r = map(noise(xoff, yoff), 0, 1, size, size-rnd(w(.01),max_distort*noise(xoff, yoff, zoff)))
    let x1 = init_distort + r * cos(t-.2)
    let y1 = graphics.height/2 + init_distort + r * sin(t-.2)
    let x2 = init_distort + r * cos(t)
    let y2 = graphics.height/2 + init_distort + r * sin(t)
    let dis = rnd(.97,1.03)
    graphics.line(x1,y1,x2,y2)
    graphics.line(x1*dis,y1*dis,x2*dis,y2*dis)
    zoff += inc/5;
  }
  //graphics.endShape(CLOSE)
  pop()
}

function roughTexture() {
  push()
  graphics.blendMode(graphics.OVERLAY)
  graphics.noFill()
  //graphics.translate(0,graphics.height/2)
  //let angle = random(TWO_PI);
  let num_circs = 90
  let xoff = 0
  for (let i = 0; i < num_circs; i++) {
    let i_d = rnd(-w(.003), w(.003))*i
    //translate(rnd(w(.01),rnd(h(.01))))
    //let c = map(mouseX,0,width,0,2);
    let size = map(i,0,num_circs,w(.01),w(.5))
    let inc = .003
    let c = map(size,0,w(1.5),0,2)
    let alpha_coeff = map(size,0,w(.35),.05,.5)
    graphics.stroke(35 * c, 45 * c, 80 * c, 35 * map(frameCount,100,220,0,1) * alpha_coeff) //109, 158, 163
    graphics.rotate(map(frameCount,0,15,20,0)) // WHAT MAKES IT 'ROUGH'
    //graphics.strokeWeight(w(.001))
    graphics.strokeWeight(map(i,0,num_circs,w(.0001),w(.0006)))
    strokeCap(ROUND)
    //graphics.ellipse(0,0,size)
    texturedCircle(i_d,size,inc,0,w(.05))
    texturedCircle(i_d,size,inc*15,30,w(.05))
    texturedCircle(i_d,size,inc*25,60,w(.05))
    graphics.stroke(235 * c, 154 * c, 54 * c, 65 * alpha_coeff)
    texturedCircle(i_d,size,inc*15,90,w(.05))
    texturedCircle(i_d,size,inc*25,120,w(.05))
    graphics.stroke(235 * c, 154 * c, 54 * c, 25 * alpha_coeff)
    texturedCircle(i_d,size,inc*15,270,w(.05))
    texturedCircle(i_d,size,inc*25,300,w(.05))
    xoff += .01
  }
  pop()
}

function blurredEllipse(x,y,size,r,g,b,a) {
  let o = rnd(-size,size)
  graphics.fill(r,g,b,.03*a)
  graphics.ellipse(x+o,y+o,1.2*size)
  graphics.fill(r,g,b,.08*a)
  graphics.ellipse(x+o,y+o,1.1*size)
  graphics.fill(r,g,b,.13*a)
  graphics.ellipse(x+o,y+o,size)
  graphics.fill(r,g,b,.23*a)
  graphics.ellipse(x+o,y+o,.9*size)
  graphics.fill(r,g,b,.4*a)
  graphics.ellipse(x,y,.8*size)
}

function randomDaubs(num, r, g, b) {
  let num_daubs = num
  for (let i = 0; i < num_daubs; i++) {
    let angle = map(i,0,num_daubs,0,TWO_PI)
    let rad = rnd(w(.75)) - rnd(.58)
    let x = width/2 + rnd(-w(.5)+rnd(w(.4)),w(.5)-rnd(w(.4)))
    let y = rnd(height)
    graphics.noStroke()
    let coeff = map(dist(x,0,width/2,0),0,w(.6),1,.1)
    let alpha_coeff = map(dist(x,y,width/2,height/2),0,w(.6),.1,1.4)
    let col = [r*coeff,g*coeff,b*coeff]
    blurredEllipse(x,y,rnd(w(.015),w(.035)),col[0],col[1],col[2],180*alpha_coeff)
  }
}

function inwardDaubs(num, r, g, b) {
  let num_daubs = num
  for (let i = 0; i < num_daubs; i++) {
    let angle = map(i,0,num_daubs,0,TWO_PI)
    //let xoff = map(cos(angle), -1, 1, 0, 1)
    //let yoff = map(sin(angle), -1, 1, 0, 1)
    let rad = w(.8) - rnd(w(.78)) + rnd(.75)
    let x = width/2 + rnd(-w(.5)-rnd(w(.25)),w(.5)+rnd(w(.25)))
    let y = rnd(height)
    graphics.noStroke()
    let coeff = map(dist(x,0,graphics.width/2,0),0,w(.6),.1,1)
    let alpha_coeff = map(dist(x,0,graphics.width/2,0),0,w(.8),.5,1)
    //graphics.fill(235*coeff,154*coeff,42*coeff,90*alpha_coeff)
    let col = [r*coeff,g*coeff,b*coeff]
    //graphics.ellipse(x,y,rnd(w(.015),w(.035)))
    blurredEllipse(x,y,rnd(w(.025),w(.035)),col[0],col[1],col[2],250*alpha_coeff)
  }
}

function texturedCircle_vert(init_distort,size,inc,diff,max_distort, layout) {
  push()
  //translate(width/2,0)
  let zoff = 0
  let t = frameCount * 3 + rnd(TWO_PI)
  let d =1
  if (layout === 'vert'){
    d = 2.5
  }
  graphics.angleMode(graphics.DEGREES)
  //graphics.translate(graphics.width/2,0)
  //graphics.beginShape()
  if (frameCount < 65) {
    let xoff = map(cos(t+diff), -1, 1, 0, 1)
    let yoff = map(sin(t-diff), -1, 1, 0, 1)
    let r = map(noise(xoff, yoff), 0, 1, size, size-rnd(w(.01),max_distort*noise(xoff, yoff, zoff)))
    let x1 = init_distort + r * cos(t-.2)
    let y1 = graphics.height/2 + init_distort + d*r * sin(t-.2)
    let x2 = init_distort + r * cos(t)
    let y2 = graphics.height/2 + init_distort + d*r * sin(t)
    let dis = rnd(.97,1.03)
    graphics.line(x1,y1,x2,y2)
    graphics.line(x1*dis,y1*dis,x2*dis,y2*dis)
    zoff += inc/5;
  }
  //graphics.endShape(CLOSE)
  pop()
}

function verticalTexture(layout) {
  push()
  graphics.blendMode(graphics.OVERLAY)
  graphics.noFill()
  //graphics.translate(0,graphics.height/2)
  //let angle = random(TWO_PI);
  let num_circs = 90
  let xoff = 0
  for (let i = 0; i < num_circs; i++) {
    let i_d = rnd(-w(.003), w(.003))*i
    translate(rnd(w(.01),rnd(h(.01))))
    //let c = map(mouseX,0,width,0,2);
    let size = map(i,0,num_circs,w(.01),w(1))
    let inc = .003
    let c = map(size,0,w(1),0,2)
    let alpha_coeff = map(size,0,w(.15),.1,.6)
    graphics.stroke(pal.accent_dark[0] * c, pal.accent_dark[1] * c, pal.accent_dark[2] * c, 85 * alpha_coeff)
    graphics.strokeWeight(rnd(w(.001)))
    //graphics.strokeWeight(map(i,0,num_circs,w(.0005),w(.002)))
    //graphics.ellipse(0,0,size)
    texturedCircle_vert(i_d,size,inc,0,w(.06),layout)
    texturedCircle_vert(i_d,size,inc*15,30,w(.06),layout)
    texturedCircle_vert(i_d,size,inc*25,60,w(.06),layout)
    graphics.stroke(pal.accent_dark[0] * c, pal.accent_dark[1] * c, pal.accent_dark[2] * c, 65 * alpha_coeff)
    texturedCircle_vert(i_d,size,inc*15,90,w(.06)),layout
    texturedCircle_vert(i_d,size,inc*25,120,w(.06),layout)
    graphics.stroke(pal.accent_dark[0] * c, pal.accent_dark[1] * c, pal.accent_dark[2] * c, 25 * alpha_coeff)
    texturedCircle_vert(i_d,size,inc*15,270,w(.06),layout)
    texturedCircle_vert(i_d,size,inc*25,300,w(.06),layout)
    xoff += .01
  }
  pop()
}

function drawCirc_Vert_RAND(radius, r, g, b, a, t_offset, limit, layout) {
  push()
  //strokeWeight(3)
  //noFill()
  spirals.noStroke()
  let xoff = 0
  //radius = w(.35)
  //let t = frameCount / 20
  //let t = map(frameCount,0,limit*2,frameCount/30,frameCount/120) // ROSE
  //let t = frameCount - map(frameCount,0,limit,0,frameCount/2) // RANDOM
  let t = map(frameCount,0,limit,frameCount*15,frameCount/3)
  //let t = frameCount - map(frameCount,0,limit,frameCount/20,frameCount/2) // RANDOM
  //let t = frameCount - map(frameCount,0,limit,0,sqrt(frameCount)) // SPIRAL
  //let max_t = 
  if (layout == 'vert') {
    x = width/2 + .67*radius * cos(t+t_offset) + map(noise(xoff),0,1,-radius*noise(xoff)/5,radius*noise(xoff)/5)
    y = height/2 + 3*radius * sin(t+t_offset) + map(noise(xoff),0,1,-radius*noise(xoff)/5,radius*noise(xoff)/5)
  }else{
    x = width/2 + radius * cos(t+t_offset) + map(noise(xoff),0,1,-radius*noise(xoff)/5,radius*noise(xoff)/5)
    y = height/2 + radius * sin(t+t_offset) + map(noise(xoff),0,1,-radius*noise(xoff)/5,radius*noise(xoff)/5)
  }
  let size = map(sin(frameCount/20),0,1,w(.04),w(.06))
  if (frameCount < limit) {
    spirals.fill(r, g, b, a*.5) 
    spirals.ellipse(x,y,size)
    spirals.fill(r, g, b, a*.15) 
    spirals.ellipse(x,y,.8*size)
    spirals.fill(r, g, b, a*.25) 
    spirals.ellipse(x,y,.6*size)
    spirals.fill(r, g, b, a*.35) 
    spirals.ellipse(x,y,.4*size)
    xoff += 0.05
  }
  pop()
}

function drawCirc_Vert_ROSE(radius, r, g, b, a, t_offset, limit, layout) {
  push()
  //strokeWeight(3)
  //noFill()
  spirals.noStroke()
  let xoff = 0
  //radius = w(.35)
  //let t = frameCount / 20
  //let t = map(frameCount,0,limit*2,frameCount/30,frameCount/120) // ROSE
  //let t = frameCount - map(frameCount,0,limit,0,frameCount/2) // RANDOM
  //let t = frameCount - map(frameCount,0,limit,frameCount/20,frameCount/2) // RANDOM
  let t = frameCount - map(frameCount,0,limit,0,sqrt(frameCount)) // SPIRAL
  //let max_t = 
  if (layout == 'vert') {
    x = width/2 + .6*radius * cos(t+t_offset) + map(noise(xoff),0,1,-radius*noise(xoff)/5,radius*noise(xoff)/5)
    y = height/2 + 3*radius * sin(t+t_offset) + map(noise(xoff),0,1,-radius*noise(xoff)/5,radius*noise(xoff)/5)
  }else{
    x = width/2 + radius * cos(t+t_offset) + map(noise(xoff),0,1,-radius*noise(xoff)/5,radius*noise(xoff)/5)
    y = height/2 + radius * sin(t+t_offset) + map(noise(xoff),0,1,-radius*noise(xoff)/5,radius*noise(xoff)/5)
  }
  let size = map(sin(frameCount/20),0,1,w(.04),w(.06))
  if (frameCount < limit) {
    spirals.fill(r, g, b, a*.5) 
    spirals.ellipse(x,y,size)
    spirals.fill(r, g, b, a*.15) 
    spirals.ellipse(x,y,.8*size)
    spirals.fill(r, g, b, a*.25) 
    spirals.ellipse(x,y,.6*size)
    spirals.fill(r, g, b, a*.35) 
    spirals.ellipse(x,y,.4*size)
    xoff += 0.05
  }
  pop()
}

function drawSpirals_Vert(layout) {
  push()
  num_circs = 45
  for (let i = 0; i < num_circs; i++) {
    //drawCirc_Vert_ROSE(w(.01)+i*w(.02), map(i,0,num_circs-6,pal.accent_light[0],3), map(i,0,num_circs-6,pal.accent_light[1],3), map(i,0,num_circs-6,pal.accent_light[2],2), 1 + .5*i, i*(rnd(-10,10)), 200 - 15*i, layout)
    //drawCirc_Vert_RAND(w(.01)+i*w(.02), map(i,0,num_circs-6,pal.light[0],3), map(i,0,num_circs-6,pal.light[1],3), map(i,0,num_circs-6,pal.light[2],2), 12 + 1.5*i, i*(rnd(-10,10)), 50 + 15*i, layout)
    drawCirc_Vert_ROSE(w(.01)+i*w(.02), map(i,0,num_circs-6,pal.accent_light[0],3), map(i,0,num_circs-6,pal.accent_light[1],3), map(i,0,num_circs-6,pal.accent_light[2],2), 1 + .5*i, i*(rnd(-30,30)), 150 - 5*i, layout)
    drawCirc_Vert_RAND(w(.01)+i*w(.02), map(i,0,num_circs-6,pal.light[0],3), map(i,0,num_circs-6,pal.light[1],3), map(i,0,num_circs-6,pal.light[2],2), 12 + 1.5*i, i*(rnd(-30,30)), 25 +10*i, layout)
  }
  pop()
}

function simpleButterfly(x,y,sc) {
  push()
  translate(-width/2,-height/2)
  translate(x,y)
  scale(sc)
  let coords = [
    [51349,51026,52884,50104,51948,51774],
    [51108,50647,52884,50104,51349,51026],
    [51220,50352,52884,50104,51108,50647],
    [52163,49789,52884,50104,51220,50352],
    [52407,49483,52884,50104,52163,49789],
    [52631,49424,52884,50104,52407,49483],
    [52903,51870,52884,50104,52518,51972],
    [53078,51434,52884,50104,52903,51870],
    [52518,51972,51948,51774,52884,50104],
    [50522,51009,50905,50737,50560,50737],
    [50839,51394,50905,50737,50522,51009],
    [51574,51663,50839,51394,50905,50737],
    [51314,52153,51574,51663,50839,51394],
    [51602,52243,51574,51663,51314,52153],
    [51694,52088,51574,51663,51602,52243],
    [50656,50390,50376,50690,50636,50564],
    [50011,50503,50656,50390,50376,50690],
    [49956,50117,50656,50390,50011,50503],
    [50397,50033,49956,50117,50656,50390],
    [51010,50367,50397,50033,50656,50390],
    [50397,48552,51010,50367,50397,50033],
    [52037,49622,50397,48552,51010,50367],
    [51048,47268,52037,49622,50397,48552],
    [52411,48552,51048,47268,52037,49622],
    [51562,47056,52411,48552,51048,47268],
    [52122,47348,51562,47056,52411,48552],
    [49249,51312,49557,50295,49905,50756],
    [49249,51312,49557,50295,49905,50756],
    [47026,50993,49249,51312,47816,51847],
    [47263,50323,49249,51312,47026,50993],
    [48365,49974,47263,50323,49249,51312],
    [49557,50295,48365,49974,49249,51312],
    [50589,51359,49588,51364,50109,51203],
    [51048,52183,49588,51364,50589,51359],
    [49029,51915,49588,51364,51048,52183],
    [48973,52548,51048,52183,49029,51915],
    [49445,53003,51048,52183,48973,52548],
    [50522,53152,51048,52183,49445,53003],
    [51010,52847,51048,52183,50522,53152]
  ]

  let relCoords = [];
  const den = 100000
  coords.forEach(i => relCoords.push([w(i[0]/den),h(i[1]/den),w(i[2]/den),h(i[3]/den),w(i[4]/den),h(i[5]/den)]))
  relCoords.forEach(i => triangle(i[0],i[1],i[2],i[3],i[4],i[5]))
  //relCoords.forEach(i => speckling_2(i[0],i[1],i[2],i[3],i[4],i[5]))
  pop()
  
}

function profileMoth(x,y,sc) {

  push()
  translate(-width/2,-height/2)
  translate(x,y)
  scale(sc)

  let coords = [

    [50714,47165,51477,47140,51140,46927],
    [50489,47615,51477,47140,50714,47165],
    [51765,47928,50489,47615,51477,47140],
    [50289,48340,51765,47928,50489,47615],
    [51815,48640,50289,48340,51765,47928],
    [49827,48903,51815,48640,50289,48340],
    [51715,49716,49827,48903,51815,48640],
    [49714,49428,51715,49716,49827,48903],
    [51677,50478,49714,49428,51715,49716],
    [49877,50078,51677,50478,49714,49428],
    [51340,50691,49877,50078,51677,50478],
    [51277,51016,49877,50078,51340,50691],
    [50714,51016,51277,51016,49877,50078],
    [51052,51179,50714,51016,51277,51016],
    [51010,51449,49827,50612,51052,51179],
    [49192,50765,51010,51449,49827,50612],
    [50423,51964,49192,50765,51010,51449],
    [48371,51747,50423,51964,49192,50765],
    [49868,52745,48371,51747,50423,51964],
    [48258,52350,49868,52745,48371,51747],
    [49425,52858,48258,52350,49868,52745],
    [48556,52801,48258,52350,49425,52858],
    [48105,51135,49071,50725,48387,51538],
    [48105,50741,49071,50725,48105,51135],
    [48733,50065,49071,50725,48105,50741],
    [49144,49944,49071,50725,48733,50065],
    [49763,50532,49144,49944,49071,50725],
    [49578,49944,49144,49944,49763,50532],
    [50278,50725,49578,49944,49763,50532],
    [49087,49550,49602,49462,49719,49840],
    [48918,48938,49602,49462,49087,49550],
    [49719,48906,48918,48938,49602,49462],
    [49095,48222,49719,48906,48918,48938],
    [50190,48295,49095,48222,49719,48906],
    [49554,47570,49095,48222,50190,48295],
    [50343,47691,49554,47570,50190,48295],
    [49747,47104,49554,47570,50343,47691],
    [50278,47071,50343,47691,49747,47104],
    [50519,47265,50343,47691,50278,47071],
    [49956,52798,50176,53073,49956,53011],
    [50339,52932,49956,52798,50176,53073],
    [50471,52054,50339,52932,49956,52798],
    [50881,52145,50471,52054,50339,52932],
    [51076,51490,50471,52054,50881,52145],
    [51435,51538,51076,51490,50881,52145],
    [51337,51348,51076,51490,51435,51538],
    [51104,51348,51076,51490,51337,51348]]

  let relCoords = [];
  const den = 100000
  coords.forEach(i => relCoords.push([w(i[0]/den),h(i[1]/den),w(i[2]/den),h(i[3]/den),w(i[4]/den),h(i[5]/den)]))
  relCoords.forEach(i => triangle(i[0],i[1],i[2],i[3],i[4],i[5]))
  //relCoords.forEach(i => speckling_2(i[0],i[1],i[2],i[3],i[4],i[5]))
  pop()

  //ellipse(w(.51635),h(.5095),w(.00259));

}

function thirdMoth(x,y,sc) {

  push()
  translate(-width/2,-height/2)
  translate(x,y)
  scale(sc)

  let coords = [
 
    [50329,49234,50329,49839,50542,49561],
    [50018,49839,50329,49234,50329,49839],
    [49985,49201,50018,49839,50329,49234],
    [49805,49627,49985,49201,50018,49839],
    [49723,49414,49805,49627,49985,49201],
    [49625,49725,49723,49414,49805,49627],
    [49641,48874,49625,49725,49723,49414],
    [48512,49594,49641,48874,49625,49725],
    [49036,47990,48512,49594,49641,48874],
    [47775,49643,49036,47990,48512,49594],
    [48315,47515,47775,49643,49036,47990],
    [47186,49316,48315,47515,47775,49643],
    [46924,48874,48315,47515,47186,49316],
    [47677,47384,46924,48874,48315,47515],
    [46776,48301,47677,47384,46924,48874],
    [47022,47662,46776,48301,47677,47384],
    [47048,50873,47792,49839,47150,50203],
    [47442,51369,47792,49839,47048,50873],
    [47787,51497,47792,49839,47442,51369],
    [49221,50042,47792,49839,49148,49839],
    [49089,50378,47792,49839,49221,50042],
    [48294,51365,47792,49839,47787,51497],
    [48850,50866,47792,49839,48294,51365],
    [49089,50378,47792,49839,48850,50866],
    [48567,51873,48850,51901,48659,52004],
    [48659,51318,48850,51901,48567,51873],
    [49094,51369,48659,51318,48850,51901],
    [48850,50866,49094,51369,48659,51318],
    [49677,50604,48850,50866,49094,51369],
    [49089,50378,49677,50604,48850,50866],
    [49527,49897,49677,50604,49089,50378],
    [49818,49944,49677,50604,49527,49897],
    [49884,50208,49677,50604,49818,49944],
    [49480,52381,50731,52437,49800,52616],
    [50863,51845,49480,52381,50731,52437],
    [49329,51826,50863,51845,49480,52381],
    [50618,51233,49329,51826,50863,51845],
    [49451,51101,50618,51233,49329,51826],
    [49800,50669,50618,51233,49451,51101],
    [49941,50396,50618,51233,49800,50669],
    [50223,50462,50618,51233,49941,50396],
    [51276,51638,50223,50462,50618,51233],
    [50223,50067,51276,51638,50223,50462],
    [51973,51760,50223,50067,51276,51638],
    [50420,49916,51973,51760,50223,50067],
    [50656,49653,51973,51760,50420,49916],
    [52828,51506,50656,49653,51973,51760],
    [51276,49568,52828,51506,50656,49653],
    [53224,51054,51276,49568,52828,51506],
    [52151,49785,53224,51054,51276,49568],
    [52941,50396,52151,49785,53224,51054]]

  let relCoords = [];
  const den = 100000
  coords.forEach(i => relCoords.push([w(i[0]/den),h(i[1]/den),w(i[2]/den),h(i[3]/den),w(i[4]/den),h(i[5]/den)]))
  relCoords.forEach(i => triangle(i[0],i[1],i[2],i[3],i[4],i[5]))
  //relCoords.forEach(i => speckling_2(i[0],i[1],i[2],i[3],i[4],i[5]))
  pop()

}

function fourthMoth(x,y,sc) {

  push()
  translate(-width/2,-height/2)
  translate(x,y)
  scale(sc)

  let coords = [

    [47843,48318,48047,48154,47891,48154],
    [47817,49035,48047,48154,47843,48318],
    [48676,48675,47817,49035,48047,48154],
    [47886,49232,48676,48675,47817,49035],
    [48928,49413,48676,48675,49054,49304],
    [47886,49232,48928,49413,48676,48675],
    [47790,49571,48928,49413,47886,49232],
    [48676,50000,47790,49571,48928,49413],
    [47891,49890,48676,50000,47790,49571],
    [48422,50097,47891,49890,48676,50000],
    [48125,50076,47891,49890,48422,50097],
    [48151,50187,47758,50437,47976,50232],
    [47758,50649,48151,50187,47758,50437],
    [48353,50278,47758,50649,48151,50187],
    [47896,50925,48353,50278,47758,50649],
    [48639,50320,47896,50925,48353,50278],
    [48823,50488,47896,50925,48639,50320],
    [48098,51180,48823,50488,47896,50925],
    [48225,51515,48823,50488,48098,51180],
    [48283,51796,48225,51515,48220,51749],
    [48422,51744,48225,51515,48283,51796],
    [48629,51521,48225,51515,48422,51744],
    [48613,51194,48225,51515,48629,51521],
    [48823,50488,48613,51194,48225,51515],
    [48686,51124,48823,50488,48613,51194],
    [48922,50309,48686,51124,48823,50488],
    [48714,51521,48922,50309,48686,51124],
    [48813,51613,48922,50309,48714,51521],
    [48981,51655,48922,50309,48813,51613],
    [49154,51532,48922,50309,48981,51655],
    [49132,50885,49154,51532,49224,51177],
    [48922,50309,49132,50885,49154,51532],
    [49241,50752,48922,50309,49132,50885],
    [49090,50218,49241,50752,48922,50309],
    [49276,50270,49090,50218,49241,50752],
    [49104,50151,49276,50270,49090,50218],
    [49213,50137,49104,50151,49276,50270],
    [49027,50097,49213,50137,49104,50151],
    [49435,49975,49027,50097,49213,50137],
    [48939,49954,49435,49975,49027,50097],
    [49519,49757,48939,49954,49435,49975],
    [48911,49750,49519,49757,48939,49954],
    [49449,49519,48911,49750,49519,49757],
    [49054,49526,49449,49519,48911,49750],
    [49276,49462,49054,49526,49449,49519],
    [49382,51630,49677,51822,49441,51846],
    [49860,51702,49382,51630,49677,51822],
    [49413,51231,49860,51702,49382,51630],
    [50131,51104,49413,51231,49860,51702],
    [49489,50904,50131,51104,49413,51231],
    [49477,50573,50131,51104,49489,50904],
    [50471,50848,49477,50573,50131,51104],
    [49519,50166,50471,50848,49477,50573],
    [50722,50753,49519,50166,50471,50848],
    [50786,50661,49519,50166,50722,50753],
    [50718,50434,49519,50166,50786,50661],
    [50463,50230,49519,50166,50718,50434],
    [50183,50166,49519,50166,50463,50230],
    [49621,49939,50183,50166,49519,50166],
    [49741,49915,50183,50166,49621,49939],
    [51464,49843,51400,50198,51476,50097],
    [50913,50198,51464,49843,51400,50198],
    [50179,50019,51464,49843,50913,50198],
    [51532,49724,50179,50019,51464,49843],
    [49741,49748,51532,49724,50179,50019],
    [49621,49480,51532,49724,49741,49748],
    [49621,49297,51532,49724,49621,49480],
    [51942,49462,49621,49297,51532,49724],
    [52242,49195,49621,49297,51942,49462],
    [49776,49109,52242,49195,49621,49297],
    [50156,48930,52242,49195,49776,49109],
    [52242,49061,50156,48930,52242,49195],
    [51863,48950,50156,48930,52242,49061],
    [51329,48910,50156,48930,51863,48950]]

  let relCoords = [];
  const den = 100000
  coords.forEach(i => relCoords.push([w(i[0]/den),h(i[1]/den),w(i[2]/den),h(i[3]/den),w(i[4]/den),h(i[5]/den)]))
  relCoords.forEach(i => triangle(i[0],i[1],i[2],i[3],i[4],i[5]))
  //relCoords.forEach(i => speckling_2(i[0],i[1],i[2],i[3],i[4],i[5]))
  pop()

}

function chooseMoth() {
  const mothOptions = [simpleButterfly, profileMoth, thirdMoth, fourthMoth]
  //mothOptions[floor(rnd()*mothOptions.length)](x,y,sc)
  return mothOptions[floor(rnd()*mothOptions.length)]
}

class FlowButtermoth{
  constructor(_loc,_dir,_speed,_moth,_layout,_moving){
    this.loc = _loc;
    this.dir = _dir;
    this.speed = _speed;
    this.moth = _moth;
    this.layout = _layout;
    this.moving = _moving;
  	// var col;
  }
  run(fM_xoff,fM_yoff) {
    /*if (this.moving === 'true'){
      this.move();
    }*/
    //this.move();
    //this.checkEdges();
    this.update(fM_xoff,fM_yoff);
  }
  move(){
    let angle = noise(this.loc.x/fM_noiseScale, this.loc.y/fM_noiseScale, frameCount/fM_noiseScale)*360*fM_noiseStrength; //0-2PI
    this.dir.x = cos(angle);
    this.dir.y = noise(angle);
    var vel = this.dir.copy();
    var d = .5;  //direction change 
    vel.mult(this.speed*d); //vel = vel * (speed*d)
    this.loc.add(vel); //loc = loc + vel
  }
  checkEdges(){
    if (this.layout === 'vert') {
      if (this.loc.x < w(.37) || this.loc.x > w(.63) || this.loc.y < 0 || this.loc.y > h(1)) {    
        this.loc.x = rnd(w(.35),w(.65))
        this.loc.y = random(height);
      }
    }else{
      if (this.loc.x < w(0) || this.loc.x > w(1) || this.loc.y < 0 || this.loc.y > h(1)) {   
        let radius = rnd(w(.16), w(.27))
        let rt_an = rnd(TWO_PI)
        let conc_x = width/2 + radius*cos(rt_an)
        let conc_y = height/2 + radius*sin(rt_an) 
        this.loc.x = conc_x
        this.loc.y = conc_y
      }
    }
  }
  update(fM_xoff,fM_yoff){
    //let c = map(noise(fM_xoff, fM_yoff), 0, 1, .1, map(dist(this.loc.x,this.loc.y,mouseX,mouseY),0,width/2,1,2));
    let c = map(noise(fM_xoff, fM_yoff), 0, 1, .1, map(dist(this.loc.x,this.loc.y,mouseX,mouseY),0,width/2,.1,2));
    fill(c * 255, c * 231, c * 122, map(frameCount,40,70,0,130) + c * 50); // 255, 231, 122
    //noStroke();
    //translate(width/2,height/2)
    //+ map(mouseX,0,width,-w(.008),w(.008))
    //profileMoth(this.loc.x, this.loc.y, .45);
    this.moth(this.loc.x, this.loc.y, .45);
    //this.chosenMoth(this.loc.x, this.loc.y, .45)

  }
}

class FlowButtermothConc{
  constructor(_loc,_dir,_speed,_moth){
    this.loc = _loc;
    this.dir = _dir;
    this.speed = _speed;
    this.moth = _moth;
    //this.chosenMoth = _chosenMoth;
  	// var col;
  }
  run(fM_xoff,fM_yoff) {
    //this.move();
    this.checkEdges();
    this.update(fM_xoff,fM_yoff);
  }
  move(){
    let angle = noise(this.loc.x/fM_noiseScale, this.loc.y/fM_noiseScale, frameCount/fM_noiseScale)*360*fM_noiseStrength; //0-2PI
    this.dir.x = cos(angle);
    this.dir.y = sin(angle);
    var vel = this.dir.copy();
    var d = .1;  //direction change 
    vel.mult(this.speed*d); //vel = vel * (speed*d)
    this.loc.add(vel); //loc = loc + vel
  }
  checkEdges(){
    if (this.loc.x < w(0) || this.loc.x > w(1) || this.loc.y < 0 || this.loc.y > h(1)) {   
      let radius = rnd(w(.16), w(.27))
      let rt_an = rnd(TWO_PI)
      let conc_x = width/2 + radius*cos(rt_an)
      let conc_y = height/2 + radius*sin(rt_an) 
      this.loc.x = conc_x
      this.loc.y = conc_y
    }
  }
  update(fM_xoff,fM_yoff){
    let c = map(noise(fM_xoff, fM_yoff), 0, 1, .1, map(dist(this.loc.x,this.loc.y,mouseX,mouseY),0,width/2,.1,2));
    //let alpha_in = map(frameRate,0,100,0,1)
    fill(c * 255, c * 231, c * 122, map(frameCount,40,70,0,130) + c * 50); // 255, 231, 122
    //noStroke();
    //translate(width/2,height/2)
    //+ map(mouseX,0,width,-w(.008),w(.008))
    //profileMoth(this.loc.x, this.loc.y, .45);
    this.moth(this.loc.x, this.loc.y, .45);
    //this.chosenMoth(this.loc.x, this.loc.y, .45)

  }
}

function addMoth(lay) {
  push()
  if (lay === 'vert'){
    loc = createVector(rnd(w(.35),w(.65)), rnd(height), w(.2));
  }
  if (lay === 'conc'){
    let radius = rnd(w(.16), w(.27))
    let rt_an = map(i,0,buttermoths_num,0,TWO_PI)
    let conc_x = width/2 + radius*cos(rt_an)
    let conc_y = height/2 + radius*sin(rt_an)
    loc = createVector(conc_x, conc_y, w(.2));
  }

  let angle = 0; //any value to initialize
  let dir = createVector(cos(angle), sin(angle));
  let speed = -random(.1,.5);
  let moth = chooseMoth()

  let newMoth = new FlowButtermoth(loc, dir, speed, moth, lay, moving);
  for (let i = 0; i < buttermoths.length; i++) {
    let other = buttermoths[i];
    let d = dist(newMoth.loc.x,newMoth.loc.y,other.loc.x,other.loc.y)
    if ( d < w(.03)) {
      newMoth = undefined;
      break;
    }else{
      buttermoths.push(newMoth)
    }
  }
  pop()
}