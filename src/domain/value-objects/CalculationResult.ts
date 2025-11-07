/**
 * 計算結果バリューオブジェクト
 * 計算の結果を表現（成功または失敗）
 */
export class CalculationResult {
  private constructor(
    private readonly value: number | null,
    private readonly isSuccess: boolean,
    private readonly errorMessage?: string
  ) {}

  /**
   * 成功した計算結果を作成
   */
  static success(value: number): CalculationResult {
    // 浮動小数点誤差を丸める
    const rounded = Math.round(value * 100000000) / 100000000
    return new CalculationResult(rounded, true)
  }

  /**
   * 失敗した計算結果を作成
   */
  static failure(errorMessage: string): CalculationResult {
    return new CalculationResult(null, false, errorMessage)
  }

  /**
   * 結果が成功かどうか
   */
  succeeded(): boolean {
    return this.isSuccess
  }

  /**
   * 結果が失敗かどうか
   */
  failed(): boolean {
    return !this.isSuccess
  }

  /**
   * 値を取得（失敗時は例外）
   */
  getValue(): number {
    if (!this.isSuccess || this.value === null) {
      throw new Error(this.errorMessage || 'Calculation failed')
    }
    return this.value
  }

  /**
   * エラーメッセージを取得
   */
  getErrorMessage(): string {
    return this.errorMessage || ''
  }
}

