# Desert Hopper – Game Design Document (GDD)

## 1. What is this game?
Desert Hopper is a simple 2D dodging game.  
The player controls a small character who has to **jump** and **duck** to avoid obstacles in the desert.  
The goal is to survive as long as possible and make a high score.

## 2. Game Type
This game is a **Dodger** game.  
You just avoid obstacles and stay alive.

## 3. Main Goal of the Game
- Don’t hit any obstacle.
- Run for as long as you can.
- Earn points for every obstacle you successfully pass.
- Try to beat your **high score**.

## 4. How the Player Plays
- `Space` or `Arrow Up` → Jump  
- `Arrow Down` → Duck  

## 5. Things in the Game
### Player:
- Can jump using gravity logic.
- Can duck to avoid low obstacles.

### Obstacles:
Different types:
- Cactus  
- Rock  
- Bird  
- Log  
- Tumbleweed  
- Glider (moves in wave pattern)

Each obstacle has:
- position  
- width, height  
- movement direction  
- special behaviour (bird drift, glider sine wave)

### Background:
- Clouds moving slowly for nice effect.
- A desert ground.

## 6. Data Structures Used
- `player`: an object storing player details.
- `obstacles`: an array storing all obstacles on screen.
- `clouds`: an array storing cloud positions.
- `keys`: object storing which key is pressed.

## 7. Important Logic (Algorithms)
- **Jumping logic** with gravity.
- **Collision detection** using rectangle-overlap (AABB).
- **Obstacle generation** using timers and randomness.
- **Difficulty increasing** automatically by increasing game speed.
- **Sine wave motion** for glider movement.
- **Parallax movement** for clouds.

## 8. Code Structure
- `index.html` → base page  
- `css/style.css` → styling  
- `js/game.js` → all game logic  
- `package.json` → for npm start  
- `README.md`, `GDD.md`, `TESTING.md`

## 9. Testing Plan
- Test jumping, ducking, collision, scoring, spawning.
- Check if obstacles are removed when off-screen.
- Check high score saving.

## 10. Future Ideas
- Power-ups  
- Pause button  
- Better animations  
- Skins/custom characters
- Mobile Compatibility  