// KTÜ Elektrik-Elektronik 2. Sınıf (Türkçe Karakter Fix)

const dersListesi = [
  { ad: "Devreler II", limit: 8 },
  { ad: "Mühendislikte İngilizce II", limit: 4 },
  { ad: "Sayısal Çözümleme", limit: 8 },
  { ad: "Elektronik I", limit: 8 },
  { ad: "Mühendislik Matematiği", limit: 8 },
  { ad: "Elektromanyetik Dalgalar", limit: 8 },
  { ad: "Güç Sistemleri", limit: 8 }
];

const container = document.getElementById("dersler");

// --- 1. SİHİRLİ LİNK İLE GERİ YÜKLEME ---
window.addEventListener('load', () => {
    if (window.location.hash.length > 10) {
        try {
            const hash = window.location.hash.substring(1);
            
            // TÜRKÇE KARAKTER ÇÖZÜMÜ (Decode)
            const decodedStr = decodeURIComponent(escape(atob(hash)));
            const veriler = JSON.parse(decodedStr);

            Object.keys(veriler).forEach(key => {
                localStorage.setItem(key, veriler[key]);
            });

            // Linki temizle
            history.replaceState("", document.title, window.location.pathname + window.location.search);
            alert("✅ Başarılı! Tüm veriler geri yüklendi.");
        } catch (e) {
            console.error(e);
            alert("Link hatalı veya bozuk.");
        }
    }
    yukle();
});

// --- 2. LİSTELEME ---
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

  // --- WHATSAPP BUTONU ---
  const yedekDiv = document.createElement("div");
  yedekDiv.style.marginTop = "40px";
  yedekDiv.style.marginBottom = "80px";
  yedekDiv.style.textAlign = "center";
  yedekDiv.style.borderTop = "1px solid rgba(255,255,255,0.1)";
  yedekDiv.style.paddingTop = "20px";

  yedekDiv.innerHTML = `
    <button onclick="whatsappGonder()" style="background: #25D366; color:white; border:none; padding:15px 30px; border-radius:30px; cursor:pointer; font-weight:bold; font-size:1rem; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4); display:flex; align-items:center; justify-content:center; gap:10px; margin:0 auto;">
        <i class="fa-brands fa-whatsapp" style="font-size:1.5rem;"></i> Yedeği WhatsApp'a At
    </button>
    <p style="color:#888; font-size:0.8rem; margin-top:10px;">
        Verilerini kaybetmemek için kendine gönder.
    </p>
  `;
  
  container.appendChild(yedekDiv);
}

// --- 3. GÜNCELLEME ---
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

// --- 4. WHATSAPP GÖNDERME (HATA AYIKLAMALI) ---
function whatsappGonder() {
    try {
        const veriler = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("melih_")) {
                veriler[key] = localStorage.getItem(key);
            }
        }

        const veriString = JSON.stringify(veriler);
        
        // TÜRKÇE KARAKTER ÇÖZÜMÜ (Encode)
        // unescape ve encodeURIComponent Türkçe karakterleri bozulmadan şifreler
        const sifreliVeri = btoa(unescape(encodeURIComponent(veriString)));
        
        const cleanUrl = window.location.origin + window.location.pathname;
        const magicLink = cleanUrl + "#" + sifreliVeri;

        const mesaj = "Ders Programı Yedeğim (Tıkla Yüklensin): \n\n" + magicLink;
        
        // Android/iOS uyumlu yönlendirme
        window.location.href = "https://wa.me/?text=" + encodeURIComponent(mesaj);
        
    } catch (err) {
        alert("Bir hata oluştu: " + err.message);
    }
}

yukle();