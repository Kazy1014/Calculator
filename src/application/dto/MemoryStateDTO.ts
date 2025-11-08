/**
 * メモリ状態のDTO
 */
export interface MemoryStateDTO {
  /**
   * メモリに値が保存されているか
   */
  hasValue: boolean

  /**
   * メモリに保存されている値
   */
  value: number | null

  /**
   * フォーマット済み表示値
   */
  displayValue: string
}

