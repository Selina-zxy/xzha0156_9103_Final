# xzha0156_9103_Final
## 1. Instructions on how to interact with the work
Since my code is time-based and spontaneous, just open the code and wait for him to run on his own

## 2. Details of your individual approach to animating the group code.
### 2.1 Which did you choose to drive your individual code: audio, interaction, Perlin noise or time.
I choose time to drive my individual code
### 2.2 Which properties of the image will be animated and how.
Based on the group code, I started by adjusting the background colour and the growth rate of the apples. I tried to convey the passage of the year through the four background colours and, based on the laws of nature, to have the apples start to grow in the spring and ripen in the autumn.

Then I added the element of snowflakes in winter, I tried to have snow on the branches of the trees, but I failed. At the same time I wanted the branches to look bare and dead in winter, I wanted the apples to fall from the tree one by one according to the laws of nature, but I only managed to make them wither in winter.

In the end, I adjusted the colour of the apples so that the saturation of the apples was at its lightest in the spring, when they first sprouted, and the saturation gradually increased until the saturation pair was at its strongest in the autumn.

### 2.3 References to inspiration for animating your individual code
My animation is inspired by the change of seasons in nature. Although the artwork looks abstract, everything follows the laws of nature, spring planting and autumn harvesting, and winter snowing.

### 2.4 A short technical explanation of how your individual code works to animate the image and any appropriate references.

This code creates a dynamic and seasonal animation with trees, clouds, snowflakes, and apples, where each element adjusts in color, size, and movement depending on the season.

Background Colors: Seasonal colors (springColor1, summerColor1, etc.) are defined to reflect different times of the year. The background color smoothly transitions by interpolating between the current and target colors using lerpColor, producing a gradient effect across the canvas.

Clouds and Snowflakes: The Cloud and Snowflake classes define individual cloud and snowflake objects with unique properties for position, size, and movement. Each frame updates their positions; snowflakes fall vertically, while clouds move horizontally across the sky. Snowflakes only appear in the winter season.

Tree Animation: The tree’s branches sway gently, animated purely with Perlin noise for a realistic, organic look. By using Perlin noise values in the draw function, each branch experiences smooth, pseudo-random swaying movements.

Apple Color and Size Transition: Apples are represented by red and green semi-circles. Their color and size gradually change from spring to autumn, reflecting growth and maturity. lerpColor is used to transition between currentRedColor and targetRedColor (and similarly for green), while appleSize grows linearly across the seasons.

Smooth Transitions: The lerpColor function ensures all color transitions are smooth, while Perlin noise provides realistic motion effects for the tree branches and cloud/snowflake movements, enhancing the natural feel of the animation.

**References:**

lerpColor function for color interpolation: p5.js Reference
Noise-based animation (noise) for smooth, pseudo-random movements: Perlin Noise in p5.js

### 2.5 How they work.

This code creates a dynamic, seasonal animation scene featuring elements such as trees, clouds, snowflakes, and apples. Each element changes in color, size, and movement as the seasons transition.

#### 1. **Gradient Background Transition**

The code defines specific colors for each season (such as springColor1, summerColor1, etc.) to reflect seasonal changes. Each season is represented with two main color tones to create a gradient effect.

- **Smooth Transition**: The lerpColor function is used to interpolate between the current (currentBgColor1, currentBgColor2) and target background colors (targetBgColor1, targetBgColor2), enabling a smooth color transition.
- **Creating the Gradient**: The drawGradientBackground function iterates over several horizontal bands across the canvas, each one blending the colors between two tones. This creates a seamless gradient that reflects seasonal changes.


#### 2. **Cloud and Snowflake Animations**

The code includes cloud and snowflake animations, represented by the Cloud and Snowflake classes. These classes define properties such as position, size, and movement behavior.

- **Cloud Movement**: Clouds move horizontally across the screen, resetting to the left edge when they reach the right boundary. Each cloud’s position is updated each frame to create continuous movement.
- **Snowflake Animation**: Snowflakes fall vertically, simulating snowfall. Each snowflake’s position is reset to the top of the screen once it reaches the bottom, so snowflakes continuously fall during the winter season.
- **Seasonal Appearance**: Snowflakes only appear in winter, creating a seasonal effect.


#### 3. **Tree Animation with Perlin Noise**

The tree branches use **Perlin Noise** to create a smooth, natural swaying effect that simulates the wind.

- **Swaying Effect**: Using Perlin noise in the draw function generates smooth pseudo-random values, giving each branch a gentle swaying motion.
- **Organic Animation**: By applying different Perlin noise offsets to each branch, the branches appear to sway independently, enhancing the realism of the animation.


#### 4. **Apple Color and Size Transition**

The apples, represented by red and green semi-circles, change color and size gradually from spring to autumn to mimic growth and ripening.

- **Color Transition**: The currentRedColor and currentGreenColor variables gradually transition to their target colors (targetRedColor and targetGreenColor) based on the season. This is done smoothly using the lerpColor function, allowing the colors to intensify as apples mature.
- **Size Growth**: The apple size, appleSize, grows steadily from spring through autumn, reflecting the natural growth of the fruit. This gradual increase in size is controlled based on seasonal progress, using linear growth to create a natural effect.

#### 5. **Seasonal Transitions**

The code uses a combination of lerpColor and noise functions to create smooth seasonal transitions across various elements.

- **Season Progression**: The seasonProgress variable, calculated based on frameCount, determines the current point within a seasonal cycle. Each complete cycle spans seasonLength frames (e.g., 3000 frames for one full seasonal cycle).
- **Color and Size Transition**: By updating target colors, background tones, and apple properties (color and size) according to the current season, the code smoothly transitions elements as the seasons change.

#### Technical Summary

This code achieves smooth seasonal animations by using the lerpColor function for gradual color transitions and Perlin noise for natural movement effects in tree branches and other elements. The result is a dynamic, nature-inspired scene where elements adjust with seasonal progression, adding a natural feel to the animation. 