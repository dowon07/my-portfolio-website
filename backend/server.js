const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const db = require('./database');
const fs = require('fs');

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || '0.0.0.0';
const frontendDistPath = path.join(__dirname, 'dist');
const uploadPath = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(__dirname, 'uploads');

fs.mkdirSync(uploadPath, { recursive: true });

const allowedOrigins = new Set(
  [
    process.env.CORS_ORIGIN,
    process.env.RENDER_EXTERNAL_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:4000',
    'http://127.0.0.1:4000',
  ]
    .filter(Boolean)
    .map((origin) => origin.replace(/\/$/, ''))
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.has(origin.replace(/\/$/, ''))) {
        return callback(null, true);
      }

      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use('/uploads', express.static(uploadPath, { maxAge: '1y', immutable: true }));
app.use(express.static(frontendDistPath));

// Storage for images and audio
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const safeName = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});
const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

function toPublicUrl(fileName) {
  return `/uploads/${fileName}`;
}

function resolveStaticCandidate(requestPath) {
  const relativePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
  const root = path.resolve(frontendDistPath);
  const filePath = path.resolve(frontendDistPath, relativePath);

  if (!filePath.startsWith(`${root}${path.sep}`) && filePath !== path.join(root, 'index.html')) {
    return null;
  }

  return filePath;
}

// Get all contents
app.get('/api/contents', (req, res) => {
  db.all('SELECT * FROM contents', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Update or insert content
app.post('/api/contents', upload.single('file'), (req, res) => {
  const { key, type, value } = req.body;
  const url = req.file ? toPublicUrl(req.file.filename) : req.body.url;

  if (!key) {
    return res.status(400).json({ error: 'key is required' });
  }

  if (!type) {
    return res.status(400).json({ error: 'type is required' });
  }

  db.get('SELECT * FROM contents WHERE key = ?', [key], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (row) {
      db.run('UPDATE contents SET type = ?, value = ?, url = ? WHERE key = ?', [type, value, url, key], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
          message: 'Content updated successfully',
          content: { id: row.id, key, type, value, url },
        });
      });
    } else {
      db.run('INSERT INTO contents (key, type, value, url) VALUES (?, ?, ?, ?)', [key, type, value, url], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({
          message: 'Content created successfully',
          content: { id: this.lastID, key, type, value, url },
        });
      });
    }
  });
});

app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }

  if (!fs.existsSync(frontendDistPath)) {
    return next();
  }

  const requestPath = req.path === '/' ? '/index.html' : req.path;
  const directFilePath = resolveStaticCandidate(requestPath);

  if (!directFilePath) {
    return next();
  }

  const htmlFilePath = `${directFilePath}.html`;
  const indexFilePath = path.join(directFilePath, 'index.html');

  if (fs.existsSync(directFilePath) && fs.statSync(directFilePath).isFile()) {
    return res.sendFile(directFilePath);
  }

  if (fs.existsSync(htmlFilePath)) {
    return res.sendFile(htmlFilePath);
  }

  if (fs.existsSync(indexFilePath)) {
    return res.sendFile(indexFilePath);
  }

  return next();
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(PORT, HOST, () => {
  const publicUrl = process.env.RENDER_EXTERNAL_URL || `http://${HOST}:${PORT}`;
  console.log(`Backend server is running on ${publicUrl}`);
});
