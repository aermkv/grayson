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

let play = true

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

let buttermoths_num = 75;
let fM_noiseScale = 200, fM_noiseStrength=1;
let buttermoths = [buttermoths_num];

//////////////////////////////////////


function setup() {
  noiseSeed(seed)
  const smD = windowWidth < windowHeight ? windowWidth : windowHeight;
  createCanvas(smD, smD);
  graphics = createGraphics(smD,smD);
  spirals = createGraphics(smD,smD);

  cols = 80;
	rows = cols;
  scl = width/cols

  //background(15,35,60)

  // BUTTERMOTHS
  /*push()
  for (let i = 0; i < buttermoths_num; i++) {
    //x value start slightly outside the right of canvas, z value how close to viewer
    let loc = createVector(rnd(w(.35),w(.65)), rnd(height), w(.2));
    let angle = 0; //any value to initialize
    let dir = createVector(cos(angle), sin(angle));
    let speed = -random(.1,.5);
    //let speed = random(5,map(mouseX,0,width,5,20));   // faster
    let chosenMoth = chooseMoth()
    buttermoths[i] = new FlowButtermoth(loc, dir, speed, chosenMoth);
  }
  pop()*/

  push()
  for (let i = 0; i < buttermoths_num; i++) {
    //x value start slightly outside the right of canvas, z value how close to viewer
    let radius = rnd(w(.15), w(.32))
    let rt_an = map(i,0,buttermoths_num,0,TWO_PI)
    let conc_x = width/2 + radius*cos(rt_an)
    let conc_y = height/2 + radius*sin(rt_an)
    let loc = createVector(conc_x, conc_y, w(.2));
    let angle = 0; //any value to initialize
    let dir = createVector(cos(angle), sin(angle));
    let speed = -random(.1,.5);
    //let speed = random(5,map(mouseX,0,width,5,20));   // faster
    //let chosenMoth = chooseMoth()
    let moth = chooseMoth()
    buttermoths[i] = new FlowButtermothConc(loc, dir, speed, moth);
  }
  pop()



  //inwardDaubs(220, 224, 224, 245)
  randomDaubs(800,182, 209, 222)
  randomDaubs(1000,235,154,42)
  draw_tS()
  //draw_tS_horiz()
  //drawButtermoths()
}



function draw() {
  translate(width/2,height/2)

  water()

  //breathingCircles()

  imageMode(CENTER)
  image(graphics, 0, 0)
  image(spirals, 0, 0)

  //circularTexture()
  //circularTexture()
  circularTexture2()
  //roughTexture()

  //circTex()

  //spiral()
  drawSpirals() 

  //background(0,0)

  push()
  let fM_xoff = 0;
  let fM_yoff = 1000;
  let fM_inc = .1;
  fill(15,35,60, 25);
  noStroke();
  //rect(-width/2, -height/2, width, height);
  translate(-w(.2),-h(.2))
  for (let i = 0; i < buttermoths.length; i++) {
    buttermoths[i].run(fM_xoff,fM_yoff);
    fM_xoff += fM_inc;
    fM_yoff += fM_inc;
  }
  pop()

  //drawBird()

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



// STATIC FUNCTIONS

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

function tS_bezier(x1, y1, x2, y2, x3, y3, x4, y4, weight, r, g, b, alpha) {
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
    let nx3 = x3 + 0.5*rnd(weight/2)*graphics.cos(theta);
    let ny3 = y3 + 0.5*rnd(weight/2)*graphics.sin(theta);
    let nx4 = x4 + 0.5*rnd(weight/2)*graphics.cos(theta);
    let ny4 = y4 + 0.5*rnd(weight/2)*graphics.sin(theta);
    graphics.bezier(nx1, ny1, nx2, ny2, nx3, ny3, nx4, ny4)
  }
  pop()
  graphics.noLoop();
}

function draw_tS() {
  push()
  graphics.blendMode(graphics.BLEND)
  graphics.translate(graphics.width/2,0)
  /*for (let i = 0; i < 90; i++){
    let ts_x = map(i,0,90,-graphics.width*.5,graphics.width*.5)
    let c = map(dist(ts_x,0,0,0),0,graphics.width/2,0,.8)
    let ts_y1 = h(0)
    let ts_y2 = h(1)
    tS_original(ts_x, ts_y1, ts_x, ts_y2, w(.09), 90 * c, 90 * c, 90 * c, 25)
    tS_original(ts_x, ts_y1, ts_x, ts_y2, w(.09), 25 * c, 91 * c, 214 * c, 30)
  }*/
  for (let i = 0; i < 250; i++){
    let ts_x = map(i,0,250,-graphics.width/2,graphics.width/2)
    let c = map(dist(ts_x,0,0,0),0,graphics.width/2,0,.5)
    let ALPHA_COEFF = map(dist(ts_x,0,0,0),0,graphics.width/2,0.25,1)
    let ts_y1 = -h(0.1)
    let ts_y2 = h(1.1)
    tS_original(ts_x, ts_y1, ts_x, ts_y2, w(.35), 10*c, 10*c, 10*c, 10*ALPHA_COEFF)
    tS_original(ts_x, ts_y1, ts_x, ts_y2, w(.35), 25*c, 91*c, 214*c, 10*ALPHA_COEFF)
  }
  graphics.noLoop();
  pop()
}

function draw_tS_bezier() {
  push()
  graphics.blendMode(graphics.BLEND)
  graphics.translate(graphics.width/2,0)
  function w(val) {if (val == null) return graphics.width;return graphics.width * val;}
  function h(val) {if (val == null) return graphics.height;return graphics.height * val;}
  /*for (let i = 0; i < 90; i++){
    let ts_x = map(i,0,90,-graphics.width*.5,graphics.width*.5)
    let c = map(dist(ts_x,0,0,0),0,graphics.width/2,0,.8)
    let ts_y1 = h(0)
    let ts_y2 = h(1)
    tS_original(ts_x, ts_y1, ts_x, ts_y2, w(.09), 90 * c, 90 * c, 90 * c, 25)
    tS_original(ts_x, ts_y1, ts_x, ts_y2, w(.09), 25 * c, 91 * c, 214 * c, 30)
  }*/
  for (let i = 0; i < 350; i++){
    let ts_x = map(i,0,350,-graphics.width/2,graphics.width/2)
    let ts_x2 = ts_x + map(ts_x,-graphics.width/2,graphics.width/2,-w(.1),w(.1)) + rnd(-w(.15),w(.15))
    let ts_x3 = ts_x + map(ts_x,-graphics.width/2,graphics.width/2,-w(.1),w(.1)) + rnd(-w(.15),w(.15))
    let ts_y2 = rnd(h(.2),h(.4))
    let ts_y3 = rnd(h(.6),h(.8))
    let c = map(dist(ts_x,0,0,0),0,graphics.width/2,0,.5)
    let ALPHA_COEFF = map(dist(ts_x,0,0,0),0,graphics.width/2,0.25,1)
    let ts_y1 = -h(.1)
    let ts_y4 = h(1.1)
    tS_bezier(ts_x, ts_y1, ts_x2, ts_y2, ts_x3, ts_y3, ts_x, ts_y4, w(.2), 10*c, 10*c, 10*c, 35*ALPHA_COEFF)
    tS_bezier(ts_x, ts_y1, ts_x2, ts_y2, ts_x3, ts_y3, ts_x, ts_y4, w(.2), 25*c, 91*c, 214*c, 35*ALPHA_COEFF)
  }
  graphics.noLoop();
  pop()
}

function draw_tS_horiz() {
  push()
  graphics.blendMode(graphics.BLEND)
  //graphics.translate(graphics.width/2,0)
  /*for (let i = 0; i < 90; i++){
    let ts_x = map(i,0,90,-graphics.width*.5,graphics.width*.5)
    let c = map(dist(ts_x,0,0,0),0,graphics.width/2,0,.8)
    let ts_y1 = h(0)
    let ts_y2 = h(1)
    tS_original(ts_x, ts_y1, ts_x, ts_y2, w(.09), 90 * c, 90 * c, 90 * c, 25)
    tS_original(ts_x, ts_y1, ts_x, ts_y2, w(.09), 25 * c, 91 * c, 214 * c, 30)
  }*/
  for (let i = 0; i < 250; i++){
    let ts_y = map(i,0,250,-graphics.height,graphics.height)
    //let c = map(dist(ts_x,0,0,0),0,graphics.width/2,0,.5)
    //let ALPHA_COEFF = map(dist(ts_x,0,0,0),0,graphics.width/2,0.25,1)
    let ts_x1 = -w(.5)
    let ts_x2 = w(.5)
    tS_original(ts_x1, ts_y, ts_x2, ts_y, w(.3), 33, 33, 33, 10)
    tS_original(ts_x1, ts_y, ts_x2, ts_y, w(.3), 25, 91, 124, 13)
  }
  graphics.noLoop();
  pop()
}

function water() {
  push()
  translate(-width/2,-height/2)
  //translate(scl/2,scl/2)
  flying += 0.05;
  //rectMode(CENTER)
  fill(3,3,15)
  //translate(width/scl/3,height/scl/3)
  //rect(width/2,height/2,width,height)

  let yoff = flying;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      //let c = map(noise(xoff, yoff), 0, 1, -1, map(mouseY,0,width,0,2));
      let xPos = x * scl;
      let yPos = y * scl;
      // IF USING THIS VERSION OF c - use general brightness as potential attribute
      let c = map(noise(xoff, yoff), 0, 1, -1, map(mouseY,0,width,.1,1.5)) + map(dist(xPos,yPos,mouseX,mouseY),0,w(1),1.3,.01)
      //let alphaDist = map(dist(xPos,yPos,width/2,height/2),0,w(.5),0,90)
      fill(c * 163, c * 157, c * 135, c * 90); // 25, 91, 214
      noStroke();
      xoff += 0.6;
      var angle = atan2(width/2,height/2);
      //rotate(angle)
      rect(xPos, yPos, scl, scl);
      //ellipse(xPos,yPos,scl/2)
      /*push()
      translate(xPos,yPos-width/2)
      rotate(angle)
      paintDaub()
      pop()*/
    }
    yoff += 0.6;
  }
  pop()
}

function noisyCircle(size) {
  let inc = .1
  let zoff = 0
  noFill()
  beginShape()
  for (let angle = 0; angle <= TWO_PI; angle += inc) {
    let xoff = map(cos(angle), -1, 1, 0, 1)
    let yoff = map(sin(angle), -1, 1, 0, 1)
    let r = map(noise(xoff, yoff, zoff), 0, 1, size, size*1.3)
    let x = r * cos(angle)
    let y = r*sin(angle)
    vertex(x,y)
  }
  endShape(CLOSE)
  zoff += .01;
}

function breathingCircles() {
  push()
  blendMode(SCREEN)
  //noFill()
  let angle = frameCount/60;
  let num_circs = 10
  let xoff = 0
  for (let i = 0; i < num_circs; i++) {
    //let c = map(mouseX,0,width,0,2);
    let size = map(i,0,num_circs,w(.01),w(.7))
    let c1 = color(253,244,236,90)
    let c2 = color(112,85,69,60)
    let inter = map(i,0,num_circs-3,1,0)
    col = lerpColor(c1,c2,inter)
    //stroke(map(i,0,num_circs,253,112),map(i,0,num_circs,244,85),map(i,0,num_circs,236,69),map(i,0,num_circs,90,60))
    stroke(200,100,125,60)
    strokeWeight(map(sin(angle + 180*i),-1,1,w(.03),w(.06)))
    noisyCircle(size)
    xoff += .01
   //console.log(col)
  }
  pop()
}

function texC(init_distort,size,inc,diff,max_distort) {
  let xoff = 0
  //graphics.translate(graphics.width/2,0)
  let t = frameCount / 50
  let r = size
  if (frameCount < 360){
    beginShape()
    for (let i = 0; i <= 360; i++) {
      let x = init_distort + r * cos(t+diff*i)
      let y = height/2 + init_distort + r * sin(t+diff*i)
      vertex(x + max_distort,y + max_distort)
    }
    endShape(CLOSE)
    xoff += inc/5;
  }
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

function circularTexture() {
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
    let size = map(i,0,num_circs,w(.01),w(.8))
    let inc = .003
    let c = map(size,0,w(1.5),0,2)
    let alpha_coeff = map(size,0,w(.35),.1,.5)
    graphics.stroke(35 * c, 45 * c, 80 * c, 65 * map(frameCount,50,180,0,1) * alpha_coeff) //109, 158, 163
    //graphics.strokeWeight(w(.001))
    graphics.strokeWeight(map(i,0,num_circs,w(.0002),w(.0007)))
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
    translate(rnd(w(.01),rnd(h(.01))))
    //let c = map(mouseX,0,width,0,2);
    let size = map(i,0,num_circs,w(.01),w(.8))
    let inc = .003
    let c = map(size,0,w(1.5),0,2)
    let alpha_coeff = map(size,0,w(.35),.05,.5)
    graphics.stroke(35 * c, 45 * c, 80 * c, 65 * map(frameCount,60,120,0,1) * alpha_coeff) //109, 158, 163
    graphics.rotate(map(frameCount,0,15,1,0)) // WHAT MAKES IT 'ROUGH'
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

function circularTexture2() {
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
    let c = map(size,0,w(1.5),0,2)
    let alpha_coeff = map(size,0,w(.15),.1,.3)
    graphics.stroke(20 * c, 20 * c, 35 * c, 85 * alpha_coeff)
    graphics.strokeWeight(w(.0005))
    //graphics.strokeWeight(map(i,0,num_circs,w(.0005),w(.002)))
    //graphics.ellipse(0,0,size)
    texturedCircle(i_d,size,inc,0,w(.06))
    texturedCircle(i_d,size,inc*15,30,w(.06))
    texturedCircle(i_d,size,inc*25,60,w(.06))
    graphics.stroke(25 * c, 25 * c, 35 * c, 65 * alpha_coeff)
    texturedCircle(i_d,size,inc*15,90,w(.06))
    texturedCircle(i_d,size,inc*25,120,w(.06))
    graphics.stroke(25 * c, 25 * c, 35 * c, 25 * alpha_coeff)
    texturedCircle(i_d,size,inc*15,270,w(.06))
    texturedCircle(i_d,size,inc*25,300,w(.06))
    xoff += .01
  }
  pop()
}

function blurredEllipse(x,y,size,r,g,b,a) {
  let o = rnd(-size,size)
  graphics.fill(r,g,b,.15*a)
  graphics.ellipse(x+o,y+o,1.2*size)
  graphics.fill(r,g,b,.25*a)
  graphics.ellipse(x+o,y+o,1.1*size)
  graphics.fill(r,g,b,.5*a)
  graphics.ellipse(x+o,y+o,size)
  graphics.fill(r,g,b,.75*a)
  graphics.ellipse(x+o,y+o,.9*size)
  graphics.fill(r,g,b,a)
  graphics.ellipse(x,y,.8*size)
}

function paintDaub(x,y,size,r,g,b,a) {
  for (let i = 0; i < 6; i++) {
    graphics.fill(r,g,b,.2*i*a)
    graphics.ellipse(x*(1-0.0001*i),y*(1-0.05*i),(1.8-i*.2)*size)
  }
}

function randomDaubs(num, r, g, b) {
  let num_daubs = num
  for (let i = 0; i < num_daubs; i++) {
    let angle = map(i,0,num_daubs,0,TWO_PI)
    //let xoff = map(cos(angle), -1, 1, 0, 1)
    //let yoff = map(sin(angle), -1, 1, 0, 1)
    let rad = rnd(w(.75)) - rnd(.58)
    let x = width/2 + rad*cos(angle)
    let y = height/2 + rad*sin(angle)
    graphics.noStroke()
    let coeff = map(dist(x,y,width/2,height/2),0,w(.6),1,.1)
    let alpha_coeff = map(dist(x,y,width/2,height/2),0,w(.6),.3,1)
    //graphics.fill(235*coeff,154*coeff,42*coeff,90*alpha_coeff)
    let col = [r*coeff,g*coeff,b*coeff]
    //graphics.ellipse(x,y,rnd(w(.015),w(.035)))
    blurredEllipse(x,y,rnd(w(.015),w(.035)),col[0],col[1],col[2],90*alpha_coeff)
  }
}

function inwardDaubs(num, r, g, b) {
  let num_daubs = num
  for (let i = 0; i < num_daubs; i++) {
    let angle = map(i,0,num_daubs,0,TWO_PI)
    //let xoff = map(cos(angle), -1, 1, 0, 1)
    //let yoff = map(sin(angle), -1, 1, 0, 1)
    let rad = w(.8) - rnd(w(.78)) + rnd(.75)
    let x = width/2 + rad*cos(angle)
    let y = height/2 + rad*sin(angle)
    graphics.noStroke()
    let coeff = map(dist(x,y,graphics.width/2,graphics.height/2),0,w(.6),1,.1)
    let alpha_coeff = map(dist(x,y,graphics.width/2,graphics.height/2),0,w(.8),1,.5)
    //graphics.fill(235*coeff,154*coeff,42*coeff,90*alpha_coeff)
    let col = [r*coeff,g*coeff,b*coeff]
    //graphics.ellipse(x,y,rnd(w(.015),w(.035)))
    paintDaub(x,y,rnd(w(.025),w(.035)),col[0],col[1],col[2],90*alpha_coeff)
  }
}

function spiral() {
  push()
  translate(-width/2,-height/2)
  let x = offset + cos(sp_angle) * scalar;
  let y = offset + sin(sp_angle) * scalar;
  fill(255);
  noStroke();
  ellipse(x,y,w(.05));
  sp_angle += speed;
  scalar += speed;
  pop()
}

function simpleButterfly(x,y,sc) {
  push()
  translate(-width/2,-height/2)
  translate(x,y)
  scale(sc)
  //translate(-width/2,-width/2)
  //rotateZ(frameCount)
  //translate(width,height)
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

  ellipse(w(.51635),h(.5095),w(.00259));

}

function chooseMoth() {
  const mothOptions = [simpleButterfly, profileMoth]
  //mothOptions[floor(rnd()*mothOptions.length)](x,y,sc)
  return mothOptions[floor(rnd()*mothOptions.length)]
}

class FlowButtermoth{
  constructor(_loc,_dir,_speed,_chosenMoth){
    this.loc = _loc;
    this.dir = _dir;
    this.speed = _speed;
    this.chosenMoth = _chosenMoth;
  	// var col;
  }
  run(fM_xoff,fM_yoff) {
    this.move();
    this.checkEdges();
    this.update(fM_xoff,fM_yoff);
  }
  move(){
    let angle = noise(this.loc.x/fM_noiseScale, this.loc.y/fM_noiseScale, frameCount/fM_noiseScale)*360*fM_noiseStrength; //0-2PI
    this.dir.x = cos(angle);
    this.dir.y = noise(angle)*3;
    var vel = this.dir.copy();
    var d = .5;  //direction change 
    vel.mult(this.speed*d); //vel = vel * (speed*d)
    this.loc.add(vel); //loc = loc + vel
  }
  checkEdges(){
    if (this.loc.x < w(.37) || this.loc.x > w(.63) || this.loc.y < 0 || this.loc.y > h(1)) {    
      this.loc.x = rnd(w(.35),w(.65))
      this.loc.y = random(h(1.1),h(.9));
    }
  }
  update(fM_xoff,fM_yoff){
    let c = map(noise(fM_xoff, fM_yoff), 0, 1, .1, map(dist(this.loc.x,this.loc.y,mouseX,mouseY),0,width/2,1,2));
    fill(c * 255, c * 231, c * 122, c * 130); // 255, 231, 122
    //noStroke();
    //translate(width/2,height/2)
    //+ map(mouseX,0,width,-w(.008),w(.008))
    //profileMoth(this.loc.x, this.loc.y, .45);
    simpleButterfly(this.loc.x, this.loc.y, .45);
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
    this.dir.y = noise(angle);
    var vel = this.dir.copy();
    var d = .5;  //direction change 
    vel.mult(this.speed*d); //vel = vel * (speed*d)
    this.loc.add(vel); //loc = loc + vel
  }
  checkEdges(){
    if (this.loc.x < w(0) || this.loc.x > w(1) || this.loc.y < 0 || this.loc.y > h(1)) {   
      let radius = rnd(w(.15), w(.32))
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

function wholeBird(r) {
  //rotateZ(r)
  translate(-width/2,-height/2, w(.05))
  scale(1.5)
  let coords = [
    [45941,44303,46087,45992,46470,43765],
    [45202,45759,45941,44303,46087,45992],
    [48471,49965,48660,50485,49455,49928],
    [47077,49043,48660,50485,48471,49965],
    [48362,50955,47077,49043,48660,50485],
    [47580,51384,47077,49043,48362,50955],
    [46842,52519,47077,49043,47580,51384],
    [45202,45759,47077,49043,46087,45992],
    [44035,43272,44923,43392,44923,41583],
    [44013,44624,44923,43392,44035,43272],
    [45202,45759,44013,44624,44923,43392],
    [42850,40273,44013,44624,43092,40148],
    [42478,42824,44013,44624,42850,40273],
    [42568,44442,44013,44624,42478,42824],
    [43392,46573,44013,44624,42568,44442],
    [45202,45759,43392,46573,44013,44624],
    [43296,46883,45202,45759,43392,46573],
    [47077,49043,43296,46883,45202,45759],
    [46842,52519,43296,46883,47077,49043],
    [40281,40815,42018,43312,40409,40535],
    [40489,42480,42018,43312,40281,40815],
    [40281,43120,42018,43312,40489,42480],
    [40746,45105,42018,43312,40281,43120],
    [42517,47318,42018,43312,40746,45105],
    [43296,46883,42517,47318,42018,43312],
    [39649,45521,42517,47318,39521,44729],
    [40618,47554,42517,47318,39649,45521],
    [43339,49067,42517,47318,40618,47554],
    [40472,48808,43339,49067,40420,48317],
    [41272,50202,43339,49067,40472,48808],
    [42409,50917,43339,49067,41272,50202],
    [43296,46883,43339,49067,42517,47318],
    [46842,52519,43339,49067,43296,46883],
    [45416,53267,43339,49067,46842,52519],
    [44418,53267,43339,49067,45416,53267],
    [42478,51913,43339,49067,44418,53267],
    [42409,50917,42478,51913,43339,49067],
    [48277,59038,48829,59226,48600,59409],
    [48600,55844,48277,59038,48829,59226],
    [45701,58983,48277,59038,48600,55844],
    [44044,58428,45701,58983,48600,55844],
    [43180,58027,44044,58428,43702,58761],
    [46299,55312,44044,58428,43180,58027],
    [44057,58927,45701,58983,44044,58428],
    [45179,59471,44057,58927,45701,58983],
    [45792,59490,45701,58983,48277,59038],
    [48200,59649,48277,59038,45792,59490],
    [48600,55844,46299,55312,44044,58428],
    [46519,54808,48600,55844,46299,55312],
    [49455,54673,46519,54808,48600,55844],
    [46700,52930,49455,54673,46519,54808],
    [50000,53030,46700,52930,49455,54673],
    [47692,51572,50000,53030,46700,52930],
    [48471,51142,50000,53030,47692,51572],
    [51667,51178,48471,51142,50000,53030],
    [48774,50573,51667,51178,48471,51142],
    [52025,50392,51667,51178,52438,51066],
    [50220,49475,51667,51178,48774,50573],
    [52025,50392,50220,49475,51667,51178],
    [52321,50203,50220,49475,52025,50392],
    [50442,48979,52321,50203,50220,49475],
    [52505,49646,50442,48979,52321,50203],
    [52779,48960,52505,49646,53815,49318],
    [52092,48896,52505,49646,52779,48960],
    [50973,48722,52092,48896,51698,48722],
    [50442,48979,52092,48896,52505,49646],
    [50973,48722,50442,48979,52092,48896],
    [49455,55233,51602,55192,49690,55662],
    [50058,53390,51602,55192,49455,55233],
    [52932,54431,50058,53390,51602,55192],
    [50651,52543,52932,54431,50058,53390],
    [54987,52400,50651,52543,52932,54431],
    [51446,51918,54987,52400,50651,52543],
    [51689,51459,54987,52400,51446,51918],
    [55764,52206,51689,51459,54987,52400],
    [53663,51500,51689,51459,52952,51224],
    [55661,51213,55764,52206,53663,51500],
    [51689,51459,55764,52206,53663,51500],
    [57135,51265,55661,51213,55764,52206],
    [57357,50142,57135,51265,55661,51213],
    [59937,50109,57357,50142,57135,51265],
    [60142,49553,59937,50109,57357,50142],
    [60785,49240,60142,49553,59937,50109]]

  let relCoords = [];
  const den = 100000
  coords.forEach(i => relCoords.push([w(i[0]/den),h(i[1]/den),w(i[2]/den),h(i[3]/den),w(i[4]/den),h(i[5]/den)]))
  relCoords.forEach(i => triangle(i[0],i[1],i[2],i[3],i[4],i[5]))
  // create speckle texture function and apply to coords[i] as above
  //relCoords.forEach(i => speckling_2(i[0],i[1],i[2],i[3],i[4],i[5]))
}

function drawBird() {
  //translate(width/2,height/2)
  //let c = map(noise(frameCount/90), 0, 1, .1, map(dist(width/2,height/2,mouseX,mouseY),0,width/2,1,2));
  let c = map(dist(width/2,height/2,mouseX,mouseY),0,width/2,1.5,.5)
  fill(c * 255, c * 231, c * 122, 255); // 255, 231, 122
  noStroke(c * 255, c * 231, c * 122, 255)
  strokeWeight(w(.003))
  strokeCap(ROUND)
  translate(-width/4,-height/4)
  wholeBird(0)
  //newBird()
}

function drawCirc(radius, r, g, b, a, t_offset, limit) {
  //strokeWeight(3)
  //noFill()
  spirals.noStroke()
  let xoff = 0
  //radius = w(.35)
  //let t = frameCount / 20
  //let t = map(frameCount,0,limit*2,frameCount/30,frameCount/120) // ROSE
  let t = frameCount - map(frameCount,0,limit,0,frameCount/2) // RANDOM
  //let t = frameCount - map(frameCount,0,limit,0,sqrt(frameCount)) // SPIRAL
  let max_t = 
  x = width/2 + radius * cos(t+t_offset) + map(noise(xoff),0,1,-radius*noise(xoff)/2,radius*noise(xoff)/2)
  y = height/2 + radius * sin(t+t_offset) + map(noise(xoff),0,1,-radius*noise(xoff)/2,radius*noise(xoff)/2)
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
}

function drawSpirals() {
  num_circs = 35
  for (let i = 0; i < num_circs; i++) {
    drawCirc(w(.01)+i*w(.02), map(i,0,num_circs,223,9), map(i,0,num_circs,123,9), map(i,0,num_circs,86,24), 1 + 2*i, i*60, 50 + 15*i)
  }
}

