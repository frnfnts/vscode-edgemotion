=============================
Japanese version
=============================
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

=============================
English version
=============================
# vscode-edgemotion


vscode-edgemotion is a port of [vim-edgemotion](https://github.com/haya14busa/vim-edgemotion) by haya14busa for Visual Studio Code.

## Features


Provides commands `vscode-edgemotion.Motion` and `vscode-edgemotion.MotionBackward` to move to the edge of the code.

## Settings


To move to the next edge or the previous edge using `ctrl+j` and `ctrl+k`, configure your `keybindings.json` as follows:

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
