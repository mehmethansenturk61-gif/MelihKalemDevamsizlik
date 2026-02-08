// KTÜ Elektrik-Elektronik 2. Sınıf (Dinamik Düzenlenebilir)

// İlk açılışta varsayılan liste (Eğer telefondan değiştirirsen burası ezilir)
const varsayilanDersler = [
  { ad: "Devreler II", hoca: "Girmek için tıkla", gun: "Girilmedi", saat: "00:00", sinif: "Derslik", limit: 8 },
  { ad: "Mühendislikte İngilizce II", hoca: "Yabancı Diller Y.O.", gun: "Perşembe", saat: "13:00 - 15:00", sinif: "Derslik", limit: 8 },
  { ad: "Sayısal Çözümleme", hoca: "Dr. Öğr. Üyesi", gun: "Salı", saat: "13:00 - 16:00", sinif: "Derslik", limit: 8 },
  { ad: "Elektronik I", hoca: "Doç. Dr. (A Grubu)", gun: "Çarşamba", saat: "09:00 - 12:00", sinif: "Derslik", limit: 8 },
  { ad: "Mühendislik Matematiği", hoca: "Matematik Bölümü", gun: "Girilmedi", saat: "00:00", sinif: "Derslik", limit: 8 },
  { ad: "Elektromanyetik Dalgalar", hoca: "Prof. Dr. Ayten ATASOY", gun: "Perşembe", saat: "10:00 - 12:00", sinif: "Derslik", limit: 8 },
  { ad: "Güç Sistemleri", hoca: "Girmek için tıkla", gun: "Girilmedi", saat: "00:00", sinif: "Derslik", limit: 8 }
];

const container = document.getElementById("dersler");

function yukle() {
  container.innerHTML = "";

  varsayilanDersler.forEach(ders => {
    // 1. Önce kayıtlı bilgi var mı diye bakıyoruz (Telefondan girdiğin veriler)
    const kayitliBilgi = JSON.parse(localStorage.getItem("melih_bilgi_" + ders.ad));
    
    // Eğer kayıt varsa onu kullan, yoksa varsayılanı kullan
    const guncelDers = kayitliBilgi ? { ...ders, ...kayitliBilgi } : ders;

    // 2. Devamsızlık takibi (Eski sistem devam ediyor)
    const key = "melih_" + ders.ad.replace(/\s/g, ""); 
    const yapilan = Number(localStorage.getItem(key) || 0);
    const kalan = guncelDers.limit - yapilan;

    let durum = "ok";
    if (kalan <= 0) durum = "tehlike";
    else if (kalan <= 2) durum = "uyari";

    // 3. HTML Oluşturma
    const div = document.createElement("div");
    div.className = "ders";
    div.innerHTML = `
      <div class="ders-ust">
        <span class="ders-kod">${guncelDers.gun}</span>
        
        <button class="duzenle-btn" onclick="bilgiDuzenle('${ders.ad}')" style="background:none; border:none; color:#fff; cursor:pointer;">
            <i class="fa-solid fa-pen-to-square"></i> Düzenle
        </button>
      </div>

      <h3>${guncelDers.ad}</h3>
      <div style="font-size: 0.9em; color: #ccc; margin-bottom: 5px;">${guncelDers.hoca}</div>

      <div class="ders-program-bilgi">
        <span><i class="fa-regular fa-clock"></i> ${guncelDers.saat}</span>
        <span><i class="fa-solid fa-location-dot"></i> ${guncelDers.sinif}</span>
      </div>

      <div class="bilgiler">
        <span class="yapilan-badge">Yoklama: <strong>${yapilan}</strong></span>
        <span class="kalan-badge ${durum}">
          Kalan: <strong>${kalan}</strong>
        </span>
      </div>

      <div class="butonlar">
        <button class="azalt" onclick="devamsizlikDegistir('${ders.ad}', -1)"><i class="fa-solid fa-rotate-left"></i> Sil</button>
        <button class="arttir" onclick="devamsizlikDegistir('${ders.ad}', 1)"><i class="fa-solid fa-plus"></i> Ekle</button>
      </div>
    `;

    container.appendChild(div);
  });
}

// Devamsızlık Ekle/Sil Fonksiyonu
function devamsizlikDegistir(dersAdi, miktar) {
  const key = "melih_" + dersAdi.replace(/\s/g, "");
  let yapilan = Number(localStorage.getItem(key) || 0);
  
  // Limiti bul (8 hak)
  const limit = 8; 

  if (miktar > 0 && yapilan < limit) {
      yapilan++;
  } else if (miktar < 0 && yapilan > 0) {
      yapilan--;
  }

  localStorage.setItem(key, yapilan);
  yukle();
}

// --- YENİ EKLENEN KISIM: Telefondan Bilgi Düzenleme ---
function bilgiDuzenle(dersAdi) {
    // Mevcut bilgileri çek
    const kayitli = JSON.parse(localStorage.getItem("melih_bilgi_" + dersAdi)) || {};
    
    // Kullanıcıya sor (Telefonda popup açılır)
    const yeniHoca = prompt("Hoca Adını Giriniz:", kayitli.hoca || "Hoca Adı");
    if (yeniHoca === null) return; // İptal ederse çık

    const yeniGun = prompt("Ders Gününü Giriniz (Pazartesi, Salı...):", kayitli.gun || "Pazartesi");
    if (yeniGun === null) return;

    const yeniSaat = prompt("Ders Saatini Giriniz (09:00 - 12:00):", kayitli.saat || "09:00 - 12:00");
    if (yeniSaat === null) return;

    // Yeni bilgileri kaydet
    const yeniVeriler = {
        hoca: yeniHoca,
        gun: yeniGun,
        saat: yeniSaat
    };

    localStorage.setItem("melih_bilgi_" + dersAdi, JSON.stringify(yeniVeriler));
    
    // Sayfayı yenile ki değişiklik görünsün
    yukle();
}

yukle();