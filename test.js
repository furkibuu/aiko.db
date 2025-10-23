const { AikoDB } = require('./dist/index.js');
const db = new AikoDB('test-suite-database.json');

let testCounter = 1;
function logTest(description) {
  console.log(`\n[Test ${testCounter++}] - ${description}`);
}

async function runAdvancedTests() {
  console.log('--- Aiko.db Gelişmiş Test Paketi Başlatıldı ---');
  
  try {
    // Teste başlamadan önce her zaman temizle
    await db.clear();

    logTest('Temel SET ve GET işlemi');
    await db.set('appName', 'aiko.db');
    const appName = await db.get('appName');
    if (appName !== 'aiko.db') throw new Error('Temel GET işlemi başarısız!');
    console.log('✅ Başarılı: appName ->', appName);

    logTest('Nokta Notasyonu ile SET ve GET işlemi');
    await db.set('user.profile.username', 'furki');
    await db.set('user.profile.level', 50);
    const username = await db.get('user.profile.username');
    if (username !== 'furki') throw new Error('Nokta notasyonu ile GET başarısız!');
    console.log('✅ Başarılı: user.profile.username ->', username);

    logTest('Nokta Notasyonu ile HAS işlemi');
    const hasLevel = await db.has('user.profile.level');
    const hasRank = await db.has('user.profile.rank');
    if (!hasLevel || hasRank) throw new Error('Nokta notasyonu ile HAS başarısız!');
    console.log('✅ Başarılı: user.profile.level var, user.profile.rank yok.');

    logTest('ADD (Ekleme) işlemi');
    await db.set('user.stats.gold', 100);
    await db.add('user.stats.gold', 75);
    const gold = await db.get('user.stats.gold');
    if (gold !== 175) throw new Error('ADD işlemi başarısız!');
    console.log('✅ Başarılı: Yeni altın miktarı ->', gold);
    
    logTest('SUBTRACT (Çıkarma) işlemi');
    await db.subtract('user.stats.gold', 25);
    const finalGold = await db.get('user.stats.gold');
    if (finalGold !== 150) throw new Error('SUBTRACT işlemi başarısız!');
    console.log('✅ Başarılı: Son altın miktarı ->', finalGold);

    logTest('PUSH (Diziye ekleme) işlemi');
    await db.push('user.inventory', 'Sedef'); 
    await db.push('user.inventory', 'Furkan', 'Aiko'); 
    const inventory = await db.get('user.inventory');
    // ----> DÜZELTME BURADA <----
    // Kontrolü, eklediğimiz doğru verilere göre güncelliyoruz.
    if (inventory.length !== 3 || inventory[1] !== 'Furkan') throw new Error('PUSH işlemi başarısız!');
    console.log('✅ Başarılı: Envanter ->', inventory);
    
    logTest('Nokta Notasyonu ile DELETE işlemi');
    const deleteResult = await db.delete('user.profile.level');
    const levelExistsAfterDelete = await db.has('user.profile.level');
    if (!deleteResult || levelExistsAfterDelete) throw new Error('Nokta notasyonu ile DELETE başarısız!');
    console.log('✅ Başarılı: user.profile.level silindi.');

    logTest('CLEAR işlemi');
    await db.clear();
    const userExists = await db.has('user');
    if (userExists) throw new Error('CLEAR işlemi başarısız!');
    console.log('✅ Başarılı: Veritabanı başarıyla temizlendi.');

    console.log('\n\n🚀 --- Tüm Gelişmiş Testler Başarıyla Tamamlandı! --- 🚀');

  } catch (error) {
    console.error('\n\n❌ --- TEST BAŞARISIZ OLDU! --- ❌');
    console.error('Hata:', error.message);
  }
}

// Testleri çalıştır
runAdvancedTests();