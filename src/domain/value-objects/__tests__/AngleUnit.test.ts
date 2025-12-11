import { describe, it, expect } from 'vitest'
import { AngleUnit, AngleUnitType } from '../AngleUnit'

describe('AngleUnit', () => {
  describe('create', () => {
    it('度の単位を作成できる', () => {
      const unit = AngleUnit.degrees()
      expect(unit.getType()).toBe(AngleUnitType.DEGREES)
    })

    it('ラジアンの単位を作成できる', () => {
      const unit = AngleUnit.radians()
      expect(unit.getType()).toBe(AngleUnitType.RADIANS)
    })
  })

  describe('toRadians', () => {
    it('度をラジアンに変換できる', () => {
      const unit = AngleUnit.degrees()
      const radians = unit.toRadians(90)
      expect(radians).toBeCloseTo(Math.PI / 2, 10)
    })

    it('ラジアン単位の場合はそのまま返す', () => {
      const unit = AngleUnit.radians()
      const radians = unit.toRadians(Math.PI / 2)
      expect(radians).toBeCloseTo(Math.PI / 2, 10)
    })
  })

  describe('toDegrees', () => {
    it('ラジアンを度に変換できる', () => {
      const unit = AngleUnit.degrees()
      const degrees = unit.toDegrees(Math.PI / 2)
      expect(degrees).toBeCloseTo(90, 10)
    })

    it('ラジアン単位の場合はそのまま返す', () => {
      const unit = AngleUnit.radians()
      const degrees = unit.toDegrees(Math.PI / 2)
      expect(degrees).toBeCloseTo(Math.PI / 2, 10)
    })
  })

  describe('equals', () => {
    it('同じ単位の場合は等しい', () => {
      const unit1 = AngleUnit.degrees()
      const unit2 = AngleUnit.degrees()
      expect(unit1.equals(unit2)).toBe(true)
    })

    it('異なる単位の場合は等しくない', () => {
      const unit1 = AngleUnit.degrees()
      const unit2 = AngleUnit.radians()
      expect(unit1.equals(unit2)).toBe(false)
    })
  })
})
