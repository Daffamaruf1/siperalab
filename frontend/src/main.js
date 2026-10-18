import { initialEquipmentData } from './data/equipment.js';

// --- LocalStorage Management ---
const STORAGE_KEY_EQUIPMENT = 'campusgear_equipment';
const STORAGE_KEY_TRANSACTIONS = 'campusgear_transactions';

function getEquipmentList() {
  const data = localStorage.getItem(STORAGE_KEY_EQUIPMENT);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_EQUIPMENT, JSON.stringify(initialEquipmentData));
    return initialEquipmentData;
  }
  return JSON.parse(data);
}

function saveEquipmentList(data) {
  localStorage.setItem(STORAGE_KEY_EQUIPMENT, JSON.stringify(data));
}

function getTransactions() {
  const data = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
  return data ? JSON.parse(data) : [];
}

function saveTransactions(data) {
  localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(data));
}

// --- Status Ketersediaan Function ---
function getStatusKetersediaan(stok) {
  if (stok > 0) {
    return { teks: 'Tersedia', class: 'status-available' };
  }
  return { teks: 'Stok Habis', class: 'status-empty' };
}

// --- Render Katalog (Peralatan) ---
function renderKatalog() {
  const catalogContainer = document.getElementById('catalog-list');
  if (!catalogContainer) return;

  const searchInput = document.getElementById('search-input')?.value.toLowerCase() || '';
  const categoryFilter = document.getElementById('category-filter')?.value || 'all';
  const stockFilter = document.getElementById('stock-filter')?.checked || false;
  const sortOption = document.getElementById('sort-option')?.value || 'az';

  let equipmentList = getEquipmentList();

  // 1. Search
  if (searchInput) {
    equipmentList = equipmentList.filter(item =>
      item.nama.toLowerCase().includes(searchInput)
    );
  }

  // 2. Filter Category
  if (categoryFilter !== 'all') {
    equipmentList = equipmentList.filter(item => item.kategori === categoryFilter);
  }

  // 3. Filter Stock > 0
  if (stockFilter) {
    equipmentList = equipmentList.filter(item => item.stok > 0);
  }

  // 4. Sort
  equipmentList.sort((a, b) => {
    if (sortOption === 'az') return a.nama.localeCompare(b.nama);
    if (sortOption === 'za') return b.nama.localeCompare(a.nama);
    return 0;
  });

  // Render HTML
  if (equipmentList.length === 0) {
    catalogContainer.innerHTML = `<p class="no-data">Peralatan tidak ditemukan sesuai kriteria pencarian.</p>`;
    return;
  }

  catalogContainer.innerHTML = equipmentList.map(item => {
    const status = getStatusKetersediaan(item.stok);
    return `
      <article class="equipment-card">
        <h3>${item.nama}</h3>
        <span class="badge">${item.kategori}</span>
        <figure>
          <img src="${item.gambar}" alt="${item.nama}" width="320">
          <figcaption>${item.deskripsi}</figcaption>
        </figure>
        <p><strong>ID:</strong> ${item.id}</p>
        <p><strong>Stok:</strong> ${item.stok} unit</p>
        <p><strong>Status:</strong> <span class="${status.class}">${status.teks}</span></p>
      </article>
    `;
  }).join('');
}

// Populate Opsi Dropdown Peralatan di Form Peminjaman
function populateEquipmentSelect() {
  const selectEl = document.getElementById('alat');
  if (!selectEl) return;

  const equipmentList = getEquipmentList();
  selectEl.innerHTML = '<option value="">-- Pilih peralatan --</option>' +
    equipmentList.map(item => `
      <option value="${item.id}" ${item.stok === 0 ? 'disabled' : ''}>
        ${item.nama} (Stok: ${item.stok}) ${item.stok === 0 ? '- Stok Habis' : ''}
      </option>
    `).join('');
}

// --- Render Riwayat Transaksi ---
function renderRiwayatTransaksi() {
  const historyContainer = document.getElementById('transaction-history');
  if (!historyContainer) return;

  const transactions = getTransactions();

  if (transactions.length === 0) {
    historyContainer.innerHTML = '<p class="no-data">Belum ada riwayat transaksi peminjaman.</p>';
    return;
  }

  historyContainer.innerHTML = `
    <table class="transaction-table">
      <thead>
        <tr>
          <th>ID Transaksi</th>
          <th>NIM</th>
          <th>Nama</th>
          <th>Peralatan</th>
          <th>Jumlah</th>
          <th>Tanggal</th>
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        ${transactions.map(trx => `
          <tr>
            <td>${trx.id}</td>
            <td>${trx.nim}</td>
            <td>${trx.nama}</td>
            <td>${trx.namaBarang}</td>
            <td>${trx.jumlah}</td>
            <td>${trx.tanggal}</td>
            <td><span class="badge ${trx.status === 'Aktif' ? 'badge-success' : 'badge-danger'}">${trx.status}</span></td>
            <td>
              ${trx.status === 'Aktif' 
                ? `<button class="btn-cancel" data-id="${trx.id}">Batalkan</button>` 
                : '<em>Dibatalkan</em>'}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  // Attach Event Listener Tombol Batal
  historyContainer.querySelectorAll('.btn-cancel').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const trxId = e.target.getAttribute('data-id');
      batalkanPeminjaman(trxId);
    });
  });
}

// --- Batalkan Peminjaman ---
function batalkanPeminjaman(trxId) {
  let transactions = getTransactions();
  const trx = transactions.find(t => t.id === trxId);

  if (!trx || trx.status === 'Dibatalkan') {
    alert('Transaksi tidak valid atau sudah dibatalkan sebelumnya.');
    return;
  }

  // Update Status Transaksi
  trx.status = 'Dibatalkan';
  saveTransactions(transactions);

  // Kembalikan Stok Barang
  let equipmentList = getEquipmentList();
  const equipment = equipmentList.find(e => e.id === trx.idBarang);
  if (equipment) {
    equipment.stok += trx.jumlah;
    saveEquipmentList(equipmentList);
  }

  // Re-render
  renderRiwayatTransaksi();
  populateEquipmentSelect();
  renderKatalog();
  alert('Peminjaman berhasil dibatalkan. Stok barang telah dikembalikan.');
}

// --- Form Handling & Validation ---
function setupFormPeminjaman() {
  const form = document.getElementById('form-peminjaman');
  const errorMsg = document.getElementById('error-message');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (errorMsg) errorMsg.textContent = '';

    const nim = document.getElementById('nim').value.trim();
    const nama = document.getElementById('nama').value.trim();
    const idBarang = document.getElementById('alat').value;
    const jumlah = parseInt(document.getElementById('jumlah').value, 10);
    const tanggal = document.getElementById('tanggal-pinjam').value;

    // Validasi 1: NIM 8-12 digit
    if (!/^\d{8,12}$/.test(nim)) {
      showError('NIM harus berupa 8 hingga 12 digit angka.');
      return;
    }

    // Validasi 2: Nama tidak kosong
    if (!nama) {
      showError('Nama mahasiswa wajib diisi.');
      return;
    }

    // Validasi 3: Peralatan wajib dipilih
    if (!idBarang) {
      showError('Silakan pilih peralatan yang ingin dipinjam.');
      return;
    }

    // Validasi 4: Jumlah minimal 1
    if (isNaN(jumlah) || jumlah < 1) {
      showError('Jumlah peminjaman minimal 1 unit.');
      return;
    }

    // Validasi 5: Stok tersedia
    let equipmentList = getEquipmentList();
    const equipment = equipmentList.find(e => e.id === idBarang);

    if (!equipment) {
      showError('Peralatan tidak ditemukan.');
      return;
    }

    if (equipment.stok === 0) {
      showError('Peralatan yang dipilih sedang habis stok.');
      return;
    }

    if (jumlah > equipment.stok) {
      showError(`Jumlah peminjaman (${jumlah}) melebihi stok yang tersedia (${equipment.stok}).`);
      return;
    }

    // --- Proses Transaksi Valid ---
    equipment.stok -= jumlah;
    saveEquipmentList(equipmentList);

    const newTransaction = {
      id: 'TRX-' + Date.now(),
      nim,
      nama,
      idBarang: equipment.id,
      namaBarang: equipment.nama,
      jumlah,
      tanggal,
      status: 'Aktif'
    };

    const transactions = getTransactions();
    transactions.unshift(newTransaction);
    saveTransactions(transactions);

    // Reset Form & Update Tampilan
    form.reset();
    alert('Peminjaman berhasil diajukan!');
    renderRiwayatTransaksi();
    populateEquipmentSelect();
    renderKatalog();
  });
}

function showError(msg) {
  const errorMsg = document.getElementById('error-message');
  if (errorMsg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
  } else {
    alert(msg);
  }
}

// --- Initialize App ---
document.addEventListener('DOMContentLoaded', () => {
  // Inisialisasi Data
  getEquipmentList();

  // Setup Listener Filter & Search Katalog
  ['search-input', 'category-filter', 'stock-filter', 'sort-option'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', renderKatalog);
      el.addEventListener('change', renderKatalog);
    }
  });

  // Render Sesuai Halaman
  renderKatalog();
  populateEquipmentSelect();
  setupFormPeminjaman();
  renderRiwayatTransaksi();
});