const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const DB_FILE = "posts.json";

function loadPosts() {
  if (!fs.existsSync(DB_FILE)) return [];
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function savePosts(posts) {
  fs.writeFileSync(DB_FILE, JSON.stringify(posts, null, 2));
}

app.get("/posts", (req, res) => {
  res.json(loadPosts());
});

app.post("/posts", (req, res) => {
  const posts = loadPosts();
  const { author, text } = req.body;
  if (!author || !text) return res.status(400).json({ error: "Missing author or text" });
  posts.push({ author: author.slice(0,30), text: text.slice(0,500), time: Date.now() });
  savePosts(posts);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on port", PORT));
