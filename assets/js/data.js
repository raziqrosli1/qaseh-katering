/* ============================================================
   QASEH KATERING · Langkap, Perak — DEMO DATA (static, no backend)
   Real package/pricing structure from Qaseh Katering pricelist.
   Sample bookings are illustrative for the prototype only.
   ============================================================ */
(function (global) {
  'use strict';

  const RM = n => 'RM ' + Number(n).toLocaleString('en-MY');
  const RMk = n => 'RM ' + (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k';

  const BRAND = {
    name: 'Qaseh',
    tagline: 'Katering',
    legal: 'Qaseh Katering',
    reg: 'Langkap, Perak',
    address: '669 & 670, Hala Kristal 1, Taman Desa Maju, 36700 Langkap, Perak',
    phone: '010-563 5298',
    email: 'qasehkatering@gmail.com',
    web: 'Qaseh Katering · Langkap, Perak',
    ssm: '201203023045 (IP0362008-K)',
    areas: ['Langkap', 'Teluk Intan', 'Bidor', 'Tapah', 'Kampar', 'Air Kuning', 'Air Hitam'],
    contacts: [
      { name: 'Eva', phone: '010-563 5298' },
      { name: 'Diyana', phone: '013-595 8306' },
      { name: 'Ros', phone: '019-556 1091' },
      { name: 'Aliff', phone: '013-705 9662' },
    ],
    // Media sosial — tukar username di SINI sahaja (satu tempat), footer auto-update.
    // Set null untuk sembunyikan pautan. Guna username sahaja (bukan URL penuh).
    social: { instagram: 'qasehkatering', facebook: 'qaseh.katering.3', tiktok: 'qasehkateringlangkap' },
  };

  const USER = { name: 'Raziq Rosli', role: 'Operations Manager', initials: 'RR' };

  // ---- semantic colors (mirror app.css) ----
  const CLR = {
    green: '#16A34A', greenDark: '#15803D', red: '#DC2626', orange: '#F97316',
    blue: '#2563EB', purple: '#7C3AED', yellow: '#EAB308', amber: '#F59E0B',
    cyan: '#06B6D4', gray: '#9A9A9A',
  };

  // ---- packages (buffet = per pax; specials = flat set) ----
  const PACKAGES = {
    'Buffet RM16':    { price: 16,   color: CLR.purple, tier: 'Eksklusif', perPax: true },
    'Buffet RM13.50': { price: 13.5, color: CLR.amber,  tier: 'Istimewa',  perPax: true },
    'Buffet RM11.50': { price: 11.5, color: CLR.blue,   tier: 'Pilihan',   perPax: true },
    'Buffet RM10':    { price: 10,   color: CLR.cyan,   tier: 'Jimat',     perPax: true },
    'Buffet RM9.30':  { price: 9.3,  color: CLR.gray,   tier: 'Asas',      perPax: true },
    'Hidangan Mempelai': { price: 650, color: CLR.green,  tier: 'Set Pengantin', perPax: false },
    'Dessert Table':     { price: 450, color: CLR.orange, tier: 'Kudap-kudap',   perPax: false },
  };

  const MENUS = {
    'Buffet RM16': ['Nasi Minyak / Tomato / Hujan Panas (Basmathi)', 'Ayam Masak Merah / Goreng Rempah', 'Daging Masak Hitam / Black Pepper', 'Udang Masak Kari / Gulai Lemak Nenas Ikan Masin', 'Jelatah, Ulaman & Sambal Belacan', 'Buah', 'Air Sirap / Oren'],
    'Buffet RM13.50': ['Nasi Minyak / Tomato / Hujan Panas', 'Ayam Masak Merah / Goreng Rempah', 'Daging Rendang Tok', 'Dalca Sayur / Gulai Lemak Nenas Udang', 'Acar Buah / Acar Rampai', 'Buah', 'Air Sirap / Oren'],
    'Buffet RM11.50': ['Nasi Minyak / Tomato / Hujan Panas', 'Ayam Masak Merah / Goreng Rempah', 'Daging Masak Hitam', 'Dalca Sayur / Gulai Lemak Nenas Udang', 'Jelatah, Ulaman & Sambal Belacan', 'Buah', 'Air Sirap / Oren'],
    'Buffet RM10': ['Nasi Minyak / Tomato / Hujan Panas', 'Ayam Masak Merah / Goreng Rempah', 'Daging Kari Kentang / Gulai Lemak Dagang', 'Jelatah, Ulaman & Sambal Belacan', 'Buah', 'Air Sirap / Oren'],
    'Buffet RM9.30': ['Nasi Minyak / Tomato / Hujan Panas', 'Ayam Masak Merah / Goreng Rempah', 'Gulai Lemak Terung / Nenas Ikan Masin', 'Ikan Masin Goreng Tepung', 'Jelatah, Ulaman & Sambal Belacan', 'Buah', 'Air Sirap / Oren'],
    'Hidangan Mempelai': ['Ayam Golek (2 ekor)', 'Ikan Siakap (3 ekor)', 'Kepak Ayam (20 ketul)', 'Udang Butter [Size L] (2 set)', 'Telur Bungkus (2 set)', 'Sayur Campur (2 set)', 'Gubahan Buah (1 set)', 'Air Minuman', 'Dome Set (2 set)', '2 orang Pramusaji', 'Kelengkapan Alatan Makan'],
    'Dessert Table': ['Puteri Ayu Pandan (30 pcs)', 'Dangai Kukus (50 pcs)', 'Apam Nasi Pastel (50 pcs)', 'Mini Cheese Pandan (20 pcs)', 'Mini Cheese Red Velvet (20 pcs)', 'Mini Choc Ganache (30 pcs)', 'Buttercake 8" (1) / 6" (2)'],
  };

  // ---- deposit categories to lock a date ----
  const deposits = [
    { k: 'Catering', v: 500 }, { k: 'Kanopi', v: 100 }, { k: 'Pelamin', v: 100 },
    { k: 'DJ & PA System', v: 100 }, { k: 'Aiskrim', v: 100 }, { k: 'Kambing', v: 100 },
  ];

  // ---- canopy / setup packages (usahasama dengan Kanopi Nan, Air Hitam) ----
  const canopy = [
    { name: 'Khemah Arabian 20×20', price: 200, note: 'Lapik meja, tanpa scallop. Meja & kerusi susun sendiri.' },
    { name: 'Khemah Arabian 20×20 (+Scallop)', price: 300, note: 'Lapik meja & scallop. Meja & kerusi susun sendiri.' },
    { name: 'Khemah Arabian 20×20 (Premium)', price: 400, note: 'Lapik meja 2 layer, sarung kerusi & scallop.' },
    { name: 'Khemah Makan Beradab', price: 500, note: 'Hiasan & set kerusi pengantin. 1 meja panjang & 2 meja bulat.' },
    { name: 'Meja Makan Beradab', price: 450, note: 'Tanpa khemah. Hiasan & set kerusi pengantin. 1 meja panjang & 2 meja bulat.' },
    { name: 'Meja Buffet 3×18', price: 75, note: 'Lapik meja & skirting. Tolak RM30 jika tanpa skirting.' },
    { name: 'Meja Goodies 3×6', price: 25, note: 'Lapik meja & skirting. Tolak RM10 jika tanpa skirting.' },
    { name: 'Set Meja Bulat Tetamu', price: 60, note: 'Lapik meja & sarung kerusi. Tolak RM25 jika tanpa sarung kerusi.' },
    { name: 'Meja Kek Bulat', price: 30, note: 'Beserta skirting.' },
    { name: 'Khemah Sambut Tetamu 10×10', price: 150, note: 'Beserta meja 3×6 siap skirting.' },
    { name: 'Air Cooler', price: 250, note: 'Penyejuk udara.' },
    { name: 'Kipas Kipang (Industri)', price: 80, note: 'Kipas industri.' },
  ];

  // ---- add-ons ----
  const addons = [
    { name: 'Kambing Aqiqah Siap Masak', price: 1300, unit: 'ekor', note: 'Anggaran untuk 150 pax.' },
    { name: 'Upah Masak Kambing', price: 300, unit: 'ekor', note: 'Kambing dibekalkan pelanggan.' },
    { name: 'DJ & PA System', price: 500, unit: 'sesi', note: 'Maksimum 4 jam setiap sesi.' },
    { name: 'Nasi Minyak / Tomato / Hujan Panas', price: 250, unit: 'tong', note: 'Anggaran 100 pax per tong.' },
    { name: 'Nasi Putih', price: 150, unit: 'tong', note: 'Anggaran 100 pax per tong.' },
    { name: 'Pramusaji Tambahan', price: 80, unit: 'pax' },
    { name: 'Pramusaji VIP', price: 120, unit: 'pax' },
    { name: 'Bubur (Kacang / Gandum / Pulut Hitam)', price: 180, unit: 'tong (L)', note: 'Saiz L ≈ 150 pax · Saiz M RM100 ≈ 75 pax.' },
    { name: 'Cendol Balang', price: 200, unit: 'tong', note: 'Anggaran 100 pax.' },
    { name: 'Teh Tarik / Kopi', price: 100, unit: 'tong', note: 'Anggaran 75 pax.' },
    { name: 'Teh O / Kopi O', price: 80, unit: 'tong', note: 'Anggaran 75 pax.' },
    { name: 'Sewaan Dome Set', price: 60, unit: 'set', note: 'Untuk sekali hidangan.' },
  ];

  // ---- sales advisors (EJEN) — who keyed-in / handled the booking ----
  const advisors = ['Aliff Aziz', 'Diyana', 'Eva', 'Ros', 'Bintang', 'Anje', 'D\'Nar'];

  // ---- key terms & conditions ----
  const terms = [
    'Bayaran deposit diperlukan untuk mengunci (lock) tarikh majlis — dikira berasingan mengikut kategori.',
    'Deposit tidak akan dipulangkan jika tempahan dibatalkan, dan tidak boleh dipindah ke kategori lain.',
    'Bayaran penuh hendaklah diselesaikan selewat-lewatnya seminggu sebelum tarikh majlis.',
    'Harga katering termasuk kelengkapan alatan makan (set buffet, pinggan, cawan, sudu, garfu, tisu) tetapi tidak termasuk lapik meja buffet.',
    'Pramusaji hanya disediakan untuk tempahan buffet 250 pax ke atas (maksimum 4 jam).',
    'Caj pengangkutan percuma untuk jarak kurang 30km; melebihi 30km dikenakan RM100.',
  ];

  // ---- helper for services ----
  const svc = (dec, cnpy, tables, chairs, waiters, kitchen) =>
    ({ decoration: dec, canopy: cnpy, tables, chairs, waiters, kitchen });

  // ================= ORDERS =================
  // status: confirmed | preparing | completed | pending | cancelled
  // payStatus: paid | partial | unpaid | refunded
  const orders = [
    {
      id: 'ORD-2601', invoice: 'INV-2026-001', customerId: 'C01',
      customer: 'Nurul Huda binti Aziz', initials: 'NH', phone: '012-345 6789', email: 'nurul.a@gmail.com',
      eventType: 'Majlis Perkahwinan', pkg: 'Buffet RM13.50',
      venue: 'Dewan Orang Ramai Langkap', address: 'Langkap, 36700 Teluk Intan, Perak', mapQuery: 'Langkap Perak',
      date: '2026-08-03', time: '11:00', endTime: '16:00', guests: 400,
      services: svc('Pelamin Beradab + Hiasan', 'Khemah Arabian 20×20 (Premium)', 40, 400, 4, 8),
      addOns: ['Hidangan Mempelai', 'Cendol Balang', 'Sewaan Dome Set'],
      total: 5400, deposit: 500, method: 'Bank Transfer', status: 'confirmed', payStatus: 'partial',
      notes: 'Majlis kahwin. Set hidangan mempelai untuk rombongan pengantin ~30 pax.',
      timeline: [['Tempahan dibuat', '18 Jun 2026'], ['Deposit diterima', '20 Jun 2026'], ['Menu disahkan', '02 Jul 2026'], ['Walkthrough akhir', '01 Aug 2026']],
    },
    {
      id: 'ORD-2602', invoice: 'INV-2026-002', customerId: 'C02',
      customer: 'Faizal Rahman', initials: 'FR', phone: '013-880 2211', email: 'faizal.r@gmail.com',
      eventType: 'Kenduri Kesyukuran', pkg: 'Buffet RM11.50',
      venue: 'Kediaman, Teluk Intan', address: 'Teluk Intan, 36000 Perak', mapQuery: 'Teluk Intan Perak',
      date: '2026-08-04', time: '12:00', endTime: '15:00', guests: 200,
      services: svc('Hiasan ringkas', 'Khemah Arabian 20×20 (+Scallop)', 20, 200, 0, 6),
      addOns: ['Nasi Minyak / Tomato / Hujan Panas', 'Teh Tarik / Kopi'],
      total: 2300, deposit: 500, method: 'DuitNow QR', status: 'preparing', payStatus: 'partial',
      notes: 'Kenduri kesyukuran. Set-up & tinggal, pinggan pakai buang.',
      timeline: [['Tempahan dibuat', '01 Jul 2026'], ['Deposit diterima', '03 Jul 2026'], ['Menu disahkan', '18 Jul 2026']],
    },
    {
      id: 'ORD-2603', invoice: 'INV-2026-003', customerId: 'C03',
      customer: 'Tan Wei Ming', initials: 'TW', phone: '016-777 5432', email: 'wm.tan@outlook.com',
      eventType: 'Majlis Pertunangan', pkg: 'Buffet RM10',
      venue: 'Dewan Komuniti Bidor', address: 'Bidor, 35500 Perak', mapQuery: 'Bidor Perak',
      date: '2026-08-21', time: '19:00', endTime: '22:00', guests: 150,
      services: svc('Tema pastel', 'Khemah Arabian 20×20', 15, 150, 0, 5),
      addOns: ['Dessert Table'],
      total: 1500, deposit: 1500, method: 'Bank Transfer', status: 'confirmed', payStatus: 'paid',
      notes: 'Sudah bayar penuh. Set-up awal jam 3 petang.',
      timeline: [['Tempahan dibuat', '10 Jun 2026'], ['Bayaran penuh diterima', '25 Jun 2026'], ['Menu disahkan', '01 Jul 2026']],
    },
    {
      id: 'ORD-2604', invoice: 'INV-2026-004', customerId: 'C04',
      customer: 'Dato\u2019 Kamarul Bahrin', initials: 'KB', phone: '019-200 8080', email: 'kamarul@bahrin.co',
      eventType: 'Majlis Perkahwinan', pkg: 'Buffet RM16',
      venue: 'Dewan Besar, Teluk Intan', address: 'Teluk Intan, 36000 Perak', mapQuery: 'Dewan Teluk Intan',
      date: '2026-08-27', time: '11:30', endTime: '17:00', guests: 600,
      services: svc('Pelamin Gold Beradab', 'Khemah Makan Beradab', 60, 600, 6, 10),
      addOns: ['Hidangan Mempelai', 'DJ & PA System', 'Kambing Aqiqah Siap Masak', 'Air Cooler'],
      total: 9600, deposit: 500, method: 'Bank Transfer', status: 'confirmed', payStatus: 'partial',
      notes: 'Majlis besar. 2 kaunter buffet diperlukan (401–1100 pax).',
      timeline: [['Tempahan dibuat', '02 May 2026'], ['Deposit diterima', '10 May 2026'], ['Menu disahkan', '20 Jun 2026'], ['Sesi rasa', '15 Jul 2026']],
    },
    {
      id: 'ORD-2605', invoice: 'INV-2026-005', customerId: 'C05',
      customer: 'Siti Aisyah Mokhtar', initials: 'SA', phone: '017-334 1290', email: 'aisyah.m@gmail.com',
      eventType: 'Aqiqah & Kesyukuran', pkg: 'Buffet RM10',
      venue: 'Kediaman, Langkap', address: 'Langkap, 36700 Teluk Intan, Perak', mapQuery: 'Langkap Perak',
      date: '2026-07-09', time: '11:00', endTime: '14:00', guests: 100,
      services: svc('Hiasan aqiqah', 'Khemah Arabian 20×20', 10, 100, 0, 4),
      addOns: ['Kambing Aqiqah Siap Masak', 'Bubur (Kacang / Gandum / Pulut Hitam)'],
      total: 1000, deposit: 1000, method: 'Tunai', status: 'completed', payStatus: 'paid',
      notes: 'Selesai dengan jayanya. Pelanggan beri ulasan 5 bintang.',
      timeline: [['Tempahan dibuat', '02 Jun 2026'], ['Bayaran penuh diterima', '20 Jun 2026'], ['Majlis selesai', '09 Jul 2026']],
    },
    {
      id: 'ORD-2606', invoice: 'INV-2026-006', customerId: 'C06',
      customer: 'Vikram Nair', initials: 'VN', phone: '012-908 7766', email: 'v.nair@finserve.my',
      eventType: 'Majlis Korporat', pkg: 'Buffet RM13.50',
      venue: 'Kilang FGV, Teluk Intan', address: 'Teluk Intan, 36000 Perak', mapQuery: 'Teluk Intan Perak',
      date: '2026-08-18', time: '12:00', endTime: '14:00', guests: 120,
      services: svc('Backdrop korporat', 'Khemah Arabian 20×20 (+Scallop)', 12, 120, 0, 5),
      addOns: ['Teh Tarik / Kopi'],
      total: 1620, deposit: 0, method: '—', status: 'pending', payStatus: 'unpaid',
      notes: 'Menunggu pengesahan PO daripada jabatan kewangan.',
      timeline: [['Pertanyaan diterima', '20 Jul 2026'], ['Sebut harga dihantar', '22 Jul 2026']],
    },
    {
      id: 'ORD-2607', invoice: 'INV-2026-007', customerId: 'C07',
      customer: 'Chong Li Fen', initials: 'CL', phone: '018-221 5566', email: 'lifen.c@gmail.com',
      eventType: 'Majlis Pertunangan', pkg: 'Buffet RM11.50',
      venue: 'Dewan Kampung, Kampar', address: 'Kampar, 31900 Perak', mapQuery: 'Kampar Perak',
      date: '2026-07-30', time: '18:30', endTime: '22:00', guests: 180,
      services: svc('Tema blush moden', 'Khemah Arabian 20×20', 18, 180, 0, 6),
      addOns: ['Dessert Table'],
      total: 2070, deposit: 500, method: 'DuitNow QR', status: 'cancelled', payStatus: 'refunded',
      notes: 'Dibatalkan pelanggan kerana penangguhan. Deposit dipulangkan 12 Jul.',
      timeline: [['Tempahan dibuat', '05 Jun 2026'], ['Deposit diterima', '08 Jun 2026'], ['Dibatalkan pelanggan', '10 Jul 2026'], ['Deposit dipulangkan', '12 Jul 2026']],
    },
    {
      id: 'ORD-2608', invoice: 'INV-2026-008', customerId: 'C08',
      customer: 'Aminah Yusof', initials: 'AY', phone: '013-556 7788', email: 'aminah.yusof@gmail.com',
      eventType: 'Kenduri Doa Selamat', pkg: 'Buffet RM11.50',
      venue: 'Masjid Langkap', address: 'Langkap, 36700 Teluk Intan, Perak', mapQuery: 'Masjid Langkap Perak',
      date: '2026-08-15', time: '18:00', endTime: '21:00', guests: 300,
      services: svc('Hiasan komuniti', 'Khemah Makan Beradab', 30, 300, 6, 9),
      addOns: ['Nasi Minyak / Tomato / Hujan Panas', 'Bubur (Kacang / Gandum / Pulut Hitam)'],
      total: 3450, deposit: 500, method: 'Bank Transfer', status: 'preparing', payStatus: 'partial',
      notes: 'Kenduri komuniti. Hidangan perlu siap sebelum Maghrib.',
      timeline: [['Tempahan dibuat', '25 Jun 2026'], ['Deposit diterima', '28 Jun 2026'], ['Menu disahkan', '10 Jul 2026']],
    },
    {
      id: 'ORD-2609', invoice: 'INV-2026-009', customerId: 'C09',
      customer: 'Rajesh Kumar', initials: 'RK', phone: '011-2233 4455', email: 'rajesh.k@gmail.com',
      eventType: 'Hidangan Mempelai', pkg: 'Hidangan Mempelai',
      venue: 'Kediaman, Teluk Intan', address: 'Teluk Intan, 36000 Perak', mapQuery: 'Teluk Intan Perak',
      date: '2026-08-09', time: '19:30', endTime: '22:30', guests: 30,
      services: svc('Set kerusi pengantin', 'Meja Makan Beradab', 3, 30, 2, 4),
      addOns: ['Sewaan Dome Set'],
      total: 650, deposit: 650, method: 'Kad Kredit', status: 'confirmed', payStatus: 'paid',
      notes: 'Set hidangan mempelai untuk rombongan pengantin.',
      timeline: [['Tempahan dibuat', '01 Jul 2026'], ['Bayaran penuh diterima', '05 Jul 2026'], ['Menu disahkan', '12 Jul 2026']],
    },
    {
      id: 'ORD-2610', invoice: 'INV-2026-010', customerId: 'C10',
      customer: 'Lim Sok Cheng', initials: 'LS', phone: '012-667 3321', email: 'sokcheng.lim@gmail.com',
      eventType: 'Majlis Harijadi', pkg: 'Buffet RM13.50',
      venue: 'Dewan Serbaguna, Langkap', address: 'Langkap, 36700 Teluk Intan, Perak', mapQuery: 'Langkap Perak',
      date: '2026-09-02', time: '12:00', endTime: '16:00', guests: 130,
      services: svc('Tema elegan', 'Khemah Arabian 20×20 (+Scallop)', 13, 130, 0, 5),
      addOns: ['Cendol Balang', 'Meja Kek Bulat'],
      total: 1755, deposit: 500, method: 'Bank Transfer', status: 'confirmed', payStatus: 'partial',
      notes: 'Sambutan harijadi ke-60. Kek diletak di meja kek bulat.',
      timeline: [['Tempahan dibuat', '12 Jul 2026'], ['Deposit diterima', '15 Jul 2026']],
    },
    {
      id: 'ORD-2611', invoice: 'INV-2026-011', customerId: 'C02',
      customer: 'Faizal Rahman', initials: 'FR', phone: '013-880 2211', email: 'faizal.r@gmail.com',
      eventType: 'Kenduri Kesyukuran', pkg: 'Buffet RM10',
      venue: 'Kediaman, Teluk Intan', address: 'Teluk Intan, 36000 Perak', mapQuery: 'Teluk Intan Perak',
      date: '2026-06-18', time: '12:00', endTime: '14:00', guests: 90,
      services: svc('Hiasan ringkas', 'Khemah Arabian 20×20', 9, 90, 0, 4),
      addOns: ['Teh O / Kopi O'],
      total: 900, deposit: 900, method: 'DuitNow QR', status: 'completed', payStatus: 'paid',
      notes: 'Pelanggan berulang. Penghantaran lancar.',
      timeline: [['Tempahan dibuat', '01 Jun 2026'], ['Bayaran penuh diterima', '05 Jun 2026'], ['Majlis selesai', '18 Jun 2026']],
    },
    {
      id: 'ORD-2612', invoice: 'INV-2026-012', customerId: 'C11',
      customer: 'Noraini Abdullah', initials: 'NA', phone: '019-445 9987', email: 'noraini.a@gmail.com',
      eventType: 'Majlis Perkahwinan', pkg: 'Buffet RM11.50',
      venue: 'Dewan Perdana, Bidor', address: 'Bidor, 35500 Perak', mapQuery: 'Bidor Perak',
      date: '2026-09-13', time: '11:00', endTime: '16:00', guests: 350,
      services: svc('Pelamin tradisional', 'Khemah Makan Beradab', 35, 350, 6, 10),
      addOns: ['Hidangan Mempelai', 'DJ & PA System'],
      total: 4025, deposit: 500, method: 'Bank Transfer', status: 'confirmed', payStatus: 'partial',
      notes: 'Majlis hujung minggu. Dua syif pasukan servis diperlukan.',
      timeline: [['Tempahan dibuat', '20 Jul 2026'], ['Deposit diterima', '24 Jul 2026']],
    },
  ];

  // attach derived fields
  orders.forEach(o => { o.balance = o.total - o.deposit; });

  // admin key-in bookings (manual entry) — persisted in localStorage so they survive reloads
  try {
    const extra = JSON.parse(localStorage.getItem('qaseh_bookings') || '[]');
    if (Array.isArray(extra)) extra.forEach(o => { if (o && o.id) { o.balance = (o.total || 0) - (o.deposit || 0); orders.unshift(o); } });
  } catch (e) {}

  // ================= CUSTOMERS =================
  const customers = [
    { id: 'C04', name: 'Dato\u2019 Kamarul Bahrin', initials: 'KB', type: 'VIP', phone: '019-200 8080', email: 'kamarul@bahrin.co', company: 'Bahrin Holdings', since: '2021', city: 'Teluk Intan', rating: 5, notes: 'Pelanggan utama, suka kemas kini terus melalui WhatsApp. Selalu tempah pakej penuh.' },
    { id: 'C02', name: 'Faizal Rahman', initials: 'FR', type: 'Berulang', phone: '013-880 2211', email: 'faizal.r@gmail.com', company: '—', since: '2022', city: 'Teluk Intan', rating: 5, notes: 'Pelanggan berulang untuk kenduri kesyukuran keluarga.' },
    { id: 'C01', name: 'Nurul Huda binti Aziz', initials: 'NH', type: 'Individu', phone: '012-345 6789', email: 'nurul.a@gmail.com', company: '—', since: '2023', city: 'Langkap', rating: 4, notes: 'Rujukan dari Dato Kamarul. Suka tema pastel.' },
    { id: 'C03', name: 'Tan Wei Ming', initials: 'TW', type: 'Individu', phone: '016-777 5432', email: 'wm.tan@outlook.com', company: '—', since: '2024', city: 'Bidor', rating: 4, notes: 'Suka set-up awal. Mudah dihubungi.' },
    { id: 'C05', name: 'Siti Aisyah Mokhtar', initials: 'SA', type: 'Individu', phone: '017-334 1290', email: 'aisyah.m@gmail.com', company: '—', since: '2024', city: 'Langkap', rating: 5, notes: 'Beri ulasan hebat. Berkemungkinan tempah semula untuk majlis akan datang.' },
    { id: 'C06', name: 'Vikram Nair', initials: 'VN', type: 'Korporat', phone: '012-908 7766', email: 'v.nair@finserve.my', company: 'FGV Teluk Intan', since: '2026', city: 'Teluk Intan', rating: 3, notes: 'Lead korporat baharu. Menunggu proses PO.' },
    { id: 'C07', name: 'Chong Li Fen', initials: 'CL', type: 'Individu', phone: '018-221 5566', email: 'lifen.c@gmail.com', company: '—', since: '2025', city: 'Kampar', rating: 3, notes: 'Pertunangan ditangguh, mungkin tempah semula.' },
    { id: 'C08', name: 'Aminah Yusof', initials: 'AY', type: 'Komuniti', phone: '013-556 7788', email: 'aminah.yusof@gmail.com', company: 'Masjid Langkap', since: '2023', city: 'Langkap', rating: 5, notes: 'Penganjur kenduri komuniti tahunan.' },
    { id: 'C09', name: 'Rajesh Kumar', initials: 'RK', type: 'Individu', phone: '011-2233 4455', email: 'rajesh.k@gmail.com', company: '—', since: '2025', city: 'Teluk Intan', rating: 5, notes: 'Suka set hidangan mempelai yang kemas.' },
    { id: 'C10', name: 'Lim Sok Cheng', initials: 'LS', type: 'Individu', phone: '012-667 3321', email: 'sokcheng.lim@gmail.com', company: '—', since: '2026', city: 'Langkap', rating: 4, notes: 'Sambutan keluarga. Suka menu mesra pelbagai kaum.' },
    { id: 'C11', name: 'Noraini Abdullah', initials: 'NA', type: 'Individu', phone: '019-445 9987', email: 'noraini.a@gmail.com', company: '—', since: '2026', city: 'Bidor', rating: 4, notes: 'Tempahan kahwin pertama. Perancang yang teliti.' },
  ];

  // derive customer aggregates from orders
  customers.forEach(c => {
    const own = orders.filter(o => o.customerId === c.id);
    const valid = own.filter(o => o.status !== 'cancelled');
    c.orders = own.length;
    c.spent = valid.reduce((s, o) => s + o.total, 0);
    c.upcoming = own.filter(o => ['confirmed', 'preparing', 'pending'].includes(o.status)).length;
    const counts = {};
    valid.forEach(o => counts[o.pkg] = (counts[o.pkg] || 0) + 1);
    c.favourite = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || '—';
    c.orderIds = own.map(o => o.id);
  });

  // ================= INVOICES =================
  const invoices = orders.map(o => {
    let st = 'pending';
    if (o.payStatus === 'paid') st = 'paid';
    else if (o.payStatus === 'partial') st = 'partial';
    else if (o.payStatus === 'refunded') st = 'refunded';
    else if (o.status === 'pending') st = 'pending';
    if (o.id === 'ORD-2606') st = 'overdue';
    const pk = PACKAGES[o.pkg];
    const unit = pk ? (pk.perPax ? pk.price : Math.round(o.total / o.guests)) : 0;
    return {
      no: o.invoice, orderId: o.id, customerId: o.customerId, customer: o.customer, initials: o.initials,
      email: o.email, phone: o.phone, address: o.address, venue: o.venue,
      pkg: o.pkg, guests: o.guests, unit,
      issued: (o.timeline[0] && o.timeline[0][1]) || '—', due: o.date, eventDate: o.date,
      total: o.total, deposit: o.deposit, balance: o.balance, status: st,
      advisor: o.advisor || null, fulfilment: o.fulfilment || 'delivery', addOnItems: o.addOnItems || null,
    };
  });

  // ================= PAYMENTS =================
  const payments = [
    { id: 'PAY-5012', date: '2026-07-24', orderId: 'ORD-2612', invoice: 'INV-2026-012', customer: 'Noraini Abdullah', initials: 'NA', kind: 'deposit', method: 'Bank Transfer', amount: 500, status: 'success' },
    { id: 'PAY-5011', date: '2026-07-15', orderId: 'ORD-2610', invoice: 'INV-2026-010', customer: 'Lim Sok Cheng', initials: 'LS', kind: 'deposit', method: 'Bank Transfer', amount: 500, status: 'success' },
    { id: 'PAY-5010', date: '2026-07-12', orderId: 'ORD-2607', invoice: 'INV-2026-007', customer: 'Chong Li Fen', initials: 'CL', kind: 'refund', method: 'DuitNow QR', amount: -500, status: 'refunded' },
    { id: 'PAY-5009', date: '2026-07-05', orderId: 'ORD-2609', invoice: 'INV-2026-009', customer: 'Rajesh Kumar', initials: 'RK', kind: 'full', method: 'Kad Kredit', amount: 650, status: 'success' },
    { id: 'PAY-5008', date: '2026-06-28', orderId: 'ORD-2608', invoice: 'INV-2026-008', customer: 'Aminah Yusof', initials: 'AY', kind: 'deposit', method: 'Bank Transfer', amount: 500, status: 'success' },
    { id: 'PAY-5007', date: '2026-06-25', orderId: 'ORD-2603', invoice: 'INV-2026-003', customer: 'Tan Wei Ming', initials: 'TW', kind: 'full', method: 'Bank Transfer', amount: 1500, status: 'success' },
    { id: 'PAY-5006', date: '2026-06-20', orderId: 'ORD-2605', invoice: 'INV-2026-005', customer: 'Siti Aisyah Mokhtar', initials: 'SA', kind: 'full', method: 'Tunai', amount: 1000, status: 'success' },
    { id: 'PAY-5005', date: '2026-06-05', orderId: 'ORD-2611', invoice: 'INV-2026-011', customer: 'Faizal Rahman', initials: 'FR', kind: 'full', method: 'DuitNow QR', amount: 900, status: 'success' },
    { id: 'PAY-5004', date: '2026-05-10', orderId: 'ORD-2604', invoice: 'INV-2026-004', customer: 'Dato\u2019 Kamarul Bahrin', initials: 'KB', kind: 'deposit', method: 'Bank Transfer', amount: 500, status: 'success' },
    { id: 'PAY-5003', date: '2026-07-03', orderId: 'ORD-2602', invoice: 'INV-2026-002', customer: 'Faizal Rahman', initials: 'FR', kind: 'deposit', method: 'DuitNow QR', amount: 500, status: 'success' },
    { id: 'PAY-5002', date: '2026-06-20', orderId: 'ORD-2601', invoice: 'INV-2026-001', customer: 'Nurul Huda binti Aziz', initials: 'NH', kind: 'deposit', method: 'Bank Transfer', amount: 500, status: 'success' },
  ];

  // ================= STAFF =================
  // role: Chef | Kitchen | Driver | Waiter | Supervisor ; avail: free | busy | off
  const staff = [
    { id: 'S01', name: 'Chef Rizal Hamzah', initials: 'RZ', role: 'Chef', team: 'Kitchen', phone: '012-700 1122', email: 'rizal@qaseh.my', avail: 'busy', assigned: ['ORD-2601', 'ORD-2604'], rating: 4.9, events: 128, since: '2019' },
    { id: 'S02', name: 'Farah Adlina', initials: 'FA', role: 'Chef', team: 'Kitchen', phone: '013-411 2233', email: 'farah@qaseh.my', avail: 'free', assigned: ['ORD-2608'], rating: 4.8, events: 96, since: '2020' },
    { id: 'S03', name: 'Mohd Khairul', initials: 'MK', role: 'Kitchen', team: 'Kitchen', phone: '017-882 3344', email: 'khairul@qaseh.my', avail: 'busy', assigned: ['ORD-2601'], rating: 4.6, events: 74, since: '2021' },
    { id: 'S04', name: 'Nurul Hidayah', initials: 'NH', role: 'Supervisor', team: 'Service', phone: '019-556 7788', email: 'hidayah@qaseh.my', avail: 'busy', assigned: ['ORD-2604', 'ORD-2601'], rating: 4.9, events: 152, since: '2018' },
    { id: 'S05', name: 'Syafiq Aziz', initials: 'SA', role: 'Waiter', team: 'Service', phone: '011-2211 3344', email: 'syafiq@qaseh.my', avail: 'free', assigned: ['ORD-2603'], rating: 4.5, events: 61, since: '2022' },
    { id: 'S06', name: 'Izzati Zaharin', initials: 'IZ', role: 'Waiter', team: 'Service', phone: '016-334 5566', email: 'izzati@qaseh.my', avail: 'free', assigned: [], rating: 4.7, events: 58, since: '2022' },
    { id: 'S07', name: 'Hafiz Mansor', initials: 'HM', role: 'Driver', team: 'Logistics', phone: '012-889 9001', email: 'hafiz@qaseh.my', avail: 'busy', assigned: ['ORD-2601', 'ORD-2608'], rating: 4.8, events: 210, since: '2017' },
    { id: 'S08', name: 'Jaya Krishnan', initials: 'JK', role: 'Driver', team: 'Logistics', phone: '013-667 7788', email: 'jaya@qaseh.my', avail: 'off', assigned: [], rating: 4.6, events: 188, since: '2019' },
    { id: 'S09', name: 'Amira Sofea', initials: 'AS', role: 'Waiter', team: 'Service', phone: '017-445 6677', email: 'amira@qaseh.my', avail: 'free', assigned: ['ORD-2604'], rating: 4.7, events: 44, since: '2023' },
    { id: 'S10', name: 'Zulkifli Osman', initials: 'ZO', role: 'Supervisor', team: 'Logistics', phone: '019-778 8990', email: 'zul@qaseh.my', avail: 'free', assigned: [], rating: 4.8, events: 133, since: '2018' },
    { id: 'S11', name: 'Rohana Ismail', initials: 'RI', role: 'Chef', team: 'Kitchen', phone: '012-556 1200', email: 'rohana@qaseh.my', avail: 'off', assigned: [], rating: 4.9, events: 89, since: '2021' },
    { id: 'S12', name: 'Danish Haikal', initials: 'DH', role: 'Kitchen', team: 'Kitchen', phone: '011-9988 7766', email: 'danish@qaseh.my', avail: 'free', assigned: ['ORD-2608'], rating: 4.4, events: 37, since: '2024' },
  ];

  // ================= CHART SERIES =================
  const charts = {
    kpis: [
      { key: 'revenue', ic: 'money', lab: 'Jumlah hasil (YTD)', val: 'RM 268,400', d: '+14.2%', up: true, col: CLR.purple, link: 'reports.html', spark: [38, 42, 40, 48, 46, 55, 52, 60, 58, 66, 63, 72] },
      { key: 'orders', ic: 'cart', lab: 'Tempahan bulan ini', val: '12', d: '+3', up: true, col: CLR.blue, link: 'orders.html', spark: [6, 8, 7, 9, 10, 9, 11, 10, 12, 11, 12, 12] },
      { key: 'events', ic: 'calendar', lab: 'Majlis akan datang', val: '5', d: '+2', up: true, col: CLR.orange, link: 'calendar.html', spark: [2, 3, 3, 4, 3, 4, 5, 4, 5, 5, 5, 5] },
      { key: 'pending', ic: 'clock', lab: 'Bayaran tertunggak', val: 'RM 18,600', d: '-8.0%', up: false, col: CLR.red, link: 'payments.html', spark: [40, 38, 42, 36, 34, 37, 32, 30, 31, 28, 27, 26] },
      { key: 'repeat', ic: 'repeat', lab: 'Pelanggan berulang', val: '62%', d: '+4.0%', up: true, col: CLR.green, link: 'customers.html', spark: [50, 52, 51, 54, 56, 55, 58, 60, 59, 61, 62, 62] },
      { key: 'aov', ic: 'avg', lab: 'Purata nilai tempahan', val: 'RM 2,980', d: '+6.1%', up: true, col: CLR.cyan, link: 'reports.html', spark: [24, 26, 25, 27, 26, 28, 27, 29, 28, 30, 29, 30] },
    ],
    orderStatus: [
      { k: 'Selesai', v: 5, c: CLR.green },
      { k: 'Disahkan', v: 4, c: CLR.blue },
      { k: 'Sedang sedia', v: 2, c: CLR.orange },
      { k: 'Menunggu', v: 1, c: CLR.yellow },
    ],
    byPackage: [
      { k: 'Buffet RM16', v: 22, c: CLR.purple },
      { k: 'Buffet RM13.50', v: 30, c: CLR.amber },
      { k: 'Buffet RM11.50', v: 28, c: CLR.blue },
      { k: 'Buffet RM10 & bawah', v: 20, c: CLR.gray },
    ],
    byEventType: [
      { k: 'Perkahwinan', v: 44, c: CLR.purple },
      { k: 'Kenduri / Kesyukuran', v: 26, c: CLR.cyan },
      { k: 'Pertunangan', v: 12, c: CLR.blue },
      { k: 'Aqiqah / Harijadi', v: 10, c: CLR.orange },
      { k: 'Korporat / Lain', v: 8, c: CLR.green },
    ],
    monthly: [
      { m: 'Mac', v: 22000 }, { m: 'Apr', v: 26000 }, { m: 'Mei', v: 24000 }, { m: 'Jun', v: 31000 },
      { m: 'Jul', v: 28000 }, { m: 'Ogos', v: 35000 }, { m: 'Sep', v: 33000 },
    ],
    yearly: [
      { m: '2023', v: 180000 }, { m: '2024', v: 212000 }, { m: '2025', v: 245000 }, { m: '2026', v: 268400 },
    ],
    weekly: [4, 6, 5, 8, 7, 9, 8, 11],
    sales: [0.9, 1.1, 0.8, 1.2, 1.0, 1.4, 1.3, 1.1, 1.5, 1.3, 1.7, 1.5, 1.2, 1.7, 1.5, 1.8, 1.6, 1.4, 1.9, 1.7, 2.1, 1.6, 1.9, 1.8, 2.2, 1.9, 2.4, 2.0, 2.2, 2.5],
    customerGrowth: [4, 6, 5, 7, 9, 8, 10, 11, 10, 12, 13, 15],
    topMenu: [
      { k: 'Nasi Minyak Hujan Panas', v: 88 }, { k: 'Ayam Masak Merah', v: 82 },
      { k: 'Daging Rendang Tok', v: 64 }, { k: 'Ayam Golek', v: 41 },
      { k: 'Udang Masak Kari', v: 33 },
    ],
    peakMonths: [
      { m: 'Jan', v: 4 }, { m: 'Feb', v: 5 }, { m: 'Mac', v: 7 }, { m: 'Apr', v: 9 },
      { m: 'Mei', v: 8 }, { m: 'Jun', v: 12 }, { m: 'Jul', v: 10 }, { m: 'Ogos', v: 14 },
      { m: 'Sep', v: 11 }, { m: 'Okt', v: 8 }, { m: 'Nov', v: 15 }, { m: 'Dis', v: 18 },
    ],
  };

  // ================= NOTIFICATIONS =================
  const notifs = [
    { ic: 'ring', unread: true, html: 'Tempahan kahwin baharu diterima · <b>400 pax</b> di Langkap.', tm: '6 min lalu', link: 'orders.html', orderId: 'ORD-2601' },
    { ic: 'check', unread: true, html: 'Invois <b>INV-2026-003</b> telah dibayar penuh — RM 1,500.', tm: '34 min lalu', link: 'invoices.html' },
    { ic: 'cal', unread: true, html: 'Esok: <b>Kenduri Kesyukuran</b> · 200 pax di Teluk Intan.', tm: '1 jam lalu', link: 'orders.html', orderId: 'ORD-2602' },
    { ic: 'fire', unread: true, html: 'Penyediaan dapur untuk majlis bermula <b>7:00 pagi</b>.', tm: '2 jam lalu', link: 'calendar.html' },
    { ic: 'user', unread: false, html: '<b>Vikram Nair</b> mendaftar sebagai pelanggan korporat baharu.', tm: 'Semalam', link: 'customers.html' },
    { ic: 'check', unread: false, html: 'Deposit <b>RM 500</b> diterima untuk INV-2026-012.', tm: 'Semalam', link: 'payments.html' },
  ];

  // ================= TODAY SCHEDULE =================
  const schedule = [
    { t: '07:00', ap: 'AM', b: 'Penyediaan dapur', s: 'Kahwin · 400 pax menu utama', st: 'done' },
    { t: '09:30', ap: 'AM', b: 'Penghantaran', s: '1 lori → Dewan Langkap', st: 'done' },
    { t: '11:00', ap: 'AM', b: 'Set-up khemah & buffet', s: 'Dewan Orang Ramai Langkap', st: 'active' },
    { t: '01:00', ap: 'PM', b: 'Hidangan mempelai', s: 'Rombongan pengantin ~30 pax', st: '' },
    { t: '04:00', ap: 'PM', b: 'Kemas & angkut', s: 'Kutip semula peralatan', st: '' },
  ];

  const reviews = [
    { n: 'Siti Aisyah', in: 'SA', t: 'Servis hebat untuk majlis aqiqah kami — pasukan uruskan 100 tetamu tanpa masalah.' },
  ];

  // ================= INVENTORY / STOCK =================
  // Kod ikut kategori: BK=Barang Kering, AY=Ayam/Itik, DG=Daging, SY=Sayur, TN=Tenusu, RP=Rempah, ML=Makanan Laut
  const invDefaults = [
    { id: 'BK01', name: 'Beras Basmathi', cat: 'Barang Kering', unit: 'kg', qty: 120, reorder: 80, cost: 3.2, supplier: 'Pasar Borong Perak' },
    { id: 'BK02', name: 'Minyak Masak', cat: 'Barang Kering', unit: 'L', qty: 90, reorder: 50, cost: 6.8, supplier: 'Borong Teluk Intan' },
    { id: 'BK03', name: 'Gula', cat: 'Barang Kering', unit: 'kg', qty: 70, reorder: 40, cost: 2.8, supplier: 'Borong Teluk Intan' },
    { id: 'BK04', name: 'Tepung Gandum', cat: 'Barang Kering', unit: 'kg', qty: 48, reorder: 25, cost: 3.0, supplier: 'Borong Teluk Intan' },
    { id: 'AY01', name: 'Ayam', cat: 'Ayam/Itik', unit: 'kg', qty: 45, reorder: 60, cost: 9.5, supplier: 'Ayamas Teluk Intan' },
    { id: 'DG01', name: 'Daging Lembu', cat: 'Daging', unit: 'kg', qty: 0, reorder: 40, cost: 38, supplier: 'Pembekal Daging Bidor' },
    { id: 'SY01', name: 'Bawang Merah', cat: 'Sayur', unit: 'kg', qty: 28, reorder: 30, cost: 7.5, supplier: 'Pasar Tani Langkap' },
    { id: 'SY02', name: 'Kentang', cat: 'Sayur', unit: 'kg', qty: 55, reorder: 30, cost: 4.5, supplier: 'Pasar Tani Langkap' },
    { id: 'TN01', name: 'Santan', cat: 'Tenusu', unit: 'L', qty: 65, reorder: 40, cost: 4.2, supplier: 'Kilang Santan Langkap' },
    { id: 'TN02', name: 'Telur', cat: 'Tenusu', unit: 'papan', qty: 18, reorder: 20, cost: 13, supplier: 'Ladang Telur Perak' },
    { id: 'RP01', name: 'Cili Kering', cat: 'Rempah', unit: 'kg', qty: 22, reorder: 15, cost: 18, supplier: 'Rempah Ratus Sdn' },
    { id: 'ML01', name: 'Ikan Siakap', cat: 'Makanan Laut', unit: 'kg', qty: 32, reorder: 25, cost: 16, supplier: 'Nelayan Bagan' },
    { id: 'ML02', name: 'Udang', cat: 'Makanan Laut', unit: 'kg', qty: 20, reorder: 22, cost: 32, supplier: 'Nelayan Bagan' },
  ];
  let inventory = invDefaults;
  try { const s = JSON.parse(localStorage.getItem('qaseh_inv2') || 'null'); if (Array.isArray(s) && s.length) inventory = s; } catch (e) {}
  const stockStatus = i => i.qty <= 0 ? 'out' : (i.qty <= i.reorder ? 'low' : 'ok');
  inventory.forEach(i => { i.status = stockStatus(i); i.value = +(Number(i.qty) * Number(i.cost)).toFixed(2); });

  // Bill of Materials — kuantiti bahan untuk setiap 100 pax (katerer boleh ubah sendiri)
  const bomBase = 100;
  const bomDefaults = {
    'Buffet RM16': [{ id: 'BK01', q: 15 }, { id: 'AY01', q: 22 }, { id: 'DG01', q: 15 }, { id: 'ML02', q: 6 }, { id: 'RP01', q: 1 }],
    'Buffet RM13.50': [{ id: 'BK01', q: 15 }, { id: 'AY01', q: 20 }, { id: 'DG01', q: 18 }, { id: 'TN01', q: 5 }],
    'Buffet RM11.50': [{ id: 'BK01', q: 14 }, { id: 'AY01', q: 20 }, { id: 'DG01', q: 12 }, { id: 'SY02', q: 6 }],
    'Buffet RM10': [{ id: 'BK01', q: 14 }, { id: 'AY01', q: 18 }, { id: 'SY02', q: 10 }, { id: 'BK02', q: 3 }],
    'Buffet RM9.30': [{ id: 'BK01', q: 13 }, { id: 'AY01', q: 18 }, { id: 'ML01', q: 8 }, { id: 'SY01', q: 2 }],
    'Hidangan Mempelai': [{ id: 'AY01', q: 90 }, { id: 'ML01', q: 80 }, { id: 'ML02', q: 60 }, { id: 'SY02', q: 40 }],
  };
  let bom = bomDefaults;
  try { const s = JSON.parse(localStorage.getItem('qaseh_bom2') || 'null'); if (s && typeof s === 'object') bom = s; } catch (e) {}

  // ================= SUBSCRIPTION / HOSTING =================
  const billing = {
    plan: { name: 'Static Web (Netlify)', price: 0, cycle: 'month', next: '—', status: 'active', card: 'Tiada bil bulanan' },
    items: [
      { type: 'Domain', name: 'qasehkatering.my', provider: 'MYNIC', expiry: '2026-08-18', cost: 90, cycle: 'year', auto: true },
      { type: 'Hosting', name: 'Netlify — Free tier', provider: 'Netlify', expiry: '—', cost: 0, cycle: 'month', auto: true },
      { type: 'SSL Certificate', name: 'Auto SSL (percuma)', provider: "Let's Encrypt", expiry: '2026-10-05', cost: 0, cycle: 'year', auto: true },
      { type: 'Data', name: 'Google Sheets (percuma)', provider: 'Google', expiry: '—', cost: 0, cycle: 'month', auto: true },
    ],
    invoices: [
      { no: 'DOM-2026', date: '2025-08-18', amount: 90, status: 'paid' },
    ],
  };

  global.DEMO = {
    RM, RMk, BRAND, USER, CLR, PACKAGES, MENUS, deposits, canopy, addons, advisors, terms,
    orders, customers, invoices, payments, staff, charts, notifs, schedule, reviews, billing, inventory, bom, bomBase,
    getStockItem: id => inventory.find(i => i.id === id),
    addBooking: (o) => {
      o.balance = (o.total || 0) - (o.deposit || 0);
      orders.unshift(o);
      try { const ex = JSON.parse(localStorage.getItem('qaseh_bookings') || '[]'); ex.unshift(o); localStorage.setItem('qaseh_bookings', JSON.stringify(ex.slice(0, 100))); } catch (e) {}
      return o;
    },
    clearBookings: () => { try { localStorage.removeItem('qaseh_bookings'); } catch (e) {} },
    saveInventory: () => { try { localStorage.setItem('qaseh_inv2', JSON.stringify(inventory)); } catch (e) {} },
    saveBom: () => { try { localStorage.setItem('qaseh_bom2', JSON.stringify(bom)); } catch (e) {} },
    resetInventory: () => { try { localStorage.removeItem('qaseh_inv2'); localStorage.removeItem('qaseh_bom2'); } catch (e) {} },
    daysUntil: iso => Math.round((new Date(iso + 'T00:00:00') - new Date('2026-08-03T00:00:00')) / 86400000),
    getOrder: id => orders.find(o => o.id === id),
    getCustomer: id => customers.find(c => c.id === id),
    getInvoice: no => invoices.find(i => i.no === no),
    ordersByCustomer: id => orders.filter(o => o.customerId === id),
    paymentsByCustomer: id => payments.filter(p => { const o = orders.find(x => x.id === p.orderId); return o && o.customerId === id; }),
    pkgColor: p => (PACKAGES[p] ? PACKAGES[p].color : CLR.gray),
  };

})(window);
