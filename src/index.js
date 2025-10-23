"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AikoDB = void 0;
// Gerekli modülleri import et
const fs_1 = require("fs");
const path_1 = require("path");
// Veritabanı sınıfı
class AikoDB {
    dbPath;
    // Kurucu metot, veritabanı dosyasının yolunu alır
    constructor(filePath = 'db.json') {
        // resolve ile tam dosya yolunu alıyoruz, bu hataları önler
        this.dbPath = (0, path_1.resolve)(process.cwd(), filePath);
    }
    // Özel (private) metot: Dosyayı okur ve JSON verisini döndürür
    async _read() {
        try {
            const data = await fs_1.promises.readFile(this.dbPath, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            // Eğer dosya yoksa, boş bir obje döndür
            if (error.code === 'ENOENT') {
                return {};
            }
            // Diğer hataları fırlat
            throw error;
        }
    }
    // Özel (private) metot: Veriyi dosyaya yazar
    async _write(data) {
        // JSON'u formatlı bir şekilde (okunaklı) yazıyoruz
        await fs_1.promises.writeFile(this.dbPath, JSON.stringify(data, null, 2));
    }
    /**
     * Veritabanına bir anahtar-değer çifti ekler veya günceller.
     * @param key Verinin anahtarı.
     * @param value Eklenecek değer.
     */
    async set(key, value) {
        const data = await this._read();
        data[key] = value;
        await this._write(data);
        return value;
    }
    /**
     * Veritabanından bir anahtara karşılık gelen değeri alır.
     * @param key Alınacak verinin anahtarı.
     */
    async get(key) {
        const data = await this._read();
        return data[key];
    }
    /**
     * Bir anahtarın veritabanında olup olmadığını kontrol eder.
     * @param key Kontrol edilecek anahtar.
     */
    async has(key) {
        const data = await this._read();
        return key in data;
    }
    /**
     * Veritabanından bir anahtar-değer çiftini siler.
     * @param key Silinecek verinin anahtarı.
     */
    async delete(key) {
        const data = await this._read();
        if (key in data) {
            delete data[key];
            await this._write(data);
            return true;
        }
        return false;
    }
    /**
     * Tüm veritabanı içeriğini temizler.
     */
    async clear() {
        await this._write({});
    }
}
exports.AikoDB = AikoDB;
//# sourceMappingURL=index.js.map