import type { ICalculationRepository } from '../../domain/repositories/ICalculationRepository'
import { Calculation } from '../../domain/entities/Calculation'
import type { CalculationDTO } from '../dto/CalculationDTO'

/**
 * バックスペースユースケース
 * 最後に入力した1文字を削除する
 */
export class BackspaceUseCase {
  constructor(private readonly repository: ICalculationRepository) {}

  execute(): CalculationDTO {
    let calculation = this.repository.getCurrent()
    if (!calculation) {
      calculation = Calculation.create()
    }

    calculation.backspace()
    this.repository.save(calculation)

    return {
      displayValue: calculation.getDisplayValue().toString()
    }
  }
}
