document.addEventListener('DOMContentLoaded', () => {
  const loginContainer = document.getElementById('login-container');
  const appContainer = document.getElementById('app-container');
  const inputUsername = document.getElementById('input-username');
  const btnLogin = document.getElementById('btn-login');
  const btnLogout = document.getElementById('btn-logout');
  const currentAuthorLabel = document.getElementById('current-author');

  const contentInput = document.getElementById('diary-content');
  const submitBtn = document.getElementById('btn-submit');
  const diaryList = document.getElementById('diary-list');

  // Kamus PIN -> Nama User
  // Silakan ubah angka PIN-nya sesuai keinginan kalian berdua!
  const pinMapping = {
    "020300": "Jooooo",   // Kalau ketik PIN 1234, otomatis jadi "uci"
    "100802": "Vio"  // Kalau ketik PIN 5678, otomatis jadi "pongo"
  };

  // Cek sesi login di browser
  const currentUser = localStorage.getItem('diary_user');
  if (currentUser) {
    showApp(currentUser);
  }

  // Aksi Login berdasarkan PIN
  btnLogin.addEventListener('click', () => {
    const enteredPin = inputUsername.value.trim();

    if (!enteredPin) {
      alert('Masukkan PIN terlebih dahulu!');
      return;
    }

    // Cek apakah PIN terdaftar di kamus pinMapping
    if (pinMapping[enteredPin]) {
      const username = pinMapping[enteredPin];
      localStorage.setItem('diary_user', username);
      showApp(username);
    } else {
      alert('PIN salah! Coba ingat-ingat lagi.');
    }
  });

  // Aksi Logout
  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('diary_user');
    appContainer.style.display = 'none';
    loginContainer.style.display = 'block';
    inputUsername.value = '';
  });

  function showApp(username) {
    loginContainer.style.display = 'none';
    appContainer.style.display = 'block';
    currentAuthorLabel.textContent = username.toUpperCase();
    fetchDiaries();
  }

  // Ambil data diary dari server
  async function fetchDiaries() {
    try {
      const response = await fetch('/api/diary');
      const diaries = await response.json();
      
      diaryList.innerHTML = '';
      if (diaries.length === 0) {
        diaryList.innerHTML = '<p>Belum ada catatan diary.</p>';
        return;
      }

      diaries.forEach(item => {
        const card = document.createElement('div');
        card.className = 'diary-card';
        card.innerHTML = `
          <h3>Oleh: ${escapeHtml(item.author.toUpperCase())}</h3>
          <p>${escapeHtml(item.content)}</p>
          <small>${item.created_at}</small>
        `;
        diaryList.appendChild(card);
      });
    } catch (error) {
      console.error('Gagal memuat diary:', error);
    }
  }

  // Kirim diary baru
  submitBtn.addEventListener('click', async () => {
    const content = contentInput.value.trim();
    const author = localStorage.getItem('diary_user');

    if (!content) {
      alert('Konten diary tidak boleh kosong!');
      return;
    }

    try {
      const response = await fetch('/api/diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content })
      });

      if (response.ok) {
        contentInput.value = '';
        fetchDiaries();
      } else {
        alert('Gagal menyimpan diary.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan koneksi.');
    }
  });

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[tag] || tag)
    );
  }
});