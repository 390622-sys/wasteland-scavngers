// ============================================================
//  PASTE THIS OVER YOUR EXISTING app.post("/api/users") ROUTE
//  in index.js — everything else in index.js stays the same
// ============================================================

app.post("/api/users", (req, res) => {
  const users = readJSON("users.json");
  const { username, email, password, faction, role, caps, level, createdAt } = req.body;

  // ── Check for missing fields ──────────────────────────────
  if (!username || !email || !password || !faction) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // ── Check for duplicate username ──────────────────────────
  const dupName = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (dupName) {
    return res.status(409).json({ error: "Callsign already taken. Choose another." });
  }

  // ── Check for duplicate email ─────────────────────────────
  const dupEmail = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (dupEmail) {
    return res.status(409).json({ error: "Email already registered." });
  }

  // ── Build the new user object (6 fields = well above the 4 required) ──
  const newUser = {
    id:        "user-" + Date.now(),
    username:  username,
    email:     email,
    password:  password,          // NOTE: plain text is fine for this project
    faction:   faction || "Nomads",
    role:      role || "user",
    caps:      caps || 100,       // starting currency
    level:     level || 1,
    createdAt: createdAt || new Date().toISOString()
  };

  users.push(newUser);
  writeJSON("users.json", users);

  // ── Don't send the password back to the browser ───────────
  const { password: _pw, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});