# @furkibuu/aiko.db

![NPM Version](https://img.shields.io/npm/v/@furkibu/aiko.db?style=for-the-badge&logo=npm)
![Downloads](https://img.shields.io/npm/dm/@furkibu/aiko.db?style=for-the-badge)
![License](https://img.shields.io/npm/l/@furkibu/aiko.db?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

Node.js için geliştirilmiş, modern, hızlı ve sıfır bağımlılığa sahip, asenkron bir JSON veritabanı. `aikodb`'nin manevi devamı olarak, daha güçlü ve esnek özelliklerle donatılmıştır.

## ✨ Öne Çıkan Özellikler

* **🚀 Asenkron Yapı:** Performans kaybı yaşamadan `async/await` ile tüm veritabanı işlemlerini gerçekleştirin.
* **⚡ Dahili Önbellek (Caching):** Sık erişilen veriler için dosya okuma/yazma işlemlerini en aza indirerek hızı en üst düzeye çıkarır.
* **📦 Nokta Notasyonu Desteği:** `user.profile.name` gibi iç içe geçmiş verilere kolayca erişin, güncelleyin ve silin.
* **🗂️ Gelişmiş Dizi Yönetimi:** `push()` ile eleman ekleyin, `pull()` ile koşula göre eleman çıkarın.
* **🔢 Matematiksel İşlemler:** `add()` ve `subtract()` ile sayısal verileri atomik olarak artırın veya azaltın.
* **🔍 Esnek Sorgulama:** `all()` ile tüm veriyi alın, `find()` ile değere göre arama yapın.
* **🛡️ Veri Güvenliği:** `backup()` metodu ile veritabanınızı tek satır kodla kolayca yedekleyin.
* **🤝 Sıfır Bağımlılık:** Projenize gereksiz yük bindirmez.
* **TypeScript Desteği:** Tamamen TypeScript ile yazılmıştır, bu sayede modern ve tip güvenli bir geliştirme deneyimi sunar.

## 💾 Kurulum

```bash
npm install @furkibu/aiko.db
```

## ⚡ Hızlı Başlangıç

```javascript
// const { AikoDB } = require('@furkibu/aiko.db'); // JavaScript
import { AikoDB } from '@furkibu/aiko.db'; // TypeScript

const db = new AikoDB('database.json');

async function main() {
  // Kullanıcıları bir dizi olarak ekleyelim
  await db.set('users', [
    { id: '1', name: 'Furkan', inventory: ['Kılıç', 'İksir'] },
    { id: '2', name: 'Aiko', inventory: ['Yay', 'Ok'] }
  ]);

  // Bir kullanıcının envanterine yeni eşya ekle
  await db.push('users.0.inventory', 'Kalkan');
  
  // Bir kullanıcıyı diziden çıkaralım
  console.log("Aiko sunucudan ayrıldı...");
  await db.pull('users', (user) => user.name === 'Aiko');

  // Son durumu görelim
  const finalUsers = await db.get('users');
  console.log('Sunucudaki son kullanıcılar:', finalUsers);
  // Çıktı: Sunucudaki son kullanıcılar: [ { id: '1', name: 'Furkan', inventory: [ 'Kılıç', 'İksir', 'Kalkan' ] } ]
}

main();
```

## 📚 API Referansı

### Temel İşlemler

#### `.set(key, value)`
Bir anahtara değer atar. Anahtar mevcutsa üzerine yazar. Nokta notasyonunu destekler.
```javascript
await db.set('prefix', '!');
await db.set('user.stats.level', 10);
```

#### `.get(key)`
Bir anahtarın değerini döndürür. Değer bulunamazsa `undefined` döner. Nokta notasyonunu destekler.
```javascript
const level = await db.get('user.stats.level');
```

#### `.has(key)`
Bir anahtarın veritabanında olup olmadığını kontrol eder. `true` veya `false` döner.
```javascript
const hasPrefix = await db.has('prefix');
```

#### `.delete(key)`
Bir anahtar-değer çiftini veritabanından siler. Başarılı olursa `true` döner.
```javascript
await db.delete('user.stats.level');
```

#### `.clear()`
Veritabanındaki tüm verileri temizler.

### Gelişmiş Metotlar

#### `.add(key, amount)`
Belirtilen anahtardaki sayısal değere `amount` kadar ekleme yapar.
```javascript
await db.set('balance', 100);
await db.add('balance', 50); // balance şimdi 150
```

#### `.subtract(key, amount)`
Belirtilen anahtardaki sayısal değerden `amount` kadar çıkarma yapar.
```javascript
await db.set('balance', 100);
await db.subtract('balance', 20); // balance şimdi 80
```

#### `.push(key, ...values)`
Belirtilen anahtardaki diziye bir veya daha fazla eleman ekler. Anahtar yoksa yeni bir dizi oluşturur.
```javascript
await db.push('items', 'Elma', 'Armut');
```

#### `.pull(key, callback)`
Belirtilen anahtardaki bir diziden, verilen koşulu (`callback`) sağlayan elemanları çıkarır.
```javascript
// ID'si '123' olan kullanıcıyı çıkaralım
await db.pull('users', (user) => user.id === '123');
```

#### `.all()`
Veritabanındaki tüm veriyi bir JavaScript objesi olarak döndürür.
```javascript
const allData = await db.all();
console.log(allData); // { users: [ ... ], items: [ ... ] }
```

#### `.find(callback)`
Veritabanında bir koşula uyan ilk veriyi bulur. Eğer bir değer dizi ise, dizinin *içindeki* elemanları da arar.
```javascript
// Rolü 'admin' olan ilk kullanıcıyı bulalım
const adminUser = await db.find((user) => user.role === 'admin');
```

#### `.backup(filePath)`
Mevcut veritabanı dosyasının belirtilen yola bir yedeğini oluşturur.
```javascript
await db.backup('database-backup.json');
console.log('Yedekleme tamamlandı!');
```

## 🤝 Katkıda Bulunma

Katkılarınız ve fikirleriniz projeyi daha iyi hale getirecektir. Lütfen bir "issue" açmaktan veya "pull request" göndermekten çekinmeyin.

## 📜 Lisans

Bu proje MIT Lisansı ile lisanslanmıştır.