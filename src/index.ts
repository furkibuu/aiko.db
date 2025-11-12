// Gerekli modülleri import et
import { promises as fs } from 'fs';
import { resolve } from 'path';
import { EventEmitter } from 'events'; // 1. YENİ: Event Emitter import edildi

// 2. YENİ: Sınıfımız artık bir EventEmitter
export class AikoDB extends EventEmitter {
  private readonly dbPath: string;
  private cache: Record<string, any> | null = null;

  constructor(filePath: string = 'aikodb.json') {
    super(); // 3. YENİ: EventEmitter'ın constructor'ını çağır
    this.dbPath = resolve(process.cwd(), filePath);
  }

  // --- Özel (Private) Yardımcı Metotlar ---

  private async _read(): Promise<Record<string, any>> {
    if (this.cache !== null) {
      return this.cache;
    }
    try {
      const data = await fs.readFile(this.dbPath, 'utf-8');
      this.cache = JSON.parse(data);
      return this.cache!;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        this.cache = {};
        return this.cache;
      }
      throw error;
    }
  }

  private async _write(): Promise<void> {
    if (this.cache === null) return;
    await fs.writeFile(this.dbPath, JSON.stringify(this.cache, null, 2));
  }
  
  private _getNested(data: any, keys: string[]): any {
    let current = data;
    for (const key of keys) {
        if (typeof current !== 'object' || current === null || !(key in current)) {
            return undefined;
        }
        current = current[key];
    }
    return current;
  }
  
  private _setNested(data: any, keys: string[], value: any): void {
      let current = data;
      for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (typeof current[key] !== 'object' || current[key] === null) {
              current[key] = {};
          }
          current = current[key];
      }
      current[keys[keys.length - 1]] = value;
  }
  
  private _deleteNested(data: any, keys: string[]): boolean {
    let current = data;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (typeof current[key] !== 'object' || current[key] === null) {
        return false;
      }
      current = current[key];
    }
    const lastKey = keys[keys.length - 1];
    if (lastKey in current) {
      delete current[lastKey];
      return true;
    }
    return false;
  }

  // --- Genel Veritabanı Metotları ---

  public async set<T>(key: string, value: T): Promise<T> {
    const data = await this._read();
    if (key.includes('.')) {
      this._setNested(data, key.split('.'), value);
    } else {
      data[key] = value;
    }
    await this._write();
    this.emit('set', key, value); // 4. YENİ: Olay tetikle
    return value;
  }

  public async get<T>(key: string): Promise<T | undefined> {
    const data = await this._read();
    if (key.includes('.')) {
        return this._getNested(data, key.split('.')) as T | undefined;
    }
    return data[key] as T | undefined;
  }

  public async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== undefined;
  }

  public async delete(key: string): Promise<boolean> {
    const data = await this._read();
    let success = false;
    if (key.includes('.')) {
        success = this._deleteNested(data, key.split('.'));
    } else if (key in data) {
      delete data[key];
      success = true;
    }
    if (success) {
      await this._write();
      this.emit('delete', key); // 4. YENİ: Olay tetikle
    }
    return success;
  }
  
  public async clear(): Promise<void> {
    this.cache = {};
    await this._write();
    this.emit('clear'); // 4. YENİ: Olay tetikle
  }
  
  public async push<T>(key: string, ...values: T[]): Promise<T[]> {
    const currentArray = (await this.get<T[]>(key)) || [];
    if (!Array.isArray(currentArray)) {
        throw new Error(`The value at key "${key}" is not an array.`);
    }
    currentArray.push(...values);
    await this.set(key, currentArray); // Bu metot zaten "set" olayını tetikler
    return currentArray;
  }
  
  public async pull<T>(key: string, callback: (element: T) => boolean): Promise<T[]> {
    const currentArray = (await this.get<T[]>(key)) || [];
    if (!Array.isArray(currentArray)) {
      throw new Error(`The value at key "${key}" is not an array.`);
    }
    const newArray = currentArray.filter(element => !callback(element));
    await this.set(key, newArray); // Bu metot zaten "set" olayını tetikler
    return newArray;
  }
  
  public async add(key: string, amount: number): Promise<number> {
    const currentValue = (await this.get<number>(key)) || 0;
    if (typeof currentValue !== 'number') {
        throw new Error(`The value at key "${key}" is not a number.`);
    }
    const newValue = currentValue + amount;
    await this.set(key, newValue); // Bu metot zaten "set" olayını tetikler
    return newValue;
  }
  
  public async subtract(key: string, amount: number): Promise<number> {
    return this.add(key, -amount); // "add" metodunu çağırdığı için "set" olayını tetikler
  }

  public async all(): Promise<Record<string, any>> {
    return this._read();
  }

  public async find<T>(callback: (element: any) => boolean): Promise<T | undefined> {
    const data = await this._read();
    for (const key in data) {
      const value = data[key];
      if (Array.isArray(value)) {
        const foundInArray = value.find(element => callback(element));
        if (foundInArray) {
          return foundInArray as T;
        }
      } 
      else if (callback(value)) {
        return value as T;
      }
    }
    return undefined;
  }

  public async backup(backupPath: string): Promise<void> {
    try {
      const destination = resolve(process.cwd(), backupPath);
      await fs.copyFile(this.dbPath, destination);
    } catch (error) {
      throw new Error(`Backup failed: ${error}`);
    }
  }

  public async size(): Promise<number> {
    const data = await this._read();
    return Object.keys(data).length;
  }

  public async ensure<T>(key: string, defaultValue: T): Promise<T> {
    const existingValue = await this.get<T>(key);
    if (existingValue === undefined) {
      return this.set(key, defaultValue); // "set" metodunu çağırdığı için "set" olayını tetikler
    }
    return existingValue;
  }

  public async filter<T>(callback: (element: any) => boolean): Promise<T[]> {
    const data = await this._read();
    const results: T[] = [];
    for (const key in data) {
      const value = data[key];
      if (Array.isArray(value)) {
        const filteredArray = value.filter(element => callback(element));
        results.push(...filteredArray);
      } 
      else if (callback(value)) {
        results.push(value);
      }
    }
    return results;
  }
}