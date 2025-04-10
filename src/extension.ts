//=============================================================================
// FILE: src/extension.ts
// AUTHOR: frnfnts
// License: MIT license
//
// TERMINOLOGY:
// - land: non-white code block.
// - shore: edge of land.
// - sea: white space.
//=============================================================================

import * as vscode from "vscode";
type Direction = -1 | 1;

export function activate(context: vscode.ExtensionContext) {
  const moveToNextEdge = vscode.commands.registerCommand(
    "vscode-edgemotion.MoveToNextEdge",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      const position = editor.selection.active;
      const nextLine = findEdge(editor, position.line, 1); // Forward direction
      if (nextLine !== null) {
        const newPosition = position.with(nextLine, editor.selection.active.character);
        editor.selection = new vscode.Selection(newPosition, newPosition);
        editor.revealRange(new vscode.Range(newPosition, newPosition));
      }
    }
  );

  const moveToPreviousEdge = vscode.commands.registerCommand(
    "vscode-edgemotion.MoveToPreviousEdge",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      const position = editor.selection.active;
      const previousLine = findEdge(editor, position.line, -1); // Backward direction
      if (previousLine !== null) {
        const newPosition = position.with(previousLine, editor.selection.active.character);
        editor.selection = new vscode.Selection(newPosition, newPosition);
        editor.revealRange(new vscode.Range(newPosition, newPosition));
      }
    }
  );

  context.subscriptions.push(moveToNextEdge, moveToPreviousEdge);

}
export function deactivate() {}


export function findEdge(
  editor: vscode.TextEditor,
  startLine: number,
  direction: Direction
): number | null {
  const document = editor.document;
  const lineCount = document.lineCount;
  const island_start = island(
    editor,
    startLine,
    editor.selection.active.character
  );
  const island_next = island(
    editor,
    startLine + direction,
    editor.selection.active.character
  );
  const should_move_to_land = !(island_start && island_next);
  let line = startLine;

  if (should_move_to_land) {
    if (island_start && !island_next) {
      line += direction;
    }
    while (
      line >= 0 &&
      line < lineCount &&
      !island(editor, line, editor.selection.active.character)
    ) {
      line += direction;
    }
  } else {
    while (
      line >= 0 &&
      line < lineCount &&
      island(editor, line, editor.selection.active.character)
    ) {
      line += direction;
    }
    line -= direction;
  }

  if (line >= 0 && line < lineCount) {
    return line;
  }
  line += direction;

  return null; // Edge not found
}

// This function checks if the character at the given line and column is an island
// 1. If the character is not whitespace, it is an island
// 2. If the character is whitespace, it checks the characters before and after it
// 3. If both characters are not whitespace, it is an island
export function island(
  editor: vscode.TextEditor,
  line: number,
  vcol: number
): boolean {
  const document = editor.document;
  if (line < 0 || line >= document.lineCount) {
    return false;
  }

  const text = document.lineAt(line).text;
  if (vcol < 0 || vcol >= text.length) {
    return false;
  }

  const [left, center, right] = getCharsAround(text, vcol);
  if (!center) {
    return false;
  }
  if (!isWhite(center)) {
    return true;
  }
  if (!left || !right) {
    return false;
  }
  return !isWhite(left) && !isWhite(right);
}

function isWhite(char: string): boolean {
  return char === " " || char === "\t";
}

// This function is used to get the characters around the cursor position
// ex) if the line is "hello world" and the cursor is at index 4, it will return "o"
export function getCharsAround(line: string, vcol: number): string[] {
  const pattern = new RegExp(`^(.{${vcol}})(.)(.?)`);
  // group 0: everything before the cursor
  // group 1: the character at the cursor
  // group 2: the character after the cursor
  const match = line.match(pattern);
  if (!match) {
    return [];
  }
  return [match[1][vcol - 1] ?? "", match[2], match[3]];
}
