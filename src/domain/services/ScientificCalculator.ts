import { AngleMode, AngleModeUtil } from '../value-objects/AngleMode'

/**
 * 科学計算機（ドメインサービス）
 * 三角関数、対数、累乗などの科学計算を実行
 */
export class ScientificCalculator {
  private angleMode: AngleMode = AngleMode.DEGREE

  /**
   * 角度モードを設定
   */
  setAngleMode(mode: AngleMode): void {
    this.angleMode = mode
  }

  /**
   * 角度モードを取得
   */
  getAngleMode(): AngleMode {
    return this.angleMode
  }

  /**
   * 角度モードを切り替え
   */
  toggleAngleMode(): AngleMode {
    this.angleMode = this.angleMode === AngleMode.DEGREE ? AngleMode.RADIAN : AngleMode.DEGREE
    return this.angleMode
  }

  /**
   * sin関数
   */
  sin(value: number): number {
    const radian = AngleModeUtil.convertToRadian(value, this.angleMode)
    return Math.sin(radian)
  }

  /**
   * cos関数
   */
  cos(value: number): number {
    const radian = AngleModeUtil.convertToRadian(value, this.angleMode)
    return Math.cos(radian)
  }

  /**
   * tan関数
   */
  tan(value: number): number {
    const radian = AngleModeUtil.convertToRadian(value, this.angleMode)
    return Math.tan(radian)
  }

  /**
   * asin関数（逆正弦）
   */
  asin(value: number): number {
    if (value < -1 || value > 1) {
      throw new Error('asinの引数は-1から1の範囲である必要があります')
    }
    const radian = Math.asin(value)
    return AngleModeUtil.convertFromRadian(radian, this.angleMode)
  }

  /**
   * acos関数（逆余弦）
   */
  acos(value: number): number {
    if (value < -1 || value > 1) {
      throw new Error('acosの引数は-1から1の範囲である必要があります')
    }
    const radian = Math.acos(value)
    return AngleModeUtil.convertFromRadian(radian, this.angleMode)
  }

  /**
   * atan関数（逆正接）
   */
  atan(value: number): number {
    const radian = Math.atan(value)
    return AngleModeUtil.convertFromRadian(radian, this.angleMode)
  }

  /**
   * log関数（常用対数、底10）
   */
  log(value: number): number {
    if (value <= 0) {
      throw new Error('logの引数は正の数である必要があります')
    }
    return Math.log10(value)
  }

  /**
   * ln関数（自然対数、底e）
   */
  ln(value: number): number {
    if (value <= 0) {
      throw new Error('lnの引数は正の数である必要があります')
    }
    return Math.log(value)
  }

  /**
   * sqrt関数（平方根）
   */
  sqrt(value: number): number {
    if (value < 0) {
      throw new Error('sqrtの引数は0以上である必要があります')
    }
    return Math.sqrt(value)
  }

  /**
   * abs関数（絶対値）
   */
  abs(value: number): number {
    return Math.abs(value)
  }

  /**
   * pow関数（累乗）
   */
  pow(base: number, exponent: number): number {
    return Math.pow(base, exponent)
  }

  /**
   * exp関数（e^x）
   */
  exp(value: number): number {
    return Math.exp(value)
  }

  /**
   * π（パイ）の値を取得
   */
  getPi(): number {
    return Math.PI
  }

  /**
   * e（自然対数の底）の値を取得
   */
  getE(): number {
    return Math.E
  }

  /**
   * 関数名から対応する計算を実行
   */
  calculateFunction(functionName: string, value: number): number {
    switch (functionName.toLowerCase()) {
      case 'sin':
        return this.sin(value)
      case 'cos':
        return this.cos(value)
      case 'tan':
        return this.tan(value)
      case 'asin':
        return this.asin(value)
      case 'acos':
        return this.acos(value)
      case 'atan':
        return this.atan(value)
      case 'log':
        return this.log(value)
      case 'ln':
        return this.ln(value)
      case 'sqrt':
        return this.sqrt(value)
      case 'abs':
        return this.abs(value)
      default:
        throw new Error(`未知の関数: ${functionName}`)
    }
  }
}

