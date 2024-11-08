// Dynamic background color variables
let dayLength = 1000; // Duration of a day (in frames)
let seasonLength = 3000; // Duration of a season (in frames)
let springColor1, springColor2, summerColor1, summerColor2;
let autumnColor1, autumnColor2, winterColor1, winterColor2;
let currentBgColor1, currentBgColor2; // To store the current background colors
let targetBgColor1, targetBgColor2; // To store the target background colors
let bgTransitionProgress = 0; // Progress for background transition
let gradientAngle = 0; // Angle for rotating gradient

// Tree animation variables
let growthSpeed = 0.4;
let maxSize = 40;
let circleSizes = [];
let noiseOffsets = [];
let swayNoiseOffset;
let clouds = []; // Array to store clouds
let snowflakes = []; // Array to store snowflakes

class Cloud {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(windowWidth / 40, windowWidth / 20);
  }

  move() {
    this.x += 1;
    if (this.x > width + this.size) {
      this.x = -this.size;
    }
  }

  show() {
    noStroke();
    // Create gradient effect for each cloud element
    for (let i = 0; i <= this.size; i += 2) {
      let cloudColor = color(255, 255, 255, 200); // White semi-transparent clouds
      fill(cloudColor);
      let yOffset = map(i, 0, this.size, 0, this.size * 0.2);
      ellipse(this.x, this.y + yOffset, this.size - i);
      ellipse(this.x + this.size * 0.5, this.y + this.size * 0.2 + yOffset, (this.size - i) * 0.8);
      ellipse(this.x - this.size * 0.5, this.y + this.size * 0.2 + yOffset, (this.size - i) * 0.8);
    }
  }
}

class Snowflake {
  constructor() {
    this.x = random(width);
    this.y = random(-50, height);
    this.size = random(2, 5);
    this.speed = random(1, 3);
  }

  fall() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = random(-50, -10); // Reset to top when off screen
      this.x = random(width);
    }
  }

  show() {
    noStroke();
    fill(255); // White color for snowflakes
    ellipse(this.x, this.y, this.size);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);

  // Initialize dynamic background colors for seasons with two colors each
  springColor1 = color(124, 252, 0, 255); // Light grass green
  springColor2 = color(173, 255, 47, 255); // Green yellow
  
  summerColor1 = color(135, 206, 250, 255); // Sky blue
  summerColor2 = color(0, 191, 255, 255); // Deep sky blue
  
  autumnColor1 = color(255, 215, 0, 255); // Golden yellow
  autumnColor2 = color(255, 140, 0, 255); // Dark orange
  
  winterColor1 = color(255, 255, 255, 255); // White
  winterColor2 = color(240, 248, 255, 255); // Alice blue

  // Set initial background colors
  currentBgColor1 = springColor1;
  currentBgColor2 = springColor2;
  targetBgColor1 = springColor1;
  targetBgColor2 = springColor2;

  // Initialize tree parameters
  swayNoiseOffset = random(1000);
  let totalCircles = 6 + 4 * 2 + 3 * 2 + 2 * 2;
  for (let i = 0; i < totalCircles; i++) {
    circleSizes.push(0);
    noiseOffsets.push(random(1000));
  }

  initializeClouds();
  initializeSnowflakes(); // Initialize snowflakes
}

function drawGradientBackground() {
  // Create gradient pattern
  for(let y = 0; y < height; y += height/10) {
    let inter1 = map(y, 0, height, 0, 1);
    let inter2 = map(y + height/10, 0, height, 0, 1);
    
    let c1 = lerpColor(currentBgColor1, currentBgColor2, inter1);
    let c2 = lerpColor(currentBgColor1, currentBgColor2, inter2);
    
    // Draw gradient rect
    noStroke();
    beginShape();
    fill(c1);
    vertex(0, y);
    vertex(width, y);
    fill(c2);
    vertex(width, y + height/10);
    vertex(0, y + height/10);
    endShape(CLOSE);
  }
}

function draw() {
  let scaleFactor = min(windowWidth, windowHeight) / 700;

  // Determine the target background colors based on the current season
  let seasonProgress = (frameCount % seasonLength) / seasonLength;
  if (seasonProgress < 0.25) { // Spring
    targetBgColor1 = springColor1;
    targetBgColor2 = springColor2;
  } else if (seasonProgress < 0.5) { // Summer
    targetBgColor1 = summerColor1;
    targetBgColor2 = summerColor2;
  } else if (seasonProgress < 0.75) { // Autumn
    targetBgColor1 = autumnColor1;
    targetBgColor2 = autumnColor2;
  } else { // Winter
    targetBgColor1 = winterColor1;
    targetBgColor2 = winterColor2;
  }

  // Smoothly transition the background colors
  bgTransitionProgress += 0.005;
  if (bgTransitionProgress > 1) {
    bgTransitionProgress = 1;
  }
  
  currentBgColor1 = lerpColor(currentBgColor1, targetBgColor1, 0.01);
  currentBgColor2 = lerpColor(currentBgColor2, targetBgColor2, 0.01);

  // Draw the gradient background
  drawGradientBackground();

  // Draw clouds
  for (let cloud of clouds) {
    cloud.move();
    cloud.show();
  }

  // Draw snowflakes in winter
  if (seasonProgress >= 0.75) {
    for (let snowflake of snowflakes) {
      snowflake.fall();
      snowflake.show();
    }
  }

  // Draw tree
  drawBaseStructure(scaleFactor);
  drawCircles(scaleFactor);

  // Update circle sizes based on season with smooth growth
  for (let i = 0; i < circleSizes.length; i++) {
    let growthFactor;
    
    if (seasonProgress < 0.75) { // Spring through Autumn
      // Calculate growth progress from spring to autumn (0 to 0.75)
      // Using a sine curve for more natural growth pattern
      let growthProgress = map(seasonProgress, 0, 0.75, 0, PI);
      growthFactor = sin(growthProgress) * 0.3; // Smoother growth curve
      
      if (circleSizes[i] < maxSize * scaleFactor) {
        circleSizes[i] += growthSpeed * growthFactor * scaleFactor;
      }
    } else { // Winter
      // Fruits fall off in winter
      circleSizes[i] = max(0, circleSizes[i] - growthSpeed * 2 * scaleFactor);
    }
    
    // Ensure size doesn't exceed maximum
    circleSizes[i] = min(circleSizes[i], maxSize * scaleFactor);
  }
}

// Draw the base structure (flowerpot)
function drawBaseStructure(scaleFactor) {
  fill(150, 180, 100);
  noStroke();
  rectMode(CENTER);
  rect(width / 2, height - 150 * scaleFactor, 350 * scaleFactor, 80 * scaleFactor);

  fill(80, 160, 90);
  for (let i = 0; i < 5; i++) {
    arc(width / 2 - 120 * scaleFactor + i * 60 * scaleFactor, height - 150 * scaleFactor, 
        60 * scaleFactor, 60 * scaleFactor, PI, 0);
  }

  fill(200, 60, 60);
  for (let i = 0; i < 4; i++) {
    arc(width / 2 - 90 * scaleFactor + i * 60 * scaleFactor, height - 150 * scaleFactor, 
        60 * scaleFactor, 60 * scaleFactor, 0, PI);
  }
}

function drawCircles(scaleFactor) {
  let currentIndex = 0;
  let circleSize = 50 * scaleFactor;

  drawVerticalCircles(width / 2, height - 200 * scaleFactor, 6, circleSize, currentIndex, scaleFactor);
  currentIndex += 6;

  drawHorizontalCircles(width / 2, height - 450 * scaleFactor, 4, circleSize, -1, currentIndex, scaleFactor);
  currentIndex += 4;
  drawHorizontalCircles(width / 2, height - 450 * scaleFactor, 4, circleSize, 1, currentIndex, scaleFactor);
  currentIndex += 4;

  drawHorizontalCircles(width / 2, height - 350 * scaleFactor, 3, circleSize, -1, currentIndex, scaleFactor);
  currentIndex += 3;
  drawHorizontalCircles(width / 2, height - 350 * scaleFactor, 3, circleSize, 1, currentIndex, scaleFactor);
  currentIndex += 3;

  drawHorizontalCircles(width / 2, height - 550 * scaleFactor, 2, circleSize, -1, currentIndex, scaleFactor);
  currentIndex += 2;
  drawHorizontalCircles(width / 2, height - 550 * scaleFactor, 2, circleSize, 1, currentIndex, scaleFactor);
}

function drawVerticalCircles(x, y, count, size, indexStart, scaleFactor) {
  let sway = map(noise(swayNoiseOffset + frameCount * 0.01), 0, 1, -5 * scaleFactor, 5 * scaleFactor);

  for (let i = 0; i < count; i++) {
    let noiseX = map(noise(noiseOffsets[indexStart + i] + frameCount * 0.01), 0, 1, -10 * scaleFactor, 10 * scaleFactor);
    let noiseY = map(noise(noiseOffsets[indexStart + i] + 1000 + frameCount * 0.01), 0, 1, -10 * scaleFactor, 10 * scaleFactor);
    let circleSize = circleSizes[indexStart + i];
    drawColoredCircle(x + noiseX + sway, y - i * size * 1.2 + noiseY, circleSize);
    
    if (i > 0) {
      drawLine(x + sway, y - (i - 1) * size * 1.2, x + sway, y - i * size * 1.2);
    }
  }
}

function drawHorizontalCircles(x, y, count, size, direction, indexStart, scaleFactor) {
  let sway = map(noise(swayNoiseOffset + frameCount * 0.01), 0, 1, -5 * scaleFactor, 5 * scaleFactor);

  for (let i = 0; i < count; i++) {
    let noiseX = map(noise(noiseOffsets[indexStart + i] + frameCount * 0.01), 0, 1, -10 * scaleFactor, 10 * scaleFactor);
    let noiseY = map(noise(noiseOffsets[indexStart + i] + 1000 + frameCount * 0.01), 0, 1, -10 * scaleFactor, 10 * scaleFactor);
    let xPos = x + (i + 1) * size * 1.2 * direction + noiseX + sway;
    let circleSize = circleSizes[indexStart + i];
    drawColoredCircle(xPos, y + noiseY, circleSize);
    drawLine(x + sway, y, xPos, y + noiseY);
  }
}

function drawColoredCircle(x, y, size) {
  noStroke();
  fill(200, 60, 60);
  arc(x, y, size, size, PI, 0);
  fill(80, 160, 90);
  arc(x, y, size, size, 0, PI);
}

function drawLine(x1, y1, x2, y2) {
  stroke(100, 50, 50, 150);
  strokeWeight(3);
  line(x1, y1, x2, y2);
}

function initializeClouds() {
  clouds = [];
  for (let i = 0; i < 5; i++) {
    clouds.push(new Cloud(random(width), random(windowWidth / 40, windowWidth / 10)));
  }
}

function initializeSnowflakes() {
  snowflakes = [];
  for (let i = 0; i < 100; i++) { // Create 100 snowflakes
    snowflakes.push(new Snowflake());
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initializeClouds();
}
