// KTÜ Elektrik-Elektronik 2. Sınıf (A Grubu - Türkçe)
// Kural: Haftada 1 saat ders = 4 Hak | Diğerleri = 8 Hak

const dersListesi = [
  // --- PAZARTESİ ---
  { 
    ad: "Diferansiyel Denklemler", 
    hoca: "Matematik Bölümü", 
    gun: "Pazartesi", 
    saat: "09:00 - 12:00", 
    sinif: "Derslik", 
    limit: 8 // Çok saatli ders -> 8 Hak
  },
  { 
    ad: "Kariyer Planlama (USEC)", 
    hoca: "Prof. Dr. Hülya KALAYCIOĞLU", 
    gun: "Pazartesi", 
    saat: "19:00 - 19:50", 
    sinif: "UZEM (Online)", 
    limit: 4 // 1 saatlik ders -> 4 Hak
  },

  // --- SALI ---
  { 
    ad: "Elektrik Devreleri II", 
    hoca: "Öğr. Üyesi (A Grubu)", 
    gun: "Salı", 
    saat: "08:00 - 12:00", 
    sinif: "Derslik", 
    limit: 8 
  },
  { 
    ad: "Sayısal Analiz", 
    hoca: "Dr. Öğr. Üyesi", 
    gun: "Salı", 
    saat: "13:00 - 16:00", 
    sinif: "Derslik", 
    limit: 8 
  },

  // --- ÇARŞAMBA ---
  { 
    ad: "Elektronik I", 
    hoca: "Doç. Dr. (A Grubu)", 
    gun: "Çarşamba", 
    saat: "09:00 - 12:00", 
    sinif: "Derslik", 
    limit: 8 
  },
  { 
    ad: "Meslek Etiği (LUBEC)", 
    hoca: "Öğr. Gör. Dr. Canan YILMAZ", 
    gun: "Çarşamba", 
    saat: "20:00 - 20:50", 
    sinif: "UZEM (Online)", 
    limit: 4 
  },

  // --- PERŞEMBE ---
  { 
    ad: "Elektromanyetik Alanlar", 
    hoca: "Prof. Dr. Ayten ATASOY", 
    gun: "Perşembe", 
    saat: "10:00 - 12:00", 
    sinif: "Derslik", 
    limit: 8 
  },
  { 
    ad: "Mesleki İngilizce II", 
    hoca: "Yabancı Diller Y.O.", 
    gun: "Perşembe", 
    saat: "13:00 - 15:00", 
    sinif: "Derslik", 
    limit: 8 
  },

  // --- CUMA ---
  { 
    ad: "Elektronik Lab. I", 
    hoca: "Arş. Gör. (A Grubu)", 
    gun: "Cuma", 
    saat: "13:00 - 15:00", 
    sinif: "Laboratuvar", 
    limit: 8 
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
    // localStorage anahtarı
    const key = "melih_" + ders.ad; 
    const yapilan = Number(localStorage.getItem(key) || 0);
    const kalan = ders.limit - yapilan;

    let durum = "ok";
    if (kalan <= 0) {
        durum = "tehlike";
    } else if (kalan <= 2) {
        durum = "uyari";
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
  let yapilan = Number(localStorage.getItem(key) || 0);
  const dersAdi = key.replace("melih_", "");
  const dersObj = dersListesi.find(d => d.ad === dersAdi);
  const limit = dersObj ? dersObj.limit : 8; 

  if (miktar > 0 && yapilan < limit) {
      yapilan++;
  } else if (miktar < 0 && yapilan > 0) {
      yapilan--;
  }

  localStorage.setItem(key, yapilan);
  yukle();
}

yukle();