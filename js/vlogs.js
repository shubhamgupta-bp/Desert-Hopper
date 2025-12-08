// ===============================
// Dino Vlogs Config
// ===============================

const DINO_VLOGS = [
  {
    id: "recap",
    title: "Previously in Dino’s Chaotic Life…",
    tag: "Recap",
    price: 1,
    desc: "A lightning-fast rewind of Dino’s entire drama before the real adventure begins.",
    file: "../videos/clip1.mp4"
  },
  {
    id: "born",
    title: "Look Who Hatched! Baby Dino Arrives",
    tag: "Cute",
    price: 7,
    desc: "Tiny, clueless, and adorable — Dino pops into the world for the very first time.",
    file: "../videos/clip2.mp4"
  },
  {
    id: "bugs_light",
    title: "Glow Bugs & Life Lessons with Dad",
    tag: "Emotional",
    price: 10,
    desc: "Dino learns courage while getting mesmerized by magical glowing insects.",
    file: "../videos/clip3.mp4"
  },
  {
    id: "karma",
    title: "When Karma Hits Back HARD",
    tag: "Silly",
    price: 6,
    desc: "A smug creature laughs at Dino… but life has its own hilarious ways of balancing things.",
    file: "../videos/clip4.mp4"
  },
  {
    id: "meet_human",
    title: "Danger! Dino Meets a Wild Human",
    tag: "Shock",
    price: 10,
    desc: "Dino encounters a tiny but terrifying human who scares the fossils out of him.",
    file: "../videos/clip5.mp4"
  },
  {
    id: "fruit_trip",
    title: "Dino’s Fruit Trip Gone Too Far",
    tag: "Chaotic",
    price: 6,
    desc: "One strange fruit + Dino + his new human friend = a legendary cosmic trip.",
    file: "../videos/clip6.mp4"
  },
  {
    id: "trex_help",
    title: "How I Accidentally Befriended T-Rexes",
    tag: "Adventure",
    price: 8,
    desc: "Dino helps some tough T-Rex cowboys and unexpectedly joins their squad.",
    file: "../videos/clip7.mp4"
  },
  {
    id: "buffalo_job",
    title: "My New Job: Waking Up Buffaloes?!",
    tag: "Wild",
    price: 7,
    desc: "The T-Rex gang gives Dino his first mission, and these buffaloes are NOT morning people.",
    file: "../videos/clip8.mp4"
  },
  {
    id: "human_tribute",
    title: "Human Friend’s Dino-Style Tribute",
    tag: "Tribute",
    price: 5,
    desc: "Dino’s human companion dresses up as a T-Rex to honor their new dino friends.",
    file: "../videos/clip9.mp4"
  }
];

// User state
let vlogCoins = 0;
let vlogObstacles = 0;

// ===============================
// Initialize Vlog Page
// ===============================
async function initVlogsPage() {
  ensureAuthenticatedInPages();

  // username
  const username = localStorage.getItem("username") || "-";
  document.getElementById("vlog-username").textContent = username;

  // fetch latest game state
  try {
    const res = await authFetch(`${API_BASE}/games/latest`);
    if (res.ok) {
      const data = await res.json();
      vlogCoins = data.coins ?? 0;
      vlogObstacles = data.obstaclesPassed ?? 0;
    }
  } catch {
    vlogCoins = 0;
    vlogObstacles = 0;
  }

  updateVlogCoinsDisplay();
  renderVlogGrid();
}

// ===============================
// Render Grid Cards
// ===============================
function renderVlogGrid() {
  const grid = document.getElementById("vlog-grid");
  grid.innerHTML = "";

  DINO_VLOGS.forEach(v => {
    const card = document.createElement("article");
    card.className = "dv-card";

    card.innerHTML = `
      <div class="dv-thumb">
        <div class="dv-thumb-dunes"></div>
        <span class="dv-thumb-icon">🎬</span>
      </div>

      <span class="dv-tag">${v.tag}</span>

      <h3 class="dv-card-title">${v.title}</h3>
      <p class="dv-card-desc">${v.desc}</p>

      <div class="dv-card-bottom">
        <span class="dv-price">Price: ${v.price} coins</span>
        <button class="btn primary dv-watch-btn" onclick="buyAndPlayVlog('${v.id}')">
          Watch Clip
        </button>
      </div>
    `;

    grid.appendChild(card);
  });
}

// ===============================
// Buy & Play Vlog
// ===============================
async function buyAndPlayVlog(id) {
  const vlog = DINO_VLOGS.find(v => v.id === id);
  if (!vlog) return;

  if (vlogCoins < vlog.price) {
    alert("You do not have enough coins!");
    return;
  }

  vlogCoins -= vlog.price;
  updateVlogCoinsDisplay();

  // save updated coins
  try {
    await authFetch(`${API_BASE}/games/save`, {
      method: "POST",
      body: JSON.stringify({
        coins: vlogCoins,
        obstaclesPassed: vlogObstacles
      })
    });
  } catch (e) {
    console.warn("Failed saving progress, but playing vlog anyway.");
  }

  openVlogModal(vlog);
}

// ===============================
// Modal Handling
// ===============================
function openVlogModal(vlog) {
  const modal = document.getElementById("vlog-modal");
  const title = document.getElementById("vlog-modal-title");
  const videoContainer = document.getElementById("vlog-video-container");

  title.textContent = vlog.title;

  videoContainer.innerHTML = `
    <video class="dv-video" autoplay controls>
      <source src="${vlog.file}" type="video/mp4">
    </video>
  `;

  modal.classList.remove("hidden");
  modal.style.display = "flex";
}

function closeVlogModal() {
  const modal = document.getElementById("vlog-modal");
  const videoContainer = document.getElementById("vlog-video-container");

  videoContainer.innerHTML = "";
  modal.classList.add("hidden");
  modal.style.display = "none";
}

// ===============================
// UI Helper
// ===============================
function updateVlogCoinsDisplay() {
  document.getElementById("vlog-coins").textContent = vlogCoins;
}
