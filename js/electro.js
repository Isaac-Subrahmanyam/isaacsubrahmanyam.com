var canvas;

function setup() {
  canvas = createCanvas(8 + windowWidth / 1.35, 58);
  canvas.style('z-index', '-1');
  canvas.position(windowWidth / 35, 200 - document.body.scrollTop);
}

function draw() {
  setup();
  background(250, 243, 219, 0);
  noFill();

  stroke(77, 218, 89);
  strokeWeight(2);
  beginShape();
  vertex(0, height / 2 + random(- height / 2, height / 2));
  for(var i = 0; i < width / 40; i++)
  {
    vertex(i * 40, height / 2 + random(- height / 2, height / 2));
  }
  vertex(width, height / 2 + random(- height / 2, height / 2));
  endShape();

  stroke(77, 218, 89, 100);
  strokeWeight(2);
  beginShape();
  vertex(0, height / 2 + random(- height / 2, height / 2));
  for(var i = 0; i < width / 40; i++)
  {
    vertex(i * 40, height / 2 + random(- height / 2, height / 2));
  }
  vertex(width, height / 2 + random(- height / 2, height / 2));
  endShape();
}