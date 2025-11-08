/**
 * 単位のカテゴリー
 */
export enum UnitCategory {
  LENGTH = 'LENGTH',
  WEIGHT = 'WEIGHT',
  TEMPERATURE = 'TEMPERATURE',
  VOLUME = 'VOLUME'
}

/**
 * 単位タイプ
 */
export enum UnitType {
  // Length
  METER = 'METER',
  KILOMETER = 'KILOMETER',
  CENTIMETER = 'CENTIMETER',
  MILLIMETER = 'MILLIMETER',
  MILE = 'MILE',
  YARD = 'YARD',
  FEET = 'FEET',
  INCH = 'INCH',

  // Weight
  KILOGRAM = 'KILOGRAM',
  GRAM = 'GRAM',
  MILLIGRAM = 'MILLIGRAM',
  POUND = 'POUND',
  OUNCE = 'OUNCE',

  // Temperature
  CELSIUS = 'CELSIUS',
  FAHRENHEIT = 'FAHRENHEIT',
  KELVIN = 'KELVIN',

  // Volume
  LITER = 'LITER',
  MILLILITER = 'MILLILITER',
  GALLON = 'GALLON',
  QUART = 'QUART',
  PINT = 'PINT',
  CUP = 'CUP'
}

/**
 * 単位（値オブジェクト）
 */
export class Unit {
  private constructor(
    private readonly category: UnitCategory,
    private readonly type: UnitType,
    private readonly symbol: string,
    private readonly name: string
  ) {}

  /**
   * 単位を作成
   */
  static create(type: UnitType): Unit {
    const config = Unit.getUnitConfig(type)
    return new Unit(config.category, type, config.symbol, config.name)
  }

  /**
   * カテゴリーを取得
   */
  getCategory(): UnitCategory {
    return this.category
  }

  /**
   * タイプを取得
   */
  getType(): UnitType {
    return this.type
  }

  /**
   * シンボルを取得
   */
  getSymbol(): string {
    return this.symbol
  }

  /**
   * 名前を取得
   */
  getName(): string {
    return this.name
  }

  /**
   * 単位の設定を取得
   */
  private static getUnitConfig(type: UnitType): {
    category: UnitCategory
    symbol: string
    name: string
  } {
    const configs: Record<UnitType, { category: UnitCategory; symbol: string; name: string }> = {
      // Length
      [UnitType.METER]: { category: UnitCategory.LENGTH, symbol: 'm', name: 'メートル' },
      [UnitType.KILOMETER]: { category: UnitCategory.LENGTH, symbol: 'km', name: 'キロメートル' },
      [UnitType.CENTIMETER]: { category: UnitCategory.LENGTH, symbol: 'cm', name: 'センチメートル' },
      [UnitType.MILLIMETER]: { category: UnitCategory.LENGTH, symbol: 'mm', name: 'ミリメートル' },
      [UnitType.MILE]: { category: UnitCategory.LENGTH, symbol: 'mi', name: 'マイル' },
      [UnitType.YARD]: { category: UnitCategory.LENGTH, symbol: 'yd', name: 'ヤード' },
      [UnitType.FEET]: { category: UnitCategory.LENGTH, symbol: 'ft', name: 'フィート' },
      [UnitType.INCH]: { category: UnitCategory.LENGTH, symbol: 'in', name: 'インチ' },

      // Weight
      [UnitType.KILOGRAM]: { category: UnitCategory.WEIGHT, symbol: 'kg', name: 'キログラム' },
      [UnitType.GRAM]: { category: UnitCategory.WEIGHT, symbol: 'g', name: 'グラム' },
      [UnitType.MILLIGRAM]: { category: UnitCategory.WEIGHT, symbol: 'mg', name: 'ミリグラム' },
      [UnitType.POUND]: { category: UnitCategory.WEIGHT, symbol: 'lb', name: 'ポンド' },
      [UnitType.OUNCE]: { category: UnitCategory.WEIGHT, symbol: 'oz', name: 'オンス' },

      // Temperature
      [UnitType.CELSIUS]: { category: UnitCategory.TEMPERATURE, symbol: '°C', name: '摂氏' },
      [UnitType.FAHRENHEIT]: { category: UnitCategory.TEMPERATURE, symbol: '°F', name: '華氏' },
      [UnitType.KELVIN]: { category: UnitCategory.TEMPERATURE, symbol: 'K', name: 'ケルビン' },

      // Volume
      [UnitType.LITER]: { category: UnitCategory.VOLUME, symbol: 'L', name: 'リットル' },
      [UnitType.MILLILITER]: { category: UnitCategory.VOLUME, symbol: 'mL', name: 'ミリリットル' },
      [UnitType.GALLON]: { category: UnitCategory.VOLUME, symbol: 'gal', name: 'ガロン' },
      [UnitType.QUART]: { category: UnitCategory.VOLUME, symbol: 'qt', name: 'クォート' },
      [UnitType.PINT]: { category: UnitCategory.VOLUME, symbol: 'pt', name: 'パイント' },
      [UnitType.CUP]: { category: UnitCategory.VOLUME, symbol: 'cup', name: 'カップ' },
    }

    return configs[type]
  }

  /**
   * カテゴリーごとの単位リストを取得
   */
  static getUnitsByCategory(category: UnitCategory): UnitType[] {
    const units: Record<UnitCategory, UnitType[]> = {
      [UnitCategory.LENGTH]: [
        UnitType.METER,
        UnitType.KILOMETER,
        UnitType.CENTIMETER,
        UnitType.MILLIMETER,
        UnitType.MILE,
        UnitType.YARD,
        UnitType.FEET,
        UnitType.INCH,
      ],
      [UnitCategory.WEIGHT]: [
        UnitType.KILOGRAM,
        UnitType.GRAM,
        UnitType.MILLIGRAM,
        UnitType.POUND,
        UnitType.OUNCE,
      ],
      [UnitCategory.TEMPERATURE]: [
        UnitType.CELSIUS,
        UnitType.FAHRENHEIT,
        UnitType.KELVIN,
      ],
      [UnitCategory.VOLUME]: [
        UnitType.LITER,
        UnitType.MILLILITER,
        UnitType.GALLON,
        UnitType.QUART,
        UnitType.PINT,
        UnitType.CUP,
      ],
    }

    return units[category]
  }

  /**
   * 等価性チェック
   */
  equals(other: Unit): boolean {
    return this.type === other.type
  }
}

