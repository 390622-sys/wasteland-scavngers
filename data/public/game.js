// ============================================================
//  WASTELAND SCAVENGER — game.js
//  Shared game-state utilities (expanded each checkpoint)
// ============================================================

// ── Default game state ───────────────────────────────────────
const DEFAULT_STATE = {
  day:       1,
  survivors: 0,
  food:      20,
  water:     20,
  scrap:     5,
  caps:      10,
  threat:    "LOW",
  inventory: [],
};

// ── State helpers ────────────────────────────────────────────
function getState() {
  return JSON.parse(localStorage.getItem("gameState") || "null") || { ...DEFAULT_STATE };
}

function saveState(state) {
  localStorage.setItem("gameState", JSON.stringify(state));
}

function resetState() {
  localStorage.removeItem("gameState");
  localStorage.removeItem("currentUser");
  window.location.href = "register.html";
}

// ── Navigation helper — redirect to game-over with reason ────
function triggerGameOver(reason = "unknown") {
  window.location.href = `game-over.html?reason=${encodeURIComponent(reason)}`;
}

// Expose globally
window.WastelandGame = { getState, saveState, resetState, triggerGameOver };