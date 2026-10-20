// Data Starter + 3 Data Individual Berdasarkan NIM
// Contoh NIM 3 digit terakhir: 527 (Ubah 527 dan stok awal sesuai digit terakhir NIM kamu!)
// Digit terakhir NIM = 7
// Stok Barang 1 = 7 + 1 = 8
// Stok Barang 2 = 7 + 2 = 9
// Stok Barang 3 = 7 + 3 = 10

export const initialEquipmentData = [
  {
    id: "EQ-001",
    nama: "Multimeter Digital",
    kategori: "Elektronika",
    stok: 6,
    gambar: "/images/multimeter.jpg",
    deskripsi: "Alat ukur tegangan, arus, dan resistansi."
  },
  {
    id: "EQ-002",
    nama: "Router Jaringan",
    kategori: "Jaringan",
    stok: 12,
    gambar: "/images/router.jpg",
    deskripsi: "Perangkat jaringan untuk latihan routing dan konektivitas."
  },
  {
    id: "EQ-003",
    nama: "Kamera DSLR",
    kategori: "Dokumentasi",
    stok: 5,
    gambar: "/images/kamera.jpg",
    deskripsi: "Kamera digital untuk dokumentasi dan kebutuhan praktikum."
  },
  // Data Individual Sesuai Ketentuan NIM (XXX-01, XXX-02, XXX-03)
  {
    id: "527-01",
    nama: "Tripod Kamera",
    kategori: "Dokumentasi",
    stok: 8, // Digit terakhir NIM (7) + 1
    gambar: "/images/tripod.jpg",
    deskripsi: "Tripod aluminium penopang kamera untuk dokumentasi acara."
  },
  {
    id: "527-02",
    nama: "Proyektor Portable",
    kategori: "Presentasi",
    stok: 9, // Digit terakhir NIM (7) + 2
    gambar: "/images/proyektor-portable.jpg",
    deskripsi: "Proyektor Full HD untuk presentasi kegiatan mahasiswa."
  },
  {
    id: "527-03",
    nama: "Speaker Portable Wireless",
    kategori: "Audio",
    stok: 10, // Digit terakhir NIM (7) + 3
    gambar: "/images/portable speaker wireless.jpg",
    deskripsi: "Speaker bluetooth untuk sound system acara organisasi."
  }
];