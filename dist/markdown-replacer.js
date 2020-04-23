"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepEqual = require("fast-deep-equal");
const Remark = require("remark");
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
    if (deepEqual(full, searchFor)) {
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
const remark = Remark()
    .data("settings", {
    commonmark: true,
    emphasis: "*",
    strong: "*",
});
function parse(input) {
    return removePositionals(remark.parse(input));
}
function markdownReplacer(source, searchFor, replaceWith) {
    const newAst = findAndReplace(parse(source), parse(searchFor).children, parse(replaceWith).children);
    return remark.stringify(newAst);
}
exports.markdownReplacer = markdownReplacer;
//# sourceMappingURL=markdown-replacer.js.map