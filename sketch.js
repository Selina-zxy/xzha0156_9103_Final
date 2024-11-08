// Dynamic background color variables
let dayLength = 4000; // Duration of a day (in frames)
let springColor, summerColor, autumnColor, winterColor;

// Tree animation variables
let growthSpeed = 0.2; // Slower growth for a more gradual effect
let maxSize = 40;
let circleSizes = [];
let appleSizes = []; // Array to track apple sizes
let noiseOffsets = [];
let swayNoiseOffset; // Noise offset for sway effect

class Cloud {
  constructor(x, y) {
    this.x = x;
    this.y = random(windowWidth / 40, windowWidth / 20); // The size of the clouds changes with the size of window
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
    
    // Create cloud color based on current season
    let currentBgColor = getCurrentSeasonColor();
    let cloudColor = color(
      min(red(currentBgColor) + 40, 255),
      min(green(currentBgColor) + 40, 255),
      min(blue(currentBgColor) + 40, 255)
    );

    // Create gradient from top to bottom
    for (let i = 0; i <= this.size; i += 2) {
      let alpha = map(i, 0, this.size, 255, 180);
      cloudColor.setAlpha(alpha);
      fill(cloudColor);

      let yOffset = map(i, 0, this.size, 0, this.size * 0.2);
      ellipse(this.x, this.y + yOffset, this.size - i);
      ellipse(this.x + this.size * 0.5, this.y + this.size * 0.2 + yOffset, (this.size - i) * 0.8);
      ellipse(this.x - this.size * 0.5, this.y + this.size * 0.2 + yOffset, (this.size - i) * 0.8);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialize seasonal colors
  springColor = color(135, 206, 250);  // Spring color (light blue)
  summerColor = color(34, 139, 34);     // Summer color (forest green)
  autumnColor = color(255, 99, 71);     // Autumn color (orange-red)
  winterColor = color(255, 255, 255);   // Winter color (white)

  // Initialize tree parameters
  let totalCircles = 6 + 4 * 2 + 3 * 2 + 2 * 2;
  swayNoiseOffset = random(1000); // Initialize noise offset for sway effect
  for (let i = 0; i < totalCircles; i++) {
    circleSizes.push(0);          // Initial size of all circles is 0
    appleSizes.push(0);           // Initialize apple sizes to 0
    noiseOffsets.push(random(1000)); // Random noise offset for each circle
  }

  initaliseClouds();
}

function draw() {
  // Get current background color based on season
  let currentBgColor = getCurrentSeasonColor();
  background(currentBgColor); // Set background color

  // Clouds move across the window
  for (let cloud of clouds) {
    cloud.move();
    cloud.show();
  }

  // Draw tree animation
  let scaleFactor = min(windowWidth, windowHeight) / 700;
  drawBaseStructure(scaleFactor);
  drawCircles(scaleFactor);
  drawApples(scaleFactor);

  // Control growth of circle sizes and apple sizes
  for (let i = 0; i < circleSizes.length; i++) {
    if (circleSizes[i] < maxSize * scaleFactor) {
      circleSizes[i] += growthSpeed * scaleFactor;
    }
  }

  // Control apple growth based on season
  updateAppleSizes();
}

// Get the current background color based on the season
function getCurrentSeasonColor() {
  let timeOfDay = frameCount % dayLength;
  if (timeOfDay < dayLength / 4) { // Spring
    return springColor;
  } else if (timeOfDay < dayLength / 2) { // Summer
    return summerColor;
  } else if (timeOfDay < (3 * dayLength) / 4) { // Autumn
    return autumnColor;
  } else { // Winter
    return winterColor;
  }
}

// Draw the base structure (flowerpot)
function drawBaseStructure(scaleFactor) {
  fill(150, 180, 100); // Pot color
  noStroke();
  rectMode(CENTER);
  rect(width / 2, height - 150 * scaleFactor, 350 * scaleFactor, 80 * scaleFactor);

  fill(80, 160, 90); // Green semi-circles
  for (let i = 0; i < 5; i++) {
    arc(width / 2 - 120 + i * 60, height - 150 * scaleFactor, 60 * scaleFactor, 60 * scaleFactor, PI, 0);
  }

  fill(200, 60, 60); // Red semi-circles
  for (let i = 0; i < 4; i++) {
    arc(width / 2 - 90 + i * 60, height - 150 * scaleFactor, 60 * scaleFactor, 60 * scaleFactor, 0, PI);
  }
}

// Draw circles for tree trunk and branches with noise-based sway
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

// Draw apples on the tree
function drawApples(scaleFactor) {
  for (let i = 0; i < appleSizes.length; i++) {
    let appleSize = appleSizes[i];
    if (appleSize > 0) {
      fill(200, 0, 0); // Red color for apples
      ellipse(width / 2, height - 200 - i * 30 * scaleFactor, appleSize, appleSize); // Draw apple
    }
  }
}

// Update apple sizes based on the season
function updateAppleSizes() {
  let timeOfDay = frameCount % dayLength;
  if (timeOfDay < dayLength / 4) { // Spring
    for (let i = 0; i < appleSizes.length; i++) {
      appleSizes[i] = 0; // No apples in spring
    }
  } else if (timeOfDay < dayLength / 2) { // Summer
    for (let i = 0; i < appleSizes.length; i++) {
      if (appleSizes[i] < maxSize) {
        appleSizes[i] += growthSpeed; // Apples grow in summer
      }
    }
  } else if (timeOfDay < (3 * dayLength) / 4) { // Autumn
    for (let i = 0; i < appleSizes.length; i++) {
      if (appleSizes[i] < maxSize) {
        appleSizes[i] += growthSpeed; // Continue growing in autumn
      }
    }
  } else { // Winter
    for (let i = 0; i < appleSizes.length; i++) {
      appleSizes[i] = 0; // No apples in winter
    }
  }
}

// Draw vertical circles (trunk) with sway effect
function drawVerticalCircles(x, y, count, size, indexStart, scaleFactor) {
  let sway = map(noise(swayNoiseOffset + frameCount * 0.01), 0, 1, -5 * scaleFactor, 5 * scaleFactor); // Calculate sway

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

// Draw horizontal circles (branches) with sway effect
function drawHorizontalCircles(x, y, count, size, direction, indexStart, scaleFactor) {
  let sway = map(noise(swayNoiseOffset + frameCount * 0.01), 0, 1, -5 * scaleFactor, 5 * scaleFactor); // Calculate sway

  for (let i = 1; i <= count; i++) {
    let noiseX = map(noise(noiseOffsets[indexStart + i - 1] + frameCount * 0.01), 0, 1, -10 * scaleFactor, 10 * scaleFactor);
    let noiseY = map(noise(noiseOffsets[indexStart + i - 1] + 1000 + frameCount * 0.01), 0, 1, -10 * scaleFactor, 10 * scaleFactor);
    let xPos = x + i * size * 1.2 * direction + noiseX + sway;
    let circleSize = circleSizes[indexStart + i - 1];
    drawColoredCircle(xPos, y + noiseY, circleSize);
    drawLine(x + sway, y, xPos, y + noiseY);
  }
}

// Draw a circle with alternating red and green halves
function drawColoredCircle(x, y, size) {
  noStroke();
  fill(200, 60, 60); // Red top half
  arc(x, y, size, size, PI, 0);
  fill(80, 160, 90); // Green bottom half
  arc(x, y, size, size, 0, PI);
}

// Draw connecting line for branches
function drawLine(x1, y1, x2, y2) {
  stroke(100, 50, 50, 150);
  strokeWeight(5);
  line(x1, y1, x2, y2);
}

// Initialise Clouds
function initaliseClouds() {
  clouds = []; // This clears the existing clouds
  for (let i = 0; i < 5; i++) {
    clouds.push(new Cloud(random(width), random(windowWidth / 40, windowWidth / 10)));
  }
}

// Adjust canvas size on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initaliseClouds(); // The clouds get reset every time the canvas gets adjusted.
}
