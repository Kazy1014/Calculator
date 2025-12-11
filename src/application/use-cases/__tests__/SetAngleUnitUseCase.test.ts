import { describe, it, expect, beforeEach } from 'vitest'
import { SetAngleUnitUseCase } from '../SetAngleUnitUseCase'
import { AngleUnit } from '../../../domain/value-objects/AngleUnit'
import { ExpressionEvaluator } from '../../../domain/services/ExpressionEvaluator'

describe('SetAngleUnitUseCase', () => {
  let setAngleUnitUseCase: SetAngleUnitUseCase

  beforeEach(() => {
    setAngleUnitUseCase = new SetAngleUnitUseCase()
    ExpressionEvaluator.setAngleUnit(AngleUnit.radians())
  })

  it('角度単位を度に設定できる', () => {
    setAngleUnitUseCase.execute(AngleUnit.degrees())
    const unit = ExpressionEvaluator.getAngleUnit()
    expect(unit.getType()).toBe('degrees')
  })

  it('角度単位をラジアンに設定できる', () => {
    setAngleUnitUseCase.execute(AngleUnit.radians())
    const unit = ExpressionEvaluator.getAngleUnit()
    expect(unit.getType()).toBe('radians')
  })
})
