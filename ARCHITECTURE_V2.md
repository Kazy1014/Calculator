# 電卓アプリケーション アーキテクチャ設計書 v2.0

## 概要

本ドキュメントは、要件定義書に基づいた高度な電卓アプリケーションのDDDアーキテクチャ設計を定義します。

## ドメインモデル

### 1. Core Domain（コア計算ドメイン）

#### 1.1 Expression（数式）
- **役割**: 数式全体を表現する値オブジェクト
- **責務**: 
  - 数式文字列の保持
  - 数式の妥当性検証（括弧の対応チェック）
  - 数式の文字列表現

#### 1.2 Token（トークン）
- **役割**: 数式を構成する要素（数値、演算子、関数、括弧）
- **種類**:
  - NumberToken: 数値
  - OperatorToken: 演算子（+, -, *, /）
  - ParenthesisToken: 括弧
  - FunctionToken: 科学関数（sin, cos, log等）

#### 1.3 ExpressionParser（数式パーサー）
- **役割**: 数式をトークンに分解し、計算可能な形式に変換
- **アルゴリズム**: Shunting-yard algorithm（逆ポーランド記法への変換）
- **責務**:
  - 中置記法を後置記法（RPN）に変換
  - 演算子の優先順位処理
  - 括弧の処理

#### 1.4 CalculationEngine（計算エンジン）
- **役割**: トークン列を評価して結果を計算
- **責務**:
  - RPNの評価
  - 演算子の実行
  - エラーハンドリング（ゼロ除算等）

### 2. History Domain（履歴ドメイン）

#### 2.1 CalculationHistoryEntry（履歴エントリ）
- **役割**: 1つの計算記録を表現
- **属性**:
  - id: string
  - expression: Expression
  - result: number
  - timestamp: Date
  - formattedExpression: string
  - formattedResult: string

#### 2.2 CalculationHistory（計算履歴）
- **役割**: 履歴エントリの集合を管理
- **責務**:
  - 履歴の追加
  - 履歴の取得（最新20件）
  - 履歴のクリア
  - 履歴のソート（時系列順）

### 3. Memory Domain（メモリドメイン）

#### 3.1 MemoryStorage（メモリストレージ）
- **役割**: 計算結果を一時保存
- **責務**:
  - 値の保存（AC: All Clear and Save）
  - 値の取得（MR: Memory Recall）
  - メモリのクリア（MC: Memory Clear）
  - メモリ状態の確認（hasValue）

### 4. Scientific Domain（科学計算ドメイン）

#### 4.1 ScientificFunction（科学関数）
- **種類**:
  - Trigonometric: sin, cos, tan, asin, acos, atan
  - Logarithmic: log, ln
  - Power: sqrt, pow, exp
  - Constants: π, e

#### 4.2 AngleMode（角度モード）
- **種類**:
  - Degree（度）
  - Radian（ラジアン）

#### 4.3 ScientificCalculator（科学計算機）
- **役割**: 科学計算関数の実行
- **責務**:
  - 三角関数の計算
  - 対数計算
  - 累乗・平方根計算
  - 角度モードの変換

### 5. Unit Conversion Domain（単位変換ドメイン）

#### 5.1 Unit（単位）
- **カテゴリー**:
  - Length: m, km, cm, mm, mile, yard, feet, inch
  - Weight: kg, g, mg, lb, oz
  - Temperature: Celsius, Fahrenheit, Kelvin
  - Volume: L, mL, gallon, quart, pint, cup

#### 5.2 UnitConverter（単位変換器）
- **役割**: 単位間の変換を実行
- **責務**:
  - 変換レートの管理
  - 単位変換の実行
  - サポート単位の提供

### 6. Formatting Domain（フォーマットドメイン）

#### 6.1 NumberFormatter（数値フォーマッター）
- **役割**: 数値を表示用にフォーマット
- **責務**:
  - カンマ区切りの挿入（1,000単位）
  - 科学的記数法への変換（12桁超過時）
  - 小数点以下の桁数制限
  - 整数部と小数部の合計桁数管理（最大12桁）

#### 6.2 DisplayValue（表示値）
- **役割**: フォーマット済みの表示値を表現
- **属性**:
  - rawValue: number
  - formattedValue: string
  - isScientificNotation: boolean

## レイヤー構造

### Domain Layer（ドメイン層）

```
src/domain/
├── entities/
│   ├── CalculationHistoryEntry.ts
│   └── CalculationHistory.ts
├── value-objects/
│   ├── Expression.ts
│   ├── Token.ts
│   ├── DisplayValue.ts
│   ├── AngleMode.ts
│   └── Unit.ts
├── services/
│   ├── ExpressionParser.ts
│   ├── CalculationEngine.ts
│   ├── ScientificCalculator.ts
│   ├── UnitConverter.ts
│   └── NumberFormatter.ts
└── repositories/
    ├── ICalculationHistoryRepository.ts
    └── IMemoryRepository.ts
```

### Application Layer（アプリケーション層）

```
src/application/
├── dto/
│   ├── CalculationResultDTO.ts
│   ├── HistoryEntryDTO.ts
│   └── ConversionResultDTO.ts
└── use-cases/
    ├── calculation/
    │   ├── EvaluateExpressionUseCase.ts
    │   ├── InputCharacterUseCase.ts
    │   ├── BackspaceUseCase.ts
    │   └── ClearInputUseCase.ts
    ├── history/
    │   ├── GetHistoryUseCase.ts
    │   ├── ClearHistoryUseCase.ts
    │   └── ReplayHistoryEntryUseCase.ts
    ├── memory/
    │   ├── SaveToMemoryUseCase.ts
    │   ├── RecallFromMemoryUseCase.ts
    │   └── ClearMemoryUseCase.ts
    ├── scientific/
    │   ├── CalculateScientificFunctionUseCase.ts
    │   └── ToggleAngleModeUseCase.ts
    └── conversion/
        └── ConvertUnitUseCase.ts
```

### Infrastructure Layer（インフラ層）

```
src/infrastructure/
└── repositories/
    ├── InMemoryHistoryRepository.ts
    ├── InMemoryMemoryRepository.ts
    └── LocalStorageHistoryRepository.ts（永続化版）
```

### Presentation Layer（プレゼンテーション層）

```
src/presentation/
├── composables/
│   ├── useCalculator.ts
│   ├── useHistory.ts
│   ├── useMemory.ts
│   ├── useScientific.ts
│   └── useUnitConverter.ts
└── components/
    ├── CalculatorDisplay.vue
    ├── CalculatorButtons.vue
    ├── ScientificButtons.vue
    ├── HistoryPanel.vue
    ├── UnitConverterPanel.vue
    └── MemoryIndicator.vue
```

## UI構造

```
app.vue
└── MainLayout.vue
    ├── LeftPanel (40%)
    │   ├── HistoryPanel.vue
    │   └── HistoryList.vue
    └── RightPanel (60%)
        ├── CalculatorDisplay.vue
        ├── MemoryIndicator.vue
        ├── ModeSelector.vue（標準/科学/単位変換）
        ├── CalculatorButtons.vue（標準モード）
        ├── ScientificButtons.vue（科学モード）
        └── UnitConverterPanel.vue（単位変換モード）
```

## データフロー

### 計算フロー

1. ユーザーが文字入力（数字、演算子、括弧）
2. InputCharacterUseCase → Expression更新
3. ユーザーが「=」押下
4. EvaluateExpressionUseCase実行
   - ExpressionParser → Tokenリストに変換
   - CalculationEngine → RPN評価
   - NumberFormatter → 結果をフォーマット
   - HistoryRepository → 履歴に保存
5. 結果を表示

### 履歴再利用フロー

1. ユーザーが履歴エントリをクリック
2. ReplayHistoryEntryUseCase実行
3. 選択した数式をInputに再設定
4. ユーザーが編集・再計算可能

### メモリフロー

1. 計算実行後、ユーザーが「AC」押下
2. SaveToMemoryUseCase → 現在の結果をMemoryRepositoryに保存
3. 別の計算中に「MR」押下
4. RecallFromMemoryUseCase → メモリ値を取得してInputに挿入

## テスト戦略

### Unit Tests
- 各Value Object、Entity、Domain Serviceの単体テスト
- 特に重要:
  - ExpressionParser（括弧、優先順位）
  - CalculationEngine（複雑な数式の評価）
  - NumberFormatter（カンマ区切り、科学的記数法）
  - ScientificCalculator（各関数の精度）

### Component Tests
- 各Vueコンポーネントの動作テスト
- ボタンクリック、キーボード入力の確認

### E2E Tests
- 実際のユースケースシナリオ
  - 複雑な括弧計算
  - 科学計算の実行
  - 履歴の参照と再利用
  - メモリ機能の使用
  - 単位変換

## 実装の優先順位

### Phase 1: 基盤拡張
1. ExpressionParser（括弧対応）
2. CalculationEngine（RPN評価）
3. NumberFormatter（カンマ区切り、科学的記数法）
4. UI Layout（左右分割）

### Phase 2: 履歴・メモリ
5. CalculationHistory（履歴管理）
6. MemoryStorage（メモリ機能）
7. BackspaceUseCase（1文字削除）

### Phase 3: 科学計算
8. ScientificCalculator（科学関数）
9. AngleMode（度/ラジアン切替）

### Phase 4: 単位変換
10. UnitConverter（単位変換）
11. Unit定義

## 技術スタック

- **フレームワーク**: Nuxt 3
- **言語**: TypeScript
- **テスト**: Vitest（ユニット）、Playwright（E2E）
- **状態管理**: Composables（Vue 3 Composition API）
- **スタイリング**: Scoped CSS
- **パーサーアルゴリズム**: Shunting-yard algorithm

