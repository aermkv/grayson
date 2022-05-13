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

let r;
let xoff = 0, x, y

let play = true;

// WATER PARTS

let cols, rows;
let scl;
let flying = 0;
let inc;

//////////////////////////////////////

function setup() {
  noiseSeed(seed)
  const smD = windowWidth < windowHeight ? windowWidth : windowHeight;
  createCanvas(smD, smD);
  graphics = createGraphics(smD,smD);
  spirals = createGraphics(smD,smD);
  circTexture = createGraphics(smD,smD);

  cols = 80;
	rows = cols;
  scl = width/cols

  noStroke()
  fill(15,15,40)
  rect(0,0,width,height)

  //graphics.translate(graphics.width/2,graphics.height/2)
  randomDaubs(800,182, 209, 222)
  randomDaubs(1000,235,154,42)
  inwardDaubs(220, 224, 224, 245)

}

function draw() {

  noStroke()
  fill(15,15,40,0)
  rect(0,0,width,height)

  water()

  imageMode(CORNER)
  image(graphics, 0, 0)

  drawCirc(w(.15), 249, 155, 30, 15, 0, 300)
  drawCirc(w(.25), 67, 17, 27, 25, 120, 325)
  drawCirc(w(.35), 5, 18, 50, 25, 240, 350)
  drawCirc(w(.45), 5, 13, 22, 25, -120, 375)
  texturedCircle(200)

  //imageMode(CENTER)
  image(spirals, 0, 0)
  image(circTexture, 0, 0)

  if (play === false){
    noLoop()
  }else{
    loop()
  }
  //console.log(frameRate())

}

//////////////////////////////////////

function mousePressed() {
  if (play === true) {
    play = false;
  } else { // implies play === false
    play = true;
  }
}

//////////////////////////////////////

function drawCirc(radius, r, g, b, a, t_offset, limit) {
  //strokeWeight(3)
  //noFill()
  spirals.noStroke()
  //radius = w(.35)
  let t = frameCount / 30
  x = width/2 + radius * cos(t+t_offset) + map(noise(xoff),0,1,-radius*noise(xoff)/3,radius*noise(xoff)/2)
  y = height/2 + radius * sin(t+t_offset) + map(noise(xoff),0,1,-radius*noise(xoff)/3,radius*noise(xoff)/2)
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
    xoff += 0.005
  }
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

function texturedCircle_2(limit) {
  if (frameCount < limit) {
    let radius = w(.25)
    let t = frameCount / 20
    let x1 = width/2 + radius*cos(t)*noise(t/7)
    let y1 = height/2 + radius*sin(t)*noise(t/7)
    let x2 = width/2 + radius*cos(t-.1)*noise(t/7)
    let y2 = height/2 + radius*sin(t-.1)*noise(t/7)
    //points.push(point)
    circTexture.stroke(24,34,64,220)
    circTexture.strokeWeight(w(.001))
    if (frameCount > 1 && frameCount < limit) {
      circTexture.line(x1,y1,x2,y2)
      //spirals.line(pt.x,pt.y,old_pt.x,old_pt.y)
    }
    //xoff += inc
  }
}

function texturedCircle(limit) {
  let points = [];
  let radius = w(.25);
  let t = frameCount / 20;
  if (frameCount < limit) {
    let i = 0;
    if (frameCount % 20 === 0) {
      let x = width/2 + radius*cos(t)*noise(t/7);
      let y = width/2 + radius*sin(t)*noise(t/7);
      i++
      let point = circTexture.createVector(x,y)
      points.push(point)
    }
    if (i >= 2) {
      let pt = points[i];
      let pt_prev = points[i-1];
      circTexture.stroke(24,34,64,220)
      circTexture.strokeWeight(w(.001))
      circTexture.line(pt.x,pt.y,pt_prev.x,pt_prev.y);
    }
  }
}

function randomDaubs(num, r, g, b) {
  push()
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
  pop()
}

function water() {
  push()
  //translate(-width/2,-height/2)
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