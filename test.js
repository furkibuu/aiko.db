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
    await db.set('user.profile', { name: 'Furkan', level: 50 });
    const name = await db.get('user.profile.name');
    if (name !== 'Furkan') throw new Error('GET işlemi başarısız!');
    console.log('✅ Başarılı: Veri eklendi ve okundu.');

    logTest('PUSH ve PULL (Dizi işlemleri)');
    await db.set('users', []);
    await db.push('users', { id: '123', name: 'Ahmet' }, { id: '456', name: 'Ayşe' });
    let users = await db.get('users');
    if (users.length !== 2) throw new Error('PUSH başarısız!');
    console.log('✅ Başarılı: Diziye 2 kullanıcı eklendi.');
    
    await db.pull('users', (user) => user.id === '123');
    users = await db.get('users');
    if (users.length !== 1 || users[0].name !== 'Ayşe') throw new Error('PULL başarısız!');
    console.log('✅ Başarılı: ID\'si 123 olan kullanıcı diziden çıkarıldı.');

    logTest('ALL (Tüm veriyi çekme)');
    const allData = await db.all();
    if (!allData.users || !allData.user) throw new Error('ALL başarısız!');
    console.log('✅ Başarılı: Tüm veritabanı verisi çekildi.');

    logTest('FIND (Değere göre bulma)');
    const foundUser = await db.find((data) => data.name === 'Ayşe');
    if (!foundUser || foundUser.id !== '456') throw new Error('FIND başarısız!');
    console.log(`✅ Başarılı: Adı 'Ayşe' olan kullanıcı bulundu:`, foundUser);

    logTest('BACKUP (Yedekleme)');
    const backupFile = 'test-backup.json';
    await db.backup(backupFile);
    const backupExists = await fs.access(backupFile).then(() => true).catch(() => false);
    if (!backupExists) throw new Error('BACKUP başarısız!');
    console.log('✅ Başarılı: Veritabanı başarıyla yedeklendi.');
    await fs.unlink(backupFile); // Test sonrası yedek dosyasını temizle

    console.log('\n\n🚀 --- Tüm Testler Başarıyla Tamamlandı! --- 🚀');
  } catch (error) {
    console.error('\n\n❌ --- TEST BAŞARISZ OLDU! --- ❌');
    console.error('Hata:', error.message);
  } finally {
      // Oluşturulan test veritabanını temizle
      await fs.unlink(db.dbPath).catch(() => {});
  }
}

runAllTests();