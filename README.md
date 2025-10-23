# @furkibu/@furkibu/aiko.db

![NPM Version](https://img.shields.io/npm/v/@furkibu/aiko.db?style=for-the-badge&logo=npm)
![Downloads](https://img.shields.io/npm/dm/@furkibu/aiko.db?style=for-the-badge)
![License](https://img.shields.io/npm/l/@furkibu/aiko.db?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

Node.js için geliştirilmiş, modern, hızlı ve sıfır bağımlılığa sahip, asenkron bir JSON veritabanı. `@furkibu/aiko.db`'nin manevi devamı olarak, daha güçlü ve esnek özelliklerle donatılmıştır.

## ✨ Özellikler

* **🚀 Asenkron Yapı:** Performans kaybı yaşamadan `async/await` ile tüm veritabanı işlemlerini gerçekleştirin.
* **⚡ Dahili Önbellek (Caching):** Sık erişilen veriler için dosya okuma/yazma işlemlerini en aza indirerek hızı en üst düzeye çıkarır.
* **📦 Nokta Notasyonu Desteği:** `user.profile.name` gibi iç içe geçmiş verilere kolayca erişin, güncelleyin ve silin.
* **🔢 Matematiksel İşlemler:** `add()` ve `subtract()` ile sayısal verileri atomik olarak artırın veya azaltın.
* **🗂️ Dizi Yönetimi:** `push()` metodu ile dizilere kolayca eleman ekleyin.
* **🤝 Sıfır Bağımlılık:** Projenize gereksiz yük bindirmez, sadece Node.js'in yerleşik modüllerini kullanır.
* **TypeScript Desteği:** Tamamen TypeScript ile yazılmıştır, bu sayede modern ve tip güvenli bir geliştirme deneyimi sunar.

## 💾 Kurulum

```bash
npm install @furkibu/aiko.db
```

## ⚡ Hızlı Başlangıç

```javascript
// const { AikoDB } = require('@furkibu/aiko.db'); // JavaScript
import { AikoDB } from '@furkibu/aiko.db'; // TypeScript

const db = new AikoDB('database.json'); // İsteğe bağlı, varsayılan 'db.json'

async function main() {
  // Basit bir veri ekle
  await db.set('server_id', '12345');

  // Nokta notasyonu ile iç içe veri ekle
  await db.set('users.1.username', 'Furkan');
  await db.set('users.1.balance', 100);

  // Veriyi çek
  const username = await db.get('users.1.username');
  console.log(`Kullanıcı Adı: ${username}`); // Çıktı: Kullanıcı Adı: Furkan

  // Sayısal değeri artır
  await db.add('users.1.balance', 50);
  const newBalance = await db.get('users.1.balance');
  console.log(`Yeni Bakiye: ${newBalance}`); // Çıktı: Yeni Bakiye: 150
  
  // Diziye eleman ekle
  await db.push('users.1.items', 'Kılıç', 'Kalkan');
  const items = await db.get('users.1.items');
  console.log(`Eşyalar: ${items.join(', ')}`); // Çıktı: Eşyalar: Kılıç, Kalkan
}

main();
```

## 📚 API Referansı

### `.set(key, value)`
Bir anahtara değer atar. Anahtar mevcutsa üzerine yazar. Nokta notasyonunu destekler.
```javascript
await db.set('prefix', '!');
await db.set('user.stats.level', 10);
```

### `.get(key)`
Bir anahtarın değerini döndürür. Değer bulunamazsa `undefined` döner. Nokta notasyonunu destekler.
```javascript
const prefix = await db.get('prefix');
const level = await db.get('user.stats.level');
```

### `.has(key)`
Bir anahtarın veritabanında olup olmadığını kontrol eder. `true` veya `false` döner.
```javascript
const hasPrefix = await db.has('prefix'); // true
const hasRank = await db.has('user.stats.rank'); // false
```

### `.delete(key)`
Bir anahtar-değer çiftini veritabanından siler. Başarılı olursa `true` döner.
```javascript
await db.delete('user.stats.level');
```

### `.add(key, amount)`
Belirtilen anahtardaki sayısal değere `amount` kadar ekleme yapar.
```javascript
await db.set('balance', 100);
await db.add('balance', 50); // balance şimdi 150
```

### `.subtract(key, amount)`
Belirtilen anahtardaki sayısal değerden `amount` kadar çıkarma yapar.
```javascript
await db.set('balance', 100);
await db.subtract('balance', 20); // balance şimdi 80
```

### `.push(key, ...values)`
Belirtilen anahtardaki diziye bir veya daha fazla eleman ekler. Anahtar yoksa yeni bir dizi oluşturur.
```javascript
await db.push('items', 'Elma', 'Armut');
```

### `.clear()`
Veritabanındaki tüm verileri temizler.
```javascript
await db.clear();
```

## 🤝 Katkıda Bulunma

Katkılarınız ve fikirleriniz projeyi daha iyi hale getirecektir. Lütfen bir "issue" açmaktan veya "pull request" göndermekten çekinmeyin.

## 📜 Lisans

Bu proje MIT Lisansı ile lisanslanmıştır.