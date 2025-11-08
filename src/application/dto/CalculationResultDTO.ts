/**
 * 計算結果のDTO（Data Transfer Object）
 */
export interface CalculationResultDTO {
  /**
   * 現在の数式
   */
  expression: string

  /**
   * 計算結果（数値）
   */
  result: number | null

  /**
   * フォーマット済み表示値
   */
  displayValue: string

  /**
   * エラーメッセージ
   */
  error: string | null

  /**
   * 計算が完了したかどうか
   */
  calculated: boolean
}

