tui.util.defineNamespace("fedoc.content", {});
fedoc.content["wysiwygCommands_tableRemoveCol.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Implements WysiwygCommand\n * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.\n */\n\n'use strict';\n\nvar CommandManager = require('../commandManager'),\n    domUtils = require('../domUtils');\n\n/**\n * RemoveCol\n * remove Row to selected table\n * @exports RemoveCol\n * @augments Command\n * @augments WysiwygCommand\n */\nvar RemoveCol = CommandManager.command('wysiwyg', /** @lends RemoveCol */{\n    name: 'RemoveCol',\n    /**\n     *  커맨드 핸들러\n     *  @param {WysiwygEditor} wwe WYsiwygEditor instance\n     */\n    exec: function(wwe) {\n        var sq = wwe.getEditor(),\n            range = sq.getSelection().cloneRange(),\n            $cell, $nextFocus;\n\n        if (sq.hasFormat('TR') &amp;&amp; $(range.startContainer).closest('table').find('thead tr th').length > 1) {\n            sq.saveUndoState(range);\n            $cell = getCellByRange(range);\n            $nextFocus = $cell.next().length ? $cell.next() : $cell.prev();\n\n            removeColByCell($cell);\n\n            sq.focus();\n\n            focusToCell(sq, $nextFocus);\n        } else {\n            sq.focus();\n        }\n    }\n});\n\nfunction getCellByRange(range) {\n    var cell = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset);\n\n    if (domUtils.getNodeName(cell) === 'TD' || domUtils.getNodeName(cell) === 'TH') {\n        cell = $(cell);\n    } else {\n        cell = $(cell).parentsUntil('tr');\n    }\n\n    return cell;\n}\n\nfunction removeColByCell($cell) {\n    var index = $cell.index();\n\n    $cell.parents('table').find('tr').each(function(n, tr) {\n        $(tr).children().eq(index).remove();\n    });\n}\n\nfunction focusToCell(sq, $cell) {\n    var range;\n\n    if ($cell.length) {\n        range = sq.getSelection();\n        range.selectNodeContents($cell[0]);\n        range.collapse(true);\n        sq.setSelection(range);\n    }\n}\n\nmodule.exports = RemoveCol;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"