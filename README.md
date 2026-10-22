# Diary Kita

Diary online privat buat dua orang. Masuk pakai PIN masing-masing, tulis lewat form, entri tampil urut tanggal dengan nama penulisnya.

## Yang ada di versi ini

- Login PIN, **dicek di server**. Isi diary tidak dikirim ke browser sebelum PIN benar.
- PIN terpisah untuk tiap orang, jadi PIN sekaligus menentukan siapa penulis entri.
- Batas percobaan: 5 kali salah dari satu alamat, terkunci 15 menit. Ada juga batas gabungan semua alamat per jam.
- Form tulis (tanggal bisa diganti, Ctrl/Cmd + Enter untuk simpan).
- Tombol **Backup** yang mengunduh semua entri sebagai file JSON.
- Tidak di-index mesin pencari (header `noindex` + `robots.txt`).
- Tanpa dependensi npm. Cuma butuh **Node 22.13 atau lebih baru**.

Belum ada (sengaja, biar versi pertama simpel): edit/hapus entri, foto, reaksi, pencarian. Bisa ditambah nanti.

## Jalankan di laptop (buat nyoba)

1. Pastikan Node sudah terpasang: `node --version` (harus 22.13+).
2. Salin `.env.example` jadi `.env`, lalu isi nama, PIN masing-masing, dan `SESSION_SECRET`.
   Bikin `SESSION_SECRET` dengan:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Jalankan:
   ```
   npm start
   ```
4. Buka http://localhost:3000

Kalau ada yang salah di `.env`, server menolak jalan dan bilang bagian mana yang harus dibenerin.

## Pasang online (biar bisa dibuka dari HP berdua)

Syarat hosting:

- Bisa menjalankan Node 22.13+ (atau lebih baru).
- Punya **penyimpanan permanen (persistent disk/volume)**. Ini yang paling penting. Banyak layanan gratis menghapus isi disk tiap server restart atau deploy ulang. Kalau `DATA_DIR` tidak diarahkan ke disk permanen, diary bisa hilang.
- Menyediakan HTTPS (kebanyakan otomatis).

Langkah umumnya:

1. Upload proyek ini ke hosting (jangan sertakan file `.env`).
2. Isi environment variable di dashboard hosting, sama seperti isi `.env.example`. Tambahan untuk online:
   - `COOKIE_SECURE=1`
   - `TRUST_PROXY=1`
   - `DATA_DIR` = lokasi disk permanen yang disediakan hosting
3. Start command: `npm start`.
4. Buka alamat websitenya dari HP masing-masing, masuk dengan PIN sendiri.

Detail menu dan fitur tiap hosting beda-beda, jadi cek dokumentasi hosting yang lo pilih untuk bagian "persistent disk" dan "environment variables".

## Backup

Klik **Backup** di pojok kanan atas, simpan file JSON-nya di tempat yang aman (misalnya di drive pribadi). Disarankan sebulan sekali, atau tiap habis nulis yang penting. File backup isinya diary lengkap dalam bentuk teks biasa, jadi simpan di tempat yang privat juga.

## Catatan keamanan

- Ganti PIN: ubah `USER1_PIN` / `USER2_PIN`, lalu restart server. Ganti `SESSION_SECRET` untuk memaksa semua perangkat login ulang.
- Jangan pakai PIN yang gampang ditebak (tanggal jadian, 123456).
- Data tersimpan di server sebagai teks biasa (tidak dienkripsi di disk). Artinya orang yang punya akses ke server hostingnya secara teknis bisa membacanya. Untuk diary berdua biasanya ini sudah cukup, tapi pahami batasnya.
- Batas percobaan PIN disimpan di memori, jadi ke-reset kalau server restart.

## Isi proyek

```
server.js        server + database + login + API
public/          halaman web (index.html, app.js, style.css)
.env.example     contoh pengaturan
```
