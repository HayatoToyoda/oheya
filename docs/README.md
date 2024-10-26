# docs
ルートディレクトリ下のファイル構造を再現し、ドキュメントを保存するためのディレクトリ

## 運用
### 新しいディレクトリを作成した時
docs配下の同階層に同名のディレクトリを作成し、`README.md`ファイルを作成
テンプレートは[directory-example.md](./directory-example.md)を参照

### 新しいファイルを更新したとき
docs配下の同階層に同名のmdファイルを作成する
例）`app/hoge.tsx`を作成したなら、`docs/app/hoge.tsx.md`を作成
テンプレートは[file-example.md](./file-example.md)を参照

### ファイルを更新したとき
docs配下の同名ファイルを変更に合わせて更新。

## VSCode拡張機能
- [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)
  - マークダウン全般
- [Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid)
  - Mermaid記法のプレビューサポート
- [Mermaid Markdown Syntax Highlighting](https://marketplace.visualstudio.com/items?itemName=bpruitt-goddard.mermaid-markdown-syntax-highlighting)
  - Mermaid記法のシンタックスハイライト