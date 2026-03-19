# Groove Match - AWSアカウント設計

## 1. 概要・マルチアカウント採用理由

現在はシングルAWSアカウント内でdev/staging/prodの3環境を運用しているが、プロジェクトの成長・セキュリティ要件・運用品質向上を目的として、**AWS Organizationsを活用したマルチアカウント構成**への移行を採用する。

### シングルアカウント構成の課題

| 課題 | 内容 |
|------|------|
| **爆発半径（Blast Radius）** | dev環境での誤操作（誤ったリソース削除、IAM権限変更など）がprod環境に影響するリスクがある |
| **請求の可視化** | 環境ごとのコストが混在し、どの環境でいくら使っているか把握しにくい |
| **IAM管理の複雑さ** | 全環境が同一アカウント内にあるため、IAMポリシーで環境を区別するロジックが複雑になる |
| **コンプライアンス準備** | 将来的な監査・規制対応のため、本番環境の分離が求められる場合がある |

### マルチアカウント移行のメリット

| メリット | 説明 |
|----------|------|
| **爆発半径の隔離** | dev/stagingでの操作がprodアカウントに一切影響しない。アカウント境界が物理的な安全柵になる |
| **請求の分離** | アカウントごとの請求が明確になる。コスト配分タグと組み合わせることで環境別コストを正確に把握できる |
| **IAMの簡素化** | 各アカウント内のIAMポリシーはそのアカウントのリソースのみを対象にすれば良く、環境分岐ロジックが不要になる |
| **コンプライアンス準備** | 本番アカウントをSCPで厳格に保護でき、将来的な監査対応が容易になる |
| **最小権限の徹底** | 開発者はdevアカウントにのみ広い権限を持ち、prodアカウントへのアクセスは必要最小限に制限できる |

> **スモールチーム向けの現実解**: マルチアカウントは「大企業のもの」というイメージがあるが、AWS OrganizationsとIAM Identity Centerにより、小規模チームでも管理コストを抑えて導入できる。アカウント追加費用は無料。

---

## 2. アカウント構成

### アカウント一覧

| アカウント名 | 用途 | ワークロード | 備考 |
|------------|------|------------|------|
| **management** | Organizations管理、請求一括管理 | なし（ワークロードを持たない） | 旧シングルアカウントがこれになる |
| **dev** | 開発・実験環境 | API、DB、インフラ一式 | 開発者が自由に使える環境 |
| **staging** | 本番前確認環境 | API、DB、インフラ一式 | 本番相当のテスト実施 |
| **prod** | 本番環境 | API、DB、インフラ一式 | SCPで厳格に保護 |

### アカウント命名規則

```
groove-match-management
groove-match-dev
groove-match-staging
groove-match-prod
```

### 現行コスト参考（移行後の想定）

| 環境 | 現在 | 移行後（想定） |
|------|------|--------------|
| prod | ¥46,000/月 | ¥46,000/月（変化なし） |
| staging | ¥7,000/月相当 | ¥7,000/月相当 |
| dev | ¥7,100/月相当 | ¥7,100/月相当 |
| **合計** | **¥60,100/月** | **¥60,100/月**（アカウント分離によるコスト増なし） |

---

## 3. Organizations設計

### OU（Organizational Unit）構成

```
Root
├── Management OU
│   └── groove-match-management (アカウント)
└── Workloads OU
    ├── dev (アカウント)
    ├── staging (アカウント)
    └── prod (アカウント)
```

### OU設計の考え方

| OU | 配置アカウント | 目的 |
|----|-------------|------|
| **Management OU** | management | 請求・Organizations管理。SCPによる保護が異なるため分離 |
| **Workloads OU** | dev, staging, prod | ワークロードを持つアカウント群。環境ごとに個別SCPを付与 |

### SCP（Service Control Policy）設計

SCPはアカウントやOUに適用するガードレールポリシー。IAMポリシーと組み合わせて「IAMで許可されていても、SCPで禁止されていれば実行できない」という二重防護になる。

#### prod アカウントに適用するSCP例

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyVPCDeletion",
      "Effect": "Deny",
      "Action": [
        "ec2:DeleteVpc",
        "ec2:DeleteSubnet",
        "ec2:DeleteInternetGateway",
        "ec2:DeleteRouteTable"
      ],
      "Resource": "*"
    },
    {
      "Sid": "DenyRDSDeletion",
      "Effect": "Deny",
      "Action": [
        "rds:DeleteDBInstance",
        "rds:DeleteDBCluster",
        "rds:DeleteDBSubnetGroup"
      ],
      "Resource": "*"
    },
    {
      "Sid": "DenyLeaveOrganization",
      "Effect": "Deny",
      "Action": "organizations:LeaveOrganization",
      "Resource": "*"
    },
    {
      "Sid": "DenyDisableCloudTrail",
      "Effect": "Deny",
      "Action": [
        "cloudtrail:DeleteTrail",
        "cloudtrail:StopLogging",
        "cloudtrail:UpdateTrail"
      ],
      "Resource": "*"
    },
    {
      "Sid": "DenyS3BucketDeletion",
      "Effect": "Deny",
      "Action": [
        "s3:DeleteBucket"
      ],
      "Resource": "*"
    }
  ]
}
```

#### 全Workloads OUに適用するSCP例

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyRegionRestriction",
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "aws:RequestedRegion": [
            "ap-northeast-1",
            "us-east-1"
          ]
        }
      }
    }
  ]
}
```

> `us-east-1` は IAM、CloudFront など一部グローバルサービスがここを使うため許可リストに含める。

---

## 4. IAM設計

### 基本方針

| 方針 | 内容 |
|------|------|
| **人間のアクセス** | IAM Identity Center（旧 AWS SSO）で一元管理。長期アクセスキーは発行しない |
| **CI/CDのアクセス** | GitHub OIDC認証でIAMロールを引き受ける。長期アクセスキーは発行しない |
| **MFA** | 全ての人間ユーザーに必須 |
| **最小権限** | 環境ごとに必要最小限の権限セットを定義 |

### IAM Identity Center 構成

```
IAM Identity Center (management アカウントで管理)
├── ユーザー/グループ管理（IDプロバイダー: IAM Identity Center組み込み、または外部IdP）
└── Permission Sets（権限セット）
    ├── AdminAccess        → management アカウントのみ
    ├── PowerUserAccess    → dev アカウント
    ├── ReadOnlyAccess     → staging アカウント
    └── ProductionDeploy   → prod アカウント（限定的な権限）
```

### Permission Set 定義

| Permission Set | 対象アカウント | 権限内容 | 用途 |
|--------------|-------------|---------|------|
| **AdminAccess** | management | AWS管理ポリシー: `AdministratorAccess` | Organizations・請求管理のみ。日常業務では使わない |
| **PowerUserAccess** | dev | AWS管理ポリシー: `PowerUserAccess` | 開発者が自由に開発・実験できる権限。IAM管理を除く |
| **ReadOnlyAccess** | staging | AWS管理ポリシー: `ReadOnlyAccess` | stagingの確認・監視用。デプロイはCI/CD経由のみ |
| **ProductionDeploy** | prod | カスタムポリシー（後述） | 緊急対応・ログ確認など最小限の操作のみ |

#### ProductionDeploy カスタムポリシー例

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:GetLogEvents",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams",
        "cloudwatch:GetMetricData",
        "cloudwatch:ListMetrics",
        "ec2:DescribeInstances",
        "ecs:DescribeServices",
        "ecs:DescribeTasks",
        "ecs:ListTasks",
        "rds:DescribeDBInstances",
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": "*"
    }
  ]
}
```

### GitHub OIDC設定

CI/CDでAWSリソースを操作する際、アクセスキーを発行せずGitHub OIDCを使ってIAMロールを一時的に引き受ける。

#### 各アカウントに作成するIAMロール

| アカウント | IAMロール名 | 権限 | 用途 |
|----------|-----------|------|------|
| dev | `github-actions-deploy-dev` | CloudFormation、ECR、ECS操作 | dev環境へのデプロイ |
| staging | `github-actions-deploy-staging` | CloudFormation、ECR、ECS操作 | staging環境へのデプロイ |
| prod | `github-actions-deploy-prod` | CloudFormation、ECR、ECS操作（SCPの範囲内） | prod環境へのデプロイ |

#### IAMロールの信頼ポリシー例（prod用）

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<prod-account-id>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:groove-match-org/groove-match:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

> `ref:refs/heads/main` と限定することで、mainブランチからのワークフローのみがprod環境へのデプロイを実行できる。

#### GitHub Actionsワークフロー例

```yaml
jobs:
  deploy-prod:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS Credentials (prod)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::<prod-account-id>:role/github-actions-deploy-prod
          aws-region: ap-northeast-1

      - name: Deploy CloudFormation Stack
        run: |
          aws cloudformation deploy \
            --template-file infra/prod/template.yaml \
            --stack-name groove-match-prod \
            --capabilities CAPABILITY_IAM
```

---

## 5. 本番保護策

prod環境を誤操作・不正操作から守るための多層防護。

### 保護策一覧

| 保護策 | 手段 | 効果 |
|--------|------|------|
| **SCPによるデストラクティブ操作の禁止** | Organizations SCP | VPC削除・RDS削除・S3バケット削除をIAM権限に関わらず禁止 |
| **GitHub OIDCのブランチ制限** | 信頼ポリシーの`sub`条件 | mainブランチのワークフローのみがprodへデプロイ可能 |
| **CloudTrailの全アカウント有効化** | CloudFormationで全アカウントに設定 | 全APIコールを記録。SCP上で無効化も禁止 |
| **RDS削除保護** | CloudFormationテンプレートのプロパティ | `DeletionProtection: true` でRDSインスタンス・クラスターを誤削除から保護 |
| **S3バージョニング＋MFA削除** | S3バケット設定 | データの誤削除・改ざんへの保護 |
| **CloudFormationスタック保護** | StackPolicy | スタックの誤った更新・削除からリソースを保護 |

### CloudFormation RDS削除保護設定例

```yaml
# prod/rds.yaml の一部
Resources:
  GrooveMatchDB:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: groove-match-prod
      DeletionProtection: true      # 削除保護
      MultiAZ: true
      # ... その他プロパティ
    DeletionPolicy: Retain           # CFnスタック削除時もDBは残す
```

### CloudFormation スタックポリシー例

```json
{
  "Statement": [
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": [
        "Update:Replace",
        "Update:Delete"
      ],
      "Resource": "LogicalResourceId/GrooveMatchDB"
    }
  ]
}
```

---

## 6. ネットワーク分離

### VPC CIDR設計

環境間でVPCピアリングは行わず、完全に分離した独立ネットワークとして設計する。

| アカウント | VPC CIDR | 用途 |
|----------|---------|------|
| dev | `10.0.0.0/16` | 開発環境（現行と同じCIDR） |
| staging | `10.1.0.0/16` | ステージング環境 |
| prod | `10.2.0.0/16` | 本番環境 |

> 将来的にVPCピアリングやTransit Gatewayが必要になった場合でもCIDRが重複しないよう、あらかじめ異なるレンジを割り当てる。

### サブネット設計（全環境共通レイアウト）

各VPCは2AZ（ap-northeast-1a / ap-northeast-1c）に展開し、以下の構成を持つ。

#### dev アカウント（10.0.0.0/16）

| サブネット名 | CIDR | AZ | 種別 |
|------------|------|-----|------|
| public-subnet-1a | 10.0.0.0/24 | ap-northeast-1a | パブリック（ALB用） |
| public-subnet-1c | 10.0.1.0/24 | ap-northeast-1c | パブリック（ALB用） |
| private-app-1a | 10.0.10.0/24 | ap-northeast-1a | プライベート（ECS/EC2） |
| private-app-1c | 10.0.11.0/24 | ap-northeast-1c | プライベート（ECS/EC2） |
| private-db-1a | 10.0.20.0/24 | ap-northeast-1a | プライベート（RDS） |
| private-db-1c | 10.0.21.0/24 | ap-northeast-1c | プライベート（RDS） |

#### staging アカウント（10.1.0.0/16）

| サブネット名 | CIDR | AZ | 種別 |
|------------|------|-----|------|
| public-subnet-1a | 10.1.0.0/24 | ap-northeast-1a | パブリック |
| public-subnet-1c | 10.1.1.0/24 | ap-northeast-1c | パブリック |
| private-app-1a | 10.1.10.0/24 | ap-northeast-1a | プライベート |
| private-app-1c | 10.1.11.0/24 | ap-northeast-1c | プライベート |
| private-db-1a | 10.1.20.0/24 | ap-northeast-1a | プライベート |
| private-db-1c | 10.1.21.0/24 | ap-northeast-1c | プライベート |

#### prod アカウント（10.2.0.0/16）

| サブネット名 | CIDR | AZ | 種別 |
|------------|------|-----|------|
| public-subnet-1a | 10.2.0.0/24 | ap-northeast-1a | パブリック |
| public-subnet-1c | 10.2.1.0/24 | ap-northeast-1c | パブリック |
| private-app-1a | 10.2.10.0/24 | ap-northeast-1a | プライベート |
| private-app-1c | 10.2.11.0/24 | ap-northeast-1c | プライベート |
| private-db-1a | 10.2.20.0/24 | ap-northeast-1a | プライベート |
| private-db-1c | 10.2.21.0/24 | ap-northeast-1c | プライベート |

### 環境間の通信

```
[dev アカウント VPC]  ←  VPCピアリングなし  →  [prod アカウント VPC]
        ↑                                              ↑
    完全分離                                         完全分離
        ↓                                              ↓
[staging アカウント VPC]  ←  VPCピアリングなし  →  [prod アカウント VPC]
```

**環境間で通信が必要な場合**はVPCピアリングではなく、APIエンドポイントを経由する設計とする（将来的な要件が発生した場合に検討）。

---

## 7. コスト管理

### 一括請求（Consolidated Billing）

AWS OrganizationsのConsolidated Billingにより、全アカウントの請求がmanagementアカウントに集約される。

| メリット | 内容 |
|----------|------|
| **ボリュームディスカウント** | 全アカウント合計の使用量でAWSの料金ティアが適用される |
| **請求の一元管理** | クレジットカード登録が1か所で済む |
| **アカウント別コスト確認** | Cost Explorerで各アカウントのコストをドリルダウン可能 |

### コスト配分タグ

全リソースに以下のタグを付与し、コスト配分タグとして登録する。

| タグキー | 値の例 | 用途 |
|---------|--------|------|
| `Environment` | `dev` / `staging` / `prod` | 環境ごとのコスト集計 |
| `Service` | `api` / `db` / `frontend` / `infra` | サービス別コスト把握 |
| `Owner` | `backend-team` / `infra-team` | チーム別コスト把握 |

#### CloudFormationテンプレートでのタグ付け例

```yaml
Resources:
  GrooveMatchECSService:
    Type: AWS::ECS::Service
    Properties:
      # ... プロパティ
      Tags:
        - Key: Environment
          Value: prod
        - Key: Service
          Value: api
        - Key: Owner
          Value: backend-team
```

### AWS Budgets設定

各アカウントにBudgetsを設定し、想定コストを超えた場合にアラートを受け取る。

| アカウント | 月次予算 | アラート閾値 | 通知先 |
|----------|---------|-----------|--------|
| dev | ¥10,000 | 80%・100% | Slackチャンネル |
| staging | ¥10,000 | 80%・100% | Slackチャンネル |
| prod | ¥55,000 | 80%・100% | Slackチャンネル + メール |
| 全体 | ¥70,000 | 80%・100% | Slackチャンネル + メール |

### 月次コストレビュープロセス

```
毎月1日
  ↓
managementアカウントのCost Explorerで先月のコストを確認
  ↓
アカウント別・サービス別・タグ別でコストを分解
  ↓
前月比で10%以上増加しているサービスがあれば原因調査
  ↓
不要リソース（開発用EC2・古いスナップショットなど）の棚卸し
  ↓
次月の予算を調整（必要に応じてBudgetsの閾値を更新）
```

---

## 8. 移行手順

シングルアカウントからマルチアカウント構成への移行ステップ。**dev → staging → prod** の順に環境を移行することでリスクを最小化する。

### 全体スケジュール

```
Week 1: 準備（Organizations設定、アカウント作成）
Week 2: IAM Identity Center・SCP設定
Week 3: dev環境のCloudFormation展開・動作確認
Week 4: staging環境のCloudFormation展開・動作確認
Week 5: prod環境の移行（メンテナンス時間を設定）
Week 6: 旧リソースのクリーンアップ・最終確認
```

### Step 1: Organizationsの有効化（現アカウント → management）

```bash
# AWSマネジメントコンソール または CLIで実施
aws organizations create-organization --feature-set ALL

# 現在のアカウントがOrganizationsのrootアカウント（management）になる
aws organizations describe-organization
```

- 現在のシングルアカウントがmanagementアカウントになる
- アカウントIDは変わらない
- 既存のリソース（dev/staging/prod）はそのまま稼働し続ける

### Step 2: メンバーアカウントの作成

```bash
# dev アカウント作成
aws organizations create-account \
  --email "aws+dev@groovematch.jp" \
  --account-name "groove-match-dev"

# staging アカウント作成
aws organizations create-account \
  --email "aws+staging@groovematch.jp" \
  --account-name "groove-match-staging"

# prod アカウント作成
aws organizations create-account \
  --email "aws+prod@groovematch.jp" \
  --account-name "groove-match-prod"
```

> アカウント作成には数分かかる。メールアドレスはアカウントごとに一意である必要がある（Gmailのエイリアス機能`+`が使用可能）。

### Step 3: OUの作成とSCPの適用

```bash
# Workloads OU の作成
ROOT_ID=$(aws organizations list-roots --query 'Roots[0].Id' --output text)

aws organizations create-organizational-unit \
  --parent-id $ROOT_ID \
  --name "Workloads"

# SCP の作成と適用（prodアカウント）
aws organizations create-policy \
  --name "ProtectProdResources" \
  --description "Deny destructive operations in prod" \
  --content file://scp-prod-protection.json \
  --type SERVICE_CONTROL_POLICY

# prodアカウントにSCPをアタッチ
aws organizations attach-policy \
  --policy-id <policy-id> \
  --target-id <prod-account-id>
```

### Step 4: IAM Identity Centerの設定

1. **有効化**: AWSマネジメントコンソール → IAM Identity Center → 有効化
2. **ユーザー作成**: チームメンバーをIAM Identity Centerに登録
3. **Permission Setの作成**: AdminAccess / PowerUserAccess / ReadOnlyAccess / ProductionDeploy
4. **アカウント割り当て**: 各ユーザー/グループに対してアカウントとPermission Setを紐付け
5. **MFAポリシーの設定**: コンソールから「MFAを必須にする」を設定

### Step 5: 各アカウントへのCloudFormationスタック展開

新アカウントに接続し、インフラのベースラインを展開する。

```bash
# IAM Identity Center でdev アカウントにログイン後
aws cloudformation deploy \
  --template-file infra/baseline/vpc.yaml \
  --stack-name groove-match-dev-vpc \
  --parameter-overrides Environment=dev VpcCidr=10.0.0.0/16 \
  --region ap-northeast-1

aws cloudformation deploy \
  --template-file infra/baseline/cloudtrail.yaml \
  --stack-name groove-match-dev-cloudtrail \
  --capabilities CAPABILITY_IAM \
  --region ap-northeast-1
```

### Step 6: ワークロードの移行（環境ごと）

#### dev 環境の移行

| 作業 | 内容 |
|------|------|
| RDSスナップショット取得 | 現アカウントのdev用RDSのスナップショットを作成 |
| スナップショットの共有 | 現アカウント → dev アカウントへスナップショットを共有 |
| dev アカウントでRDS復元 | スナップショットから新devアカウントにRDSを復元 |
| ECSサービスの展開 | dev アカウントにECSクラスター・サービスをデプロイ |
| 動作確認 | APIエンドポイント・DBを確認 |
| GitHub Actions更新 | dev環境のワークフローをdev アカウントのOIDCロールに切り替え |

#### staging 環境の移行（dev移行完了後）

dev環境と同様の手順でstagingアカウントに移行する。

#### prod 環境の移行（staging移行完了・十分な動作確認後）

```
1. メンテナンス時間を設定（深夜帯推奨、ユーザーへ事前告知）
2. アプリケーションをメンテナンスモードに変更
3. 最終RDSスナップショット取得
4. スナップショットをprod アカウントへ共有・復元
5. prod アカウントにECSサービスをデプロイ
6. DNSを新エンドポイントに切り替え（Route 53 Aレコード更新）
7. 動作確認（ヘルスチェック・主要機能のスモークテスト）
8. メンテナンスモード解除
```

### Step 7: 旧リソースのクリーンアップ

本番移行完了から **2週間** の安定稼働を確認した後、旧シングルアカウントに残っていたdev/staging/prod相当のリソースを削除する。

```
確認事項:
- [ ] 全環境で2週間以上正常稼働していること
- [ ] GitHub Actionsの全ワークフローが新アカウントで正常動作していること
- [ ] コスト請求が新アカウントに移っていること
- [ ] 旧リソースへのトラフィックがゼロであること

クリーンアップ対象:
- 旧dev用VPC・サブネット・セキュリティグループ
- 旧staging用VPC・サブネット・セキュリティグループ
- 旧prod用ECS・RDS（スナップショットは90日間保持）
- 不要になったIAMロール・ポリシー
```

---

## 参考情報

| ドキュメント | 内容 |
|------------|------|
| [AWS Organizations ユーザーガイド](https://docs.aws.amazon.com/organizations/latest/userguide/) | Organizations・OU・SCPの詳細 |
| [IAM Identity Center ユーザーガイド](https://docs.aws.amazon.com/singlesignon/latest/userguide/) | SSO・Permission Setの設定方法 |
| [GitHub OIDC with AWS](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services) | OIDCを使ったAWS認証の設定方法 |

---

*最終更新: 2026-03-18*
