"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownReplacer = void 0;
const tslib_1 = require("tslib");
const fast_deep_equal_1 = tslib_1.__importDefault(require("fast-deep-equal"));
const remark_1 = tslib_1.__importDefault(require("remark"));
const removePositionals = (o) => {
    switch (Object.prototype.toString.apply(o)) {
        case "[object Object]":
            const { position, ...rest } = o;
            return Object.keys(rest).reduce((acc, k) => {
                acc[k] = removePositionals(rest[k]);
                return acc;
            }, {});
        case "[object Array]":
            return o.map((el) => removePositionals(el));
        default:
            return o;
    }
};
const findAndReplace = (full, searchFor, replaceWith) => {
    if (fast_deep_equal_1.default(full, searchFor)) {
        return replaceWith;
    }
    switch (Object.prototype.toString.apply(full)) {
        case "[object Object]":
            return Object.keys(full).reduce((acc, k) => {
                acc[k] = findAndReplace(full[k], searchFor, replaceWith);
                return acc;
            }, {});
        case "[object Array]":
            return full.map((el) => findAndReplace(el, searchFor, replaceWith));
        default:
            return full;
    }
};
const remark = remark_1.default()
    .data("settings", {
    commonmark: true,
    emphasis: "*",
    strong: "*",
});
function parse(input) {
    return removePositionals(remark.parse(input));
}
/**
 * findAndReplace "searchFor" with "replaceWith" in "source".
 * This is an quick hack, so matcher is a bit dumb. To make
 * things work, it's best to use to the smallest possible
 * snippet of text to replace. Specifically, it's best to use
 * not use list items, unless the whole list is being replaced.
 *
 * @param source  the markdown string to operate upon
 * @param searchFor  the markdown snippet to searchFor
 * @param replaceWith  the markdown snippet to replaceWith
 */
function markdownReplacer(source, searchFor, replaceWith) {
    const newAst = findAndReplace(parse(source), parse(searchFor).children, parse(replaceWith).children);
    return remark.stringify(newAst);
}
exports.markdownReplacer = markdownReplacer;
//# sourceMappingURL=markdown-replacer.js.map