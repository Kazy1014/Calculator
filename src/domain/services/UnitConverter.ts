import { Unit, UnitType, UnitCategory } from '../value-objects/Unit'

/**
 * 単位変換器（ドメインサービス）
 * 単位間の変換を実行
 */
export class UnitConverter {
  /**
   * 単位変換を実行
   */
  convert(value: number, fromUnit: Unit, toUnit: Unit): number {
    // 同じ単位の場合はそのまま返す
    if (fromUnit.equals(toUnit)) {
      return value
    }

    // カテゴリーが異なる場合はエラー
    if (fromUnit.getCategory() !== toUnit.getCategory()) {
      throw new Error('異なるカテゴリーの単位間では変換できません')
    }

    // カテゴリーごとに変換
    switch (fromUnit.getCategory()) {
      case UnitCategory.LENGTH:
        return this.convertLength(value, fromUnit.getType(), toUnit.getType())
      case UnitCategory.WEIGHT:
        return this.convertWeight(value, fromUnit.getType(), toUnit.getType())
      case UnitCategory.TEMPERATURE:
        return this.convertTemperature(value, fromUnit.getType(), toUnit.getType())
      case UnitCategory.VOLUME:
        return this.convertVolume(value, fromUnit.getType(), toUnit.getType())
      default:
        throw new Error('未対応のカテゴリーです')
    }
  }

  /**
   * 長さの変換
   */
  private convertLength(value: number, from: UnitType, to: UnitType): number {
    // まずメートルに変換
    const meters = this.toMeters(value, from)
    // 目的の単位に変換
    return this.fromMeters(meters, to)
  }

  private toMeters(value: number, unit: UnitType): number {
    const rates: Record<string, number> = {
      [UnitType.METER]: 1,
      [UnitType.KILOMETER]: 1000,
      [UnitType.CENTIMETER]: 0.01,
      [UnitType.MILLIMETER]: 0.001,
      [UnitType.MILE]: 1609.344,
      [UnitType.YARD]: 0.9144,
      [UnitType.FEET]: 0.3048,
      [UnitType.INCH]: 0.0254,
    }
    return value * rates[unit]
  }

  private fromMeters(meters: number, unit: UnitType): number {
    const rates: Record<string, number> = {
      [UnitType.METER]: 1,
      [UnitType.KILOMETER]: 1000,
      [UnitType.CENTIMETER]: 0.01,
      [UnitType.MILLIMETER]: 0.001,
      [UnitType.MILE]: 1609.344,
      [UnitType.YARD]: 0.9144,
      [UnitType.FEET]: 0.3048,
      [UnitType.INCH]: 0.0254,
    }
    return meters / rates[unit]
  }

  /**
   * 重さの変換
   */
  private convertWeight(value: number, from: UnitType, to: UnitType): number {
    // まずグラムに変換
    const grams = this.toGrams(value, from)
    // 目的の単位に変換
    return this.fromGrams(grams, to)
  }

  private toGrams(value: number, unit: UnitType): number {
    const rates: Record<string, number> = {
      [UnitType.GRAM]: 1,
      [UnitType.KILOGRAM]: 1000,
      [UnitType.MILLIGRAM]: 0.001,
      [UnitType.POUND]: 453.592,
      [UnitType.OUNCE]: 28.3495,
    }
    return value * rates[unit]
  }

  private fromGrams(grams: number, unit: UnitType): number {
    const rates: Record<string, number> = {
      [UnitType.GRAM]: 1,
      [UnitType.KILOGRAM]: 1000,
      [UnitType.MILLIGRAM]: 0.001,
      [UnitType.POUND]: 453.592,
      [UnitType.OUNCE]: 28.3495,
    }
    return grams / rates[unit]
  }

  /**
   * 温度の変換
   */
  private convertTemperature(value: number, from: UnitType, to: UnitType): number {
    // まず摂氏に変換
    const celsius = this.toCelsius(value, from)
    // 目的の単位に変換
    return this.fromCelsius(celsius, to)
  }

  private toCelsius(value: number, unit: UnitType): number {
    switch (unit) {
      case UnitType.CELSIUS:
        return value
      case UnitType.FAHRENHEIT:
        return (value - 32) * 5 / 9
      case UnitType.KELVIN:
        return value - 273.15
      default:
        throw new Error('未対応の温度単位です')
    }
  }

  private fromCelsius(celsius: number, unit: UnitType): number {
    switch (unit) {
      case UnitType.CELSIUS:
        return celsius
      case UnitType.FAHRENHEIT:
        return celsius * 9 / 5 + 32
      case UnitType.KELVIN:
        return celsius + 273.15
      default:
        throw new Error('未対応の温度単位です')
    }
  }

  /**
   * 体積の変換
   */
  private convertVolume(value: number, from: UnitType, to: UnitType): number {
    // まずリットルに変換
    const liters = this.toLiters(value, from)
    // 目的の単位に変換
    return this.fromLiters(liters, to)
  }

  private toLiters(value: number, unit: UnitType): number {
    const rates: Record<string, number> = {
      [UnitType.LITER]: 1,
      [UnitType.MILLILITER]: 0.001,
      [UnitType.GALLON]: 3.78541,
      [UnitType.QUART]: 0.946353,
      [UnitType.PINT]: 0.473176,
      [UnitType.CUP]: 0.236588,
    }
    return value * rates[unit]
  }

  private fromLiters(liters: number, unit: UnitType): number {
    const rates: Record<string, number> = {
      [UnitType.LITER]: 1,
      [UnitType.MILLILITER]: 0.001,
      [UnitType.GALLON]: 3.78541,
      [UnitType.QUART]: 0.946353,
      [UnitType.PINT]: 0.473176,
      [UnitType.CUP]: 0.236588,
    }
    return liters / rates[unit]
  }
}

