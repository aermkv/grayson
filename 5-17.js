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





//////////////////////////////////////






const palettes = {
  'gray': {
    light: [204, 204, 204],
    dark: [67, 71, 74],
    accent_light: [195, 207, 217],
    accent_dark: [14, 22, 28]
  },
  'orange': {
    light: [247, 101, 27],
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

// FLOATING BUTTERFLIES PARTS

let buttermoths_num = 50;
let fM_noiseScale = 200, fM_noiseStrength=1;
let buttermoths = [];






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

  cols = 50;
  rows = cols;
  scl = width/cols;

  background(200)

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
    let gold = [255,231,122]
    let platinum = [227, 222, 197]
    let metals = [gold,platinum]
    let met = metals[floor(rnd()*metals.length)]
    let angle = 0; //any value to initialize
    let dir = createVector(cos(angle), sin(angle));
    let speed = -random(.1,.5);
    //let speed = random(5,map(mouseX,0,width,5,20));   // faster
    let moth = chooseMoth()
    //buttermoths[i] = new FlowButtermothConc(loc, dir, speed, moth, lay, moving);
    buttermoths.push(new FlowButtermoth(loc, dir, speed, moth, lay, moving, met));
  }
  pop()

  // STATIC DRAWING

  draw_tS()
  randomDaubs(1200, pal.accent_light[0], pal.accent_light[1], pal.accent_light[2], -w(.35), lay)
  randomDaubs(1200, pal.light[0], pal.light[1], pal.light[2], -w(.2), lay)
  randomDaubs(1200, pal.accent_dark[0], pal.accent_dark[1], pal.accent_dark[2], w(.35), lay)
  randomDaubs(1200, pal.accent_light[0], pal.accent_light[1], pal.accent_light[2], w(.5), lay)
  randomDaubs(1200, pal.light[0], pal.light[1], pal.light[2], w(.56), lay)

}


function draw() {
  translate(width/2,height/2)

  water()

  if (frameCount > 250) {
    verticalTexture(lay,.17,pal.accent_dark) 
  }

  //verticalTexture(lay,.001,pal.accent_light) 
  //verticalTexture(lay,.002,pal.light) 
  //vanish_P(lay,.001,pal.accent_light) 

  drawSpirals_Vert(lay)
  //drawSpirals_VertOut(lay) 

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
      let sep = dist(thisMoth.loc.x,thisMoth.loc.y,other.loc.x,other.loc.y)
      if (sep > w(.015)) {
        buttermoths[i].run(fM_xoff,fM_yoff);
        fM_xoff += fM_inc;
        fM_yoff += fM_inc;
      }
    }*/
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


//////////////////// TEXTURES /////////////////

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
      fill(c * pal.light[0], c * pal.light[1], c * pal.light[2], c * 180); // 25, 91, 214
      noStroke();
      xoff += 0.6;
      //var angle = atan2(width/2,height/2);
      var mult = map(sin(x*y*30),-1,1,1,1.5)
      //rect(xPos, yPos, scl, scl);
      ellipse(xPos, yPos, scl*mult)
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
    let ALPHA_COEFF = map(dist(ts_x,0,0,0),0,graphics.width/2,0.4,1)
    let ts_y1 = -h(0.1)
    let ts_y2 = h(1.1)
    tS_original(ts_x, ts_y1, ts_x, ts_y2, w(.35), 10*c, 10*c, 10*c, 10*ALPHA_COEFF)
    tS_original(ts_x, ts_y1, ts_x, ts_y2, w(.35), pal.light[0]*c, pal.light[1]*c, pal.light[2]*c, 20*ALPHA_COEFF)
  }
  graphics.noLoop();
  pop()
}

function blurredEllipse(x,y,size,r,g,b,a) {
  let o = rnd(-size,size)
  for (let i = 0; i < 12; i++){
    graphics.fill(r,g,b,(i/a)*(10*i))
    graphics.ellipse(x+o,y+o,1.6*size - (size/10)*i)
  }
}

function blurredEllipse_Sp(x,y,size,r,g,b,a) {
  let o = rnd(-size,size)
  for (let i = 0; i < 12; i++){
    spirals.fill(r,g,b,(i/a)*(1.5*i))
    spirals.ellipse(x+o,y+o,1.6*size - (size/10)*i)
  }
}

function randomDaubs(num, r, g, b, spread, layout) {
  push()
  //translate(-graphics.width/2,0)
  // SPREAD IS INVERSE VALUE  -  MORE CENTERED AT W(.5), MORE SPREAD AT W(.1)
  let num_daubs = num
  for (let i = 0; i < num_daubs; i++) {
    let angle = rnd(TWO_PI)
    //let rad = rnd(w(.75)) - rnd(.58)
    let rad = w(.5)
    if (layout === 'vert') {
      x = rnd(-rad+rnd(spread),rad-rnd(spread))
      y = rnd(height)
      coeff = map(dist(x,0,0,0),0,w(.6),1,.1)
      alpha_coeff = map(dist(x,0,0,0),0,w(.6),.5,1.4)
    }
    /*if (layout === 'cross') {
      x = rnd(rad*cos(angle)-rnd(spread*cos(angle)))
      y = height/2 + rnd(rad*sin(angle)-rnd(spread*sin(angle)))
      coeff = map(dist(x,0,0,0),0,w(.6),1,.1)
      alpha_coeff = map(dist(x,0,0,0),0,w(.6),.5,1.4)
    }*/
    if (layout === 'conc') {
      x = rnd(rad*cos(angle)-rnd((spread/2)*cos(angle)))
      y = height/2 + rnd(rad*sin(angle)-rnd((spread/2)*sin(angle)))
      coeff = map(dist(x,y,0,height/2),0,w(.8),1,.1)
      alpha_coeff = map(dist(x,y,0,height/2),0,w(.8),.5,1)
    }
    graphics.noStroke()
    //let coeff = map(dist(x,0,0,0),0,w(.6),1,.1)
    //let alpha_coeff = map(dist(x,0,0,0),0,w(.6),.5,1.4)
    let col = [r*coeff,g*coeff,b*coeff]
    blurredEllipse(x,y,rnd(w(.015),w(.035)),col[0],col[1],col[2],180*alpha_coeff)
  }
  pop()
}

function texturedCircle_vert(init_distort,line_val,size,inc,diff,max_distort,layout) {
  push()
  //translate(width/2,0)
  //line_val is for line length - 0 is a dot, .2 is a line
  let zoff = 0
  let t = frameCount * 3 + rnd(TWO_PI)
  let d = .9
  if (layout === 'vert'){
    d = 2.3
  }
  graphics.angleMode(graphics.DEGREES)
  if (frameCount < 400) {
    let xoff = map(cos(t+diff), -1, 1, 0, 1)
    let yoff = map(sin(t-diff), -1, 1, 0, 1)
    let r = map(noise(xoff, yoff), 0, 1, size, size-rnd(w(.01),max_distort*noise(xoff, yoff, zoff)))
    let x1 = init_distort + r * cos(t)
    let y1 = graphics.height/2 + init_distort + d*r * sin(t)
    let x2 = init_distort + r * cos(t + line_val)
    let y2 = graphics.height/2 + init_distort + d*r * sin(t + line_val*2)
    let x_alt = init_distort + r * cos(t + line_val)
    let y_alt = graphics.height/2 + init_distort + d*r * sin(t + line_val*2)
    let dis = rnd(.94,1.06)
    let dis2 = rnd(.88,1.12)
    graphics.line(x1,y1,x2,y2)
    graphics.line(x1*dis,y1*dis,x2*dis,y2*dis)
    graphics.line(x1*dis2,y1*dis2,x2*dis2,y2*dis2)
    //graphics.line(x1*dis,y1*dis,x_alt*dis,y_alt*dis) // DARKER & MORE CHAOTIC
    zoff += inc/5;
  }
  pop()
}

function texturedVanishingPoint(init_distort,line_val,size,inc,diff,max_distort,layout) {
  push()
  //translate(width/2,0)
  //line_val is for line length - 0 is a dot, .2 is a line
  let zoff = 0
  let t = frameCount * 3 + rnd(TWO_PI)
  let d = .9
  if (layout === 'vert'){
    d = 2.3
  }
  graphics.angleMode(graphics.DEGREES)
  if (frameCount < 65) {
    let xoff = map(cos(t+diff), -1, 1, 0, 1)
    let yoff = map(sin(t-diff), -1, 1, 0, 1)
    let r = map(noise(xoff, yoff), 0, 1, size, size-rnd(w(.01),max_distort*noise(xoff, yoff, zoff)))
    let x1 = init_distort + r * cos(t)
    let y1 = graphics.height/3 + init_distort + d*r * sin(t)
    let x2 = init_distort + r * cos(t + line_val)
    let y2 = graphics.height + init_distort + d*r * sin(t + line_val*1.5)
    let xc1 = (x1+x2)/4 + rnd(-w(.05),w(.05))
    let yc1 = (y1+y2)/4 + rnd(-w(.05),w(.05))
    let xc2 = (x1+x2)/2 + rnd(-w(.05),w(.05))
    let yc2 = (y1+y2)/2 + rnd(-w(.05),w(.05))
    let x_alt = init_distort + r * cos(t + line_val)
    let y_alt = graphics.height/2 + init_distort + d*r * sin(t + line_val*2)
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

function verticalTexture(layout, line_val, col) {
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
    graphics.stroke(col[0] * c, col[1] * c, col[2] * c, 40 * alpha_coeff)
    graphics.strokeWeight(rnd(w(.001)))
    //graphics.strokeWeight(map(i,0,num_circs,w(.0005),w(.002)))
    //graphics.ellipse(0,0,size)
    texturedCircle_vert(i_d,line_val,size,inc,0,w(.06),layout)
    texturedCircle_vert(i_d,line_val,size,inc*15,30,w(.06),layout)
    texturedCircle_vert(i_d,line_val,size,inc*25,60,w(.06),layout)
    graphics.stroke(col[0] * c, col[1] * c, col[2] * c, 65 * alpha_coeff)
    texturedCircle_vert(i_d,line_val,size,inc*15,90,w(.06)),layout
    texturedCircle_vert(i_d,line_val,size,inc*25,120,w(.06),layout)
    graphics.stroke(col[0] * c, col[1] * c, col[2] * c, 25 * alpha_coeff)
    texturedCircle_vert(i_d,line_val,size,inc*15,270,w(.06),layout)
    texturedCircle_vert(i_d,line_val,size,inc*25,300,w(.06),layout)
    xoff += .01
  }
  pop()
}

function vanish_P(layout, line_val, col) {
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
    let size = map(i,0,num_circs,w(.01),w(1))
    let inc = .003
    let c = map(size,0,w(1),0,2)
    let alpha_coeff = map(size,0,w(.15),.1,.6)
    graphics.stroke(col[0] * c, col[1] * c, col[2] * c, 40 * alpha_coeff)
    graphics.strokeWeight(rnd(w(.00015)))
    //graphics.strokeWeight(map(i,0,num_circs,w(.0005),w(.002)))
    //graphics.ellipse(0,0,size)
    texturedVanishingPoint(i_d,line_val,size,inc,0,w(.06),layout)
    texturedVanishingPoint(i_d,line_val,size,inc*15,30,w(.06),layout)
    texturedVanishingPoint(i_d,line_val,size,inc*25,60,w(.06),layout)
    graphics.stroke(col[0] * c, col[1] * c, col[2] * c, 65 * alpha_coeff)
    texturedVanishingPoint(i_d,line_val,size,inc*15,90,w(.06)),layout
    texturedVanishingPoint(i_d,line_val,size,inc*25,120,w(.06),layout)
    graphics.stroke(col[0] * c, col[1] * c, col[2] * c, 25 * alpha_coeff)
    texturedVanishingPoint(i_d,line_val,size,inc*15,270,w(.06),layout)
    texturedVanishingPoint(i_d,line_val,size,inc*25,300,w(.06),layout)
    xoff += .01
  }
  pop()
}



//////////////////////// SPIRALS ///////////////////


function drawCirc_Vert_RAND(radius, r, g, b, a, t_offset, limit, layout) {
  push()
  //strokeWeight(3)
  //noFill()
  spirals.noStroke()
  let xoff = 0

  //let t = map(frameCount,0,limit,frameCount,frameCount/2)
  let t = frameCount
  
  /*if (layout == 'vert') {
    x = width/2 + .67*radius * cos(t+t_offset) + map(noise(xoff),0,1,-radius*noise(xoff)/5,radius*noise(xoff)/5)
    y = height/2 + 3*radius * sin(t+t_offset) + map(noise(xoff),0,1,-radius*noise(xoff)/5,radius*noise(xoff)/5)
  }else{
    x = width/2 + radius * cos(t+t_offset) + map(noise(xoff),0,1,-radius*noise(xoff)/5,radius*noise(xoff)/5)
    y = height/2 + radius * sin(t+t_offset) + map(noise(xoff),0,1,-radius*noise(xoff)/5,radius*noise(xoff)/5)
  }*/
  if (layout == 'vert') {
    x = width/2 + .67*radius * cos(t+t_offset)
    y = height/2 + 3*radius * sin(t+t_offset)
  }else{
    x = width/2 + radius * cos(t+t_offset)
    y = height/2 + radius * sin(t+t_offset)
  }

  //let size = map(sin(frameCount/20),0,1,w(.04),w(.06))
  let size = rnd(w(.03))
  if (frameCount < limit) {
    blurredEllipse_Sp(x,y,size,r,g,b,a)
    blurredEllipse_Sp(x-w(.01),y-h(.01),size,r,g,b,a)
    blurredEllipse_Sp(x+w(.02),y-h(.02),size,r,g,b,a)
    xoff += 0.05
  }
  pop()
}

function drawSpirals_Vert(layout) {
  push()
  let num_circs = 70
  if (layout === 'vert') {
    num_circs = 160
  }
  for (let i = 0; i < num_circs; i++) {
    //drawCirc_Vert_RAND(w(.01)+i*w(.01), pal.light[0], pal.light[1], pal.light[2], 1 + 1*i, i*10, 75 +5*i, layout)
    drawCirc_Vert_RAND(w(.01)+i*w(.02), map(i,0,num_circs-6,pal.light[0],3), map(i,0,num_circs-6,pal.light[1],3), map(i,0,num_circs-6,pal.light[2],2), 20 + i, i*(rnd(-30,30)), 25 +10*i, layout)
  }
  pop()
}

function drawSpirals_VertOut(layout) {
  push()
  let num_circs = 70
  if (layout === 'vert') {
    num_circs = 120
  }
  for (let i = 0; i < num_circs; i++) {
    drawCirc_Vert_RAND(w(1.3)-i*w(.05) + rnd(-w(.01),w(.01)), pal.accent_dark, 90 - 1*i, i*35, 300 - 5*i, layout)
  }
  pop()
}


//////////////////////// MOTHS /////////////////////



class FlowButtermoth{
  constructor(_loc,_dir,_speed,_moth,_layout,_moving,_met){
    this.loc = _loc;
    this.dir = _dir;
    this.speed = _speed;
    this.moth = _moth;
    this.layout = _layout;
    this.moving = _moving;
    this.met = _met;
  	// var col;
  }
  run(fM_xoff,fM_yoff) {
    /*if (this.moving === 'true'){
      this.move();
    }*/
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
    let c = map(noise(fM_xoff, fM_yoff), 0, 1, 0, map(dist(this.loc.x,this.loc.y,mouseX,mouseY),w(.15),width/2,0,2));
    /*let c = 1
    let light_distance = dist(this.loc.x,this.loc.y,mouseX,mouseY)
    if (light_distance < w(.3)) {
      c = 0
    }*/
    fill(c * this.met[0], c * this.met[1], c * this.met[2], map(frameCount,40,70,0,130) + c * 50); // 255, 231, 122
    //stroke(30)
    //strokeWeight(w(.0001))
    //noStroke();
    //translate(width/2,height/2)
    //+ map(mouseX,0,width,-w(.008),w(.008))
    //profileMoth(this.loc.x, this.loc.y, .45);
    this.moth(this.loc.x, this.loc.y, .45);
    //this.chosenMoth(this.loc.x, this.loc.y, .45)

  }
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