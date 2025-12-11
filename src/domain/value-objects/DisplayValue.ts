/**
 * 表示値バリューオブジェクト
 * 電卓のディスプレイに表示される値を表現
 */
export class DisplayValue {
  private readonly value: string
  private readonly isFormatted: boolean

  private constructor(value: string, isFormatted: boolean = false) {
    this.value = value
    this.isFormatted = isFormatted
  }

  /**
   * 数値から表示値を作成（フォーマット適用）
   */
  static fromNumber(num: number): DisplayValue {
    const formatted = DisplayValue.formatNumber(num)
    return new DisplayValue(formatted, true)
  }

  /**
   * 数値をフォーマット（12桁有効桁数、カンマ区切り、科学的記数法）
   */
  private static formatNumber(num: number): string {
    // エラー値や特殊値の処理
    if (!isFinite(num)) {
      if (isNaN(num)) return 'Error'
      return num > 0 ? 'Infinity' : '-Infinity'
    }

    // ゼロの処理
    if (num === 0) return '0'

    const sign = num < 0 ? '-' : ''
    const absNum = Math.abs(num)

    // 有効桁数を12桁に制限
    const significantDigits = 12
    let formatted: string

    // 科学的記数法が必要かどうかを判定
    // 12桁の有効桁数を超える大きな数値または小さな数値の場合
    const absStr = absNum.toString()
    const [integerPart, decimalPart = ''] = absStr.split('.')

    // 整数部分が12桁を超える場合、または非常に小さい数値の場合
    if (integerPart.length > significantDigits || (absNum < 1 && absNum > 0 && absNum.toString().length > significantDigits + 2)) {
      // 科学的記数法で表示
      const exponent = Math.floor(Math.log10(absNum))
      const mantissa = absNum / Math.pow(10, exponent)
      const roundedMantissa = DisplayValue.roundToSignificantDigits(mantissa, significantDigits)
      formatted = `${sign}${roundedMantissa.toFixed(10).replace(/\.?0+$/, '')}e${exponent >= 0 ? '+' : ''}${exponent}`
      return formatted
    }

    // 通常の数値フォーマット
    // 有効桁数に丸める
    const rounded = DisplayValue.roundToSignificantDigits(absNum, significantDigits)
    
    // 整数部分と小数部分に分ける
    const [intPart, decPart = ''] = rounded.toString().split('.')
    
    // 整数部分にカンマ区切りを追加（1000以上の場合）
    let formattedInt = intPart
    if (parseInt(intPart) >= 1000) {
      formattedInt = parseInt(intPart).toLocaleString('en-US')
    }

    // 小数部分がある場合は結合
    if (decPart) {
      // 末尾の0を削除
      const trimmedDec = decPart.replace(/0+$/, '')
      formatted = trimmedDec ? `${sign}${formattedInt}.${trimmedDec}` : `${sign}${formattedInt}`
    } else {
      formatted = `${sign}${formattedInt}`
    }

    return formatted
  }

  /**
   * 指定された有効桁数に丸める
   */
  private static roundToSignificantDigits(num: number, digits: number): number {
    if (num === 0) return 0
    const magnitude = Math.floor(Math.log10(Math.abs(num)))
    const factor = Math.pow(10, digits - magnitude - 1)
    return Math.round(num * factor) / factor
  }

  /**
   * 文字列から表示値を作成（入力値用、フォーマットなし）
   */
  static fromString(str: string): DisplayValue {
    return new DisplayValue(str, false)
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
   * 数値として取得（カンマを除去してパース）
   */
  toNumber(): number {
    // カンマを除去してパース
    const cleanedValue = this.value.replace(/,/g, '')
    return parseFloat(cleanedValue)
  }

  /**
   * 文字列として取得（表示用）
   */
  toString(): string {
    // フォーマット済みの場合はそのまま返す
    if (this.isFormatted) {
      return this.value
    }
    
    // 入力中の数値の場合は、リアルタイムでカンマ区切りを適用
    if (!this.isError() && this.value !== '0') {
      const num = parseFloat(this.value)
      if (!isNaN(num) && num >= 1000) {
        // 整数部分のみカンマ区切りを適用
        const [intPart, decPart] = this.value.split('.')
        const formattedInt = parseInt(intPart).toLocaleString('en-US')
        return decPart ? `${formattedInt}.${decPart}` : formattedInt
      }
    }
    
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

