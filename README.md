# 電卓アプリ (Calculator App)

Nuxt3とTypeScriptで作成されたモダンなブラウザベースの電卓アプリケーションです。**ドメイン駆動設計（DDD）**アーキテクチャとTDD（テスト駆動開発）アプローチで開発されています。

## 特徴

### 機能面
- ✨ **モダンなUI**: フラットデザインで洗練された見た目
- 🎨 **レスポンシブデザイン**: モバイルからデスクトップまで対応
- ⌨️ **キーボード操作対応**: マウスとキーボードの両方で操作可能
- 🧮 **基本的な四則演算**: 加算、減算、乗算、除算
- 🔢 **小数点計算**: 小数の計算にも対応
- 🔄 **リアルタイム計算**: フロントエンドで即座に計算

### アーキテクチャ面
- 🏗️ **DDDアーキテクチャ**: ドメイン駆動設計による明確なレイヤー分離
- 🎯 **SOLID原則**: 保守性と拡張性の高い設計
- 🧪 **高品質**: 包括的なテストカバレッジ（72テスト - ユニット、コンポーネント、E2E）
- 🔀 **依存性注入**: テスタブルで柔軟なアーキテクチャ

## 技術スタック

- **フレームワーク**: Nuxt 3
- **言語**: TypeScript
- **アーキテクチャ**: Domain-Driven Design (DDD)
- **テスティング**: 
  - Vitest（ユニット・コンポーネントテスト）
  - Playwright（E2Eテスト）
- **スタイリング**: CSS（スコープド）

## DDDアーキテクチャ

このアプリケーションは4つの明確なレイヤーで構成されています：

```
┌─────────────────────────────────┐
│   Presentation Layer (UI)       │  ← components/ + composables/
├─────────────────────────────────┤
│   Application Layer             │  ← use-cases/ + dto/
├─────────────────────────────────┤
│   Domain Layer (Core)           │  ← entities/ + value-objects/
├─────────────────────────────────┤
│   Infrastructure Layer          │  ← repositories/
└─────────────────────────────────┘
```

詳細は [DDD_ARCHITECTURE.md](./DDD_ARCHITECTURE.md) を参照してください。

## セットアップ

### 前提条件

- Node.js 18.x 以上
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install

# Playwrightブラウザのインストール（E2Eテスト用）
npx playwright install
```

## 使い方

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてください。

### プロダクションビルド

```bash
# ビルド
npm run build

# プレビュー
npm run preview
```

### 静的サイト生成

```bash
npm run generate
```

## テスト

このプロジェクトはTDD（テスト駆動開発）で開発されており、包括的なテストカバレッジを持っています。

### ユニットテスト & コンポーネントテスト

```bash
# テストの実行
npm test

# ウォッチモードでテストを実行
npm run test:watch

# テストカバレッジの表示
npm run test:coverage

# UIモードでテストを実行
npm run test:ui
```

### E2Eテスト

```bash
# E2Eテストの実行
npm run test:e2e

# UIモードでE2Eテストを実行
npm run test:e2e:ui
```

### テストカバレッジ

#### DDDレイヤーテスト
- **ドメイン層テスト**: 35テスト
  - Calculation Entity: 16テスト
  - Value Objects: 19テスト
- **アプリケーション層テスト**: 9テスト
  - Use Cases: 9テスト

#### 統合テスト
- **コンポーネントテスト**: 13テスト（UI操作、キーボード入力）
- **E2Eテスト**: 21テスト（実際のブラウザでの動作確認）

#### レガシーコードテスト
- **ユニットテスト**: 15テスト（移行前の実装、参考用）

**合計**: 93テスト（全て成功）

## 操作方法

### マウス操作

- 数字ボタン（0-9）をクリック
- 演算子ボタン（+、-、×、÷）をクリック
- 小数点ボタン（.）をクリック
- イコールボタン（=）で計算実行
- クリアボタン（C）でリセット

### キーボード操作

- **数字**: `0-9` キー
- **演算子**: `+`, `-`, `*`, `/` キー
- **小数点**: `.` または `,` キー
- **計算実行**: `Enter` または `=` キー
- **クリア**: `Escape` または `C` キー

## 機能詳細

### 計算機能

- 基本的な四則演算（+、-、×、÷）
- 小数点計算
- 連続計算（計算結果を次の計算に使用）
- ゼロ除算のエラーハンドリング
- 浮動小数点誤差の丸め処理

### UI/UX

- フラットデザインのボタン
- ボタン押下時の視覚的フィードバック（影が消える）
- ホバー効果
- レスポンシブレイアウト
- グラデーション背景

### 状態管理

- キャッシュなし（リセットでクリア）
- リロードで状態がリセット
- クリアボタンで初期状態に戻る

## プロジェクト構造

```
Calculator/
├── src/                         # DDDレイヤー構造
│   ├── domain/                  # ドメイン層
│   │   ├── entities/            # エンティティ
│   │   │   └── Calculation.ts
│   │   ├── value-objects/       # バリューオブジェクト
│   │   │   ├── Operator.ts
│   │   │   ├── DisplayValue.ts
│   │   │   └── CalculationResult.ts
│   │   └── repositories/        # リポジトリインターフェース
│   │       └── ICalculationRepository.ts
│   ├── application/             # アプリケーション層
│   │   ├── use-cases/           # ユースケース
│   │   │   ├── InputNumberUseCase.ts
│   │   │   ├── InputOperatorUseCase.ts
│   │   │   ├── CalculateUseCase.ts
│   │   │   └── ClearCalculationUseCase.ts
│   │   └── dto/                 # データ転送オブジェクト
│   │       └── CalculationDTO.ts
│   ├── infrastructure/          # インフラ層
│   │   └── repositories/
│   │       ├── InMemoryCalculationRepository.ts
│   │       └── CalculationRepositoryFactory.ts
│   └── presentation/            # プレゼンテーション層
│       └── composables/
│           └── useCalculator.ts
├── components/
│   └── Calculator.vue           # UIコンポーネント
├── tests/
│   └── e2e/
│       └── calculator.spec.ts   # E2Eテスト
├── utils/                       # レガシーコード（参考用）
│   └── calculator.ts
├── DDD_ARCHITECTURE.md          # アーキテクチャ設計書
├── nuxt.config.ts
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

## 開発手法

このプロジェクトはTDD（テスト駆動開発）アプローチで開発されています：

1. **Red**: まずテストを書く
2. **Green**: テストをパスする最小限のコードを書く
3. **Refactor**: コードをリファクタリング

テストファーストのアプローチにより、高品質で保守性の高いコードを実現しています。

## ライセンス

ISC

## 作者

三菱CC研究会 AgileForge Team

