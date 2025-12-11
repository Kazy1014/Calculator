/**
 * メモリバリューオブジェクト
 * 計算結果を一時的に保存する
 */
export class Memory {
  private constructor(private readonly value: number | null) {}

  static empty(): Memory {
    return new Memory(null)
  }

  static fromValue(value: number): Memory {
    return new Memory(value)
  }

  getValue(): number | null {
    return this.value
  }

  isEmpty(): boolean {
    return this.value === null
  }

  /**
   * メモリに値を加算
   */
  add(value: number): Memory {
    if (this.value === null) {
      return Memory.fromValue(value)
    }
    return Memory.fromValue(this.value + value)
  }

  /**
   * メモリから値を減算
   */
  subtract(value: number): Memory {
    if (this.value === null) {
      return Memory.fromValue(-value)
    }
    return Memory.fromValue(this.value - value)
  }

  /**
   * メモリをクリア
   */
  clear(): Memory {
    return Memory.empty()
  }
}
