# Desert Hopper – Game Design Document (GDD)

## 1. Game Overview

**Desert Hopper** is a multi-page 2D browser runner game where players must survive for as long as possible by **jumping**, **ducking**, and **dodging** obstacles while running across a desert.  
The game uses a **Node.js frontend**, **HTML5 Canvas**, and a **C# (.NET) backend** for Save/Load/Delete features.

It is designed to be simple, responsive, visually appealing, and scalable.

---

## 2. Game Type
- Genre: **Endless Runner / Dodger**
- Platform: Web (Desktop)
- Technology:
  - HTML5 Canvas API
  - JavaScript (game engine)
  - Tone.js (sound)
  - .NET API (game save system)
  - TailwindCSS + Custom CSS (UI themes)
  - Node.js development server (npm start)

---

## 3. Core Gameplay
The player runs automatically across a side-scrolling desert.

### Main Objectives
- Survive as long as possible.
- Avoid all obstacles (collision = crash/game over).
- Increase score (coins) by passing obstacles.
- Maintain/session track:
  - **Score (Coins)**
  - **Obstacles Crossed**
- Save progress with a chosen name.
- Load previous saved games.
- Update & overwrite existing saves.
- Delete saves.
- Restart quickly using *Play Again*.

---

## 4. Controls
| Action | Key |
|--------|------|
| Jump | Space / ↑ Arrow |
| Duck | ↓ Arrow |
| Start Game (from ready screen) | Space |

---

## 5. Game Entities

### 5.1 Player
- Rectangular character with:
  - Position
  - Height, width
  - Velocity (vy), gravity
  - Jumping state
  - Ducking state
- Physics:
  - Gravity simulated frame-by-frame
  - Jump reduces velocity upwards
  - Duck reduces height temporarily

### 5.2 Obstacles (6 Types)
Each obstacle has:
- x, y position
- width, height
- movement speed
- special behavior
- `counted` flag (for scoring)

#### Types:
1. **Cactus** – Basic vertical obstacle  
2. **Rock** – Small ground obstacle  
3. **Bird** – Mid-air obstacle with horizontal drift  
4. **Log** – Long ground barrier  
5. **Tumbleweed** – Rolling obstacle  
6. **Glider** – Flying enemy with sine-wave motion  

All obstacles appear randomly but follow logic to avoid overlapping.

---

## 6. Environment
- Sand ground
- Ground markings
- Parallax clouds with random spawn intervals
- Orange/sand desert theme (UI consistent on all pages)

---

## 7. Game Mechanics / Algorithms

### 7.1 Physics
- Gravity: gradual acceleration on jump
- Ducking: reduces height only when grounded

### 7.2 Collision Detection
- AABB (Axis-Aligned Bounding Box)
- If player rectangle intersects obstacle rectangle → crash

### 7.3 Procedural Obstacle Generation
- Randomized interval (`45–150 frames`)
- Random selection of obstacle types
- Gliders use:
  ```js
  y = initialY + sin(waveTime) * amplitude

### 7.4 Score Logic
- When obstacle crosses the player (x + width < player.x)
- Increase: score and sessionObstacles

### 7.5 Speed Scaling
- gameSpeed += 0.0015 each frame
- Speed increases difficulty steadily

## 8. System Architecture

### 8.1 Frontend (Browser)

- Pages:
    - index.html → Main Menu
    - play.html → Canvas Game
    - load.html → Saved games list
    - save.html → Save game naming
    - delete.html → Delete game UI
    - howto.html → Instructions

- Scripts:
    - ui.js → Navigation, Save/Load/Delete logic
    - game.js → Entire game engine and animation loop

### 8.2 Backend (C# .NET API)

- Endpoints:
    - GET /api/games → List all saves
    - GET /api/games/{name} → Load save
    - POST /api/games/save → Create/update save
    - DELETE /api/games/{name} → Delete save

- Storage:
    - InMemoryGameStore (Dictionary<string, GameSave>)

## 9. User Interface (UI)

### Theme:

- Orange + Sand desert palette
- Rounded cards
- Large menu buttons
- Responsive layout for both main menu & pages
- Clean right-side game HUD:
- Saved Game Name
- Coins (Score)
- Obstacles Crossed
- Basic controls

## 10. Game Flow

### Main Menu

* **Start New Game** $\rightarrow$ `play.html`
* **Load Game** $\rightarrow$ `load.html` (Choose Save) $\rightarrow$ `play.html`
* **Save Game** $\rightarrow$ `save.html` (Provide Name) $\rightarrow$ `index.html` (Return to Main Menu)
* **Delete Saves** $\rightarrow$ `delete.html`
* **How To Play** $\rightarrow$ `howto.html`

### In Gameplay

* **Ready Screen** $\rightarrow$ Play
* **Run** $\rightarrow$ Survive
* **Crash** $\rightarrow$ Crash Panel:
    * Play Again
    * Save Game
    * Back to Main Menu

### Saving Logic

* Save creates/updates save
* Save always writes latest score
* Load always fetches from backend (no stale values)

## 11. Testing Overview

### All components tested:

- Player controls
- Collision system
- Spawning logic
- Difficulty scaling
- Save/Load/Delete APIs
- Play Again logic
- Multi-page routing
- UI behavior across all pages

## 12. Future Enhancements

- Character skins
- Power-ups (shield, slow motion)
- Boss birds / flying enemies
- Mobile/Touch controls
- Cloud save system
- Animations (sprite sheet)