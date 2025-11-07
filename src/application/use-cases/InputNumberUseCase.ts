import type { ICalculationRepository } from '../../domain/repositories/ICalculationRepository'
import { Calculation } from '../../domain/entities/Calculation'
import type { CalculationDTO } from '../dto/CalculationDTO'

/**
 * 数字入力ユースケース
 * ユーザーが数字ボタンを押したときの処理
 */
export class InputNumberUseCase {
  constructor(private readonly repository: ICalculationRepository) {}

  execute(digit: string): CalculationDTO {
    // 現在の計算を取得、なければ新規作成
    let calculation = this.repository.getCurrent()
    if (!calculation) {
      calculation = Calculation.create()
    }

    // 数字を入力
    calculation.inputNumber(digit)

    // 保存
    this.repository.save(calculation)

    // DTOに変換して返す
    return {
      displayValue: calculation.getDisplayValue().toString()
    }
  }
}

