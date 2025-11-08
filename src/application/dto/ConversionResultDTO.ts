/**
 * 単位変換結果のDTO
 */
export interface ConversionResultDTO {
  /**
   * 変換前の値
   */
  fromValue: number

  /**
   * 変換前の単位
   */
  fromUnit: string

  /**
   * 変換後の値
   */
  toValue: number

  /**
   * 変換後の単位
   */
  toUnit: string

  /**
   * フォーマット済み表示文字列
   */
  displayText: string
}

