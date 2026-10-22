const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Inisialisasi Database SQLite
const dbFile = path.join(__dirname, 'data', 'diary.db');
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('Gagal koneksi ke database:', err.message);
  } else {
    console.log('Terhubung ke database SQLite.');
    db.run(`CREATE TABLE IF NOT EXISTS diaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// API: Ambil semua diary
app.get('/api/diary', (req, res) => {
  db.all(`SELECT * FROM diaries ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// API: Tambah diary baru
app.post('/api/diary', (req, res) => {
  const { author, content } = req.body;
  if (!author || !content) {
    return res.status(400).json({ error: 'Penulis dan konten wajib diisi!' });
  }

  const query = `INSERT INTO diaries (author, content) VALUES (?, ?)`;
  db.run(query, [author, content], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, author, content, message: 'Berhasil disimpan' });
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});