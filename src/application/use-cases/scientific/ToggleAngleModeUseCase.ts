import { ScientificCalculator } from '../../../domain/services/ScientificCalculator'
import { AngleMode } from '../../../domain/value-objects/AngleMode'

/**
 * 角度モード切り替えユースケース
 */
export class ToggleAngleModeUseCase {
  constructor(
    private readonly scientificCalculator: ScientificCalculator
  ) {}

  /**
   * 角度モードを切り替え
   */
  execute(): AngleMode {
    return this.scientificCalculator.toggleAngleMode()
  }

  /**
   * 現在の角度モードを取得
   */
  getCurrentMode(): AngleMode {
    return this.scientificCalculator.getAngleMode()
  }
}

