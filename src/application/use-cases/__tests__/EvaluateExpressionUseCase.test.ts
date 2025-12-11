import { describe, it, expect, beforeEach } from 'vitest'
import { EvaluateExpressionUseCase } from '../EvaluateExpressionUseCase'
import { CalculationRepositoryFactory } from '../../../infrastructure/repositories/CalculationRepositoryFactory'
import type { ICalculationRepository } from '../../../domain/repositories/ICalculationRepository'
import { AngleUnit } from '../../../domain/value-objects/AngleUnit'
import { ExpressionEvaluator } from '../../../domain/services/ExpressionEvaluator'

describe('EvaluateExpressionUseCase', () => {
  let repository: ICalculationRepository
  let evaluateExpressionUseCase: EvaluateExpressionUseCase

  beforeEach(() => {
    CalculationRepositoryFactory.reset()
    repository = CalculationRepositoryFactory.getInstance()
    evaluateExpressionUseCase = new EvaluateExpressionUseCase(repository)
    ExpressionEvaluator.setAngleUnit(AngleUnit.radians())
  })

  it('基本的な式を評価できる', () => {
    const result = evaluateExpressionUseCase.execute('2+3')
    expect(result.displayValue).toBe('5')
  })

  it('括弧を含む式を評価できる', () => {
    const result = evaluateExpressionUseCase.execute('(2+3)*4')
    expect(result.displayValue).toBe('20')
  })

  it('関数を含む式を評価できる', () => {
    const result = evaluateExpressionUseCase.execute('sqrt(16)')
    expect(result.displayValue).toBe('4')
  })

  it('エラーがある場合はエラーメッセージを返す', () => {
    const result = evaluateExpressionUseCase.execute('(2+3')
    expect(result.displayValue).toContain('括弧の対応')
  })
})
