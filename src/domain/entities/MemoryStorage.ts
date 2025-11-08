/**
 * メモリストレージ（エンティティ）
 * 計算結果を一時保存
 */
export class MemoryStorage {
  private constructor(
    private readonly id: string,
    private readonly value: number | null
  ) {}

  /**
   * 空のメモリを作成
   */
  static create(id?: string): MemoryStorage {
    const memoryId = id || `memory-${Date.now()}`
    return new MemoryStorage(memoryId, null)
  }

  /**
   * 値付きでメモリを復元
   */
  static restore(id: string, value: number | null): MemoryStorage {
    return new MemoryStorage(id, value)
  }

  /**
   * IDを取得
   */
  getId(): string {
    return this.id
  }

  /**
   * 値を保存（新しいインスタンスを返す）
   */
  store(value: number): MemoryStorage {
    return new MemoryStorage(this.id, value)
  }

  /**
   * 値を取得
   */
  recall(): number | null {
    return this.value
  }

  /**
   * メモリをクリア（新しいインスタンスを返す）
   */
  clear(): MemoryStorage {
    return new MemoryStorage(this.id, null)
  }

  /**
   * 値が保存されているかチェック
   */
  hasValue(): boolean {
    return this.value !== null
  }

  /**
   * 値を加算（新しいインスタンスを返す）
   */
  add(value: number): MemoryStorage {
    const newValue = (this.value || 0) + value
    return new MemoryStorage(this.id, newValue)
  }

  /**
   * 値を減算（新しいインスタンスを返す）
   */
  subtract(value: number): MemoryStorage {
    const newValue = (this.value || 0) - value
    return new MemoryStorage(this.id, newValue)
  }
}

