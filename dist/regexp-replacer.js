"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regexpReplacer = void 0;
function regexpReplacer(source, matchAndReplace) {
    matchAndReplace.forEach(({ match, replace }) => {
        source = source.replace(match, replace);
    });
    return source;
}
exports.regexpReplacer = regexpReplacer;
//# sourceMappingURL=regexp-replacer.js.map