import { CalculationHistoryEntry } from './CalculationHistoryEntry'

/**
 * 計算履歴（エンティティ）
 * 履歴エントリの集合を管理
 */
export class CalculationHistory {
  private static readonly MAX_ENTRIES = 20

  private constructor(
    private readonly id: string,
    private readonly entries: CalculationHistoryEntry[]
  ) {}

  /**
   * 空の履歴を作成
   */
  static create(id?: string): CalculationHistory {
    const historyId = id || `calc-history-${Date.now()}`
    return new CalculationHistory(historyId, [])
  }

  /**
   * 履歴エントリ付きで履歴を作成（リポジトリからの復元用）
   */
  static restore(id: string, entries: CalculationHistoryEntry[]): CalculationHistory {
    return new CalculationHistory(id, entries)
  }

  /**
   * IDを取得
   */
  getId(): string {
    return this.id
  }

  /**
   * エントリを追加（新しいインスタンスを返す）
   */
  addEntry(entry: CalculationHistoryEntry): CalculationHistory {
    const newEntries = [entry, ...this.entries]
    
    // 最大件数を超えた場合は古いものを削除
    if (newEntries.length > CalculationHistory.MAX_ENTRIES) {
      newEntries.pop()
    }

    return new CalculationHistory(this.id, newEntries)
  }

  /**
   * 全エントリを取得（新しい順）
   */
  getEntries(): CalculationHistoryEntry[] {
    return [...this.entries]
  }

  /**
   * エントリ数を取得
   */
  getCount(): number {
    return this.entries.length
  }

  /**
   * 履歴が空かどうか
   */
  isEmpty(): boolean {
    return this.entries.length === 0
  }

  /**
   * IDでエントリを取得
   */
  getEntryById(id: string): CalculationHistoryEntry | null {
    return this.entries.find(entry => entry.getId() === id) || null
  }

  /**
   * 履歴をクリア（新しいインスタンスを返す）
   */
  clear(): CalculationHistory {
    return new CalculationHistory(this.id, [])
  }
}

