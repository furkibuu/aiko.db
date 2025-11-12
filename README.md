# @furkibu/aiko.db

![NPM Version](https://img.shields.io/npm/v/@furkibu/aiko.db?style=for-the-badge&logo=npm)
![Downloads](https://img.shields.io/npm/dm/@furkibu/aiko.db?style=for-the-badge)
![License](https://img.shields.io/npm/l/@furkibu/aiko.db?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

Node.js için geliştirilmiş, modern, hızlı ve reaktif bir JSON veritabanı. `aikodb`'nin manevi devamı olarak, daha güçlü ve esnek özelliklerle donatılmıştır.

## ✨ Öne Çıkan Özellikler

* **🚀 Asenkron Yapı:** Performans kaybı yaşamadan `async/await` ile tüm veritabanı işlemlerini gerçekleştirin.
* **⚡ Dahili Önbellek (Caching):** Sık erişilen veriler için dosya okuma/yazma işlemlerini en aza indirerek hızı en üst düzeye çıkarır.
* **📡 Olay Yayıcı (Event Emitter):** Veritabanında bir değişiklik olduğunda (`set`, `delete` vb.) anında haberdar olun!
* **📦 Nokta Notasyonu Desteği:** `user.profile.name` gibi iç içe geçmiş verilere kolayca erişin.
* **🛡️ Varsayılan Değer Atama (`ensure`):** Veri yoksa otomatik olarak varsayılan bir değer atayarak kodunuzu basitleştirin.
* **🔍 Esnek Sorgulama & Filtreleme:** `find` ile tek bir veri bulun veya `filter` ile bir koşula uyan tüm verileri getirin.
* **🗂️ Gelişmiş Dizi Yönetimi:** `push()` ile eleman ekleyin, `pull()` ile koşula göre eleman çıkarın.
* **🔢 Matematiksel İşlemler:** `add()` ve `subtract()` ile sayısal verileri atomik olarak artırın veya azaltın.
* **💾 Tek Satırda Yedekleme:** `backup()` metodu ile veritabanınızı kolayca yedekleyin.
* **🤝 Sıfır Bağımlılık:** Projenize gereksiz yük bindirmez.
* **TypeScript Desteği:** Tamamen TypeScript ile yazılmıştır, bu sayede modern ve tip güvenli bir geliştirme deneyimi sunar.

## 💾 Kurulum

```bash
npm install @furkibu/aiko.db
```

## ⚡ Hızlı Başlangıç

```javascript
import { AikoDB } from '@furkibu/aiko.db';

const db = new AikoDB('server-data.json');

// --- Olayları Dinleme ---
// Veritabanında bir veri değiştiğinde anında tepki ver
db.on('set', (key, newValue) => {
  console.log(`[DEĞİŞİKLİK] Anahtar: '${key}' | Yeni Değer: ${JSON.stringify(newValue)}`);
});

// Bir veri silindiğinde
db.on('delete', (key) => {
  console.log(`[SİLME] Anahtar: '${key}' silindi.`);
});

// --- Asenkron Fonksiyon ---
async function main() {
  // `set` olayı tetiklenecek
  await db.set('config.prefix', '!'); 
  
  // `set` olayı tetiklenecek
  await db.set('users', [{ id: '1', name: 'Furkan', level: 99 }]);

  // `delete` olayı tetiklenecek
  await db.delete('config');
}

main();

/*
  KONSOL ÇIKTISI:
  [DEĞİŞİKLİK] Anahtar: 'config.prefix' | Yeni Değer: "!"
  [DEĞİŞİKLİK] Anahtar: 'users' | Yeni Değer: [{"id":"1","name":"Furkan","level":99}]
  [SİLME] Anahtar: 'config' silindi.
*/
```

## 📚 API Referansı

### Temel İşlemler

* `.set(key, value)`: Bir anahtara değer atar. Nokta notasyonunu destekler. (`set` olayını tetikler)
* `.get(key)`: Bir anahtarın değerini döndürür.
* `.has(key)`: Bir anahtarın var olup olmadığını kontrol eder (`true`/`false`).
* `.delete(key)`: Bir anahtar-değer çiftini siler. (`delete` olayını tetikler)
* `.clear()`: Veritabanındaki tüm verileri temizler. (`clear` olayını tetikler)

### Sayı & Dizi İşlemleri

* `.add(key, amount)`: Sayısal bir değere ekleme yapar. (`set` olayını tetikler)
* `.subtract(key, amount)`: Sayısal bir değerden çıkarma yapar. (`set` olayını tetikler)
* `.push(key, ...values)`: Bir diziye bir veya daha fazla eleman ekler. (`set` olayını tetikler)
* `.pull(key, callback)`: Bir diziden, `callback` koşulunu sağlayan elemanları çıkarır. (`set` olayını tetikler)

### Sorgulama & Veri Yönetimi

* `.all()`: Veritabanındaki tüm veriyi bir JavaScript objesi olarak döndürür.
* `.size()`: Veritabanındaki ana (top-level) anahtar sayısını döndürür.
* `.ensure(key, defaultValue)`: Bir anahtarın var olduğundan emin olur. Yoksa `defaultValue` atar. (`set` olayını tetikleyebilir)
* `.find(callback)`: Bir koşula uyan **ilk** veriyi bulur. Dizilerin içini de arar.
* `.filter(callback)`: Bir koşula uyan **tüm** verileri bir dizi olarak döndürür.

### Yardımcı Programlar

* `.backup(filePath)`: Veritabanının belirtilen yola bir yedeğini oluşturur.

---

### Olaylar (Events)

`AikoDB`, `EventEmitter` sınıfından miras alır. Bu sayede veritabanındaki değişiklikleri dinleyebilirsiniz.

* **`.on('set', (key, newValue) => { ... })`**
  Bir veri eklendiğinde veya güncellendiğinde tetiklenir. `add`, `subtract`, `push`, `pull`, `ensure` metotları da bu olayı tetikler.

* **`.on('delete', (key) => { ... })`**
  Bir veri silindiğinde tetiklenir.

* **`.on('clear', () => { ... })`**
  Veritabanı temizlendiğinde tetiklenir.

```javascript
// Bir olayı sadece bir kez dinlemek için .once() kullanabilirsiniz
db.once('set', (key, value) => {
  console.log('İlk veri başarıyla ayarlandı!');
});
```

## 🤝 Katkıda Bulunma

Katkılarınız ve fikirleriniz projeyi daha iyi hale getirecektir. Lütfen bir "issue" açmaktan veya "pull request" göndermekten çekinmeyin.

## 📜 Lisans

Bu proje MIT Lisansı ile lisanslanmıştır.