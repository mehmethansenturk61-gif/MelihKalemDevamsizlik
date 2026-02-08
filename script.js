// KTÜ Elektrik-Elektronik 2. Sınıf (Sihirli Link Yedekleme)

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

// Sayfa yüklendiğinde URL'de veri var mı diye bak (Geri Yükleme Kısmı)
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1); // #'den sonrasını al
    if (hash) {
        try {
            // Base64 şifresini çöz ve veriyi yükle
            const cozulmusVeri = JSON.parse(atob(hash));
            Object.keys(cozulmusVeri).forEach(key => {
                localStorage.setItem(key, cozulmusVeri[key]);
            });
            // URL'i temizle ki kafa karışmasın
            history.replaceState("", document.title, window.location.pathname + window.location.search);
            alert("Sihirli link algılandı! Tüm verilerin başarıyla geri yüklendi. ⚡️");
        } catch (e) {
            console.log("Link verisi geçersiz.");
        }
    }
    yukle();
});

function yukle() {
  container.innerHTML = "";

  dersListesi.forEach(ders => {
    const key = "melih_" + ders.ad.replace(/\s/g, ""); 
    const yapilan = Number(localStorage.getItem(key) || 0);
    const kalan = ders.limit - yapilan;

    let durum = "ok";
    if (kalan <= 0) durum = "tehlike";
    else if (kalan <= 2) durum = "uyari";

    const div = document.createElement("div");
    div.className = "ders";
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

  // --- SİHİRLİ LİNK BUTONU ---
  const yedekDiv = document.createElement("div");
  yedekDiv.style.marginTop = "30px";
  yedekDiv.style.textAlign = "center";
  yedekDiv.style.padding = "20px";
  yedekDiv.style.borderTop = "1px solid rgba(255,255,255,0.1)";

  yedekDiv.innerHTML = `
    <button onclick="sihirliLinkKopyala()" style="background: linear-gradient(45deg, #8e44ad, #3498db); color:white; border:none; padding:12px 25px; border-radius:25px; cursor:pointer; font-weight:bold; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
        <i class="fa-solid fa-link"></i> Verileri Link Olarak Kopyala
    </button>
    <p style="color:#888; font-size:0.75rem; margin-top:10px;">
        Bu butona basınca kopyalanan linki <strong>WhatsApp'tan kendine at.</strong><br>
        O linke tıkladığın an verilerin geri gelir!
    </p>
  `;
  
  container.appendChild(yedekDiv);
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

// --- SİHİRLİ LİNK OLUŞTURMA ---
function sihirliLinkKopyala() {
    const veriler = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("melih_")) {
            veriler[key] = localStorage.getItem(key);
        }
    }

    // Veriyi şifrele (Base64) ve linke ekle
    const veriString = JSON.stringify(veriler);
    const sifreliVeri = btoa(veriString); // Base64 encoding
    const magicLink = window.location.origin + window.location.pathname + "#" + sifreliVeri;

    // Panoya kopyala
    navigator.clipboard.writeText(magicLink).then(() => {
        alert("✅ Link Kopyalandı!\n\nBu linki WhatsApp'tan kendine gönder veya notlarına yapıştır.\n\nVerilerin silinirse bu linke tıklaman yeterli!");
    }).catch(err => {
        alert("Kopyalama başarısız oldu. Lütfen manuel seçip kopyalayın: " + magicLink);
    });
}

yukle();