//=============================================================================
// FILE: src/extension.test.ts
// AUTHOR: frnfnts
// License: MIT license
//
// TERMINOLOGY:
// - land: non-white code block.
// - shore: edge of land.
// - sea: white space.
//=============================================================================

import * as assert from 'assert';
import * as vscode from 'vscode';

import * as edgeMotion from '../extension';

const content = `0
1
  2
    3
  4
5

7       8
  8    7 9
9       8
  10 5  8   x
11

13
14
15

`;

suite("EdgeMotion", () => {
  suite("MoveToNextEdge ", () => {
    test("to the next island", async () => {
      const document = await vscode.workspace.openTextDocument({
        content: content,
      });
      const editor = await vscode.window.showTextDocument(document);

      const testCases = [
        { startLine: 1, endLine: 5, startChar: 0, endChar: 0 },
        { startLine: 2, endLine: 4, startChar: 2, endChar: 2 },
        { startLine: 3, endLine: 10, startChar: 4, endChar: 4 },
      ];

      for (const testCase of testCases) {
        // Set initial cursor position
        editor.selection = new vscode.Selection(
          0,
          0,
          testCase.startLine,
          testCase.startChar
        );
        await vscode.commands.executeCommand(
          "vscode-edgemotion.MoveToNextEdge"
        );
        assert.strictEqual(
          editor.selection.active.line,
          testCase.endLine,
          "Cursor did not move to the next edge"
        );
        assert.strictEqual(
          editor.selection.active.character,
          testCase.endChar,
          "Cursor did not move to the next edge"
        );
      }
    });

    test("to the next shore", async () => {
      const document = await vscode.workspace.openTextDocument({
        content: content,
      });
      const editor = await vscode.window.showTextDocument(document);

      const testCases = [
        { startLine: 7, endLine: 10, startChar: 8, endChar: 8 },
        { startLine: 13, endLine: 15, startChar: 0, endChar: 0 },
      ];

      for (const testCase of testCases) {
        // Set initial cursor position
        editor.selection = new vscode.Selection(
          0,
          0,
          testCase.startLine,
          testCase.startChar
        );
        await vscode.commands.executeCommand(
          "vscode-edgemotion.MoveToNextEdge"
        );
        assert.strictEqual(
          editor.selection.active.line,
          testCase.endLine,
          "Cursor did not move to the next edge"
        );
        assert.strictEqual(
          editor.selection.active.character,
          testCase.endChar,
          "Cursor did not move to the next edge"
        );
      }
    });
  });

  suite("MoveToPreviousEdge ", () => {
    test("to the previous island", async () => {
      const document = await vscode.workspace.openTextDocument({
        content: content,
      });
      const editor = await vscode.window.showTextDocument(document);

      const testCases = [
        { startLine: 5, endLine: 1, startChar: 0, endChar: 0 },
        { startLine: 4, endLine: 2, startChar: 2, endChar: 2 },
        { startLine: 10, endLine: 3, startChar: 4, endChar: 4 },
      ];

      for (const testCase of testCases) {
        // Set initial cursor position
        editor.selection = new vscode.Selection(
          0,
          0,
          testCase.startLine,
          testCase.startChar
        );
        await vscode.commands.executeCommand(
          "vscode-edgemotion.MoveToPreviousEdge"
        );
        assert.strictEqual(
          editor.selection.active.line,
          testCase.endLine,
          "Cursor did not move to the previous edge"
        );
        assert.strictEqual(
          editor.selection.active.character,
          testCase.endChar,
          "Cursor did not move to the previous edge"
        );
      }
    });

    test("to the previous shore", async () => {
      const document = await vscode.workspace.openTextDocument({
        content: content,
      });
      const editor = await vscode.window.showTextDocument(document);

      const testCases = [
        { startLine: 10, endLine: 7, startChar: 8, endChar: 8 },
        { startLine: 15, endLine: 13, startChar: 0, endChar: 0 },
      ];

      for (const testCase of testCases) {
        // Set initial cursor position
        editor.selection = new vscode.Selection(
          0,
          0,
          testCase.startLine,
          testCase.startChar
        );
        await vscode.commands.executeCommand(
          "vscode-edgemotion.MoveToPreviousEdge"
        );
        assert.strictEqual(
          editor.selection.active.line,
          testCase.endLine,
          "Cursor did not move to the previous edge"
        );
        assert.strictEqual(
          editor.selection.active.character,
          testCase.endChar,
          "Cursor did not move to the previous edge"
        );
      }
    });
  });


  test("is island", async () => {
    const document = await vscode.workspace.openTextDocument({
      content: content,
    });
    const editor = await vscode.window.showTextDocument(document);

    const islandTestCases = [
      { startLine: 1, endLine: 1, startChar: 0, endChar: 0 },
      { startLine: 2, endLine: 2, startChar: 2, endChar: 2 },
      { startLine: 10, endLine: 10, startChar: 4, endChar: 4 },
      { startLine: 10, endLine: 10, startChar: 5, endChar: 5 },
    ];

    const nonislandTestCases = [
      { startLine: 2, endLine: 2, startChar: 0, endChar: 0 },
      { startLine: 2, endLine: 2, startChar: 1, endChar: 1 },
      { startLine: 7, endLine: 7, startChar: 1, endChar: 1 },
      { startLine: 7, endLine: 7, startChar: 2, endChar: 2 },
      { startLine: 10, endLine: 10, startChar: 6, endChar: 6 },
      { startLine: 10, endLine: 10, startChar: 7, endChar: 7 },
      { startLine: 10, endLine: 10, startChar: 10, endChar: 10 },
    ];

    const highlight = (
      line: string,
      startChar: number,
    ): string => {
      return `${line.slice(0, startChar)}→${line[startChar]}←${line.slice(startChar + 1)}`;
    }

    for (const testCase of islandTestCases) {
      editor.selection = new vscode.Selection(
        0,
        0,
        testCase.startLine,
        testCase.startChar
      );

      assert.strictEqual(
        edgeMotion.island(editor, testCase.startLine, testCase.startChar),
        true,
        `island did not return true at line ${testCase.startLine} and char ${testCase.startChar}.
        ${highlight(document.lineAt(testCase.startLine).text, testCase.startChar)}
        `
      );
    }

    for (const testCase of nonislandTestCases) {
      editor.selection = new vscode.Selection(
        0,
        0,
        testCase.startLine,
        testCase.startChar
      );

      assert.strictEqual(
        edgeMotion.island(editor, testCase.startLine, testCase.startChar),
        false,
        `island did not return false at line ${testCase.startLine} and char ${testCase.startChar}`
      );
    }
  });

  test("getCharsAround", async () => {
    const testCases = [
      { line: "0123456789", col: 0, expected: ["", "0", "1"] },
      { line: "0123456789", col: 1, expected: ["0", "1", "2"] },
      { line: "0123456789", col: 2, expected: ["1", "2", "3"] },
      { line: "0123456789", col: 9, expected: ["8", "9", ""] },
      { line: "0123456789", col: 10, expected: [] },
    ];

    for (const testCase of testCases) {
      const line = testCase.line;
      const col = testCase.col;
      const expected = testCase.expected;

      const result = edgeMotion.getCharsAround(line, col);
      assert.deepStrictEqual(
        result,
        expected,
        `getCharsAround did not return expected result for line ${line} and col ${col}`
      );
    }
  });
});
