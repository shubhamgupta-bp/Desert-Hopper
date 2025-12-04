const API_BASE = "http://localhost:5000/api";

// ---------------- Navigation ----------------
function goTo(page) {
  const inPages = window.location.pathname.includes("/pages/");
  if (page.startsWith("../")) {
    window.location.href = page;
  } else if (inPages) {
    window.location.href = page;
  } else {
    window.location.href = "pages/" + page;
  }
}

// ---------------- Auth Helpers ----------------
function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }
  return fetch(url, {
    ...options,
    headers
  });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  goTo("auth.html");
}

function ensureAuthenticatedAtRoot() {
  if (!localStorage.getItem("token")) {
    goTo("auth.html");
  }
}

function ensureAuthenticatedInPages() {
  if (!localStorage.getItem("token")) {
    window.location.href = "auth.html";
  }
}

// ---------------- Auth Page Logic ----------------
function showLogin() {
  document.getElementById("tab-login").classList.add("active");
  document.getElementById("tab-register").classList.remove("active");
  document.getElementById("login-form").style.display = "block";
  document.getElementById("register-form").style.display = "none";
}

function showRegister() {
  document.getElementById("tab-login").classList.remove("active");
  document.getElementById("tab-register").classList.add("active");
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "block";
}

async function register() {
  const username = document.getElementById("reg-username").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value.trim();
  const err = document.getElementById("reg-error");
  err.textContent = "";

  if (!username || !email || !password) {
    err.textContent = "All fields are required.";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    if (!res.ok) {
      const txt = await res.text();
      err.textContent = txt || "Registration failed.";
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    window.location.href = "../index.html";
  } catch (e) {
    err.textContent = "Error connecting to server.";
  }
}

async function login() {
  const identifier = document.getElementById("login-identifier").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const err = document.getElementById("login-error");
  err.textContent = "";

  if (!identifier || !password) {
    err.textContent = "Both fields are required.";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernameOrEmail: identifier, password })
    });

    if (!res.ok) {
      const txt = await res.text();
      err.textContent = txt || "Login failed.";
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    window.location.href = "../index.html";
  } catch (e) {
    err.textContent = "Error connecting to server.";
  }
}

// ---------------- Profile & Coins ----------------
async function loadUserProfileAndCoins() {
  const usernameEl = document.getElementById("menu-username");
  const coinsEl = document.getElementById("menu-coins");
  if (!usernameEl || !coinsEl) return;

  const username = localStorage.getItem("username");
  if (username) usernameEl.textContent = username;

  try {
    const res = await authFetch(`${API_BASE}/games/latest`);
    if (!res.ok) {
      coinsEl.textContent = "0";
      return;
    }
    const data = await res.json();
    coinsEl.textContent = data.coins ?? 0;
  } catch {
    coinsEl.textContent = "0";
  }
}

function loadUsernameIntoSidebar() {
  const el = document.getElementById("sidebar-username");
  if (el) {
    const username = localStorage.getItem("username") || "-";
    el.textContent = username;
  }
}

// ---------------- Save Page ----------------
async function saveCurrentProgress() {
  const status = document.getElementById("save-status");
  status.textContent = "";

  // get from localStorage (last pending score)
  const pendingScore = Number(localStorage.getItem("pendingScore") || "0");
  const pendingObstacles = Number(localStorage.getItem("pendingObstacles") || "0");

  if (!pendingScore && !pendingObstacles) {
    status.textContent = "No current progress found to save.";
    return;
  }

  try {
    const res = await authFetch(`${API_BASE}/games/save`, {
      method: "POST",
      body: JSON.stringify({
        coins: pendingScore,
        obstaclesPassed: pendingObstacles
      })
    });

    if (!res.ok) {
      status.textContent = "Save failed.";
      return;
    }

    status.style.color = "#059669";
    status.textContent = "Saved successfully!";
    localStorage.removeItem("pendingScore");
    localStorage.removeItem("pendingObstacles");

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 800);
  } catch {
    status.textContent = "Error contacting server.";
  }
}

// ---------------- Delete Account ----------------
async function deleteAccount() {
  const status = document.getElementById("delete-status");
  status.textContent = "";

  const ok = confirm(
    "⚠ WARNING\n\nThis will permanently delete your account and all saves.\nThis cannot be undone.\n\nPress OK to continue."
  );
  if (!ok) return;

  try {
    const res = await authFetch(`${API_BASE}/auth/account`, { method: "DELETE" });

    if (!res.ok) {
      status.textContent = "Could not delete account.";
      return;
    }

    // logout and go to auth
    logout();
  } catch {
    status.textContent = "Error contacting server.";
  }
}

// ---------------- Play Again / Save redirect ----------------
function goToSavePage() {
  // game.js will set pendingScore & pendingObstacles before navigation when needed.
  goTo("save.html");
}

function playAgain() {
  localStorage.setItem("playAgain", "1");
  window.location.href = "play.html";
}
