tui.util.defineNamespace("fedoc.content", {});
fedoc.content["extensions_mark_markdownMarkerHelper.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Implements markdown marker helper for additional information\n * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.\n */\n\n'use strict';\n\nvar util = tui.util;\n\nvar FIND_CRLF_RX = /(\\n)|(\\r\\n)|(\\r)/g;\n\n/**\n *\n * MarkdownMarkerHelper\n * @exports MarkdownMarkerHelper\n * @constructor\n * @class\n * @param {CodeMirror} cm codemirror instance\n */\nfunction MarkdownMarkerHelper(cm) {\n    this.cm = cm;\n}\n\n/**\n * getTextContent\n * Get CRLF removed text content of CodeMirror\n * @returns {string} text content\n */\nMarkdownMarkerHelper.prototype.getTextContent = function() {\n    return this.cm.getValue().replace(FIND_CRLF_RX, '');\n};\n\n/**\n * updateMarkerWithExtraInfo\n * Update marker with extra info of CodeMirror\n * @param {object} marker marker\n * @returns {object} marker\n */\nMarkdownMarkerHelper.prototype.updateMarkerWithExtraInfo = function(marker) {\n    var foundCursor, startCh, startLine, endCh, endLine, info;\n\n    foundCursor = this._findOffsetCursor([marker.start, marker.end]);\n\n    startLine = foundCursor[0].line;\n    startCh = foundCursor[0].ch;\n    endLine = foundCursor[1].line;\n    endCh = foundCursor[1].ch;\n\n    info = this._getExtraInfoOfRange(startLine, startCh, endLine, endCh);\n\n    marker.text = info.text.replace(FIND_CRLF_RX, ' ');\n    marker.top = info.top;\n    marker.left = info.left;\n    marker.height = info.height;\n\n    return marker;\n};\n\n/**\n * _getExtraInfoOfRange\n *  Get additional info of range\n * @param {number} startLine start line\n * @param {number} startCh start offset\n * @param {number} endLine end line\n * @param {number} endCh end offset\n * @returns {object} information\n */\nMarkdownMarkerHelper.prototype._getExtraInfoOfRange = function(startLine, startCh, endLine, endCh) {\n    var text, rect, top, left, height,\n        doc = this.cm.getDoc();\n\n    if (!doc.getValue().length) {\n        top = left = height = 0;\n        text = '';\n    } else {\n        text = doc.getRange({\n            line: startLine,\n            ch: startCh\n        }, {\n            line: endLine,\n            ch: endCh\n        });\n\n        rect = this.cm.charCoords({\n            line: endLine,\n            ch: endCh\n        }, 'local');\n\n        top = rect.top;\n        left = rect.left;\n        height = rect.bottom - rect.top;\n    }\n\n    return {\n        text: text,\n        top: top,\n        left: left,\n        height: height\n    };\n};\n\n/**\n * getMarkerInfoOfCurrentSelection\n * Get marker info of current selection\n * @returns {object} marker\n */\nMarkdownMarkerHelper.prototype.getMarkerInfoOfCurrentSelection = function() {\n    var doc = this.cm.getDoc(),\n        selection, start, end, info, foundCursor;\n\n    selection = this._getSelection();\n\n    start = doc.getRange({\n        line: 0,\n        ch: 0\n    }, selection.anchor).replace(FIND_CRLF_RX, '').length;\n\n    end = start + doc.getSelection().replace(FIND_CRLF_RX, '').length;\n\n    foundCursor = this._findOffsetCursor([start, end]);\n\n    info = this._getExtraInfoOfRange(foundCursor[0].line,\n                                     foundCursor[0].ch,\n                                     foundCursor[1].line,\n                                     foundCursor[1].ch);\n\n    return {\n        start: start,\n        end: end,\n        text: info.text.replace(FIND_CRLF_RX, ' '),\n        top: info.top,\n        left: info.left,\n        height: info.height\n    };\n};\n\n/**\n * _getSelection\n * Get selection of CodeMirror, if selection is reversed then correct it\n * @returns {object} selection\n */\nMarkdownMarkerHelper.prototype._getSelection = function() {\n    var selection, head, anchor, isReversedSelection, temp;\n\n    selection = this.cm.getDoc().listSelections()[0];\n    anchor = selection.anchor;\n    head = selection.head;\n\n    isReversedSelection = (anchor.line > head.line) || (anchor.line === head.line &amp;&amp; anchor.ch > head.ch);\n\n    if (isReversedSelection) {\n        temp = head;\n        head = anchor;\n        anchor = temp;\n    }\n\n    return {\n        anchor: anchor,\n        head: head\n    };\n};\n\n/**\n * _findOffsetCursor\n * Find offset cursor by given offset list\n * @param {Array.&lt;number>} offsetlist offset list\n * @returns {Array.&lt;object>} offset cursors\n */\nMarkdownMarkerHelper.prototype._findOffsetCursor = function(offsetlist) {\n    var doc = this.cm.getDoc();\n    var currentLength = 0;\n    var beforeLength = 0;\n    var result = [];\n    var offsetIndex = 0;\n    var lineLength = doc.lineCount();\n    var lineIndex;\n\n    for (lineIndex = 0; lineIndex &lt; lineLength; lineIndex += 1) {\n        currentLength += doc.getLine(lineIndex).length;\n\n        while (currentLength >= offsetlist[offsetIndex]) {\n            result.push({\n                line: lineIndex,\n                ch: offsetlist[offsetIndex] - beforeLength\n            });\n\n            offsetIndex += 1;\n\n            if (util.isUndefined(offsetlist[offsetIndex])) {\n                return result;\n            }\n        }\n\n        beforeLength = currentLength;\n    }\n\n    while (!util.isUndefined(offsetlist[offsetIndex])) {\n        result.push({\n            line: lineIndex,\n            ch: currentLength - beforeLength\n        });\n\n        offsetIndex += 1;\n    }\n\n    return result;\n};\n\n/**\n * selectOffsetRange\n * Make selection with given offset range\n * @param {number} start start offset\n * @param {number} end end offset\n */\nMarkdownMarkerHelper.prototype.selectOffsetRange = function(start, end) {\n    var foundCursor = this._findOffsetCursor([start, end]);\n\n    this.cm.setSelection({\n        line: foundCursor[0].line,\n        ch: foundCursor[0].ch\n    }, {\n        line: foundCursor[1].line,\n        ch: foundCursor[1].ch\n    });\n};\n\n/**\n * clearSelect\n * Clear selection of CodeMirror\n */\nMarkdownMarkerHelper.prototype.clearSelect = function() {\n    var selection = this.cm.getDoc().listSelections()[0];\n\n    if (selection) {\n        this.cm.setCursor(selection.to());\n    }\n};\n\nmodule.exports = MarkdownMarkerHelper;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"