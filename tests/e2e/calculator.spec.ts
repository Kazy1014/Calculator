import { test, expect } from '@playwright/test'

test.describe('高度な電卓アプリ E2E テスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
  })

  test.describe('基本機能', () => {
    test('ページが正しく表示される', async ({ page }) => {
      await expect(page).toHaveTitle(/電卓アプリ/)
      await expect(page.locator('[data-testid="display"]')).toBeVisible()
      await expect(page.locator('.history-panel-container')).toBeVisible()
      await expect(page.locator('.calculator-console')).toBeVisible()
    })

    test('初期表示は0である', async ({ page }) => {
      const display = page.locator('[data-testid="display"]')
      await expect(display).toHaveText('0')
    })

    test('数字ボタンをクリックして入力できる', async ({ page }) => {
      await page.locator('[data-testid="btn-1"]').click()
      await page.locator('[data-testid="btn-2"]').click()
      await page.locator('[data-testid="btn-3"]').click()
      
      const expressionDisplay = page.locator('[data-testid="expression-display"]')
      await expect(expressionDisplay).toContainText('123')
    })

    test('クリアボタンで初期状態に戻る', async ({ page }) => {
      await page.locator('[data-testid="btn-5"]').click()
      await page.locator('[data-testid="btn-add"]').click()
      await page.locator('[data-testid="btn-3"]').click()
      await page.locator('[data-testid="btn-clear"]').click()
      
      const display = page.locator('[data-testid="display"]')
      await expect(display).toHaveText('0')
    })

    test('バックスペースで1文字削除できる', async ({ page }) => {
      await page.locator('[data-testid="btn-1"]').click()
      await page.locator('[data-testid="btn-2"]').click()
      await page.locator('[data-testid="btn-3"]').click()
      await page.locator('[data-testid="btn-backspace"]').click()
      
      const expressionDisplay = page.locator('[data-testid="expression-display"]')
      await expect(expressionDisplay).toContainText('12')
    })
  })

  test.describe('四則演算', () => {
    test('足し算の計算ができる', async ({ page }) => {
      await page.locator('[data-testid="btn-5"]').click()
      await page.locator('[data-testid="btn-add"]').click()
      await page.locator('[data-testid="btn-3"]').click()
      await page.locator('[data-testid="btn-equals"]').click()
      
      const display = page.locator('[data-testid="display"]')
      await expect(display).toHaveText('8')
    })

    test('引き算の計算ができる', async ({ page }) => {
      await page.locator('[data-testid="btn-9"]').click()
      await page.locator('[data-testid="btn-subtract"]').click()
      await page.locator('[data-testid="btn-4"]').click()
      await page.locator('[data-testid="btn-equals"]').click()
      
      const display = page.locator('[data-testid="display"]')
      await expect(display).toHaveText('5')
    })

    test('掛け算の計算ができる', async ({ page }) => {
      await page.locator('[data-testid="btn-6"]').click()
      await page.locator('[data-testid="btn-multiply"]').click()
      await page.locator('[data-testid="btn-7"]').click()
      await page.locator('[data-testid="btn-equals"]').click()
      
      const display = page.locator('[data-testid="display"]')
      await expect(display).toHaveText('42')
    })

    test('割り算の計算ができる', async ({ page }) => {
      await page.locator('[data-testid="btn-8"]').click()
      await page.locator('[data-testid="btn-divide"]').click()
      await page.locator('[data-testid="btn-4"]').click()
      await page.locator('[data-testid="btn-equals"]').click()
      
      const display = page.locator('[data-testid="display"]')
      await expect(display).toHaveText('2')
    })

    test('小数点の計算ができる', async ({ page }) => {
      await page.locator('[data-testid="btn-1"]').click()
      await page.locator('[data-testid="btn-decimal"]').click()
      await page.locator('[data-testid="btn-5"]').click()
      await page.locator('[data-testid="btn-add"]').click()
      await page.locator('[data-testid="btn-2"]').click()
      await page.locator('[data-testid="btn-decimal"]').click()
      await page.locator('[data-testid="btn-5"]').click()
      await page.locator('[data-testid="btn-equals"]').click()
      
      const display = page.locator('[data-testid="display"]')
      await expect(display).toHaveText('4')
    })

    test('ゼロ除算でエラー表示', async ({ page }) => {
      await page.locator('[data-testid="btn-5"]').click()
      await page.locator('[data-testid="btn-divide"]').click()
      await page.locator('[data-testid="btn-0"]').click()
      await page.locator('[data-testid="btn-equals"]').click()
      
      const display = page.locator('[data-testid="display"]')
      await expect(display).toContainText('ゼロで除算')
    })
  })

  test.describe('括弧を使った計算', () => {
    test('括弧内の計算が優先される', async ({ page }) => {
      // (5+5) = 10
      await page.locator('[data-testid="btn-left-paren"]').click()
      await page.locator('[data-testid="btn-5"]').click()
      await page.locator('[data-testid="btn-add"]').click()
      await page.locator('[data-testid="btn-5"]').click()
      await page.locator('[data-testid="btn-right-paren"]').click()
      await page.locator('[data-testid="btn-equals"]').click()
      
      const display = page.locator('[data-testid="display"]')
      await expect(display).toHaveText('10')
    })

    test('開き括弧が多い場合は自動補完される', async ({ page }) => {
      // (2+3 → 自動的に (2+3) として評価
      await page.locator('[data-testid="btn-left-paren"]').click()
      await page.locator('[data-testid="btn-2"]').click()
      await page.locator('[data-testid="btn-add"]').click()
      await page.locator('[data-testid="btn-3"]').click()
      await page.locator('[data-testid="btn-equals"]').click()
      
      const display = page.locator('[data-testid="display"]')
      await expect(display).toHaveText('5')
    })
  })

  test.describe('計算履歴', () => {
    test('計算履歴が表示される', async ({ page }) => {
      // 計算を実行
      await page.locator('[data-testid="btn-5"]').click()
      await page.locator('[data-testid="btn-add"]').click()
      await page.locator('[data-testid="btn-3"]').click()
      await page.locator('[data-testid="btn-equals"]').click()
      
      // 履歴パネルに表示されることを確認
      const historyEntry = page.locator('.history-entry').first()
      await expect(historyEntry).toBeVisible()
      await expect(historyEntry.locator('.entry-result')).toContainText('8')
    })

    test('履歴エントリをクリックして再利用できる', async ({ page }) => {
      // 計算を実行
      await page.locator('[data-testid="btn-5"]').click()
      await page.locator('[data-testid="btn-add"]').click()
      await page.locator('[data-testid="btn-3"]').click()
      await page.locator('[data-testid="btn-equals"]').click()
      
      // 履歴をクリア
      await page.locator('[data-testid="btn-clear"]').click()
      
      // 履歴エントリをクリック
      await page.locator('.history-entry').first().click()
      
      // 数式が再入力されていることを確認
      const expressionDisplay = page.locator('[data-testid="expression-display"]')
      await expect(expressionDisplay).toContainText('5+3')
    })

    test('履歴をクリアできる', async ({ page }) => {
      // 計算を実行
      await page.locator('[data-testid="btn-5"]').click()
      await page.locator('[data-testid="btn-add"]').click()
      await page.locator('[data-testid="btn-3"]').click()
      await page.locator('[data-testid="btn-equals"]').click()
      
      // 履歴クリアボタンをクリック
      await page.locator('.btn-clear-history').click()
      
      // 履歴が空になることを確認
      await expect(page.locator('.empty-message')).toBeVisible()
    })
  })

  test.describe('キーボード操作', () => {
    test('キーボードで数字入力ができる', async ({ page }) => {
      await page.keyboard.type('123')
      
      const expressionDisplay = page.locator('[data-testid="expression-display"]')
      await expect(expressionDisplay).toContainText('123')
    })

    test('キーボードで計算ができる', async ({ page }) => {
      await page.keyboard.type('5+3')
      await page.keyboard.press('Enter')
      
      const display = page.locator('[data-testid="display"]')
      await expect(display).toHaveText('8')
    })

    test('キーボードのEscapeでクリアできる', async ({ page }) => {
      await page.keyboard.type('123')
      await page.keyboard.press('Escape')
      
      const display = page.locator('[data-testid="display"]')
      await expect(display).toHaveText('0')
    })

    test('キーボードのBackspaceで1文字削除できる', async ({ page }) => {
      await page.keyboard.type('123')
      await page.keyboard.press('Backspace')
      
      const expressionDisplay = page.locator('[data-testid="expression-display"]')
      await expect(expressionDisplay).toContainText('12')
    })

    test('括弧をキーボードで入力できる', async ({ page }) => {
      await page.keyboard.type('(5+5)')
      await page.keyboard.press('Enter')
      
      const display = page.locator('[data-testid="display"]')
      await expect(display).toHaveText('10')
    })
  })

  test.describe('数値フォーマット', () => {
    test('大きな数値はカンマ区切りで表示される', async ({ page }) => {
      // 1000を計算
      await page.keyboard.type('500+500')
      await page.keyboard.press('Enter')
      
      const display = page.locator('[data-testid="display"]')
      await expect(display).toHaveText('1,000')
    })

    test('12桁を超える数値は科学的記数法で表示される', async ({ page }) => {
      // 999999999999 * 2を計算（24桁）
      await page.keyboard.type('999999999999*2')
      await page.keyboard.press('Enter')
      
      const display = page.locator('[data-testid="display"]')
      const text = await display.textContent()
      expect(text).toMatch(/e\+/)  // 科学的記数法
    })
  })

  test.describe('科学計算機能', () => {
    test('sin関数が使える', async ({ page }) => {
      await page.locator('[data-testid="btn-sin"]').click()
      await page.locator('[data-testid="btn-3"]').click()
      await page.locator('[data-testid="btn-0"]').click()
      await page.locator('[data-testid="btn-right-paren"]').click()
      await page.locator('[data-testid="btn-equals"]').click()
      
      const display = page.locator('[data-testid="display"]')
      // sin(30°) = 0.5
      const text = await display.textContent()
      expect(parseFloat(text || '0')).toBeCloseTo(0.5, 1)
    })

    test('sqrt関数が使える', async ({ page }) => {
      await page.locator('[data-testid="btn-sqrt"]').click()
      await page.locator('[data-testid="btn-1"]').click()
      await page.locator('[data-testid="btn-6"]').click()
      await page.locator('[data-testid="btn-right-paren"]').click()
      await page.locator('[data-testid="btn-equals"]').click()
      
      const display = page.locator('[data-testid="display"]')
      await expect(display).toHaveText('4')
    })

    test('累乗計算ができる', async ({ page }) => {
      await page.locator('[data-testid="btn-2"]').click()
      await page.locator('[data-testid="btn-power"]').click()
      await page.locator('[data-testid="btn-3"]').click()
      await page.locator('[data-testid="btn-equals"]').click()
      
      const display = page.locator('[data-testid="display"]')
      await expect(display).toHaveText('8')  // 2^3 = 8
    })

    test('角度モードインジケーターが表示される', async ({ page }) => {
      const angleIndicator = page.locator('[data-testid="angle-indicator"]')
      await expect(angleIndicator).toBeVisible()
      await expect(angleIndicator).toHaveText('DEGREE')
    })
  })

  test.describe('UI要素の存在確認', () => {
    test('すべての数字ボタン（0-9）が存在する', async ({ page }) => {
      for (let i = 0; i <= 9; i++) {
        await expect(page.locator(`[data-testid="btn-${i}"]`)).toBeVisible()
      }
    })

    test('すべての演算子ボタンが存在する', async ({ page }) => {
      await expect(page.locator('[data-testid="btn-add"]')).toBeVisible()
      await expect(page.locator('[data-testid="btn-subtract"]')).toBeVisible()
      await expect(page.locator('[data-testid="btn-multiply"]')).toBeVisible()
      await expect(page.locator('[data-testid="btn-divide"]')).toBeVisible()
    })

    test('科学関数ボタンが存在する', async ({ page }) => {
      await expect(page.locator('[data-testid="btn-sin"]')).toBeVisible()
      await expect(page.locator('[data-testid="btn-cos"]')).toBeVisible()
      await expect(page.locator('[data-testid="btn-tan"]')).toBeVisible()
      await expect(page.locator('[data-testid="btn-log"]')).toBeVisible()
      await expect(page.locator('[data-testid="btn-ln"]')).toBeVisible()
      await expect(page.locator('[data-testid="btn-sqrt"]')).toBeVisible()
    })

    test('括弧ボタンが存在する', async ({ page }) => {
      await expect(page.locator('[data-testid="btn-left-paren"]')).toBeVisible()
      await expect(page.locator('[data-testid="btn-right-paren"]')).toBeVisible()
    })

    test('特殊機能ボタンが存在する', async ({ page }) => {
      await expect(page.locator('[data-testid="btn-clear"]')).toBeVisible()
      await expect(page.locator('[data-testid="btn-equals"]')).toBeVisible()
      await expect(page.locator('[data-testid="btn-decimal"]')).toBeVisible()
      await expect(page.locator('[data-testid="btn-backspace"]')).toBeVisible()
    })
  })

  test.describe('レスポンシブ表示', () => {
    test('履歴パネルが表示される', async ({ page }) => {
      await expect(page.locator('.history-panel-container')).toBeVisible()
    })

    test('電卓コンソールが表示される', async ({ page }) => {
      await expect(page.locator('.calculator-console')).toBeVisible()
    })

    test('メインレイアウトが正しく配置されている', async ({ page }) => {
      const mainLayout = page.locator('.main-layout')
      await expect(mainLayout).toBeVisible()
      
      const historyPanel = page.locator('.history-panel')
      const calculatorPanel = page.locator('.calculator-panel')
      
      await expect(historyPanel).toBeVisible()
      await expect(calculatorPanel).toBeVisible()
    })
  })
})
