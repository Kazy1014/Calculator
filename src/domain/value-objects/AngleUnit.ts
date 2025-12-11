/**
 * 角度単位バリューオブジェクト
 */
export enum AngleUnitType {
  DEGREES = 'degrees',
  RADIANS = 'radians'
}

export class AngleUnit {
  private constructor(private readonly unit: AngleUnitType) {}

  static degrees(): AngleUnit {
    return new AngleUnit(AngleUnitType.DEGREES)
  }

  static radians(): AngleUnit {
    return new AngleUnit(AngleUnitType.RADIANS)
  }

  getType(): AngleUnitType {
    return this.unit
  }

  /**
   * 度をラジアンに変換（必要に応じて）
   */
  toRadians(degrees: number): number {
    if (this.unit === AngleUnitType.DEGREES) {
      return (degrees * Math.PI) / 180
    }
    return degrees
  }

  /**
   * ラジアンを度に変換（必要に応じて）
   */
  toDegrees(radians: number): number {
    if (this.unit === AngleUnitType.DEGREES) {
      return (radians * 180) / Math.PI
    }
    return radians
  }

  /**
   * 等価性チェック
   */
  equals(other: AngleUnit): boolean {
    return this.unit === other.unit
  }
}
