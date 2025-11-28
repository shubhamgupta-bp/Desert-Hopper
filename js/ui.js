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

// ---------------- Save Redirect (Store score first) ----------------
function goToSavePage() {
  // Score comes from game.js global scope
  localStorage.setItem("pendingScore", score);
  goTo("save.html");
}


// ---------------- Load Page ----------------
function loadSavedList() {
  fetch("http://localhost:5000/api/games")
    .then(r => r.ok ? r.json() : [])
    .then(data => {
      const ul = document.getElementById("saved-list");
      if (!ul) return;

      ul.innerHTML = "";

      if (!data.length) {
        ul.innerHTML = "<li>No Saved Games</li>";
        return;
      }

      data.forEach(s => {
        const li = document.createElement("li");

        const btn = document.createElement("button");
        btn.className = "btn accent";
        btn.textContent = "Load";
        btn.onclick = () => {
          localStorage.setItem("loadedGame", s.name);
          window.location.href = "play.html";
        };

        li.innerHTML = `<div><strong>${s.name}</strong> — ${s.coins} coins</div>`;
        li.appendChild(btn);
        ul.appendChild(li);
      });
    });
}

// ---------------- Delete Page ----------------
function loadDeleteList() {
  fetch("http://localhost:5000/api/games")
    .then(r => r.ok ? r.json() : [])
    .then(data => {
      const ul = document.getElementById("delete-list");
      if (!ul) return;

      ul.innerHTML = "";

      if (!data.length) {
        ul.innerHTML = "<li>No Saved Games</li>";
        return;
      }

      data.forEach(s => {
        const li = document.createElement("li");

        const delBtn = document.createElement("button");
        delBtn.className = "btn danger";
        delBtn.textContent = "Delete";
        delBtn.onclick = () => deleteGame(s.name);

        li.innerHTML = `<div><strong>${s.name}</strong> — ${s.coins} coins</div>`;
        li.appendChild(delBtn);
        ul.appendChild(li);
      });
    });
}

function deleteGame(name) {
  const ok = confirm(
    `⚠ WARNING\n\nYou are about to DELETE:\n"${name}"\nThis cannot be undone.\n\nPress OK to delete.`
  );
  if (!ok) return;

  fetch(`http://localhost:5000/api/games/${name}`, {
    method: "DELETE"
  }).then(r => {
    if (r.ok) {
      alert(`Deleted "${name}".`);
      loadDeleteList();
    } else {
      alert("Error: Unable to delete save.");
    }
  });
}

// ---------------- Save Page ----------------
function saveGameName() {
  const name = document.getElementById("save-name").value.trim();
  if (!name) {
    alert("Please enter a name.");
    return;
  }

  const coins = localStorage.getItem("pendingScore") || 0;

  localStorage.setItem("saveQueuedName", name);
  localStorage.setItem("saveQueuedCoins", coins);

  window.location.href = "play.html";
}


// ---------------- Play Again ----------------
function playAgain() {
  localStorage.setItem("playAgain", "1");
  window.location.href = "play.html";
}
