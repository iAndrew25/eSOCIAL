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
  { username: "alice", avatarUrl: null },
  { username: "bob", avatarUrl: null },
  { username: "carol", avatarUrl: null },
  { username: "dave", avatarUrl: null },
  { username: "erin", avatarUrl: null },
];

let posts = [
  {
    id: "1",
    username: "alice",
    description: "Morning hike above the clouds...",
    imageUrl:
      "http://localhost:3000/uploads/675_20207430314_a8b0c7ed1b_b_800_600_nofilter.jpg",
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
    imageUrl:
      "http://localhost:3000/uploads/677_22899925284_7a483d676c_c_800_600_nofilter.jpg",
  },
  {
    id: "4",
    username: "dave",
    description: "New setup finally complete.",
    imageUrl:
      "http://localhost:3000/uploads/65535_49953967751_3cd51369d4_b_800_600_nofilter.jpg",
  },
  {
    id: "5",
    username: "erin",
    description: "Anyone else swamped this week? Text-only post.",
  },
];

// Expose for tests to reset state between runs
app._resetState = () => {
  users = [
    { username: "alice", avatarUrl: null },
    { username: "bob", avatarUrl: null },
    { username: "carol", avatarUrl: null },
    { username: "dave", avatarUrl: null },
    { username: "erin", avatarUrl: null },
  ];
  posts = [
    {
      id: "1",
      username: "alice",
      description: "Morning hike above the clouds...",
      imageUrl:
        "http://localhost:3000/uploads/675_20207430314_a8b0c7ed1b_b_800_600_nofilter.jpg",
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
      imageUrl:
        "http://localhost:3000/uploads/677_22899925284_7a483d676c_c_800_600_nofilter.jpg",
    },
    {
      id: "4",
      username: "dave",
      description: "New setup finally complete.",
      imageUrl:
        "http://localhost:3000/uploads/65535_49953967751_3cd51369d4_b_800_600_nofilter.jpg",
    },
    {
      id: "5",
      username: "erin",
      description: "Anyone else swamped this week? Text-only post.",
    },
  ];
};

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

  const newUser = { username, avatarUrl: null };
  users = [...users, newUser];
  res.status(201).json({ user: newUser, created: true });
});

app.put("/users/:username/avatar", upload.single("avatar"), (req, res) => {
  const { username } = req.params;
  const user = users.find((u) => u.username === username);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  if (!req.file) {
    res.status(400).json({ error: "No image file provided" });
    return;
  }

  // Rename the uploaded file to a predictable avatar-{username}.ext name
  const ext = path.extname(req.file.originalname) || ".jpg";
  const avatarFilename = `avatar-${username}${ext}`;
  const avatarPath = path.join(UPLOADS_DIR, avatarFilename);

  // Remove old avatar files for this user (any extension)
  try {
    const existingFiles = fs.readdirSync(UPLOADS_DIR);
    for (const file of existingFiles) {
      if (file.startsWith(`avatar-${username}.`)) {
        fs.unlinkSync(path.join(UPLOADS_DIR, file));
      }
    }
  } catch {
    // ignore cleanup errors
  }

  fs.renameSync(req.file.path, avatarPath);

  const avatarUrl = `http://localhost:3000/uploads/${avatarFilename}?t=${Date.now()}`;
  user.avatarUrl = avatarUrl;

  res.status(200).json({ avatarUrl });
});

app.get("/posts", (req, res) => {
  const { username } = req.query;

  const postsWithAvatars = (
    typeof username === "string" && username.length > 0
      ? posts.filter((post) => post.username === username)
      : posts
  ).map((post) => {
    const user = users.find((u) => u.username === post.username);
    return {
      ...post,
      avatarUrl: user?.avatarUrl ?? null,
    };
  });

  res.json(postsWithAvatars);
});

app.post("/posts", upload.single("image"), (req, res) => {
  const { username, description } = req.body ?? {};
  const imageUrl = req.file
    ? `http://localhost:3000/uploads/${req.file.filename}`
    : undefined;

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

  const user = users.find((u) => u.username === username);
  res.status(201).json({ ...post, avatarUrl: user?.avatarUrl ?? null });
});

app.delete("/posts/:id", (req, res) => {
  posts = posts.filter((post) => post.id !== req.params.id);
  res.status(204).end();
});

module.exports = app;
