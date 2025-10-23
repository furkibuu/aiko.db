export declare class AikoDB {
    private readonly dbPath;
    constructor(filePath?: string);
    private _read;
    private _write;
    /**
     * Veritabanına bir anahtar-değer çifti ekler veya günceller.
     * @param key Verinin anahtarı.
     * @param value Eklenecek değer.
     */
    set<T>(key: string, value: T): Promise<T>;
    /**
     * Veritabanından bir anahtara karşılık gelen değeri alır.
     * @param key Alınacak verinin anahtarı.
     */
    get<T>(key: string): Promise<T | undefined>;
    /**
     * Bir anahtarın veritabanında olup olmadığını kontrol eder.
     * @param key Kontrol edilecek anahtar.
     */
    has(key: string): Promise<boolean>;
    /**
     * Veritabanından bir anahtar-değer çiftini siler.
     * @param key Silinecek verinin anahtarı.
     */
    delete(key: string): Promise<boolean>;
    /**
     * Tüm veritabanı içeriğini temizler.
     */
    clear(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map