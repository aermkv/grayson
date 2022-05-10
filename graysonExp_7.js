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


function setup() {
  noiseSeed(seed)
  const smD = windowWidth < windowHeight ? windowWidth : windowHeight;
  createCanvas(smD, smD);
  graphics = createGraphics(smD,smD);

  cols = 64;
	rows = cols;
  scl = width/cols

  background(15,35,60)

  draw_tS()
  circularTexture()
}



function draw() {
  translate(width/2,height/2)

  water()

  breathingCircles()

  imageMode(CENTER)
  image(graphics, 0, 0)

  //background(0,0)

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
    let ts_y1 = h(0)
    let ts_y2 = h(1)
    tS_original(ts_x, ts_y1, ts_x, ts_y2, w(.2), 10*c, 10*c, 10*c, 45*ALPHA_COEFF)
    tS_original(ts_x, ts_y1, ts_x, ts_y2, w(.2), 25*c, 91*c, 214*c, 55*ALPHA_COEFF)
  }
  graphics.noLoop();
  pop()
}

function water() {
  push()
  translate(-width/2,-height/2)
  //translate(scl/2,scl/2)
  flying += 0.03;
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
  noFill()
  let angle = frameCount/60;
  let num_circs = 10
  let xoff = 0
  for (let i = 0; i < num_circs; i++) {
    //let c = map(mouseX,0,width,0,2);
    let size = map(i,0,num_circs,w(.01),w(.7))
    stroke(map(size,0,w(1.5),130,240),125)
    strokeWeight(map(sin(angle + 180*i),-1,1,w(.03),w(.06)))
    noisyCircle(size)
    xoff += .01
  }
  pop()
}

function texturedCircle(size,inc,diff) {
  //let zoff = 0
  //graphics.translate(graphics.width/2,0)
  graphics.beginShape()
  for (let angle = 0; angle <= TWO_PI; angle += inc) {
    let xoff = map(cos(angle+diff), -1, 1, 0, 1)
    let yoff = map(sin(angle-diff), -1, 1, 0, 1)
    let r = map(noise(xoff, yoff), 0, 1, size, size-rnd(w(.01),w(.03)))
    let x = r * cos(angle+30)
    let y = r * sin(angle+30)
    graphics.vertex(x,y)
  }
  graphics.endShape(CLOSE)
  //zoff += 2*inc;
}

function circularTexture() {
  push()
  graphics.blendMode(graphics.OVERLAY)
  graphics.noFill()
  graphics.translate(0,graphics.height/2)
  //let angle = random(TWO_PI);
  let num_circs = 90
  let xoff = 0
  for (let i = 0; i < num_circs; i++) {
    translate(rnd(w(.01),rnd(h(.01))))
    //let c = map(mouseX,0,width,0,2);
    let size = map(i,0,num_circs,w(.01),w(1.5))
    let inc = .003
    let c = map(size,0,w(1.5),0,2)
    let alpha_coeff = map(size,0,w(1.5),.1,1)
    graphics.stroke(235 * c, 154 * c, 54 * c, 65 * alpha_coeff)
    graphics.strokeWeight(w(.002))
    //graphics.ellipse(0,0,size)
    texturedCircle(size,inc,0)
    texturedCircle(size,inc*15,30)
    texturedCircle(size,inc*25,60)
    graphics.stroke(235 * c, 154 * c, 54 * c, 65 * alpha_coeff)
    texturedCircle(size,inc*15,90)
    texturedCircle(size,inc*25,120)
    graphics.stroke(235 * c, 154 * c, 54 * c, 25 * alpha_coeff)
    texturedCircle(size,inc*15,270)
    texturedCircle(size,inc*25,300)
    xoff += .01
  }
  pop()
}