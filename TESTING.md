# 🧪 Desert Hopper Backend API – Complete Testing Document

This document contains all functional, integration, security, and validation tests performed on the backend API.

---

# 1. Environment Tests

| Test | Expected Result |
|------|------------------|
| Run `dotnet --info` | .NET SDK 8.0.x installed |
| `dotnet restore` | All packages restored |
| `dotnet ef database update` | SQLite DB created with correct tables |

---

# 2. Database Tests

### 2.1 Migration Tests
- Migration applies without errors  
- `Users` table exists  
- `GameSaves` table exists  
- FK relationship created  

### 2.2 Data Consistency
| Scenario | Expected |
|----------|----------|
| Insert new user | Automatically creates GameSave |
| Foreign key delete | Deleting user deletes save |
| Multiple updates | Save row updates without duplication |

---

# 3. Authentication Tests

## 3.1 Registration
| Test | Steps | Expected |
|------|--------|----------|
| Blank fields | Submit empty | 400 Bad Request |
| Invalid email | Enter wrong format | 400 |
| Existing email | Repeat registration | 409 Conflict |
| Valid registration | Submit valid data | JWT token returned |

---

## 3.2 Login
| Test | Steps | Expected |
|------|--------|----------|
| Wrong password | Wrong pass | 401 Unauthorized |
| Wrong email | Not found | 401 |
| Valid login | Correct creds | JWT token returned |

---

## 3.3 Token Tests
| Case | Expected |
|-------|----------|
| Missing token | 401 Unauthorized |
| Expired token | 401 |
| Tampered token | 401 |
| Valid token | Gains access |

---

# 4. Game Save API Tests

## 4.1 GET /games/latest
| Test | Expected |
|------|----------|
| No token | 401 |
| Valid token | Returns user save |
| Deleted account | 404 |

---

## 4.2 POST /games/save
| Test | Expected |
|------|----------|
| Missing body | 400 |
| Invalid values | 400 |
| Valid request | Saves new values |
| Save persists | GET returns updated values |

---

# 5. Security Tests

### 5.1 SQL Injection
Attempt:
"email": "' OR 1=1 --"

Expected:  
**401 Unauthorized**  
No table corruption.

### 5.2 JWT Tampering
Modify token payload.  
Expected:  
**401 Invalid signature**

---

# 6. Error Handling Tests

| Scenario | Expected Output |
|----------|------------------|
| Backend offline | Frontend shows “Server Error” |
| Missing fields | 400 |
| Null reference | Returns 500 safely |
| DB locked | Fails gracefully |

---

# 7. Swagger Tests

Checked:
- Models appear correctly  
- Endpoints show correct HTTP methods  
- Example schemas load  
- Try-It-Out works with valid JWT  
- Further used POSTMAN app to test endpoints API by requesting for a response to the api endpoint.

---

# 8. Integration Tests (Frontend → Backend)

| Interaction | Result |
|-------------|---------|
| Login → loads main menu | Success |
| Play game → Save → Refresh | Correct coins restored |
| Save → Close backend → Restart → Load | Data persists |
| Delete account → Try using token | Unauthorized |

---

# 9. Final Verification Checklist

✔ Authentication stable  
✔ Database persistent  
✔ CRUD operations correct  
✔ JSON output validated  
✔ Authorization enforced  
✔ No duplicate saves  
✔ Swagger working  
✔ Error handling implemented  
✔ Secure hashing  
✔ Full alignment with project requirements  

---

# ✔ Overall Result
**Backend API is fully tested and conforms to all requirements.