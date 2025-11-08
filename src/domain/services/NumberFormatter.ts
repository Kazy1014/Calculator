/**
 * 数値フォーマッター（ドメインサービス）
 * 数値を表示用にフォーマット
 * - カンマ区切り（1,000単位）
 * - 科学的記数法（12桁超過時）
 * - 整数部と小数部の合計桁数制限（最大12桁）
 */
export class NumberFormatter {
  private static readonly MAX_DISPLAY_DIGITS = 12
  private static readonly SCIENTIFIC_NOTATION_THRESHOLD = 1e12

  /**
   * 数値をフォーマット
   */
  format(value: number): string {
    // 特殊な値の処理
    if (!isFinite(value)) {
      return value === Infinity ? 'Infinity' : value === -Infinity ? '-Infinity' : 'Error'
    }

    if (isNaN(value)) {
      return 'Error'
    }

    // ゼロの場合
    if (value === 0) {
      return '0'
    }

    const absValue = Math.abs(value)
    const sign = value < 0 ? '-' : ''

    // 科学的記数法が必要かチェック
    if (absValue >= NumberFormatter.SCIENTIFIC_NOTATION_THRESHOLD || 
        (absValue < 1e-6 && absValue > 0)) {
      return this.formatScientific(value)
    }

    // 整数部の桁数を取得
    const integerPart = Math.floor(absValue)
    const integerDigits = integerPart === 0 ? 1 : Math.floor(Math.log10(integerPart)) + 1

    // 12桁を超える場合は科学的記数法
    if (integerDigits > NumberFormatter.MAX_DISPLAY_DIGITS) {
      return this.formatScientific(value)
    }

    // 小数部に使える桁数を計算
    const availableDecimalDigits = NumberFormatter.MAX_DISPLAY_DIGITS - integerDigits

    // 適切な精度で丸める
    let formatted: string
    if (availableDecimalDigits > 0) {
      const rounded = this.roundToDecimalPlaces(value, availableDecimalDigits)
      formatted = rounded.toString()
      
      // 末尾のゼロを削除（小数点は残す）
      if (formatted.includes('.')) {
        formatted = formatted.replace(/\.?0+$/, '')
      }
    } else {
      formatted = Math.round(value).toString()
    }

    // カンマ区切りを適用
    return this.addThousandsSeparator(formatted)
  }

  /**
   * 科学的記数法でフォーマット
   */
  private formatScientific(value: number): string {
    // 有効桁数を10桁に制限
    const formatted = value.toExponential(10)
    
    // 末尾のゼロを削除
    return formatted.replace(/\.?0+(e[+-]?\d+)$/, '$1')
  }

  /**
   * 指定された小数点以下の桁数で丸める
   */
  private roundToDecimalPlaces(value: number, decimalPlaces: number): number {
    const factor = Math.pow(10, decimalPlaces)
    return Math.round(value * factor) / factor
  }

  /**
   * カンマ区切りを追加
   */
  private addThousandsSeparator(value: string): string {
    const parts = value.split('.')
    const integerPart = parts[0]
    const decimalPart = parts.length > 1 ? parts[1] : ''

    // マイナス記号を処理
    const sign = integerPart.startsWith('-') ? '-' : ''
    const absIntegerPart = integerPart.replace('-', '')

    // 3桁ごとにカンマを挿入
    const withCommas = absIntegerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    // 小数部があれば結合
    return sign + withCommas + (decimalPart ? '.' + decimalPart : '')
  }

  /**
   * 入力中の数値をフォーマット（カンマ区切りのみ）
   */
  formatInput(value: string): string {
    // 小数点や演算子が含まれる場合はそのまま返す
    if (value.includes('.') || value.includes('e') || value.includes('E')) {
      return value
    }

    // 数値として解析できない場合はそのまま返す
    const num = Number(value.replace(/,/g, ''))
    if (isNaN(num)) {
      return value
    }

    return this.addThousandsSeparator(value)
  }

  /**
   * フォーマット済み文字列からカンマを除去して数値に変換
   */
  parse(formatted: string): number {
    return Number(formatted.replace(/,/g, ''))
  }
}

