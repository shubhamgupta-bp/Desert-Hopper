# TESTING AND DEBUGGING REPORT

## 1. Purpose of Testing

The main purpose of testing this project was:
- To check if the game runs smoothly without errors.
- To make sure the player movement works correctly.
- To ensure the collision detection is accurate.
- To confirm that obstacles spawn correctly and logically.
- To check scoring, high score, and difficulty increase.
- To identify any bugs during gameplay.
- To verify that all game screens (start, gameplay, game over) behave correctly.

--------------------------------------------------------------------

## 2. Items Tested

### 2.1 Player Controls

I tested how the player reacts to keyboard controls:
- Jump activates on pressing space or arrow up.
- Duck activates only when the player is on the ground.
- Player cannot jump again while already in the air.
- Player returns to ground smoothly after jumping due to gravity.
- Jump height remains constant and does not fluctuate randomly.
- Ducking animation correctly reduces the height of the player box.

I repeated these tests several times with different timings to confirm stability.

### 2.2 Obstacle Spawn Testing

I tested how obstacles generate:
- Obstacles spawn at random time intervals.
- Different types of obstacles appear:
  - Cactus
  - Rock
  - Bird
  - Log
  - Tumbleweed
  - Glider
- Obstacle sizes remain within expected range.
- Birds drift horizontally with small movement.
- Gliders move in a wave pattern.
- Group obstacles appear correctly with proper spacing.
- Obstacles do not overlap in unnatural ways.
- Obstacles get removed after going off-screen.

### 2.3 Collision Detection Testing

To test collisions:
- I intentionally bumped into every obstacle type.
- Collision always ended the game immediately.
- If the player only slightly touches the obstacle, collision still triggers.
- No false collisions occurred.
- No situation happened where the obstacle visually touches the player but no game over occurs.
- Collision logic is consistent even at high speed.

### 2.4 Scoring System Testing

I tested:
- Score increases by 1 when the obstacle completely passes the player.
- Score never increases twice for the same obstacle.
- High score updates correctly.
- High score loads correctly from localStorage on page refresh.
- High score only updates when the new score is greater than the previous best.

Tested by:
- Playing multiple rounds.
- Refreshing the tab.
- Clearing the browser data.

### 2.5 Game Speed Increase Testing

I verified:
- The game speed slowly increases as time passes.
- The difficulty becomes higher naturally.
- No sudden jumps or drops in speed.
- Faster speeds do not break collision or spawn timings.

### 2.6 Canvas Resizing Testing

I manually resized the browser window:
- Canvas width adjusts correctly.
- Player position adjusts to bottom of canvas.
- Ground line stays at correct height.
- Game does not look distorted.
- No errors occurred during resizing.

### 2.7 Sound Testing

I tested:
- Jump sound plays once on jump.
- Crash sound plays once on collision.
- Sounds do not repeat unexpectedly.

### 2.8 Start and Game Over Screen Testing

Checked:
- Start screen shows instructions clearly.
- Game over screen shows final score and high score.
- Pressing space restarts the game.
- Message box always appears in center.

--------------------------------------------------------------------

## 3. Bugs Found and Fixes Applied

### Bug 1: Player got hit instantly at the start
Reason:
- Obstacle spawned too early.

Fix:
- Reset the timer after game initialization.

### Bug 2: Double jump happening sometimes
Reason:
- Keydown event fired twice.

Fix:
- Added condition checking if player is already jumping.

### Bug 3: Score increased twice for one obstacle
Reason:
- Missing counted flag.

Fix:
- Added obstacle.counted = false and updated logic.

### Bug 4: Canvas not resizing properly
Reason:
- Player Y-position not updated on resize.

Fix:
- Updated resize function to reposition player.

### Bug 5: Glider moving too fast or incorrectly
Reason:
- Wrong sine wave update frequency.

Fix:
- Added and tuned waveTime increment.

### Bug 6: Birds drifting too fast
Fix:
- Reduced the random drift range.

### Bug 7: Audio not playing on first jump
Reason:
- Tone.js requires user interaction.

Fix:
- Added audio start inside user events.

### Bug 8: 404 for favicon
Reason:
- Browser asks for favicon.

Fix:
- Ignored as it is harmless.

--------------------------------------------------------------------

## 4. Debugging Methods Used

### Console Logging
Used console.log to print:
- Player position
- Obstacle positions
- Velocity values
- Collision detection steps
- High score and score checks

### Browser DevTools
- Used debugger to pause code.
- Inspected variables in real time.

### Slow Motion Testing
Reduced speed temporarily to visually inspect collisions.

### Bounding Box Debug Drawing
Added temporary canvas outlines to see exact collision boxes.

--------------------------------------------------------------------

## 5. Test Scenarios and Expected Results

### Scenario 1: Player jumps early
Expected: No collision.

### Scenario 2: Player ducks under a bird
Expected: No collision.

### Scenario 3: Player touches rock or log
Expected: Collision and game over.

### Scenario 4: Obstacle passes without touching
Expected: Score increases by 1.

### Scenario 5: Game closes and reopens
Expected: High score is remembered.

--------------------------------------------------------------------

## 6. Final Conclusion

After extensive testing, the game works properly.  
All major features are stable, including:
- Jumping
- Ducking
- Collision
- Scoring
- Difficulty progression
- High score saving
- Sound effects

--------------------------------------------------------------------