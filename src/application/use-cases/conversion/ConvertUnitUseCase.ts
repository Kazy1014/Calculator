import { UnitConverter } from '../../../domain/services/UnitConverter'
import { Unit, UnitType } from '../../../domain/value-objects/Unit'
import { NumberFormatter } from '../../../domain/services/NumberFormatter'
import type { ConversionResultDTO } from '../../dto/ConversionResultDTO'

/**
 * 単位変換ユースケース
 */
export class ConvertUnitUseCase {
  private readonly converter: UnitConverter
  private readonly formatter: NumberFormatter

  constructor() {
    this.converter = new UnitConverter()
    this.formatter = new NumberFormatter()
  }

  /**
   * 単位変換を実行
   */
  execute(value: number, fromUnitType: UnitType, toUnitType: UnitType): ConversionResultDTO {
    try {
      const fromUnit = Unit.create(fromUnitType)
      const toUnit = Unit.create(toUnitType)

      const result = this.converter.convert(value, fromUnit, toUnit)

      const displayText = `${this.formatter.format(value)} ${fromUnit.getSymbol()} = ${this.formatter.format(result)} ${toUnit.getSymbol()}`

      return {
        fromValue: value,
        fromUnit: fromUnit.getSymbol(),
        toValue: result,
        toUnit: toUnit.getSymbol(),
        displayText
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : '変換エラー')
    }
  }
}

