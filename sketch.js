// Pseudocode: Load and resize cat image to half canvas width and center it Create a graphics buffer for the black mask, same size as cat image Draw cat image, then mask on top User drags mouse to erase (reveal) parts of the mask Calculate percent of mask erased and display as text, clearing previous text before drawing new percentage

let imgCat; // cat image
let bufMask; // graphics buffer for black mask
let imgW, imgH; // dimensions of resized cat image
let imgX, imgY; // position to center cat image
let brushSize = 40; // size of eraser brush
let percentRevealed = 0; // percent of mask erased

function preload() {
  // load cat image from url
  imgCat = loadImage("qr_code.gif");
  imgOverlay = loadImage("3_sqrs.png");
}

function setup() {
  // create canvas
  createCanvas(windowWidth, windowHeight);
  // calculate new width and height for cat image (half canvas width, keep aspect)
  imgW = windowWidth / 5;
  imgH = imgCat.height * (imgW / imgCat.width);
  // center image
  imgX = (windowWidth - imgW) / 5;
  imgY = (windowHeight - imgH) / 5;
  // resize cat image
  imgCat.resize(imgW, imgH);
  // create graphics buffer for mask, same size as image
  bufMask = createGraphics(imgW, imgH);
  // fill mask with black, fully opaque
  bufMask.background(100);
}

function draw() {
  // draw cat image
  image(imgCat, imgX, imgY);
  // draw mask on top
  image(bufMask, imgX, imgY);
  // calculate percent revealed
  percentRevealed = calcRevealedPercent();
  // clear area where percentage text will be drawn
  let textBoxW = 300;
  let textBoxH = 40;
  let textBoxX = width/2 - textBoxW/2;
  let textBoxY = imgY + imgH + 15;
  noStroke();
  fill(0, 180); // semi-transparent black for clearing
  rect(textBoxX, textBoxY, textBoxW, textBoxH);
  // display percent revealed as text
  fill(255);
  stroke(0);
  strokeWeight(3);
  textSize(28);
  textAlign(CENTER, TOP);
  text('Revealed: ' + nf(percentRevealed, 1, 1) + '%', width/2, imgY + imgH + 20);
}

function mouseDragged() {
  // check if mouse is within mask bounds
  let mx = mouseX - imgX;
  let my = mouseY - imgY;
  if (mx >= 0 && mx < imgW && my >= 0 && my < imgH) {
    // erase (draw transparent circle) on mask buffer
    bufMask.erase();
    bufMask.ellipse(mx, my, brushSize, brushSize);
    bufMask.noErase();
  }
}

function touchMoved() {
  // support for touch devices
  let mx = mouseX - imgX;
  let my = mouseY - imgY;
  if (mx >= 0 && mx < imgW && my >= 0 && my < imgH) {
    bufMask.erase();
    bufMask.ellipse(mx, my, brushSize, brushSize);
    bufMask.noErase();
  }
  return false; // prevent scrolling
}

function calcRevealedPercent() {
  // get pixel data from mask
  let revealed = 0;
  let total = imgW * imgH *4;
  bufMask.loadPixels();
  // loop through pixels, count how many are fully transparent
  for (let i = 3; i < bufMask.pixels.length; i += 4) {
    if (bufMask.pixels[i] === 0) {
      revealed++;
    }
  }
  // percent revealed
  let pct = 100 * revealed / total;
  return pct;
}

function windowResized() {
  // recalculate everything on resize
  resizeCanvas(windowWidth, windowHeight);
  imgW = windowWidth / 5;
  imgH = imgCat.height * (imgW / imgCat.width);
  imgX = (windowWidth - imgW) / 5;
  imgY = (windowHeight - imgH) / 5;
  imgCat.resize(imgW, imgH);
  bufMask = createGraphics(imgW, imgH);
  bufMask.background(100);
}
