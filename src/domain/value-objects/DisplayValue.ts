/**
 * 表示値バリューオブジェクト
 * 電卓のディスプレイに表示される値を表現
 */
export class DisplayValue {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  /**
   * 数値から表示値を作成
   */
  static fromNumber(num: number): DisplayValue {
    // 整数の場合は小数点を表示しない
    const valueStr = Number.isInteger(num) ? num.toString() : num.toString()
    return new DisplayValue(valueStr)
  }

  /**
   * 文字列から表示値を作成
   */
  static fromString(str: string): DisplayValue {
    return new DisplayValue(str)
  }

  /**
   * 初期状態（ゼロ）の表示値
   */
  static zero(): DisplayValue {
    return new DisplayValue('0')
  }

  /**
   * エラー表示値
   */
  static error(): DisplayValue {
    return new DisplayValue('Error')
  }

  /**
   * 数値として取得
   */
  toNumber(): number {
    return parseFloat(this.value)
  }

  /**
   * 文字列として取得
   */
  toString(): string {
    return this.value
  }

  /**
   * ゼロかどうか
   */
  isZero(): boolean {
    return this.value === '0'
  }

  /**
   * エラー状態かどうか
   */
  isError(): boolean {
    return this.value === 'Error'
  }

  /**
   * 小数点を含むかどうか
   */
  hasDecimalPoint(): boolean {
    return this.value.includes('.')
  }

  /**
   * 数字を追加
   */
  appendDigit(digit: string): DisplayValue {
    if (this.isError()) {
      return this
    }
    
    if (this.value === '0') {
      return new DisplayValue(digit)
    }
    return new DisplayValue(this.value + digit)
  }

  /**
   * 小数点を追加
   */
  appendDecimalPoint(): DisplayValue {
    if (this.isError() || this.hasDecimalPoint()) {
      return this
    }
    return new DisplayValue(this.value + '.')
  }

  /**
   * 等価性チェック
   */
  equals(other: DisplayValue): boolean {
    return this.value === other.value
  }
}

