# README

[ayatokura/JP-VSCode-Docs](https://github.com/ayatokura/JP-VSCode-Docs/tree/master/release-notes) に公開している、Visual Studio Code リリースノート日本語訳を Visual Studio Code で参照するための拡張機能です。

![alt](https://raw.githubusercontent.com/ayatokura/VSCode-releasenote-viewer/master/images/contents_list.png)

本バージョンから、下記コンテンツの表示をサポートしました: 

* Japanese - Japanese Translated Release Notes
* English - Original Release Notes
* VS Code Tips and Tricks
* Awesome VS Code

> **Notes:** 未翻訳のリリースノートは、オリジナルの英語版リリースノートを表示します。

そのため、拡張機能の名前を `VSCode Release Japanese Notes Viewer` から `VSCode Release Notes Viewer` に変更しました。


## Features

**コマンドパレット** から下記のコマンドを実行することで、

`VS Code Release Note Viewer`

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

* Markdown ファイルは保存されずに Untitled-* というファイル名がついたエディタに表示されます。

## ToDo

* アイコンの変更
* 英語版 README.md 


**Enjoy!**
