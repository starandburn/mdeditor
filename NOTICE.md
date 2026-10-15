# NOTICE

## 原作情報

- 原作名：かんたんmdくん
- 原作者：phys_ken
- 原作リポジトリ：https://github.com/phys-ken/2024informatics_ic
- 原作エディタ：https://phys-ken.github.io/2024informatics_ic/tools/markdown_edit/
- 原作ライセンス：GNU General Public License v3（GNU GPL v3）

作者によるライセンス説明：
https://note.com/phys_ken/n/n467cd1b13577

## 改変版の目的

原作のMarkdownエディタ部分を独立したGitリポジトリで管理し、教材用Markdownエディタとして学習・演習に利用することを目的とします。

## 改変履歴

- 2026-10-15：原作のMarkdownエディタを独立したGitリポジトリとして管理開始。これはコードの機能変更を意味しません。

## 外部ライブラリ

以下のライブラリをCDN経由で利用しています。ライブラリ本体はこのリポジトリに同梱していません。

### marked

- 正式名称：marked
- 利用バージョン：2.0.3
- ライセンス：MIT
- 著作権表示：対象バージョンの正確な表示は未確認
- 公式リポジトリ：https://github.com/markedjs/marked
- ライセンス本文：https://github.com/markedjs/marked/blob/master/LICENSE.md

### highlight.js

- 正式名称：highlight.js
- 利用バージョン：11.7.0
- ライセンス：BSD 3-Clause License
- 著作権表示：Copyright (c) 2006, Ivan Sagalaev.
- 公式リポジトリ：https://github.com/highlightjs/highlight.js
- ライセンス本文：https://github.com/highlightjs/highlight.js/blob/main/LICENSE

### MathJax

- 正式名称：MathJax
- 利用バージョン：3（CDN URLは`@3`指定で、具体的な3.xバージョンは未指定）
- ライセンス：Apache License 2.0
- 著作権表示：利用中の具体的配布物に含まれる表示は未確認
- 公式リポジトリ：https://github.com/mathjax/MathJax
- ライセンス本文：https://www.apache.org/licenses/LICENSE-2.0

### jsPDF

- 正式名称：jsPDF
- 利用バージョン：2.5.1
- ライセンス：MIT License
- 著作権表示：Copyright (c) 2010-2021 James Hall; Copyright (c) 2015-2021 yWorks GmbH
- 公式リポジトリ：https://github.com/parallax/jsPDF
- ライセンス本文：https://github.com/parallax/jsPDF/blob/v2.5.1/LICENSE

### html2pdf.js

- 正式名称：html2pdf.js
- 利用バージョン：0.10.1
- ライセンス：MIT License
- 著作権表示：Copyright (c) 2017 Erik Koopmans
- 公式リポジトリ：https://github.com/eKoopmans/html2pdf.js
- ライセンス本文：https://github.com/eKoopmans/html2pdf.js/blob/v0.10.1/LICENSE

### mammoth.js

- 正式名称：mammoth.js
- 利用バージョン：1.4.14
- ライセンス：BSD 2-Clause License
- 著作権表示：Copyright (c) 2013, Michael Williamson
- 公式リポジトリ：https://github.com/mwilliamson/mammoth.js
- ライセンス本文：https://github.com/mwilliamson/mammoth.js/blob/master/LICENSE

## 未確認事項

以下は、今回の調査時点で対象配布物を直接確認できていない事項です。未確認情報を推測で補完していません。

- marked 2.0.3の正確な著作権表示
- MathJaxの具体的な3.xバージョンとNOTICEの内容
- html2pdf.jsのバンドル内依存ライセンス
- mammoth.js 1.4.14の対象配布物に含まれる依存ライセンス

## 改変履歴（追記）

- 2026-10-15：表示タイトルを「かんたんmdくん for NKK」に変更し、左ペインのMarkdownチートシートを削除しました。既存機能の整理であり、Markdown編集・プレビュー等の機能変更を目的としたものではありません。
- 2026-10-15：改変版の初期バージョンを1.0.0とし、画面にヘッダーとフッターを追加しました。原作の機能や著作権表示を変更するものではありません。
- 2026-10-15：改変版を1.0.1とし、編集ペインの左右外側およびペイン間に8pxの余白を追加しました。表示上の微調整であり、編集機能の変更を意味しません。
- 2026-10-15：改変版を1.0.2とし、編集ペインに「マークダウン入力」と「プレビュー」の見出しを追加し、入力欄のプレースホルダーを削除しました。編集機能の変更を意味しません。
- 2026-10-15：1.0.2のレイアウト調整として、入力ペインをダークテーマ、プレビューペインをライトテーマに分離しました。バージョン番号は変更していません。
- 2026-10-15：改変版を1.1.0とし、空白可視化、Tabによるインデント入力、Shift+Tabによるインデント解除の試作機能を追加しました。
- 2026-10-15：改変版を1.1.1とし、Markdownの通常改行をCommonMark準拠の段落内改行として扱うよう修正しました。
- 2026-10-15：Version 1.1.1の修正として、空白可視化オーバーレイの末尾スクロール領域とスクロール位置同期を調整しました。
- 2026-10-15：改変版を1.1.2とし、Markdown表に罫線、セル余白、ヘッダー背景を追加して視認性を改善しました。
- 2026-10-15：改変版を1.2.0とし、Markdown入力欄とプレビュー欄のスクロール同期機能を追加しました。
