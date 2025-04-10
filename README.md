# vscode-edgemotion

vscode-edgemotion は haya14busa さんの [vim-edgemotion](https://github.com/haya14busa/vim-edgemotion) を vscode 向けに移植したものです。

## Features

コードの端に移動するコマンド `vscode-edgemotion.Motion` と `vscode-edgemotion.MotionBackward` を提供します。

## Settings

`ctrl+j`, `ctrl+k` でそれぞれ次のエッジ、前のエッジに移動するには次のように keybindings.json を設定します。

```json
    {
        "key": "ctrl+j",
        "command": "vscode-edgemotion.MoveToNextEdge",
        "when": "editorTextFocus && !inDebugRepl"
    },
    {
        "key": "ctrl+k",
        "command": "vscode-edgemotion.MoveToPreviousEdge",
        "when": "editorTextFocus && !inDebugRepl"
    },
```
