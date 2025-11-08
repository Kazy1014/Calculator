/**
 * 角度モード
 */
export enum AngleMode {
  DEGREE = 'DEGREE',   // 度
  RADIAN = 'RADIAN'    // ラジアン
}

/**
 * 角度モードのユーティリティ
 */
export class AngleModeUtil {
  /**
   * 度をラジアンに変換
   */
  static degreeToRadian(degree: number): number {
    return (degree * Math.PI) / 180
  }

  /**
   * ラジアンを度に変換
   */
  static radianToDegree(radian: number): number {
    return (radian * 180) / Math.PI
  }

  /**
   * モードに応じて角度を変換
   */
  static convertToRadian(value: number, mode: AngleMode): number {
    return mode === AngleMode.DEGREE ? this.degreeToRadian(value) : value
  }

  /**
   * モードに応じて逆変換
   */
  static convertFromRadian(value: number, mode: AngleMode): number {
    return mode === AngleMode.DEGREE ? this.radianToDegree(value) : value
  }
}

