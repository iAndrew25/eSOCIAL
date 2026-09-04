const fs = require("fs");
const path = require("path");

const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();

const UPLOADS_DIR = path.join(__dirname, "uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(UPLOADS_DIR));

let users = [
  { username: "alice" },
  { username: "bob" },
  { username: "carol" },
  { username: "dave" },
  { username: "erin" },
];

let posts = [
  {
    id: "1",
    username: "alice",
    description: "Morning hike above the clouds.",
    imageUrl: "https://loremflickr.com/800/600?lock=1",
  },
  {
    id: "2",
    username: "bob",
    description: "Just a quick text update, no photo today.",
  },
  {
    id: "3",
    username: "carol",
    description: "Sunset colors were unreal tonight.",
    imageUrl: "https://loremflickr.com/800/600?lock=3",
  },
  {
    id: "4",
    username: "dave",
    description: "New setup finally complete.",
    imageUrl: "https://loremflickr.com/800/600?lock=4",
  },
  {
    id: "5",
    username: "erin",
    description: "Anyone else swamped this week? Text-only post.",
  },
];

app.post("/login", (req, res) => {
  const rawUsername = (req.body ?? {}).username;
  const username = typeof rawUsername === "string" ? rawUsername.trim() : "";

  if (!username) {
    res.status(400).json({ error: "username is required" });
    return;
  }

  const existingUser = users.find((user) => user.username === username);

  if (existingUser) {
    res.status(200).json({ user: existingUser, created: false });
    return;
  }

  const newUser = { username };
  users = [...users, newUser];
  res.status(201).json({ user: newUser, created: true });
});

app.get("/posts", (req, res) => {
  const { username } = req.query;

  if (typeof username === "string" && username.length > 0) {
    res.json(posts.filter((post) => post.username === username));
    return;
  }

  res.json(posts);
});

app.post("/posts", upload.single("image"), (req, res) => {
  const { username, description } = req.body ?? {};
  // Uploaded files are served from `/uploads`. We store a host-relative path so
  // each client can resolve it against its own base URL (localhost vs 10.0.2.2).
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  if (!username || (!description && !imageUrl)) {
    res
      .status(400)
      .json({ error: "username and description or image are required" });
    return;
  }

  const post = {
    id: Date.now().toString(),
    username,
    description: description ?? "",
    ...(imageUrl ? { imageUrl } : {}),
  };

  posts = [post, ...posts];
  res.status(201).json(post);
});

app.delete("/posts/:id", (req, res) => {
  posts = posts.filter((post) => post.id !== req.params.id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Feed server running on http://localhost:${PORT}`);
});
