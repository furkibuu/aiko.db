const { AikoDB } = require('./dist/index.js');
const db = new AikoDB('test-suite-database.json');
const fs = require('fs').promises; // Backup test için

let testCounter = 1;
function logTest(description) {
  console.log(`\n[Test ${testCounter++}] - ${description}`);
}

async function runAllTests() {
  console.log('--- Aiko.db Tam Test Paketi Başlatıldı ---');
  try {
    await db.clear();

    logTest('Temel ve Nokta Notasyonu SET/GET');
    await db.set('users', [
      { id: '1', name: 'Furkan', balance: 1500, premium: true },
      { id: '2', name: 'Aiko', balance: 800, premium: false },
      { id: '3', name: 'Sedef', balance: 2200, premium: true },
    ]);
    await db.set('config', { prefix: '!' });
    const name = await db.get('users.0.name');
    if (name !== 'Furkan') throw new Error('GET işlemi başarısız!');
    console.log('✅ Başarılı: Veri eklendi ve okundu.');

    logTest('SIZE (Boyut kontrolü)');
    const size = await db.size();
    if (size !== 2) throw new Error('SIZE başarısız!');
    console.log('✅ Başarılı: Veritabanında 2 anahtar var (users, config).');
    
    logTest('ENSURE (Varsayılan değer atama)');
    const aikoBalance = await db.ensure('users.1.balance', 0);
    if (aikoBalance !== 800) throw new Error('ENSURE (mevcut) başarısız!');
    const aikoLevel = await db.ensure('users.1.level', 1);
    if (aikoLevel !== 1) throw new Error('ENSURE (yeni) başarısız!');
    const newLevel = await db.get('users.1.level');
    if (newLevel !== 1) throw new Error('ENSURE (veri yazma) başarısız!');
    console.log('✅ Başarılı: ENSURE metodu doğru çalışıyor.');

    logTest('FILTER (Filtreleme)');
    const premiumUsers = await db.filter(user => user.premium === true);
    if (premiumUsers.length !== 2 || premiumUsers[0].name !== 'Furkan') throw new Error('FILTER başarısız!');
    console.log(`✅ Başarılı: ${premiumUsers.length} premium kullanıcı bulundu.`);

    logTest('FIND (Tekil bulma)');
    const aikoUser = await db.find(user => user.name === 'Aiko');
    if (!aikoUser || aikoUser.id !== '2') throw new Error('FIND başarısız!');
    console.log('✅ Başarılı: FIND metodu doğru çalışıyor.');

    // --- YENİ TEST ---
    logTest('Event Emitter (Olay Yayıcı)');
    
    // "set" olayını dinlemek için bir Promise kur
    const setEventPromise = new Promise((resolve, reject) => {
      // Olay dinleyicisini sadece bir kez çalışacak şekilde ayarla
      db.once('set', (key, value) => {
        if (key === 'eventTest' && value === 'merhaba') {
          resolve(true); // Beklenen veriler geldiyse Promise'i çöz
        } else {
          reject('"set" event\'i yanlış veri ile tetiklendi.');
        }
      });
      // Timeout, testin takılıp kalmaması için
      setTimeout(() => reject(new Error('"set" event\'i zaman aşımına uğradı.')), 1000);
    });

    // Olayı tetikleyecek metodu çağır
    await db.set('eventTest', 'merhaba');

    // Promise'in çözülmesini bekle
    await setEventPromise; // Eğer hata olursa (reject), 'catch' bloğu yakalar
    console.log('✅ Başarılı: "set" event\'i doğru veri ile yakalandı.');

    // --- Bitiş ---

    console.log('\n\n🚀 --- Tüm Testler Başarıyla Tamamlandı! --- 🚀');
  } catch (error) {
    console.error('\n\n❌ --- TEST BAŞARISIZ OLDU! --- ❌');
    console.error('Hata:', error.message);
  } finally {
      // Oluşturulan test veritabanını temizle
      await fs.unlink(db.dbPath).catch(() => {});
  }
}

runAllTests();