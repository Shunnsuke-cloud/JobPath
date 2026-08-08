# JobPath

JobPathは、就職活動中の学生が応募企業、選考状況、面接予定、締切、面接記録を一元管理するPC向け業務Webアプリケーションです。情報が複数の就活サイトやメモに分散し、次にすべきことを見失う課題を解決します。

> 本システムは、就職活動中の情報整理や比較作業を想定したPC向け業務Webアプリケーションです。推奨画面幅は1280px以上です。

## 想定ユーザーと主な機能

学生向けMVPとして、メール認証、企業CRUD（100社上限）、選考履歴、予定・締切、面接記録、企業研究、ダッシュボード、アカウント設定を提供します。予定は期限超過・3日以内を強調し、企業詳細では選考全体の情報をタブで管理します。

画面：`/login`、`/signup`、`/dashboard`、`/companies`、`/companies/new`、`/companies/[id]`、`/companies/[id]/edit`、`/schedule`、`/settings`。

## 技術・構成

- Next.js 16 / App Router / TypeScript / Tailwind CSS / shadcn/ui互換コンポーネント
- Supabase PostgreSQL / Auth / Row Level Security
- React Hook Form / Zod / Lucide React
- Vitest / Playwright
- Render Node.js Web Service（Vercelは使用しません）

ER図：`profiles → companies → { selection_events, schedules, interview_records, company_research }`。企業削除時は関連データも外部キーの `ON DELETE CASCADE` で削除されます。

## セキュリティと上限

すべてのユーザーデータ表でRLSを有効にし、`auth.uid()` と所有者IDを照合します。関連表は企業IDとユーザーIDの複合外部キーでも保護します。上限は企業100社、選考履歴・予定は1社30件、面接記録は1社10件で、UIとDBトリガーの両方で検証します。サービスロールキーをブラウザへ公開しません。

## ローカル起動

```bash
cp .env.example .env.local
npm ci
supabase link
supabase db push
npm run dev
```

`.env.local` に `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、`NEXT_PUBLIC_APP_URL=http://localhost:3000` を設定します。Supabase DashboardでEmail/Password認証を有効にし、Site URLも `http://localhost:3000` に設定してください。

## テスト

```bash
npm run test
npm run build
npm run test:e2e
```

単体テストは企業フォーム、志望度、登録上限、日時、ステータス、ダッシュボード集計を確認します。E2Eは実Supabaseを使うため、`.env.local` に既存のテストアカウント用 `E2E_EMAIL` と `E2E_PASSWORD` を設定すると、ログイン→企業作成→選考履歴→予定→編集→削除を実行します。未設定時は安全にスキップされます。Playwrightブラウザが未導入なら `npx playwright install chromium` を実行してください。

## Renderへのデプロイ

RenderでWeb Serviceを作成し、RuntimeをNode、Build Commandを `npm ci && npm run build`、Start Commandを `npm start` に設定します。Renderの環境変数へ `.env.example` の値を登録し、`NEXT_PUBLIC_APP_URL` はデプロイURLに変更します。`SUPABASE_SERVICE_ROLE_KEY` はサーバー専用処理が必要な場合のみ設定し、`NEXT_PUBLIC_` を付けません。

無料ホスティング環境のため、初回アクセス時は起動に時間がかかる場合があります。

## 今後の改善

キャリアセンター向けの集計・権限、ファイルの共有URL管理、通知、カレンダー表示、CSVエクスポート、より詳細なE2E用テストデータの自動初期化を追加予定です。
