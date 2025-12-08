# 🎮 Desert Hopper DINO 
A Complete ASP.NET Core 8 RESTful API with JWT Authentication + SQLite + EF Core

This backend system provides secure, persistent data storage and authenticated endpoints to support a video game such as the Desert Hopper Dino project. It implements modern backend engineering principles including authentication, CRUD operations, database integrations, middleware, and structured RESTful design.

---

# 📘 Table of Contents
- Overview  
- Features  
- Technologies Used  
- Architecture  
- Database Schema  
- Endpoints  
- Authentication Flow  
- Installation and Setup
- Controls 
- Version Compatibility 
- Documentation Included 

---

# 1. 🚀 Overview
This project implements a fully functional Web API in **ASP.NET Core 8**, providing:

- Persistent game data storage (SQLite DB)  
- Secure **JWT authentication**  
- Full **CRUD operations**  
- Structured REST endpoints  
- Data validation  
- Entity Framework Core ORM  
- Separation of concerns (Controllers → Services → DbContext)  
- Swagger API documentation  

It is built to satisfy the *“Video Game Backend API”* project requirement.

---

# 2. ⭐ Features

### 2.1. 🔐 Authentication System
- Register user  
- Login user  
- JWT generation  
- Secure password hashing + salting  
- Protected endpoints using `[Authorize]`  
- Delete account (authorized)

---

### 2.2. 💾 Game Save System
Each user has **one active game save**, containing:
- Coins  
- Obstacles passed  
- Timestamp  

Supports:
- Auto-load latest save  
- Create initial save on registration  
- Update save anytime  
- JSON responses only  

---

### 2.3. 🗄 Database & ORM
- SQLite relational database  
- EF Core 8.0.11  
- Fluent database migrations  
- Automatic schema creation  
- Strong typed entity classes  
- Navigation relationships

---

### 2.4. 🔗 REST API Endpoints
Clear, predictable routing:

#### Auth
- `POST /auth/register`
- `POST /auth/login`
- `DELETE /auth/delete`

#### Game Data
- `GET /games/latest`
- `POST /games/save`

All protected endpoints require valid JWT token.

---

### 2.5. 🛡 Middleware & Security
- JWT Bearer authentication  
- Authentication & Authorization middleware  
- Input validation  
- Error handling with proper HTTP codes  
- CORS enabled for frontend integration  

---

# 3. 🏗 Technologies Used

| Component | Version |
|----------|----------|
| .NET SDK | **8.0.416** |
| ASP.NET Core | 8 |
| EF Core | **8.0.11** |
| SQLite | Latest |
| Swagger | 6.5.0 |
| JWT Bearer Auth | 8.0.11 |

> ✔ Tested with .NET SDK 8.0.416  
> ✔ You may upgrade to .NET 10, but must update all package versions in `Backend/DesertHopperBackend.csproj`

---

# 4. 📁 Architecture

```
project-root/
│── index.html
│── pages/
│   ├── play.html
│   ├── save.html
│   ├── delete.html
│   ├── vlogs.html
│   ├── auth.html
│   └── howto.html
│── js/
│   ├── ui.js
│   ├── vlogs.js
│   └── game.js
│── css/
│   └── style.css
│── Backend/
│   ├── Controllers/
|   |   ├── AuthController.cs
|   |   └── GamesController.cs 
│   ├── Migrations/
|   |   ├── 20251204124116_InitialCreate.cs
|   |   ├── 20251204124116_InitialCreate.Designer.cs
|   |   └── AppDbContextModelSnapshot.cs 
│   ├── Models/
|   |   ├── AuthDtos.cs
|   |   ├── GameSave.cs
|   |   └── Users.cs
│   ├── Services
|   |   ├── TokenService.cs
|   |   ├── ITokenService.cs
|   |   ├── GameService.cs
|   |   └── IGameService.cs   
│   ├── Program.cs
|   ├── DesertHopperBackend.csproj
|   ├── appsettings.json
│   └── Data/AppDbContext.cs
│── videos/*
│── README.md
│── .gitignore
│── package.json
│── package-lock.json
│── GDD.md
└── TESTING.md
```

---

# 5. 🗃 Database Schema

### 5.1. Users Table
| Column | Type |
|--------|------|
| Id | int |
| Username | text |
| Email | text |
| PasswordHash | blob |
| PasswordSalt | blob |
| CreatedAt | datetime |

### 5.2. GameSaves Table
| Column | Type |
|--------|------|
| Id | int |
| UserId | int |
| Coins | int |
| ObstaclesPassed | int |
| UpdatedAt | datetime |

Relationship:  
**One User → One GameSave**

---

# 6. 🔗 REST Endpoints Documentation

## 6.1. 📌 Authentication Endpoints

---

### **POST /auth/register**

Registers a new user.

Request:
```json
{
  "username": "shubham",
  "email": "test@example.com",
  "password": "Secret123"
}
```

Response:
```json
{
  "token": "<jwt-token>"
}
```

### **POST /auth/login**

Authenticates user and returns JWT.

### **DELETE /auth/delete**

Authorization required.

Deletes:
- User
- Linked GameSave

## 6.2. 📌 Game Save Endpoints

---

### **GET /games/latest**

Returns authenticated user’s current game save.

Response:
```json
{
  "coins": 42,
  "obstaclesPassed": 19
}
```

### **POST /games/save**
Updates the user’s progress.

Request:
```json
{
  "coins": 50,
  "obstaclesPassed": 20
}
```

# 7. 🔐 Authentication Flow (JWT)

- User registers/logs in
- Backend generates JWT containing:
    - UserId
    - Username
    - Expiry
- Frontend stores token in  localStorage
- All protected calls use
- Authorization: Bearer ```token```
- Middleware validates token before executing handler

# 8. ⚙️ Installation and Setup

## 8.1. Install Dependencies
- cd Backend/
- dotnet restore

## 8.2. Apply Migrations (Optional if want to create a new db)
- cd Backend/
- dotnet ef migrations add InitialCreate
- dotnet ef database update

## 8.3. Run Server
- cd Backend/
- dotnet run
  - Backend will start at http://localhost:5000

## 8.4. Run Frontend

-  When you clone the repo go to the root folder that is Desert-Hopper and run:
    - npm install
    - npm start

- Navigate to http://localhost:6060

---

# 9. 🖱 Controls

| Action | Keys |
|--------|------|
| Jump | Space / ↑ |
| Duck | ↓ |
| Start Game | Space |
| Save Game | Button |
| Load Game | Button |

---

# 10. 📦 Version Compatibility
This backend is built and verified on:

- .NET SDK 8.0.416
- EF Core 8.0.11

``` You may migrate to .NET 10, but you must update all NuGet package versions to 10.* in the .csproj.```

---

# 11. 📝 Documentation Included
- **GDD.md** → Game Design Document  
- **TESTING.md** → Full Testing Report  
- **README.md** → Project Overview  

---

# 🌟 Author - Shubham Gupta

Happy Hopping! 🌵🎮