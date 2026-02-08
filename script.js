// KTÜ Elektrik-Elektronik 2. Sınıf (Sadeleştirilmiş Versiyon)
// Sadece Ders Adı + Devamsızlık Takibi

const dersListesi = [
  { ad: "Devreler II", limit: 8 },
  { ad: "Mühendislikte İngilizce II", limit: 8 },
  { ad: "Sayısal Çözümleme", limit: 8 },
  { ad: "Elektronik I", limit: 8 },
  { ad: "Mühendislik Matematiği", limit: 8 },
  { ad: "Elektromanyetik Dalgalar", limit: 8 },
  { ad: "Güç Sistemleri", limit: 8 }
];

const container = document.getElementById("dersler");

function yukle() {
  container.innerHTML = "";

  dersListesi.forEach(ders => {
    // localStorage'dan veriyi çek
    const key = "melih_" + ders.ad.replace(/\s/g, ""); 
    const yapilan = Number(localStorage.getItem(key) || 0);
    const kalan = ders.limit - yapilan;

    // Renk durumunu ayarla
    let durum = "ok";
    if (kalan <= 0) durum = "tehlike";
    else if (kalan <= 2) durum = "uyari";

    const div = document.createElement("div");
    div.className = "ders";
    // Daha sade bir tasarım için stil düzenlemesi
    div.style.textAlign = "center"; 
    div.style.padding = "15px";

    div.innerHTML = `
      <h3 style="margin-bottom: 15px; font-size: 1.2rem;">${ders.ad}</h3>

      <div class="bilgiler" style="justify-content: center; gap: 15px; margin-bottom: 15px;">
        <span class="yapilan-badge">Yoklama: <strong>${yapilan}</strong></span>
        <span class="kalan-badge ${durum}">
          Kalan: <strong>${kalan}</strong>
        </span>
      </div>

      <div class="butonlar" style="justify-content: center;">
        <button class="azalt" onclick="degistir('${ders.ad}', -1)"><i class="fa-solid fa-rotate-left"></i> Sil</button>
        <button class="arttir" onclick="degistir('${ders.ad}', 1)"><i class="fa-solid fa-plus"></i> Ekle</button>
      </div>
    `;

    container.appendChild(div);
  });
}

function degistir(dersAdi, miktar) {
  const key = "melih_" + dersAdi.replace(/\s/g, "");
  let yapilan = Number(localStorage.getItem(key) || 0);
  const limit = 8; 

  if (miktar > 0 && yapilan < limit) {
      yapilan++;
  } else if (miktar < 0 && yapilan > 0) {
      yapilan--;
  }

  localStorage.setItem(key, yapilan);
  yukle();
}

yukle();