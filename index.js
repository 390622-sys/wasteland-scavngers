const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "data/public")));

// ── Page routes ──────────────────────────────────────────────────
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "data/public/index.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "data/public/register.html")));
app.get("/profile", (req, res) => res.sendFile(path.join(__dirname, "data/public/profile.html")));
app.get("/expedition", (req, res) => res.sendFile(path.join(__dirname, "data/public/expedition.html")));
app.get("/bunker-control", (req, res) => res.sendFile(path.join(__dirname, "data/public/bunker-control.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "data/public/admin-dashboard.html")));
app.get("/checkpoints", (req, res) => res.sendFile(path.join(__dirname, "data/public/checkpoints.html")));
app.get("/game-over", (req, res) => res.sendFile(path.join(__dirname, "data/public/game-over.html")));

// ── JSON helpers ─────────────────────────────────────────────────
function readJSON(filename) {
  const filePath = path.join(__dirname, "data", filename);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}
function writeJSON(filename, data) {
  fs.writeFileSync(path.join(__dirname, "data", filename), JSON.stringify(data, null, 2));
}

// ── API: users ───────────────────────────────────────────────────
app.get("/api/users", (req, res) => res.json(readJSON("users.json")));

app.post("/api/users", (req, res) => {
  const users = readJSON("users.json");
  const { username, email, password, faction, role, caps, level, createdAt } = req.body;

  if (!username || !email || !password || !faction) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(409).json({ error: "Callsign already taken. Choose another." });
  }
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: "Email already registered." });
  }

  const newUser = {
    id:        "user-" + Date.now(),
    username,
    email,
    password,
    faction:   faction || "Nomads",
    role:      role || "user",
    caps:      caps || 100,
    level:     level || 1,
    radiation: 0,
    kills:     0,
    mutations: 0,
    zonesCleared:   0,
    favoriteWeapon: "Bare Hands",
    survivalDays:   1,
    createdAt: createdAt || new Date().toISOString()
  };

  users.push(newUser);
  writeJSON("users.json", users);

  const { password: _pw, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

app.put("/api/users/:id", (req, res) => {
  let users = readJSON("users.json");
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "User not found" });
  users[idx] = { ...users[idx], ...req.body };
  writeJSON("users.json", users);
  res.json(users[idx]);
});

// ── API: survivors ───────────────────────────────────────────────
app.get("/api/survivors", (req, res) => res.json(readJSON("survivors.json")));

app.post("/api/survivors", (req, res) => {
  const list = readJSON("survivors.json");
  const item = { id: "surv-" + Date.now(), ...req.body };
  list.push(item);
  writeJSON("survivors.json", list);
  res.status(201).json(item);
});

app.put("/api/survivors/:id", (req, res) => {
  let list = readJSON("survivors.json");
  const idx = list.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  list[idx] = { ...list[idx], ...req.body };
  writeJSON("survivors.json", list);
  res.json(list[idx]);
});

// ── API: hazards ─────────────────────────────────────────────────
app.get("/api/hazards", (req, res) => res.json(readJSON("environmentalHazards.json")));

app.put("/api/hazards/:id", (req, res) => {
  let list = readJSON("environmentalHazards.json");
  const idx = list.findIndex(h => h.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  list[idx] = { ...list[idx], ...req.body };
  writeJSON("environmentalHazards.json", list);
  res.json(list[idx]);
});

// ── API: zones ───────────────────────────────────────────────────
app.get("/api/zones", (req, res) => res.json(readJSON("zones.json")));

app.post("/api/zones", (req, res) => {
  const zones = readJSON("zones.json");
  const newZone = { id: "zone-" + Date.now(), ...req.body };
  zones.push(newZone);
  writeJSON("zones.json", zones);
  res.status(201).json(newZone);
});

app.put("/api/zones/:id", (req, res) => {
  let zones = readJSON("zones.json");
  const idx = zones.findIndex(z => z.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Zone not found" });
  zones[idx] = { ...zones[idx], ...req.body };
  writeJSON("zones.json", zones);
  res.json(zones[idx]);
});

// ── API: loot items ──────────────────────────────────────────────
app.get("/api/loot", (req, res) => {
  const items = readJSON("loot_items.json");
  const { userId } = req.query;
  res.json(userId ? items.filter(i => i.userId === userId) : items);
});

app.post("/api/loot", (req, res) => {
  const items = readJSON("loot_items.json");
  const newItem = { id: "loot-" + Date.now(), foundAt: new Date().toISOString(), ...req.body };
  items.push(newItem);
  writeJSON("loot_items.json", items);
  res.status(201).json(newItem);
});

app.put("/api/loot/:id", (req, res) => {
  let items = readJSON("loot_items.json");
  const idx = items.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Item not found" });
  items[idx] = { ...items[idx], ...req.body };
  writeJSON("loot_items.json", items);
  res.json(items[idx]);
});

app.delete("/api/loot/:id", (req, res) => {
  let items = readJSON("loot_items.json");
  const idx = items.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Item not found" });
  items.splice(idx, 1);
  writeJSON("loot_items.json", items);
  res.json({ deleted: true });
});

// ── 404 fallback (MUST be last) ──────────────────────────────────
app.use((req, res) => res.status(404).sendFile(path.join(__dirname, "data/public/game-over.html")));

app.listen(PORT, () => console.log("Server running on port " + PORT));