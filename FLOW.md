# Qaseh Katering — Aliran Sistem (Flow)

Dokumen ini terangkan **macam mana sistem berfungsi dari awal ke akhir**, supaya tak pening.
Ringkasnya ada 2 pihak: **Pelanggan** (guna website / WhatsApp) dan **Admin/Bos** (guna Dashboard).

---

## Gambaran besar (satu ayat)

> Pelanggan pilih pakej di **website** → hantar ke **sistem** → **Admin** nampak di Dashboard →
> Admin **WhatsApp** pelanggan untuk runding (harga, lokasi, transport) → Admin **sahkan tempahan** →
> jejak **deposit/bayaran** → uruskan **kalendar & staf** → tolak **stok** bila masak → **laporan sales** automatik.

---

## 1) Pelanggan buat tempahan

Ada **2 jalan masuk** — kedua-dua berakhir di sistem yang sama:

**A. Melalui Website (`index.html`)**
1. Pelanggan pilih **pakej** (boleh lebih dari satu — Buffet + Hidangan Mempelai + Dessert) dalam kalkulator.
2. Pilih **tambahan** (Khemah, Pelamin, DJ & PA, Kambing).
3. Isi borang: nama, telefon, **lokasi majlis**, jenis majlis, tarikh, mesej.
4. Dua pilihan hantar:
   - **"Hantar kepada Qaseh"** → data disimpan terus ke **sistem** (muncul di Dashboard).
   - **"Hantar melalui WhatsApp"** → buka WhatsApp dengan mesej **sudah auto-isi** (pakej, pax, anggaran). *Jadi apa yang dia pilih tadi tak hilang* — ia dibawa masuk ke chat.

**B. Melalui WhatsApp terus (tanpa borang)**
- Pelanggan chat biasa. **Admin key-in manual** ke sistem (halaman Orders → New order).
- Ini penting untuk **analisis sales** — semua tempahan mesti masuk sistem supaya nombor jualan tepat.

> Intinya: **semua tempahan akhirnya masuk sistem** — sama ada pelanggan hantar sendiri, atau admin key-in. Itu yang buat laporan sales lengkap.

---

## 2) Admin nampak & runding (Dashboard)

- Bila pelanggan hantar dari website, ia muncul di **Dashboard → Needs attention → Action center** sebagai **"New enquiry"**.
- Klik enquiry → nampak butiran penuh: nama, telefon, **lokasi majlis**, pakej dipilih, pax, anggaran, mesej.
- Ada 2 butang:
  - **Reply on WhatsApp** → terus balas pelanggan (mesej auto-isi). Di sini admin **runding harga** — sebab kena tahu jarak/lokasi dulu (transport RM100 jika >30km dari Langkap).
  - **Convert to order** → jadikan tempahan rasmi dalam sistem.
- Selepas runding, admin **ejas** ikut yang pelanggan nak tambah/kurang, letak **alamat penuh**, dan sahkan.

> Lokasi sudah ditanya di borang → admin boleh anggar transport awal sebelum WhatsApp.

---

## 3) Tempahan rasmi (Orders)

Bila jadi order rasmi, ia ada status:
- **Pending** — baru masuk, belum sah / belum deposit.
- **Confirmed** — pelanggan setuju & deposit dibayar (tarikh dikunci).
- **Preparing** — dekat tarikh majlis, dapur sedang sedia.
- **Completed** — majlis selesai.
- **Cancelled** — dibatalkan.

Setiap order simpan: pelanggan, pakej + menu, servis (khemah/pelamin/meja/kerusi), tambahan, jumlah, deposit, baki, alamat + peta, timeline.

---

## 4) Elak tempahan bertindih (Kalendar)

- Halaman **Calendar** papar semua majlis ikut tarikh (chip berwarna ikut status).
- Admin boleh nampak sekali pandang **berapa majlis pada satu hari** → elak tertindih.
- Bahagian atas kalendar ada ringkasan: berapa event, jumlah tetamu, event confirmed bulan itu.

> *(Boleh tambah nanti: had "berapa event maksimum sehari" + amaran merah kalau melebihi. Beritahu kalau nak.)*

---

## 5) Jejak siapa bayar deposit / belum (Payments & Invoices)

Ini yang selalu buat pening — sistem buat ia senang:

**Status pembayaran setiap order/invois:**
| Status | Maksud |
|---|---|
| 🔴 **Unpaid** | Belum bayar apa-apa (belum deposit) |
| 🟠 **Partial (Deposit)** | Deposit dah bayar, ada **baki** |
| 🟢 **Paid** | Bayar penuh |
| ⚪ **Refunded** | Dipulangkan (batal) |

- **Halaman Invoices**: senarai semua invois + kolum **Baki** + status berwarna. Tapis ikut status (Paid / Deposit / Pending / Overdue). Klik → preview invois, boleh Print/PDF.
- **Halaman Payments**: setiap transaksi (deposit / penuh / refund), kaedah (Bank/DuitNow/Tunai), tarikh, jumlah. Klik → resit + timeline bayaran.
- **Dashboard**: kad "Bayaran tertunggak" + Action center flag invois **Overdue**.

> Jadi untuk tahu "siapa bayar deposit": buka **Invoices**, tapis **Deposit paid** → itulah yang dah deposit tapi belum langsai. Tapis **Unpaid** → belum bayar langsung.

---

## 6) Aliran stok & bahan (Inventory)

Cara fikir stok:
1. **Senarai stok** (Inventory) — setiap bahan ada: kuantiti semasa, paras pesan semula, status (Ada / Rendah / Habis), kos, nilai.
2. **Bahan untuk 1 pax** — untuk setiap pakej, sistem tahu berapa bahan diperlukan untuk 1 pax (cth Beras 0.15kg/pax) + **kos makanan/pax & margin**.
3. **Requirements planner** — pilih pakej + pax → sistem kira **jumlah bahan diperlukan** vs **stok ada**, dan tunjuk mana **tak cukup** (kena beli).
4. **Kemas kini stok** — klik item → masukkan kuantiti baharu / +50 / −10 (bila beli atau guna). Status auto-berubah (hijau/kuning/merah).
5. **Amaran** — bila stok rendah/habis, ia flag di **Dashboard → Action center** ("Stok rendah · Ayam").

> Aliran mudah: **beli bahan → update stok naik**. **Ada majlis → guna Requirements planner untuk tahu perlu berapa → update stok turun**. Sistem sentiasa tunjuk apa perlu dibeli.

---

## 7) Analisis jualan (Reports)

Sebab semua tempahan masuk sistem, **Reports** auto-jana:
- Hasil (harian/bulanan/tahunan), tempahan, purata nilai tempahan.
- Pakej paling laris, jenis majlis, menu top, bulan puncak.
- Pertumbuhan pelanggan, pelanggan terbaik.
- **Ulasan pelanggan** (dari website) + purata rating.
- Butang Export (PDF/CSV).

---

## Ringkasan aliran (langkah demi langkah)

```
1. Pelanggan pilih pakej + tambahan di website (atau chat WhatsApp)
2. Hantar → SISTEM (atau admin key-in manual)
3. Admin nampak enquiry di Dashboard → WhatsApp pelanggan → runding harga/lokasi/transport
4. Admin sahkan → jadi ORDER (letak alamat, ejas tambahan)
5. Pelanggan bayar DEPOSIT → status "Deposit paid", tarikh dikunci (Calendar)
6. Admin assign STAF (Team & duties) untuk event itu
7. Dekat tarikh: guna INVENTORY (Requirements planner) → tahu bahan perlu → update stok
8. Bayaran PENUH sebelum seminggu → status "Paid"
9. Majlis selesai → "Completed"
10. Semua data → REPORTS (sales analysis automatik)
```

---

## Peranan (siapa nampak apa)

| Peranan | Akses |
|---|---|
| **Owner / Admin** | Semua (termasuk sales, kewangan, stok, tetapan) |
| **Operations Manager** | Semua kecuali Settings |
| **Finance** | Dashboard, Invoices, Payments, Reports |
| **Staff / Crew** | **Calendar sahaja** — tugasan mereka (tiada sales) |

---

*Nota: versi sekarang guna data demo (localStorage). Untuk produk sebenar, sambung ke Google Sheets / Supabase supaya data dikongsi semua peranti & staf secara masa nyata.*
