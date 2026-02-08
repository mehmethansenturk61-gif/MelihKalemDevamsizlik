// KTÜ Elektrik-Elektronik 2. Sınıf (A Grubu - Türkçe) Ders Listesi
// Not: Ana derslerin saatlerini bölüm panosuna göre güncelleyebilirsiniz.

const dersListesi = [
  // --- PAZARTESİ ---
  { 
    ad: "Diferansiyel Denklemler", 
    hoca: "Matematik Bölümü", 
    gun: "Pazartesi", 
    saat: "09:00 - 12:00", 
    sinif: "D-101", 
    limit: 12 // Haftada 3 saat -> 12 hak
  },
  { 
    ad: "Kariyer Planlama (USEC)", 
    hoca: "Prof. Dr. Hülya KALAYCIOĞLU", 
    gun: "Pazartesi", 
    saat: "19:00 - 19:50", 
    sinif: "UZEM (Online)", 
    limit: 4 // Haftada 1 saat -> 4 hak
  },

  // --- SALI ---
  { 
    ad: "Elektrik Devreleri II", 
    hoca: "Öğr. Üyesi (A Grubu)", 
    gun: "Salı", 
    saat: "08:00 - 12:00", 
    sinif: "Amfi-2", 
    limit: 16 // Haftada 4 saat -> 16 hak
  },
  { 
    ad: "Sayısal Analiz", 
    hoca: "Dr. Öğr. Üyesi", 
    gun: "Salı", 
    saat: "13:00 - 16:00", 
    sinif: "D-102", 
    limit: 12 
  },

  // --- ÇARŞAMBA ---
  { 
    ad: "Elektronik I", 
    hoca: "Doç. Dr. (A Grubu)", 
    gun: "Çarşamba", 
    saat: "09:00 - 12:00", 
    sinif: "Amfi-1", 
    limit: 12 
  },
  { 
    ad: "Meslek Etiği (LUBEC)", 
    hoca: "Öğr. Gör. Dr. Canan YILMAZ", 
    gun: "Çarşamba", 
    saat: "20:00 - 20:50", 
    sinif: "UZEM (Online)", 
    limit: 4 // Haftada 1 saat -> 4 hak
  },

  // --- PERŞEMBE ---
  { 
    ad: "Elektromanyetik Alanlar", 
    hoca: "Prof. Dr. Ayten ATASOY", 
    gun: "Perşembe", 
    saat: "10:00 - 12:00", 
    sinif: "D-203", 
    limit: 8 // Haftada 2 saat -> 8 hak (veya 3 ise 12)
  },
  { 
    ad: "Mesleki İngilizce II", 
    hoca: "Yabancı Diller Y.O.", 
    gun: "Perşembe", 
    saat: "13:00 - 15:00", 
    sinif: "D-105", 
    limit: 8 
  },

  // --- CUMA ---
  { 
    ad: "Elektronik Lab. I", 
    hoca: "Arş. Gör. (A Grubu)", 
    gun: "Cuma", 
    saat: "13:00 - 15:00", 
    sinif: "Lab-1", 
    limit: 4 // Lablarda genelde hak azdır
  },
  { 
    ad: "K. Verilerin Korunması (USEC)", 
    hoca: "Öğr. Gör. Ali Haydar DOĞU", 
    gun: "Cuma", 
    saat: "11:00 - 11:30", 
    sinif: "UZEM (Online)", 
    limit: 4 
  }
];

const container = document.getElementById("dersler");

function yukle() {
  container.innerHTML = "";

  dersListesi.forEach(ders => {
    // localStorage anahtarı (Melih için unique olsun)
    const key = "melih_" + ders.ad; 
    const yapilan = Number(localStorage.getItem(key) || 0);
    const kalan = ders.limit - yapilan;

    let durum = "ok";
    let durumYazisi = "Güvendesin";
    
    // Yüzdelik Durum Hesaplama
    if (kalan <= 0) {
        durum = "tehlike";
        durumYazisi = "Kaldın!";
    } else if (kalan <= 2) {
        durum = "uyari";
        durumYazisi = "Dikkat!";
    }

    const div = document.createElement("div");
    div.className = "ders";
    div.innerHTML = `
      <div class="ders-ust">
        <span class="ders-kod">${ders.gun}</span>
        <span class="ders-hoca">${ders.hoca}</span>
      </div>

      <h3>${ders.ad}</h3>

      <div class="ders-program-bilgi">
        <span><i class="fa-regular fa-clock"></i> ${ders.saat}</span>
        <span><i class="fa-solid fa-location-dot"></i> ${ders.sinif}</span>
      </div>

      <div class="bilgiler">
        <span class="yapilan-badge">Yoklama: <strong>${yapilan}</strong></span>
        <span class="kalan-badge ${durum}">
          Kalan Hak: <strong>${kalan}</strong>
        </span>
      </div>

      <div class="butonlar">
        <button class="azalt" onclick="degistir('${key}', -1)"><i class="fa-solid fa-rotate-left"></i> Sil</button>
        <button class="arttir" onclick="degistir('${key}', 1)"><i class="fa-solid fa-plus"></i> Ekle</button>
      </div>
    `;

    container.appendChild(div);
  });
}

function degistir(key, miktar) {
  // Mevcut devamsızlığı al
  let yapilan = Number(localStorage.getItem(key) || 0);
  
  // İlgili dersin limitini bul
  const dersAdi = key.replace("melih_", "");
  const dersObj = dersListesi.find(d => d.ad === dersAdi);
  const limit = dersObj ? dersObj.limit : 20;

  if (miktar > 0 && yapilan < limit) {
      yapilan++;
  } else if (miktar < 0 && yapilan > 0) {
      yapilan--;
  }

  localStorage.setItem(key, yapilan);
  yukle();
}

yukle();