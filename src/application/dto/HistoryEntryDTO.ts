/**
 * 履歴エントリのDTO
 */
export interface HistoryEntryDTO {
  /**
   * エントリID
   */
  id: string

  /**
   * 数式
   */
  expression: string

  /**
   * 計算結果
   */
  result: number

  /**
   * フォーマット済み数式
   */
  formattedExpression: string

  /**
   * フォーマット済み結果
   */
  formattedResult: string

  /**
   * タイムスタンプ
   */
  timestamp: Date
}

