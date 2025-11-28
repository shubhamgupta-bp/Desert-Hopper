# 🌵 Desert Hopper – Full Stack 2D Endless Runner Game

Desert Hopper is a **full-stack browser-based 2D dodging game** built using:

- 🎨 **HTML5 Canvas** (game rendering)
- 🎮 **JavaScript** (game engine + UI)
- 🔊 **Tone.js** (sound effects)
- 🟧 **CSS + Tailwind** (UI design)
- ⚙️ **Node.js (npm start)** for local hosting
- 🖥️ **C# .NET Backend** (Save / Load / Delete game system)

This project features **beautiful UI**, a **multi-page menu system**, and a **complete save-load-update-delete backend**.

---

# 🚀 Features

### 🎮 Gameplay
- Jump, Duck, Survive  
- Dodge various obstacles:
  - Cactus
  - Rock
  - Bird
  - Log
  - Tumbleweed
  - Glider (sine-wave flying)
- Increasing difficulty
- Smooth physics
- Parallax clouds
- Polished desert color theme

### 💾 Save System (Backend)
- Save a game with any name  
- Update an existing game  
- Load saved games  
- Delete saved games  
- Fully backed by a C# API

### 🧭 Multi-Page UI
- Main Menu  
- Play Page  
- Load Game Page  
- Save Page  
- Delete Page  
- How-To Page  
- Crash Menu (Play Again / Save / Main Menu)

### 🛠 Tech Used
- HTML, CSS, JS  
- TailwindCSS  
- Node.js (live server)  
- .NET Web API  
- Dictionary-based InMemory storage  
- Tone.js audio

---

## 📁 Folder Structure

```
project-root/
│── index.html
│── pages/
│   ├── play.html
│   ├── load.html
│   ├── save.html
│   ├── delete.html
│   └── howto.html
│── js/
│   ├── ui.js
│   └── game.js
│── css/
│   └── style.css
│── Backend/
│   ├── Controllers/GamesController.cs
│   ├── Models/GameSave.cs
│   ├── Services
|   |   ├── GameService.cs
|   |   └── IGameService.cs   
│   ├── Program.cs
|   ├── DesertHopperBackend.csproj
│   └── Data/InMemoryGameStore.cs
|
│── README.md
│── .gitignore
│── package.json
│── package-lock.json
│── GDD.md
└── TESTING.md
```

# How to Run

### 1. Backend

- Open backend folder → run:
    - dotnet run

- Backend will start at http://localhost:5000

### 2. Frontend

-  When you clone the repo go to the root folder that is Desert-Hopper and run:
    - npm install
    - npm run

- Navigate to http://localhost:6060


---

# 🖱 Controls

| Action | Keys |
|--------|------|
| Jump | Space / ↑ |
| Duck | ↓ |
| Start Game | Space |
| Save Game | Button |
| Load Game | Button |

---

# 📡 API Endpoints (Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/games | Get all saves |
| GET | /api/games/{name} | Get a specific save |
| POST | /api/games/save | Create or update a save |
| DELETE | /api/games/{name} | Delete a save |

---

# 🧠 Learning Outcomes

This project demonstrates:

- Game physics programming  
- Frontend-backend integration  
- Procedural generation  
- Collision detection  
- Multi-page routing  
- UI/UX design  
- LocalStorage usage  
- Testing & debugging  
- Clean code + architecture  
- Git & version control  

---

# 📝 Documentation Included
- **GDD.md** → Game Design Document  
- **TESTING.md** → Full Testing Report  
- **README.md** → Project Overview  

---

Happy Hopping! 🌵🎮