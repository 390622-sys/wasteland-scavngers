const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "data/public")));

// Page routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "data/public/index.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "data/public/register.html")));
app.get("/profile", (req, res) => res.sendFile(path.join(__dirname, "data/public/profile.html")));
app.get("/expedition", (req, res) => res.sendFile(path.join(__dirname, "data/public/expedition.html")));
app.get("/bunker-control", (req, res) => res.sendFile(path.join(__dirname, "data/public/bunker-control.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "data/public/admin-dashboard.html")));
app.get("/checkpoints", (req, res) => res.sendFile(path.join(__dirname, "data/public/checkpoints.html")));
app.get("/game-over", (req, res) => res.sendFile(path.join(__dirname, "data/public/game-over.html")));

// JSON data helpers
function readJSON(filename) {
  const filePath = path.join(__dirname, "data", filename);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}
function writeJSON(filename, data) {
  fs.writeFileSync(path.join(__dirname, "data", filename), JSON.stringify(data, null, 2));
}

// API routes - users
app.get("/api/users", (req, res) => res.json(readJSON("users.json")));
app.post("/api/users", (req, res) => {
  const users = readJSON("users.json");
  const newUser = { id: "user-" + Date.now(), ...req.body };
  users.push(newUser);
  writeJSON("users.json", users);
  res.status(201).json(newUser);
});
app.put("/api/users/:id", (req, res) => {
  let users = readJSON("users.json");
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "User not found" });
  users[idx] = { ...users[idx], ...req.body };
  writeJSON("users.json", users);
  res.json(users[idx]);
});

// API routes - survivors
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
  const idx = list.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  list[idx] = { ...list[idx], ...req.body };
  writeJSON("survivors.json", list);
  res.json(list[idx]);
});

// API routes - hazards
app.get("/api/hazards", (req, res) => res.json(readJSON("environmentalHazards.json")));
app.put("/api/hazards/:id", (req, res) => {
  let list = readJSON("environmentalHazards.json");
  const idx = list.findIndex((h) => h.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  list[idx] = { ...list[idx], ...req.body };
  writeJSON("environmentalHazards.json", list);
  res.json(list[idx]);
});

// 404 fallback
app.use((req, res) => res.status(404).sendFile(path.join(__dirname, "data/public/game-over.html")));

app.listen(PORT, () => console.log("Server running on port " + PORT));