// server.js
const express = require("express");
const path = require("path");

const app = express();

// 👉 If your Vite build outputs to "dist" (default), keep "dist".
// If your built folder is different, change it here.
const buildPath = path.join(__dirname, "dist");

// Serve static files
app.use(express.static(buildPath));

// SPA fallback so /admin (and any deep link) works:
app.get("*", (_req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Heroku gives us PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
