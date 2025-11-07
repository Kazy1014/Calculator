import type { ICalculationRepository } from '../../domain/repositories/ICalculationRepository'
import type { CalculationDTO } from '../dto/CalculationDTO'

/**
 * 計算クリアユースケース
 * ユーザーがクリアボタンを押したときの処理
 */
export class ClearCalculationUseCase {
  constructor(private readonly repository: ICalculationRepository) {}

  execute(): CalculationDTO {
    this.repository.clear()

    return {
      displayValue: '0'
    }
  }
}

