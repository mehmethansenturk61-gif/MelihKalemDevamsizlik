// KTÜ Elektrik-Elektronik 2. Sınıf (Mobil Uyumlu Yedekleme)

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

// Sayfa yüklendiğinde URL'de "Sihirli Link" var mı diye kontrol et
window.addEventListener('load', () => {
    // Eğer linkte # işareti ve sonrasında kod varsa
    if (window.location.hash.length > 10) {
        try {
            const hash = window.location.hash.substring(1); // #'den sonrasını al
            const jsonVeri = atob(hash); // Şifreyi çöz (Base64 decode)
            const veriler = JSON.parse(jsonVeri);

            // Verileri telefona kaydet
            Object.keys(veriler).forEach(key => {
                localStorage.setItem(key, veriler[key]);
            });

            // Adres çubuğunu temizle (linki normale çevir)
            history.replaceState("", document.title, window.location.pathname + window.location.search);
            
            alert("✅ Başarılı! Tüm ders verilerin geri yüklendi.");
        } catch (e) {
            console.log("Link verisi geçersiz veya boş.");
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

  // --- MOBİL PAYLAŞIM ALANI ---
  const yedekDiv = document.createElement("div");
  yedekDiv.style.marginTop = "40px";
  yedekDiv.style.marginBottom = "20px";
  yedekDiv.style.textAlign = "center";
  yedekDiv.style.borderTop = "1px solid rgba(255,255,255,0.1)";
  yedekDiv.style.paddingTop = "20px";

  yedekDiv.innerHTML = `
    <button onclick="sihirliLinkPaylas()" style="background: linear-gradient(135deg, #25D366, #128C7E); color:white; border:none; padding:15px 30px; border-radius:30px; cursor:pointer; font-weight:bold; font-size:1rem; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4); display:flex; align-items:center; justify-content:center; gap:10px; margin:0 auto;">
        <i class="fa-brands fa-whatsapp" style="font-size:1.4rem;"></i> Yedeği WhatsApp'a At
    </button>
    <p style="color:#888; font-size:0.8rem; margin-top:10px; max-width:80%; margin-left:auto; margin-right:auto;">
        Bu butona bas, linki kendine gönder. Telefonun sıfırlansa bile o linke tıklayınca her şey geri gelir! 
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

// --- GELİŞMİŞ PAYLAŞIM FONKSİYONU ---
async function sihirliLinkPaylas() {
    // 1. Verileri topla
    const veriler = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("melih_")) {
            veriler[key] = localStorage.getItem(key);
        }
    }

    // 2. Linki oluştur
    const veriString = JSON.stringify(veriler);
    const sifreliVeri = btoa(veriString); // Base64 şifreleme
    const magicLink = window.location.origin + window.location.pathname + "#" + sifreliVeri;

    // 3. TELEFON PAYLAŞIM MENÜSÜNÜ AÇ
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Melih Ders Programı Yedeği',
                text: 'Ders devamsızlık yedeğim burada. Tıklayınca geri yüklenir:',
                url: magicLink
            });
        } catch (err) {
            console.log("Paylaşım iptal edildi.");
        }
    } else {
        // Eğer bilgisayardaysa veya eski telefonsa panoya kopyala
        navigator.clipboard.writeText(magicLink).then(() => {
            alert("🔗 Link Kopyalandı!\n\nBunu kendine WhatsApp'tan gönder.");
        }).catch(err => {
            prompt("Otomatik kopyalanamadı. Lütfen bu linki kopyala:", magicLink);
        });
    }
}

yukle();