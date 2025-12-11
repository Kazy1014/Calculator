# DDDアーキテクチャ設計書

## 概要

この電卓アプリケーションは、**ドメイン駆動設計（Domain-Driven Design: DDD）**のアーキテクチャパターンを採用しています。

## アーキテクチャレイヤー

```
┌─────────────────────────────────────────────────┐
│         Presentation Layer (UI)                 │
│  components/ + composables/                     │
│  - Calculator.vue                               │
│  - useCalculator.ts                             │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│         Application Layer                       │
│  use-cases/ + dto/                              │
│  - InputNumberUseCase                           │
│  - InputOperatorUseCase                         │
│  - CalculateUseCase                             │
│  - ClearCalculationUseCase                      │
│  - CalculationDTO                               │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│         Domain Layer (Core Business Logic)      │
│  entities/ + value-objects/ + repositories/     │
│  - Calculation (Entity)                         │
│  - Operator (Value Object)                      │
│  - DisplayValue (Value Object)                  │
│  - CalculationResult (Value Object)             │
│  - ICalculationRepository (Interface)           │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│         Infrastructure Layer                    │
│  repositories/                                   │
│  - InMemoryCalculationRepository                │
│  - CalculationRepositoryFactory (Singleton)     │
└─────────────────────────────────────────────────┘
```

## レイヤー詳細

### 1. ドメイン層 (Domain Layer)

**役割**: ビジネスロジックの中核。技術的な詳細から独立した純粋なビジネスルール。

#### エンティティ (Entities)

- **Calculation**: 計算の状態を管理するエンティティ
  - ID（識別子）を持つ
  - 計算の振る舞い（入力、演算、クリア）を定義
  - 状態の一貫性を保証

#### バリューオブジェクト (Value Objects)

- **Operator**: 演算子（+, -, *, /）を表現
  - 不変（Immutable）
  - 等価性比較が可能
  - バリデーション機能

- **DisplayValue**: 表示値を表現
  - 文字列として表現される計算値
  - 小数点、エラー状態の管理
  - 自己検証機能

- **CalculationResult**: 計算結果を表現
  - 成功/失敗の状態を持つ
  - エラーメッセージを含む
  - 浮動小数点誤差の丸め処理

#### リポジトリインターフェース (Repository Interface)

- **ICalculationRepository**: 永続化の抽象化
  - ドメイン層で定義（依存性逆転の原則）
  - 具体的な実装はインフラ層

### 2. アプリケーション層 (Application Layer)

**役割**: ユースケース（アプリケーション固有のビジネスフロー）の実装。

#### ユースケース (Use Cases)

各ユーザーアクションに対応するユースケース：

- **InputNumberUseCase**: 数字入力
- **InputDecimalUseCase**: 小数点入力
- **InputOperatorUseCase**: 演算子入力
- **CalculateUseCase**: 計算実行
- **ClearCalculationUseCase**: クリア
- **GetDisplayValueUseCase**: 表示値取得

各ユースケースは：
1. リポジトリから状態を取得
2. ドメインモデルを操作
3. 変更を永続化
4. DTOで結果を返す

#### DTO (Data Transfer Object)

- **CalculationDTO**: レイヤー間でデータを転送
  - プレゼンテーション層とアプリケーション層の間
  - ドメインモデルの詳細を隠蔽

### 3. インフラ層 (Infrastructure Layer)

**役割**: 技術的な実装の詳細（永続化、外部サービスなど）。

#### リポジトリ実装

- **InMemoryCalculationRepository**: メモリ上に状態を保持
  - ICalculationRepositoryを実装
  - リロードでリセット（キャッシュなし）

- **CalculationRepositoryFactory**: シングルトンパターン
  - アプリケーション全体で単一のリポジトリインスタンスを共有
  - テスト時のリセット機能

### 4. プレゼンテーション層 (Presentation Layer)

**役割**: ユーザーインターフェースとユーザー操作の処理。

#### Composable

- **useCalculator**: Vue Composable
  - ユースケースの初期化（依存性注入）
  - UI状態管理（リアクティビティ）
  - イベントハンドリング
  - キーボード入力処理

#### コンポーネント

- **Calculator.vue**: UI表示
  - Composableを使用
  - ビジネスロジックを含まない
  - 純粋なプレゼンテーションコンポーネント

## 設計原則

### SOLID原則

1. **単一責任の原則 (SRP)**
   - 各クラス・関数は単一の責務のみを持つ
   - 例: `InputNumberUseCase`は数字入力のみを担当

2. **開放閉鎖の原則 (OCP)**
   - 拡張に対して開いており、修正に対して閉じている
   - 例: 新しい演算子を追加する際、既存コードを変更しない

3. **リスコフの置換原則 (LSP)**
   - 派生クラスは基底クラス（インターフェース）と置換可能
   - 例: リポジトリの実装を切り替え可能

4. **インターフェース分離の原則 (ISP)**
   - クライアントは使用しないインターフェースに依存しない
   - 例: リポジトリは必要最小限のメソッドのみ

5. **依存性逆転の原則 (DIP)**
   - 高レベルモジュールは低レベルモジュールに依存しない
   - 例: ドメイン層はインフラ層に依存しない（インターフェースに依存）

### DDDの戦術的パターン

- **エンティティ**: 識別子を持つドメインオブジェクト
- **バリューオブジェクト**: 不変で等価性で比較されるオブジェクト
- **リポジトリ**: 永続化の抽象化
- **ファクトリー**: オブジェクト生成の責務を分離

## テスト戦略

### レイヤーごとのテスト

```
Domain Layer Tests (16 tests)
├─ Calculation Entity
├─ Operator Value Object
├─ DisplayValue Value Object
└─ CalculationResult Value Object

Application Layer Tests (9 tests)
├─ InputNumberUseCase
├─ CalculateUseCase
└─ ClearCalculationUseCase

Presentation Layer Tests (13 tests)
├─ Calculator Component
└─ Keyboard Input

Integration Tests (21 tests)
└─ E2E Tests (Playwright)

Legacy Tests (15 tests)
└─ utils/calculator.test.ts (移行前の実装)
```

**合計: 74テスト**

### テストの独立性

- 各テストでリポジトリをリセット
- モックやスタブを使用せず、実際の実装をテスト
- E2Eテストで完全な統合をテスト

## ディレクトリ構造

```
src/
├── domain/                          # ドメイン層
│   ├── entities/
│   │   ├── Calculation.ts
│   │   └── __tests__/
│   │       └── Calculation.test.ts
│   ├── value-objects/
│   │   ├── Operator.ts
│   │   ├── DisplayValue.ts
│   │   ├── CalculationResult.ts
│   │   └── __tests__/
│   │       ├── Operator.test.ts
│   │       └── DisplayValue.test.ts
│   └── repositories/
│       └── ICalculationRepository.ts
│
├── application/                     # アプリケーション層
│   ├── use-cases/
│   │   ├── InputNumberUseCase.ts
│   │   ├── InputOperatorUseCase.ts
│   │   ├── CalculateUseCase.ts
│   │   ├── ClearCalculationUseCase.ts
│   │   ├── GetDisplayValueUseCase.ts
│   │   └── __tests__/
│   │       ├── InputNumberUseCase.test.ts
│   │       ├── CalculateUseCase.test.ts
│   │       └── ClearCalculationUseCase.test.ts
│   └── dto/
│       └── CalculationDTO.ts
│
├── infrastructure/                  # インフラ層
│   └── repositories/
│       ├── InMemoryCalculationRepository.ts
│       └── CalculationRepositoryFactory.ts
│
└── presentation/                    # プレゼンテーション層
    └── composables/
        └── useCalculator.ts

components/
└── Calculator.vue                   # UIコンポーネント

tests/e2e/
└── calculator.spec.ts              # E2Eテスト
```

## DDDのメリット

### このプロジェクトでの実現

1. **保守性の向上**
   - ビジネスロジックが明確に分離
   - 変更の影響範囲が限定的

2. **テスタビリティ**
   - 各層を独立してテスト可能
   - モックに頼らない実装

3. **拡張性**
   - 新機能追加が容易（例: 履歴機能、メモリ機能）
   - リポジトリ実装の切り替えが簡単（LocalStorage、IndexedDB等）

4. **可読性**
   - コードの意図が明確
   - ドメインの概念がそのままコードに反映

5. **チーム開発**
   - 各層を独立して開発可能
   - 責務が明確で並行開発しやすい

## 今後の拡張例

### 機能拡張

1. **計算履歴機能**
   ```typescript
   // Domain
   class CalculationHistory extends Entity
   
   // Application
   class GetHistoryUseCase
   class SaveHistoryUseCase
   
   // Infrastructure
   class LocalStorageHistoryRepository
   ```

2. **メモリ機能（M+, M-, MR, MC）**
   ```typescript
   // Domain
   class Memory extends ValueObject
   
   // Application
   class AddToMemoryUseCase
   class RecallMemoryUseCase
   ```

3. **高度な演算（三角関数、対数など）**
   ```typescript
   // Domain
   class ScientificOperator extends Operator
   class ScientificCalculation extends Calculation
   ```

### インフラ拡張

- **永続化**: LocalStorage、IndexedDB
- **同期**: クラウド同期
- **アナリティクス**: 使用統計の収集

## まとめ

このアプリケーションは、小規模ながらDDDの主要な概念を実装しています：

- ✅ レイヤー分離
- ✅ 依存性逆転
- ✅ ドメインモデルの純粋性
- ✅ ユースケース駆動の設計
- ✅ 包括的なテストカバレッジ

学習目的としてDDDの実践的な理解に役立つ実装となっています。

