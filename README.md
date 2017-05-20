# README

[ayatokura/JP-VSCode-Docs](https://github.com/ayatokura/JP-VSCode-Docs/tree/master/release-notes) に公開している、Visual Studio Code リリースノート日本語訳を Visual Studio Code で参照するための拡張機能です

## Features

**コマンドパレット** から下記のコマンドを実行することで、

`Japanese Release Note: Visual Studio Code 日本語リリースノート`

* Markdown ファイルを Markdown モードのエディタに出力
* 自動プレビュー
* プレビューの開き方をオプションにより選択可能 ( Markdown プレビューのと同様の動作: `プレビューを開く`または `プレビューを横に開く` と同じ動作)

![feature](images/japan.png)

## Requirements

リリースノートは github から取得するため、ネットワーク接続が必須となります

## Extension Settings

この拡張機能は、下記の設定項目も持っています:

* `releasenote-viewer.showPreviewToSide`: `true` or `false`

  * `true`: プレビューを横で開く
  * `false`: プレビューを開く (default)

## Known Issues

Markdown ファイルは保存されずに Untitled-* というファイル名がついたエディタに表示されます。

**Enjoy!**