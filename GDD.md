# 🎮 Desert Hopper – Backend API Game Design Document (GDD)

## 1. Introduction
This document describes the backend system for the Desert Hopper game, designed as a RESTful API using ASP.NET Core 8. The backend is responsible for secure user authentication, persistent storage of game data, and structured endpoints that the frontend game interacts with.

It fulfills all requirements of the **“Individual Project: Video Game Backend API”** module.

---

# 2. System Summary

The backend provides:
- JWT-secured authentication
- SQLite database integration
- CRUD operations for game progression
- Data validation
- Service-layer architecture
- Entity Framework Core ORM
- JSON-based responses

---

# 3. Core Entities

## 3.1 User
Represents an authenticated player.

Fields:
- Id  
- Username  
- Email  
- PasswordHash  
- PasswordSalt  
- CreatedAt  

## 3.2 GameSave
Stores the game progress for one user.

Fields:
- Id  
- UserId  
- Coins  
- ObstaclesPassed  
- UpdatedAt  

Relationship:  
**1 User → 1 GameSave**

---

# 4. Backend Architecture

### Layers:
1. **Controllers**  
   Handle HTTP traffic and request validation.

2. **Services**  
   Business logic (authentication, hashing, CRUD operations).

3. **Data Layer**  
   EF Core DbContext + Migrations.

4. **Models/DTOs**  
   Strong typing for request/response structures.

---

# 5. API Design

## Authentication
Endpoints:
- Register  
- Login  
- Delete Account  

### Features:
- Password hashing with HMACSHA512  
- JWT tokens  
- Token expiry  
- Protection via `[Authorize]`

---

## Game Save Management

Endpoints:
- Get latest save  
- Save (create/update)

Flow:
1. When a user registers, a default save (0 coins, 0 obstacles) is created.
2. Frontend calls `/games/save` whenever player updates progress.
3. Backend always overwrites old save for that user.

---

# 6. Database Schema

Tables:
- Users  
- GameSaves  

Constraints:
- FK(UserId)  
- Unique email & username (case-insensitive)  

---

# 7. Security Considerations

- No plaintext passwords  
- Strong hashing algorithm  
- JWT signature validation  
- Expiry enforcement  
- Authorization middleware  
- Input validation  

---

# 8. Learning Outcomes Demonstrated

This backend demonstrates:

### ✔ Understanding Databases  
SQLite schema, relational relationships, migrations.

### ✔ Entity Framework  
DbContext, LINQ, queries, async DB operations.

### ✔ CRUD Operations  
Create / Read / Update / Delete via REST endpoints.

### ✔ JSON Serialization  
Controllers return structured JSON.

### ✔ Routing and API Design  
REST principles applied consistently.

### ✔ Authentication Basics  
JWT generation & validation.

### ✔ Securing Endpoints  
Authorize attributes & middleware.

### ✔ Error Handling  
HTTP status codes, validation messages.

---

# 9. Suggested Features Completed
- User registration  
- User login  
- Protected endpoints  
- Game entity management  
- Error handling  
- Data validation  
- Automatic save loading  

*Optional items included:*  
- Swagger documentation  

---

# 10. Conclusion
The Desert Hopper Backend API is a robust, secure, and scalable server suitable for modern game applications. It follows good architectural practices and fulfills all academic project requirements for a game-oriented backend system.